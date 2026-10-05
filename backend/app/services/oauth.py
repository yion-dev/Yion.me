import httpx
import os
import secrets

from app.services.jwt import create_token
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi import HTTPException

from app.schemas.login import BaseModel

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL")
ALLOWED_USER = os.getenv("ALLOWED_USER")
DOMAIN_NAME = os.getenv("DOMAIN_NAME")

USERNAME = os.getenv("ADMIN_USERNAME")
PASSWORD = os.getenv("ADMIN_PASSWORD") or os.getenv("ADMIN_SECRET")

def session_cookie_options() -> dict:
    is_local = DOMAIN_NAME in {"localhost", "127.0.0.1"}
    return {
        "httponly": True,
        "samesite": "lax",
        "domain": None if is_local else DOMAIN_NAME,
        "secure": not is_local,
    }

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
            **session_cookie_options(),
        )
 
        
    return response

def login_service(username: str, password: str) -> JSONResponse:
    
    if not USERNAME or not PASSWORD or not (
        secrets.compare_digest(username.encode(), USERNAME.encode())
        and secrets.compare_digest(password.encode(), PASSWORD.encode())
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(username)

    response = JSONResponse(content={"status": "ok"})
    response.set_cookie(
        key="session_token",
        value=token,
        **session_cookie_options(),
        max_age=60 * 60 * 24 * 7
    ) 

    return response
