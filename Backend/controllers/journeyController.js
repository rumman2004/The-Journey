const JourneyEvent = require('../models/JourneyEvent');
const cloudinary = require('../config/cloudinary');

// @desc    Get all journey events
// @route   GET /api/journeys
// @access  Public
const getJourneyEvents = async (req, res) => {
  try {
    const events = await JourneyEvent.find()
      .populate('uploadedBy', 'name profilePicture')
      .sort({ year: 1, index: 1 })
      .exec();

    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new journey event
// @route   POST /api/journeys
// @access  Private
const createJourneyEvent = async (req, res) => {
  try {
    const { year, month, index, title, description, caption, imageUrl } = req.body;
    let finalImageUrl = imageUrl;
    let publicId = null;

    // Support direct upload via files just like photos if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.buffer, {
        folder: 'college-journeys',
        resource_type: 'image'
      });
      finalImageUrl = result.secure_url;
      publicId = result.public_id;
    } else if (!finalImageUrl) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const event = await JourneyEvent.create({
      year,
      month,
      index,
      title,
      description,
      caption,
      imageUrl: finalImageUrl,
      publicId: publicId,
      uploadedBy: req.user._id
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a journey event
// @route   PUT /api/journeys/:id
// @access  Private
const updateJourneyEvent = async (req, res) => {
  try {
    const event = await JourneyEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedEvent = await JourneyEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a journey event
// @route   DELETE /api/journeys/:id
// @access  Private
const deleteJourneyEvent = async (req, res) => {
  try {
    const event = await JourneyEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (event.publicId) {
      await cloudinary.uploader.destroy(event.publicId);
    }

    await JourneyEvent.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getJourneyEvents,
  createJourneyEvent,
  updateJourneyEvent,
  deleteJourneyEvent
};
