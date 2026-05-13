require('dotenv').config();
const express = require('express');
const cors = require('cors');

const searchRoutes = require('./routes/search.routes');
const trendingRoutes = require('./routes/trending.routes');
const upcomingRoutes = require('./routes/upcoming.routes');
const detailsRoutes = require('./routes/details.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/search', searchRoutes);
app.use('/api/trending', trendingRoutes);
app.use('/api/upcoming', upcomingRoutes);
app.use('/api/details', detailsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Frontend allowed: ${process.env.FRONTEND_URL}`);
});