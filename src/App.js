import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Map from './Map';
import StatisticsPage from './StatisticsPage';
import CityStatistics from './CityStatistics';
import Register from './Register';
import Login from './Login';
import HourlyAccidents from './HourlyAccidents'; // ÚJ 🔥
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TopDaysChart from './TopDaysChart';
import WeatherImpactChart from './WeatherImpactChart';
import AdminPage from './AdminPage';
import AddAccident from './AddAccident';


// 🔹 Egyszerű főoldal, ami mindig látszik
function HomePage() {
  return (
    <div>
      <h1>Üdvözöllek az Adatelemző alkalmazásban!</h1>
      <p>
        Ez az alkalmazás az <strong>Óbudai Egyetem</strong> szakdolgozati projektje keretében készült, melynek célja a
        <strong> városi közlekedési balesetek adatainak elemzése és vizualizációja</strong>.
      </p>
      <p>
        A rendszer képes különböző típusú statisztikák készítésére, baleseti adatok rögzítésére és azok valós idejű
        megjelenítésére egy interaktív térképen. A felhasználók áttekinthetik a baleseteket város, időpont, balesettípus és
        időjárási viszonyok alapján is.
      </p>
    </div>
  );
}

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // ÚJ 🔥

  const handleLogin = (username, role) => {
    setLoggedInUser(username);
    setUserRole(role); // 🔥 elmentjük a szerepet
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div>
        {/* 🔹 Navigációs menü */}
        <nav>
          <Link to="/">Főoldal</Link>
          {loggedInUser && (
            <>
              <Link to="/map">Térkép</Link>
              <Link to="/statisztikak">Baleseti statisztikák</Link>
              <Link to="/varos-statisztika">Városi statisztika</Link>
              <Link to="/hourly-stats">Óránkénti statisztika</Link>
              <Link to="/topnapok">Top napok</Link>
              <Link to="/időjáras">Időjárás statisztika</Link>
              <Link to="/rogzites">Baleset rögzítése</Link>

              {userRole === 'admin' && (
                <Link to="/admin">Admin</Link>  // 🔐 CSAK ADMIN LÁTJA
              )}
            </>
          )}

          {!loggedInUser && (
            <>
              <Link to="/register">Regisztráció</Link>
              <Link to="/login">Bejelentkezés</Link>
            </>
          )}
          {loggedInUser && (
            <>
              <span>👤 {loggedInUser}</span>
              <button onClick={handleLogout}>Kijelentkezés</button>
            </>
          )}
        </nav>

        {/* 🔹 Útvonalak */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          {loggedInUser && (
            <>
              <Route path="/map" element={<MainPage />} />
              <Route path="/statisztikak" element={<StatisticsPage />} />
              <Route path="/varos-statisztika" element={<CityStatistics />} />
              <Route path="/hourly-stats" element={<HourlyAccidents />} /> {/* ÚJ */}
              <Route path="/topnapok" element={<TopDaysChart />} />
              <Route path="/időjáras" element={<WeatherImpactChart />} />
              <Route path="/rogzites" element={<AddAccident />} />
              {userRole === 'admin' && <Route path="/admin" element={<AdminPage />} />} {/* csak admin! */}
            </>
          )}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </div>
    </Router>
  );
}

// 🔹 Térképes főoldal (csak bejelentkezve használható)
function MainPage() {
  const [accidents, setAccidents] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedType, setSelectedType] = useState('Összes');
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios.get('https://traffic-backend-6wxr.onrender.com/cities')
      .then(response => setCities(response.data))
      .catch(error => console.error("Hiba a városok lekérésekor:", error));
  }, []);

  const fetchAccidents = () => {
    axios.get('https://traffic-backend-6wxr.onrender.com/accidents', {
      params: { date: selectedDate, accident_type: selectedType, city: selectedCity }
    })
      .then(response => {
        setAccidents(response.data);
      })
      .catch(error => console.error("Hiba az adatok lekérésekor:", error));
  };

  return (
    <div>
      <h1>Baleseti adatok</h1>

      <label>Dátum:
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
      </label>

      <label>Baleset típusa:
        <select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
          <option value="Összes">Összes</option>
          <option value="Gázolás">Gázolás</option>
          <option value="Ütközés">Ütközés</option>
          <option value="Borulás">Borulás</option>
          <option value="Koccanás">Koccanás</option>
          <option value="Tömegbaleset">Tömegbaleset</option>
        </select>
      </label>

      <label>Város:
        <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
          <option value="">Összes</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>{city}</option>
          ))}
        </select>
      </label>

      <button onClick={fetchAccidents}>Lekérdezés</button>

      <h2>Baleseti térkép</h2>
      <Map accidents={accidents} />
    </div>
  );
}

export default App;
