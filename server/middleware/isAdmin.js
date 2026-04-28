const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    // req.user comes from the auth middleware
    const user = await User.findById(req.user);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error checking admin status' });
  }
};

module.exports = isAdmin;
