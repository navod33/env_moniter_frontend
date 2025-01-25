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
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(20); 

  const MAX_DATA_POINTS = 10; // Keep only the last 10 data points
  const [lastUpdateTime, setLastUpdateTime] = useState(null); // Track the last chart update time



  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/sensor');
        if (response.ok) {
          const data = await response.json();
          setSensorData(data.data || []); 
        } else {
          console.error('Failed to fetch sensor data');
        }
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    fetchSensorData();
  }, []);
  

  return (
    <Container maxWidth="xl" sx={{ my: 8, width: '95%', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 5 }}>
        <Button variant="contained" onClick={handleOpenDialog}>
          Update Thresholds
        </Button>
        <Button variant="contained" onClick={handleOpenPhoneDialog} sx={{ ml: 2 }}>
          Save Phone Number
        </Button>
      </Box>

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
   

    </Container>
  );
};

export default Dashboard;