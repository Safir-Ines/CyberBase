const router = require('express').Router();
const auth = require('../middleware/auth');
const allow = require('../middleware/role');
const ctrl = require('../controllers/network.controller');

// Manager triggers; CEO can also see results
router.post('/scan', auth, allow('manager'), ctrl.scan);
router.get('/scan/latest', auth, allow('ceo', 'manager'), ctrl.latest);

module.exports = router;
