const router = require('express').Router();
const auth = require('../middleware/auth');
const allow = require('../middleware/role');
const ctrl = require('../controllers/intelligence.controller');

router.get('/anomalies', auth, allow('ceo', 'manager'), ctrl.anomalies);

module.exports = router;
