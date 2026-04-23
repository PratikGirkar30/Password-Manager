const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  site: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String, // Keeping plain text/basic for simplicity as per requirements
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Password', passwordSchema);
