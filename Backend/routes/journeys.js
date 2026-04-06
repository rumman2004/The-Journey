const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
  getJourneyEvents,
  createJourneyEvent,
  updateJourneyEvent,
  deleteJourneyEvent
} = require('../controllers/journeyController');
const auth = require('../middleware/auth');

// Setup multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.route('/')
  .get(getJourneyEvents)
  .post(auth, upload.single('image'), createJourneyEvent);

router.route('/:id')
  .put(auth, updateJourneyEvent)
  .delete(auth, deleteJourneyEvent);

module.exports = router;
