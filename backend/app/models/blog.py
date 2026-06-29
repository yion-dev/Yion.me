import uuid

from app.database import Base

from datetime import datetime

from sqlalchemy import UUID, String, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column


class Blog(Base):
    __tablename__ = "blogs"
    
    blog_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4,
        index=True
    )
    blog_title: Mapped[str] = mapped_column(String(255));
    blog_smallDescription: Mapped[str] = mapped_column(String(255));
    blog_description: Mapped[str] = mapped_column(Text);
    blog_author: Mapped[str];
    
    blog_createdAt: Mapped[datetime] = mapped_column( 
        DateTime(timezone=True),
        server_default=func.now()
    ) 
    blog_updatedAt: Mapped[datetime] = mapped_column( 
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    ) 
    
