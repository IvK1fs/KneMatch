// routes/top.routes.js
const express = require('express');
const router = express.Router();
const topController = require('../controllers/top.controller');

// Rotas do Top 10
router.get('/top/movie', topController.getTopMovies);
router.get('/top/tv', topController.getTopTv);

module.exports = router;