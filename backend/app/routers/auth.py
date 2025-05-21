from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..schemas.user import UserCreate
from ..utils.auth import get_password_hash

router = APIRouter()

@router.post("/signup")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # 检查邮箱是否已存在
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # 创建新用户
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        password=hashed_password
    )
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return {"message": "User registered successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to register user"
        ) 