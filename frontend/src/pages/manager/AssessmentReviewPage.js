import React, { useEffect, useState } from 'react';
import { assessmentsAPI } from '../../utils/api';
import InfoBox from '../../components/shared/InfoBox';

export default function AssessmentReviewPage() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assessmentsAPI.list().then(r => setResponses(r.data.responses)).finally(() => setLoading(false));
  }, []);

  const suspicious = responses.filter(r => r.isSuspicious);

  return (
    <div style={{ padding: 28, animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-cyan)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>HUMAN FACTOR</p>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Employee Assessment Review</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{responses.length} response(s) · {suspicious.length} flagged as suspicious based on red-flag answers.</p>
      </div>

      <InfoBox title="How risk score works" icon="ⓘ">
        Each survey answer has a risk weight. We sum the weights, normalize to 0–100, and flag the user as <strong>suspicious</strong> if score ≥ 60 OR if they hit ≥ 3 specific behavioral red flags (e.g. would click phishing links, reuses passwords, ignores updates).
      </InfoBox>

      {loading ? <p style={{ marginTop: 20 }}>Loading...</p> : (
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {responses.map(r => (
            <div key={r._id} className="card" style={{ padding: 14, borderLeft: r.isSuspicious ? '3px solid var(--accent-red)' : '3px solid var(--accent-green)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <strong>{r.user?.name || 'Unknown'}</strong>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{r.user?.email}</span>
                    {r.isSuspicious
                      ? <span className="badge badge-critical">🚩 SUSPICIOUS</span>
                      : <span className="badge badge-low">✓ HEALTHY</span>}
                  </div>
                  <p style={{ marginTop: 8, fontSize: 13 }}>
                    Risk Score: <strong style={{ color: r.riskScore >= 60 ? 'var(--accent-red)' : r.riskScore >= 30 ? 'var(--accent-orange)' : 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>{r.riskScore}/100</strong>
                  </p>
                  {r.redFlags && r.redFlags.length > 0 && (
                    <ul style={{ marginLeft: 18, marginTop: 6, color: 'var(--text-secondary)', fontSize: 13 }}>
                      {r.redFlags.map((f, i) => <li key={i}>⚠ {f}</li>)}
                    </ul>
                  )}
                  <p style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Submitted: {new Date(r.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
          {responses.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 30 }}>No employees have completed the assessment yet.</p>}
        </div>
      )}
    </div>
  );
}
