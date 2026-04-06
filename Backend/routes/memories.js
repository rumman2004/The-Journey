const express = require('express');
const router = express.Router();
const {
  getMemories,
  getMemory,
  getMyMemories,
  createMemory,
  updateMemory,
  deleteMemory,
  likeMemory,
  addComment
} = require('../controllers/memoryController');
const auth = require('../middleware/auth');

// @route   GET /api/memories/my/history
// @desc    Get all memories authored by the active user
// @access  Private
router.get('/my/history', auth, getMyMemories);

// @route   GET /api/memories
// @desc    Get all memories
// @access  Public
router.get('/', getMemories);

// @route   GET /api/memories/:id
// @desc    Get single memory
// @access  Public/Private
router.get('/:id', getMemory);

// @route   POST /api/memories
// @desc    Create memory
// @access  Private
router.post('/', auth, createMemory);

// @route   PUT /api/memories/:id
// @desc    Update memory
// @access  Private
router.put('/:id', auth, updateMemory);

// @route   DELETE /api/memories/:id
// @desc    Delete memory
// @access  Private
router.delete('/:id', auth, deleteMemory);

// @route   POST /api/memories/:id/like
// @desc    Like/Unlike memory
// @access  Private
router.post('/:id/like', auth, likeMemory);

// @route   POST /api/memories/:id/comments
// @desc    Add comment to memory
// @access  Private
router.post('/:id/comments', auth, addComment);

module.exports = router;