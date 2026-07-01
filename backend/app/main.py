import os

from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from app.routers import project, blog, visitor, oauth

from app.database import Base, engine, SessionLocal
from app.models.visitor import Visitor
from app.services.jwt import verify_token

ALLOWED_USER = os.getenv("ALLOWED_USER")
BASE_URL = os.getenv("BASE_URL")

app = FastAPI(
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)

app.include_router(project.router)
app.include_router(blog.router)
app.include_router(visitor.router)
app.include_router(oauth.router)

Base.metadata.create_all(bind=engine);

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

@app.middleware("http")
async def track_visitors(request: Request, call_next):
    response = await call_next(request)
    excluded = [
        "/docs",
        "/openapi.json", 
        "/redoc",
        "/favicon.ico",
        "/visitors/get-all",
        "/visitors/create",
    ]
    if request.url.path not in excluded:
        db = SessionLocal()
        try:
            ip = (
                request.headers.get("cf-connecting-ip")
                or request.headers.get("x-real-ip")
                or (request.headers.get("x-forwarded-for", "").split(",")[0].strip() or None)
                or (request.client.host if request.client else "unknown")
            )
            checkExisting = db.query(Visitor).filter(
                Visitor.visitor_ip_address == ip
            ).first()
            if checkExisting:
                if str(request.url.path) not in checkExisting.visitor_visited_pages:
                    checkExisting.visitor_visited_pages = checkExisting.visitor_visited_pages + [str(request.url.path)]
                    db.commit()
            else:
                visitor = Visitor(
                    visitor_visited_pages=[str(request.url.path)], 
                    visitor_ip_address=ip
                )
                db.add(visitor)
                db.commit()
        finally:
            db.close()
    return response

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    print(f"middleware hit: {BASE_URL}/{request.url.path}")
    
    public_routes = [
        "/",
        "/ping",
        "/visitors/get-all/count",
        "/projects/get-all",
        "/projects/get-one",
        "/blogs/get-all",
        "/blogs/get-one",
        "/auth/github",
        "/auth/github/callback",
        "/openapi.json",
        "/redoc",
        "/favicon.ico",
    ]
    
    is_public = any(
        request.url.path == route or request.url.path.startswith(route)
        for route in public_routes
    )
    
    if not is_public:
        token = request.cookies.get("session_token")
        if not token:
            return RedirectResponse(url=f"{BASE_URL}/authentication")
        
        username = verify_token(token)
        if not username or username != ALLOWED_USER:
            return RedirectResponse(url=f"{BASE_URL}/authentication")
    
    return await call_next(request)
