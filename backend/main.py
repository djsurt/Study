from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
import os
from services.supabase_client import supabase
from typing import Optional
from utils.auth import verify_jwt_token
from services.upload_service import upload_to_supabase_storage
from jose import jwt
from datetime import datetime, timedelta, timezone
import uuid
from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str

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

@app.post("/auth/signup")
async def signup(credentials: LoginRequest):
    """Create a new user in supabase"""
    try:
        response = supabase.auth.sign_up({
            "email": credentials.email,
            "password": credentials.password
        })

        if not response.user:
            raise HTTPException(status_code=400, detail="Signup failed")
        
        # Insert user into users table
        try:
            supabase.table("users").insert({
                "id": response.user.id,
                "email": response.user.email,
                "created_at": datetime.now(timezone.utc).isoformat()
            }).execute()
        except Exception as db_error:
            print(f"Warning: Failed to insert user into users table: {str(db_error)}")
            # Continue even if users table insert fails (user is already in auth)
        
        # Check if session exists (might be None if email confirmation required)
        if response.session and response.session.access_token:
            return {
                "access_token": response.session.access_token,
                "user": {
                    "id": response.user.id,
                    "email": response.user.email
                }
            }
        else:
            # Email confirmation required - return user but no token yet
            return {
                "message": "User created successfully. Please check your email to confirm your account.",
                "user": {
                    "id": response.user.id,
                    "email": response.user.email
                },
                "requires_confirmation": True
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Signup failed: {str(e)}")

@app.post("/auth/login")
async def login(credentials: LoginRequest):
    """Login with existing Supabase user"""
    try:
        response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })

        # Check if login was successful
        if not response.user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return {
            "access_token": response.session.access_token,
            "user": {
                "id": response.user.id,
                "email": response.user.email
            }
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Login failed: {str(e)}")
    

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...), 
    # current_user: dict = Depends(get_current_user)
):
    """Accept file upload from the Angular App"""
    # user_id = current_user.get("sub")
    user_id = "default_user"
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