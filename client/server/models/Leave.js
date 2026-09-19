const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  employeeId: {
    type: String,
    required: true
  },
  department: {
    type: String,
    default: 'Engineering'
  },
  leaveType: {
    type: String,
    required: true,
    enum: ['Casual Leave', 'Sick Leave', 'Earned Leave']
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  adminRemark: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Leave || mongoose.model('Leave', leaveSchema);
