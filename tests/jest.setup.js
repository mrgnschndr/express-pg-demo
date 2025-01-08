const { faker } = require('@faker-js/faker');
require('dotenv').config({ path: '.env.test' });
const { pool, closePool } = require('./jest.poolTest.js');


beforeAll(() => {
    console.log('Database connection initializing...');
});

afterAll(async () => {
    console.log('Closing database connection pool...');
    await closePool();
});

beforeEach(async () => {
  try {
    console.log('Setting up test tables and seeding data...');

    await pool.query(`
      DROP TABLE IF EXISTS reservations, properties, hosts, users CASCADE;

      CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL
      );

      CREATE TABLE hosts (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL
      );

      CREATE TABLE properties (
          id SERIAL PRIMARY KEY,
          host_id INT REFERENCES hosts(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL
      );

      CREATE TABLE reservations (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          property_id INT REFERENCES properties(id) ON DELETE CASCADE,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL
      );
    `);

    for (let i = 0; i < 10; i++) {
      const userName = faker.person.fullName();
      const userEmail = faker.internet.email();

      await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [userName, userEmail]);

      const hostName = faker.person.fullName();
      const hostEmail = faker.internet.email();

      const hostResult = await pool.query(
        'INSERT INTO hosts (name, email) VALUES ($1, $2) RETURNING id',
        [hostName, hostEmail]
      );
      const hostId = hostResult.rows[0].id;

      await pool.query(
        'INSERT INTO properties (host_id, name, location) VALUES ($1, $2, $3)',
        [hostId, faker.location.city(), faker.location.city()]
      );
    }

    console.log('Tables created and seeded successfully.');
  } catch (err) {
    console.error('Error during test table setup:', err);
    throw err;
  }
});

afterEach(async () => {
  try {
    await pool.query('TRUNCATE TABLE users, hosts, properties, reservations RESTART IDENTITY CASCADE');
  } catch (err) {
    console.error('Error during test table cleanup:', err);
    throw err;
  }
});

module.exports = pool;
