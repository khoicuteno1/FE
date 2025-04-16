import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  const [stats, setStats] = useState([]);

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'Điểm danh',
      description: 'Sinh viên Nguyễn Văn A đã điểm danh môn Lập trình web',
      time: '5 phút trước',
    },
    {
      id: 2,
      type: 'Nộp bài',
      description: 'Sinh viên Trần Thị B đã nộp bài tập môn Cơ sở dữ liệu',
      time: '10 phút trước',
    },
    {
      id: 3,
      type: 'Đăng ký môn',
      description: 'Sinh viên Lê Văn C đã đăng ký môn học Trí tuệ nhân tạo',
      time: '15 phút trước',
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://be1-fizs.onrender.com/thongke');
        const data = await response.json();
  
        setStats({
          totalStudents: data.totalStudents,
          totalCourses: data.totalCourses,
          averageGrade: data.averageGrade,
        });
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };
  
    fetchData();
  }, []);
  

  const StatCard = ({ icon, title, value, color }) => (
    <Card sx={{ height: '100%', bgcolor: color, color: 'white' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: '#1a2f4d' }}>
        Tổng quan hệ thống
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<PeopleIcon fontSize="large" />}
            title="Tổng số sinh viên"
            value={stats.totalStudents}
            color="#2196F3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<SchoolIcon fontSize="large" />}
            title="Số môn học"
            value={stats.totalCourses}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<AssignmentIcon fontSize="large" />}
            title="Điểm trung bình"
            value={stats.averageGrade}
            color="#FF9800"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NotificationsIcon color="primary" />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Hoạt động gần đây
              </Typography>
            </Box>
            <List>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemText
                      primary={activity.type}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {activity.description}
                          </Typography>
                          <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {activity.time}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Thông báo quan trọng
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Đăng ký học phần học kỳ 2 năm 2023-2024"
                  secondary="Thời gian đăng ký: 15/12/2023 - 30/12/2023"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Lịch thi cuối kỳ"
                  secondary="Đã cập nhật lịch thi cuối kỳ học kỳ 1 năm 2023-2024"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Thông báo nghỉ Tết"
                  secondary="Lịch nghỉ Tết Nguyên đán 2024: 08/02/2024 - 22/02/2024"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
