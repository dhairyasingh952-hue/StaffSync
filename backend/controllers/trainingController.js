const storage = require('../services/storage');

// @desc    Get training programs
// @route   GET /api/trainings
// @access  Private
const getTrainings = async (req, res) => {
  try {
    let list = storage.getTrainings();

    if (req.user.role === 'employee') {
      // Show trainings assigned to this employee or to their department or All
      list = list.filter(
        (t) =>
          t.department === 'All' ||
          t.department === req.user.department ||
          t.assignedTo.some((a) => a.userId === req.user._id)
      );
    } else if (req.user.role === 'manager') {
      // Show trainings managed by this manager or in their department
      list = list.filter(
        (t) =>
          t.managerId === req.user._id ||
          t.department === req.user.department ||
          t.department === 'All'
      );
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving training programs' });
  }
};

// @desc    Create a training program (Manager or HR)
// @route   POST /api/trainings
// @access  Private (Manager, HR)
const createTraining = async (req, res) => {
  try {
    const { title, description, department, assignedUserIds, deadline, materialsUrl } = req.body;

    if (!title || !description || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and deadline are required'
      });
    }

    // Build assignedTo array
    const assignedTo = [];
    if (Array.isArray(assignedUserIds) && assignedUserIds.length > 0) {
      assignedUserIds.forEach((uid) => {
        const u = storage.getUserById(uid);
        if (u) {
          assignedTo.push({
            userId: u._id,
            userName: u.name,
            status: 'Not Started'
          });
        }
      });
    }

    const training = storage.createTraining({
      title,
      description,
      department: department || req.user.department || 'Engineering',
      assignedTo,
      managerId: req.user._id,
      managerName: req.user.name,
      deadline,
      materialsUrl: materialsUrl || 'https://staffsync.internal/materials',
      status: 'In Progress'
    });

    res.status(201).json({
      success: true,
      message: 'Training module created and assigned successfully',
      data: training
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating training module' });
  }
};

// @desc    Update employee status in a training program
// @route   PUT /api/trainings/:id/progress
// @access  Private (Employee)
const updateTrainingProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Not Started', 'In Progress', 'Completed'

    const training = storage.getTrainings().find((t) => t._id === id);
    if (!training) {
      return res.status(404).json({ success: false, message: 'Training program not found' });
    }

    let userProgress = training.assignedTo.find((a) => a.userId === req.user._id);
    if (!userProgress) {
      // Add employee if not explicitly in list yet
      userProgress = {
        userId: req.user._id,
        userName: req.user.name,
        status: status || 'In Progress'
      };
      training.assignedTo.push(userProgress);
    } else {
      userProgress.status = status;
      if (status === 'Completed') {
        userProgress.completedAt = new Date().toISOString();
      }
    }

    const updated = storage.updateTraining(id, { assignedTo: training.assignedTo });
    res.json({
      success: true,
      message: 'Training progress updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating training progress' });
  }
};

// @desc    Delete training program (Manager or HR)
// @route   DELETE /api/trainings/:id
// @access  Private (Manager, HR)
const deleteTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const success = storage.deleteTraining(id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Training not found' });
    }
    res.json({ success: true, message: 'Training module deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting training module' });
  }
};

module.exports = {
  getTrainings,
  createTraining,
  updateTrainingProgress,
  deleteTraining
};
