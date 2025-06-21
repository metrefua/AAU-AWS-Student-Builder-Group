const User = require('../models/User');

const requireAdmin = async (req, res, next) => {
  try {
    // First check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    // Check if user exists and has admin role
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        error: 'Admin access required'
      });
    }

    // Add user to request for use in controllers
    req.adminUser = user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      error: 'Server error in admin middleware'
    });
  }
};

module.exports = requireAdmin; 