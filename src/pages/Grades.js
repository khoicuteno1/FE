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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import Sidebar from '../components/Sidebar';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [lops, setLops] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    class: '',
    gender: '',
    email: '',
  });

  const handleOpenDialog = (student = null) => {
    if (student) {
      setFormData({
        id: student.MaSV,
        name: student.HoTen,
        class: student.MaLop,
        gender: student.GioiTinh,
        email: student.Email,
      });
      setSelectedStudent(student);
    } else {
      setFormData({
        id: '',
        name: '',
        class: '',
        gender: '',
        email: '',
      });
      setSelectedStudent(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
  };

  const filteredStudents = students.filter((student) =>
    Object.values(student).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  useEffect(() => {
    const fetchSinhvien = async () => {
      try {
        const response = await fetch('https://be1-fizs.onrender.com/sinhvien');
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu sinh viên:', error);
      }
    };
    const fetchLops = async () => {
      try {
        const response = await fetch('https://be1-fizs.onrender.com/lop');
        const data = await response.json();
        setLops(data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu lớp:', error);
      }
    };
    fetchLops();
    fetchSinhvien();
  }, []);

  const handleSubmit = async () => {
    const newStudent = {
        MaSV: formData.id,
        HoTen: formData.name,
        MaLop: formData.class,
        GioiTinh: formData.gender,
        Email: formData.email,
    };

    try {
        if (selectedStudent) {
            const response = await fetch(`https://be1-fizs.onrender.com/sinhvien/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newStudent),
            });

            if (!response.ok) throw new Error('Cập nhật thất bại');

            setStudents((prev) =>
                prev.map((s) => (s.MaSV === selectedStudent.MaSV ? newStudent : s))
            );
        } else {
            const response = await fetch('https://be1-fizs.onrender.com/SinhVien', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newStudent),
            });

            if (!response.ok) throw new Error('Thêm thất bại');

            const created = await response.json();

            setStudents((prev) => [...prev, created]);
        }

        const updatedResponse = await fetch('https://be1-fizs.onrender.com/sinhvien');
        if (updatedResponse.ok) {
            const updatedStudents = await updatedResponse.json();
            setStudents(updatedStudents);
        }

        handleCloseDialog();
    } catch (error) {
        console.error('Lỗi khi lưu sinh viên:', error);
        alert('Có lỗi xảy ra khi lưu thông tin sinh viên!');
    }
};

const handleDelete = (MaSV) => {
  // Yêu cầu người dùng xác nhận trước khi xóa
  const confirmDelete = window.confirm("Bạn chắc chắn muốn xóa sinh viên này?(Nếu xóa là sẽ xóa hết điểm liên quan đến sinh viên)");

  if (confirmDelete) {
      // Nếu người dùng xác nhận, gửi yêu cầu DELETE đến API
      fetch(`https://be1-fizs.onrender.com/${MaSV}?confirm=true`, {
          method: 'DELETE',
      })
      .then(response => response.json())
      .then(data => {
          if (data.message === 'Xóa sinh viên thành công') {
              setStudents((prevStudents) =>
                  prevStudents.filter(student => student.MaSV !== MaSV)
              );
              alert('Sinh viên đã được xóa');
          } else {
              alert(data.message);
          }
      })
      .catch((error) => {
          console.error('Error deleting student:', error);
          alert('Có lỗi xảy ra khi xóa sinh viên.');
      });
  } else {
      // Nếu người dùng không xác nhận, không làm gì cả
      alert('Hủy bỏ thao tác xóa.');
  }
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
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a2f4d' }}>
              Danh sách sinh viên
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ bgcolor: '#2196F3', '&:hover': { bgcolor: '#1976D2' } }}
            >
              Thêm sinh viên
            </Button>
          </Box>

          <Paper sx={{ p: 2, mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm sinh viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã SV</TableCell>
                    <TableCell>Họ và tên</TableCell>
                    <TableCell>Lớp</TableCell>
                    <TableCell>Giới tính</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.MaSV}>
                      <TableCell>{student.MaSV}</TableCell>
                      <TableCell>{student.HoTen}</TableCell>
                      <TableCell>{student.MaLop}</TableCell>
                      <TableCell>{student.GioiTinh}</TableCell>
                      <TableCell>{student.Email}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleOpenDialog(student)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(student.MaSV)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{selectedStudent ? 'Chỉnh sửa sinh viên' : 'Thêm sinh viên mới'}</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>


              <TextField
                fullWidth
                label="Mã sinh viên"
                value={formData.id.replace(/^DH/, '')} // chỉ hiển thị phần số
                onChange={(e) => {
                  const so = e.target.value.replace(/\D/g, ''); // chỉ cho phép số
                  setFormData({ ...formData, 
                    id: `DH${so}`,
                    email: `${`DH${so}`.toLowerCase()}@student.stu.edu.vn`, });  // lưu lại với tiền tố DH
                }}
                margin="normal"
                required
                disabled={selectedStudent}
                InputProps={{
                  startAdornment: <InputAdornment position="start">DH</InputAdornment>,
                }}
              />


              <TextField
                fullWidth
                label="Họ và tên"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Lớp</InputLabel>
                <Select
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  label="Lớp"
                >
                  {lops.map((lop) => (
                    <MenuItem key={lop.MaLop} value={lop.MaLop}>
                      {lop.TenLop}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  label="Giới tính"
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                margin="normal"
                disabled // không cho nhập tay
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button variant="contained" onClick={handleSubmit} color="primary">
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Students;
