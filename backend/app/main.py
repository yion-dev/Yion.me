from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.routers import project, blog, visitor
from app.database import Base, engine, SessionLocal
from app.models.visitor import Visitor

app = FastAPI()

app.include_router(project.router)
app.include_router(blog.router)
app.include_router(visitor.router)

Base.metadata.create_all(bind=engine);

app.add_middleware(
    CORSMiddleware(
        allow_origins=[]
    )
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
            
            checkExisting = db.query(Visitor).filter(
                Visitor.visitor_ip_address == request.client.host
            ).first()
            
            
            if checkExisting:
                checkExisting.visitor_visited_pages = checkExisting.visitor_visited_pages + [str(request.url.path)]
                db.commit()
                
            else:
                visitor = Visitor(
                    visitor_visited_pages=[str(request.url.path)],  # list since it's ARRAY
                    visitor_ip_address=request.client.host
                )
                db.add(visitor)
                db.commit()
                
            
        finally:
            db.close()
            
    return response
