from fastapi import FastAPI, Query, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json
from datetime import datetime
from database import engine, Base, get_db
import crud
import models
from routers import movies


app = FastAPI()

origins = [
    "http://localhost:3000",  # Добавьте сюда все источники, с которых будут поступать запросы
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем запросы с любого домена
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все HTTP методы
    allow_headers=["*"],  # Разрешаем все заголовки
)
models.Base.metadata.create_all(bind=engine)

app.include_router(movies.router)

@app.on_event("startup")
async def startup():
    global phrases
    with open("data/dates.json", "r", encoding="utf-8") as file:
        phrases = json.load(file)

@app.get("/phrase")
def get_phrase(date: str = Query(None), db: Session = Depends(get_db)):
    settings = crud.get_settings(db)
    if not settings:
        return JSONResponse(status_code=404, content={"message": "Settings not found"})

    names = (settings.list1_name, settings.list2_name)

    if date:
        phrase = phrases.get(date, "Не найдено")
        if phrase in (0, 1):
            return {"date": date, "phrase": names[phrase]}
        else:
            return {"date": date, "phrase": ""}
    else:
        today = datetime.now().strftime("%d.%m.%Y")
        phrase = phrases.get(today, "Не найдено")
        if phrase in (0, 1):
            return {"date": today, "phrase": names[phrase]}
        else:
            return {"date": today, "phrase": ""}

