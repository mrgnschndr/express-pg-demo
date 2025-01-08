const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const router = express.Router();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.NODE_ENV === 'test' ? process.env.DB_TEST_NAME : process.env.DB_NAME,
    password: process.env.NODE_ENV === 'test' ? process.env.DB_TEST_PASS : process.env.DB_PASS,
    port: process.env.POOL_PORT,
});

// Get all reservations
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM reservations');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving reservations.' });
    }
});

// Get reservations by host ID
//NOTE:::: This uses a JOIN operation in SQL. Look up documentation!

router.get('/host/:hostId', async (req, res) => {
    const { hostId } = req.params;

    try {
        const result = await pool.query(
            `SELECT r.* FROM reservations r
            JOIN properties p ON r.property_id = p.id
            WHERE p.host_id = $1`,
            [hostId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving reservations for the host.' });
    }
});

module.exports = router;