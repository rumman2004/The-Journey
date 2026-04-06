const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { rollNumber, name } = req.body;

    // Validation
    if (!rollNumber || !name) {
      return res.status(400).json({ message: 'Please provide roll number and name' });
    }

    // Find user by rollNumber
    const user = await User.findOne({ rollNumber: Number(rollNumber) });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. Roll number not found.' });
    }

    // Check name (case-insensitive)
    if (user.name.trim().toLowerCase() !== name.trim().toLowerCase()) {
      return res.status(400).json({ message: 'Invalid credentials. Name does not match.' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return the full user document (minus password) so the frontend
    // always has _id, socialLinks, etc. — consistent with GET /me.
    const safeUser = await User.findById(user._id).select('-password');

    res.json({
      message: 'Login successful',
      token,
      user: safeUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  login,
  getMe
};