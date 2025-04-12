import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Sidebar from '../components/Sidebar';

const StatCard = ({ icon, value, label }) => (
  <Paper
    elevation={2}
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      bgcolor: 'white',
      borderRadius: 2,
    }}
  >
    <Box sx={{ color: '#1976d2', mb: 1 }}>{icon}</Box>
    <Typography variant="h4" component="div" gutterBottom>
      {value}
    </Typography>
    <Typography color="text.secondary">{label}</Typography>
  </Paper>
);


const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [subjectsCount, setSubjectsCount] = useState(0);
  // Fetch the total number of students from the API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('https://be1-fizs.onrender.com/sinhvien'); // Replace with your actual API URL
        const data = await response.json();
        setTotalStudents(data.length); // Assuming data is an array of students
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };
    const fetchMonHoc = async () => {
      try {
        const response = await fetch('https://be1-fizs.onrender.com/MonHoc'); // Replace with your actual API URL
        const data = await response.json();
        setSubjectsCount(data.length); // Assuming data is an array of students
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };
    fetchMonHoc();
    fetchStudents();
  }, []); // Empty dependency array ensures it only runs once

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: '240px',
          bgcolor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4 }}>
            Tổng quan
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <StatCard
                icon={<PeopleIcon sx={{ fontSize: 40 }} />}
                value={totalStudents} // Dynamically display the number of students
                label="Tổng số sinh viên"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <StatCard
                icon={<MenuBookIcon sx={{ fontSize: 40 }} />}
                value={subjectsCount}
                label="Môn học"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
