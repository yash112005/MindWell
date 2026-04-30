const express      = require('express');
const router       = express.Router();
const verifyAdmin  = require('../middleware/verifyAdmin');
const verifySuperAdmin = require('../middleware/verifySuperAdmin');
const bcrypt       = require('bcrypt');
const User         = require('../models/User');


router.get('/dashboard', verifyAdmin, async (req, res) => {
  try {
    const totalUsers    = await User.countDocuments({ role: 'user' });
    const activeToday   = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 24*60*60*1000) }
    });
    const newToday      = await User.countDocuments({
      createdAt: { $gte: new Date().setHours(0,0,0,0) }
    });

    res.json({
      success: true,
      stats: { totalUsers, activeToday, newToday }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/create', verifySuperAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const allowedRoles = ['admin', 'moderator', 'analyst', 'editor'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const newAdmin = new User({
      name,
      email,
      passwordHash: await bcrypt.hash(password, salt),
      role
    });

    await newAdmin.save();
    res.json({ success: true, message: `${role} created successfully` });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.patch('/users/:id/role', verifySuperAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    await User.updateOne({ _id: req.params.id }, { $set: { role } });
    res.json({ success: true, message: 'Role updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
