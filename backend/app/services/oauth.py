import httpx
import os

from app.services.jwt import create_token
from fastapi.responses import JSONResponse, RedirectResponse

from app.schemas.login import BaseModel

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL")
ALLOWED_USER = os.getenv("ALLOWED_USER")
DOMAIN_NAME = os.getenv("DOMAIN_NAME")

USERNAME = os.getenv("ADMIN_USERNAME")
PASSWORD = os.getenv("ADMIN_PASSWORD")

def github_login_service() -> str:
    return f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&scope=user"
    
async def github_callback_service(code: str) -> RedirectResponse:
    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            "https://github.com/login/oauth/access_token",
            json={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code
            },
            headers={"Accept": "application/json"}
        )
        githubToken = token_res.json()["access_token"]

        user_res = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {githubToken}"}
        )
        user = user_res.json()
 
        if user["login"] != ALLOWED_USER:
            return RedirectResponse(f"{FRONTEND_URL}?error=unauthorized")       
    
        token = create_token(user["login"])

        response = RedirectResponse(url=f"{FRONTEND_URL}/internal/manage/dashboard", status_code=302)
        response.set_cookie(
            key="session_token",
            value=token,
            httponly=True,
            samesite="lax",
            domain=DOMAIN_NAME,
            secure=True
        )
 
    print(f"token: {token}")
    print(f"user: {user.get('login')}")
    print(f"allowed: {ALLOWED_USER}")
        
    return response

def login_service(username: str, password: str) -> JSONResponse:
    
    if username != USERNAME and password != PASSWORD:
        RedirectResponse(url=f"{FRONTEND_URL}/forbidden", status_code=403)

    token = create_token(username)

    response = JSONResponse(content={"status": "ok"})
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        samesite="lax",
        domain=DOMAIN_NAME,
        secure=True,
        max_age=60 * 60 * 24 * 7
    ) 

    return response
