
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import engine, Base
from . import models

from .routes.auth import router as auth_router
from .routes.screening import router as screening_router
from .routes.history import router as history_router


# Create database tables
Base.metadata.create_all(bind=engine)


# Initialize FastAPI
app = FastAPI(
    title="RetinaVision API",
    description="Explainable AI for Diabetic Retinopathy Screening",
    version="1.0.0"
)


# Frontend connection (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routers
app.include_router(auth_router)
app.include_router(screening_router)
app.include_router(history_router)


# Serve uploaded images and Grad-CAM images
BACKEND_DIR = Path(__file__).resolve().parent

UPLOAD_DIR = BACKEND_DIR / "uploads"
GRADCAM_DIR = BACKEND_DIR / "gradcam_outputs"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
GRADCAM_DIR.mkdir(parents=True, exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory=str(UPLOAD_DIR)),
    name="uploads"
)

app.mount(
    "/gradcam",
    StaticFiles(directory=str(GRADCAM_DIR)),
    name="gradcam"
)


# Root endpoint
@app.get("/")
def home():
    return {
        "message": "Welcome to RetinaVision API",
        "status": "Backend is running"
    }


# Health check
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "application": "RetinaVision"
    }

