// High-fidelity in-browser store fallback for static hosting (Vercel & GitHub Pages)
const DEFAULT_USERS = [
  {
    id: 'user_001',
    name: 'Ankitha Poojary',
    email: 'ankitha@example.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP001',
    department: 'Engineering',
    totalLeave: 20,
    usedLeave: 0,
    availableLeave: 20,
    avatarInitials: 'AP'
  },
  {
    id: 'user_002',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP002',
    department: 'Finance',
    totalLeave: 20,
    usedLeave: 5,
    availableLeave: 15,
    avatarInitials: 'RS'
  },
  {
    id: 'user_003',
    name: 'Sneha Iyer',
    email: 'sneha@example.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP003',
    department: 'HR',
    totalLeave: 20,
    usedLeave: 2,
    availableLeave: 18,
    avatarInitials: 'SI'
  },
  {
    id: 'user_004',
    name: 'Karan Patel',
    email: 'karan@example.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP004',
    department: 'Engineering',
    totalLeave: 20,
    usedLeave: 4,
    availableLeave: 16,
    avatarInitials: 'KP'
  },
  {
    id: 'admin_001',
    name: 'Admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    employeeId: 'ADM001',
    department: 'Administration',
    totalLeave: 25,
    usedLeave: 0,
    availableLeave: 25,
    avatarInitials: 'AD'
  }
];

const DEFAULT_LEAVES = [
  {
    _id: 'leave_001',
    employee: 'user_001',
    employeeName: 'Ankitha Poojary',
    employeeId: 'EMP001',
    department: 'Engineering',
    leaveType: 'Casual Leave',
    startDate: '10 Sep 2026',
    endDate: '12 Sep 2026',
    duration: 3,
    reason: 'Family function attendance',
    status: 'Approved',
    adminRemark: 'Approved',
    createdAt: '2026-09-08T10:00:00.000Z'
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
    createdAt: '2026-09-14T10:00:00.000Z'
  },
  {
    _id: 'leave_003',
    employee: 'user_003',
    employeeName: 'Sneha Iyer',
    leaveType: 'Earned Leave',
    startDate: '01 Jul 2026',
    endDate: '05 Jul 2026',
    duration: 5,
    reason: 'Annual vacation trip',
    status: 'Pending',
    adminRemark: '',
    createdAt: '2026-06-25T10:00:00.000Z'
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
    adminRemark: 'Critical release scheduled',
    createdAt: '2026-08-15T10:00:00.000Z'
  }
];

