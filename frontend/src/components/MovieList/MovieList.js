import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from '../../api';
import AddMovieModal from './AddMovieModal';
import EditMovieModal from './EditMovieModal';
import Pagination from '../Pagintation';
import MovieTable from './MovieTable';
import MovieFilters from './MovieFilters';
import MovieActions from './MovieActions';

const MovieList = ({ listId, listName, className }) => {
    const [moviesList, setMoviesList] = useState([]);
    const [editMovie, setEditMovie] = useState(null);
    const [editingMovie, setEditingMovie] = useState({ title: '', year: '', genre: '', watched: false, order: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'watched', 'not_watched'
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const moviesPerPage = 13;

    useEffect(() => {
        fetchMovies(listId);
    }, [listId]);

    const fetchMovies = useCallback(async (listId) => {
        try {
            const response = await api.get(`/movies/list/${listId}`);
            const sortedMovies = response.data.sort((a, b) => a.order - b.order);
            setMoviesList(sortedMovies);
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
            setMoviesList(moviesList.filter(movie => movie && movie.id !== movieId));
        } catch (error) {
            console.error('There was an error deleting the movie!', error);
        }
    };

    const updateMovie = async (updatedMovie) => {
        const movieData = { ...updatedMovie, list_id: listId };
        try {
            const response = await api.put(`/movies/${editMovie}`, movieData);
            setMoviesList(moviesList.map(movie => movie && movie.id === editMovie ? response.data : movie));
            setEditMovie(null);
        } catch (error) {
            console.error('There was an error updating the movie!', error);
        }
    };

    const toggleWatched = async (movieId) => {
        try {
            const movie = moviesList.find(movie => movie && movie.id === movieId);
            if (!movie) {
                console.error('Movie not found!', movieId);
                return;
            }
            const response = await api.patch(`/movies/${movieId}`, {
                watched: !movie.watched
            });
            setMoviesList(moviesList.map(movie => movie && movie.id === movieId ? response.data : movie));
        } catch (error) {
            console.error('There was an error updating the movie!', error);
        }
    };

    const handleSort = (field) => {
        const isAsc = sortField === field && sortDirection === 'asc';
        setSortField(field);
        setSortDirection(isAsc ? 'desc' : 'asc');
    };

    const sortedMovies = [...moviesList].filter(movie => movie !== null).sort((a, b) => {
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

    // Добавляем пустые элементы, если фильмов меньше moviesPerPage
    const paddedMovies = paginatedMovies.length < moviesPerPage
        ? [...paginatedMovies, ...new Array(moviesPerPage - paginatedMovies.length).fill(null)]
        : paginatedMovies;

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const onDragEnd = async (result) => {
        const { destination, source } = result;

        if (!destination) {
            return;
        }
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const movie1 = moviesList[destination.index];
        const movie2 = moviesList[source.index];

        const tmp = movie1.order;
        movie1.order = movie2.order;
        movie2.order = tmp;

        const newMoviesList = Array.from(moviesList);
        const [reorderedMovie] = newMoviesList.splice(source.index, 1);
        newMoviesList.splice(destination.index, 0, reorderedMovie);

        setMoviesList(newMoviesList);

        try {
            await api.patch(`/movies/reorder/${movie1.id}`, { order: movie1.order });
            await api.patch(`/movies/reorder/${movie2.id}`, { order: movie2.order });
        } catch (error) {
            console.error('There was an error updating the movies order!', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className={className}>
            <MovieActions listName={listName} setShowAddModal={setShowAddModal} />
            <MovieFilters filter={filter} setFilter={setFilter} />
            {paddedMovies.length > 0 ? (
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="movies">
                        {(provided) => (
                            <MovieTable
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                movies={paddedMovies}
                                toggleWatched={toggleWatched}
                                onEdit={(movie) => {
                                    setEditMovie(movie.id);
                                    setEditingMovie(movie);
                                    setShowEditModal(true);
                                }}
                                onDelete={deleteMovie}
                                handleSort={handleSort}
                                sortField={sortField}
                                sortDirection={sortDirection}
                                placeholder={provided.placeholder}
                            />
                        )}
                    </Droppable>
                </DragDropContext>
            ) : (
                <div>Список фильмов пуст.</div>
            )}
            <Pagination
                currentPage={currentPage}
                totalItems={filteredMovies.length}
                itemsPerPage={moviesPerPage}
                onPageChange={handlePageChange}
            />
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

