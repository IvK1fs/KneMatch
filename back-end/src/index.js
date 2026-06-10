// back-end/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importar rotas
const { requestLogger, errorLogger, notFoundHandler } = require('./middleware/logger.middleware');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const searchRoutes = require('./routes/search.routes');
const trendingRoutes = require('./routes/trending.routes');
const upcomingRoutes = require('./routes/upcoming.routes');
const detailsRoutes = require('./routes/details.routes');
const genresRoutes = require('./routes/genres.routes');
const discoverRoutes = require('./routes/discover.routes');
const recommendationsRoutes = require('./routes/recommendations.routes');
const topRoutes = require('./routes/top.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// ==================== CORS ====================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'https://cinematch-3m6l.onrender.com',
  'http://localhost:3000'
].filter(Boolean);

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

// ==================== LOGS ====================
// ✅ PRIMEIRO os logs (antes das rotas)
app.use(requestLogger);
app.use(morgan('dev'));

// ==================== JSON PARSER ====================
app.use(express.json());

// ==================== ROTAS PÚBLICAS ====================
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    message: 'CineMatch API funcionando!',
    status: 'online'
  });
});

// ==================== ROTAS DA API ====================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/trending', trendingRoutes);
app.use('/api/upcoming', upcomingRoutes);
app.use('/api/details', detailsRoutes);
app.use('/api/genres', genresRoutes);
app.use('/api/discover', discoverRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api', topRoutes);

// ==================== TRATAMENTO DE ERROS ====================
// ✅ 404 handler deve vir DEPOIS das rotas
app.use(notFoundHandler);

// ✅ Error logger deve ser o ÚLTIMO
app.use(errorLogger);

// ==================== SERVIDOR ====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔐 Auth endpoints: /api/auth`);
  console.log(`👤 User endpoints: /api/users`);
  console.log(`📝 Logger ativo`);
});