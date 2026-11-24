from pydantic import BaseModel, Field


# User registration
class UserCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: str = Field(min_length=5, max_length=150)
    password: str = Field(min_length=8, max_length=128)


# User login
class UserLogin(BaseModel):
    email: str
    password: str


# User information returned to frontend
class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str

    class Config:
        from_attributes = True


# Prediction response
class PredictionResponse(BaseModel):
    class_id: int
    prediction: str
    confidence: float


# Screening response
class ScreeningResponse(BaseModel):
    id: int
    class_id: int
    prediction: str
    confidence: float
    original_image_path: str
    gradcam_image_path: str | None = None

    class Config:
        from_attributes = True