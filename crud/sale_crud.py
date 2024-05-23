from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from models import Sale, Product
from schemas import SaleCreate, SaleResponse, SaleUpdate
from database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/sales/", response_model=SaleCreate)
def create_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    db_sale = Sale(**sale.model_dump())
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)

    product = db.query(Product).filter(Product.id == sale.id_product).first()
    if sale.quantity > product.quantity:
        raise HTTPException(status_code=400, detail="Insufficient product quantity in stock")
    else:
        product.quantity -= sale.quantity  # Diminuir a quantidade vendida
        db.commit()  # Commit para salvar a atualização na quantidade do produto

    return db_sale

@router.get("/sales/{id_product}", response_model=list[SaleResponse])
def read_sale(id_product: int, db: Session = Depends(get_db)):
    sale = db.query(Sale).join(Product).add_columns(Sale.id, Sale.id_product, Sale.quantity, Sale.sale_date, Product.code, Product.description, Product.unit_price, Sale.validate).\
    filter(Sale.id_product == id_product).all()
    if sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale

@router.get("/getsales/{sale_id}", response_model = SaleResponse)
def read_sale_by_id(sale_id: int, db: Session = Depends(get_db)):
    sale = db.query(Sale).join(Product).add_columns(Sale.id, Sale.id_product, Sale.quantity, Sale.sale_date, Product.code, Product.description, Product.unit_price, Sale.validate).\
    filter(Sale.id == sale_id).first()
    if sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale

@router.get("/sales/", response_model=list[SaleResponse])
def real_all_sales(db: Session = Depends(get_db)):
    sales = db.query(Sale).join(Product).add_columns(Sale.id, Sale.id_product, Sale.quantity, Sale.sale_date, Product.code, Product.description, Product.unit_price, Sale.validate).\
    all()
    if sales is None:
        raise HTTPException(status_code=404, detail="Sales not found")
    return sales

@router.put("/sales/{sale_id}", response_model=SaleUpdate)
def update_sale(sale_id: int, sale: SaleUpdate, db: Session = Depends(get_db)):
    db_sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if db_sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")
    for key, value in sale.model_dump().items():
        setattr(db_sale, key, value)
    db.commit()
    db.refresh(db_sale)
    return db_sale

@router.delete("/sales/{sale_id}")
def delete_sale(sale_id: int, db: Session = Depends(get_db)):
    db_sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if db_sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")
    
    product = db.query(Product).filter(Product.id == db_sale.id_product).first()
    if product:
        product.quantity += db_sale.quantity  # Aumentar a quantidade do produto com base na venda
        db.commit()  # Commit para salvar a atualização na quantidade do produto

    db.delete(db_sale)
    db.commit()
    return {"message": "Sale deleted successfully"}