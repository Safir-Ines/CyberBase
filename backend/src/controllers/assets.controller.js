const store = require('../config/demoStore');

exports.list = async (req, res) => {
  const assets = store.listAssets(req.user.organization);
  const { scored } = store.scoreAllAssets(assets);
  const map = new Map(scored.map(s => [String(s.asset._id), s]));
  const out = assets.map(a => {
    const s = map.get(String(a._id));
    return { ...a, anomalyScore: s?.score ?? 0, flagged: s?.flagged ?? false, anomalyReasons: s?.reasons ?? [] };
  });
  res.json({ assets: out });
};

exports.create = async (req, res) => {
  const asset = store.createAsset({ ...req.body, organization: req.user.organization });
  res.status(201).json({ asset });
};

exports.update = async (req, res) => {
  const asset = store.updateAsset(req.params.id, req.user.organization, req.body);
  if (!asset) return res.status(404).json({ message: 'Asset not found' });
  res.json({ asset });
};

exports.remove = async (req, res) => {
  const asset = store.deleteAsset(req.params.id, req.user.organization);
  if (!asset) return res.status(404).json({ message: 'Asset not found' });
  res.json({ ok: true });
};
