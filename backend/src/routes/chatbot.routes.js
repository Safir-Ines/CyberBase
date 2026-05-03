const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/chatbot.controller');

// Any authenticated user (employees primarily) can ask the chatbot
router.post('/ask', auth, ctrl.ask);

module.exports = router;
