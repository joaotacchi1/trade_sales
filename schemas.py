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
    product_code: str
    quantity: float
    sale_date: date
    description: str
    unit_price: float