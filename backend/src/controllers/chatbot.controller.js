const { askChatbot } = require('../services/aiKnowledge.service');

// POST /api/chatbot/ask  body: { question }
exports.ask = (req, res) => {
  const { question } = req.body;
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ message: 'question (string) is required' });
  }
  const reply = askChatbot(question);
  res.json({ question, ...reply });
};
