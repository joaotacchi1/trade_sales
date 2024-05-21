from pydantic import BaseModel
from datetime import date

class ProductCreate(BaseModel):
    code: str
    description: str
    unit_price: float
    quantity: int
    obs: str

class ProductResponse(BaseModel):
    code: str
    description: str
    unit_price: float
    quantity: int
    registration_date: date
    obs: str

class SaleCreate(BaseModel):
    id_product: int
    quantity: float
    sale_date: date

class SaleResponse(BaseModel):
    id_product: int
    code: str
    quantity: float
    sale_date: date
    description: str
    unit_price: float

    class Config:
        orm_mode = True

class CupomCreate(BaseModel):
    id_sale: int
    id_product: int

class UserBase(BaseModel):
    email: str
    name: str
    login: str
    role: str

class UserLogin(BaseModel):
    login: str
    password: str

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True
