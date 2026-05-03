import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ROLE_HOME } from '../utils/roles';

const LogoMark = () => (
  <svg width="40" height="40" viewBox="190 240 400 420" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradLogin" x1="380" y1="240" x2="380" y2="660" gradientUnits="userSpaceOnUse">
        <stop stopColor="#000B3D" />
        <stop offset="0.475962" stopColor="#003544" />
        <stop offset="0.653493" stopColor="#005C4A" />
        <stop offset="0.759615" stopColor="#00923E" />
        <stop offset="1" stopColor="#00FF00" />
      </linearGradient>
    </defs>
    <path d="M357.5 638L311.5 332L390.5 249L470.536 332H471L470.94 332.419L471.5 333L470.857 332.995L427 638L392 658.5L357.5 638Z" fill="url(#logoGradLogin)"/>
    <path d="M588.416 413.853L589 414L490 620L457.5 631L441 607.5L480 386.5L548.135 343L588.416 413.853Z" fill="url(#logoGradLogin)"/>
    <path d="M303 389.5L302.464 389.61L343.156 606.654L343.5 607L329 636L294.819 620.644L192.635 413.323L192 412.5L230.5 344.5L303 389.5Z" fill="url(#logoGradLogin)" fillOpacity="0.4"/>
  </svg>
);

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', organizationName: '', industry: '', size: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = await register(form);
      navigate(ROLE_HOME[data.user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px',
    color: '#fff', fontSize: '16px', outline: 'none', transition: 'all 0.2s'
  };

  const labelStyle = { 
    display: 'block', fontSize: '12px', fontWeight: 700, color: '#94a3b8', 
    marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' 
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#0f172a',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Interactive Background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.02) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }}></div>

      {/* Left panel - branding */}
      <div style={{
        flex: 1.2,
        background: 'linear-gradient(135deg, #000B3D 0%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '80px 60px 60px',
        position: 'relative',
        borderRight: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'left', maxWidth: 480 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <LogoMark />
            <span style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>CyberBase</span>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 style={{
              fontSize: 56, fontWeight: 900,
              color: '#ffffff', marginTop: 32, letterSpacing: '-0.04em', lineHeight: 1.05
            }}>Onboard Your<br/><span style={{ background: 'linear-gradient(to right, #22c55e, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Organization</span></h1>
            <p style={{ color: '#94a3b8', fontSize: 18, marginTop: 20, lineHeight: 1.6, fontWeight: 500 }}>
              Establish your secure node on the CyberBase network in less than 2 minutes.
            </p>
          </motion.div>

          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { icon: '🏛', title: 'Legal Compliance', text: 'Auto-mapping to Law 18-07 & ISO 27001' },
              { icon: '🚀', title: 'Rapid Deployment', text: 'Instant asset discovery across your network' },
              { icon: '🤝', title: 'Role Architecture', text: 'Pre-configured CEO, Manager & User workflows' },
            ].map((f, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 + (i * 0.1) }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0
                }}>{f.icon}</div>
                <div>
                  <div style={{ color: '#ffffff', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{f.title}</div>
                  <div style={{ color: '#64748b', fontSize: 14 }}>{f.text}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - register form */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '80px 60px 60px',
        background: '#0f172a',
        position: 'relative'
      }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }}
          style={{ width: '100%', maxWidth: 460 }}
        >
          <div style={{ marginBottom: 32 }}>
             <Link to="/" style={{ color: '#475569', fontSize: '13px', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span>←</span> Return to Portal
            </Link>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Initialize Node</h2>
            <p style={{ color: '#64748b', marginTop: 8, fontSize: 15 }}>Create your organization's security master terminal</p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 12, padding: '14px', marginBottom: 24,
              color: '#ef4444', fontSize: 14, textAlign: 'center'
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Organization Name</label>
              <input
                type="text"
                value={form.organizationName}
                onChange={e => setForm({...form, organizationName: e.target.value})}
                placeholder="Acme Global Inc."
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Admin Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                placeholder="Sarah Chen"
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Work Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                placeholder="ceo@acme.com"
                required
                style={inputStyle}
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Access Key (Password)</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                placeholder="••••••••"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Industry</label>
              <select
                value={form.industry}
                onChange={e => setForm({...form, industry: e.target.value})}
                required
                style={{...inputStyle, appearance: 'none', background: 'rgba(255,255,255,0.03) url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E") no-repeat right 12px center/16px'}}
              >
                <option value="" disabled style={{background: '#0f172a'}}>Select Sector</option>
                <option value="Technology" style={{background: '#0f172a'}}>Technology</option>
                <option value="Finance" style={{background: '#0f172a'}}>Finance</option>
                <option value="Healthcare" style={{background: '#0f172a'}}>Healthcare</option>
                <option value="Government" style={{background: '#0f172a'}}>Government</option>
                <option value="Manufacturing" style={{background: '#0f172a'}}>Manufacturing</option>
                <option value="Other" style={{background: '#0f172a'}}>Other</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Company Size</label>
              <select
                value={form.size}
                onChange={e => setForm({...form, size: e.target.value})}
                required
                style={{...inputStyle, appearance: 'none', background: 'rgba(255,255,255,0.03) url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E") no-repeat right 12px center/16px'}}
              >
                <option value="" disabled style={{background: '#0f172a'}}>Employee Count</option>
                <option value="1-50" style={{background: '#0f172a'}}>1-50</option>
                <option value="51-200" style={{background: '#0f172a'}}>51-200</option>
                <option value="201-1000" style={{background: '#0f172a'}}>201-1000</option>
                <option value="1000+" style={{background: '#0f172a'}}>1000+</option>
              </select>
            </div>
            
            <div style={{ gridColumn: 'span 2', marginTop: 8 }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '16px', background: '#22c55e', color: '#000',
                  border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: 800,
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: '0 8px 24px rgba(34, 197, 94, 0.2)'
                }}
              >
                {loading ? 'Initializing Node...' : 'Establish Master Terminal →'}
              </button>
            </div>
          </form>

          <p style={{ textAlign: 'center', marginTop: 32, color: '#64748b', fontSize: 15 }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: '#22c55e', fontWeight: 700, textDecoration: 'none' }}>Access Cockpit</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
