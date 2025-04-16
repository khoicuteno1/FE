import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField, Button, Grid } from '@mui/material';

const GradeInput = () => {
  const [students, setStudents] = useState([]);
  const [monhocs, setMonhocs] = useState([]);
  const [selectedMonHoc, setSelectedMonHoc] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [gradeCC, setGradeCC] = useState('');
  const [gradeGK, setGradeGK] = useState('');
  const [gradeCK, setGradeCK] = useState('');
  const [finalGrade, setFinalGrade] = useState('');

  const [errors, setErrors] = useState({
    CC: false,
    GK: false,
    CK: false,
  });

  const validate = (value) => {
    const number = parseFloat(value);
    return !isNaN(number) && number >= 0 && number <= 10;
  };

  // Lấy danh sách môn học và sinh viên ban đầu
  useEffect(() => {
    fetch('https://be1-fizs.onrender.com/monhoc')
      .then((response) => response.json())
      .then((data) => setMonhocs(data));
  }, []);

  // Khi môn học được chọn, lấy danh sách sinh viên học môn học đó
  useEffect(() => {
    if (selectedMonHoc) {
      fetch(`https://be1-fizs.onrender.com/sinhvien/${selectedMonHoc}`)
        .then((response) => response.json())
        .then((data) => setStudents(data));
    }
  }, [selectedMonHoc]);

  useEffect(() => {
    if (selectedStudent && selectedMonHoc) {
      fetch(`https://be1-fizs.onrender.com/diem/${selectedStudent}/${selectedMonHoc}`)
        .then((response) => response.json())
        .then((data) => {
          setGradeCC(data.DiemCC || '');
          setGradeGK(data.DiemGK || '');
          setGradeCK(data.DiemCK || '');
          setFinalGrade(calculateFinalGrade(data.DiemCC, data.DiemGK, data.DiemCK));
        });
    }
  }, [selectedStudent, selectedMonHoc]);
  
  const calculateFinalGrade = (cc, gk, ck) => {
    const c = parseFloat(cc) || 0;
    const g = parseFloat(gk) || 0;
    const k = parseFloat(ck) || 0;
    return ((c * 0.1 + g * 0.3 + k * 0.6).toFixed(2)).toString();
  };
  

  const handleGradeChange = (e, type) => {
    const value = e.target.value;

    const isValid = validate(value);
    setErrors(prev => ({ ...prev, [type]: !isValid }));
    const floatValue = parseFloat(value);
    const safeValue = isNaN(floatValue) ? '' : floatValue;

    if (type === 'CC') setGradeCC(safeValue);
    if (type === 'GK') setGradeGK(safeValue);
    if (type === 'CK') setGradeCK(safeValue);
  };

  
  useEffect(() => {
    const cc = parseFloat(gradeCC) || 0;
    const gk = parseFloat(gradeGK) || 0;
    const ck = parseFloat(gradeCK) || 0;
    const isAllValid = [cc, gk, ck].every(score => score >= 0 && score <= 10);
    if (isAllValid) {
      const tongKet = (cc * 0.2 + gk * 0.3 + ck * 0.5).toFixed(2);
      setFinalGrade(tongKet);
    } else {
      setFinalGrade('');
    }
  }, [gradeCC, gradeGK, gradeCK]);

  const handleSave = () => {
    const ccValid = validate(gradeCC);
    const gkValid = validate(gradeGK);
    const ckValid = validate(gradeCK);
  
    setErrors({
      CC: !ccValid,
      GK: !gkValid,
      CK: !ckValid,
    });
  
    if (!ccValid || !gkValid || !ckValid) {
      alert("Vui lòng nhập đầy đủ điểm hợp lệ từ 0 đến 10");
      return;
    }
  
    const data = {
      DiemCC: gradeCC,
      DiemGK: gradeGK,
      DiemCK: gradeCK,
    };
  
    fetch(`https://be1-fizs.onrender.com/diem/${selectedStudent}/${selectedMonHoc}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(() => {
        alert('Điểm đã được lưu');
      });
  };
  
  return (
    <div>
      <Grid container spacing={2}>
        {/* Dropdown chọn môn học */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Chọn Môn Học</InputLabel>
            <Select
              value={selectedMonHoc}
              onChange={(e) => setSelectedMonHoc(e.target.value)}
              label="Chọn Môn Học"
            >
              {monhocs.map((monhoc) => (
                <MenuItem key={monhoc.MaMon} value={monhoc.MaMH}>
                  {monhoc.TenMH}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Dropdown chọn sinh viên chỉ hiển thị khi môn học đã được chọn */}
        {selectedMonHoc && (
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Chọn Sinh Viên</InputLabel>
              <Select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                label="Chọn Sinh Viên"
              >
                {students.map((student) => (
                  <MenuItem key={student.MaSV} value={student.MaSV}>
                    {student.HoTen}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Các trường nhập điểm */}
        <Grid item xs={4}>
        <TextField
          label="Điểm Chuyên Cần"
          value={gradeCC}
          onChange={(e) => handleGradeChange(e, 'CC')}
          fullWidth
          type="number"
          error={errors.CC}
          helperText={errors.CC ? 'Điểm phải từ 0 đến 10' : ''}
        />

      </Grid>
      <Grid item xs={4}>
      <TextField
        label="Điểm Giữa Kỳ"
        value={gradeGK}
        onChange={(e) => handleGradeChange(e, 'GK')}
        fullWidth
        type="number"
        error={errors.GK}
        helperText={errors.GK ? 'Điểm phải từ 0 đến 10' : ''}
      />
      </Grid>
      <Grid item xs={4}>
      <TextField
        label="Điểm Cuối Kỳ"
        value={gradeCK}
        onChange={(e) => handleGradeChange(e, 'CK')}
        fullWidth
        type="number"
        error={errors.CK}
        helperText={errors.CK ? 'Điểm phải từ 0 đến 10' : ''}
      />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Điểm Tổng Kết"
          value={finalGrade}
          fullWidth
          disabled
        />
      </Grid>

        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSave}>
            Lưu Điểm
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default GradeInput;
