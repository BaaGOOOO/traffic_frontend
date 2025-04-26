import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/register', {
        username,
        email,
        password
      });
      
      setSuccess('✅ Sikeres regisztráció! Most már be tudsz jelentkezni.');
      setError('');
    } catch (err) {
      console.error(err);
      setError('❌ Hiba történt a regisztráció során......');
      setSuccess('');
    }
  };

  return (
    <div className="auth-container">
      <h2>Regisztráció</h2>
      <input placeholder="Felhasználónév" value={username} onChange={e => setUsername(e.target.value)} /><br />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
      <input placeholder="Jelszó" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={handleRegister}>Regisztráció</button>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Register;
