from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.database import SessionLocal, engine, Base
from app.models.note_model import Note
from app.schemas.note_schema import NoteOut, NoteCreate, NoteUpdate

# Create tables
Base.metadata.create_all(bind=engine)

router = APIRouter()


# Get all notes
@router.get("/notes/", response_model=List[NoteOut])
def get_notes(db: Session = Depends(get_db)):
    return db.query(Note).all()

# Create a note
@router.post("/notes/", response_model=NoteOut)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    db_note = Note(title=note.title, content=note.content)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

# Update a note
@router.put("/notes/{note_id}", response_model=NoteOut)
def update_note(note_id: int, note: NoteUpdate, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    db_note.title = note.title
    db_note.content = note.content
    db.commit()
    db.refresh(db_note)
    return db_note

# Delete a note
@router.delete("/notes/{note_id}", response_model=dict)
def delete_note(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(db_note)
    db.commit()
    return {"message": "Note deleted successfully"}
