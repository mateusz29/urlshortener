from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import qr, urls

app = FastAPI()

origins = ["http://localhost:3000", "https://shortlink.lol"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(urls.router)
app.include_router(qr.router)
