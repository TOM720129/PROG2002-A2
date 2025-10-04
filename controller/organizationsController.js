const express = require('express');
const db = require('../event_db');

const router = express.Router();

// GET all organizations
router.get('/', async (req, res) => {
  try {
    // query all organizations from db
    const [rows] = await db.query('SELECT * FROM organizations');
    // response organizations with json format
    res.json(rows);
  } catch (err) {
    // response 500 status
    console.error('Error fetching organizations:', err);
    res.status(500).json({
      error: 'Failed to fetch organizations'
    });
  }
});

module.exports = router
