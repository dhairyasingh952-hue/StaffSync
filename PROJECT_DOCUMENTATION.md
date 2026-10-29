# StaffSync - Modern Human Resource Management Solution
## Comprehensive Coursework & Architecture Documentation

**Course Track:** Full Stack Development (MERN Stack)  
**System Module:** HRM Tool Web Application  
**Standard Architecture:** MongoDB, Express.js, React.js, Node.js (MERN) + Bootstrap + JWT  

---

## 1. Project Setup and Configuration

### Environment & Dependencies
The application runtime environment is powered by **Node.js v24.20.0** and **npm v11.19.0**.  
Both backend and frontend are orchestrated under a unified monorepo-style structure allowing concurrent execution:

- **Root Directory (`/`)**:
  - `package.json`: Contains orchestration scripts (`install:all`, `dev`, `server`, `client`, `seed`).
  - `start-dev.bat`: Fast execution batch script for Windows environments.
  - `seed-database.bat`: Automation script to restore default mock accounts and records.

- **Backend Configuration (`backend/.env`)**:
  - `PORT=5000`: RESTful API listening port.
  - `MONGODB_URI`: Primary database connection string for MongoDB Atlas / local MongoDB daemon.
  - `JWT_SECRET`: Cryptographically secure HMAC SHA256 secret used to sign and verify JSON Web Tokens.

- **Frontend Configuration (`frontend/vite.config.js`)**:
  - Development proxy mapping all `/api` requests to `http://localhost:5000` to eliminate Cross-Origin Resource Sharing (CORS) friction during local development.

---

## 2. Backend Development

The backend is built with **Node.js** and **Express.js**, following standard MVC (Model-View-Controller) architecture principles.

### Key Controller Modules:
1. **`authController.js`**:
   - `login`: Validates email and compares password hashes with `bcryptjs`. Generates JWT token with 7-day expiration.
   - `register`: Creates new employee records with hashed credentials.
   - `getMe`: Delivers authenticated profile info based on token verification.
   - `updateProfile` & `changePassword`: Personal profile management and password hashing updates.

2. **`employeeController.js`**:
   - `getAllEmployees`: Provides searchable and filterable employee records (department, role, status). Masks salary info for non-HR personnel.
   - `getMyTeam`: Filters and returns members assigned under the logged-in Manager.
   - `createEmployee`, `updateEmployee`, `deleteEmployee`: Protected with `authorizeRoles('hr')` middleware to enforce strict HR-only permissions.

3. **`attendanceController.js`**:
   - `clockIn`: Records current timestamp and automatically computes punctuality (`Late` if clocked in after 09:30 AM, else `Present`).
   - `clockOut`: Records exit timestamp and calculates shift duration in hours.
   - `getTodayStatus` & `getMyAttendance`: Queries user daily shifts.
   - `getAllAttendance`: Allows HR and Managers to inspect punctuality logs and attendance rates.

4. **`leaveController.js`**:
   - `applyLeave`: Validates date intervals and deducts/verifies leave balances against employee allocations (Casual: 12, Sick: 10, Annual: 15).
   - `updateLeaveStatus`: Allows Managers/HR to approve or reject requests with review feedback. On approval, quota is automatically updated.

5. **`announcementController.js`**:
   - Allows HR administrators to publish company notices with priority ratings (`High`, `Medium`, `Low`) and categories (`General`, `Policy`, `Holiday`, `Event`, `Urgent`).

6. **`trainingController.js`**:
   - Enables Managers to create technical courses, set completion deadlines, and track individual progress per direct report.

### Middleware & Security:
- **`authMiddleware.js` (`protect`)**: Reads `Authorization: Bearer <token>`, verifies signature, and attaches user instance to `req.user`.
- **`authorizeRoles('hr', 'manager', 'employee')`**: Enforces Role-Based Access Control (RBAC) on sensitive endpoints.

---

## 3. Database Development

### Database Models (Mongoose Schemas):
1. **User Schema (`models/User.js`)**:
   - Stores identity, hashed passwords, access roles (`hr`, `manager`, `employee`), department assignment, salary, leave balance counters, and contact details.

2. **Attendance Schema (`models/Attendance.js`)**:
   - Stores reference `userId`, date (`YYYY-MM-DD`), clock-in/out timestamps, total duration, status, and task notes.

3. **Leave Schema (`models/Leave.js`)**:
   - Stores applicant ID, leave type (`Casual`, `Sick`, `Annual`, `Maternity`, `Unpaid`), date ranges, total days, reason, review status (`Pending`, `Approved`, `Rejected`), and reviewer comments.

4. **Announcement Schema (`models/Announcement.js`)**:
   - Stores bulletin title, content, priority, category, and author details.

5. **Training Schema (`models/Training.js`)**:
   - Stores title, curriculum description, department, assigned employee progress array (`Not Started`, `In Progress`, `Completed`), and deadlines.

6. **Department Schema (`models/Department.js`)**:
   - Stores organizational division info (Engineering, HR, Product, Marketing) and head of department.

### Resilience & Zero-Friction Storage:
In addition to standard MongoDB Atlas / local daemon support, the backend incorporates a stateful fallback layer (`backend/services/storage.js`) that persists to disk (`backend/data/local_db.json`). This ensures that evaluators can run the project immediately without requiring a pre-installed MongoDB database engine!

---

## 4. Frontend Development

The frontend is built using **React.js 18**, **Bootstrap 5.3**, and **Lucide Icons**, delivering a clean, high-performance Single Page Application (SPA).

### UI Highlights & Role Interfaces:
- **Responsive Layout (`Sidebar.jsx` & `Navbar.jsx`)**:
  - Dynamically renders navigation links matching the user's role.
  - Displays online status, active role pill, and user profile avatar.
- **Role Demo Quick Login**:
  - Instant 1-click test buttons on the login page for:
    - 👑 **HR Personnel** (`hr@staffsync.com`)
    - 💼 **Manager** (`manager@staffsync.com`)
    - 👤 **Employee** (`alex@staffsync.com`)
- **Dashboard (`Dashboard.jsx`)**:
  - Metric summary cards with color-coded badges.
  - Interactive Daily Clock-In/Clock-Out puncher widget with real-time shift status.
  - Headcount distribution progress bars by department.
  - Company newsfeed and pending approvals queue.
- **Employee Directory (`Employees.jsx`)**:
  - Searchable table with department/role filters.
  - Modal dialogues for adding, editing, and managing employee records.
- **Attendance Tracker (`Attendance.jsx`)**:
  - Real-time punch in/out with notes.
  - Historical table with hours calculation and punctuality indicators.
- **Leave Management Portal (`Leaves.jsx`)**:
  - Interactive leave application form with automatic day count calculation.
  - Live quota balance meters.
  - Manager/HR approval modal with comment feedback.
- **Announcements Noticeboard (`Announcements.jsx`)**:
  - Card feed with priority badges and category tags.
- **Upskilling & Training Portal (`Training.jsx`)**:
  - Card view of training modules, curriculum links, and progress trackers.

---

## 5. Project Execution & Testing Guide

### Prerequisites
- Node.js (v16 or higher)
- Web Browser (Chrome, Firefox, Edge)

### Execution Steps
1. Navigate to the project root directory:
   ```bash
   cd "c:\New folder"
   ```
2. Start the integrated platform:
   ```bash
   npm run dev
   ```
   *(Or double-click `start-dev.bat` on Windows)*
3. Access the application in your browser:
   ```
   http://localhost:3000
   ```
4. Click any of the **Quick Demo Login** buttons to immediately explore the interface from the perspective of HR, Manager, or Employee!
