// routes/top.routes.js
const express = require('express');
const router = express.Router();
const topController = require('../controllers/top.controller');

// Uma única rota com query param ?type=movie|tv
router.get('/top', topController.getTop);

module.exports = router;