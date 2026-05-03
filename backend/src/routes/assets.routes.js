const router = require('express').Router();
const auth = require('../middleware/auth');
const allow = require('../middleware/role');
const ctrl = require('../controllers/assets.controller');

// Employees never see assets.
router.use(auth, allow('ceo', 'manager'));

router.get('/', ctrl.list);
router.post('/', allow('manager'), ctrl.create);
router.put('/:id', allow('manager'), ctrl.update);
router.delete('/:id', allow('manager'), ctrl.remove);

module.exports = router;
