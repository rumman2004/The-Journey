const Memory = require('../models/Memory');
const Photo = require('../models/Photo');
const cloudinary = require('../config/cloudinary');

// @desc    Get all memories
// @route   GET /api/memories
// @access  Public (for public memories)
const getMemories = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, author } = req.query;

    let query = { isPublic: true };

    if (category) query.category = category;
    if (author) query.author = author;

    const memories = await Memory.find(query)
      .populate('author', 'name profilePicture batch')
      .sort({ memoryDate: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Memory.countDocuments(query);

    res.json({
      memories,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single memory
// @route   GET /api/memories/:id
// @access  Public (if public) or Private (if own)
const getMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id)
      .populate('author', 'name profilePicture batch')
      .populate('comments.user', 'name profilePicture');

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    // Check if user can view this memory
    if (!memory.isPublic && (!req.user || req.user._id.toString() !== memory.author._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(memory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's own memories (both public & private)
// @route   GET /api/memories/my/history
// @access  Private
const getMyMemories = async (req, res) => {
  try {
    const memories = await Memory.find({ author: req.user._id })
      .populate('author', 'name profilePicture batch')
      .sort({ memoryDate: -1, createdAt: -1 });

    res.json(memories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create memory
// @route   POST /api/memories
// @access  Private
const createMemory = async (req, res) => {
  try {
    const { title, content, photos, tags, category, isPublic, memoryDate } = req.body;

    const memory = await Memory.create({
      title,
      content,
      photos: photos || [],
      tags: tags || [],
      category: category || 'personal',
      isPublic: isPublic !== undefined ? isPublic : true,
      memoryDate: memoryDate || new Date(),
      author: req.user._id
    });

    await memory.populate('author', 'name profilePicture batch');

    res.status(201).json(memory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update memory
// @route   PUT /api/memories/:id
// @access  Private (author only)
const updateMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    if (memory.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedMemory = await Memory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name profilePicture batch');

    res.json(updatedMemory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete memory
// @route   DELETE /api/memories/:id
// @access  Private (author only)
const deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    if (memory.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete associated photos from Cloudinary
    if (memory.photos && memory.photos.length > 0) {
      for (const photoUrl of memory.photos) {
        // Extract public ID from Cloudinary URL
        const publicId = photoUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Memory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Like/Unlike memory
// @route   POST /api/memories/:id/like
// @access  Private
const likeMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    const userId = req.user._id;
    const isLiked = memory.likes.includes(userId);

    if (isLiked) {
      memory.likes = memory.likes.filter(id => id.toString() !== userId.toString());
    } else {
      memory.likes.push(userId);
    }

    await memory.save();
    res.json({ likes: memory.likes.length, isLiked: !isLiked });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add comment to memory
// @route   POST /api/memories/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    const comment = {
      user: req.user._id,
      content,
      createdAt: new Date()
    };

    memory.comments.push(comment);
    await memory.save();

    await memory.populate('comments.user', 'name profilePicture');

    res.status(201).json(memory.comments[memory.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getMemories,
  getMemory,
  getMyMemories,
  createMemory,
  updateMemory,
  deleteMemory,
  likeMemory,
  addComment
};