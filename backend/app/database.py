import yaml
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Determine the path to the config.yaml file
# Assuming config.yaml is in the same directory as main.py and database.py
CONFIG_PATH = os.path.join(os.path.dirname(__file__), '..' ,'config.yaml')

# Load database URL from config.yaml
try:
    with open(CONFIG_PATH, 'r') as f:
        config = yaml.safe_load(f)
    SQLALCHEMY_DATABASE_URL = config['database']['url']
except FileNotFoundError:
    print(f"Error: config.yaml not found at {CONFIG_PATH}")
    # Fallback or raise an error, depending on desired behavior
    # For now, let's use a placeholder or raise an exception
    raise FileNotFoundError(f"Configuration file not found at {CONFIG_PATH}")
except KeyError:
    print("Error: Database URL not found in config.yaml under 'database.url'")
    # Raise an error if the key is missing
    raise KeyError("Database URL not found in config.yaml")

# 创建数据库引擎
engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基类
Base = declarative_base()

# 获取数据库会话的依赖函数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 