import os
import datetime
import logging
from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, status
import numpy as np
import joblib
import scipy.ndimage

logger = logging.getLogger(__name__)
router = APIRouter()

# Global in-memory reference for the SGD ML model
sgd_model = None


def load_model():
    """Loads the pre-trained SGD ML model into RAM using joblib."""
    global sgd_model
    sgd_path = os.path.join(os.path.dirname(__file__), "models", "sgd_clf_model.pkl")
    try:
        sgd_model = joblib.load(sgd_path)
        logger.info("SGD model loaded successfully in digit_recognition router.")
    except Exception as e:
        logger.error(f"Failed to load SGD model from {sgd_path}: {e}")
        raise e


class PredictRequest(BaseModel):
    image: List[float]


class PredictResponse(BaseModel):
    prediction: int
    confidence: float
    probabilities: List[float]
    timestamp: str


def preprocess_image(flat_image: List[float]) -> np.ndarray:
    """
    Centers the drawing based on its center of mass.
    Aligns pixel coordinates with the MNIST dataset training layout.
    """
    img_2d = np.array(flat_image).reshape(28, 28)
    img_2d[img_2d < 0.05] = 0.0
    
    pixel_sum = np.sum(img_2d)
    if pixel_sum > 0.001:
        cy, cx = scipy.ndimage.center_of_mass(img_2d)
        if not (np.isnan(cy) or np.isnan(cx)):
            dy = 13.5 - cy
            dx = 13.5 - cx
            img_2d = scipy.ndimage.shift(img_2d, [dy, dx], cval=0.0)
            
    img_2d = np.clip(img_2d, 0.0, 1.0)
    return img_2d.reshape(1, -1) * 255.0


@router.post("/api/predict", response_model=PredictResponse)
async def predict_digit(req: PredictRequest):
    """
    High-performance ML inference endpoint:
    Accepts 784 normalized pixel floats, runs center-of-mass preprocessing,
    and returns predicted class + softmax confidence distribution.
    """
    global sgd_model
    
    if sgd_model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Machine learning model is not loaded"
        )
        
    if len(req.image) != 784:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Image feature array must contain exactly 784 elements. Got {len(req.image)}."
        )
        
    if any(val < 0.0 or val > 1.0 for val in req.image):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="All image feature values must be floats between 0.0 and 1.0 (inclusive)."
        )
        
    try:
        input_data = preprocess_image(req.image)
        prediction = int(sgd_model.predict(input_data)[0])
        
        # Softmax probabilities over decision function scores
        scores = sgd_model.decision_function(input_data)[0]
        exp_scores = np.exp(scores - np.max(scores))
        probabilities = exp_scores / np.sum(exp_scores)
            
        confidence = float(probabilities[prediction])
        probabilities_list = [float(p) for p in probabilities]
        timestamp_str = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        return PredictResponse(
            prediction=prediction,
            confidence=confidence,
            probabilities=probabilities_list,
            timestamp=timestamp_str
        )
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )
