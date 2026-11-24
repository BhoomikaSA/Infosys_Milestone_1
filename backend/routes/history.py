
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Screening, User
from ..auth import get_current_user


router = APIRouter(prefix="/history", tags=["Screening History"])


# Get all screenings of the logged-in user
@router.get("/")
def get_screening_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    screenings = (
        db.query(Screening)
        .filter(Screening.user_id == current_user.id)
        .order_by(Screening.created_at.desc())
        .all()
    )

    return [
        {
            "id": screening.id,
            "prediction": screening.prediction,
            "class_id": screening.class_id,
            "confidence": screening.confidence,
            "original_image": screening.original_image_path,
            "gradcam_image": screening.gradcam_image_path,
            "created_at": screening.created_at
        }
        for screening in screenings
    ]


# Get one particular screening by ID
@router.get("/{screening_id}")
def get_screening_details(
    screening_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    screening = (
        db.query(Screening)
        .filter(
            Screening.id == screening_id,
            Screening.user_id == current_user.id
        )
        .first()
    )

    if screening is None:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=404,
            detail="Screening record not found"
        )

    return {
        "id": screening.id,
        "prediction": screening.prediction,
        "class_id": screening.class_id,
        "confidence": screening.confidence,
        "original_image": screening.original_image_path,
        "gradcam_image": screening.gradcam_image_path,
        "created_at": screening.created_at
    }
