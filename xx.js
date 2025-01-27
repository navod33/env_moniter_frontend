import React, { useState, useCallback, useEffect } from 'react';
import {
  Grid,
  Paper,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';











// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Sample data for Humidity
const humidityData = {
  labels: [],
  datasets: [
    {
      label: 'Humidity (%)',
      data: [],
      borderColor: '#2196f3',
      backgroundColor: 'rgba(33, 150, 243, 0.2)',
      borderWidth: 2,
      pointRadius: 4,
      tension: 0.4,
      fill: true,
    },
  ],
};

const temperatureData = {
  labels: [],
  datasets: [
    {
      label: 'Temperature (°C)',
      data: [],
      borderColor: '#ff5722',
      backgroundColor: 'rgba(255, 87, 34, 0.2)',
      borderWidth: 2,
      pointRadius: 4,
      tension: 0.4,
      fill: true,
    },
  ],
};

const temperatureOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Temperature Over Time' },
  },
  scales: {
    x: { title: { display: true, text: 'Time' } },
    y: { title: { display: true, text: 'Temperature (°C)' } },
  },
};

// Sample data for Temperature vs. Humidity
const temperatureHumidityData = {
  labels: [],
  datasets: [
    {
      label: 'Temperature (°C)',
      data: [],
      borderColor: '#ff5722',
      backgroundColor: 'rgba(255, 34, 34, 0.2)',
      borderWidth: 2,
      pointRadius: 4,
      tension: 0.4,
    },
    {
      label: 'Humidity (%)',
      data: [],
      borderColor: '#2196f3',
      backgroundColor: 'rgba(33, 150, 243, 0.2)',
      borderWidth: 2,
      pointRadius: 4,
      tension: 0.4,
    },
  ],
};

// Chart options
const humidityOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Current Humidity' },
  },
  scales: {
    x: { title: { display: true, text: 'Time' } },
    y: { title: { display: true, text: 'Humidity (%)' } },
  },
};

const temperatureHumidityOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Temperature vs. Humidity Over Time' },
  },
  scales: {
    x: { title: { display: true, text: 'Time' } },
    y: { title: { display: true, text: 'Value' } },
  },
};

const Dashboard = () => {
  const [liveData, setLiveData] = useState({ temperature: '--', humidity: '--' });
  const [humidityChartData, setHumidityChartData] = useState(humidityData);
  const [temperatureChartData, setTemperatureChartData] = useState(temperatureData);
  const [tempHumidityChartData, setTempHumidityChartData] = useState(temperatureHumidityData);
  const [sensorData, setSensorData] = useState([]); 

  
  const MAX_DATA_POINTS = 10; 
  const [lastUpdateTime, setLastUpdateTime] = useState(null); 

  useEffect(() => {
    if (sensorData && sensorData.temperature && sensorData.humidity) {
      const now = new Date();

      // Check if 1 minute has passed since the last update
      if (!lastUpdateTime || now - lastUpdateTime >= 60000) {
        setLastUpdateTime(now); // Update the last update time

        setHumidityChartData((prevData) => ({
          ...prevData,
          labels: [...prevData.labels, now.toLocaleTimeString()].slice(-MAX_DATA_POINTS),
          datasets: prevData.datasets.map((dataset) => ({
            ...dataset,
            data: [...dataset.data, sensorData.humidity].slice(-MAX_DATA_POINTS),
          })),
        }));

        setTemperatureChartData((prevData) => ({
          ...prevData,
          labels: [...prevData.labels, now.toLocaleTimeString()].slice(-MAX_DATA_POINTS),
          datasets: prevData.datasets.map((dataset) => ({
            ...dataset,
            data: [...dataset.data, sensorData.temperature].slice(-MAX_DATA_POINTS),
          })),
        }));

        setTempHumidityChartData((prevData) => ({
          ...prevData,
          labels: [...prevData.labels, now.toLocaleTimeString()].slice(-MAX_DATA_POINTS),
          datasets: prevData.datasets.map((dataset, index) => ({
            ...dataset,
            data: index === 0
              ? [...dataset.data, sensorData.temperature].slice(-MAX_DATA_POINTS)
              : [...dataset.data, sensorData.humidity].slice(-MAX_DATA_POINTS),
          })),
        }));
      }
    }
  }, [sensorData, lastUpdateTime]);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//localhost:4000`);

    ws.onopen = () => console.log('[WS] Connected');
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'update') {
          setLiveData(msg.data);
        }
      } catch (error) {
        console.error('[WS] Error parsing message:', error);
      }
    };
    ws.onclose = () => console.log('[WS] Disconnected');
    ws.onerror = (error) => console.error('[WS] Error:', error);

    return () => ws.close();
  }, []);


  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/sensor');
        if (response.ok) {
          const data = await response.json();
          const sortedData = data.data || [];
          
          // Sort in descending order (most recent first)
          const descendingSortedData = sortedData.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          // Take the last 10 entries
          const last10Data = descendingSortedData.slice(0, 10);

          // Sort the last 10 entries in ascending order
          const ascendingSortedLast10Data = last10Data.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );

          setSensorData(ascendingSortedLast10Data);
        } else {
          console.error('Failed to fetch sensor data');
        }
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    // Initial fetch
    fetchSensorData();

    // Set interval to refetch data every 1 minute (60,000 ms)
    const intervalId = setInterval(fetchSensorData, 60000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); 


  return (
    <Container maxWidth="xl" sx={{ my: 8, width: '95%', mx: 'auto' }}>
      <Grid container spacing={3}>
        {/* Humidity Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Current Humidity : {liveData.humidity} %
            </Typography>
            <Line data={humidityChartData} options={humidityOptions} />
          </Paper>
        </Grid>

        {/* Temperature Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400}}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Current Temperature : {liveData.temperature} °C
            </Typography>
            <Line data={temperatureChartData} options={temperatureOptions} />
          </Paper>
        </Grid>

        {/* Temperature vs Humidity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 10, display: 'flex', flexDirection: 'column', height: 500, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Temperature vs Humidity
            </Typography>
            <Line data={tempHumidityChartData} options={temperatureHumidityOptions} />
          </Paper>
        </Grid>

        </Grid>
    </Container>
  );
};

export default Dashboard;