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
    cupom = relationship('Cupom', back_populates='product')

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True, autoincrement='auto')
    id_product = Column(Integer, ForeignKey('products.id')) #chave estrangeira para id da tabela product
    product_code = Column(String, index=True)
    unit_price = Column(Float) #tirar, talvez?
    quantity = Column(Float)
    sale_date = Column(Date, default=datetime.now)

    product = relationship("Product", back_populates="sales")
    cupom = relationship('Cupom', back_populates='sale')

class Cupom(Base):
    __tablename__ = 'cupom'

    id = Column(Integer, primary_key=True, index=True, autoincrement='auto')
    id_venda = Column(Integer, ForeignKey('sales.id')) #chave estrangeira para id da tabela sales
    id_produto = Column(Integer, ForeignKey('products.id')) #chave estrangeira para id da tabela products

    sale = relationship('Sale', back_populates='cupom')
    product = relationship('Product', back_populates='cupom')

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    login = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String)