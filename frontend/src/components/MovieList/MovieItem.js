import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import './MovieList.css'; // Импортируем CSS-файл

const MovieItem = ({ movie, toggleWatched, onEdit, onDelete }) => {
    if (!movie) {
        return (
            <tr className="movie-item">
                <td colSpan="4">Пусто</td>
            </tr>
        );
    }

    return (
        <tr className="movie-item" style={{ textDecoration: movie.watched ? 'line-through' : 'none', color: movie.watched ? 'black' : 'inherit' }}>
            <td className="title">{movie.title}</td>
            <td>{movie.year}</td>
            <td>{movie.genre}</td>
            <td style={{ textAlign: 'right' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => toggleWatched(movie.id)}>
                    <FontAwesomeIcon icon={faCheck} style={{ color: movie.watched ? 'black' : 'white' }} />
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => onEdit(movie)}>
                    <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(movie.id)}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </td>
        </tr>
    );
};

export default MovieItem;
