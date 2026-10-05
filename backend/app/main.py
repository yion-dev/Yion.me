import os
from pathlib import Path

from dotenv import load_dotenv

backend_dir = Path(__file__).resolve().parents[1]
load_dotenv(backend_dir / ".env")
load_dotenv(backend_dir.parent / ".env")

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.routers import project, blog, visitor, oauth

from app.database import Base, engine, SessionLocal
from app.services.jwt import verify_token
from app.services.visitor import backfill_visitor_countries

ALLOWED_USER = os.getenv("ALLOWED_USER")

app = FastAPI(
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)

app.include_router(project.router)
app.include_router(blog.router)
app.include_router(visitor.router)
app.include_router(oauth.router)

Base.metadata.create_all(bind=engine)
with engine.begin() as connection:
    connection.execute(text("ALTER TABLE website_visitors ADD COLUMN IF NOT EXISTS visitor_country_code VARCHAR(2)"))
    connection.execute(text("ALTER TABLE blogs ADD COLUMN IF NOT EXISTS \"blog_coverImage\" TEXT"))
    connection.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS \"project_thumbnailImageUrl\" TEXT"))
with SessionLocal() as session:
    backfill_visitor_countries(session)

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    public_routes = {
        "/", "/ping", "/visitors/get-all/count", "/visitors/countries", "/visitors/track",
        "/projects/get-all", "/blogs/get-all",
        "/oauth/login", "/oauth/github", "/oauth/github/callback",
    }
    is_public = request.url.path in public_routes or any(
        request.url.path.startswith(prefix)
        for prefix in ("/projects/get-one/", "/blogs/get-one/")
    )
    if request.method != "OPTIONS" and not is_public:
        token = request.cookies.get("session_token")
        username = verify_token(token) if token else None
        allowed = {name for name in (ALLOWED_USER, os.getenv("ADMIN_USERNAME")) if name}
        if not username or username not in allowed:
            return JSONResponse(status_code=401, content={"detail": "Admin login required"})
    return await call_next(request)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://www.yiondev.me",
        "https://yiondev.me",
        "http://localhost:3000",
    ],
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)
