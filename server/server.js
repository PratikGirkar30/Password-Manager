require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/passwords');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/password-manager';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Password Manager API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
