import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
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

// Sample data for CO2 levels
const co2Data = {
  labels: ['10:00', '10:10', '10:20', '10:30', '10:40', '10:50'],
  datasets: [
    {
      label: 'CO2 Level (ppm)',
      data: [400, 420, 410, 430, 440, 450],
      borderColor: '#4caf50',
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      borderWidth: 2,
      pointRadius: 4,
      tension: 0.4,
    },
  ],
};

// Sample data for temperature
const temperatureData = {
  labels: ['10:00', '10:10', '10:20', '10:30', '10:40', '10:50'],
  datasets: [
    {
      label: 'Temperature (°C)',
      data: [25, 26, 27, 28, 29, 30],
      borderColor: '#ff5722',
      backgroundColor: 'rgba(255, 87, 34, 0.2)',
      borderWidth: 2,
      pointRadius: 4,
      tension: 0.4,
    },
  ],
};

// Chart options for both charts
const co2Options = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'CO2 Levels Over Time' },
  },
  scales: {
    x: { title: { display: true, text: 'Time' } },
    y: { title: { display: true, text: 'CO2 Level (ppm)' } },
  },
};

const temperatureOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Temperature Over Time' },
    tooltip: {
      callbacks: {
        label: (context) => `Temperature: ${context.raw}°C`,
      },
    },
    annotation: {
      annotations: {
        currentValue: {
          type: 'label',
          xValue: '10:50',
          yValue: 30,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderColor: '#ff5722',
          borderWidth: 1,
          content: ['30°C'],
          font: { size: 14 },
        },
      },
    },
  },
  scales: {
    x: { title: { display: true, text: 'Time' } },
    y: { title: { display: true, text: 'Temperature (°C)' } },
  },
};

const Dashboard = () => {
  const isFullWidth = true; // Replace this with your condition

  return (
    <Container maxWidth={isFullWidth ? 'xl' : 'md'} sx={{ my: 8, width: '95%', mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 5 }} gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* CO2 Levels Chart */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 350,
              backgroundColor: 'lightgray',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Current CO2 Level
            </Typography>
            <Line data={co2Data} options={co2Options} />
          </Paper>
        </Grid>

        {/* Temperature Chart */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 350,
              backgroundColor: 'lightgray',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Current Temperature
            </Typography>
            <Line data={temperatureData} options={temperatureOptions} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
