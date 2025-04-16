import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  ListItemButton
} from '@mui/material';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  ExitToApp as LogoutIcon,
  Grade as GradeIcon,
  Class as ClassIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Trang chủ', icon: <HomeIcon />, path: '/dashboard' },
  { text: 'Danh sách sinh viên', icon: <PeopleIcon />, path: '/students' },
  { text: 'Nhập điểm', icon: <GradeIcon />, path: '/grades' },
  { text: 'Đăng ký môn học', icon: <ClassIcon />, path: '/course-registration' },
];

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#1a237e',
            color: 'white',
          },
        }}
      >
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <Typography variant="h6" sx={{ px: 2, py: 1 }}>
            Quản lý điểm
          </Typography>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    color: 'white',
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate('/')}
                sx={{
                  color: '#ff1744',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#ff1744' }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Đăng xuất" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 