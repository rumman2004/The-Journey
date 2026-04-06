const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserMemories,
  getUserPhotos
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const multer = require('multer');

// Setup multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});
// @route   GET /api/users
// @desc    Get all users
// @access  Public
router.get('/', getUsers);

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Public
router.get('/:id', getUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', auth, upload.single('profilePicture'), updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private
router.delete('/:id', auth, deleteUser);

// @route   GET /api/users/:id/memories
// @desc    Get user memories
// @access  Public
router.get('/:id/memories', getUserMemories);

// @route   GET /api/users/:id/photos
// @desc    Get user photos
// @access  Public
router.get('/:id/photos', getUserPhotos);

module.exports = router;