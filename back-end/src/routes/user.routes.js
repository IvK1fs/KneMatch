// back-end/src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const {
    getFavorites,
    addFavorite,
    removeFavorite,
    getLists,
    createList,
    deleteList,
    addToList,
    removeFromList,
    getRecommendations
} = require('../controllers/user.controller');

router.use(authMiddleware);

// Favoritos
router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.delete('/favorites/:tmdbId', removeFavorite);

//Requer usuário logado — retorna até 12 títulos baseados nos gêneros dos favoritos
router.get('/recommendations', getRecommendations);

// Listas
router.get('/lists', getLists);
router.post('/lists', createList);
router.delete('/lists/:listId', deleteList);
router.post('/lists/:listId/items', addToList);
router.delete('/lists/:listId/items/:tmdbId', removeFromList);

module.exports = router;