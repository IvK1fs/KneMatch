// routes/recommendations.routes.js
const express = require('express');
const router = express.Router();
const recommendationsController = require('../controllers/recommendations.controller');

router.get('/search/genre', recommendationsController.searchByGenre);
router.get('/genres', recommendationsController.getGenres);
router.get('/top', recommendationsController.getTop10);
router.get('/details/:id/cast', recommendationsController.getCast);
router.get('/details/:id/videos', recommendationsController.getVideos);
router.get('/details/:id/providers', recommendationsController.getProviders);
router.get('/details/:id/similar', recommendationsController.getSimilar);

module.exports = router;