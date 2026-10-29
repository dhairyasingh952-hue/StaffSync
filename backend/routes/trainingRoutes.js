const express = require('express');
const router = express.Router();
const {
  getTrainings,
  createTraining,
  updateTrainingProgress,
  deleteTraining
} = require('../controllers/trainingController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getTrainings);
router.post('/', authorizeRoles('hr', 'manager'), createTraining);
router.put('/:id/progress', updateTrainingProgress);
router.delete('/:id', authorizeRoles('hr', 'manager'), deleteTraining);

module.exports = router;
