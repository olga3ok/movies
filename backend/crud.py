# crud.py
from sqlalchemy.orm import Session
import models
import schemas
from datetime import date

def get_movie_list(db: Session, list_id: int):
    return db.query(models.MovieList).filter(models.MovieList.id == list_id).first()

def get_movies(db: Session, list_id: int, skip: int = 0, limit: int = 20):
    return db.query(models.Movie).filter(models.Movie.list_id == list_id).offset(skip).limit(limit).all()

def create_movie_list(db: Session, movie_list: schemas.MovieListCreate):
    db_movie_list = models.MovieList(name=movie_list.name)
    db.add(db_movie_list)
    db.commit()
    db.refresh(db_movie_list)
    return db_movie_list

def create_movie(db: Session, movie: schemas.MovieCreate):
    db_movie = models.Movie(**movie.dict())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie

def delete_movie(db: Session, movie_id: int):
    movie = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    db.delete(movie)
    db.commit()
    return movie

def update_movie(db: Session, movie_id: int, movie: schemas.MovieCreate):
    db_movie = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    db_movie.title = movie.title
    db_movie.year = movie.year  # Обновление поля года выхода
    db_movie.genre = movie.genre  # Обновление поля жанра
    db_movie.watched = movie.watched  # Обновление поля просмотренного
    db.commit()
    db.refresh(db_movie)
    return db_movie

def toggle_watched(db: Session, movie_id: int, toggle_data: schemas.MovieToggleWatched):
    db_movie = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    db_movie.watched = toggle_data.watched
    db.commit()
    db.refresh(db_movie)
    return db_movie

def get_movie_of_the_day(db: Session, current_date: date):
    return db.query(models.MovieOfTheDay).filter(models.MovieOfTheDay.date == current_date).first()

def create_movie_of_the_day(db: Session, movie_of_the_day: schemas.MovieOfTheDayCreate):
    db_movie_of_the_day = models.MovieOfTheDay(**movie_of_the_day.dict())
    db.add(db_movie_of_the_day)
    db.commit()
    db.refresh(db_movie_of_the_day)
    return db_movie_of_the_day

def update_movie_of_the_day(db: Session, movie_of_the_day: schemas.MovieOfTheDayCreate):
    db_movie_of_the_day = db.query(models.MovieOfTheDay).filter(models.MovieOfTheDay.date == movie_of_the_day.date).first()
    if db_movie_of_the_day is None:
        return create_movie_of_the_day(db, movie_of_the_day)
    db_movie_of_the_day.movie_id = movie_of_the_day.movie_id
    db.commit()
    db.refresh(db_movie_of_the_day)
    return db_movie_of_the_day

def get_settings(db: Session):
    settings = db.query(models.Settings).first()
    if settings is None:
        settings = models.Settings(list_count=1, list1_name="Список 1", list2_name="Список 2")
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

def create_or_update_settings(db: Session, settings: schemas.SettingsCreate):
    db_settings = db.query(models.Settings).first()
    if db_settings is None:
        db_settings = models.Settings(**settings.dict())
        db.add(db_settings)
    else:
        db_settings.list_count = settings.list_count
        db_settings.list1_name = settings.list1_name
        db_settings.list2_name = settings.list2_name
    db.commit()
    db.refresh(db_settings)
    return db_settings

def get_genres(db: Session, skip: int = 0, limit: int = 30):
    return db.query(models.Genre).offset(skip).limit(limit).all()

def create_genre(db: Session, genre: schemas.GenreCreate):
    db_genre = models.Genre(name=genre.name)
    db.add(db_genre)
    db.commit()
    db.refresh(db_genre)
    return db_genre

def get_genre_by_name(db: Session, name: str):
    return db.query(models.Genre).filter(models.Genre.name == name).first()