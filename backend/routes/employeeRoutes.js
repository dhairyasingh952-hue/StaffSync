const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getMyTeam,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAllEmployees);
router.get('/my-team', authorizeRoles('manager', 'hr'), getMyTeam);
router.get('/:id', getEmployeeById);
router.post('/', authorizeRoles('hr'), createEmployee);
router.put('/:id', authorizeRoles('hr'), updateEmployee);
router.delete('/:id', authorizeRoles('hr'), deleteEmployee);

module.exports = router;
