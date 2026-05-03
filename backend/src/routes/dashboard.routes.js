const router = require('express').Router();
const auth = require('../middleware/auth');
const allow = require('../middleware/role');
const ctrl = require('../controllers/dashboard.controller');

// Employees never see the dashboard.
router.get('/overview', auth, allow('ceo', 'manager'), ctrl.overview);

module.exports = router;
