from app.database import Base

from sqlalchemy import DateTime, func, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import ARRAY

from datetime import datetime

class Visitor(Base):
    
    __tablename__ = "website_visitors"
    
    visitor_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    visitor_visited_pages: Mapped[list[str]] = mapped_column(ARRAY(String))
    visitor_ip_address: Mapped[str]
    visitor_visited_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    
