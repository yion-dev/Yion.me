from sqlalchemy import func, select, text
from sqlalchemy.orm import Session
from app.models.visitor import Visitor
from app.services.country import lookup_country


def get_visitor_all(db: Session):
    return db.scalars(select(Visitor).order_by(Visitor.visitor_visited_at.desc())).all()


def get_visitor_count(db: Session):
    return db.scalar(select(func.count()).select_from(Visitor))


def get_visitor_country_counts(db: Session):
    # Existing databases may have more than one row per IP. Count each address once.
    unique_addresses = (
        select(
            Visitor.visitor_ip_address.label("ip"),
            func.max(Visitor.visitor_country_code).label("country_code"),
        )
        .group_by(Visitor.visitor_ip_address)
        .subquery()
    )
    rows = db.execute(
        select(unique_addresses.c.country_code, func.count().label("visitors"))
        .where(unique_addresses.c.country_code.op("~")("^[A-Z]{2}$"))
        .group_by(unique_addresses.c.country_code)
        .order_by(func.count().desc(), unique_addresses.c.country_code)
    ).all()
    return [{"country_code": code, "visitors": count} for code, count in rows]


def record_visit(ip: str, path: str, db: Session):
    # Serialize concurrent visits from one address, including the first insert.
    # Transaction-scoped locking avoids a schema migration on the existing table.
    db.execute(text("SELECT pg_advisory_xact_lock(hashtextextended(:ip, 0))"), {"ip": ip})
    visitor = db.scalar(select(Visitor).where(Visitor.visitor_ip_address == ip).order_by(Visitor.visitor_id).limit(1))
    if visitor is None:
        db.add(Visitor(visitor_ip_address=ip, visitor_country_code=lookup_country(ip), visitor_visited_pages=[path]))
    elif path not in visitor.visitor_visited_pages:
        visitor.visitor_visited_pages = [*visitor.visitor_visited_pages, path]
    if visitor is not None and visitor.visitor_country_code is None:
        visitor.visitor_country_code = lookup_country(ip)
    db.commit()


def backfill_visitor_countries(db: Session):
    visitors = db.scalars(select(Visitor).where(Visitor.visitor_country_code.is_(None))).all()
    for visitor in visitors:
        visitor.visitor_country_code = lookup_country(visitor.visitor_ip_address)
    db.commit()
