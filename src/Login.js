import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://traffic-backend-6wxr.onrender.com/api/login', {
        username,
        password
      });

      setMessage(res.data.message || 'Sikeres bejelentkezés!');
      localStorage.setItem('token', res.data.token);

      if (onLogin) onLogin(username, res.data.role);


      // ✅ Átirányítás a /map oldalra
      navigate('/map');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Hibás felhasználónév vagy jelszó.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Bejelentkezés</h2>
      <input placeholder="Felhasználónév" value={username} onChange={e => setUsername(e.target.value)} /><br />
      <input type="password" placeholder="Jelszó" value={password} onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={handleLogin}>Bejelentkezés</button>
      <p>{message}</p>
    </div>
  );
}

export default Login;
