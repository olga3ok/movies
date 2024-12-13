import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../api';

const EditMovieModal = ({ show, handleClose, movie, updateMovie }) => {
    const [editingMovie, setEditingMovie] = useState({ title: '', year: '', genre: '', watched: false, order: ''});
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await api.get('/genres');
                setGenres(response.data);
            } catch (error) {
                console.error('There was an error fetching the genres!', error);
            }
        };

        fetchGenres();
    }, []);

    useEffect(() => {
        if (movie) {
            setEditingMovie({
                title: movie.title,
                year: movie.year,
                genre: movie.genre,
                watched: movie.watched,
                order: movie.order
            });
        }
    }, [movie]);

    const handleSubmit = (e) => {
        e.preventDefault();
        updateMovie(editingMovie);
        handleClose();
    };

    const handleGenreChange = (e) => {
        const genre = e.target.value;
        setEditingMovie({ ...editingMovie, genre });
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
                            as="select"
                            value={editingMovie.genre}
                            onChange={handleGenreChange}
                            required
                        >
                            <option value="">Выберите жанр</option>
                            {genres.map((genre, index) => (
                                <option key={index} value={genre.name}>
                                    {genre.name}
                                </option>
                            ))}
                        </Form.Control>
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



