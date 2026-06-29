import uuid

from pydantic import BaseModel
from datetime import datetime

class ProjectBase(BaseModel):
    project_name: str
    project_slug: uuid.UUID

    project_short_description: str | None = None
    project_description: str | None = None

    project_githubUrl: str | None = None
    project_liveUrl: str | None = None
    project_thumbnailUrl: str | None = None
    project_pictures: list[str] = []

    project_techstack: list[str] = []

    project_status: str = "published"

class ProjectGet(ProjectBase):
    project_id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = {
        'from_attributes': True
    }
    
class ProjectCreate(ProjectBase):
    pass;

class ProjectUpdate(BaseModel):
    project_name: str | None = None
    project_slug: uuid.UUID | None = None

    project_short_description: str | None = None
    project_description: str | None = None

    project_githubUrl: str | None = None
    project_liveUrl: str | None = None
    project_thumbnailUrl: str | None = None

    project_techstack: list[str] | None = None

    project_status: str | None = None
    
    
