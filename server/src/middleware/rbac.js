const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const AuditLog = require('../models/AuditLog');

const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.admin = await AdminUser.findById(decoded.id).select('-passwordHash');
      if (!req.admin) {
        return res.status(401).json({ message: 'Not authorized as admin' });
      }
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin || !allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
};

const logAudit = (action, targetType) => {
  return async (req, res, next) => {
    
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          await AuditLog.create({
            adminId: req.admin._id,
            action,
            targetId: req.params.id || null, 
            targetType,
            details: `Method: ${req.method}, Path: ${req.originalUrl}`,
            ipAddress: req.ip
          });
        } catch (err) {
          console.error("Audit log failed:", err);
        }
      }
    });
    next();
  };
};

module.exports = { protectAdmin, verifyRole, logAudit };
