from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.visitor import VisitorCountryCount, VisitorGet, VisitorTrack
from app.services.client_ip import request_client_ip
from app.services.visitor import get_visitor_all, get_visitor_count, get_visitor_country_counts, record_visit

router = APIRouter(prefix="/visitors", tags=["visitors"])


@router.get("/get-all/data", response_model=list[VisitorGet])
def getVisitors(response: Response, dbInstance: Session = Depends(get_db)):
    response.headers["Cache-Control"] = "no-store"
    return get_visitor_all(db=dbInstance)


@router.get("/get-all/count")
def getVisitorsCount(dbInstance: Session = Depends(get_db)):
    return get_visitor_count(db=dbInstance)


@router.get("/countries", response_model=list[VisitorCountryCount])
def getVisitorCountries(response: Response, dbInstance: Session = Depends(get_db)):
    response.headers["Cache-Control"] = "public, max-age=60"
    return get_visitor_country_counts(db=dbInstance)


@router.post("/track", status_code=204)
def trackVisitor(visit: VisitorTrack, request: Request, dbInstance: Session = Depends(get_db)):
    ip = request_client_ip(request)
    if ip is not None:
        record_visit(ip=ip, path=visit.path, db=dbInstance)
    return Response(status_code=204, headers={"Cache-Control": "no-store"})
