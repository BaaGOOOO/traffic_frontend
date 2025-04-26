import React, { useEffect, useState } from 'react';
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

function HourlyAccidents() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    axios.get('https://traffic-backend-6wxr.onrender.com/statistics/by-hour')
      .then(res => setStats(res.data))
      .catch(err => console.error('Hiba a statisztika lekérésekor:', err));
  }, []);

  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [{
      label: 'Balesetek száma óránként',
      data: Array.from({ length: 24 }, (_, i) => {
        const found = stats.find(s => parseInt(s.hour) === i);
        return found ? parseInt(found.count) : 0;
      }),
      backgroundColor: 'rgba(75, 192, 192, 0.7)'
    }]
  };

  return (
    <div>  
    <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
    Balesetek eloszlása óránként
    </h2>
      <div style={{ width: '800px', margin: '0 auto' }}>
        <Bar data={chartData} />
      </div>
    </div>
  );
}

export default HourlyAccidents;
