const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');
const auth = require('../middleware/auth');

router.get('/progress', auth, gameController.getProgress);
router.post('/progress', auth, gameController.updateProgress);

module.exports = router;
