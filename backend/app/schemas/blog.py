from pydantic import BaseModel
from datetime import datetime

class BlogBase(BaseModel):
    blog_title: str
    blog_smallDescription: str
    blog_description: str
    blog_author: str
 
class BlogGet(BlogBase):
    blog_id: int
    blog_createdAt: datetime
    blog_updatedAt: datetime

    class Config:
        from_attributes = True

class BlogCreate(BlogBase):
    pass

class BlogUpdate(BlogBase):
    blog_title: str | None = None
    blog_smallDescription: str | None = None
    blog_description: str | None = None
    blog_author: str | None = None
    
