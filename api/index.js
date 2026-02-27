const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server/.env (for local) or Vercel env vars
dotenv.config({ path: path.join(__dirname, '..', 'server', '.env') });

// --- Cached MongoDB connection for serverless ---
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        throw error;
    }
};

// --- Express App ---
const app = express();

app.use(cors());
app.use(express.json());

// Connect to DB on every request (uses cached connection)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ message: 'Database connection failed' });
    }
});

// --- Routes (imported from server/) ---
app.use('/api/auth', require('../server/routes/authRoutes'));
app.use('/api/leads', require('../server/routes/leadRoutes'));
app.use('/api/tasks', require('../server/routes/taskRoutes'));
app.use('/api/users', require('../server/routes/userRoutes'));
app.use('/api/chat', require('../server/routes/chatRoutes'));
app.use('/api/announcements', require('../server/routes/announcementRoutes'));

app.get('/api', (req, res) => {
    res.json({ message: 'CRM API is running on Vercel!' });
});

module.exports = app;
