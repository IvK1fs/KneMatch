// back-end/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { signupUser, loginUser, logoutUser } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', authMiddleware, logoutUser);

module.exports = router;