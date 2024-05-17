from fastapi import FastAPI, HTTPException, Depends
from database import engine, Base
from crud import product_crud, sale_crud, cupom_crud

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(product_crud.router, tags=['Products'])
app.include_router(sale_crud.router, tags=['Sales'])
app.include_router(cupom_crud.router, tags=['Cupom'])