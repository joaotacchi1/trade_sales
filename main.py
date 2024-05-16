from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship, joinedload
from datetime import date, datetime
from pydantic import BaseModel

# Criar o aplicativo FastAPI
app = FastAPI()

# Configuração do SQLAlchemy
DATABASE_URL = "postgresql://postgres:123@localhost:5432/troca"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Definição do modelo de Produto
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement='auto')
    code = Column(String, index=True)
    description = Column(String)
    unit_price = Column(Float)
    quantity = Column(Float)
    registration_date = Column(Date, default=datetime.now)
    #expiration_date = Column(Date)

    sales = relationship('Sale', back_populates='product')

# Definição do modelo de Venda
class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True, autoincrement='auto')
    id_product = Column(Integer, ForeignKey('products.id')) #chave estrangeira para id da tabela product
    product = relationship("Product", back_populates="sales")
    product_code = Column(String, index=True)
    unit_price = Column(Float)
    quantity = Column(Float)
    sale_date = Column(Date, default=datetime.now)
    #expiration_date = Column(Date)

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

class SaleCreate(BaseModel):
    id_product: int
    product_code: str
    quantity: float
    sale_date: date

#CRUD para tabela produtos
@app.post("/products/", response_model=ProductCreate)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/products/{product_id}", response_model=ProductCreate)
def read_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.get("/products/", response_model=list[ProductCreate])
def real_all_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    if products is None:
        raise HTTPException(status_code=404, detail="Products not found")
    return products

@app.put("/products/{product_id}", response_model=ProductCreate)
def update_product(product_id: int, product: ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in product.model_dump().items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"}
#-----------------------------------------------------------------------------------------------
#-----------------------------------------------------------------------------------------------
#-----------------------------------------------------------------------------------------------
# Rotas da API para CRUD de vendas
@app.post("/sales/", response_model=SaleCreate)
def create_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    db_sale = Sale(**sale.model_dump())
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)

    product = db.query(Product).filter(Product.code == sale.product_code).first()
    if product:
        product.quantity -= sale.quantity  # Diminuir a quantidade vendida
        db.commit()  # Commit para salvar a atualização na quantidade do produto

    return db_sale

class SaleResponse(BaseModel):
    id_product: int
    product_code: str
    quantity: float
    sale_date: date
    description: str
    unit_price: float

@app.get("/sales/{id_product}", response_model=SaleResponse)
def read_sale(id_product: int, db: Session = Depends(get_db)):
    sale = db.query(Sale).join(Product).add_columns(Sale.id, Sale.id_product, Sale.quantity, Sale.sale_date, Sale.product_code, Product.description, Product.unit_price).\
    filter(Sale.id_product == id_product).first()
    if sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale

@app.get("/sales/", response_model=list[SaleCreate])
def real_all_sales(db: Session = Depends(get_db)):
    sales = db.query(Sale).all()
    if sales is None:
        raise HTTPException(status_code=404, detail="Sales not found")
    return sales

@app.put("/sales/{sale_id}", response_model=SaleCreate)
def update_sale(sale_id: int, sale: SaleCreate, db: Session = Depends(get_db)):
    db_sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if db_sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")
    for key, value in sale.model_dump().items():
        setattr(db_sale, key, value)
    db.commit()
    db.refresh(db_sale)
    return db_sale

@app.delete("/sales/{sale_id}")
def delete_sale(sale_id: int, db: Session = Depends(get_db)):
    db_sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if db_sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")
    db.delete(db_sale)
    db.commit()
    return {"message": "Sale deleted successfully"}