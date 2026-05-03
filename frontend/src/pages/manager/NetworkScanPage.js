import React, { useEffect, useState } from 'react';
import { networkAPI } from '../../utils/api';
import InfoBox from '../../components/shared/InfoBox';

const RISK_COLORS = { critical: 'var(--accent-red)', high: 'var(--accent-orange)', medium: 'var(--accent-yellow)', low: 'var(--accent-green)' };

export default function NetworkScanPage() {
  const [scan, setScan] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [filter, setFilter] = useState('all'); // all | rogue | registered

  useEffect(() => {
    networkAPI.latest().then(r => r.data.scan && setScan({
      summary: { registered: r.data.scan.registeredCount, detected: r.data.scan.detectedCount, rogue: r.data.scan.rogueCount, mismatchEquation: `Detected (${r.data.scan.detectedCount}) − Registered (${r.data.scan.registeredCount}) = ${r.data.scan.detectedCount - r.data.scan.registeredCount}` },
      devices: r.data.scan.devices,
      durationMs: r.data.scan.durationMs,
      alert: r.data.scan.rogueCount > 0 ? `Shadow IT Alert: ${r.data.scan.rogueCount} Rogue Device${r.data.scan.rogueCount > 1 ? 's' : ''} Detected. Review & Flag.` : 'No rogue devices detected.',
      previous: true,
    }));
  }, []);

  const runScan = async () => {
    setScanning(true);
    try {
      const r = await networkAPI.scan();
      setScan(r.data);
    } finally {
      setScanning(false);
    }
  };

  const devices = scan?.devices || [];
  const filtered = filter === 'all' ? devices : filter === 'rogue' ? devices.filter(d => d.isRogue) : devices.filter(d => !d.isRogue);

  return (
    <div style={{ padding: 28, animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-cyan)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>OPERATIONS</p>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Network Scan · Mismatch Matrix</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Compare what's <em>actually</em> on the network vs what's <em>registered</em> in the asset inventory.</p>
        </div>
        <button className="btn btn-primary" onClick={runScan} disabled={scanning} style={{ padding: '12px 20px' }}>
          {scanning ? '⟳ Scanning...' : '◎ Run Network Scan'}
        </button>
      </div>

      <InfoBox title="How this works" icon="ⓘ">
        We run Nmap-style discovery, then subtract: <code style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>Detected − Registered = Rogue</code>.
        Each rogue device with a critical port (RDP, Telnet, SMB) automatically opens a Risk in the matrix.
        <br/><br/>
        <strong>Note:</strong> This demo simulates the scan (real Nmap requires admin/root + LAN access). The math, the alerting, and the workflow are identical to a production deployment.
      </InfoBox>

      {scanning && (
        <div className="card" style={{ 
          marginTop: 24, 
          position: 'relative', 
          overflow: 'hidden', 
          height: 320,
          background: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--accent-glow)'
        }}>
          {/* Animated Grid */}
          <div style={{ 
            position: 'absolute', inset: 0, 
            backgroundImage: 'linear-gradient(rgba(34,197,94,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            animation: 'pulse 4s ease-in-out infinite'
          }}></div>
          
          {/* Radar Circles */}
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              position: 'absolute',
              width: i * 200,
              height: i * 200,
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '50%',
            }}></div>
          ))}

          {/* Scan Line */}
          <div style={{ 
            position: 'absolute', 
            top: '50%', left: '50%', 
            width: '150%', height: '150%',
            background: 'conic-gradient(from 0deg, rgba(34,197,94,0.4) 0deg, transparent 60deg)',
            transformOrigin: 'top left',
            animation: 'radar-rotate 4s linear infinite',
            zIndex: 1,
            pointerEvents: 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <div style={{
              width: 12, height: 12, background: 'var(--accent)', 
              borderRadius: '50%', margin: '0 auto 16px',
              boxShadow: 'var(--accent-glow)',
              animation: 'pulse 1s ease infinite'
            }}></div>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em' }}>SCANNING NETWORK...</p>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'rgba(34,197,94,0.6)', fontSize: 11, marginTop: 8 }}>TARGET: 192.168.1.0/24</p>
          </div>

          <style>{`
            @keyframes radar-rotate {
              from { transform: translate(-50%, -50%) rotate(0deg); }
              to { transform: translate(-50%, -50%) rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {scan && !scanning && (
        <>
          {/* Mismatch Equation */}
          <div className="card" style={{ marginTop: 20, textAlign: 'center', padding: 28, background: 'var(--bg-elevated)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{scan.previous ? 'LAST SCAN' : 'SCAN COMPLETE'} · {scan.durationMs}ms</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginTop: 12, fontWeight: 700 }}>
              <span style={{ color: 'var(--accent-cyan)' }}>{scan.summary.detected}</span> Detected
              <span style={{ color: 'var(--text-muted)', margin: '0 12px' }}>−</span>
              <span style={{ color: 'var(--accent-green)' }}>{scan.summary.registered}</span> Registered
              <span style={{ color: 'var(--text-muted)', margin: '0 12px' }}>=</span>
              <span style={{ color: scan.summary.rogue > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>{scan.summary.rogue}</span> Rogue
            </p>
          </div>

          {/* Alert */}
          {scan.summary.rogue > 0 && (
            <div className="card" style={{ marginTop: 14, borderColor: 'rgba(255,51,102,0.3)', borderLeft: '4px solid var(--accent-red)', background: 'rgba(255,51,102,0.05)', animation: 'pulse 2s ease infinite' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--accent-red)', fontWeight: 700 }}>⚠ {scan.alert}</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Critical-port rogues automatically created Risk entries. Review the Risk Matrix.</p>
            </div>
          )}

          {/* Filter */}
          <div style={{ display: 'flex', gap: 8, margin: '20px 0 12px', flexWrap: 'wrap' }}>
            {['all', 'rogue', 'registered'].map(k => (
              <button key={k} onClick={() => setFilter(k)} className={`btn ${filter === k ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: '6px 14px', fontSize: 12 }}>
                {k} ({k === 'all' ? devices.length : k === 'rogue' ? devices.filter(d => d.isRogue).length : devices.filter(d => !d.isRogue).length})
              </button>
            ))}
          </div>

          {/* Device list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((d, i) => (
              <div key={i} className="card" style={{ padding: 12, borderLeft: d.isRogue ? '3px solid var(--accent-red)' : '3px solid var(--accent-green)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{d.hostname || 'unknown'}</span>
                      {d.isRogue ? <span className="badge badge-critical">⚠ ROGUE</span> : <span className="badge badge-low">REGISTERED</span>}
                    </div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                      {d.ipAddress} · {d.macAddress} · {d.os}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {d.openPorts.map((p, j) => (
                      <span key={j} className="badge" style={{ background: 'var(--bg-elevated)', color: RISK_COLORS[p.risk], border: `1px solid ${RISK_COLORS[p.risk]}33`, fontSize: 10 }}>
                        :{p.port} {p.service.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 20 }}>No devices match this filter.</p>}
          </div>
        </>
      )}

      {!scan && !scanning && (
        <div className="card" style={{ marginTop: 20, textAlign: 'center', padding: 40 }}>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>No scans yet. Click "Run Network Scan" to start.</p>
        </div>
      )}
    </div>
  );
}
