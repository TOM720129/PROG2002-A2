const express = require('express');
const db = require('../event_db');

const router = express.Router();

// GET all events
router.get('/', async (req, res) => {
  try {
    // query all event from db
    const [rows] = await db.query(
      `SELECT e.*, o.name AS organization_name, c.name AS category_name
       FROM events e
       JOIN organizations o ON e.org_id = o.id
       JOIN categories c ON e.category_id = c.id
       WHERE e.is_suspended = 0
       ORDER BY e.start_at ASC`
    );
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

// GET search events
router.get('/search-events', async (req, res) => {
  try {
    // get query parameters from request
    const { date, city, categoryId } = req.query;

    // create sql
    let sql = 'SELECT e.*, o.name AS organization_name, c.name AS category_name FROM events e JOIN organizations o ON e.org_id = o.id JOIN categories c ON e.category_id = c.id';
    const placeholderArr = [];

    // date should between start date and end date
    if (date) {
      sql += ' AND ? BETWEEN DATE(e.start_at) AND DATE(e.end_at)';
      placeholderArr.push(date);
    }

    // fuzzy query city keywords
    if (city) {
      sql += ' AND e.city LIKE ?';
      placeholderArr.push(`%${city}%`);
    }

    if (categoryId) {
      sql += ' AND e.category_id = ?';
      placeholderArr.push(categoryId);
    }

    // order by start date
    sql += ' ORDER BY e.start_at ASC';

    // query event by search condition
    const [rows] = await db.query(sql, placeholderArr);

    // response events with json format
    res.json(rows);
  } catch (err) {
    // response 500 status
    console.error('Error searching events:', err);
    res.status(500).json({
      error: 'Failed to search events'
    });
  }
});

router.get('/events/:id', async (req, res) => {
  try {
    // create sql
    const [rows] = await db.query(
      `SELECT e.*, o.name AS organization_name, c.name AS category_name
       FROM events e
       JOIN organizations o ON e.org_id = o.id
       JOIN categories c ON e.category_id = c.id
       WHERE e.id = ?`,
      [req.params.id] // get id in request path parameters
    );

    // response 404 when event not found
    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Event not found'
      });
    }

    // response event with json format
    res.json(rows[0]);
  } catch (err) {
    // response 500 status
    console.error(err);
    res.status(500).json({
      error: 'Failed to fetch event details'
    });
  }
});

module.exports = router
