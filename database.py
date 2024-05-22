from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

<<<<<<< Updated upstream
load_dotenv()
env = os.getenv('DB_PASSWORD')

DATABASE_URL = "postgresql://postgres:{env}}@localhost:5432/troca"
=======
DATABASE_URL = "postgresql://postgres:123@localhost:5432/troca"
>>>>>>> Stashed changes

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()