const getStoredUsers = () => {
  const saved = localStorage.getItem('leaveflow_cloud_users');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  localStorage.setItem('leaveflow_cloud_users', JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
};

const saveStoredUsers = (users) => {
  localStorage.setItem('leaveflow_cloud_users', JSON.stringify(users));
};

const getStoredLeaves = () => {
  const saved = localStorage.getItem('leaveflow_cloud_leaves');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  localStorage.setItem('leaveflow_cloud_leaves', JSON.stringify(DEFAULT_LEAVES));
  return DEFAULT_LEAVES;
};

const saveStoredLeaves = (leaves) => {
  localStorage.setItem('leaveflow_cloud_leaves', JSON.stringify(leaves));
};

export const handleMockFallback = (config) => {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();
  let body = {};
  if (config.data) {
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch (e) {
      body = {};
    }
  }

  const users = getStoredUsers();
  const leaves = getStoredLeaves();
  const currentUser = JSON.parse(localStorage.getItem('leaveflow_user') || 'null');

  // 1. POST /auth/login
  if (url.includes('/auth/login') && method === 'post') {
    const { email, password, role } = body;
    const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user) {
      return Promise.reject({ response: { status: 401, data: { message: 'Invalid email or password' } } });
    }
    if (role && user.role !== role.toLowerCase()) {
      return Promise.reject({ response: { status: 401, data: { message: `Account found, but role does not match '${role}'` } } });
    }
    if (user.password !== password) {
      return Promise.reject({ response: { status: 401, data: { message: 'Invalid email or password' } } });
    }

    const { password: _, ...safeUser } = user;
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        message: 'Login successful',
        token: 'mock_jwt_token_' + user.id,
        user: safeUser
      }
    });
  }

  // 2. POST /auth/register
  if (url.includes('/auth/register') && method === 'post') {
    const { name, email, password, role = 'employee', department = 'Engineering' } = body;
    const exists = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    if (exists) {
      return Promise.reject({ response: { status: 400, data: { message: 'Email is already registered' } } });
    }

    const normalizedRole = role.toLowerCase() === 'admin' ? 'admin' : 'employee';
    const initials = name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'EM';
    const rand = Math.floor(100 + Math.random() * 900);
    const newUser = {
      id: (normalizedRole === 'admin' ? 'admin_' : 'user_') + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: normalizedRole,
      employeeId: normalizedRole === 'admin' ? `ADM${rand}` : `EMP${rand}`,
      department: normalizedRole === 'admin' ? '' : (department.trim() || 'Engineering'),
      totalLeave: normalizedRole === 'admin' ? 25 : 20,
      usedLeave: 0,
      availableLeave: normalizedRole === 'admin' ? 25 : 20,
      avatarInitials: initials
    };

    users.push(newUser);
    saveStoredUsers(users);

    const { password: _, ...safeUser } = newUser;
    return Promise.resolve({
      status: 201,
      data: {
        success: true,
        message: 'Account created successfully',
        token: 'mock_jwt_token_' + newUser.id,
        user: safeUser
      }
    });
  }

  // 3. GET /auth/me
  if (url.includes('/auth/me')) {
    if (!currentUser) {
      return Promise.reject({ response: { status: 401, data: { message: 'Not authorized' } } });
    }
    const freshUser = users.find(u => u.id === currentUser.id) || currentUser;
    const { password: _, ...safeUser } = freshUser;
    return Promise.resolve({ status: 200, data: { success: true, user: safeUser } });
  }

  // 4. GET /leaves/my-stats
  if (url.includes('/leaves/my-stats')) {
    const freshUser = users.find(u => u.id === currentUser?.id) || currentUser || DEFAULT_USERS[0];
    const userLeaves = leaves.filter(l => l.employee === freshUser.id || l.employeeId === freshUser.employeeId);
    const pendingCount = userLeaves.filter(l => l.status === 'Pending').length;

    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        stats: {
          totalLeave: freshUser.totalLeave,
          availableLeave: freshUser.availableLeave,
          usedLeave: freshUser.usedLeave,
          pendingRequests: pendingCount,
          recentRequests: userLeaves.slice(0, 5)
        }
      }
    });
  }

  // 5. GET /leaves/my-leaves
  if (url.includes('/leaves/my-leaves')) {
    const freshUser = users.find(u => u.id === currentUser?.id) || currentUser || DEFAULT_USERS[0];
    const userLeaves = leaves.filter(l => l.employee === freshUser.id || l.employeeId === freshUser.employeeId);
    return Promise.resolve({
      status: 200,
      data: { success: true, count: userLeaves.length, leaves: userLeaves }
    });
  }

  // 6. POST /leaves/apply
  if (url.includes('/leaves/apply') && method === 'post') {
    const { leaveType, startDate, endDate, duration, reason } = body;
    const freshUser = users.find(u => u.id === currentUser?.id) || currentUser || DEFAULT_USERS[0];
    const leaveDuration = Number(duration) || 1;

    const newLeave = {
      _id: 'leave_' + Date.now(),
      employee: freshUser.id,
      employeeName: freshUser.name,
      employeeId: freshUser.employeeId,
      department: freshUser.department,
      leaveType,
      startDate,
      endDate,
      duration: leaveDuration,
      reason,
      status: 'Pending',
      adminRemark: '',
      createdAt: new Date().toISOString()
    };

    leaves.unshift(newLeave);
    saveStoredLeaves(leaves);

    return Promise.resolve({
      status: 201,
      data: { success: true, message: 'Leave request submitted successfully', leave: newLeave }
    });
  }

  // 7. GET /leaves/all
  if (url.includes('/leaves/all')) {
    return Promise.resolve({
      status: 200,
      data: { success: true, count: leaves.length, leaves }
    });
  }

  // 8. PUT /leaves/:id/status
  if (url.includes('/leaves/') && url.includes('/status') && method === 'put') {
    const parts = url.split('/');
    const statusIdx = parts.indexOf('status');
    const leaveId = parts[statusIdx - 1];
    const { status, adminRemark } = body;

    const leave = leaves.find(l => l._id === leaveId);
    if (leave) {
      const oldStatus = leave.status;
      leave.status = status;
      if (adminRemark) leave.adminRemark = adminRemark;

      // Adjust user balance
      const emp = users.find(u => u.id === leave.employee || u.employeeId === leave.employeeId);
      if (emp) {
        if (status === 'Approved' && oldStatus !== 'Approved') {
          emp.usedLeave += leave.duration;
          emp.availableLeave = Math.max(0, emp.totalLeave - emp.usedLeave);
        }
        if (oldStatus === 'Approved' && status !== 'Approved') {
          emp.usedLeave = Math.max(0, emp.usedLeave - leave.duration);
          emp.availableLeave = Math.max(0, emp.totalLeave - emp.usedLeave);
        }
        saveStoredUsers(users);
      }
      saveStoredLeaves(leaves);
    }

    return Promise.resolve({
      status: 200,
      data: { success: true, message: `Leave ${status.toLowerCase()}`, leave }
    });
  }

  // 9. GET /employees/admin-stats
  if (url.includes('/employees/admin-stats')) {
    const emps = users.filter(u => u.role === 'employee');
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        stats: {
          totalEmployees: emps.length,
          pendingRequests: leaves.filter(l => l.status === 'Pending').length,
          approvedThisMonth: leaves.filter(l => l.status === 'Approved').length,
          rejectedThisMonth: leaves.filter(l => l.status === 'Rejected').length
        }
      }
    });
  }

  // 10. GET /employees/leave-balances
  if (url.includes('/employees/leave-balances')) {
    const emps = users.filter(u => u.role === 'employee');
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        balances: emps.map(e => ({
          id: e.id,
          employeeName: e.name,
          email: e.email,
          department: e.department,
          total: e.totalLeave,
          used: e.usedLeave,
          available: e.availableLeave
        }))
      }
    });
  }

  // 11. GET /employees
  if (url.includes('/employees')) {
    const emps = users.filter(u => u.role === 'employee');
    return Promise.resolve({
      status: 200,
      data: { success: true, count: emps.length, employees: emps }
    });
  }

  return Promise.reject({ response: { status: 404, data: { message: 'Not found' } } });
};
