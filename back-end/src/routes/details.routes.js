const express = require('express');
const router = express.Router();
const detailsController = require('../controllers/details.controller');
const { validateDetails, validateMediaDetails } = require('../middleware/validate.middleware');
const { filterParams, allowedParams } = require('../middleware/sanitize.middleware');

router.get('/:id', filterParams(allowedParams.details), validateDetails, detailsController.getDetails);
router.get('/:id/cast', filterParams(allowedParams.details), validateMediaDetails, detailsController.getCast);
router.get('/:id/videos', filterParams(allowedParams.details), validateMediaDetails, detailsController.getVideos);
router.get('/:id/providers', filterParams(allowedParams.details), validateMediaDetails, detailsController.getProviders);
router.get('/:id/similar', filterParams(allowedParams.details), validateMediaDetails, detailsController.getSimilar);

module.exports = router;