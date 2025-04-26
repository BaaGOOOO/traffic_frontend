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

function TopDaysChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('https://traffic-backend-6wxr.onrender.com/statistics/top-days')
      .then(res => setData(res.data))
      .catch(err => console.error("❌ Hiba a top napok lekérésénél:", err));
  }, []);

  const chartData = {
    labels: data.map(item => new Date(item.day).toISOString().split('T')[0]),
    datasets: [{
      label: 'Balesetek száma',
      data: data.map(item => item.count),
      backgroundColor: '#3498db'
    }]
  };
  

  return (
    <div style={{ width: '600px', margin: '0 auto', marginTop: '30px' }}>
      <h2 style={{ textAlign: 'center' }}>📅 Napok a legtöbb balesettel (Top 5)</h2>
      <Bar data={chartData} />
      <p style={{ fontStyle: 'italic', marginTop: '10px', textAlign: 'center' }}>
        *A kimutatás generált adatokon alapszik, így az értékek alacsonyak lehetnek. A cél a módszer bemutatása valós statisztikai elemzésekhez.*
      </p>
    </div>
  );
}

export default TopDaysChart;
