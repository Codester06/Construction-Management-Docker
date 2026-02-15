const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/construction';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URL)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Import Routes
const projectRoutes = require('./routes/projects');
const workerRoutes = require('./routes/workers');
const materialRoutes = require('./routes/materials');

// Use Routes
app.use('/api/projects', projectRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/materials', materialRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Construction Management API',
    version: '1.0.0',
    endpoints: {
      projects: '/api/projects',
      workers: '/api/workers',
      materials: '/api/materials',
      health: '/health'
    }
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
