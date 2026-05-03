const store = require('../config/demoStore');

// GET /api/game/progress
exports.getProgress = async (req, res) => {
  try {
    const progress = store.getGameProgress(req.user.organization, req.user._id);
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/game/progress
exports.updateProgress = async (req, res) => {
  try {
    const { points, level, badges, completedScenarios } = req.body;
    const progress = store.saveGameProgress(req.user.organization, req.user._id, {
      points,
      level,
      badges,
      completedScenarios
    });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
