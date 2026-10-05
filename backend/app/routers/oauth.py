from fastapi import APIRouter
from fastapi.responses import JSONResponse, RedirectResponse

from app.services.oauth import login_service
from app.schemas.login import LoginRequest
from app.services.oauth import github_login_service
from app.services.oauth import github_callback_service

router = APIRouter(
    prefix="/oauth",
    tags=["OAuth"]
)

@router.get("/session")
def admin_session():
    # The global auth middleware validates the session before this is reached.
    return {"authenticated": True}

@router.get("/github")
def github_login():
    redirectUrl = github_login_service()
    return RedirectResponse(f"{redirectUrl}")

@router.get("/github/callback")
async def github_callback(code: str) -> RedirectResponse:
    response: RedirectResponse = await github_callback_service(code=code)
    return response

@router.post("/login")
def login_callback(code: LoginRequest) -> JSONResponse:
    response = login_service(code.username, code.password)
    return response
