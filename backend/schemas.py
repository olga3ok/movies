from pydantic import BaseModel
from typing import List, Optional
from datetime import date


class MovieBase(BaseModel):
    title: str
    year: int 
    genre: str
    watched: bool = False 
    order: int


class Movie(MovieBase):
    id: int
    list_id: int

    class Config:
        ofrom_attributes = True


class MovieCreate(MovieBase):
    list_id: int


class MovieListBase(BaseModel):
    name: str


class MovieListCreate(MovieListBase):
    movies: List[MovieCreate]


class MovieList(MovieListBase):
    id: int
    movies: List[Movie] = []

    class Config:
        from_attributes = True


class MovieOfTheDayBase(BaseModel):
    date: date
    movie_id: int


class MovieOfTheDayCreate(MovieOfTheDayBase):
    pass


class MovieOfTheDay(MovieOfTheDayBase):
    id: int
    movie: Movie

    class Config:
        from_attributes = True


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
        from_attributes = True


class GenreBase(BaseModel):
    name: str


class GenreCreate(GenreBase):
    pass


class Genre(GenreBase):
    id: int

    class Config:
        from_attributes = True


class MovieReorder(BaseModel):
    order: int
