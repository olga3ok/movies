// SettingsModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import api from '../api'; // Импортируем api для отправки запросов

const SettingsModal = ({ show, handleClose, handleSave, settings }) => {
    const [listCount, setListCount] = useState(settings.listCount);
    const [listNames, setListNames] = useState(settings.listNames);

    useEffect(() => {
        setListCount(settings.listCount);
        setListNames(settings.listNames);
    }, [settings]);

    const handleListCountChange = (event) => {
        setListCount(Number(event.target.value));
    };

    const handleListNameChange = (event, listNumber) => {
        setListNames({
            ...listNames,
            [listNumber]: event.target.value,
        });
    };

    const handleSaveClick = async () => {
        try {
            const response = await api.post('/settings/', {
                list_count: listCount,
                list1_name: listNames.list1,
                list2_name: listNames.list2
            });
            handleSave({
                listCount,
                listNames
            });
            handleClose();
        } catch (error) {
            console.error('There was an error saving the settings!', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Настройки</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="listCount">
                        <Form.Label>Количество списков</Form.Label>
                        <Form.Control as="select" value={listCount} onChange={handleListCountChange}>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                        </Form.Control>
                    </Form.Group>
                    {listCount === 2 && (
                        <>
                            <Form.Group controlId="listName1">
                                <Form.Label>Название первого списка</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите название первого списка"
                                    value={listNames.list1}
                                    onChange={(e) => handleListNameChange(e, 'list1')}
                                />
                            </Form.Group>
                            <Form.Group controlId="listName2">
                                <Form.Label>Название второго списка</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите название второго списка"
                                    value={listNames.list2}
                                    onChange={(e) => handleListNameChange(e, 'list2')}
                                />
                            </Form.Group>
                        </>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрыть
                </Button>
                <Button variant="secondary" onClick={handleSaveClick}>
                    Сохранить изменения
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SettingsModal;



