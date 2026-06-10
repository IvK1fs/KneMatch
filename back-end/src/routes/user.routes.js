// back-end/src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');

// Importa tudo de uma vez
const userController = require('../controllers/user.controller');

// Verifica se o controller foi importado corretamente
console.log('userController:', Object.keys(userController));

// Aplica auth em todas as rotas
router.use(authMiddleware);

// Favoritos
router.get('/favorites', userController.getFavorites);
router.post('/favorites', userController.addFavorite);
router.delete('/favorites/:tmdbId', userController.removeFavorite);

// Listas
router.get('/lists', userController.getLists);
router.post('/lists', userController.createList);
router.delete('/lists/:listId', userController.deleteList);
router.post('/lists/:listId/items', userController.addToList);
router.delete('/lists/:listId/items/:tmdbId', userController.removeFromList);

// Recomendações
router.get('/recommendations', userController.getRecommendations);

module.exports = router;