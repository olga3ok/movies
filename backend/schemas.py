from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class MovieBase(BaseModel):
    title: str
    year: int  # Поле для года выхода
    genre: str  # Поле для жанра
    watched: bool = False  # Поле для отметки фильма как просмотренного

class MovieCreate(MovieBase):
    list_id: int

class Movie(MovieBase):
    id: int
    list_id: int

    class Config:
        orm_mode = True

class MovieListBase(BaseModel):
    name: str

class MovieListCreate(MovieListBase):
    pass

class MovieList(MovieListBase):
    id: int
    movies: List[Movie] = []

    class Config:
        orm_mode = True

class MovieOfTheDayBase(BaseModel):
    date: date
    movie_id: int

class MovieOfTheDayCreate(MovieOfTheDayBase):
    pass

class MovieOfTheDay(MovieOfTheDayBase):
    id: int
    movie: Movie

    class Config:
        orm_mode = True

class MovieToggleWatched(BaseModel):
    watched: bool

class SettingsBase(BaseModel):
    list_count: int
    list1_name: str
    list2_name: str

class SettingsCreate(SettingsBase):
    pass

class Settings(SettingsBase):
    id: int

    class Config:
        orm_mode = True

class GenreBase(BaseModel):
    name: str

class GenreCreate(GenreBase):
    pass

class Genre(GenreBase):
    id: int

    class Config:
        orm_mode = True