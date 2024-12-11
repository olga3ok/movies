import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../api';
import AddGenreModal from './AddGenreModal';

const AddMovieModal = ({ show, handleClose, addMovie }) => {
    const [newseason, setNewMovie] = useState({ title: '', year: '', genre: '', watched: false });
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
        addMovie(newseason);
        setNewMovie({ title: '', year: '', genre: '', watched: false });
        handleClose();
    };

    const handleGenreChange = (e) => {
        const genre = e.target.value;
        setNewMovie({ ...newseason, genre });
    };

    const handleAddGenre = (newGenre) => {
        setGenres([...genres, newGenre]);
        setNewMovie({ ...newseason, genre: newGenre });
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
                                value={newseason.title}
                                onChange={(e) => setNewMovie({ ...newseason, title: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formYear">
                            <Form.Label>Год выхода</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Год выхода"
                                value={newseason.year}
                                onChange={(e) => setNewMovie({ ...newseason, year: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formGenre">
                            <Form.Label>Жанр</Form.Label>
                            <Form.Control
                                as="select"
                                value={newseason.genre}
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


