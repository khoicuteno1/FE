import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Sidebar from '../components/Sidebar';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000'];

const Statistics = () => {
  const [lops, setLops] = useState([]);  
  const [monhocs, setMonHocs] = useState([]);

  const [selectedSemester, setSelectedSemester] = useState('all');

  const gradeDistribution = [
    { range: '0-2', count: 2 },
    { range: '2-4', count: 5 },
    { range: '4-5', count: 8 },
    { range: '5-6', count: 15 },
    { range: '6-7', count: 20 },
    { range: '7-8', count: 25 },
    { range: '8-9', count: 15 },
    { range: '9-10', count: 10 },
  ];

  const gradeClassification = [
    { name: 'A', value: 30 },
    { name: 'B', value: 25 },
    { name: 'C', value: 20 },
    { name: 'D', value: 15 },
    { name: 'F', value: 10 },
  ];

  const subjectStats = [
    {
      subject: 'Toán cao cấp',
      students: 100,
      average: 7.5,
      passRate: '85%',
      highest: 9.8,
      lowest: 4.0,
    },
    // Thêm các môn học khác ở đây
  ];
useEffect(() => {
    const fetchLops = async () => {
      try {
        const response = await fetch('https://be1-fizs.onrender.com/lop');
        const data = await response.json();
        setLops(data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu lớp:', error);
      }
    };
    const fetchMonHoc = async () => {
      try {
        const response = await fetch('https://be1-fizs.onrender.com/monhoc');
        const data = await response.json();
        setMonHocs(data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu lớp:', error);
      }
    };
    fetchMonHoc();
   
    fetchLops();
  }, []);
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
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4">
              Thống kê điểm
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ minWidth: 200 }}>
               <InputLabel>Lớp</InputLabel>
                           <Select defaultValue="">
                             {Array.isArray(lops) && lops.length > 0 ? (
                               lops.map((cls) => (
                                 <MenuItem key={cls.MaLop} value={cls.MaLop}>
                                   {cls.TenLop}
                                 </MenuItem>
                               ))
                             ) : (
                               <MenuItem disabled>Không có lớp nào</MenuItem>
                             )}
                           </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Môn học</InputLabel>
                       <Select defaultValue="">
                         {Array.isArray(monhocs) && monhocs.length > 0 ? (
                           monhocs.map((monhoc) => (
                             <MenuItem key={monhoc.MaMH} value={monhoc.MaMH}>
                               {monhoc.TenMH}
                             </MenuItem>
                           ))
                         ) : (
                           <MenuItem disabled>Không có môn học nào</MenuItem>
                         )}
                       </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Học kỳ</InputLabel>
                <Select
                  value={selectedSemester}
                  label="Học kỳ"
                  onChange={(e) => setSelectedSemester(e.target.value)}
                >
                  <MenuItem value="all">Tất cả học kỳ</MenuItem>
                  <MenuItem value="1">Học kỳ 1</MenuItem>
                  <MenuItem value="2">Học kỳ 2</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Điểm trung bình
                </Typography>
                <Typography variant="h3">7.50</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Tỷ lệ đạt
                </Typography>
                <Typography variant="h3">85%</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Điểm cao nhất
                </Typography>
                <Typography variant="h3">9.80</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Điểm thấp nhất
                </Typography>
                <Typography variant="h3">4.00</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Phân bố điểm
                </Typography>
                <Box sx={{ width: '100%', height: 300 }}>
                  <BarChart
                    width={700}
                    height={300}
                    data={gradeDistribution}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Số sinh viên" />
                  </BarChart>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Xếp loại
                </Typography>
                <Box sx={{ width: '100%', height: 300 }}>
                  <PieChart width={300} height={300}>
                    <Pie
                      data={gradeClassification}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {gradeClassification.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ mt: 3, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Chi tiết thống kê
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Môn học</TableCell>
                    <TableCell align="center">Số SV</TableCell>
                    <TableCell align="center">Điểm TB</TableCell>
                    <TableCell align="center">Tỷ lệ đạt</TableCell>
                    <TableCell align="center">Điểm cao nhất</TableCell>
                    <TableCell align="center">Điểm thấp nhất</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subjectStats.map((row) => (
                    <TableRow key={row.subject}>
                      <TableCell component="th" scope="row">
                        {row.subject}
                      </TableCell>
                      <TableCell align="center">{row.students}</TableCell>
                      <TableCell align="center">{row.average}</TableCell>
                      <TableCell align="center">{row.passRate}</TableCell>
                      <TableCell align="center">{row.highest}</TableCell>
                      <TableCell align="center">{row.lowest}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Statistics; 