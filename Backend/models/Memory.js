const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  photos: [{
    type: String, // Cloudinary URLs
  }],
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['event', 'achievement', 'personal', 'group', 'other'],
    default: 'personal'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  memoryDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
memorySchema.index({ author: 1, createdAt: -1 });
memorySchema.index({ isPublic: 1, createdAt: -1 });
memorySchema.index({ memoryDate: -1 });

module.exports = mongoose.model('Memory', memorySchema);