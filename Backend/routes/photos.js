const express = require('express');
const router = express.Router();
const {
  uploadPhotos,
  getPhotos,
  getPhoto,
  updatePhoto,
  deletePhoto,
  likePhoto
} = require('../controllers/photoController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/photos
// @desc    Get all photos
// @access  Public
router.get('/', getPhotos);

// @route   GET /api/photos/:id
// @desc    Get single photo
// @access  Public/Private
router.get('/:id', getPhoto);

// @route   POST /api/photos/upload
// @desc    Upload photos
// @access  Private
router.post('/upload', auth, upload.array('photos', 10), uploadPhotos);

// @route   PUT /api/photos/:id
// @desc    Update photo
// @access  Private
router.put('/:id', auth, updatePhoto);

// @route   DELETE /api/photos/:id
// @desc    Delete photo
// @access  Private
router.delete('/:id', auth, deletePhoto);

// @route   POST /api/photos/:id/like
// @desc    Like/Unlike photo
// @access  Private
router.post('/:id/like', auth, likePhoto);

module.exports = router;