const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      userId: user._id, 
      role: user.role,
      name: user.name,
      email: user.email
    },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '7d' } 
  );
};




const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      role: 'user', 
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user),
        role: user.role,
        name: user.name,
        message: 'Registration successful'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account suspended' });
    }

    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    
    await User.updateOne({ _id: user._id }, { lastLogin: new Date() });

    
    return res.status(200).json({
      success: true,
      token: generateToken(user),
      role: user.role,
      name: user.name,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};




const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const adminRoles = ['admin', 'superadmin', 'moderator', 'analyst', 'editor'];

    if (!['user', ...adminRoles].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    
    
    
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({ message: 'You cannot change your own role.' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: `Role updated to ${role}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  updateUserRole,
};
