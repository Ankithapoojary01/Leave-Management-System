const express = require('express');
const router = express.Router();
const { loginUser, getCurrentUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.get('/me', protect, getCurrentUserProfile);

module.exports = router;
