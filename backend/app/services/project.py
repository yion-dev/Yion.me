import uuid

from fastapi import Depends, HTTPException

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate

def get_project_all(db: Session):
    projects = db.query(Project).all();
    
    if not projects:
        raise HTTPException(status_code=404, detail="Project Not Found")
    
    return projects;

def get_project_one(project_id:str, db: Session):
    
    slug = None
    
    try:
        slug = uuid.UUID(project_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid UUID: {e}")

    project = db.query(Project).filter(Project.project_slug == slug).first();
    
    if not project:
        raise HTTPException(status_code=404, detail="Project Not Found");
    
    return project;
        

def post_project_create(ProjectObject: ProjectCreate, db: Session):
    project = None;
    try:
        project = Project(**ProjectObject.model_dump())
        db.add(project);
        db.commit();
        db.refresh(project);
        return project;
    except Exception as error:
        db.rollback();
        raise HTTPException(status_code=400, detail=f"{type(error).__name__}: {str(error)}");

def update_project_update(id: int, project: ProjectUpdate, db: Session):
    project_model = db.query(Project).filter(Project.project_id == id).first();
    
    try:
        for key, value in project.model_dump().items():
            setattr(project_model, key, value);
        
        db.commit();
        db.refresh(project_model); 
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"{type(error).__name__}: {str(error)}")
    
    return project;
        
def delete_project_remove(id: int, db: Session):
    project = db.query(Project).filter(Project.project_id == id).first();
    
    if not project:
        raise HTTPException(status_code=404, detail="Project Not Found");
    
    db.delete(project);
    db.commit();
    
    return {
        'message': "Project [" + str(project.project_id) + "] " + "Deleted Successfully"
    }
    
