const dataService = require('../services/dataService');

// @desc    Apply for a leave
// @route   POST /api/leaves/apply
// @access  Private (Employee)
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, duration, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Leave Type, Dates, Reason)'
      });
    }

    const leaveDuration = Number(duration) || 1;
    if (leaveDuration <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Leave duration must be at least 1 day'
      });
    }

    // Check if start date is in the past
    const parsedStart = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!isNaN(parsedStart.getTime()) && parsedStart < today) {
      return res.status(400).json({
        success: false,
        message: 'Leave start date cannot be before today'
      });
    }

    // Check employee current leave balance
    const user = await dataService.findUserById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.availableLeave < leaveDuration) {
      return res.status(400).json({
        success: false,
        message: `Insufficient leave balance. You have ${user.availableLeave} days available, but requested ${leaveDuration} days.`
      });
    }

    const leave = await dataService.createLeave({
      employee: req.user._id,
      employeeName: user.name,
      employeeId: user.employeeId,
      department: user.department,
      leaveType,
      startDate,
      endDate,
      duration: leaveDuration,
      reason,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      leave
    });
  } catch (error) {
    console.error('Apply leave error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply for leave',
      error: error.message
    });
  }
};

// @desc    Get current employee's leaves
// @route   GET /api/leaves/my-leaves
// @access  Private (Employee)
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await dataService.getLeavesByEmployee(req.user._id);
    res.json({
      success: true,
      count: leaves.length,
      leaves
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve leave history',
      error: error.message
    });
  }
};

// @desc    Get employee dashboard stats
// @route   GET /api/leaves/my-stats
// @access  Private (Employee)
const getMyStats = async (req, res) => {
  try {
    const user = await dataService.findUserById(req.user._id);
    const leaves = await dataService.getLeavesByEmployee(req.user._id);

    const pendingCount = leaves.filter(l => l.status === 'Pending').length;

    res.json({
      success: true,
      stats: {
        totalLeave: user.totalLeave,
        availableLeave: user.availableLeave,
        usedLeave: user.usedLeave,
        pendingRequests: pendingCount,
        recentRequests: leaves.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve employee dashboard stats',
      error: error.message
    });
  }
};

// @desc    Get all leave requests (Admin)
// @route   GET /api/leaves/all
// @access  Private (Admin)
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await dataService.getAllLeaves();
    res.json({
      success: true,
      count: leaves.length,
      leaves
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve leaves',
      error: error.message
    });
  }
};

// @desc    Update leave status (Approve / Reject)
// @route   PUT /api/leaves/:id/status
// @access  Private (Admin)
const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemark } = req.body;

    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Approved, Rejected, or Pending'
      });
    }

    const leave = await dataService.findLeaveById(id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    const updatedLeave = await dataService.updateLeaveStatus(id, status, adminRemark);

    res.json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully`,
      leave: updatedLeave
    });
  } catch (error) {
    console.error('Update leave status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update leave status',
      error: error.message
    });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getMyStats,
  getAllLeaves,
  updateLeaveStatus
};
