const Photo = require('../models/Photo');
const cloudinary = require('../config/cloudinary');

// @desc    Upload photos
// @route   POST /api/photos/upload
// @access  Private
const uploadPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedPhotos = [];

    for (const file of req.files) {
      // Convert buffer to Data URI for Cloudinary
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'college-memories',
        resource_type: 'auto'
      });

      // Create photo record
      const photo = await Photo.create({
        title: req.body.title || '',
        description: req.body.description || '',
        caption: req.body.caption || req.body.title || '',
        imageUrl: result.secure_url,
        publicId: result.public_id,
        uploadedBy: req.user._id,
        album: req.body.album || 'general',
        semester: req.body.semester || 'General',
        tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
        isPublic: req.body.isPublic !== 'false'
      });

      uploadedPhotos.push(photo);
    }

    res.status(201).json({
      message: 'Photos uploaded successfully',
      photos: uploadedPhotos
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all photos
// @route   GET /api/photos
// @access  Public (for public photos)
const getPhotos = async (req, res) => {
  try {
    const { page = 1, limit = 20, album, semester, uploadedBy } = req.query;

    let query = { isPublic: true };

    if (album) query.album = album;
    if (semester && semester !== 'All') query.semester = semester;
    if (uploadedBy) query.uploadedBy = uploadedBy;

    const photos = await Photo.find(query)
      .populate('uploadedBy', 'name profilePicture')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Photo.countDocuments(query);

    res.json({
      photos,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single photo
// @route   GET /api/photos/:id
// @access  Public (if public) or Private (if own)
const getPhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)
      .populate('uploadedBy', 'name profilePicture')
      .populate('memory');

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Check if user can view this photo
    if (!photo.isPublic && (!req.user || req.user._id.toString() !== photo.uploadedBy._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(photo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update photo
// @route   PUT /api/photos/:id
// @access  Private (uploader only)
const updatePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    if (photo.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedPhoto = await Photo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'name profilePicture');

    res.json(updatedPhoto);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete photo
// @route   DELETE /api/photos/:id
// @access  Private (uploader only)
const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    if (photo.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(photo.publicId);

    await Photo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Like/Unlike photo
// @route   POST /api/photos/:id/like
// @access  Private
const likePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const userId = req.user._id;
    const isLiked = photo.likes.includes(userId);

    if (isLiked) {
      photo.likes = photo.likes.filter(id => id.toString() !== userId.toString());
    } else {
      photo.likes.push(userId);
    }

    await photo.save();
    res.json({ likes: photo.likes.length, isLiked: !isLiked });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  uploadPhotos,
  getPhotos,
  getPhoto,
  updatePhoto,
  deletePhoto,
  likePhoto
};