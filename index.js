const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.APP_PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

app.use('/users', userRoutes);
app.use('/reservations', reservationRoutes);

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on ${process.env.APP_URL}:${port}`);
    });
}

module.exports = app; // Supertest interacts with this exported app
