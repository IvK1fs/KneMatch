const express = require('express');
const router = express.Router();
const { getUpcoming } = require('../controllers/upcoming.controller');
const { validateUpcoming } = require('../middleware/validate.middleware');
const { filterParams, allowedParams } = require('../middleware/sanitize.middleware');

router.get('/', filterParams(allowedParams.upcoming), validateUpcoming, getUpcoming);

module.exports = router;
