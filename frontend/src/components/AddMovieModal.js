import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../api';

const AddMovieModal = ({ show, handleClose, addMovie }) => {
    const [newMovie, setNewMovie] = useState({ title: '', year: '', genre: '', watched: false });
    const [genres, setGenres] = useState([]);
    const [newGenre, setNewGenre] = useState('');

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
        setNewMovie({ title: '', year: '', genre: '', watched: false });
        handleClose();
    };

    const handleGenreChange = (e) => {
        const genre = e.target.value;
        setNewMovie({ ...newMovie, genre });
        if (!genres.includes(genre)) {
            setNewGenre(genre);
        }
    };

    const handleAddGenre = async () => {
        if (newGenre && !genres.includes(newGenre)) {
            try {
                const response = await api.post('/genres', { name: newGenre });
                setGenres([...genres, response.data.name]);
                setNewMovie({ ...newMovie, genre: response.data.name });
                setNewGenre('');
            } catch (error) {
                console.error('There was an error adding the genre!', error);
            }
        }
    };

    return (
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
                        {/* <Form.Control
                            type="text"
                            placeholder="Новый жанр"
                            value={newGenre}
                            onChange={(e) => setNewGenre(e.target.value)}
                        />
                        <Button variant="secondary" onClick={handleAddGenre}>
                            Добавить жанр
                        </Button> */}
                    </Form.Group>
                    <br></br>
                    <Button variant="secondary" type="submit">
                        Добавить
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

export default AddMovieModal;


