const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Leave = require('../models/Leave');
const { getIsConnected } = require('../config/db');

// Hash password helper
const hashPassword = (pwd) => bcrypt.hashSync(pwd, 10);
const defaultHashedPassword = hashPassword('password123');

// Initial seed data matching the reference UI mockup exactly
const initialUsers = [
  {
    _id: 'user_001',
    name: 'Ankitha Poojary',
    email: 'ankitha@example.com',
    password: defaultHashedPassword,
    role: 'employee',
    employeeId: 'EMP001',
    department: 'Engineering',
    totalLeave: 20,
    usedLeave: 0,
    availableLeave: 20,
    avatarInitials: 'AP'
  },
  {
    _id: 'user_002',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    password: defaultHashedPassword,
    role: 'employee',
    employeeId: 'EMP002',
    department: 'Finance',
    totalLeave: 20,
    usedLeave: 5,
    availableLeave: 15,
    avatarInitials: 'RS'
  },
  {
    _id: 'user_003',
    name: 'Sneha Iyer',
    email: 'sneha@example.com',
    password: defaultHashedPassword,
    role: 'employee',
    employeeId: 'EMP003',
    department: 'HR',
    totalLeave: 20,
    usedLeave: 2,
    availableLeave: 18,
    avatarInitials: 'SI'
  },
  {
    _id: 'user_004',
    name: 'Karan Patel',
    email: 'karan@example.com',
    password: defaultHashedPassword,
    role: 'employee',
    employeeId: 'EMP004',
    department: 'Engineering',
    totalLeave: 20,
    usedLeave: 4,
    availableLeave: 16,
    avatarInitials: 'KP'
  },
  {
    _id: 'user_005',
    name: 'Priya Nair',
    email: 'priya@example.com',
    password: defaultHashedPassword,
    role: 'employee',
    employeeId: 'EMP005',
    department: 'Design',
    totalLeave: 20,
    usedLeave: 3,
    availableLeave: 17,
    avatarInitials: 'PN'
  },
  {
    _id: 'user_006',
    name: 'Amit Verma',
    email: 'amit@example.com',
    password: defaultHashedPassword,
    role: 'employee',
    employeeId: 'EMP006',
    department: 'Marketing',
    totalLeave: 20,
    usedLeave: 6,
    availableLeave: 14,
    avatarInitials: 'AV'
  },
  {
    _id: 'user_007',
    name: 'Neha Gupta',
    email: 'neha@example.com',
    password: defaultHashedPassword,
    role: 'employee',
    employeeId: 'EMP007',
    department: 'Engineering',
    totalLeave: 20,
    usedLeave: 1,
    availableLeave: 19,
    avatarInitials: 'NG'
  },
  {
    _id: 'user_008',
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    password: defaultHashedPassword,
    role: 'employee',
    employeeId: 'EMP008',
    department: 'Operations',
    totalLeave: 20,
    usedLeave: 8,
    availableLeave: 12,
    avatarInitials: 'VS'
  },
  {
    _id: 'user_009',
    name: 'Pooja Reddy',
    email: 'pooja@example.com',
    password: defaultHashedPassword,
    role: 'employee',
    employeeId: 'EMP009',
    department: 'QA',
    totalLeave: 20,
    usedLeave: 2,
    availableLeave: 18,
    avatarInitials: 'PR'
  },
  {
    _id: 'user_010',
    name: 'Rohan Das',
    email: 'rohan@example.com',
    password: defaultHashedPassword,
    role: 'employee',
    employeeId: 'EMP010',
    department: 'Engineering',
    totalLeave: 20,
    usedLeave: 0,
    availableLeave: 20,
    avatarInitials: 'RD'
  },
  {
    _id: 'admin_001',
    name: 'Admin',
    email: 'admin@example.com',
    password: defaultHashedPassword,
    role: 'admin',
    employeeId: 'ADM001',
    department: 'Administrator',
    totalLeave: 25,
    usedLeave: 0,
    availableLeave: 25,
    avatarInitials: 'AD'
  }
];

