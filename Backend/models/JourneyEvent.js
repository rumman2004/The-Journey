const mongoose = require('mongoose');

const journeyEventSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
    trim: true,
  },
  month: {
    type: String,
    required: true,
    trim: true,
  },
  index: {
    type: String, // String like '01', '02'
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  caption: {
    type: String,
    trim: true,
    maxlength: 200
  },
  imageUrl: {
    type: String,
    required: true // Can be Cloudinary URL
  },
  publicId: {
    type: String, // Cloudinary public ID for deletion
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, {
  timestamps: true
});

// Index for getting events sorted
// By year, month, index or by overall order if needed. Sorting them chronologically generally by year/index.
journeyEventSchema.index({ year: 1, index: 1 });

module.exports = mongoose.model('JourneyEvent', journeyEventSchema);
