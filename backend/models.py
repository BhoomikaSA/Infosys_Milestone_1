from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base


# User table
class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)

    email = Column(String, unique=True, index=True, nullable=False)

    hashed_password = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)


    # Relationship with screenings
    screenings = relationship("Screening", back_populates="user")


# Screening history table
class Screening(Base):

    __tablename__ = "screenings"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    original_image_path = Column(String, nullable=False)

    gradcam_image_path = Column(String, nullable=True)

    class_id = Column(Integer, nullable=False)

    prediction = Column(String, nullable=False)

    confidence = Column(Float, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)


    # Relationship with user
    user = relationship("User", back_populates="screenings")