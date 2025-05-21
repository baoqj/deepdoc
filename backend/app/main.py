from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth
from .init_db import init_db, test_db_connection_and_users_table

app = FastAPI()

# Configuration for Cross-Origin Resource Sharing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, configure specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the database tables on application startup
init_db()

# Test database connection and users table
test_db_connection_and_users_table()

# Include the authentication router with a specific prefix
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to DeepDoc Backend!"} 