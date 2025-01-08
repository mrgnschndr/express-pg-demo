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

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving users.' });
    }
});

module.exports = router;