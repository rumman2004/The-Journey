const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private (own profile only)
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let parsedSocialLinks = user.socialLinks;
    if (req.body.socialLinks) {
      try {
        parsedSocialLinks = typeof req.body.socialLinks === 'string' 
          ? JSON.parse(req.body.socialLinks) 
          : req.body.socialLinks;
      } catch (e) {
        // fallback
      }
    }

    let finalProfilePicture = req.body.profilePicture || user.profilePicture;
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'profile-pictures',
        resource_type: 'image'
      });
      finalProfilePicture = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { 
        name: req.body.name, 
        socialLinks: parsedSocialLinks, 
        profilePicture: finalProfilePicture 
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    console.error('updateUser error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (own profile only or admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user memories
// @route   GET /api/users/:id/memories
// @access  Public (for public memories)
const getUserMemories = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const Memory = require('../models/Memory');
    const memories = await Memory.find({
      author: req.params.id,
      isPublic: true
    })
      .populate('author', 'name profilePicture batch')
      .sort({ createdAt: -1 });

    res.json(memories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user photos
// @route   GET /api/users/:id/photos
// @access  Public (for public photos)
const getUserPhotos = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const Photo = require('../models/Photo');
    const photos = await Photo.find({
      uploadedBy: req.params.id,
      isPublic: true
    })
      .populate('uploadedBy', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserMemories,
  getUserPhotos
};