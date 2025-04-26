import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

function AdminPage() {
  const [users, setUsers] = useState([]);  // Felhasználók lista
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });

  const token = localStorage.getItem('token');

  // Felhasználók lekérése
  const fetchUsers = useCallback(() => {
    axios.get('https://traffic-backend-6wxr.onrender.com/api/admin/data', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUsers(res.data))
    .catch(err => {
      console.error(err);
      setMessage('❌ Nincs jogosultságod az admin felülethez.');
    });
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Felhasználó törlésére szolgáló függvény
  const handleDelete = (userId) => {
    axios.delete(`https://traffic-backend-6wxr.onrender.com/api/admin/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => fetchUsers());
  };

  // Felhasználó szerepének módosítása
  const handleRoleChange = (userId, newRole) => {
    axios.patch(`https://traffic-backend-6wxr.onrender.com/api/admin/user/${userId}/role`, { role: newRole }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => fetchUsers());
  };

  // Új felhasználó hozzáadása
  const handleAddUser = () => {
    axios.post('https://traffic-backend-6wxr.onrender.com/api/admin/user', newUser, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      fetchUsers();
    }).catch(err => console.error('❌ Hiba új felhasználó létrehozásakor:', err));
  };

  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: '30px' }}>
      <h2>Admin felület</h2>
      <input
        placeholder="🔍 Keresés névre..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '20px', padding: '5px', width: '300px' }}
      />

      <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: '30px' }}>
        <thead>
          <tr>
            <th>Felhasználónév</th>
            <th>Email</th>
            <th>Szerep</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.user_id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select value={user.role} onChange={(e) => handleRoleChange(user.user_id, e.target.value)}>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(user.user_id)}>🗑️ Törlés</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>➕ Új felhasználó létrehozása</h3>
      <input placeholder="Név" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} /><br />
      <input placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} /><br />
      <input placeholder="Jelszó" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} type="password" /><br />
      <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
        <option value="user">user</option>
        <option value="admin">admin</option>
      </select><br />
      <button onClick={handleAddUser}>Felhasználó hozzáadása</button>

      {message && <p style={{ marginTop: '20px', color: 'red' }}>{message}</p>}
    </div>
  );
}

export default AdminPage;
