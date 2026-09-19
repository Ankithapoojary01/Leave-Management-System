const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dataService = require('../services/dataService');

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'leaveflow_jwt_secret_key_2026_super_secure',
    { expiresIn: '30d' }
  );
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const user = await dataService.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Role check if specified
    if (role && user.role !== role.toLowerCase()) {
      return res.status(401).json({
        success: false,
        message: `Account found, but role does not match selected role '${role}'`
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        department: user.department,
        totalLeave: user.totalLeave,
        usedLeave: user.usedLeave,
        availableLeave: user.availableLeave,
        avatarInitials: user.avatarInitials || (user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U')
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login',
      error: error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getCurrentUserProfile = async (req, res) => {
  try {
    const user = await dataService.findUserById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        department: user.department,
        totalLeave: user.totalLeave,
        usedLeave: user.usedLeave,
        availableLeave: user.availableLeave,
        avatarInitials: user.avatarInitials || (user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U')
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Register a new user (Employee or Admin)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = 'employee', department = 'Engineering' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    const existingUser = await dataService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    const normalizedRole = role.toLowerCase() === 'admin' ? 'admin' : 'employee';
    const hashedPassword = await bcrypt.hash(password, 10);
    const initials = name
      .trim()
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || (normalizedRole === 'admin' ? 'AD' : 'EM');

    const randomNum = Math.floor(100 + Math.random() * 900);
    const employeeId = normalizedRole === 'admin' ? `ADM${randomNum}` : `EMP${randomNum}`;

    const createdUser = await dataService.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: normalizedRole,
      employeeId,
      department: normalizedRole === 'admin' ? '' : (department.trim() || 'Engineering'),
      totalLeave: normalizedRole === 'admin' ? 25 : 20,
      usedLeave: 0,
      availableLeave: normalizedRole === 'admin' ? 25 : 20,
      avatarInitials: initials
    });

    const token = generateToken(createdUser._id, createdUser.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        employeeId: createdUser.employeeId,
        department: createdUser.department,
        totalLeave: createdUser.totalLeave,
        usedLeave: createdUser.usedLeave,
        availableLeave: createdUser.availableLeave,
        avatarInitials: createdUser.avatarInitials
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: error.message
    });
  }
};

module.exports = {
  loginUser,
  registerUser,
  getCurrentUserProfile
};
