import httpx
import os

from fastapi.responses import RedirectResponse

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL")
ALLOWED_USER = os.getenv("ALLOWED_USER")
BASE_URL = os.getenv("BASE_URL")

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
        token = token_res.json()["access_token"]

        user_res = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {token}"}
        )
        user = user_res.json()
 
        if user["login"] != ALLOWED_USER:
            return RedirectResponse(f"{FRONTEND_URL}?error=unauthorized")       
  
        response = RedirectResponse(url=f"{BASE_URL}/blogs/display/dashboard")
        response.set_cookie(
            key="session_token",
            value=token,
            httponly=True,
            samesite="lax"
        )
        
    print(f"token: {token}")
    print(f"user: {user.get('login')}")
    print(f"allowed: {ALLOWED_USER}")
        
    return response