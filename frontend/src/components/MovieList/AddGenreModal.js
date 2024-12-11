import React, { useState } from 'react';
import { Modal, Button, Form, ListGroup, Alert } from 'react-bootstrap';
import api from '../../api';

const AddGenreModal = ({ show, handleClose, addGenre, genres, removeGenre }) => {
    const [newGenre, setNewGenre] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newGenre.trim()) {
            try {
                const response = await api.post('/genres', { name: newGenre });
                addGenre(response.data);
                setNewGenre('');
                handleClose();
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    setError('Genre already exists');
                } else {
                    setError('There was an error adding the genre!');
                }
                console.error('There was an error adding the genre!', error);
            }
        }
    };

    const deleteGenre = async (genreId) => {
        try {
            await api.delete(`/genres/${genreId}`);
            removeGenre(genreId);
        } catch (error) {
            console.error('There was an error deleting the genre!', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Добавить жанр</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formNewGenre">
                        <Form.Label>Новый жанр</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Новый жанр"
                            value={newGenre}
                            onChange={(e) => {
                                setNewGenre(e.target.value);
                                setError('');
                            }}
                            required
                        />
                    </Form.Group>
                    <Button variant="secondary" type="submit">
                        Добавить жанр
                    </Button>
                    <Form.Group controlId="formExistingGenres">
                        <Form.Label>Существующие жанры</Form.Label>
                        <ListGroup>
                            {genres.map((genre, index) => (
                                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                    {genre.name}
                                    <Button variant="danger" size="sm" onClick={() => deleteGenre(genre.id)}>
                                        Удалить
                                    </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Form.Group>
                    <br></br>
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

export default AddGenreModal;


