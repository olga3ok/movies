import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditMovieModal = ({ show, handleClose, movie, updateMovie }) => {
    const [editingMovie, setEditingMovie] = useState({ title: '', year: '', genre: '', watched: false });

    useEffect(() => {
        if (movie) {
            setEditingMovie({
                title: movie.title,
                year: movie.year,
                genre: movie.genre,
                watched: movie.watched
            });
        }
    }, [movie]);

    const handleSubmit = (e) => {
        e.preventDefault();
        updateMovie(editingMovie);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Редактировать фильм</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Название фильма</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Название фильма"
                            value={editingMovie.title}
                            onChange={(e) => setEditingMovie({ ...editingMovie, title: e.target.value })}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formYear">
                        <Form.Label>Год выхода</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Год выхода"
                            value={editingMovie.year}
                            onChange={(e) => setEditingMovie({ ...editingMovie, year: e.target.value })}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formGenre">
                        <Form.Label>Жанр</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Жанр"
                            value={editingMovie.genre}
                            onChange={(e) => setEditingMovie({ ...editingMovie, genre: e.target.value })}
                            required
                        />
                    </Form.Group>
                    <br></br>
                    <Button variant="secondary" type="submit">
                        Сохранить
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditMovieModal;
