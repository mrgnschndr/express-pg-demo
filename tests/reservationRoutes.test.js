const request = require('supertest');
const app = require('../index');
const pool = require('./jest.poolTest.js'); // Ensure same instance is used

describe('Reservation Routes', () => {
    it('should get all reservations', async () => {
        const response = await request(app).get('/reservations');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get reservations by host ID', async () => {
        const hostId = 1; // Replace with a valid host ID from your seed data
        const response = await request(app).get(`/reservations/host/${hostId}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
