from fastapi import APIRouter

from backend.api.routes.health import router as health_router
from backend.api.routes.transactions import router as transactions_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(transactions_router)
