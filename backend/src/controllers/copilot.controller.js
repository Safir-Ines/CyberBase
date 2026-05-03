const { askCopilot } = require('../services/aiKnowledge.service');

// POST /api/copilot/ask  body: { question }
exports.ask = (req, res) => {
  const { question } = req.body;
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ message: 'question (string) is required' });
  }
  const reply = askCopilot(question);
  res.json({ question, ...reply });
};
