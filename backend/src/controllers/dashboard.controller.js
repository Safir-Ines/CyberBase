const store = require('../config/demoStore');

exports.overview = async (req, res) => {
  const orgId = req.user.organization;

  const assets = store.listAssets(orgId);
  const risks = store.listRisks(orgId);
  const employees = store.findUsersByOrg(orgId, 'employee');
  const scan = store.latestScan(orgId);
  // assessments not needed directly here

  const { baseline, scored } = store.scoreAllAssets(assets);
  const flagged = scored.filter(s => s.flagged).sort((a, b) => b.score - a.score);
  const topAnomalies = flagged.slice(0, 3).map(s => ({
    assetId: s.asset._id,
    name: s.asset.name,
    type: s.asset.type,
    score: s.score,
    reasons: s.reasons,
    breakdown: s.breakdown,
  }));

  const risksBySeverity = { critical: 0, high: 0, medium: 0, low: 0 };
  risks.forEach(r => { risksBySeverity[r.severity] = (risksBySeverity[r.severity] || 0) + 1; });

  const suspicious = employees.filter(e => e.isSuspicious);

  const totalAssets = assets.length || 1;
  const shadowItRatio = baseline.shadowItRatio;
  const flaggedRatio = flagged.length / totalAssets;
  const suspiciousRatio = employees.length ? suspicious.length / employees.length : 0;
  const criticalOpen = risks.filter(r => r.severity === 'critical' && r.status === 'open').length;

  let maturity = 100
    - Math.round(shadowItRatio * 30)
    - Math.round(flaggedRatio * 25)
    - Math.round(suspiciousRatio * 25)
    - Math.min(criticalOpen * 5, 20);
  maturity = Math.max(0, Math.min(100, maturity));

  const recommendations = [];
  if (shadowItRatio > 0.1) recommendations.push({ priority: 'high', title: 'Reduce Shadow IT', why: Math.round(shadowItRatio * 100) + '% of your assets are unregistered.', action: 'Run a network scan and register or remove rogue devices.' });
  if (flaggedRatio > 0.15) recommendations.push({ priority: 'high', title: 'Investigate AI-flagged anomalies', why: flagged.length + ' assets scored above the anomaly threshold.', action: 'Review the AI Insights panel and explain or remediate each flagged asset.' });
  if (suspicious.length > 0) recommendations.push({ priority: 'medium', title: 'Targeted security training', why: suspicious.length + ' employee(s) showed risky behavior in the awareness assessment.', action: 'Schedule a 30-minute phishing & password training for flagged employees.' });
  if (criticalOpen > 0) recommendations.push({ priority: 'critical', title: 'Resolve ' + criticalOpen + ' open critical risk(s)', why: 'Critical risks have the highest blast radius if exploited.', action: 'Open the Risk Matrix and assign an owner + deadline to each.' });
  if (recommendations.length === 0) recommendations.push({ priority: 'low', title: 'Posture looks healthy', why: 'No major signals detected.', action: 'Keep running monthly scans and quarterly assessments.' });

  res.json({
    maturity,
    counts: {
      assets: assets.length,
      registered: assets.filter(a => a.registered).length,
      shadowIt: assets.filter(a => !a.registered).length,
      employees: employees.length,
      suspicious: suspicious.length,
      risks: risks.length,
      anomalies: flagged.length,
    },
    risksBySeverity,
    topAnomalies,
    lastScan: scan ? { at: scan.createdAt, registeredCount: scan.registeredCount, detectedCount: scan.detectedCount, rogueCount: scan.rogueCount } : null,
    recommendations,
    transparency: {
      maturityFormula: '100 − shadowIT × 30 − anomaly_ratio × 25 − suspicious_ratio × 25 − critical_open × 5',
      anomalyThreshold: 60,
      assessmentSuspicionThreshold: 60,
    },
  });
};
