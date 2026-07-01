
from pydantic import BaseModel

from datetime import datetime

class VisitorBase(BaseModel):
    visitor_visited_pages: list[str]
    visitor_ip_address: str

class VisitorCreate(VisitorBase):
    pass

class VisitorGet(VisitorBase):
    visitor_id: int
    visitor_visited_at: datetime

    class Config:
        from_attributes = True
