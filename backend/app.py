from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas
from .database import Base, engine, get_db
Base.metadata.create_all(bind=engine)
app = FastAPI(title="Items API", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/health")
def health():
    return {"status": "ok"}
@app.get("/items", response_model=list[schemas.ItemRead])
def list_items(db: Session = Depends(get_db)):
    return db.query(models.Item).order_by(models.Item.id.desc()).all()
@app.post("/items", response_model=schemas.ItemRead, status_code=201)
def create_item(payload: schemas.ItemCreate, db: Session = Depends(get_db)):
    if not payload.name.strip():
        raise HTTPException(status_code=400, detail="Name cannot be empty")
    item = models.Item(name=payload.name.strip(), description=payload.description)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
