// back-end/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar rotas
const { requestLogger } = require('./middleware/logger.middleware');
const { errorLogger, notFoundHandler } = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const searchRoutes = require('./routes/search.routes');
const trendingRoutes = require('./routes/trending.routes');
const upcomingRoutes = require('./routes/upcoming.routes');
const detailsRoutes = require('./routes/details.routes');
const genresRoutes = require('./routes/genres.routes');
const discoverRoutes = require('./routes/discover.routes');
const recommendationsRoutes = require('./routes/recommendations.routes');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'https://cinematch-3m6l.onrender.com',
  'http://localhost:3000'
].filter(Boolean);

// CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    message: 'CineMatch API funcionando!',
    status: 'online'
  });
});

// ==================== ROTAS ====================


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/trending', trendingRoutes);
app.use('/api/upcoming', upcomingRoutes);
app.use('/api/details', detailsRoutes);
app.use('/api/genres', genresRoutes);
app.use('/api/discover', discoverRoutes);
app.use('/api/recommendations', recommendationsRoutes);


// Middleware para rotas não encontradas (404)
app.use(notFoundHandler);

// Middleware global de erro (sempre por último)
app.use(errorLogger);

// ==================== SERVIDOR ====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔐 Auth endpoints: /api/auth`);
  console.log(`👤 User endpoints: /api/users`);
});