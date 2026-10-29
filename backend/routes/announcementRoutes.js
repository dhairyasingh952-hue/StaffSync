const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAnnouncements);
router.post('/', authorizeRoles('hr'), createAnnouncement);
router.delete('/:id', authorizeRoles('hr'), deleteAnnouncement);

module.exports = router;
