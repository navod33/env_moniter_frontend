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
      
            <Line data={humidityChartData} options={humidityOptions} />
          </Paper>
        </Grid>

        {/* Temperature Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400}}>
   
            <Line data={temperatureChartData} options={temperatureOptions} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 10, display: 'flex', flexDirection: 'column', height: 500, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Line data={tempHumidityChartData} options={temperatureHumidityOptions} />
          </Paper>
        </Grid>

        </Grid>
    </Container>
  );
};

export default Dashboard;