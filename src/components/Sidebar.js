import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import GradeIcon from '@mui/icons-material/Grade';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const menuItems = [
  { text: 'Trang chủ', icon: <HomeIcon />, path: '/dashboard' },
  { text: 'Danh sách sinh viên', icon: <PeopleIcon />, path: '/students' },
  { text: 'Nhập điểm', icon: <GradeIcon />, path: '/grades' },
  { text: 'Cài đặt', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 240,
        minHeight: '100vh',
        bgcolor: '#1a2f4d',
        color: 'white',
        position: 'fixed',
        left: 0,
        top: 0,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          Quản lý điểm
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              bgcolor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.12)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem
          button
          onClick={() => navigate('/')}
          sx={{
            mt: 'auto',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.12)',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#ff4444' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Đăng xuất" sx={{ color: '#ff4444' }} />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar; 