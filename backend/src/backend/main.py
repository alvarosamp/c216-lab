from fastapi import FastAPI

app = FastAPI(title="Controle Financeiro")


@app.get("/health")
def health_check() -> dict[str, str]:
    """Return the service availability status."""
    return {"status": "ok"}
