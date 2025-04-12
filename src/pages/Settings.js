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
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Sidebar from '../components/Sidebar';

const Settings = () => {

  const [monhocs, setMonHocs] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newMonHoc, setNewMonHoc] = useState({
    MaMH: '',
    TenMH: '',
    SoTinChi: '',
    HeSoCC: '',
    HeSoGK: '',
    HeSoCK: '',
  });

 

  useEffect(() => {
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
  }, []);

  const handleDeleteMonHoc = async (MaMH) => {
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa môn học này không?');
    
    if (!isConfirmed) {
      return;
    }
  
    try {
      const response = await fetch(`https://be1-fizs.onrender.com/monhoc/${MaMH}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        console.error(`Error deleting monhoc: ${response.statusText}`);
        throw new Error('Lỗi khi xóa môn học');
      }
  
      // Chỉ cập nhật UI sau khi xóa thành công
      setMonHocs((prevMonHocs) => prevMonHocs.filter((monhoc) => monhoc.MaMH !== MaMH));
    } catch (error) {
      console.error('Lỗi xóa môn học:', error);
    }
  };
  
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChangeNewMonHoc = (field) => (event) => {
    setNewMonHoc({
      ...newMonHoc,
      [field]: event.target.value,
    });
  };

  const handleAddMonHoc = async () => {
    try {
      // Gửi request để thêm môn học mới vào database
      const response = await fetch('https://be1-fizs.onrender.com/monhoc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMonHoc),
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi thêm môn học');
      }
      alert("Thêm môn học thành công!")
      // Sau khi thêm thành công, tải lại toàn bộ danh sách môn học
      const fetchMonHoc = async () => {
        try {
          const response = await fetch('https://be1-fizs.onrender.com/monhoc');
          const data = await response.json();
          setMonHocs(data);
        } catch (error) {
          console.error('Lỗi khi tải dữ liệu môn học:', error);
        }
      };
      fetchMonHoc();
  
      // Đóng modal và reset form
      handleCloseModal();
      setNewMonHoc({
        MaMH: '',
        TenMH: '',
        SoTinChi: '',
        HeSoCC: '',
        HeSoGK: '',
        HeSoCK: '',
      });
    } catch (error) {
      console.error('Lỗi khi thêm môn học:', error);
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
          <Typography variant="h4" sx={{ mb: 4 }}>
            Cài đặt hệ thống
          </Typography>

          {/* Quản lý môn học section */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Quản lý môn học</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenModal}
              >
                Thêm môn học
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã môn học</TableCell>
                    <TableCell>Tên môn học</TableCell>
                    <TableCell align="center">Số tín chỉ</TableCell>
                    <TableCell align="center">Hệ số Chuyên Cần</TableCell>
                    <TableCell align="center">Hệ số Giữa kỳ</TableCell>
                    <TableCell align="center">Hệ số Cuối kỳ</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monhocs.map((monhoc) => (
                    <TableRow key={monhoc.MaMH}>
                      <TableCell>{monhoc.MaMH}</TableCell>
                      <TableCell>{monhoc.TenMH}</TableCell>
                      <TableCell align="center">{monhoc.SoTinChi}</TableCell>
                      <TableCell align="center">{monhoc.HeSoCC}</TableCell>
                      <TableCell align="center">{monhoc.HeSoGK}</TableCell>
                      <TableCell align="center">{monhoc.HeSoCK}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteMonHoc(monhoc.MaMH)}
                        >
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
      </Box>

      {/* Modal form thêm môn học */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Thêm Môn Học</DialogTitle>
        <DialogContent>
          <TextField
            label="Mã môn học"
            value={newMonHoc.MaMH}
            onChange={handleChangeNewMonHoc('MaMH')}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Tên môn học"
            value={newMonHoc.TenMH}
            onChange={handleChangeNewMonHoc('TenMH')}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Số tín chỉ"
            value={newMonHoc.SoTinChi}
            onChange={handleChangeNewMonHoc('SoTinChi')}
            type="number"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Hệ số Chuyên Cần"
            value={0.1}
            InputProps={{
              readOnly: true,  // Makes the field read-only
            }}
            onChange={handleChangeNewMonHoc('HeSoCC')}
            type="number"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Hệ số Giữa kỳ"
            value={0.3}
            InputProps={{
              readOnly: true,  // Makes the field read-only
            }}
            onChange={handleChangeNewMonHoc('HeSoGK')}
            type="number"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Hệ số Cuối kỳ"
            value={0.6}
            InputProps={{
              readOnly: true,  // Makes the field read-only
            }}
            onChange={handleChangeNewMonHoc('HeSoCK')} type="number" fullWidth />
             </DialogContent> <DialogActions> <Button onClick={handleCloseModal} color="primary"> Hủy </Button> <Button onClick={handleAddMonHoc} color="primary"> Thêm </Button> </DialogActions> </Dialog> </Box> ); };

export default Settings;