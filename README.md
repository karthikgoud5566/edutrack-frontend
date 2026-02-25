# 🎓 EduTrack — Student Result Management System

A full stack web application for managing student records and results. Admins can add students, enter subject marks, and the system automatically calculates total marks, percentage, and grade.

**Live Demo:** https://edutrack-frontend-eight.vercel.app  
**Backend Repo:** https://github.com/karthikgoud5566/edutrack-backend

---

## 📸 Screenshots

### Home Page
![Home](screenshots/Screenshot%202026-02-25%20111214.png)

### Student Results Table
![Results](screenshots/Screenshot%202026-02-25%20111149.png)

### Add / Edit Student
![Edit](screenshots/Screenshot%202026-02-25%20111239.png)

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Axios, CSS |
| Backend | Spring Boot, Spring Data JPA |
| Database | MySQL (Aiven Cloud) |
| Deployment | Vercel (frontend), Railway (backend) |
| API | REST APIs (10+ endpoints) |

---

## ✨ Features

- Add, edit, delete student records
- Enter marks for Math, Science, and English
- Auto-calculates total marks, percentage, and grade (A+, A, B, C, D, F)
- Duplicate roll number and email validation
- Responsive UI with color-coded grade badges
- Connected to live cloud MySQL database

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js
- Java 17+
- MySQL

### Frontend Setup
```bash
git clone https://github.com/karthikgoud5566/edutrack-frontend
cd edutrack-frontend
npm install
npm start
```

### Backend Setup
```bash
git clone https://github.com/karthikgoud5566/edutrack-backend
cd edutrack-backend
# Update application.properties with your MySQL credentials
./mvnw spring-boot:run
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/students | Get all students |
| GET | /api/students/{id} | Get student by ID |
| POST | /api/students | Add new student |
| PUT | /api/students/{id} | Update student |
| DELETE | /api/students/{id} | Delete student |

---

## 👨‍💻 Author

**Biyani Karthik Goud**  
[LinkedIn](https://linkedin.com/in/biyani-karthik) | [GitHub](https://github.com/karthikgoud5566)