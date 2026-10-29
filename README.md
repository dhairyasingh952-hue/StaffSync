# StaffSync - Modern Human Resource Management Solution 🏢

> **MERN Stack HRM Web Application**  
> Developed for **Full Stack Development (MERN Stack)** Coursework & Project Evaluation.

---

## 🌟 Executive Overview

**StaffSync** is a modern, enterprise-ready Human Resource Management System (HRMS) built using the **MERN Stack** (MongoDB, Express.js, React.js, and Node.js). It streamlines and automates core HR processes, promotes organizational transparency, and digitizes workflows across three distinct access tiers:

1. 👑 **HR Personnel (Admin)**: Full administrative authority to manage employee profiles, review and approve/reject company-wide leave requests, monitor real-time daily attendance logs, and broadcast company-wide news bulletins.
2. 💼 **Managers**: Dedicated portal to manage assigned departmental teams, approve/reject direct reports' leave applications, oversee team attendance, and design, assign, and track technical training & development programs.
3. 👤 **Staff Employees**: Self-service portal to record daily clock-in/clock-out attendance with automatic punctuality detection, submit leave requests with live quota tracking, access enrolled training modules, view company announcements, and maintain personal records.

---

## 🚀 Key Features & Role Matrix

| Capability / Module | Staff Employee | Team Manager | HR Personnel (Admin) |
| :--- | :---: | :---: | :---: |
| **Authentication & JWT Session** | ✅ | ✅ | ✅ |
| **1-Click Quick Demo Login** | ✅ | ✅ | ✅ |
| **Daily Clock-In / Clock-Out** | ✅ (Live Punch) | ✅ | ✅ |
| **Personal Attendance History** | ✅ | ✅ | ✅ |
| **Team / Org Attendance Tracking** | ❌ | ✅ (My Team) | ✅ (All Org) |
| **Leave Quota Balances** | ✅ (Casual, Sick, Annual) | ✅ | ✅ |
| **Submit Leave Request** | ✅ | ✅ | ✅ |
| **Approve / Reject Leave Requests**| ❌ | ✅ (Team Reports) | ✅ (Company-wide) |
| **Employee Directory** | ✅ (Directory) | ✅ (My Team) | ✅ (Full CRUD + Salary) |
| **Company Announcements Feed** | ✅ (Read) | ✅ (Read) | ✅ (Publish & Manage) |
| **Training & Development Modules** | ✅ (Track Progress) | ✅ (Create & Assign) | ✅ (Create & Assign) |
| **Personal Profile & Password** | ✅ | ✅ | ✅ |

---

## 🛠️ Technology Stack

- **Frontend**: React.js 18 (SPA), Bootstrap 5.3 (Responsive Grid, Modals, Forms), Lucide-React Icons, Axios, React Router v6, Vite.
- **Backend**: Node.js v24, Express.js RESTful API, JSON Web Tokens (JWT) for stateless authentication, Bcrypt.js for salt hashing.
- **Database**: MongoDB & Mongoose ORM models (User, Attendance, Leave, Announcement, Training, Department) with built-in high-performance local store fallback for zero-setup execution.

---

## 🔑 Demo Login Credentials

For quick evaluation and testing, the application includes **One-Click Quick Login** buttons on the login screen. You can also log in manually using the pre-seeded credentials below:

| Role | Email Address | Password | Designation |
| :--- | :--- | :--- | :--- |
| **HR Personnel** | `hr@staffsync.com` | `password123` | Head of People & HR Director |
| **Manager** | `manager@staffsync.com` | `password123` | Engineering Team Lead |
| **Employee 1** | `alex@staffsync.com` | `password123` | Senior Full Stack Developer |
| **Employee 2** | `priya@staffsync.com` | `password123` | UI/UX Product Designer |
| **Employee 3** | `john@staffsync.com` | `password123` | DevOps & Cloud Specialist |

---

## 📁 Project Architecture & Stories

