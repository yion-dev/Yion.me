from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.visitor import VisitorCreate

from app.services.visitor import get_visitor_all
from app.services.visitor import create_visitor


router = APIRouter(
    prefix="/visitors",
    tags=["visitors"]
)

@router.get("/get-all")
def getVisitors(dbInstance: Session = Depends(get_db)):
    return get_visitor_all(db=dbInstance)

@router.post("/create")
def createVisitor(visitorObject: VisitorCreate, dbInstance: Session = Depends(get_db)):
    return create_visitor(visitor= visitorObject, db=dbInstance)