from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from backend import models, schemas, database
models.Base.metadata.create_all(bind=database.engine)
app = FastAPI()
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()
@app.get("/items", response_model=list[schemas.Item])
def get_items(db: Session = Depends(get_db)):
    return db.query(models.Item).all()
@app.post("/items", response_model=schemas.Item)
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    db_item = models.Item(name=item.name)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
