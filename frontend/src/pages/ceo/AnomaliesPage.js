import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { intelligenceAPI } from '../../utils/api';
import AnomalyBadge from '../../components/shared/AnomalyBadge';
import InfoBox from '../../components/shared/InfoBox';

export default function AnomaliesPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    intelligenceAPI.anomalies().then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.05)', borderTopColor: '#22c55e', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );
  if (!data) return null;

  const { anomalies, baseline, flaggedCount, threshold, explanation } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', 
          background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', 
          color: '#22c55e', fontSize: '11px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.12em' 
        }}>
          ✦ AI INSIGHTS
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '8px', letterSpacing: '-0.02em' }}>Asset Anomaly Detection</h1>
        <p style={{ color: 'rgba(148, 163, 184, 0.7)', fontSize: '15px', maxWidth: '700px', lineHeight: 1.6 }}>{explanation}</p>
      </header>

      {/* Baseline panel */}
      {baseline && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <InfoBox title="ORGANIZATION BASELINE" icon="◈" color="#a855f7">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginTop: '12px' }}>
              <Stat k="Total Assets" v={baseline.total} />
              <Stat k="Common Type" v={baseline.mostCommonType} />
              <Stat k="Criticality" v={baseline.mostCommonCriticality} />
              <Stat k="Shadow-IT Ratio" v={`${(baseline.shadowItRatio * 100).toFixed(0)}%`} color={baseline.shadowItRatio > 0.1 ? '#ef4444' : '#22c55e'} />
              <Stat k="Avg. Last-Seen" v={`${baseline.meanLastSeenDays} days ago`} />
            </div>
          </InfoBox>
        </motion.div>
      )}

      <div>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>
            {flaggedCount} Flagged <span style={{ color: 'rgba(148, 163, 184, 0.4)', fontWeight: 400, marginLeft: '8px' }}>· {anomalies.length} total scored</span>
          </h2>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(148, 163, 184, 0.6)', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            THRESHOLD: {threshold}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {anomalies.map((a, i) => (
            <motion.div 
              key={a.assetId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid rgba(255, 255, 255, 0.05)', 
                borderRadius: '16px', 
                padding: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {a.flagged && (
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#ef4444' }} />
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>{a.name}</h3>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'rgba(148,163,184,0.8)' }}>{a.type}</span>
                      <span style={{ 
                        fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', 
                        background: a.criticality === 'critical' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)', 
                        color: a.criticality === 'critical' ? '#ef4444' : 'rgba(148,163,184,0.8)' 
                      }}>
                        {a.criticality}
                      </span>
                      {!a.registered && <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: '#ef4444', color: '#fff' }}>SHADOW IT</span>}
                    </div>
                    <AnomalyBadge score={a.score} reasons={a.reasons} />
                  </div>
                  
                  <div style={{ fontSize: '12px', color: 'rgba(148, 163, 184, 0.5)', fontFamily: 'var(--font-mono)', marginBottom: '16px' }}>
                    OWNER: {a.owner}
                  </div>

                  {a.flagged && (
                    <div style={{ background: 'rgba(239,68,68,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.08)', marginBottom: '16px' }}>
                      <p style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Anomaly Vectors</p>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {a.reasons.map((r, idx) => (
                          <li key={idx} style={{ fontSize: '13px', color: 'rgba(148,163,184,0.9)', display: 'flex', gap: '10px' }}>
                            <span style={{ color: '#ef4444' }}>•</span> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Breakdown Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
                    {Object.entries(a.breakdown).map(([k, v]) => (
                      <div key={k} style={{ 
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', 
                        padding: '8px 12px', borderRadius: '8px'
                      }}>
                        <div style={{ fontSize: '10px', color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 600 }}>{k}</div>
                        <div style={{ 
                          fontSize: '13px', fontWeight: 700, 
                          color: v > 0.5 ? '#ef4444' : v > 0.25 ? '#f59e0b' : '#22c55e' 
                        }}>{v.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {anomalies.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>📡</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>No Scored Assets Found</h3>
              <p style={{ color: 'rgba(148, 163, 184, 0.6)' }}>Initialize a network scan or add assets manually to begin intelligence processing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ k, v, color }) {
  return (
    <div>
      <p style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'rgba(148, 163, 184, 0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{k}</p>
      <p style={{ fontSize: '18px', fontWeight: 800, color: color || '#fff' }}>{v ?? '—'}</p>
    </div>
  );
}
