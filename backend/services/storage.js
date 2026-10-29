const fs = require('fs');
const path = require('path');
const {
  departmentsData,
  usersData,
  attendanceData,
  leavesData,
  announcementsData,
  trainingsData
} = require('../data/seedData');

const DB_FILE = path.join(__dirname, '../data/local_db.json');

class StorageService {
  constructor() {
    this.isMongoConnected = false;
    this.data = {
      departments: [],
      users: [],
      attendance: [],
      leaves: [],
      announcements: [],
      trainings: []
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
        console.log('[StaffSync Storage] Loaded persisted database state from disk.');
      } else {
        this.resetToDefaults();
      }
    } catch (err) {
      console.error('[StaffSync Storage] Error initializing storage:', err.message);
      this.resetToDefaults();
    }
  }

  resetToDefaults() {
    this.data = {
      departments: JSON.parse(JSON.stringify(departmentsData)),
      users: JSON.parse(JSON.stringify(usersData)),
      attendance: JSON.parse(JSON.stringify(attendanceData)),
      leaves: JSON.parse(JSON.stringify(leavesData)),
      announcements: JSON.parse(JSON.stringify(announcementsData)),
      trainings: JSON.parse(JSON.stringify(trainingsData))
    };
    this.persist();
  }

  persist() {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('[StaffSync Storage] Error persisting database state:', err.message);
    }
  }

  // --- Users ---
  getUsers() {
    return this.data.users;
  }

  getUserById(id) {
    return this.data.users.find((u) => u._id === id || u.id === id);
  }

  getUserByEmail(email) {
    if (!email) return null;
    return this.data.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );
  }

  createUser(userData) {
    const newUser = {
      _id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Active',
      leaveBalance: { casual: 12, sick: 10, annual: 15 },
      ...userData
    };
    this.data.users.push(newUser);
    this.persist();
    return newUser;
  }

  updateUser(id, updates) {
    const idx = this.data.users.findIndex((u) => u._id === id || u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = {
      ...this.data.users[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return this.data.users[idx];
  }

  deleteUser(id) {
    const idx = this.data.users.findIndex((u) => u._id === id || u.id === id);
    if (idx === -1) return false;
    this.data.users.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- Departments ---
  getDepartments() {
    return this.data.departments;
  }

  createDepartment(dep) {
    const newDep = {
      _id: 'dep_' + Date.now(),
      createdAt: new Date().toISOString(),
      ...dep
    };
    this.data.departments.push(newDep);
    this.persist();
    return newDep;
  }

  // --- Attendance ---
  getAttendance() {
    return this.data.attendance;
  }

  getAttendanceByUser(userId) {
    return this.data.attendance.filter((a) => a.userId === userId);
  }

  getAttendanceByDate(date) {
    return this.data.attendance.filter((a) => a.date === date);
  }

  createAttendance(att) {
    const newAtt = {
      _id: 'att_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
      ...att
    };
    this.data.attendance.unshift(newAtt);
    this.persist();
    return newAtt;
  }

  updateAttendance(id, updates) {
    const idx = this.data.attendance.findIndex((a) => a._id === id || a.id === id);
    if (idx === -1) return null;
    this.data.attendance[idx] = {
      ...this.data.attendance[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return this.data.attendance[idx];
  }

  // --- Leaves ---
  getLeaves() {
    return this.data.leaves;
  }

  getLeavesByUser(userId) {
    return this.data.leaves.filter((l) => l.userId === userId);
  }

  createLeave(leave) {
    const newLeave = {
      _id: 'leave_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      status: 'Pending',
      appliedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      reviewedBy: null,
      reviewerComments: '',
      ...leave
    };
    this.data.leaves.unshift(newLeave);
    this.persist();
    return newLeave;
  }

  updateLeave(id, updates) {
    const idx = this.data.leaves.findIndex((l) => l._id === id || l.id === id);
    if (idx === -1) return null;
    this.data.leaves[idx] = {
      ...this.data.leaves[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return this.data.leaves[idx];
  }

  deleteLeave(id) {
    const idx = this.data.leaves.findIndex((l) => l._id === id || l.id === id);
    if (idx === -1) return false;
    this.data.leaves.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- Announcements ---
  getAnnouncements() {
    return this.data.announcements.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  createAnnouncement(ann) {
    const newAnn = {
      _id: 'ann_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
      ...ann
    };
    this.data.announcements.unshift(newAnn);
    this.persist();
    return newAnn;
  }

  deleteAnnouncement(id) {
    const idx = this.data.announcements.findIndex((a) => a._id === id || a.id === id);
    if (idx === -1) return false;
    this.data.announcements.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- Trainings ---
  getTrainings() {
    return this.data.trainings;
  }

  createTraining(train) {
    const newTrain = {
      _id: 'train_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
      ...train
    };
    this.data.trainings.unshift(newTrain);
    this.persist();
    return newTrain;
  }

  updateTraining(id, updates) {
    const idx = this.data.trainings.findIndex((t) => t._id === id || t.id === id);
    if (idx === -1) return null;
    this.data.trainings[idx] = {
      ...this.data.trainings[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return this.data.trainings[idx];
  }

  deleteTraining(id) {
    const idx = this.data.trainings.findIndex((t) => t._id === id || t.id === id);
    if (idx === -1) return false;
    this.data.trainings.splice(idx, 1);
    this.persist();
    return true;
  }
}

const storageInstance = new StorageService();
module.exports = storageInstance;
