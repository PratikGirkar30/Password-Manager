const express = require('express');
const router = express.Router();
const Password = require('../models/Password');
const auth = require('../middleware/auth');

// All routes in this file are protected by auth middleware
router.use(auth);

// @route   GET /api/passwords
// @desc    Get all passwords for logged in user
router.get('/', async (req, res) => {
  try {
    const passwords = await Password.find({ userId: req.user }).sort({ createdAt: -1 });
    res.json(passwords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching passwords' });
  }
});

// @route   POST /api/passwords
// @desc    Add a new password
router.post('/', async (req, res) => {
  try {
    const { site, username, password } = req.body;

    if (!site || !username || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const newPassword = new Password({
      userId: req.user,
      site,
      username,
      password
    });

    const savedPassword = await newPassword.save();
    res.status(201).json(savedPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error saving password' });
  }
});

// @route   DELETE /api/passwords/:id
// @desc    Delete a password
router.delete('/:id', async (req, res) => {
  try {
    const password = await Password.findById(req.params.id);

    if (!password) {
      return res.status(404).json({ message: 'Password not found' });
    }

    // Make sure user owns the password
    if (password.userId.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await password.deleteOne();
    res.json({ message: 'Password removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting password' });
  }
});

// @route   PUT /api/passwords/:id
// @desc    Update a password
router.put('/:id', async (req, res) => {
  try {
    const { site, username, password } = req.body;

    let passwordEntry = await Password.findById(req.params.id);

    if (!passwordEntry) {
      return res.status(404).json({ message: 'Password not found' });
    }

    // Make sure user owns the password
    if (passwordEntry.userId.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    passwordEntry = await Password.findByIdAndUpdate(
      req.params.id,
      { $set: { site, username, password } },
      { new: true }
    );

    res.json(passwordEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating password' });
  }
});

module.exports = router;
