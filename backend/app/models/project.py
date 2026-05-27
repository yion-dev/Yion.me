from sqlalchemy import String, Text, func, DateTime, ARRAY
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB
from app.database import Base
from datetime import datetime

class Project(Base):
    __tablename__ = "projects"
    
    project_id: Mapped[int] =  mapped_column(primary_key=True, index= True)
    project_name: Mapped[str] = mapped_column(String(255), nullable=False)
    project_slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    project_short_description: Mapped[str] = mapped_column(String(500))
    project_description: Mapped[str] = mapped_column(Text);
    project_githubUrl: Mapped[str | None]
    project_liveUrl: Mapped[str | None]
    project_thumbnailUrl: Mapped[str | None]
    project_pictures: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    project_techstack: Mapped[list[str]] = mapped_column(JSONB)
    project_status: Mapped[str]
    project_created_at: Mapped[datetime] = mapped_column( 
        DateTime(timezone=True),
        server_default=func.now()
    ) 
    project_updated_at: Mapped[datetime] = mapped_column( 
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    ) 