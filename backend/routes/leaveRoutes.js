const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
} = require('../controllers/leaveController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', applyLeave);
router.get('/my', getMyLeaves);
router.get('/', authorizeRoles('hr', 'manager'), getAllLeaves);
router.put('/:id/status', authorizeRoles('hr', 'manager'), updateLeaveStatus);

module.exports = router;
