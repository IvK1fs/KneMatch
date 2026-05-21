const express = require('express');
const router = express.Router();
const genresController = require('../controllers/genres.controller');

router.get('/', genresController.getGenres);

module.exports = router;