```
c:\New folder\
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection & graceful fallback
│   ├── controllers/
│   │   ├── authController.js         # JWT auth, login, register, profile
│   │   ├── employeeController.js     # Employee records & team directory
│   │   ├── attendanceController.js   # Daily punch in/out & attendance logs
│   │   ├── leaveController.js        # Leave applications & approval review
│   │   ├── announcementController.js # Corporate bulletins & broadcasts
│   │   ├── trainingController.js     # Team upskilling modules & progress
│   │   └── statsController.js        # KPI summaries & metrics
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification & Role-Based Access Control (RBAC)
│   ├── models/                   # Mongoose schemas & data structures
│   │   ├── User.js
│   │   ├── Attendance.js
│   │   ├── Leave.js
│   │   ├── Announcement.js
│   │   ├── Training.js
│   │   └── Department.js
│   ├── routes/                   # Modular Express REST endpoints
│   ├── data/
│   │   └── seedData.js           # Pre-configured demo accounts & records
│   ├── server.js                 # Main Express server entry point
│   ├── seed.js                   # Standalone database seeder
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Sidebar, StatCards, ProtectedRoute
│   │   ├── context/              # AuthContext (JWT management)
│   │   ├── pages/                # Login, Dashboard, Employees, Attendance,
│   │   │                         # Leaves, Announcements, Training, Profile
│   │   ├── services/             # Axios API service
│   │   ├── App.jsx               # Router & Layout Shell
│   │   └── index.css             # Bootstrap custom styling
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── start-dev.bat                 # One-click Windows development launcher
├── seed-database.bat             # One-click database re-seed
├── PROJECT_DOCUMENTATION.md      # Detailed submission report for mentors
├── package.json                  # Root runner script
└── README.md
```

---

## ⚡ Getting Started (Running the Application)

### Option A: 1-Click Launch (Recommended for Windows)
Simply double-click:
```
start-dev.bat
```
This automatically boots both the **Backend API (port 5000)** and **Frontend Application (port 3000)**!

---

### Option B: Command Line

#### 1. Start Both Together from Root:
```bash
npm run dev
```

#### 2. Or Start Individually:
- **Terminal 1 (Backend API)**:
  ```bash
  cd backend
  npm start
  ```
  *Backend will run at: `http://localhost:5000`*

- **Terminal 2 (Frontend Client)**:
  ```bash
  cd frontend
  npm run dev
  ```
  *Frontend will run at: `http://localhost:3000`*

---

## 📡 REST API Documentation

### 1. Authentication (`/api/auth`)
- `POST /api/auth/login` - Authenticate user & return JWT token
- `POST /api/auth/register` - Register a new employee account
- `GET  /api/auth/me` - Fetch profile of current session [Private]
- `PUT  /api/auth/profile` - Update personal contact details [Private]
- `PUT  /api/auth/change-password` - Securely change password [Private]

### 2. Employees (`/api/employees`)
- `GET    /api/employees` - Search & filter employee directory [Private]
- `GET    /api/employees/my-team` - Retrieve manager's direct reports [Manager/HR]
- `POST   /api/employees` - Create new employee profile [HR Only]
- `PUT    /api/employees/:id` - Update employee details & salary [HR Only]
- `DELETE /api/employees/:id` - Deactivate/remove employee [HR Only]

### 3. Attendance (`/api/attendance`)
- `POST /api/attendance/clock-in` - Record daily shift check-in [Private]
- `POST /api/attendance/clock-out` - Record shift check-out [Private]
- `GET  /api/attendance/today` - Today's punch status for logged-in user [Private]
- `GET  /api/attendance/my` - Personal attendance history [Private]
- `GET  /api/attendance` - Company-wide attendance logs [Manager/HR]

### 4. Leaves (`/api/leaves`)
- `POST /api/leaves` - Submit time-off request with quota validation [Private]
- `GET  /api/leaves/my` - View my leave requests & balance [Private]
- `GET  /api/leaves` - Review leave requests [Manager/HR]
- `PUT  /api/leaves/:id/status` - Approve or Reject request with comments [Manager/HR]

### 5. Announcements (`/api/announcements`)
- `GET    /api/announcements` - List published bulletins [Private]
- `POST   /api/announcements` - Publish new notice with priority tag [HR Only]
- `DELETE /api/announcements/:id` - Delete obsolete announcement [HR Only]

### 6. Training & Upskilling (`/api/trainings`)
- `GET    /api/trainings` - View enrolled/managed courses [Private]
- `POST   /api/trainings` - Create training & assign subordinates [Manager/HR]
- `PUT    /api/trainings/:id/progress` - Update status (Not Started/In Progress/Completed) [Private]
- `DELETE /api/trainings/:id` - Delete training module [Manager/HR]

---

## 📤 Submitting to SkillWallet / Course Portal

1. **GitHub Repository**:
   - Initialize git in this folder:
     ```bash
     git init
     git add .
     git commit -m "Initial commit: StaffSync HRM Full Stack MERN Solution"
     git branch -M main
     git remote add origin <your-github-repo-url>
     git push -u origin main
     ```
   - Paste your GitHub repository link into the course portal.

2. **Live Demo Deployment (Optional)**:
   - Deploy backend to Render / Railway.
   - Deploy frontend to Vercel / Netlify.
   - Paste the live URL into the **Add Demo Link** field.
