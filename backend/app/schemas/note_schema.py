from pydantic import BaseModel

# Base schema (shared fields)
class NoteBase(BaseModel):
    title: str
    content: str

# For creating a note
class NoteCreate(NoteBase):
    pass

# For updating a note
class NoteUpdate(NoteBase):
    pass

# For returning a note (response)
class NoteOut(NoteBase):
    id: int

    class Config:
        from_attributes = True  # allows SQLAlchemy model → Pydantic conversion
