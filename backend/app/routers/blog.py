from fastapi import APIRouter, Depends
from fastapi.responses import HTMLResponse

from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.blog import BlogCreate
from app.schemas.blog import BlogUpdate

from app.services.blog import get_blog_all
from app.services.blog import get_blog_one
from app.services.blog import create_blog
from app.services.blog import update_blog
from app.services.blog import delete_blog

router = APIRouter(
    prefix="/blogs",
    tags=["blogs"]
)

@router.get("/get-all")
def getAllBlog(dbInstance: Session = Depends(get_db)):
    return get_blog_all(db=dbInstance)

@router.get("/get-one/{blogID}")
def getOneBlog(blogID: str, dbInstance: Session = Depends(get_db)):
    return get_blog_one(id=blogID, db=dbInstance);

@router.post("/create")
def createBlog(blogObject: BlogCreate, dbInstance: Session = Depends(get_db)):
    return create_blog(blog=blogObject, db=dbInstance)

@router.put("/update/{blogID}")
def updateBlog(blogID: int, blogObject: BlogUpdate, dbInstance: Session = Depends(get_db)):
    return update_blog(blog_id=blogID, blog=blogObject, db=dbInstance)

@router.delete("/delete/{blogID}")
def deleteBlog(blogID: int, dbInstance: Session = Depends(get_db)):
    return delete_blog(blog_id=blogID, db=dbInstance)
    
@router.get("/display/edit")
def route_to_blog_edit_page():
    with open("/app/app/views/blog_edit.html", "r") as f:
        html = f.read()
    return HTMLResponse(content=html)

@router.get("/display/dashboard")
def route_to_blog_dashboard_page():
    with open("/app/app/views/blog_dashboard.html", "r") as f:
        html = f.read()
    return HTMLResponse(content=html)
