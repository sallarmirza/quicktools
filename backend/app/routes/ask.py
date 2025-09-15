import requests
import re
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.ask_model import Ask
from app.schemas.ask_schema import AskCreate, AskOut
from dotenv import load_dotenv
import os

API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_URL = os.getenv('GEMINI_URL')

Base.metadata.create_all(bind=engine)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def remove_double_askterisk(text):
    
    return re.sub(r'\*{1,2}','',text)


@router.post("/asks/", response_model=AskOut)
def create_ask(ask: AskCreate, db: Session = Depends(get_db)):
    try:
        # Call Gemini API
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": ask.question}
                    ]
                }
            ]
        }
        headers = {"Content-Type": "application/json"}
        params = {"key": API_KEY}

        response = requests.post(GEMINI_URL, headers=headers, params=params, json=payload)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Gemini API error: {response.text}")

        data = response.json()
        answer = data["candidates"][0]["content"]["parts"][0]["text"]
        
        filtered_answer=remove_double_askterisk(answer)

        # Save to DB
        db_ask = Ask(question=ask.question, answer=filtered_answer)
        db.add(db_ask)
        db.commit()
        db.refresh(db_ask)

        return db_ask

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
