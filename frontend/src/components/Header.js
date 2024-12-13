import React, { useEffect, useState } from 'react';
import '../App.css';
import api from '../api';
import SettingsModal from './SettingsModal';

const Header = ({ settings, setSettings }) => {
    const [date, setDate] = useState('');
    const [phrase, setPhrase] = useState('');
    const [inputDate, setInputDate] = useState('');
    const [randomMovie, setRandomMovie] = useState('');
    const [showModal, setShowModal] = useState(false); // Состояние для модального окна

    useEffect(() => {
        fetchPhrase(inputDate);
        fetchMovieOfTheDay();
    }, [inputDate]);

    const fetchPhrase = async (date) => {
        try {
            const url = date ? `/phrase?date=${date}` : '/phrase';
            const response = await api.get(url);
            setDate(response.data.date);
            setPhrase(response.data.phrase);
        } catch (error) {
            console.error('There was an error fetching the phrase!', error);
        }
    };

    const fetchMovieOfTheDay = async () => {
        try {
            const response = await api.get('/movie-of-the-day/');
            setRandomMovie(response.data.movie.title);
        } catch (error) {
            console.error('There was an error fetching the movie of the day!', error);
        }
    };

    const generateMovieOfTheDay = async () => {
        try {
            const response = await api.post('/generate-movie-of-the-day/');
            setRandomMovie(response.data.movie.title);
        } catch (error) {
            console.error('There was an error generating the movie of the day!', error);
        }
    };

    const handleDateChange = (event) => {
        setInputDate(event.target.value);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Сохранение настроек
    const handleSaveSettings = (newSettings) => {
        setSettings(newSettings);
        fetchPhrase(inputDate);
        handleCloseModal();
    };

    return (
        <div className="App-header text-center border p-3 mb-3">
            <div className="info-container p-3">
                <div className="d-flex align-items-center justify-content-center position-relative">
                    <h1 className="text-light mb-0">{date}</h1>
                    <button className="btn btn-dark ml-auto position-absolute end-0 btn-border" onClick={handleOpenModal}>
                        Настройки
                    </button>
                </div>
                <h2 className="text-light">{phrase}</h2>
                <div className="d-flex align-items-center">
                    <h3 className="text-light mb-0 flex-grow-1">Фильм на сегодня: {randomMovie}</h3>
                    <button className="btn btn-dark ml-2 btn-border" onClick={generateMovieOfTheDay}>
                        Сгенерировать фильм
                    </button>
                </div>
            </div>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Введите дату (DD-MM-YYYY)"
                value={inputDate}
                onChange={handleDateChange}
            />
            <SettingsModal
                show={showModal}
                handleClose={handleCloseModal}
                handleSave={handleSaveSettings}
                settings={settings}
            />
        </div>
    );
};

export default Header;


