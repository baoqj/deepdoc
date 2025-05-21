from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from authlib.integrations.starlette_client import OAuth
from starlette.responses import RedirectResponse
import httpx
from pydantic import BaseModel

from app.db.session import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.schemas.user import UserCreate, UserInDB, Token, LoginSuccess
from app.models.user import User
from app.core.config import settings

router = APIRouter()

# Initialize OAuth
oauth = OAuth()

oauth.register(
    name="github",
    client_id=settings.GITHUB_CLIENT_ID,
    client_secret=settings.GITHUB_CLIENT_SECRET,
    authorize_url="https://github.com/login/oauth/authorize",
    authorize_params=None,
    access_token_url="https://github.com/login/oauth/access_token",
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri=settings.GITHUB_REDIRECT_URI,
)

@router.post("/signup", response_model=UserInDB)
def signup_user(*, db: Session = Depends(get_db), user_in: UserCreate):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this email already exists in the system.",
        )
    hashed_password = get_password_hash(user_in.password)
    db_user = User(email=user_in.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=LoginSuccess)
def login_user(*, db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer", "user": user}

# New backend endpoint to handle Google OAuth code from frontend
class OAuthCode(BaseModel):
    code: str

@router.post("/google", response_model=LoginSuccess)
async def google_auth(*, db: Session = Depends(get_db), payload: OAuthCode):
    code = payload.code
    
    # 1. Exchange code for tokens with Google
    async with httpx.AsyncClient() as client:
        try:
            token_resp = await client.post(
                'https://oauth2.googleapis.com/token',
                data={
                    'code': code,
                    'client_id': settings.GOOGLE_CLIENT_ID,
                    'client_secret': settings.GOOGLE_CLIENT_SECRET,
                    'redirect_uri': settings.GOOGLE_REDIRECT_URI,
                    'grant_type': 'authorization_code'
                }
            )
            token_resp.raise_for_status()
            token_json = token_resp.json()
            access_token = token_json['access_token']
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Token exchange failed: {e.response.text}")
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An error occurred during token exchange: {e}")

    # 2. Use access token to get user info from Google
    async with httpx.AsyncClient() as client:
        try:
            user_resp = await client.get(
                'https://openidconnect.googleapis.com/v1/userinfo',
                headers={'Authorization': f'Bearer {access_token}'}
            )
            user_resp.raise_for_status()
            userinfo = user_resp.json()
            email = userinfo.get('email')
            google_id = userinfo.get('sub')
            name = userinfo.get('name')
            picture = userinfo.get('picture')

            if not email:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No email found in Google profile")

        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"User info fetch failed: {e.response.text}")
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An error occurred during user info fetch: {e}")

    # 3. Find or create user in our database and generate JWT
    user = db.query(User).filter(User.email == email).first()
    if not user:
        db_user = User(email=email, name=name, picture=picture)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        user = db_user

    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer", "user": user}

# Keep GitHub OAuth Login/Callback routes if not switching GitHub to the new pattern yet
@router.get("/github/login")
async def github_login(request: Request):
    redirect_uri = settings.GITHUB_REDIRECT_URI
    return await oauth.github.authorize_redirect(request, redirect_uri)

@router.get("/github/callback")
async def github_callback(request: Request, db: Session = Depends(get_db)):
    token = await oauth.github.authorize_access_token(request)
    user_info = await oauth.github.get('user', token=token)
    email = user_info.json().get('email')
    name = user_info.json().get('name')
    picture = user_info.json().get('avatar_url')

    if not email:
        public_emails = await oauth.github.get('user/emails', token=token)
        for public_email_info in public_emails.json():
            if public_email_info.get('primary') and public_email_info.get('verified'):
                email = public_email_info.get('email')
                break
    
    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No public or private email found in GitHub profile")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        db_user = User(email=email, name=name, picture=picture)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        user = db_user

    access_token = create_access_token(subject=user.email)
    return RedirectResponse(url="/?token=" + access_token) 