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


models.Base.metadata.create_all(bind=engine)


app.include_router(movies.router)


@app.on_event("startup")
async def startup():
    global phrases
    with open("data/dates.json", "r", encoding="utf-8") as file:
        phrases = json.load(file)


@app.get("/api/phrase")
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


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
