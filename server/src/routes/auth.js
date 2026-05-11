const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  updateUserRole,
  updateProfile,
  updatePreferences,
  updatePassword,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/preferences', protect, updatePreferences);
router.put('/password', protect, updatePassword);


router.get('/users', protect, admin, getUsers);
router.patch('/users/:id/role', protect, admin, updateUserRole);

module.exports = router;
