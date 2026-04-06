const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  caption: {
    type: String,
    trim: true,
    maxlength: 150
  },
  imageUrl: {
    type: String,
    required: true // Cloudinary URL
  },
  publicId: {
    type: String,
    required: true // Cloudinary public ID for deletion
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  album: {
    type: String,
    default: 'general'
  },
  semester: {
    type: String,
    enum: ['1st sem', '2nd sem', '3rd sem', '4th sem', '5th sem', '6th sem', 'General'],
    default: 'General'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  memory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Memory'
  }
}, {
  timestamps: true
});

// Index for faster queries
photoSchema.index({ uploadedBy: 1, createdAt: -1 });
photoSchema.index({ isPublic: 1, createdAt: -1 });
photoSchema.index({ album: 1 });
photoSchema.index({ semester: 1 });

module.exports = mongoose.model('Photo', photoSchema);