from pydantic import BaseModel, EmailStr, constr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    username: constr(min_length=3, max_length=50)
    name: Optional[str] = None
    picture: Optional[str] = None

class UserCreate(UserBase):
    password: constr(min_length=8)
    confirm_password: constr(min_length=8)

class UserResponse(UserBase):
    id: int
    
    class Config:
        from_attributes = True

class UserInDB(UserBase):
    id: int
    is_active: bool
    is_superuser: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginSuccess(BaseModel):
    access_token: str
    token_type: str
    user: UserInDB 