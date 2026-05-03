import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { dashboardAPI } from '../../utils/api';
import InfoBox from '../../components/shared/InfoBox';

const SEV_COLORS = { 
  critical: '#ef4444', 
  high: '#f59e0b', 
  medium: '#eab308', 
  low: '#10b981' 
};

export default function RecommendationsPage() {
  const [recs, setRecs] = useState([]);
  const [transparency, setTransparency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.overview().then(r => {
      setRecs(r.data.recommendations || []);
      setTransparency(r.data.transparency);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.05)', borderTopColor: '#22c55e', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', 
          background: 'rgba(6, 182, 212, 0.1)', borderRadius: '8px', 
          color: '#06b6d4', fontSize: '11px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.12em' 
        }}>
          ✦ STRATEGIC GUIDANCE
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '8px', letterSpacing: '-0.02em' }}>Recommendations</h1>
        <p style={{ color: 'rgba(148, 163, 184, 0.7)', fontSize: '15px', maxWidth: '600px', lineHeight: 1.6 }}>
          Auto-generated intelligence derived from your current security posture. Each directive identifies critical vulnerabilities and prescribes remedial action.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {recs.map((r, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ 
              background: 'rgba(255, 255, 255, 0.02)', 
              border: '1px solid rgba(255, 255, 255, 0.05)', 
              borderRadius: '24px', 
              padding: '32px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Priority line */}
            <div style={{ 
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', 
              background: SEV_COLORS[r.priority] || '#06b6d4' 
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  background: `${SEV_COLORS[r.priority]}22`, 
                  color: SEV_COLORS[r.priority], 
                  fontSize: '10px', fontWeight: 800, 
                  padding: '4px 10px', borderRadius: '6px', 
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  border: `1px solid ${SEV_COLORS[r.priority]}33`
                }}>
                  {r.priority}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{r.title}</h3>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div>
                <p style={{ 
                  fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(168, 85, 247, 0.8)', 
                  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', fontWeight: 600 
                }}>
                  WHY
                </p>
                <p style={{ color: 'rgba(148, 163, 184, 0.8)', fontSize: '14px', lineHeight: 1.6 }}>{r.why}</p>
              </div>
              <div>
                <p style={{ 
                  fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(34, 197, 94, 0.8)', 
                  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', fontWeight: 600 
                }}>
                  ACTION
                </p>
                <p style={{ color: '#fff', fontSize: '14px', lineHeight: 1.6, fontWeight: 500 }}>{r.action}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {transparency && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: '12px' }}
        >
          <InfoBox title="INTELLIGENCE TRANSPARENCY" icon="ⓘ" color="#a855f7">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              <div>
                <p style={{ marginBottom: '12px' }}>Recommendations are automatically triggered when the system detects deviation from the following safety thresholds:</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#a855f7' }}>✦</span> <span>Shadow-IT ratio &gt; 10%</span>
                  </li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#a855f7' }}>✦</span> <span>AI-flagged anomaly ratio &gt; 15%</span>
                  </li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#a855f7' }}>✦</span> <span>Suspicious behavioral assessment detect</span>
                  </li>
                </ul>
              </div>
              <div style={{ padding: '20px', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '16px', border: '1px solid rgba(168, 85, 247, 0.1)' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>CURRENT SENSITIVITY</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Anomaly Threshold</span>
                  <span style={{ fontWeight: 700, color: '#fff' }}>&gt; {transparency.anomalyThreshold}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Behavioral Suspicion</span>
                  <span style={{ fontWeight: 700, color: '#fff' }}>≥ {transparency.assessmentSuspicionThreshold}</span>
                </div>
              </div>
            </div>
          </InfoBox>
        </motion.div>
      )}
    </div>
  );
}
