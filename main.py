from fastapi import FastAPI, HTTPException, Depends
from database import engine, Base
from crud import product_crud, sale_crud, cupom_crud, login_crud
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://192.168.11.95:3007"  # Adicione aqui outras origens permitidas
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(product_crud.router, tags=['Products'])
app.include_router(sale_crud.router, tags=['Sales'])
app.include_router(cupom_crud.router, tags=['Cupom'])
app.include_router(login_crud.router, tags=['Login'])