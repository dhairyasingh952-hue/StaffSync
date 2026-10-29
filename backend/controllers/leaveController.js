const storage = require('../services/storage');

// @desc    Apply for a leave
// @route   POST /api/leaves
// @access  Private (All employees)
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, totalDays, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Leave type, start date, end date, and reason are required.'
      });
    }

    const daysCount = Number(totalDays) || 1;
    const user = storage.getUserById(req.user._id);

    // Validate leave balance if applicable
    const typeKey = leaveType.toLowerCase();
    if (user.leaveBalance && user.leaveBalance[typeKey] !== undefined) {
      if (user.leaveBalance[typeKey] < daysCount) {
        return res.status(400).json({
          success: false,
          message: `Insufficient ${leaveType} leave balance. Available: ${user.leaveBalance[typeKey]} days.`
        });
      }
    }

    const leave = storage.createLeave({
      userId: req.user._id,
      userName: req.user.name,
      department: req.user.department,
      leaveType,
      startDate,
      endDate,
      totalDays: daysCount,
      reason
    });

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully.',
      data: leave
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error applying for leave' });
  }
};

// @desc    Get my leaves
// @route   GET /api/leaves/my
// @access  Private
const getMyLeaves = async (req, res) => {
  try {
    const leaves = storage
      .getLeavesByUser(req.user._id)
      .sort((a, b) => new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt));

    const user = storage.getUserById(req.user._id);

    res.json({
      success: true,
      count: leaves.length,
      leaveBalance: user.leaveBalance,
      data: leaves
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving your leaves' });
  }
};

// @desc    Get all leave requests (HR gets all, Manager gets team requests)
// @route   GET /api/leaves
// @access  Private (HR or Manager)
const getAllLeaves = async (req, res) => {
  try {
    const { status, leaveType, department } = req.query;
    let leaves = storage.getLeaves();

    if (req.user.role === 'manager') {
      const myTeam = storage
        .getUsers()
        .filter((u) => u.managerId === req.user._id || (u.department === req.user.department && u._id !== req.user._id))
        .map((u) => u._id);
      leaves = leaves.filter((l) => myTeam.includes(l.userId));
    }

    if (status && status !== 'All') {
      leaves = leaves.filter((l) => l.status === status);
    }
    if (leaveType && leaveType !== 'All') {
      leaves = leaves.filter((l) => l.leaveType === leaveType);
    }
    if (department && department !== 'All') {
      leaves = leaves.filter((l) => l.department === department);
    }

    leaves.sort((a, b) => new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt));

    res.json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving leave requests' });
  }
};

// @desc    Update leave status (Approve or Reject)
// @route   PUT /api/leaves/:id/status
// @access  Private (HR or Manager)
const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewerComments } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'Approved' or 'Rejected'."
      });
    }

    const leave = storage.getLeaves().find((l) => l._id === id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found.' });
    }

    // If manager, check if leave belongs to team
    if (req.user.role === 'manager') {
      const targetUser = storage.getUserById(leave.userId);
      if (targetUser && targetUser.department !== req.user.department && targetUser.managerId !== req.user._id) {
        return res.status(403).json({ success: false, message: 'You can only review leave requests from your own team.' });
      }
    }

    // Deduct leave balance if approved
    if (status === 'Approved' && leave.status !== 'Approved') {
      const applicant = storage.getUserById(leave.userId);
      if (applicant && applicant.leaveBalance) {
        const typeKey = leave.leaveType.toLowerCase();
        if (applicant.leaveBalance[typeKey] !== undefined) {
          applicant.leaveBalance[typeKey] = Math.max(0, applicant.leaveBalance[typeKey] - leave.totalDays);
          storage.updateUser(applicant._id, { leaveBalance: applicant.leaveBalance });
        }
      }
    }

    const updated = storage.updateLeave(id, {
      status,
      reviewedBy: req.user.name,
      reviewerComments: reviewerComments || ''
    });

    res.json({
      success: true,
      message: `Leave request has been ${status.toLowerCase()} successfully.`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error reviewing leave request' });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
};
