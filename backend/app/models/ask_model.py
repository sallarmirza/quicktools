from sqlalchemy import Column,Integer,String,Text
from app.database import Base

class Ask(Base):
    __tablename__='ask'
    id=Column(Integer,primary_key=True,index=True)
    question=Column(String(255),nullable=False)
    answer=Column(Text,nullable=True)
    