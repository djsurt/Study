from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
import os
from services.supabase_client import supabase
from typing import Optional
from utils.auth import verify_jwt_token
from services.upload_service import upload_to_supabase_storage
from jose import jwt
from datetime import datetime, timedelta
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    token = authorization.split(" ")[1] if " " in authorization else authorization
    user = verify_jwt_token(token)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

@app.get("/")
async def root():
    return {"message": "Hello world"}

#Test user token generation endpoint
@app.get("/test/generate-token")
async def generate_test_token(user_id: str = str(uuid.uuid4())):
    """
    Generate a test JWT token for testing authentication.
    Usage: GET http://localhost:8000/test/generate-token?user_id=your-test-id
    """
    # Get the JWT secret from environment
    secret = os.getenv("SUPABASE_JWT_SECRET", "your-secret-key-for-testing")
    
    # Create a test payload
    payload = {
        "sub": user_id,  # Subject (user ID)
        "email": f"{user_id}@test.com",
        "role": "authenticated",
        "iat": datetime.now(datetime.timezone.utc),  # Issued at
        "exp": datetime.now(datetime.timezone.utc) + timedelta(hours=24)  # Expires in 24 hours
    }
    
    # Generate the token
    token = jwt.encode(payload, secret, algorithm="HS256")
    
    return {
        "message": "Test token generated successfully",
        "token": token,
        "user_id": user_id,
        "expires_in": "24 hours",
        "usage": f"Add this header to your requests: Authorization: Bearer {token}"
    }

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...), 
    current_user: dict = Depends(get_current_user)
):
    """Accept file upload from the Angular App"""
    user_id = current_user.get("sub")
    file_url = await upload_to_supabase_storage(file, user_id)
    
    supabase.table("materials").insert({
        "user_id": user_id,
        "filename": file.filename,
        "file_url": file_url,
        "file_type": file.content_type,
    }).execute()

    return {
        "message": "File uploaded successfully",
        "filename": file.filename,
        "url": file_url
    }