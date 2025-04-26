// src/AddAccident.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddAccident() {
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [accidentType, setAccidentType] = useState('Ütközés');
  const [weatherTypes, setWeatherTypes] = useState([]);
  const [weatherId, setWeatherId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/weather-types')
      .then(res => setWeatherTypes(res.data))
      .catch(err => console.error('❌ Hiba az időjárás lekérésénél:', err));
  }, []);

  const handleSubmit = () => {
    if (!location || !city || !date || !time || !accidentType || !weatherId) {
      setError('❌ Minden mező kitöltése kötelező!');
      setSuccess('');
      return;
    }

    const accident = {
      location,
      city,
      date,
      time,
      accident_type: accidentType,
      weather_id: weatherId
    };

    axios.post('http://localhost:5000/api/accidents/add', accident)
      .then(() => {
        setSuccess('✅ A baleset sikeresen rögzítve lett!');
        setError('');
        setLocation('');
        setCity('');
        setDate('');
        setTime('');
        setAccidentType('Ütközés');
        setWeatherId('');
      })
      .catch(() => {
        setError('❌ Hiba a rögzítés során.');
        setSuccess('');
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <div style={{ textAlign: 'left', width: '300px' }}>
        <h2 style={{ textAlign: 'center' }}>➕ Baleset rögzítése</h2>

        <label>📍 Cím:</label><br />
        <input
          style={{ width: '100%', marginBottom: '15px' }}
          placeholder="Pl: Rákóczi út 115"
          value={location}
          onChange={e => setLocation(e.target.value)}
        /><br />

        <label>🏙️ Város:</label><br />
        <input
          style={{ width: '100%', marginBottom: '15px' }}
          placeholder="Pl: Budapest"
          value={city}
          onChange={e => setCity(e.target.value)}
        /><br />

        <label>📅 Dátum:</label><br />
        <input
          style={{ width: '100%', marginBottom: '15px' }}
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        /><br />

        <label>🕒 Időpont:</label><br />
        <input
          style={{ width: '100%', marginBottom: '15px' }}
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
        /><br />

        <label>🚗 Baleset típusa:</label><br />
        <select
          style={{ width: '100%', marginBottom: '15px' }}
          value={accidentType}
          onChange={e => setAccidentType(e.target.value)}
        >
          <option value="Ütközés">Ütközés</option>
          <option value="Gázolás">Gázolás</option>
          <option value="Borulás">Borulás</option>
          <option value="Koccanás">Koccanás</option>
          <option value="Tömegbaleset">Tömegbaleset</option>
        </select><br />

        <label>⛅ Időjárás:</label><br />
        <select
          style={{ width: '100%', marginBottom: '15px' }}
          value={weatherId}
          onChange={e => setWeatherId(e.target.value)}
        >
          <option value="">-- Válassz időjárást --</option>
          {weatherTypes.map(w => (
            <option key={w.weather_id} value={w.weather_id}>{w.weather_type}</option>
          ))}
        </select><br />

        <button onClick={handleSubmit} style={{ width: '100%' }}>Baleset mentése</button>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
      </div>
    </div>
  );
}

export default AddAccident;
