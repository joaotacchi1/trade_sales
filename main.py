from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, Float, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import date, datetime
from pydantic import BaseModel

# Criar o aplicativo FastAPI
app = FastAPI()

# Configuração do SQLAlchemy
DATABASE_URL = "postgresql://postgres:000@localhost:5432/troca"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Definição do modelo de Produto
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement='auto')
    code = Column(String, unique=True, index=True)
    description = Column(String)
    unit_price = Column(Float)
    quantity = Column(Integer)
    registration_date = Column(Date, default=datetime.now)
    expiration_date = Column(Date)

# Definição do modelo de Venda
class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    product_code = Column(String, index=True)
    unit_price = Column(Float)
    quantity = Column(Integer)
    sale_date = Column(Date, default=datetime.now)

# Criar tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Função para obter a sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ProductCreate(BaseModel):
    code: str
    description: str
    unit_price: float
    quantity: int
    registration_date: date
    expiration_date: date

class SaleCreate(BaseModel):
    product_code: str
    unit_price: float
    buyer: str
    sale_date: date

# Rotas da API
@app.post("/products")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product.__dict__

@app.get("/products/{product_code}/")
def get_product(product_code: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.code == product_code).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/sales/")
def create_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.code == sale.product_code).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    if sale.unit_price != product.unit_price:
        raise HTTPException(status_code=400, detail="Unit price mismatch")
    if sale.quantity > product.quantity:
        raise HTTPException(status_code=400, detail="Insufficient quantity")
    
    product.quantity -= sale.quantity
    db_sale = Sale(**sale.model_dump())
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale