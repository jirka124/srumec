from fastapi import FastAPI, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from jose import JWTError, jwt
import os

# Importy z tvých modulů
from core.config import settings
from db.deps import get_db
from api import auth_routes, user_routes

# DŮLEŽITÉ: root_path="/auth" říká FastAPI, že běží za proxy s tímto prefixem.
# Díky tomu bude Swagger UI správně generovat cesty (např. /auth/openapi.json).
app = FastAPI(root_path="/auth")


# --- ZDE PŘIDÁVÁM ENDPOINT PRO NGINX ---
# include_in_schema=False zajistí, že tento technický endpoint nebude vidět v dokumentaci
@app.get("/validate", include_in_schema=False)
async def validate_token(request: Request):
    """
    Tento endpoint volá NGINX přes 'auth_request'.
    Vrací 200 OK pokud je token platný, jinak 401.
    """
    token = None
    auth_header = request.headers.get('Authorization')

    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]

    if token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token not found")

    try:
        # Pouze ověříme platnost a expiraci
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id = payload.get("id")
        user_role = payload.get("role", "user")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token or expired")

    # Pokud vše projde, vracíme 200 OK.
    from fastapi import Response
    return Response(status_code=200, headers={"X-User-Id": str(user_id),
            "X-Role": str(user_role)})


# Zahrneme tvůj existující router s login/register
app.include_router(auth_routes.router)
app.include_router(user_routes.router, prefix="/users", tags=["Users"])