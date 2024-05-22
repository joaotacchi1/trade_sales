from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy import delete
from sqlalchemy.orm import Session
from models import Cupom, Product, Sale
from schemas import CupomCreate, CupomResponse
from database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/cupom/{cupom_id}", response_model=list[CupomResponse])
def get_cupom(cupom_id: int, db: Session = Depends(get_db)):
    cupom = db.query(Cupom).join(Product).add_columns(Cupom.id, Product.description, Product.quantity, Product.unit_price, Cupom.impression_date).\
    filter(Cupom.id == cupom_id).all()
    if cupom is None:
        raise HTTPException(status_code=404, detail="Cupom not found")
    return cupom

@router.get("/cupom/", response_model=list[CupomResponse])
def get_all_cupons(db: Session = Depends(get_db)):
    cupom = db.query(Cupom).join(Sale).add_columns(Cupom.id, Product.description, Sale.quantity, Product.unit_price, Cupom.impression_date).\
    all()
    if cupom is None:
        raise HTTPException(status_code=404, detail="Cupom not found")
    return cupom

@router.post("/cupom/", response_model=CupomCreate)
def create_cupom(cupom: CupomCreate, db: Session = Depends(get_db)):
    db_cupom = Cupom(**cupom.model_dump())
    db.add(db_cupom)
    db.commit()
    db.refresh(db_cupom)
    return db_cupom

@router.put("/cupom/{cupom_id}", response_model=CupomCreate)
def update_cupom(cupom_id: int, cupom: CupomCreate, db: Session = Depends(get_db)):
    db_cupom = db.query(Cupom).filter(Cupom.id == cupom_id).first()
    if db_cupom is None:
        raise HTTPException(status_code=404, detail="Cupom not found")
    for key, value in cupom.model_dump().items():
        setattr(db_cupom, key, value)
    db.commit()
    db.refresh(db_cupom)
    return db_cupom

@router.delete("/cupom/{cupom_id}")
def delete_cupom(cupom_id: int, db: Session = Depends(get_db)):
    db_cupom = db.query(Cupom).filter(Cupom.id == cupom_id).first()
    if db_cupom:
        db.delete(db_cupom)
        db.commit()
    return db_cupom

@router.delete('/cupom/')
def delete_all_cupons(db: Session = Depends(get_db)):
    db.execute(delete(Cupom))
    db.commit
    return {'message': 'All cupons deleted successfully'}