const express = require('express');
const router = express.Router();
const upcomingController = require('../controllers/upcoming.controller');

router.get('/', upcomingController.getUpcoming);

module.exports = router;