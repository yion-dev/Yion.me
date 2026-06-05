from fastapi import APIRouter
from fastapi.responses import RedirectResponse, HTMLResponse

from app.services.oauth import github_login_service
from app.services.oauth import github_callback_service

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/")
def get_dashboard():
    with open("/app/app/views/dashboard.html", "r") as f:
        html = f.read()
    return HTMLResponse(content=html)

@router.get("/blogs")
def get_dashboard_blogs():
    with open("/app/app/views/blog.html", "r") as f:
        html = f.read()
    return HTMLResponse(content=html)

@router.get("/projects")
def get_dashboard_projects():
    with open("/app/app/views/project.html", "r") as f:
        html = f.read()
    return HTMLResponse(content=html)