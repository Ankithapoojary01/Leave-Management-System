const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getAdminStats,
  getLeaveBalances
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin-only employee management & metrics
router.get('/', protect, authorize('admin'), getEmployees);
router.get('/admin-stats', protect, authorize('admin'), getAdminStats);
router.get('/leave-balances', protect, authorize('admin'), getLeaveBalances);

module.exports = router;
