from fastapi import APIRouter, Depends

from app.services.project import Session
from app.services.project import get_project_one, get_project_all
from app.services.project import post_project_create
from app.services.project import update_project_update
from app.services.project import delete_project_remove
from app.services.project import ProjectCreate, ProjectUpdate

from app.database import get_db

router = APIRouter(
    prefix="/projects",
    tags=["projects"]
)

@router.get("/get-all")
def projectGetAll(db: Session = Depends(get_db)):
    return get_project_all(db=db);

@router.get("/get-one/{id}")
def projectGetOne(id: int, db: Session = Depends(get_db)):
    return get_project_one(project_id=id, db=db);

@router.post("/create")
def projectCreate(project: ProjectCreate, db: Session = Depends(get_db)):
    return post_project_create(ProjectObject=project, db=db);
 
@router.put("/update/{id}")
def projectUpdate(project_id: int, project: ProjectUpdate, db: Session = Depends(get_db)):
    return update_project_update(id=project_id, project=project, db=db);
       
@router.delete("/delete/{id}")
def projectDelete(project_id: int, db: Session = Depends(get_db)):
    return delete_project_remove(id= project_id, db=db);