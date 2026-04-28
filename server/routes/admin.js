const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Password = require('../models/Password');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Apply auth and isAdmin middleware to all admin routes
router.use(auth, isAdmin);

// @route   GET /api/admin/users
// @desc    Get all users (excluding passwords)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update a user
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    // Check if user exists
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;
    if (role) {
      user.role = role;
    }

    const updatedUser = await user.save();
    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating user' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Also delete passwords associated with this user
    await Password.deleteMany({ userId: req.params.id });
    
    // Delete user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User and their passwords removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

module.exports = router;
