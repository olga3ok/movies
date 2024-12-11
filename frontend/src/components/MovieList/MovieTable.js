import React from 'react';
import MovieItem from './MovieItem';

const MovieTable = ({ movies, toggleWatched, onEdit, onDelete, handleSort, sortField, sortDirection }) => {
    return (
        <table className="table table-striped movie-table">
            <thead>
                <tr>
                    <th style={{ width: '52%', cursor: 'pointer' }} onClick={() => handleSort('title')}>
                        Название {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th style={{ width: '11%', cursor: 'pointer' }} onClick={() => handleSort('year')}>
                        Год {sortField === 'year' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th style={{ width: '19%', cursor: 'pointer' }} onClick={() => handleSort('genre')}>
                        Жанр {sortField === 'genre' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th style={{ width: '18%', textAlign: 'right' }}>Действия</th>
                </tr>
            </thead>
            <tbody>
                {movies.map((movie, index) => (
                    <MovieItem
                        key={index}
                        movie={movie}
                        toggleWatched={toggleWatched}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </tbody>
        </table>
    );
};

export default MovieTable;
