from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import notes,ask,auth

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(notes.router, prefix="")
app.include_router(ask.router)
app.include_router(auth.router)