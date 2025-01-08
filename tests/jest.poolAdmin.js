// adminPool.js
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.test' }); // Ensure test environment is loaded

// Create and export the admin pool
const adminPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'postgres', // Use the default 'postgres' database for admin tasks
  password: process.env.DB_PASS,
  port: process.env.POOL_PORT,
});

module.exports = adminPool;
