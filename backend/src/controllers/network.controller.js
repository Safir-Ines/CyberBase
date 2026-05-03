const store = require('../config/demoStore');
const { simulateScan } = require('../services/networkScan.service');

exports.scan = async (req, res) => {
  const orgId = req.user.organization;
  const registered = store.listAssets(orgId).filter(a => a.registered);
  const result = simulateScan(registered);

  const scan = store.createScan({
    organization: orgId,
    triggeredBy: req.user._id,
    registeredCount: result.registeredCount,
    detectedCount: result.detectedCount,
    rogueCount: result.rogueCount,
    devices: result.devices,
    durationMs: result.durationMs,
  });

  // Auto-create risks for critical rogue devices
  const criticalRogues = result.devices.filter(d => d.isRogue && d.openPorts.some(p => p.risk === 'critical'));
  for (const d of criticalRogues) {
    store.createRisk({
      organization: orgId,
      title: 'Rogue device detected at ' + d.ipAddress,
      description: 'Unregistered device "' + d.hostname + '" exposes ' + d.openPorts.filter(p => p.risk === 'critical').map(p => 'port ' + p.port + ' (' + p.service + ')').join(', ') + '.',
      severity: 'critical',
      likelihood: 4,
      impact: 5,
      status: 'open',
      source: 'network_scan',
      createdBy: req.user._id,
    });
  }

  res.json({
    scanId: scan._id,
    summary: {
      registered: result.registeredCount,
      detected: result.detectedCount,
      rogue: result.rogueCount,
      mismatchEquation: 'Detected (' + result.detectedCount + ') − Registered (' + result.registeredCount + ') = ' + (result.detectedCount - result.registeredCount),
    },
    devices: result.devices,
    durationMs: result.durationMs,
    alert: result.rogueCount > 0
      ? 'Shadow IT Alert: ' + result.rogueCount + ' Rogue Device' + (result.rogueCount > 1 ? 's' : '') + ' Detected. Review & Flag.'
      : 'No rogue devices detected.',
  });
};

exports.latest = async (req, res) => {
  const scan = store.latestScan(req.user.organization);
  if (!scan) return res.json({ scan: null });
  res.json({ scan });
};
