const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getMyStats,
  getAllLeaves,
  updateLeaveStatus
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Employee routes
router.post('/apply', protect, authorize('employee'), applyLeave);
router.get('/my-leaves', protect, authorize('employee'), getMyLeaves);
router.get('/my-stats', protect, authorize('employee'), getMyStats);

// Admin routes
router.get('/all', protect, authorize('admin'), getAllLeaves);
router.put('/:id/status', protect, authorize('admin'), updateLeaveStatus);

module.exports = router;
