import React, { useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
  } from 'chart.js';
  
  ChartJS.register(ArcElement, Tooltip, Legend);
  
function StatisticsPage() {
  const [stats, setStats] = useState([]);
  const [accidentTypes] = useState([
    'Koccanás', 'Borulás', 'Ütközés', 'Gázolás', 'Tömegbaleset'
  ]);
  
  const [selectedTypes, setSelectedTypes] = useState([]);
  

  const toggleType = (type) => {
    if (type === 'Összes') {
      // Ha már minden ki van pipálva, akkor kikapcsolja az összest
      if (selectedTypes.length === accidentTypes.length) {
        setSelectedTypes([]);
      } else {
        // Különben kijelöli az összeset
        setSelectedTypes(accidentTypes);
      }
    } else {
      setSelectedTypes((prev) => {
        const updated = prev.includes(type)
          ? prev.filter(t => t !== type)
          : [...prev, type];
  
        return updated;
      });
    }
  };
  
  console.log("Küldött típusok:", selectedTypes);

  const fetchStats = async () => {
    try {
      // Ha nincs kiválasztott típus, ne küldjön üres lekérdezést
      if (selectedTypes.length === 0) {
        setStats([]);
        return;
      }
  
      const response = await axios.get('http://localhost:5000/statistics/filtered', {
        params: {
          types: selectedTypes.join(','), // pl. "Borulás,Ütközés"
        }
      });
      setStats(response.data);
    } catch (err) {
      console.error('Hiba a lekérdezés során:', err);
    }
  };
  

  const data = {
    labels: stats.map(stat => stat.accident_type),
    datasets: [{
      label: 'Balesetek száma',
      data: stats.map(stat => stat.count),
      backgroundColor: ['#ff6384', '#36a2eb', '#4bc0c0', '#ffcd56', '#9966ff'],
    }]
  };

  return (
    <div>
      <h2>Baleseti statisztikák</h2>

      <div>
        <label>Baleset típusa:</label><br />
        <label>
          <input type="checkbox" onChange={() => toggleType('Összes')} checked={selectedTypes.length === accidentTypes.length} />
          Összes
        </label>
        {accidentTypes.map(type => (
          <label key={type} style={{ marginLeft: '10px' }}>
            <input
              type="checkbox"
              value={type}
              checked={selectedTypes.includes(type)}
              onChange={() => toggleType(type)}
            />
            {type}
          </label>
        ))}
      </div>

      <div>
        <button onClick={fetchStats}>Lekérdezés</button>
      </div>

      {stats.length > 0 ? (
        <div style={{ width: '400px', marginTop: '20px' }}>
          <Pie data={data} />
        </div>
      ) : (
        <p>Nincsenek statisztikai adatok.</p>
      )}
    </div>
  );
}

export default StatisticsPage;
