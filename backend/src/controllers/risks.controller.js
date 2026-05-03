const store = require('../config/demoStore');

exports.list = async (req, res) => {
  const risks = store.listRisks(req.user.organization);
  res.json({ risks });
};

exports.create = async (req, res) => {
  const risk = store.createRisk({ ...req.body, organization: req.user.organization, createdBy: req.user._id });
  res.status(201).json({ risk });
};

exports.update = async (req, res) => {
  const risk = store.updateRisk(req.params.id, req.user.organization, req.body);
  if (!risk) return res.status(404).json({ message: 'Risk not found' });
  res.json({ risk });
};

exports.remove = async (req, res) => {
  const risk = store.deleteRisk(req.params.id, req.user.organization);
  if (!risk) return res.status(404).json({ message: 'Risk not found' });
  res.json({ ok: true });
};
