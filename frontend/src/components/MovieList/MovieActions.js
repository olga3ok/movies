import React from 'react';

const MovieActions = ({ listName, setShowAddModal }) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="text-light mb-0">Список фильмов {listName}</h3>
            <button className="btn btn-dark" onClick={() => setShowAddModal(true)}>
                Добавить фильм
            </button>
        </div>
    );
};

export default MovieActions;