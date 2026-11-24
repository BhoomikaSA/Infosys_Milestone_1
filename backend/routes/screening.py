
from pathlib import Path
from uuid import uuid4

import cv2
import numpy as np

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Screening, User
from ..auth import get_current_user
from ..prediction import predict_image
from ..preprocessing import preprocess_image
from ..gradcam import generate_gradcam


router = APIRouter(prefix="/screenings", tags=["Screenings"])

# Storage folders
BACKEND_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BACKEND_DIR / "uploads"
GRADCAM_DIR = BACKEND_DIR / "gradcam_outputs"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
GRADCAM_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/predict")
async def predict_retinal_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Validate file extension
    allowed_extensions = {".jpg", ".jpeg", ".png"}
    extension = Path(file.filename or "").suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG and PNG images are supported"
        )

    # Read uploaded image
    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image uploaded")

    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image must be under 10 MB")

    # Generate unique filenames
    filename = f"{uuid4().hex}{extension}"
    image_path = UPLOAD_DIR / filename
    gradcam_path = GRADCAM_DIR / f"gradcam_{filename}"

    try:
        # Save original image
        image_path.write_bytes(image_bytes)

        # Preprocess image
        image_array = preprocess_image(image_path)

        # Predict using DenseNet121
        result = predict_image(image_path)

        # Generate Grad-CAM heatmap
        heatmap = generate_gradcam(
            image_array,
            class_index=result["class_id"]
        )

        # Read original image for overlay
        original = cv2.imread(str(image_path))

        if original is None:
            raise ValueError("Unable to read uploaded image")

        original = cv2.resize(original, (384, 384))

        # Convert heatmap into color image
        heatmap = (heatmap * 255).astype(np.uint8)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

        # Combine original image and heatmap
        overlay = cv2.addWeighted(
            original, 0.6,
            heatmap, 0.4,
            0
        )

        # Save Grad-CAM result
        if not cv2.imwrite(str(gradcam_path), overlay):
            raise ValueError("Could not save Grad-CAM image")

        # Save screening details in database
        screening = Screening(
            user_id=current_user.id,
            original_image_path=f"/uploads/{filename}",
            gradcam_image_path=f"/gradcam/{gradcam_path.name}",
            class_id=result["class_id"],
            prediction=result["prediction"],
            confidence=result["confidence"]
        )

        db.add(screening)
        db.commit()
        db.refresh(screening)

        return {
            "message": "Screening completed successfully",
            "screening_id": screening.id,
            "prediction": result["prediction"],
            "class_id": result["class_id"],
            "confidence": result["confidence"],
            "original_image": screening.original_image_path,
            "gradcam_image": screening.gradcam_image_path
        }

    except Exception as error:
        db.rollback()

        image_path.unlink(missing_ok=True)
        gradcam_path.unlink(missing_ok=True)

        if isinstance(error, ValueError):
            raise HTTPException(status_code=400, detail=str(error))

        raise HTTPException(
            status_code=500,
            detail=f"Screening failed: {str(error)}"
        )
