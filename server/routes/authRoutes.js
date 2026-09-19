const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getCurrentUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/me', protect, getCurrentUserProfile);

module.exports = router;
