// src/WeatherImpactChart.js
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

function WeatherImpactChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('https://traffic-backend-6wxr.onrender.com/statistics/weather-impact')
      .then(res => setData(res.data))
      .catch(err => console.error("❌ Hiba az időjárásos statisztika lekérésekor:", err));
  }, []);

  const chartData = {
    labels: data.map(item => item.weather_type),
    datasets: [{
      label: 'Balesetek száma időjárás szerint',
      data: data.map(item => item.balesetek_szama),
      backgroundColor: '#76b5c5'
    }]
  };

  return (
    <div style={{ width: '700px', margin: '0 auto', marginTop: '30px' }}>
      <h2 style={{ textAlign: 'center' }}>🌤️ Balesetek eloszlása időjárás szerint</h2>
      <Bar data={chartData} />
      <p style={{ fontStyle: 'italic', marginTop: '10px', textAlign: 'center' }}>
        *Ez a kimutatás megmutatja, hogy milyen időjárási körülmények között történt a legtöbb baleset.*
      </p>
    </div>
  );
}

export default WeatherImpactChart;
