const store = require('../config/demoStore');
const { getQuestions, scoreResponse } = require('../services/riskScoring.service');

exports.questions = (req, res) => {
  res.json({ questions: getQuestions() });
};

exports.submit = async (req, res) => {
  if (req.user.role !== 'employee') return res.status(403).json({ message: 'Only employees take the assessment.' });
  const { answers } = req.body;
  if (!answers || typeof answers !== 'object') return res.status(400).json({ message: 'answers object is required' });

  const { riskScore, isSuspicious, redFlags } = scoreResponse(answers);
  const response = store.createAssessment({
    organization: req.user.organization,
    user: req.user._id,
    answers,
    riskScore,
    isSuspicious,
    redFlags,
  });
  store.updateUser(req.user._id, { lastRiskScore: riskScore, isSuspicious });

  res.status(201).json({ response, riskScore, isSuspicious, redFlags });
};

exports.list = async (req, res) => {
  if (req.user.role === 'employee') {
    const own = store.listAssessments(req.user.organization, req.user._id);
    return res.json({ responses: own });
  }
  const responses = store.listAssessments(req.user.organization);
  res.json({ responses });
};

exports.myLatest = async (req, res) => {
  const latest = store.latestAssessment(req.user.organization, req.user._id);
  res.json({ response: latest });
};
