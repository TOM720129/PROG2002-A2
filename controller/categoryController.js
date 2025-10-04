const express = require('express');
const db = require('../event_db');

const router = express.Router();

// GET all categories
router.get('/', async (req, res) => {
  try {
    // query all categories from db
    const [rows] = await db.query('SELECT * FROM categories');
    // response categories with json format
    res.json(rows);
  } catch (err) {
    // response 500 status
    console.error('Error fetching categories:', err);
    res.status(500).json({
      error: 'Failed to fetch categories'
    });
  }
});

module.exports = router
