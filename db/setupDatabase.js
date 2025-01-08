const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres', // Connect to default database to create a new one
    password: process.env.DB_PASS,
    port: process.env.POOL_PORT,
});

const setupDatabase = async () => {
    try {
        // Drop the database if it exists
        await pool.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
        console.log(`Database ${process.env.DB_NAME} dropped successfully.`);

        // Create the database
        await pool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
        console.log(`Database ${process.env.DB_NAME} created successfully.`);

        // Connect to the new database
        pool.end();

        const newPool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.NODE_ENV === 'test' ? process.env.DB_TEST_NAME : process.env.DB_NAME,
            password: process.env.DB_PASS,
            port: process.env.POOL_PORT,
        });


        // Drop and recreate tables
        await newPool.query(`
            DROP TABLE IF EXISTS reservations;
            DROP TABLE IF EXISTS properties;
            DROP TABLE IF EXISTS hosts;
            DROP TABLE IF EXISTS users;

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

        // Validate table creation
        const tables = ['users', 'hosts', 'properties', 'reservations'];
        for (const table of tables) {
            const result = await newPool.query(`SELECT to_regclass('public.${table}')`);
            if (result.rows[0].to_regclass) {
                console.log(`${table} table exists.`);
            } else {
                console.log(`${table} table creation failed.`);
            }
        }

        newPool.end();
    } catch (err) {
        console.error('Error setting up the database:', err);
    }
};

setupDatabase();