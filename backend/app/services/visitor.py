from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.visitor import Visitor
from app.schemas.visitor import VisitorCreate

def get_visitor_all(db: Session):
    visitors = db.query(Visitor).all()
    return visitors

def get_visitor_count(db: Session):
    visitors = db.query(Visitor).all()
    return len(visitors)

def create_visitor(visitor: VisitorCreate,db: Session):
    visitorModel = None
    try:
        visitorModel = Visitor(**visitor.model_dump())
        db.add(visitorModel)
        db.commit()
        db.refresh(visitorModel)
        return visitorModel
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"{type(error).__name__}: {str(error)}")
