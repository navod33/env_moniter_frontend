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
  const [openDialog, setOpenDialog] = useState(false);
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [liveData, setLiveData] = useState({ temperature: '--', humidity: '--' });
  const [humidityChartData, setHumidityChartData] = useState(humidityData);
  const [temperatureChartData, setTemperatureChartData] = useState(temperatureData);
  const [tempHumidityChartData, setTempHumidityChartData] = useState(temperatureHumidityData);
  const [sensorData, setSensorData] = useState([]); 

console.log("sensorData", sensorData)

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleOpenPhoneDialog = () => {
    setPhoneDialogOpen(true);
  };

  const handleClosePhoneDialog = useCallback(() => {
    setPhoneDialogOpen(false);
  }, []);


  const handleSave = async () => {
    const payload = { temperature, humidity };
  
    try {
      const response = await fetch('http://localhost:4000/api/threshold/create', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Thresholds saved:', data);
        alert('Thresholds updated successfully!');
        handleCloseDialog();
      } else {
        const errorData = await response.json();
        console.error('Error saving thresholds:', errorData);
        alert(errorData.message || 'Failed to update thresholds.');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };
  

  const handleSavePhoneNumber = async () => {
    const payload = { phoneNumber };
  
    try {
      const response = await fetch('http://localhost:4000/api/phone/create', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('phone number saved:', data);
        alert('phone number updated successfully!');
        handleCloseDialog();
      } else {
        const errorData = await response.json();
        console.error('Error saving phone number:', errorData);
        alert(errorData.message || 'Failed to update phone number.');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };


  const MAX_DATA_POINTS = 10;

  useEffect(() => {
    if (liveData && liveData.temperature && liveData.humidity) {
      setHumidityChartData((prevData) => ({
        ...prevData,
        labels: [...prevData.labels, new Date().toLocaleTimeString()].slice(-MAX_DATA_POINTS),
        datasets: prevData.datasets.map((dataset) => ({
          ...dataset,
          data: [...dataset.data, liveData.humidity].slice(-MAX_DATA_POINTS),
        })),
      }));

      setTemperatureChartData((prevData) => ({
        ...prevData,
        labels: [...prevData.labels, new Date().toLocaleTimeString()].slice(-MAX_DATA_POINTS),
        datasets: prevData.datasets.map((dataset) => ({
          ...dataset,
          data: [...dataset.data, liveData.temperature].slice(-MAX_DATA_POINTS),
        })),
      }));

      setTempHumidityChartData((prevData) => ({
        ...prevData,
        labels: [...prevData.labels, new Date().toLocaleTimeString()].slice(-MAX_DATA_POINTS),
        datasets: prevData.datasets.map((dataset, index) => ({
          ...dataset,
          data: index === 0
            ? [...dataset.data, liveData.temperature].slice(-MAX_DATA_POINTS)
            : [...dataset.data, liveData.humidity].slice(-MAX_DATA_POINTS),
        })),
      }));
    }
  }, [liveData]);

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
          setSensorData(data.data || []); // Set the fetched sensor data to state
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
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400, backgroundColor: '#FCF7F8' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Current Humidity : {liveData.humidity} %
            </Typography>
            <Line data={humidityChartData} options={humidityOptions} />
          </Paper>
        </Grid>

        {/* Temperature Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400, backgroundColor: '#FCF7F8' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Current Temperature : {liveData.temperature} °C
            </Typography>
            <Line data={temperatureChartData} options={temperatureOptions} />
          </Paper>
        </Grid>

        {/* Temperature vs Humidity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', backgroundColor: '#FCF7F8' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Temperature vs Humidity
            </Typography>
            <Line data={tempHumidityChartData} options={temperatureHumidityOptions} />
          </Paper>
        </Grid>

        </Grid>
        <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh" 
        bgcolor="#f5f5f5" 
          >
      <TableContainer
        component={Paper}
        elevation={3} // Adds shadow to the paper
        sx={{
          mt: 4,
          width: 800,
          borderRadius: 3, // Rounds corners of the table
          overflow: "hidden", // Ensures no content overflows
        }}
      >
        <Typography
          variant="h6"
          sx={{
            p: 2,
            bgcolor: "#1976d2", // MUI primary blue
            color: "white", // White text
            textAlign: "center", // Centers the title
            fontWeight: "bold", // Bold font
            textTransform: "uppercase", // Makes the text uppercase
          }}
        >
          Sensor Data
        </Typography>
        <Table>
      <TableHead>
        <TableRow
          sx={{
            bgcolor: "#e3f2fd", // Light blue background
          }}
        >
          <TableCell><strong>Date</strong></TableCell>
          <TableCell><strong>Time</strong></TableCell>
          <TableCell><strong>Temperature (°C)</strong></TableCell>
          <TableCell><strong>Humidity (%)</strong></TableCell>
          <TableCell><strong>Status</strong></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sensorData?.map((item) => {
          const date = new Date(item.createdAt);
          return (
            <TableRow
              key={item.id}
              sx={{
                "&:nth-of-type(odd)": {
                  bgcolor: "#f9f9f9", // Alternate row background color
                },
                "&:nth-of-type(even)": {
                  bgcolor: "#ffffff",
                },
              }}
            >
              <TableCell>{date.toLocaleDateString()}</TableCell>
              <TableCell>{date.toLocaleTimeString()}</TableCell>
              <TableCell>{item.temperature.toFixed(1)}</TableCell>
              <TableCell>{item.humidity.toFixed(1)}</TableCell>
              <TableCell
                sx={{
                  color:
                    item.status === "NORMAL"
                      ? "green"
                      : item.status === "WARNING"
                      ? "orange"
                      : "red", // Color coding for status
                  fontWeight: "bold", // Makes status stand out
                }}
              >
                {item.status}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
</Box>




      {/* Update Thresholds Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update Thresholds</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Temperature"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Humidity"
            value={humidity}
            onChange={(e) => setHumidity(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Phone Number Dialog */}
      <Dialog open={phoneDialogOpen} onClose={handleClosePhoneDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Save Phone Number</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePhoneDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSavePhoneNumber} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
