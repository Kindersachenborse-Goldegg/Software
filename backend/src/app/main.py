from fastapi import Depends, FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.routers import auth

app = FastAPI(title="KSB Backend")

# Noah's frontend calls everything under /api
app.include_router(auth.router, prefix="/api")


@app.get("/health")
def health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
    except SQLAlchemyError:
        return JSONResponse(status_code=503, content={"status": "error", "db": "down"})
    return {"status": "ok", "db": "ok"}
