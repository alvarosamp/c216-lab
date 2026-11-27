import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from investment_lab.api.routes import router

app = FastAPI(title="Strategy Lab", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
        if origin.strip()
    ],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)
app.include_router(router)
