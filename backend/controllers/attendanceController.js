const storage = require('../services/storage');

// @desc    Clock in for today
// @route   POST /api/attendance/clock-in
// @access  Private (All employees/roles)
const clockIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];
    const { notes } = req.body;

    // Check if already clocked in today
    const existing = storage
      .getAttendanceByUser(userId)
      .find((a) => a.date === today);

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already clocked in for today.',
        data: existing
      });
    }

    const now = new Date();
    // Rule: Late if clocked in after 9:30 AM
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const isLate = hours > 9 || (hours === 9 && minutes > 30);

    const record = storage.createAttendance({
      userId,
      userName: req.user.name,
      department: req.user.department,
      date: today,
      clockIn: now.toISOString(),
      clockOut: null,
      durationHours: 0,
      status: isLate ? 'Late' : 'Present',
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: `Clocked in successfully at ${now.toLocaleTimeString()}`,
      data: record
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error clocking in' });
  }
};

// @desc    Clock out for today
// @route   POST /api/attendance/clock-out
// @access  Private
const clockOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];

    const record = storage
      .getAttendanceByUser(userId)
      .find((a) => a.date === today);

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'No clock-in record found for today. Please clock in first.'
      });
    }

    if (record.clockOut) {
      return res.status(400).json({
        success: false,
        message: 'You have already clocked out for today.'
      });
    }

    const clockOutTime = new Date();
    const clockInTime = new Date(record.clockIn);
    const diffMs = clockOutTime - clockInTime;
    const durationHours = +(diffMs / (1000 * 60 * 60)).toFixed(2);

    const updated = storage.updateAttendance(record._id, {
      clockOut: clockOutTime.toISOString(),
      durationHours
    });

    res.json({
      success: true,
      message: `Clocked out successfully at ${clockOutTime.toLocaleTimeString()} (${durationHours} hrs)`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error clocking out' });
  }
};

// @desc    Get current user's today status
// @route   GET /api/attendance/today
// @access  Private
const getTodayStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];
    const record = storage
      .getAttendanceByUser(userId)
      .find((a) => a.date === today);

    res.json({
      success: true,
      isClockedIn: !!record,
      isClockedOut: !!(record && record.clockOut),
      data: record || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching today status' });
  }
};

// @desc    Get attendance history for current logged in user
// @route   GET /api/attendance/my
// @access  Private
const getMyAttendance = async (req, res) => {
  try {
    const list = storage
      .getAttendanceByUser(req.user._id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching attendance' });
  }
};

// @desc    Get all attendance (HR or Manager for team)
// @route   GET /api/attendance
// @access  Private (HR or Manager)
const getAllAttendance = async (req, res) => {
  try {
    const { date, department, status } = req.query;
    let list = storage.getAttendance();

    // If manager, filter by manager's team
    if (req.user.role === 'manager') {
      const myTeam = storage
        .getUsers()
        .filter((u) => u.managerId === req.user._id || (u.department === req.user.department && u._id !== req.user._id))
        .map((u) => u._id);
      myTeam.push(req.user._id);
      list = list.filter((a) => myTeam.includes(a.userId));
    }

    if (date) {
      list = list.filter((a) => a.date === date);
    }
    if (department && department !== 'All') {
      list = list.filter((a) => a.department === department);
    }
    if (status && status !== 'All') {
      list = list.filter((a) => a.status === status);
    }

    list.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving attendance records' });
  }
};

module.exports = {
  clockIn,
  clockOut,
  getTodayStatus,
  getMyAttendance,
  getAllAttendance
};
