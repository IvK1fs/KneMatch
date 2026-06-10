const express = require('express');
const router = express.Router();
const { getTrending } = require('../controllers/trending.controller');

const { validateTrending } = require('../middleware/validate.middleware');
const { filterParams, allowedParams } = require('../middleware/sanitize.middleware');

router.get('/', filterParams(allowedParams.trending), validateTrending, getTrending);

module.exports = router;