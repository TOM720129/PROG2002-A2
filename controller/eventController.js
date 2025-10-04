const express = require('express');
const db = require('../event_db');

const router = express.Router();

// GET all events
router.get('/', async (req, res) => {
  try {
    // query all event from db
    const [rows] = await db.query('SELECT * FROM events');
    // response events with json format
    res.json(rows);
  } catch (err) {
    // response 500 status
    console.error('Error fetching events:', err);
    res.status(500).json({
      error: 'Failed to fetch events'
    });
  }
});

module.exports = router
