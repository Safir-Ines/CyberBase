const router = require('express').Router();
const auth = require('../middleware/auth');
const allow = require('../middleware/role');
const ctrl = require('../controllers/assessments.controller');

router.use(auth);

router.get('/questions', ctrl.questions);                          // anyone authenticated
router.post('/', allow('employee'), ctrl.submit);                  // only employees submit
router.get('/me', allow('employee'), ctrl.myLatest);               // employee's own latest
router.get('/', allow('ceo', 'manager'), ctrl.list);               // manager + ceo review

module.exports = router;
