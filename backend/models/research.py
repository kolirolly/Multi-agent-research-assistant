import os
from sqlalchemy import create_engine, Column, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

class ResearchJob(Base):
    __tablename__ = 'research_jobs'
    
    id = Column(String, primary_key=True)  # UUID
    query = Column(Text, nullable=False)
    status = Column(String, default='pending')
    sub_questions = Column(Text, nullable=True)  # JSON
    sources = Column(Text, nullable=True)  # JSON
    report = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

# Create sqlite database
engine = create_engine('sqlite:///./research.db', connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)
