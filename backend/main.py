import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from digit_recognition.router import load_model as load_ml_model, router as digit_recognition_router

# Load environment configuration
load_dotenv("backend/.env")
load_dotenv(".env")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Lifespan: Manage ML model in-memory loading
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load ML Model into RAM once on startup
    load_ml_model()
    logger.info("ML Model service started successfully.")
    yield
    logger.info("ML Model service shut down.")


# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Digit Classification ML Microservice",
    description="High-speed Python ML inference service for handwritten digit recognition",
    version="4.0.0",
    lifespan=lifespan,
)

# CORS: allow frontend + localhost dev + all vercel preview deployments
_frontend_url = os.environ.get("FRONTEND_URL", "").strip()
_allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if _frontend_url:
    _allowed_origins.append(_frontend_url)
    _allowed_origins.append(_frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
app.include_router(digit_recognition_router)


@app.get("/api/health")
async def health_check():
    """Health check reporting ML microservice status."""
    return {
        "status": "online",
        "service": "digit-classification-ml",
    }
