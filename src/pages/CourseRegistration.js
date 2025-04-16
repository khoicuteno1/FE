import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Tabs,
  Tab,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const CourseRegistration = () => {
  const [open, setOpen] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState('');
  const [subjects, setSubjects] = useState([]);


  useEffect(() => {
    // Fetch students from API
    const fetchStudents = async () => {
      try {
        const response = await fetch('https://be1-fizs.onrender.com/sinhvien');
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    const fetchMonHoc = async () => {
      try {
        const response = await fetch('https://be1-fizs.onrender.com/monhoc');
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    const fetchDangKy = async () => {
      try {
        const response = await fetch('https://be1-fizs.onrender.com/dangky');
        const data = await response.json();
        setRegistrations(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchDangKy();
    fetchMonHoc();
    fetchStudents();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedSubject('');
    setSelectedStudent('');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleRegister = async () => {
    if (selectedSubject && selectedStudent) {
      try {
        const response = await fetch('https://be1-fizs.onrender.com/dangky', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            MaSV: selectedStudent,
            MaMH: selectedSubject
          })
        });
  
        const data = await response.json();
  
        if (response.ok && data.status === 'success') {
          // Cập nhật danh sách đăng ký tại frontend nếu cần
          const newRegistration = {
            MaSV: selectedStudent,
            MaMH: selectedSubject,
            NgayDangKy: new Date().toLocaleDateString('vi-VN')
          };
  
          setRegistrations(prev => [...prev, newRegistration]);
          setStatus('success');
          handleClose();
        } else {
          // Xử lý lỗi (error hoặc full)
          setStatus(data.status); // 'error' hoặc 'full'
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        setStatus('error');
      }
    }
  };

  


  const handleDelete = async (studentId, subjectId) => {
    // Hiển thị cửa sổ xác nhận
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa đăng ký môn học này?");
  
    if (isConfirmed) {
      try {
        // Gửi yêu cầu xóa tới API
        const response = await fetch('https://be1-fizs.onrender.com/dangky', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            MaSV: studentId,
            MaMH: subjectId,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Nếu xóa thành công, cập nhật lại danh sách đăng ký
          setRegistrations(prevRegistrations =>
            prevRegistrations.filter(
              reg => !(reg.MaSV === studentId && reg.MaMH === subjectId)
            )
          );
        } else {
          // Nếu có lỗi từ API
          console.error('Xóa không thành công:', data.message);
        }
      } catch (error) {
        console.error('Lỗi khi gọi API xóa:', error);
      }
    }
  };
  
  



  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Quản Lý Đăng Ký Môn Học
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Đăng ký môn học
        </Button>
      </Box>

      {status === 'error' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Sinh viên đã đăng ký môn học này!
        </Alert>
      )}
      {status === 'full' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Môn học đã đủ số lượng sinh viên!
        </Alert>
      )}
      {status === 'success' && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Đăng ký môn học thành công!
        </Alert>
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Danh sách đăng ký" />
          <Tab label="Thống kê môn học" />
        </Tabs>

        {tabValue === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã SV</TableCell>
                  <TableCell>Mã môn học</TableCell>
                  <TableCell>Ngày đăng ký</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registrations.map((row) => (
                  <TableRow key={`${row.MaSV}-${row.MaMH}`}>
                    <TableCell>{row.MaSV}</TableCell>
                    <TableCell>{row.MaMH}</TableCell>
                    <TableCell>{new Date(row.NgayDangKy).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(row.MaSV, row.MaMH)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {registrations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Chưa có môn học nào được đăng ký
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabValue === 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã môn học</TableCell>
                  <TableCell>Tên môn học</TableCell>
                  <TableCell>Số sinh viên đăng ký</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map((subject) => {
                  const registeredCount = registrations.filter(reg => reg.MaMH === subject.MaMH).length;
                  return (
                    <TableRow key={subject.MaMH}>
                      <TableCell>{subject.MaMH}</TableCell>
                      <TableCell>{subject.TenMH}</TableCell>
                      <TableCell>{registeredCount}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Đăng ký môn học mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Chọn sinh viên"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                {students.map((student) => (
                  <MenuItem key={student.MaSV} value={student.MaSV}>
                    {student.MaSV} - {student.HoTen}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Chọn môn học"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 200, // chiều cao tối đa (px)
                      },
                    },
                  },
                }}
              >
              {subjects.map((subject) => (
                <MenuItem key={subject.MaMH} value={subject.MaMH}>
                  {subject.TenMH} - {subject.SoTinChi} tín chỉ
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button
            onClick={handleRegister}
            variant="contained"
            disabled={!selectedSubject || !selectedStudent}
          >
            Đăng ký
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseRegistration; 