import yaml
import os

class Settings:
    def __init__(self):
        config_path = os.path.join(os.path.dirname(__file__), "..", "..", "config.yaml")
        with open(config_path, "r") as f:
            config = yaml.safe_load(f)
        
        self.DATABASE_URL = config["database"]["url"]
        # For simplicity, we are putting password in URL for now. Consider using a separate environment variable or secret management in production.
        # self.DATABASE_PASSWORD = config["database"]["password"]

        # Google OAuth Settings
        self.GOOGLE_CLIENT_ID = config["google_oauth"]["client_id"]
        self.GOOGLE_CLIENT_SECRET = config["google_oauth"]["client_secret"]
        self.GOOGLE_REDIRECT_URI = config["google_oauth"]["redirect_uri"]

        # GitHub OAuth Settings
        self.GITHUB_CLIENT_ID = config["github_oauth"]["client_id"]
        self.GITHUB_CLIENT_SECRET = config["github_oauth"]["client_secret"]
        self.GITHUB_REDIRECT_URI = config["github_oauth"]["redirect_uri"]

settings = Settings() 