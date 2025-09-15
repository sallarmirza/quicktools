from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models import user_model
from ..schemas import user_schema
from app.database import get_db
from typing import Annotated

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

# Type alias for DB dependency
DbSession = Annotated[Session, Depends(get_db)]

@router.post("/signup", response_model=user_schema.UserResponse)
def signup(user: user_schema.UserCreate, db: DbSession):
    existing_user = db.query(user_model.User).filter(user_model.User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    new_user = user_model.User(
        username=user.username,
        email=user.email,
        password=user.password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user   # ✅ return user (matches response_model)


@router.post("/login")
def login(user: user_schema.UserLogin, db: DbSession):
    db_user = db.query(user_model.User).filter(user_model.User.username == user.username).first()
    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {
        "message": "Login successful",
        "user_id": db_user.id,
        "username": db_user.username
    }
