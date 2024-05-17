from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement='auto')
    code = Column(String, index=True)
    description = Column(String)
    unit_price = Column(Float)
    quantity = Column(Float)
    registration_date = Column(Date, default=datetime.now)

    sales = relationship('Sale', back_populates='product')

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True, autoincrement='auto')
    id_product = Column(Integer, ForeignKey('products.id')) #chave estrangeira para id da tabela product
    product = relationship("Product", back_populates="sales")
    product_code = Column(String, index=True)
    unit_price = Column(Float)
    quantity = Column(Float)
    sale_date = Column(Date, default=datetime.now)