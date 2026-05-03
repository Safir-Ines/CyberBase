import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import InfoBox from '../../components/shared/InfoBox';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

  const ROLE_LABELS = { ceo: 'Chief Executive', manager: 'IT Manager', employee: 'Organization Staff' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', 
          background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', 
          color: '#3b82f6', fontSize: '11px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.12em' 
        }}>
          👤 USER SETTINGS
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '8px', letterSpacing: '-0.02em' }}>Profile & Security</h1>
        <p style={{ color: 'rgba(148, 163, 184, 0.7)', fontSize: '15px', maxWidth: '600px', lineHeight: 1.6 }}>
          Manage your operational credentials, security protocols, and notification preferences.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '40px' }}>
        {/* Sidebar Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['account', 'security', 'notifications', 'preferences'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                textAlign: 'left', padding: '12px 20px', borderRadius: '12px',
                background: activeTab === tab ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                color: activeTab === tab ? '#22c55e' : 'rgba(148, 163, 184, 0.6)',
                border: 'none', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                transition: 'all 0.2s', textTransform: 'capitalize',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}
            >
              <span style={{ fontSize: '16px', opacity: 0.8 }}>
                {tab === 'account' ? '👤' : tab === 'security' ? '🔒' : tab === 'notifications' ? '🔔' : '⚙️'}
              </span>
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ 
            background: 'rgba(255, 255, 255, 0.02)', 
            border: '1px solid rgba(255, 255, 255, 0.05)', 
            borderRadius: '24px', 
            padding: '40px' 
          }}
        >
          {activeTab === 'account' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 800, color: '#fff' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{user?.name}</h3>
                  <p style={{ color: 'rgba(148, 163, 184, 0.6)', fontSize: '14px' }}>{ROLE_LABELS[user?.role] || user?.role}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <Field label="Security ID (Email)" value={user?.email} />
                <Field label="Organization" value={user?.organization?.name || 'Acmecorp Node'} />
                <Field label="System Role" value={user?.role} style={{ textTransform: 'uppercase' }} />
                <Field label="Access Level" value="Level 4 (Admin)" />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>Security Protocols</h3>
              <InfoBox title="MULTI-FACTOR AUTHENTICATION" icon="🛡️" color="#22c55e">
                MFA is currently <strong>active</strong> for your node. This is a mandatory protocol enforced by the organization's security master policy.
              </InfoBox>
              
              <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '13px', color: 'rgba(148, 163, 184, 0.8)', marginBottom: '20px' }}>To maintain system integrity, passwords must be rotated every 90 days.</p>
                <button style={{ padding: '12px 24px', background: '#22c55e', color: '#000', borderRadius: '12px', fontSize: '14px', fontWeight: 800, border: 'none', cursor: 'pointer' }}>Rotate Access Key</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>Intelligence Feed Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Toggle label="Critical Threat Alerts" description="Instant notifications for critical asset mismatches and anomalies." defaultChecked />
                <Toggle label="Email Digest" description="Weekly summary of organizational security maturity and trends." defaultChecked />
                <Toggle label="Browser Telemetry" description="Live streaming status updates in the cockpit header." />
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>Cockpit Interface</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Toggle label="Grid Overlay" description="Display subtle geometric grid across the terminal background." defaultChecked />
                <Toggle label="Data Labels" description="Show descriptive tooltips and technical labels for all metrics." defaultChecked />
                <Toggle label="Live Pulse" description="Animate status indicators for active network nodes." defaultChecked />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, value, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(148, 163, 184, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <div style={{ 
        padding: '14px 18px', background: 'rgba(255, 255, 255, 0.03)', 
        border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px',
        color: '#fff', fontSize: '14px', fontWeight: 500, ...style
      }}>{value}</div>
    </div>
  );
}

function Toggle({ label, description, defaultChecked }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{label}</div>
        <div style={{ fontSize: '12px', color: 'rgba(148, 163, 184, 0.6)', marginTop: '2px' }}>{description}</div>
      </div>
      <input type="checkbox" defaultChecked={defaultChecked} style={{ width: '20px', height: '20px', accentColor: '#22c55e', cursor: 'pointer' }} />
    </div>
  );
}
