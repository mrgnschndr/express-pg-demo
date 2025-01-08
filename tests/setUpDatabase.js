require('dotenv').config({ path: '.env.test' }); // Ensure test environment is loaded
const adminPool = require('./jest.poolAdmin.js'); // Reuse admin pool

module.exports = async () => {
  console.log('Global Setup: Creating test database.');

  const testDbName = process.env.DB_TEST_NAME;

  try {
    // Create the test database if it doesn't already exist
    await adminPool.query(`CREATE DATABASE ${testDbName}`);
    console.log(`Test database "${testDbName}" created.`);
  } catch (err) {
    if (err.code === '42P04') {
      console.log(`Test database "${testDbName}" already exists.`);
    } else {
      console.error('Error creating test database:', err);
      throw err;
    }
  }
};
