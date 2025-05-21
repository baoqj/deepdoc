from sqlalchemy import create_engine, inspect
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .database import engine, SessionLocal, Base
from .models.user import User # Import User model to check table existence

def init_db():
    print("Attempting to create database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully (if they didn't exist).")

def test_db_connection_and_users_table():
    print("Testing database connection and users table existence...")
    try:
        # Test connection
        with engine.connect() as connection:
            print("Database connection successful.")

        # Test users table existence
        inspector = inspect(engine)
        if inspector.has_table(User.__tablename__):
            print(f"Table '{User.__tablename__}' exists.")
        else:
            print(f"Error: Table '{User.__tablename__}' does NOT exist.")
            # Consider raising an exception here in a real application

        # Optional: Test a simple query (e.g., count users) to check read access
        with SessionLocal() as db:
             user_count = db.query(User).count()
             print(f"Successfully queried users table. Found {user_count} users.")


    except Exception as e:
        print(f"Database test failed: {e}")
        # Depending on severity, you might want to exit or raise the exception
        # raise e # Uncomment to halt startup on failure

if __name__ == "__main__":
    init_db()
    test_db_connection_and_users_table() 