// src/CityStatistics.js
import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function CityStatistics() {
  const [stats, setStats] = useState([]);
  const [accidentTypes] = useState(['Koccanás', 'Borulás', 'Ütközés', 'Gázolás', 'Tömegbaleset']);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const toggleType = (type) => {
    if (type === 'Összes') {
      setSelectedTypes(accidentTypes);
    } else {
      setSelectedTypes(prev =>
        prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
      );
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('https://traffic-backend-6wxr.onrender.com/statistics/city-count', {
        params: {
          from: fromDate,
          to: toDate,
          types: selectedTypes.join(',')
        }
      });
      setStats(response.data);
    } catch (err) {
      console.error('❌ Hiba város statisztika lekéréskor:', err);
    }
  };

  const chartData = {
    labels: stats.map(item => item.city),
    datasets: [{
      label: 'Balesetek száma',
      data: stats.map(item => item.count),
      backgroundColor: '#36a2eb'
    }]
  };

  return (
    <div>
      <h2>Városonkénti balesetek</h2>

      <div>
        <label><input type="checkbox" onChange={() => toggleType('Összes')} checked={selectedTypes.length === accidentTypes.length} /> Összes</label>
        {accidentTypes.map(type => (
          <label key={type} style={{ marginLeft: '10px' }}>
            <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => toggleType(type)} />
            {type}
          </label>
        ))}
      </div>

      <div style={{ marginTop: '10px' }}>
        <label>Dátumtól: <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} /></label>
        <label style={{ marginLeft: '10px' }}>Dátumig: <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} /></label>
        <button onClick={fetchStats}>Szűrés</button>
      </div>

      {stats.length > 0 ? (
        <div style={{ width: '600px', marginTop: '20px' }}>
          <Bar data={chartData} />
        </div>
      ) : <p>Nincsenek statisztikai adatok.</p>}
    </div>
  );
}

export default CityStatistics;
