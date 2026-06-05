
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.blog import Blog
from app.schemas.blog import BlogGet, BlogCreate, BlogUpdate

def get_blog_all(db: Session):
    blogs = db.query(Blog).all();
    
    if not blogs:
        raise HTTPException(status_code=404, detail="Blogs Not Found")
    
    return blogs

def get_blog_one(id: int, db: Session):
    blog = db.query(Blog).filter(Blog.blog_id == id).first();
    
    if not blog:
        raise HTTPException(status_code=404, detail="Blog Not Found")
    
    return blog

def create_blog(blog: BlogCreate,db: Session):
    blog_model = None;
    try:
        blog_model = Blog(**blog.model_dump())
        db.add(blog_model);
        db.commit();
        db.refresh(blog_model);
        return blog_model
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"{type(error).__name__}: {str(error)}")

def update_blog(blog_id: int, blog: BlogUpdate, db: Session):
    blog_model = db.query(Blog).filter(Blog.blog_id == blog_id).first()
    
    if not blog_model:
        raise HTTPException(status_code=404, detail="Blog Not Found")
    
    try:
        for key, value in blog.model_dump().items():
            setattr(blog_model, key, value)
    
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"{type(error).__name__}: {str(error)}")

def delete_blog(blog_id: int, db: Session):
    blog_model = db.query(Blog).filter(Blog.blog_id == blog_id).first()
    
    if not blog_model:
        raise HTTPException(status_code=404, detail="Blog Not Found")
    
    db.delete(blog_model)
    db.commit()
    
    return {
        'message': "Blog [" + str(blog_model.blog_id) + "] " + "Deleted Successfully"
    }