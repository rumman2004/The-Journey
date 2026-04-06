const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Import custom middleware
const corsConfig = require('./middleware/cors');
const { apiLimiter, authLimiter } = require('./middleware/rateLimit');

// Middleware
app.use(corsConfig);
app.use(express.json({ limit: '80mb' })); // Increased limit for video/photo uploads
app.use(express.urlencoded({ limit: '80mb', extended: true }));

// Rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/memories', require('./routes/memories'));
app.use('/api/photos', require('./routes/photos'));
app.use('/api/users', require('./routes/users'));
app.use('/api/journeys', require('./routes/journeys'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'College Memories API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});