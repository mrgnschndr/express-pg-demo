const { Pool } = require('pg');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.POOL_PORT,
});


const seedDatabase = async () => {
    try {
        // Seed users
        const userIds = [];
        for (let i = 0; i < 100; i++) {
            const name = faker.person.fullName();
            const email = faker.internet.email();

            const result = await pool.query(
                'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id',
                [name, email]
            );
            userIds.push(result.rows[0].id);
        }

        // Seed hosts and properties
        const propertyIds = [];
        for (let i = 0; i < 50; i++) {
            const hostName = faker.person.fullName();
            const hostEmail = faker.internet.email();

            const hostResult = await pool.query(
                'INSERT INTO hosts (name, email) VALUES ($1, $2) RETURNING id',
                [hostName, hostEmail]
            );

            const hostId = hostResult.rows[0].id;
            for (let j = 0; j < faker.number.int({ min: 1, max: 5 }); j++) {
                const propertyName = faker.company.name();
                const propertyLocation = faker.location.city();

                const propertyResult = await pool.query(
                    'INSERT INTO properties (host_id, name, location) VALUES ($1, $2, $3) RETURNING id',
                    [hostId, propertyName, propertyLocation]
                );
                propertyIds.push(propertyResult.rows[0].id);
            }
        }

        // Seed reservations
        for (const userId of userIds) {
            const numReservations = faker.number.int({ min: 0, max: 5 });
            for (let k = 0; k < numReservations; k++) {
                const propertyId = propertyIds[faker.number.int({ min: 0, max: propertyIds.length - 1 })];
                const startDate = faker.date.future();
                const endDate = faker.date.future({ refDate: startDate });

                await pool.query(
                    'INSERT INTO reservations (user_id, property_id, start_date, end_date) VALUES ($1, $2, $3, $4)',
                    [userId, propertyId, startDate, endDate]
                );
            }
        }

        // Validate seeding
        const tables = ['users', 'hosts', 'properties', 'reservations'];
        for (const table of tables) {
            const result = await pool.query(`SELECT COUNT(*) FROM ${table}`);
            console.log(`Total records in ${table}: ${result.rows[0].count}`);
        }

        console.log('Database seeded successfully.');

        pool.end();
    } catch (err) {
        console.error('Error seeding the database:', err);
    }
};

seedDatabase();