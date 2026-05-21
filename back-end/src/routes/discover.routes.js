const express = require('express');
const router = express.Router();
const discoverController = require('../controllers/discover.controller');

router.get('/', discoverController.discover);

module.exports = router;
