from pydantic import BaseModel

class AskBase(BaseModel):
    question:str
    
class AskCreate(AskBase):
    pass

class AskUpdate(AskBase):
    pass

class AskOut(AskBase):
    id:int
    answer:str | None=None
    class Config:
        from_attributes=True
