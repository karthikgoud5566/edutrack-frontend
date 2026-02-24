import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:8080/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '', email: '', rollNumber: '',
    mathMarks: '', scienceMarks: '', englishMarks: ''
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(API);
      setStudents(res.data);
    } catch (err) {
      setError('Failed to fetch students');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, formData);
        setMessage('Student updated successfully!');
      } else {
        await axios.post(API, formData);
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
      name: student.name,
      email: student.email,
      rollNumber: student.rollNumber,
      mathMarks: student.mathMarks,
      scienceMarks: student.scienceMarks,
      englishMarks: student.englishMarks
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(`${API}/${id}`);
      setMessage('Student deleted successfully!');
      fetchStudents();
    } catch (err) {
      setError('Failed to delete student');
    }
  };

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return '#22c55e';
    if (grade === 'B') return '#3b82f6';
    if (grade === 'C') return '#f59e0b';
    if (grade === 'D') return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>🎓 EduTrack</h1>
        <p>Student Result Management System</p>
      </header>

      <div className="container">
        {/* Form */}
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
              <div className="marks-input">
                <label>Math Marks</label>
                <input name="mathMarks" placeholder="0-100" type="number" min="0" max="100" value={formData.mathMarks} onChange={handleChange} required />
              </div>
              <div className="marks-input">
                <label>Science Marks</label>
                <input name="scienceMarks" placeholder="0-100" type="number" min="0" max="100" value={formData.scienceMarks} onChange={handleChange} required />
              </div>
              <div className="marks-input">
                <label>English Marks</label>
                <input name="englishMarks" placeholder="0-100" type="number" min="0" max="100" value={formData.englishMarks} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-primary">
                {editId ? 'Update Student' : 'Add Student'}
              </button>
              {editId && (
                <button type="button" className="btn-secondary"
                  onClick={() => { setEditId(null); setFormData({ name: '', email: '', rollNumber: '', mathMarks: '', scienceMarks: '', englishMarks: '' }); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="card">
          <h2>📋 Student Results ({students.length})</h2>
          {students.length === 0 ? (
            <p className="empty">No students added yet. Add your first student above!</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Math</th>
                    <th>Science</th>
                    <th>English</th>
                    <th>Total</th>
                    <th>%</th>
                    <th>Grade</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td>{s.rollNumber}</td>
                      <td>{s.name}</td>
                      <td>{s.mathMarks}</td>
                      <td>{s.scienceMarks}</td>
                      <td>{s.englishMarks}</td>
                      <td>{s.totalMarks}</td>
                      <td>{s.percentage}%</td>
                      <td>
                        <span className="grade-badge" style={{ backgroundColor: getGradeColor(s.grade) }}>
                          {s.grade}
                        </span>
                      </td>
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