const initialLeaves = [
  {
    _id: 'leave_001',
    employee: 'user_001',
    employeeName: 'Ankitha Poojary',
    employeeId: 'EMP001',
    department: 'Engineering',
    leaveType: 'Casual Leave',
    startDate: '12 Sep 2026',
    endDate: '12 Sep 2026',
    duration: 1,
    reason: 'Family function attendance',
    status: 'Pending',
    adminRemark: '',
    createdAt: new Date('2026-09-11')
  },
  {
    _id: 'leave_002',
    employee: 'user_002',
    employeeName: 'Rahul Sharma',
    leaveType: 'Sick Leave',
    startDate: '15 Sep 2026',
    endDate: '16 Sep 2026',
    duration: 2,
    reason: 'Viral fever and rest',
    status: 'Pending',
    adminRemark: '',
    createdAt: new Date('2026-09-14')
  },
  {
    _id: 'leave_003',
    employee: 'user_003',
    employeeName: 'Sneha Iyer',
    leaveType: 'Earned Leave',
    startDate: '01 Sep 2026',
    endDate: '05 Sep 2026',
    duration: 5,
    reason: 'Annual vacation trip',
    status: 'Approved',
    adminRemark: 'Approved by HR',
    createdAt: new Date('2026-08-25')
  },
  {
    _id: 'leave_004',
    employee: 'user_004',
    employeeName: 'Karan Patel',
    leaveType: 'Casual Leave',
    startDate: '20 Aug 2026',
    endDate: '22 Aug 2026',
    duration: 3,
    reason: 'Personal errands',
    status: 'Rejected',
    adminRemark: 'Critical release scheduled on these dates',
    createdAt: new Date('2026-08-15')
  },
  {
    _id: 'leave_005',
    employee: 'user_005',
    employeeName: 'Priya Nair',
    leaveType: 'Casual Leave',
    startDate: '18 Sep 2026',
    endDate: '19 Sep 2026',
    duration: 2,
    reason: 'Attending design conference',
    status: 'Pending',
    adminRemark: '',
    createdAt: new Date('2026-09-17')
  },
  {
    _id: 'leave_006',
    employee: 'user_006',
    employeeName: 'Amit Verma',
    leaveType: 'Earned Leave',
    startDate: '10 Sep 2026',
    endDate: '14 Sep 2026',
    duration: 4,
    reason: 'Personal work',
    status: 'Approved',
    adminRemark: 'Approved',
    createdAt: new Date('2026-09-08')
  },
  {
    _id: 'leave_007',
    employee: 'user_007',
    employeeName: 'Neha Gupta',
    leaveType: 'Sick Leave',
    startDate: '19 Sep 2026',
    endDate: '19 Sep 2026',
    duration: 1,
    reason: 'Doctor appointment',
    status: 'Pending',
    adminRemark: '',
    createdAt: new Date('2026-09-18')
  }
];

// Fallback in-memory storage
let memoryUsers = JSON.parse(JSON.stringify(initialUsers));
let memoryLeaves = JSON.parse(JSON.stringify(initialLeaves));

// Ensure MongoDB database is seeded if connected
const seedMongoIfEmpty = async () => {
  if (!getIsConnected()) return;
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial MongoDB users...');
      const createdUsers = [];
      for (const u of initialUsers) {
        const { _id, ...userData } = u;
        const created = await User.create(userData);
        createdUsers.push({ oldId: _id, newId: created._id.toString(), email: created.email });
      }

      console.log('🌱 Seeding initial MongoDB leaves...');
      for (const l of initialLeaves) {
        const { _id, employee, ...leaveData } = l;
        const matchingUser = createdUsers.find(u => u.oldId === employee);
        if (matchingUser) {
          await Leave.create({
            ...leaveData,
            employee: matchingUser.newId
          });
        }
      }
      console.log('✅ MongoDB Seed completed.');
    }
  } catch (err) {
    console.error('Seed check failed:', err.message);
  }
};

