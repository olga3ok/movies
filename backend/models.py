from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Date
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from database import Base


class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    year = Column(Integer, index=True) 
    genre = Column(String, index=True) 
    watched = Column(Boolean, default=False)
    list_id = Column(Integer, ForeignKey('lists.id'))
    list = relationship('MovieList', back_populates='movies')


class MovieList(Base):
    __tablename__ = "lists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    movies = relationship("Movie", back_populates="list")


class MovieOfTheDay(Base):
    __tablename__ = "movie_of_the_day"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, unique=True, index=True)
    movie_id = Column(Integer, ForeignKey('movies.id'))
    movie = relationship("Movie")


class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    list_count = Column(Integer, default=1)
    list1_name = Column(String, default="1")
    list2_name = Column(String, default="2")


class Genre(Base):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True)

