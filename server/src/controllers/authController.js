const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


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

const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = name || user.name;
      user.phone = phone !== undefined ? phone : user.phone;

      const updatedUser = await user.save();

      res.status(200).json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        preferences: updatedUser.preferences,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const { theme, notifications, dailyReminderTime } = req.body;
    const user = await User.findById(req.user.id);

    if (user) {
      user.preferences = {
        theme: theme || user.preferences.theme,
        notifications: notifications !== undefined ? notifications : user.preferences.notifications,
        dailyReminderTime: dailyReminderTime || user.preferences.dailyReminderTime,
      };

      const updatedUser = await user.save();

      res.status(200).json({
        id: updatedUser._id,
        preferences: updatedUser.preferences,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (user) {
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.status(200).json({ message: 'Password updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide your email' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No account found with that email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Build reset URL
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    // Send email (or log to console if email not configured)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"MindWell" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'MindWell - Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3b82f6;">🧠 MindWell</h1>
            </div>
            <h2 style="color: #1f2937;">Password Reset Request</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              Hi ${user.name},<br><br>
              We received a request to reset your password. Click the button below to set a new password. This link will expire in <strong>15 minutes</strong>.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              If you didn't request this, you can safely ignore this email. Your password will remain unchanged.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              MindWell — Your Mental Wellness Companion
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } else {
      // Dev fallback: log reset link to console
      console.log('\n========================================');
      console.log('📧 PASSWORD RESET LINK (Dev Mode)');
      console.log('========================================');
      console.log(`User: ${user.email}`);
      console.log(`Link: ${resetUrl}`);
      console.log('========================================\n');
    }

    res.status(200).json({ message: 'Password reset link sent to your email' });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to send reset email. Please try again later.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Please provide a new password' });
    }

    // Hash the token from the URL to match the one stored in DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful. You can now log in.' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

module.exports = {
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
};
