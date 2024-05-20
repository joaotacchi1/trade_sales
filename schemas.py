from pydantic import BaseModel
from datetime import date

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

class SaleResponse(BaseModel):
    id_product: int
    code: str
    quantity: float
    sale_date: date
    description: str
    unit_price: float

class CupomCreate(BaseModel):
    array: str

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
