import os
import httpx

from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from app.routers import project, blog, visitor, oauth

from app.database import Base, engine, SessionLocal
from app.models.visitor import Visitor

ALLOWED_USER = os.getenv("ALLOWED_USER")
BASE_URL = os.getenv("BASE_URL")

app = FastAPI()

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
            
            if request.client:
            
                checkExisting = db.query(Visitor).filter(
                    Visitor.visitor_ip_address == request.client.host
                ).first()
                
                
                if checkExisting:
                    checkExisting.visitor_visited_pages = checkExisting.visitor_visited_pages + [str(request.url.path)]
                    db.commit()
                    
                else:
                    visitor = Visitor(
                        visitor_visited_pages=[str(request.url.path)], 
                        visitor_ip_address=request.client.host
                    )
                    db.add(visitor)
                    db.commit()
            else:
                visitor = Visitor(
                    visitor_visited_pages=["unknown"], 
                    visitor_ip_address="unknown"
                )
                    
            
        finally:
            db.close()
            
    return response

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    print(f"middleware hit: {BASE_URL}/{request.url.path}")
    if request.url.path.startswith("/blogs/display"):
        token = request.cookies.get("session_token")
        if not token:
            return RedirectResponse(url=f"{BASE_URL}/auth/github")
        async with httpx.AsyncClient() as client:
            user_res = await client.get(
                "https://api.github.com/user",
                headers={"Authorization": f"Bearer {token}"}
            )
            if user_res.status_code != 200:
                return RedirectResponse(url=f"{BASE_URL}/auth/github")
            user = user_res.json()
            if user["login"] != ALLOWED_USER:
                return RedirectResponse(url=f"{BASE_URL}/auth/github")
    return await call_next(request)