from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator
import re


class VisitorTrack(BaseModel):
    model_config = ConfigDict(extra="forbid")
    path: str = Field(max_length=512)

    @field_validator("path")
    @classmethod
    def public_page_only(cls, value: str) -> str:
        if not re.fullmatch(r"/(?:about|projects(?:/[A-Za-z0-9_-]+)?|blogs(?:/[A-Za-z0-9_-]+)?)?", value):
            raise ValueError("Only public portfolio page paths can be recorded")
        return value


class VisitorGet(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    visitor_id: int
    visitor_visited_pages: list[str]
    visitor_ip_address: str
    visitor_country_code: str | None
    visitor_visited_at: datetime


class VisitorCountryCount(BaseModel):
    country_code: str
    visitors: int
