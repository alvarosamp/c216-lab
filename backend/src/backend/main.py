from fastapi import FastAPI

from backend.api.router import api_router

app = FastAPI(title="Controle Financeiro")
app.include_router(api_router)
