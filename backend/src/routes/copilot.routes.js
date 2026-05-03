const router = require('express').Router();
const auth = require('../middleware/auth');
const allow = require('../middleware/role');
const ctrl = require('../controllers/copilot.controller');

router.post('/ask', auth, allow('manager', 'ceo'), ctrl.ask);

module.exports = router;
