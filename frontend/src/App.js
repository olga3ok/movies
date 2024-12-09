import React, { useEffect, useState } from 'react';
import api from './api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import MovieList from './components/MovieList';

function App() {
    const [settings, setSettings] = useState({
        listCount: 1,
        listNames: { list1: 'Список 1', list2: 'Список 2' }
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/settings/');
                console.log('Fetched settings:', response.data); // Временное логирование
                const fetchedSettings = {
                    listCount: response.data.list_count,
                    listNames: {
                        list1: response.data.list1_name,
                        list2: response.data.list2_name
                    }
                };
                setSettings(fetchedSettings);
            } catch (error) {
                console.error('There was an error fetching the settings!', error);
            }
        };

        fetchSettings();
    }, []);

    return (
        <div className="App container">
            <Header settings={settings} setSettings={setSettings} />
            <div className="row border p-3">
                {settings.listCount === 1 ? (
                    <MovieList listId={1} listName={""} className="col-12" />
                ) : (
                    <>
                        <MovieList listId={1} listName={settings.listNames.list1} className="col-6" />
                        <MovieList listId={2} listName={settings.listNames.list2} className="col-6" />
                    </>
                )}
            </div>
        </div>
    );
}

export default App;




