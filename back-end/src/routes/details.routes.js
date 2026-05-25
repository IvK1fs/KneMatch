// routes/details.routes.js
const express = require('express');
const router = express.Router();
const detailsController = require('../controllers/details.controller');

router.get('/:id', detailsController.getDetails);
router.get('/:id/cast', detailsController.getCast);
router.get('/:id/videos', detailsController.getVideos);
router.get('/:id/providers', detailsController.getProviders);
router.get('/:id/similar', detailsController.getSimilar);

module.exports = router;