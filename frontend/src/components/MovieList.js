import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import AddMovieModal from './AddMovieModal';
import EditMovieModal from './EditMovieModal';

const MovieList = ({ listId, listName, className }) => {
    const [moviesList, setMoviesList] = useState([]);
    const [editMovie, setEditMovie] = useState(null);
    const [editingMovie, setEditingMovie] = useState({ title: '', year: '', genre: '', watched: false });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'watched', 'not_watched'
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const moviesPerPage = 20;

    useEffect(() => {
        fetchMovies(listId);
    }, [listId]);

    const fetchMovies = useCallback(async (listId) => {
        try {
            const response = await api.get(`/movies/list/${listId}`);
            console.log('Fetched movies:', response.data); // Добавьте логирование для проверки данных
            setMoviesList(response.data);
        } catch (error) {
            console.error('There was an error fetching the movies!', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const addMovieToList = async (newMovie) => {
        const movieData = { ...newMovie, list_id: listId };
        try {
            const response = await api.post('/movies/', movieData);
            setMoviesList([response.data, ...moviesList]);
        } catch (error) {
            console.error('There was an error adding the movie!', error);
        }
    };

    const deleteMovie = async (movieId) => {
        try {
            await api.delete(`/movies/${movieId}`);
            setMoviesList(moviesList.filter(movie => movie.id !== movieId));
        } catch (error) {
            console.error('There was an error deleting the movie!', error);
        }
    };

    const updateMovie = async (updatedMovie) => {
        const movieData = { ...updatedMovie, list_id: listId };
        try {
            const response = await api.put(`/movies/${editMovie}`, movieData);
            setMoviesList(moviesList.map(movie => movie.id === editMovie ? response.data : movie));
            setEditMovie(null);
        } catch (error) {
            console.error('There was an error updating the movie!', error);
        }
    };

    const toggleWatched = async (movieId) => {
        try {
            const movie = moviesList.find(movie => movie.id === movieId);
            const response = await api.patch(`/movies/${movieId}`, {
                watched: !movie.watched
            });
            setMoviesList(moviesList.map(movie => movie.id === movieId ? response.data : movie));
        } catch (error) {
            console.error('There was an error updating the movie!', error);
        }
    };

    const handleSort = (field) => {
        const isAsc = sortField === field && sortDirection === 'asc';
        setSortField(field);
        setSortDirection(isAsc ? 'desc' : 'asc');
    };

    const sortedMovies = [...moviesList].sort((a, b) => {
        if (a.watched !== b.watched) {
            return a.watched ? 1 : -1;
        }
        if (sortField) {
            if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
            if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const filteredMovies = sortedMovies.filter(movie => {
        if (filter === 'all') return true;
        if (filter === 'watched') return movie.watched;
        if (filter === 'not_watched') return !movie.watched;
        return true;
    });

    const paginatedMovies = filteredMovies.slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage);

    // Добавляем пустые элементы, если фильмов меньше 20
    const paddedMovies = paginatedMovies.length < moviesPerPage
        ? [...paginatedMovies, ...new Array(moviesPerPage - paginatedMovies.length).fill(null)]
        : paginatedMovies;

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className={className}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="text-light mb-0">Список фильмов {listName}</h3>
                <button className="btn btn-dark" onClick={() => setShowAddModal(true)}>
                    Добавить фильм
                </button>
            </div>
            <div className="mb-3">
                <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">Все</option>
                    <option value="watched">Просмотрено</option>
                    <option value="not_watched">Не просмотрено</option>
                </select>
            </div>
            {paddedMovies.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th style={{ width: '58%', cursor: 'pointer' }} onClick={() => handleSort('title')}>
                                Название {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th style={{ width: '11%', cursor: 'pointer' }} onClick={() => handleSort('year')}>
                                Год {sortField === 'year' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th style={{ width: '13%', cursor: 'pointer' }} onClick={() => handleSort('genre')}>
                                Жанр {sortField === 'genre' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th style={{ width: '18%', textAlign: 'right' }}>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paddedMovies.map((movie, index) => (
                            <tr key={index} style={{ textDecoration: movie && movie.watched ? 'line-through' : 'none', color: movie && movie.watched ? 'black' : 'inherit' }}>
                                <td>{movie ? movie.title : 'Пусто'}</td>
                                <td>{movie ? movie.year : ''}</td>
                                <td>{movie ? movie.genre : ''}</td>
                                <td style={{ textAlign: 'right' }}>
                                    {movie && (
                                        <>
                                            <button className="btn btn-secondary btn-sm" onClick={() => toggleWatched(movie.id)}>
                                                <FontAwesomeIcon icon={faCheck} style={{ color: movie.watched ? 'black' : 'white' }} />
                                            </button>
                                            <button className="btn btn-secondary btn-sm" onClick={() => {
                                                setEditMovie(movie.id);
                                                setEditingMovie(movie);
                                                setShowEditModal(true);
                                            }}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => deleteMovie(movie.id)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>Список фильмов пуст.</div>
            )}
            <div className="d-flex justify-content-center mt-3">
                <button className="btn btn-secondary" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Предыдущая
                </button>
                <span className="mx-2">Страница {currentPage}</span>
                <button className="btn btn-secondary" onClick={() => handlePageChange(currentPage + 1)} disabled={filteredMovies.length <= currentPage * moviesPerPage}>
                    Следующая
                </button>
            </div>
            <AddMovieModal show={showAddModal} handleClose={() => setShowAddModal(false)} addMovie={addMovieToList} />
            {editMovie !== null && (
                <EditMovieModal
                    show={showEditModal}
                    handleClose={() => setShowEditModal(false)}
                    movie={editingMovie}
                    updateMovie={updateMovie}
                />
            )}
        </div>
    );
};

export default MovieList;











