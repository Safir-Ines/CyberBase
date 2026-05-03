/**
 * anomalyDetection.service.js
 *
 * Isolation-Forest-adjacent scoring for assets. NOT a true Isolation Forest,
 * but the same intuition: score how "isolated" an asset is across multiple
 * dimensions vs the organization baseline. Output: 0-100, with explanation.
 *
 * Pipeline:
 *   1. Compute org baseline (most-common type / criticality / owner; shadow-IT ratio; age stats)
 *   2. For each asset, compute deviation across 5 dimensions
 *   3. Combine into single 0-100 anomaly score (weighted sum)
 *   4. Generate human-readable list of reasons it was flagged
 */

// ---- helpers ----
const counts = (arr) => arr.reduce((m, v) => (m[v] = (m[v] || 0) + 1, m), {});
const mostCommon = (arr) => {
  const c = counts(arr);
  return Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
};

function computeBaseline(assets) {
  const total = Math.max(assets.length, 1);
  const types = assets.map(a => a.type);
  const criticalities = assets.map(a => a.criticality);
  const owners = assets.map(a => a.owner || 'unknown');

  const typeCounts = counts(types);
  const critCounts = counts(criticalities);
  const ownerCounts = counts(owners);

  const shadowItRatio = assets.filter(a => a.registered === false).length / total;

  const lastSeenAges = assets.map(a => {
    const t = a.lastSeen ? new Date(a.lastSeen).getTime() : Date.now();
    return (Date.now() - t) / (1000 * 60 * 60 * 24); // days
  });
  const meanAge = lastSeenAges.reduce((s, x) => s + x, 0) / total;
  const variance = lastSeenAges.reduce((s, x) => s + (x - meanAge) ** 2, 0) / total;
  const stdAge = Math.sqrt(variance) || 1;

  return {
    total,
    typeCounts,
    critCounts,
    ownerCounts,
    mostCommonType: mostCommon(types),
    mostCommonCriticality: mostCommon(criticalities),
    mostCommonOwner: mostCommon(owners),
    shadowItRatio,
    meanAge,
    stdAge,
  };
}

/**
 * Score one asset 0-100. Returns { score, reasons[] }.
 *
 * Dimensions (each 0-1, then weighted):
 *  d1 typeRarity        (weight 18)  — how rare is this asset type in the org
 *  d2 criticalityShift  (weight 22)  — is criticality unusual for this type
 *  d3 ownerOutlier      (weight 14)  — does owner deviate from org pattern
 *  d4 shadowItPenalty   (weight 28)  — unregistered asset = strong signal
 *  d5 staleness         (weight 18)  — last-seen far from org mean (z-score capped)
 */
function scoreAsset(asset, baseline) {
  const reasons = [];

  // d1: type rarity (Laplace smoothed)
  const typeFreq = (baseline.typeCounts[asset.type] || 0 + 1) / (baseline.total + 1);
  const d1 = 1 - typeFreq;
  if (typeFreq < 0.1 && baseline.total > 5) {
    reasons.push(`Asset type "${asset.type}" is uncommon in this organization (only ${(typeFreq * 100).toFixed(0)}% of assets).`);
  }

  // d2: criticality shift (high criticality on a "small" type, or vice-versa)
  const isMajorType = ['server','database','firewall','router'].includes(asset.type);
  let d2 = 0;
  if (asset.criticality === 'critical' && !isMajorType) {
    d2 = 0.9;
    reasons.push(`Critical criticality on a non-core asset type ("${asset.type}") — unusual pairing.`);
  } else if (asset.criticality === 'low' && isMajorType) {
    d2 = 0.7;
    reasons.push(`Low criticality on a core infrastructure asset ("${asset.type}") — likely mis-classified.`);
  }

  // d3: owner outlier
  const ownerFreq = (baseline.ownerCounts[asset.owner || 'unknown'] || 0) / baseline.total;
  let d3 = 1 - ownerFreq;
  if (ownerFreq < 0.05 && baseline.total > 10) {
    reasons.push(`Owner "${asset.owner}" rarely owns assets here (${(ownerFreq * 100).toFixed(0)}%).`);
  }

  // d4: shadow IT penalty
  let d4 = 0;
  if (asset.registered === false) {
    d4 = 1.0;
    reasons.push(`Unregistered asset (Shadow IT) — not in approved inventory.`);
  }

  // d5: staleness (z-score, capped at 3)
  const ageDays = (Date.now() - new Date(asset.lastSeen || Date.now()).getTime()) / (1000 * 60 * 60 * 24);
  const z = Math.min(Math.abs(ageDays - baseline.meanAge) / (baseline.stdAge || 1), 3);
  const d5 = z / 3;
  if (z > 2) {
    reasons.push(`Last seen ${ageDays.toFixed(0)}d ago — far from org average of ${baseline.meanAge.toFixed(0)}d (${z.toFixed(1)}σ).`);
  }

  // Weighted combination
  const w = { d1: 18, d2: 22, d3: 14, d4: 28, d5: 18 };
  const raw = d1 * w.d1 + d2 * w.d2 + d3 * w.d3 + d4 * w.d4 + d5 * w.d5;
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  if (reasons.length === 0) reasons.push('No significant deviation from organization baseline.');

  return {
    score,
    flagged: score > 60,
    reasons,
    breakdown: {
      typeRarity: +(d1).toFixed(2),
      criticalityShift: +(d2).toFixed(2),
      ownerOutlier: +(d3).toFixed(2),
      shadowItPenalty: +(d4).toFixed(2),
      staleness: +(d5).toFixed(2),
    },
  };
}

function scoreAllAssets(assets) {
  const baseline = computeBaseline(assets);
  const scored = assets.map(a => ({
    asset: a,
    ...scoreAsset(a, baseline),
  }));
  return { baseline, scored };
}

module.exports = { computeBaseline, scoreAsset, scoreAllAssets };
