import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { dashboardAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

const radarData = [
  { subject: 'Inventory', A: 80, fullMark: 100 },
  { subject: 'Patching', A: 65, fullMark: 100 },
  { subject: 'Access Ctrl', A: 90, fullMark: 100 },
  { subject: 'Email/Web', A: 70, fullMark: 100 },
  { subject: 'Backups', A: 85, fullMark: 100 },
];

const telemetryLogs = [
  { time: '10:31', text: 'Auto-scan complete · 46 devices detected · 3 unregistered (shadow IT delta)', type: 'info' },
  { time: '10:28', text: 'Port 3389 (RDP) open on unregistered IP 10.0.8.22 · Probable ransomware ingress', type: 'ai', critical: true },
  { time: '10:14', text: 'F. Omar (Sales) authenticated from IP 41.107.xx.xx — not in approved device list', type: 'warning' },
  { time: '09:30', text: 'MFA bypass attempt blocked · account: k.admin@acmecorp.dz', type: 'critical' },
  { time: '09:02', text: 'Patch compliance 67% - CVE-2024-21412 unpatched on Finance subnet', type: 'ai' },
  { time: '08:15', text: 'Nightly backup completed · 0 errors · 2.4 GB archived to secure storage', type: 'success' },
  { time: '07:45', text: 'Hygiene Pulse scheduled — June 1, 09:00 — 43 employees enrolled', type: 'info' },
];

export default function CeoDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.overview().then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.05)', borderTopColor: '#22c55e', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      {/* 4 Stat Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <StatCard 
          label="NETWORK HEALTH" 
          value="72/100" 
          detail="46 assets monitored"
          subDetail="Down 2 pts — patch lag"
          color="#22c55e"
          icon={<Icons.pulse />}
        />
        <StatCard 
          label="LIVE DEVICES" 
          value="46" 
          detail="3 rogue"
          subDetail="3 unregistered"
          color="#3b82f6"
          icon={<Icons.devices />}
        />
        <StatCard 
          label="STAFF AWARENESS" 
          value="74%" 
          detail="5 depts tracked"
          subDetail="Up 4% this month"
          color="#10b981"
          icon={<Icons.shield />}
        />
        <StatCard 
          label="OPEN PATCHES" 
          value="8" 
          detail="3 critical CVEs"
          subDetail="3 critical overdue"
          color="#f59e0b"
          icon={<Icons.refresh />}
        />
      </div>

      {/* Main Grid: Radar + Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Radar Chart Card */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '24px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>CIS Controls v8 — IG1 Posture</h3>
              <p style={{ fontSize: '13px', color: 'rgba(148,163,184,0.6)' }}>Implementation Group 1 mapped to live telemetry</p>
            </div>
            <div style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="live-dot-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span>
              LIVE
            </div>
          </div>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '340px' }}>
            <ResponsiveContainer width="100%" height={340}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(148,163,184,0.6)', fontSize: 12, fontWeight: 500 }} />
                <Radar
                  name="Posture"
                  dataKey="A"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Telemetry Log Card */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '24px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'rgba(148,163,184,0.4)', fontFamily: 'monospace' }}>&gt;_</span> Live Telemetry — AI Alert Log
            </h3>
            <div style={{ color: '#22c55e', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="live-dot-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span>
              Streaming
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '400px', paddingRight: '10px' }}>
            {telemetryLogs.map((log, i) => (
              <div key={i} style={{ display: 'flex', gap: '20px' }}>
                <span style={{ fontSize: '12px', color: 'rgba(148,163,184,0.4)', fontFamily: 'monospace', width: '40px', flexShrink: 0 }}>{log.time}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {log.type === 'ai' && (
                      <span style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.05em' }}>AI</span>
                    )}
                    <p style={{ 
                      fontSize: '13px', 
                      color: log.critical ? '#ef4444' : log.type === 'warning' ? '#f59e0b' : log.type === 'success' ? '#10b981' : 'rgba(148,163,184,0.8)',
                      lineHeight: '1.5',
                      fontWeight: log.critical ? 600 : 400
                    }}>
                      {log.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}

function StatCard({ label, value, detail, subDetail, color, icon }) {
  return (
    <div style={{ 
      background: 'rgba(255,255,255,0.02)', 
      border: '1px solid rgba(255,255,255,0.05)', 
      borderRadius: '20px', 
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(148,163,184,0.5)', letterSpacing: '0.08em' }}>{label}</span>
        <div style={{ 
          width: '32px', height: '32px', borderRadius: '10px', 
          background: `${color}15`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: color
        }}>{icon}</div>
      </div>
      <div style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '8px', letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: '13px', color: 'rgba(148,163,184,0.6)', fontWeight: 500 }}>{detail}</div>
      <div style={{ fontSize: '12px', color: color, fontWeight: 700, marginTop: '2px' }}>{subDetail}</div>
    </div>
  );
}

const Icons = {
  pulse: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  devices: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  shield: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  refresh: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  ),
};
