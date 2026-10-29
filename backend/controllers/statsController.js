const storage = require('../services/storage');

// @desc    Get dashboard metrics & summary
// @route   GET /api/stats/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const allUsers = storage.getUsers();
    const allAttendance = storage.getAttendance();
    const allLeaves = storage.getLeaves();
    const allAnnouncements = storage.getAnnouncements();
    const allTrainings = storage.getTrainings();
    const allDepartments = storage.getDepartments();

    // Today's attendance
    const todayAttendance = allAttendance.filter((a) => a.date === today);
    const presentTodayCount = todayAttendance.filter(
      (a) => a.status === 'Present' || a.status === 'Late'
    ).length;

    // Active leaves today
    const activeLeavesToday = allLeaves.filter(
      (l) => l.status === 'Approved' && l.startDate <= today && l.endDate >= today
    );

    const pendingLeaves = allLeaves.filter((l) => l.status === 'Pending');

    // Department breakdown
    const deptDistribution = {};
    allUsers.forEach((u) => {
      const dept = u.department || 'General';
      deptDistribution[dept] = (deptDistribution[dept] || 0) + 1;
    });

    // Manager-specific metrics
    let teamCount = 0;
    let teamPresentToday = 0;
    let teamPendingLeaves = 0;

    if (req.user.role === 'manager') {
      const team = allUsers.filter(
        (u) =>
          u._id !== req.user._id &&
          (u.managerId === req.user._id || u.department === req.user.department)
      );
      teamCount = team.length;
      const teamIds = team.map((t) => t._id);
      teamPresentToday = todayAttendance.filter((a) => teamIds.includes(a.userId)).length;
      teamPendingLeaves = pendingLeaves.filter((l) => teamIds.includes(l.userId)).length;
    }

    res.json({
      success: true,
      data: {
        totalEmployees: allUsers.length,
        presentToday: presentTodayCount,
        onLeaveToday: activeLeavesToday.length,
        pendingLeavesCount: pendingLeaves.length,
        departmentsCount: allDepartments.length,
        activeTrainingsCount: allTrainings.length,
        announcementsCount: allAnnouncements.length,
        departmentDistribution: deptDistribution,
        managerMetrics: {
          teamCount,
          teamPresentToday,
          teamPendingLeaves
        },
        recentAnnouncements: allAnnouncements.slice(0, 3),
        recentLeaves: pendingLeaves.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving dashboard statistics' });
  }
};

// @desc    Get departments list
// @route   GET /api/stats/departments
// @access  Private
const getDepartments = async (req, res) => {
  try {
    const list = storage.getDepartments();
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching departments' });
  }
};

module.exports = {
  getDashboardStats,
  getDepartments
};
