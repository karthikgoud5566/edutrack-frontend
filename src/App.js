import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

 const API = 'https://edutrack-backend-production-f3bc.up.railway.app/api';



function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [page, setPage] = useState('login');

  // Login state
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Student state
  const [students, setStudents] = useState([]);
  const [myResult, setMyResult] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', rollNumber: '',
    mathMarks: '', scienceMarks: '', englishMarks: ''
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (token && user?.role === 'ADMIN') fetchStudents();
    if (token && user?.role === 'STUDENT') fetchMyResult();
  }, [token]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
    } catch (err) { setError('Failed to fetch students'); }
  };

  const fetchMyResult = async () => {
    try {
      const res = await axios.get(`${API}/students/my-result`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyResult(res.data);
    } catch (err) { setError('Failed to fetch result'); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await axios.post(`${API}/auth/login`, loginData);
      setToken(res.data.token);
      setUser({ name: res.data.name, role: res.data.role, email: res.data.email });
      setPage('dashboard');
    } catch (err) {
      setLoginError('Invalid email or password');
    }
  };

  const handleLogout = () => {
    setToken(null); setUser(null);
    setStudents([]); setMyResult(null);
    setPage('login');
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      if (editId) {
        await axios.put(`${API}/students/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Student updated successfully!');
      } else {
        await axios.post(`${API}/students`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Student added successfully!');
      }
      setFormData({ name: '', email: '', rollNumber: '', mathMarks: '', scienceMarks: '', englishMarks: '' });
      setEditId(null);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!');
    }
  };

  const handleEdit = (student) => {
    setEditId(student.id);
    setFormData({
      name: student.name, email: student.email, rollNumber: student.rollNumber,
      mathMarks: student.mathMarks, scienceMarks: student.scienceMarks, englishMarks: student.englishMarks
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await axios.delete(`${API}/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Student deleted!');
      fetchStudents();
    } catch (err) { setError('Failed to delete'); }
  };

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return '#22c55e';
    if (grade === 'B') return '#3b82f6';
    if (grade === 'C') return '#f59e0b';
    if (grade === 'D') return '#f97316';
    return '#ef4444';
  };

  // ── LOGIN PAGE ──────────────────────────────────────────
  if (page === 'login') return (
    <div className="app">
      <header className="header">
        <h1>🎓 EduTrack</h1>
        <p>Student Result Management System</p>
      </header>
      <div className="login-container">
        <div className="card login-card">
          <h2>🔐 Login</h2>
          {loginError && <div className="alert error">{loginError}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-row">
              <input type="email" placeholder="Email" value={loginData.email}
                onChange={e => setLoginData({...loginData, email: e.target.value})} required />
            </div>
            <div className="form-row">
              <input type="password" placeholder="Password" value={loginData.password}
                onChange={e => setLoginData({...loginData, password: e.target.value})} required />
            </div>
            <button type="submit" className="btn-primary" style={{width:'100%'}}>Login</button>
          </form>
          <div className="login-hint">
            <p>🔑 Admin: admin@edutrack.com / admin123</p>
            <p>👤 Student: karthik@student.com / student123</p>
          </div>
        </div>
      </div>
    </div>
  );

  // ── STUDENT DASHBOARD ───────────────────────────────────
  if (user?.role === 'STUDENT') return (
    <div className="app">
      <header className="header">
        <h1>🎓 EduTrack</h1>
        <div className="header-user">
          <span>👤 {user.name}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <div className="container">
        <div className="card">
          <h2>📋 My Result</h2>
          {myResult ? (
            <table>
              <thead>
                <tr>
                  <th>Roll No</th><th>Name</th><th>Math</th>
                  <th>Science</th><th>English</th><th>Total</th><th>%</th><th>Grade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{myResult.rollNumber}</td>
                  <td>{myResult.name}</td>
                  <td>{myResult.mathMarks}</td>
                  <td>{myResult.scienceMarks}</td>
                  <td>{myResult.englishMarks}</td>
                  <td>{myResult.totalMarks}</td>
                  <td>{myResult.percentage}%</td>
                  <td>
                    <span className="grade-badge" style={{backgroundColor: getGradeColor(myResult.grade)}}>
                      {myResult.grade}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="empty">Loading your result...</p>
          )}
        </div>
      </div>
    </div>
  );

  // ── ADMIN DASHBOARD ─────────────────────────────────────
  return (
    <div className="app">
      <header className="header">
        <h1>🎓 EduTrack</h1>
        <div className="header-user">
          <span>👑 {user?.name} (Admin)</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <div className="container">
        <div className="card">
          <h2>{editId ? '✏️ Edit Student' : '➕ Add Student'}</h2>
          {message && <div className="alert success">{message}</div>}
          {error && <div className="alert error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input name="name" placeholder="Student Name" value={formData.name} onChange={handleChange} required />
              <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <input name="rollNumber" placeholder="Roll Number" value={formData.rollNumber} onChange={handleChange} required />
            </div>
            <div className="form-row marks">
              <div className="marks-input"><label>Math</label>
                <input name="mathMarks" type="number" min="0" max="100" value={formData.mathMarks} onChange={handleChange} required />
              </div>
              <div className="marks-input"><label>Science</label>
                <input name="scienceMarks" type="number" min="0" max="100" value={formData.scienceMarks} onChange={handleChange} required />
              </div>
              <div className="marks-input"><label>English</label>
                <input name="englishMarks" type="number" min="0" max="100" value={formData.englishMarks} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-primary">{editId ? 'Update' : 'Add Student'}</button>
              {editId && <button type="button" className="btn-secondary"
                onClick={() => { setEditId(null); setFormData({ name:'',email:'',rollNumber:'',mathMarks:'',scienceMarks:'',englishMarks:'' }); }}>Cancel</button>}
            </div>
          </form>
        </div>
        <div className="card">
          <h2>📋 Student Results ({students.length})</h2>
          {students.length === 0 ? <p className="empty">No students yet.</p> : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Roll No</th><th>Name</th><th>Math</th><th>Science</th><th>English</th><th>Total</th><th>%</th><th>Grade</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td>{s.rollNumber}</td><td>{s.name}</td>
                      <td>{s.mathMarks}</td><td>{s.scienceMarks}</td><td>{s.englishMarks}</td>
                      <td>{s.totalMarks}</td><td>{s.percentage}%</td>
                      <td><span className="grade-badge" style={{backgroundColor: getGradeColor(s.grade)}}>{s.grade}</span></td>
                      <td>
                        <button className="btn-edit" onClick={() => handleEdit(s)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(s.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;