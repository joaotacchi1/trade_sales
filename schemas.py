from pydantic import BaseModel, Field
from datetime import date

class ProductCreate(BaseModel):
    code: int
    description: str
    unit_price: float = Field(..., gt=0, description='Price must be zero or greater')
    quantity: float = Field(..., gt=0, description='Quantity must be zero or greater')
    obs: str

class ProductResponse(BaseModel):
    id: int
    code: int
    description: str
    unit_price: float
    quantity: float
    registration_date: date
    obs: str

class SaleCreate(BaseModel):
    id_product: int
    quantity: float = Field(..., gt=0, description='Quantity must be zero or greater')

class SaleResponse(BaseModel):
    id: int
    id_product: int
    code: int
    quantity: float
    sale_date: date
    description: str
    unit_price: float
    validate: str

    class Config:
        orm_mode = True

class SaleUpdate(BaseModel):
    validate: str

class CupomCreate(BaseModel):
    id_sale: int
    id_product: int

class CupomResponse(BaseModel):
    id: int
    quantity: float
    description: str
    unit_price: float
    impression_date: date

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
