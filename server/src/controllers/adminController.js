const AdminUser = require('../models/AdminUser');
const User = require('../models/User');
const Journal = require('../models/Journal');
const Chat = require('../models/Chat');
const CrisisAlert = require('../models/CrisisAlert');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' }); 
};



const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await AdminUser.findOne({ email });
    if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
      admin.lastLogin = Date.now();
      await admin.save();
      res.json({
        _id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const createSuperAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await AdminUser.findOne({ role: 'superadmin' });
    if (exists) return res.status(400).json({ message: 'Superadmin already exists' });
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const admin = await AdminUser.create({ name, email, passwordHash, role: 'superadmin' });
    res.status(201).json({ message: 'Superadmin created successfully', id: admin._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getOverviewStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEntries = await Journal.countDocuments();
    const totalChatSessions = await Chat.countDocuments();
    
    
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const activeUsersToday = await Journal.distinct('userId', { createdAt: { $gte: startOfDay } });
    
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentAlerts = await CrisisAlert.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    
    const sentimentGroups = await Journal.aggregate([
      { $group: { _id: { $toLower: "$sentiment" }, count: { $sum: 1 } } }
    ]);
    const sentiments = { positive: 0, neutral: 0, negative: 0, mixed: 0 };
    sentimentGroups.forEach(g => {
      if (sentiments[g._id] !== undefined) sentiments[g._id] = g.count;
    });

    res.json({
      totalUsers,
      activeUsersToday: activeUsersToday.length,
      totalEntries,
      totalChatSessions,
      crisisAlertsWeek: recentAlerts,
      sentiments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getUsersList = async (req, res) => {
  try {
    
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  loginAdmin,
  createSuperAdmin,
  getOverviewStats,
  getUsersList
};
