import uuid

from pydantic import BaseModel, field_validator
from datetime import datetime

class ProjectBase(BaseModel):
    project_name: str
    project_slug: uuid.UUID | None = None

    project_short_description: str | None = None
    project_description: str | None = None

    project_githubUrl: str | None = None
    project_liveUrl: str | None = None
    project_thumbnailUrl: str | None = None
    project_thumbnailImageUrl: str | None = None
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
    project_thumbnailImageUrl: str | None = None
    project_pictures: list[str] | None = None

    project_techstack: list[str] | None = None

    project_status: str | None = None

    @field_validator("project_name", "project_slug", "project_techstack", "project_status")
    @classmethod
    def reject_null_required_fields(cls, value):
        if value is None:
            raise ValueError("This field cannot be null")
        return value
    
    
