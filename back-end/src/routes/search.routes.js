// back-end/src/routes/search.routes.js
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

// Verifica se o controller foi importado corretamente
console.log('searchController:', Object.keys(searchController));

// Rotas - versão SIMPLES sem middlewares extras
router.get('/', searchController.search);
router.get('/genre', searchController.searchByGenre);

module.exports = router;