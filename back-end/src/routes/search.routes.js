// back-end/src/routes/search.routes.js
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');
const { validateSearch, validateSearchGenre } = require('../middleware/validate.middleware');

// Rotas com sanitização via middleware
router.get('/', validateSearch, searchController.search);
router.get('/genre', validateSearchGenre, searchController.searchByGenre);

module.exports = router;