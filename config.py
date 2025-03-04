import os
from dotenv import load_dotenv

load_dotenv("config.env")

class Config():
    SECRET_KEY = os.getenv('SECRET_KEY')
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')

if __name__ == "__main__":
    print(Config.SECRET_KEY)
    print(Config.SQLALCHEMY_DATABASE_URI)