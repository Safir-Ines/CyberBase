const store = require('../config/demoStore');

exports.anomalies = async (req, res) => {
  const assets = store.listAssets(req.user.organization);
  if (assets.length === 0) return res.json({ baseline: null, anomalies: [], total: 0, flaggedCount: 0 });

  const { baseline, scored } = store.scoreAllAssets(assets);
  scored.sort((a, b) => b.score - a.score);

  const anomalies = scored.map(s => ({
    assetId: s.asset._id,
    name: s.asset.name,
    type: s.asset.type,
    criticality: s.asset.criticality,
    owner: s.asset.owner,
    registered: s.asset.registered,
    score: s.score,
    flagged: s.flagged,
    reasons: s.reasons,
    breakdown: s.breakdown,
  }));

  res.json({
    baseline: {
      total: baseline.total,
      mostCommonType: baseline.mostCommonType,
      mostCommonCriticality: baseline.mostCommonCriticality,
      mostCommonOwner: baseline.mostCommonOwner,
      shadowItRatio: +(baseline.shadowItRatio).toFixed(2),
      meanLastSeenDays: +(baseline.meanAge).toFixed(1),
    },
    anomalies,
    total: anomalies.length,
    flaggedCount: anomalies.filter(a => a.flagged).length,
    threshold: 60,
    explanation: 'Each asset is scored on 5 dimensions: type rarity, criticality shift, owner outlier, shadow-IT penalty, staleness. The weighted sum is normalized to 0-100. Scores above 60 are flagged.',
  });
};