// Data access operations
const dataService = {
  seedMongoIfEmpty,

  async findUserByEmail(email) {
    if (getIsConnected()) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    return memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (getIsConnected()) {
      return await User.findById(id).select('-password');
    }
    const user = memoryUsers.find(u => u._id.toString() === id.toString());
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async getAllEmployees() {
    if (getIsConnected()) {
      return await User.find({ role: 'employee' }).select('-password').sort({ createdAt: 1 });
    }
    return memoryUsers
      .filter(u => u.role === 'employee')
      .map(({ password, ...u }) => u);
  },

  async getAllUsers() {
    if (getIsConnected()) {
      return await User.find().select('-password');
    }
    return memoryUsers.map(({ password, ...u }) => u);
  },

  async updateUserLeaveBalance(userId, usedIncrement) {
    if (getIsConnected()) {
      const user = await User.findById(userId);
      if (!user) return null;
      user.usedLeave += usedIncrement;
      user.availableLeave = Math.max(0, user.totalLeave - user.usedLeave);
      await user.save();
      return user;
    }
    const user = memoryUsers.find(u => u._id.toString() === userId.toString());
    if (user) {
      user.usedLeave += usedIncrement;
      user.availableLeave = Math.max(0, user.totalLeave - user.usedLeave);
    }
    return user;
  },

  async getAllLeaves() {
    if (getIsConnected()) {
      return await Leave.find().populate('employee', 'name email employeeId department').sort({ createdAt: -1 });
    }
    return [...memoryLeaves].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getLeavesByEmployee(employeeId) {
    if (getIsConnected()) {
      return await Leave.find({ employee: employeeId }).sort({ createdAt: -1 });
    }
    return memoryLeaves
      .filter(l => l.employee.toString() === employeeId.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async createLeave(leaveData) {
    if (getIsConnected()) {
      return await Leave.create(leaveData);
    }
    const newLeave = {
      _id: 'leave_' + Date.now(),
      ...leaveData,
      status: 'Pending',
      adminRemark: '',
      createdAt: new Date()
    };
    memoryLeaves.unshift(newLeave);
    return newLeave;
  },

  async findLeaveById(id) {
    if (getIsConnected()) {
      return await Leave.findById(id);
    }
    return memoryLeaves.find(l => l._id.toString() === id.toString()) || null;
  },

  async updateLeaveStatus(id, status, adminRemark = '') {
    if (getIsConnected()) {
      const leave = await Leave.findById(id);
      if (!leave) return null;
      const oldStatus = leave.status;
      leave.status = status;
      if (adminRemark) leave.adminRemark = adminRemark;
      await leave.save();

      // If newly approved, deduct from leave balance
      if (status === 'Approved' && oldStatus !== 'Approved') {
        await dataService.updateUserLeaveBalance(leave.employee, leave.duration);
      }
      // If was approved and now rejected/cancelled, refund leave balance
      if (oldStatus === 'Approved' && status !== 'Approved') {
        await dataService.updateUserLeaveBalance(leave.employee, -leave.duration);
      }
      return leave;
    }

    const leave = memoryLeaves.find(l => l._id.toString() === id.toString());
    if (leave) {
      const oldStatus = leave.status;
      leave.status = status;
      if (adminRemark) leave.adminRemark = adminRemark;

      if (status === 'Approved' && oldStatus !== 'Approved') {
        dataService.updateUserLeaveBalance(leave.employee, leave.duration);
      }
      if (oldStatus === 'Approved' && status !== 'Approved') {
        dataService.updateUserLeaveBalance(leave.employee, -leave.duration);
      }
    }
    return leave;
  },

  async getAdminStats() {
    let employees = [];
    let leaves = [];
    if (getIsConnected()) {
      employees = await User.find({ role: 'employee' });
      leaves = await Leave.find();
    } else {
      employees = memoryUsers.filter(u => u.role === 'employee');
      leaves = memoryLeaves;
    }

    const totalEmployees = employees.length;
    const pendingRequests = leaves.filter(l => l.status === 'Pending').length;
    const approvedThisMonth = leaves.filter(l => l.status === 'Approved').length;
    const rejectedThisMonth = leaves.filter(l => l.status === 'Rejected').length;

    return {
      totalEmployees,
      pendingRequests,
      approvedThisMonth,
      rejectedThisMonth
    };
  }
};

module.exports = dataService;
