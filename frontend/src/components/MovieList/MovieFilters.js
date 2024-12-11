import React from 'react';

const MovieFilters = ({ filter, setFilter }) => {
    return (
        <div className="mb-3">
            <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">Все</option>
                <option value="watched">Просмотрено</option>
                <option value="not_watched">Не просмотрено</option>
            </select>
        </div>
    );
};

export default MovieFilters;