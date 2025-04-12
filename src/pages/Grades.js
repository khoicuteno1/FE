import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Sidebar from '../components/Sidebar';

const Grades = () => {
  const [monhocs, setMonHocs] = useState([]);  
  const [diems, setDiems] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(''); // Để lưu môn học được chọn
  const [filteredDiems, setFilteredDiems] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  
  

 
  useEffect(() => {
    if (selectedSubject) {
      const filteredData = diems.filter(diem => diem.MaMH === selectedSubject);
      setFilteredDiems(filteredData);
    } else {
      setFilteredDiems(diems); // Nếu không chọn môn học, hiển thị tất cả
    }
  }, [selectedSubject, diems]);

  const handleGradeChange = (maSV, field, value) => {
    const newValue = parseFloat(value);
  
    setFilteredDiems((prevDiems) =>
      prevDiems.map((diem) => {
        if (diem.MaSV === maSV) {
          const updatedDiem = {
            ...diem,
            [field === 'attendance' ? 'DiemCC' : field === 'midterm' ? 'DiemGK' : 'DiemCK']: newValue,
          };
  
          // Tính lại điểm tổng (ví dụ: 10% CC + 30% GK + 60% CK)
          const cc = parseFloat(updatedDiem.DiemCC) || 0;
          const gk = parseFloat(updatedDiem.DiemGK) || 0;
          const ck = parseFloat(updatedDiem.DiemCK) || 0;
  
          updatedDiem.DiemTong = +(cc * 0.1 + gk * 0.3 + ck * 0.6).toFixed(2);
          console.log('Sending update for MaSV:', updatedDiem.MaSV);
          // ✅ Gọi API cập nhật điểm trên server
          fetch(`https://be1-fizs.onrender.com/diem/${updatedDiem.MaSV}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              MaMH: updatedDiem.MaMH,
              DiemCC: updatedDiem.DiemCC,
              DiemGK: updatedDiem.DiemGK,
              DiemCK: updatedDiem.DiemCK,
              DiemTong: updatedDiem.DiemTong,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log('✅ Server:', data.message);
            })
            .catch((err) => {
              console.error('❌ Lỗi cập nhật:', err.message);
            });
  
          return updatedDiem;
        }
        return diem;
      })
    );
  };
  
  const handleSave = () => {
    setOpenSnackbar(true);
    // Thêm logic lưu điểm vào đây
  };

  useEffect(() => {
    

    const fetchMonHoc = async () => {
      try {
        const response = await fetch('https://be1-fizs.onrender.com/monhoc');
        const data = await response.json();
        setMonHocs(data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu môn học:', error);
      }
    };

    const fetchDiem = async () => {
      try {
        const response = await fetch('https://be1-fizs.onrender.com/diem');
        const data = await response.json();
        setDiems(data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu điểm:', error);
      }
    };

    fetchDiem();
    fetchMonHoc();
    
  }, []);

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

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
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a2f4d' }}>
              Nhập điểm
            </Typography>
          </Box>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              

              <FormControl fullWidth>
                <InputLabel>Môn học</InputLabel>
                <Select
                  value={selectedSubject}
                  onChange={handleSubjectChange} // Thêm sự kiện thay đổi môn học
                  defaultValue=""
                >
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
            </Box>

            {selectedSubject ? ( // Kiểm tra xem có môn học được chọn không
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Mã Sinh Viên</TableCell>
                        <TableCell>Mã Môn Học</TableCell>
                        <TableCell align="center">Điểm chuyên cần (10%)</TableCell>
                        <TableCell align="center">Điểm giữa kỳ (30%)</TableCell>
                        <TableCell align="center">Điểm cuối kỳ (60%)</TableCell>
                        <TableCell align="center">Tổng kết</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredDiems.map((diem) => (
                        <TableRow key={diem.id}>
                          <TableCell>{diem.MaSV}</TableCell>
                          <TableCell>{diem.MaMH}</TableCell>
                          <TableCell align="center">
                            <TextField
                              type="number"
                              value={diem.DiemCC}
                              onChange={(e) => handleGradeChange(diem.MaSV, 'attendance', e.target.value)}
                              inputProps={{ min: 0, max: 10, step: 0.1 }}
                              sx={{ width: '100px' }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              type="number"
                              value={diem.DiemGK}
                              onChange={(e) => handleGradeChange(diem.MaSV, 'midterm', e.target.value)}
                              inputProps={{ min: 0, max: 10, step: 0.1 }}
                              sx={{ width: '100px' }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              type="number"
                              value={diem.DiemCK}
                              onChange={(e) => handleGradeChange(diem.MaSV, 'final', e.target.value)}
                              inputProps={{ min: 0, max: 10, step: 0.1 }}
                              sx={{ width: '100px' }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              sx={{
                                fontWeight: 600,
                                color: diem.DiemTong >= 4 ? 'success.main' : 'error.main',
                              }}
                            >
                              {diem.DiemTong}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{
                      bgcolor: '#2196F3',
                      '&:hover': { bgcolor: '#1976D2' },
                    }}
                  >
                    Lưu điểm
                  </Button>
                </Box>
              </>
            ) : (
              <Alert severity="info">
                Vui lòng chọn môn học để nhập điểm
              </Alert>
            )}
          </Paper>
        </Container>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity="success">
            Đã lưu điểm thành công!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Grades;
