from fastapi import APIRouter
from fastapi.responses import RedirectResponse

from app.services.oauth import github_login_service
from app.services.oauth import github_callback_service

router = APIRouter(
    prefix="/oauth",
    tags=["OAuth"]
)

@router.get("/github")
def github_login():
    redirectUrl = github_login_service()
    return RedirectResponse(f"{redirectUrl}")

@router.get("/github/callback")
async def github_callback(code: str) -> RedirectResponse:
    response: RedirectResponse = await github_callback_service(code=code)
    return response
