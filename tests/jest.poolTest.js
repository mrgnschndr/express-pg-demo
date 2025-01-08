const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_TEST_NAME,
  password: process.env.DB_PASS,
  port: process.env.POOL_PORT,
});

// Helper to clean up connections
async function closePool() {
  console.log('Closing database connection pool...');
  await pool.end();
}

module.exports = { pool, closePool };
