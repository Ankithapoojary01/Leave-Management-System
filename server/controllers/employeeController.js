const dataService = require('../services/dataService');

// @desc    Get all employees for admin
// @route   GET /api/employees
// @access  Private (Admin)
const getEmployees = async (req, res) => {
  try {
    const employees = await dataService.getAllEmployees();
    res.json({
      success: true,
      count: employees.length,
      employees: employees.map(emp => ({
        id: emp._id,
        name: emp.name,
        email: emp.email,
        employeeId: emp.employeeId,
        department: emp.department,
        totalLeave: emp.totalLeave,
        usedLeave: emp.usedLeave,
        availableLeave: emp.availableLeave,
        avatarInitials: emp.avatarInitials
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve employees',
      error: error.message
    });
  }
};

// @desc    Get Admin Dashboard KPI metrics
// @route   GET /api/employees/admin-stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const stats = await dataService.getAdminStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin stats',
      error: error.message
    });
  }
};

// @desc    Get Leave Balance tracking table
// @route   GET /api/employees/leave-balances
// @access  Private (Admin)
const getLeaveBalances = async (req, res) => {
  try {
    const employees = await dataService.getAllEmployees();
    res.json({
      success: true,
      balances: employees.map(emp => ({
        id: emp._id,
        employeeName: emp.name,
        email: emp.email,
        department: emp.department,
        total: emp.totalLeave,
        used: emp.usedLeave,
        available: emp.availableLeave
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve leave balances',
      error: error.message
    });
  }
};

module.exports = {
  getEmployees,
  getAdminStats,
  getLeaveBalances
};
