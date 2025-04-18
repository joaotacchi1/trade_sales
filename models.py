from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement='auto')
    ean = Column(String, unique=True, index=True)
    code = Column(Integer, index=True)
    description = Column(String)
    unit_price = Column(Float)
    quantity = Column(Float)
    obs = Column(String, nullable=False)
    registration_date = Column(Date, default=datetime.now)

    cupom = relationship('Cupom', back_populates='product')

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True, autoincrement='auto')
    id_product = Column(Integer) #chave estrangeira para id da tabela product
    code = Column(Integer, index=True)
    product_code = Column(Integer, index=True)
    unit_price = Column(Float) 
    quantity = Column(Float)
    description = Column(String)
    sale_date = Column(Date, default=datetime.now)
    validate = Column(String, default='null')
    user = Column(String, default='null')

    cupom = relationship('Cupom', back_populates='sale')

class Cupom(Base):
    __tablename__ = 'cupom'

    id = Column(Integer, primary_key=True, index=True, autoincrement='auto')
    id_sale = Column(Integer, ForeignKey('sales.id', ondelete="RESTRICT")) #chave estrangeira para id da tabela sales
    id_product = Column(Integer, ForeignKey('products.id', ondelete="RESTRICT")) #chave estrangeira para id da tabela products
    impression_date = Column(Date, default=datetime.now)

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