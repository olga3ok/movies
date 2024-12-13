import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../api';
import AddGenreModal from './AddGenreModal';

const AddMovieModal = ({ show, handleClose, addMovie }) => {
    const [newMovie, setNewMovie] = useState({ title: '', year: '', genre: '', watched: false, order: 1 });
    const [genres, setGenres] = useState([]);
    const [showAddGenreModal, setShowAddGenreModal] = useState(false);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        addMovie(newMovie);
        setNewMovie({ title: '', year: '', genre: '', watched: false, order: 1 });
        handleClose();
    };

    const handleGenreChange = (e) => {
        const genre = e.target.value;
        setNewMovie({ ...newMovie, genre });
    };

    const handleAddGenre = (newGenre) => {
        setGenres([...genres, newGenre]);
        setNewMovie({ ...newMovie, genre: newGenre });
    };

    const addGenre = (newGenre) => {
        setGenres([...genres, { name: newGenre }]);
    };

    const removeGenre = (genreId) => {
        setGenres(genres.filter(genre => genre.id !== genreId));
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавить фильм</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Название фильма</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Название фильма"
                                value={newMovie.title}
                                onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formYear">
                            <Form.Label>Год выхода</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Год выхода"
                                value={newMovie.year}
                                onChange={(e) => setNewMovie({ ...newMovie, year: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formGenre">
                            <Form.Label>Жанр</Form.Label>
                            <Form.Control
                                as="select"
                                value={newMovie.genre}
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
                        {/* <Form.Group controlId="formOrder">
                            <Form.Label>Порядок</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Порядок"
                                value={newMovie.order}
                                onChange={(e) => setNewMovie({ ...newMovie, order: e.target.value })}
                                required
                            />
                        </Form.Group> */}
                        <br></br>
                        <Button variant="secondary" type="submit">
                            Добавить
                        </Button>
                        <Button variant="secondary" onClick={() => setShowAddGenreModal(true)} style={{ float: 'right' }}>
                            Добавить жанр
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
            <AddGenreModal
                show={showAddGenreModal}
                handleClose={() => setShowAddGenreModal(false)}
                addGenre={handleAddGenre}
                genres={genres}
                removeGenre={removeGenre}
            />
        </>
    );
};

export default AddMovieModal;



