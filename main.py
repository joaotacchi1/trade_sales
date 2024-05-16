from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
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
    code = Column(String, index=True)
    description = Column(String)
    unit_price = Column(Float)
    quantity = Column(Float)
    registration_date = Column(Date, default=datetime.now)
    #expiration_date = Column(Date)

    sales = relationship('Sale', back_populates='product')

'''class Item(Base):
    __tablename__ = 'itens'

    cod = Column(String, primary_key=True)
    describe = Column(String)'''

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

'''class ItemCreate(BaseModel):
    cod: str
    describe: str'''

class SaleCreate(BaseModel):
    product_code: str
    quantity: float
    sale_date: date

'''@app.post("/itens/", response_model=ItemCreate)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_item = Item(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/itens/{item_code}", response_model=ItemCreate)
def read_item(item_code: str, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.cod == item_code).first()
    if item is None:
        raise HTTPException(status_code=404, detail="item not found")
    return item

@app.get("/itens/", response_model=list[ItemCreate])
def real_all_itens(db: Session = Depends(get_db)):
    itens = db.query(Item).all()
    if itens is None:
        raise HTTPException(status_code=404, detail="Itens not found")
    return itens

@app.put("/itens/{item_code}", response_model=ItemCreate)
def update_item(item_code: str, item: ItemCreate, db: Session = Depends(get_db)):
    db_item = db.query(Item).filter(Item.cod == item_code).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    for key, value in item.model_dump().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/itens/{item_code}")
def delete_item(item_code: int, db: Session = Depends(get_db)):
    db_item = db.query(Item).filter(Item.cod == item_code).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"message": "Item deleted successfully"}'''

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

@app.get("/sales/{sale_id}", response_model=SaleCreate)
def read_sale(sale_id: int, db: Session = Depends(get_db)):
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
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