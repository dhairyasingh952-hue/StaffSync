const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getDepartments
} = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/departments', getDepartments);

module.exports = router;
