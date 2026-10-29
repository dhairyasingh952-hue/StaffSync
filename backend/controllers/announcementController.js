const storage = require('../services/storage');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private (All roles)
const getAnnouncements = async (req, res) => {
  try {
    const list = storage.getAnnouncements();
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving announcements' });
  }
};

// @desc    Create an announcement (HR only)
// @route   POST /api/announcements
// @access  Private (HR)
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, category, priority } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const ann = storage.createAnnouncement({
      title,
      content,
      category: category || 'General',
      priority: priority || 'Medium',
      authorName: req.user.name,
      authorId: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Announcement published successfully',
      data: ann
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error publishing announcement' });
  }
};

// @desc    Delete announcement (HR only)
// @route   DELETE /api/announcements/:id
// @access  Private (HR)
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const success = storage.deleteAnnouncement(id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.json({ success: true, message: 'Announcement removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting announcement' });
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
};
