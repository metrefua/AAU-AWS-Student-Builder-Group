const express = require('express');
const router = express.Router();
const { query } = require('express-validator');
const adminController = require('../controllers/adminController');
const Event = require('../models/Event');

// Public events route (no authentication required)
router.get('/public', [
  query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20')
], adminController.getPublicEvents);

// Temporary debug endpoint to see all events
router.get('/debug/all', async (req, res) => {
  try {
    const allEvents = await Event.find({}).populate('createdBy', 'fullName username');
    res.json({
      totalEvents: allEvents.length,
      events: allEvents.map(e => ({
        id: e._id,
        title: e.title,
        date: e.date,
        isActive: e.isActive,
        type: e.type,
        createdBy: e.createdBy
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 