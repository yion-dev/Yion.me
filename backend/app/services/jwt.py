import os

from jose import jwt
from datetime import datetime, timedelta, timezone

JWT_KEY = os.getenv("JWT_KEY") 
ALGORITHM = "HS256"

def create_token(username: str) -> str:
    payload = {
        "sub": username,
        "exp": datetime.now(timezone.utc)+ timedelta(days=7)
    }
    
    if not JWT_KEY:
        raise RuntimeError("JWT_SECRET_KEY is not set in environment")

    return jwt.encode(payload, JWT_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> str | None:
    try:
        if not JWT_KEY:
            raise RuntimeError("JWT_SECRET_KEY is not set in environment")
        
        payload = jwt.decode(token, JWT_KEY, algorithms=[ALGORITHM])
        
        return payload.get("sub")
    except:
        return None
