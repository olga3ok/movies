import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import MovieItem from './MovieItem';

const MovieTable = React.forwardRef(({ movies, toggleWatched, onEdit, onDelete, handleSort, sortField, sortDirection, ...providedProps }, ref) => {
    return (
        <table className="table table-striped movie-table" {...providedProps} ref={ref}>
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
                {movies.map((movie, index) => {
                    const uniqueKey = movie && movie.id ? movie.id.toString() : `empty-${index}`;

                    return (
                        <Draggable key={uniqueKey} draggableId={uniqueKey} index={index}>
                            {(provided) => (
                                <tr
                                    className="movie-item"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <MovieItem
                                        movie={movie}
                                        toggleWatched={toggleWatched}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                </tr>
                            )}
                        </Draggable>
                    );
                })}
                {providedProps.placeholder}
            </tbody>
        </table>
    );
});

export default MovieTable;








