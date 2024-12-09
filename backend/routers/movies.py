# movies.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud
import models
import schemas
from database import get_db
import random
from datetime import date

router = APIRouter()

@router.post("/lists/", response_model=schemas.MovieList)
def create_movie_list(movie_list: schemas.MovieListCreate, db: Session = Depends(get_db)):
    return crud.create_movie_list(db=db, movie_list=movie_list)

@router.get("/lists/{list_id}", response_model=schemas.MovieList)
def read_movie_list(list_id: int, db: Session = Depends(get_db)):
    db_movie_list = crud.get_movie_list(db, list_id=list_id)
    if db_movie_list is None:
        raise HTTPException(status_code=404, detail="Movie list not found")
    return db_movie_list

@router.post("/movies/", response_model=schemas.Movie)
def create_movie(movie: schemas.MovieCreate, db: Session = Depends(get_db)):
    return crud.create_movie(db=db, movie=movie)

@router.delete("/movies/{movie_id}", response_model=schemas.Movie)
def delete_movie(movie_id: int, db: Session = Depends(get_db)):
    return crud.delete_movie(db=db, movie_id=movie_id)

@router.put("/movies/{movie_id}", response_model=schemas.Movie)
def update_movie(movie_id: int, movie: schemas.MovieCreate, db: Session = Depends(get_db)):
    return crud.update_movie(db=db, movie_id=movie_id, movie=movie)

@router.patch("/movies/{movie_id}", response_model=schemas.Movie)
def toggle_watched(movie_id: int, toggle_data: schemas.MovieToggleWatched, db: Session = Depends(get_db)):
    return crud.toggle_watched(db=db, movie_id=movie_id, toggle_data=toggle_data)

@router.get("/random-movie/", response_model=schemas.Movie)
def get_random_movie(db: Session = Depends(get_db)):
    movies_list1 = crud.get_movies(db, list_id=1)
    movies_list2 = crud.get_movies(db, list_id=2)
    all_movies = movies_list1 + movies_list2
    if not all_movies:
        raise HTTPException(status_code=404, detail="No movies found")
    random_movie = random.choice(all_movies)
    return random_movie

@router.get("/movies/list/{list_id}", response_model=list[schemas.Movie])
def get_movies_by_list(list_id: int, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    movies = crud.get_movies(db, list_id=list_id, skip=skip, limit=limit)
    return movies

@router.get("/movie-of-the-day/", response_model=schemas.MovieOfTheDay)
def get_movie_of_the_day(db: Session = Depends(get_db)):
    current_date = date.today()
    movie_of_the_day = crud.get_movie_of_the_day(db, current_date)
    if not movie_of_the_day:
        random_movie = get_random_movie(db)
        movie_of_the_day_create = schemas.MovieOfTheDayCreate(date=current_date, movie_id=random_movie.id)
        movie_of_the_day = crud.create_movie_of_the_day(db, movie_of_the_day_create)
    return movie_of_the_day

@router.post("/generate-movie-of-the-day/", response_model=schemas.MovieOfTheDay)
def generate_movie_of_the_day(db: Session = Depends(get_db)):
    current_date = date.today()
    random_movie = get_random_movie(db)
    movie_of_the_day_create = schemas.MovieOfTheDayCreate(date=current_date, movie_id=random_movie.id)
    movie_of_the_day = crud.update_movie_of_the_day(db, movie_of_the_day_create)
    return movie_of_the_day

@router.get("/settings/", response_model=schemas.Settings)
def get_settings(db: Session = Depends(get_db)):
    settings = crud.get_settings(db)
    if settings is None:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings

@router.post("/settings/", response_model=schemas.Settings)
def create_or_update_settings(settings: schemas.SettingsCreate, db: Session = Depends(get_db)):
    return crud.create_or_update_settings(db=db, settings=settings)

@router.get("/genres", response_model=list[schemas.Genre])
def read_genres(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    genres = crud.get_genres(db, skip=skip, limit=limit)
    return genres

@router.post("/genres", response_model=schemas.Genre)
def create_genre(genre: schemas.GenreCreate, db: Session = Depends(get_db)):
    db_genre = crud.get_genre_by_name(db, name=genre.name)
    if db_genre:
        raise HTTPException(status_code=400, detail="Genre already exists")
    return crud.create_genre(db=db, genre=genre)

    
