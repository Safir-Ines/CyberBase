import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Professional SVG Icons
const Icons = {
  radar: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" opacity="0.3"/>
      <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      <path d="M12 12l8 -4.5" />
      <path d="M12 12v-9" opacity="0.5" />
      <circle cx="12" cy="12" r="9" strokeDasharray="4 4" opacity="0.2"/>
    </svg>
  ),
  brain: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2a2.5 2.5 0 0 1 0 5a2.5 2.5 0 0 1 0 -5z" />
      <path d="M14.5 2a2.5 2.5 0 0 0 0 5a2.5 2.5 0 0 0 0 -5z" />
      <path d="M9.5 7a2.5 2.5 0 0 1 0 5a2.5 2.5 0 0 1 0 -5z" />
      <path d="M14.5 7a2.5 2.5 0 0 0 0 5a2.5 2.5 0 0 0 0 -5z" />
      <path d="M12 12v10" />
      <path d="M12 12c4 0 4-4 8-4" />
      <path d="M12 12c-4 0-4-4-8-4" />
    </svg>
  ),
  academy: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
};

const LogoMark = () => (
  <svg width="40" height="40" viewBox="190 240 400 420" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradientLanding" x1="380" y1="240" x2="380" y2="660" gradientUnits="userSpaceOnUse">
        <stop stopColor="#000B3D" />
        <stop offset="0.475962" stopColor="#003544" />
        <stop offset="0.653493" stopColor="#005C4A" />
        <stop offset="0.759615" stopColor="#00923E" />
        <stop offset="1" stopColor="#00FF00" />
      </linearGradient>
    </defs>
    <path d="M357.5 638L311.5 332L390.5 249L470.536 332H471L470.94 332.419L471.5 333L470.857 332.995L427 638L392 658.5L357.5 638Z" fill="url(#logoGradientLanding)"/>
    <path d="M588.416 413.853L589 414L490 620L457.5 631L441 607.5L480 386.5L548.135 343L588.416 413.853Z" fill="url(#logoGradientLanding)"/>
    <path d="M303 389.5L302.464 389.61L343.156 606.654L343.5 607L329 636L294.819 620.644L192.635 413.323L192 412.5L230.5 344.5L303 389.5Z" fill="url(#logoGradientLanding)" fillOpacity="0.4"/>
  </svg>
);

export default function LandingPage() {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{ 
        background: '#0f172a', 
        color: '#fff', 
        minHeight: '100vh', 
        overflowX: 'hidden', 
        fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
        position: 'relative'
      }}
    >
      {/* Interactive Global Glow */}
      <div style={{
        position: 'fixed',
        left: mousePos.x,
        top: mousePos.y,
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 1,
        transition: 'all 0.15s ease-out'
      }}></div>

      {/* Sophisticated Background Layers */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.02) 1px, transparent 0)',
        backgroundSize: '40px 40px',
        zIndex: 0, pointerEvents: 'none'
      }}></div>
      {/* Navigation */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '20px 60px', position: 'fixed', top: 0, width: '100%', zIndex: 100,
        background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LogoMark />
          <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>CyberBase</span>
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>Solutions</a>
          <a href="#compliance" style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>Compliance</a>
          <Link to="/login" style={{ color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          <Link to="/register" style={{ 
            padding: '10px 20px', background: 'var(--accent)', borderRadius: '8px', 
            color: '#000', fontSize: '14px', fontWeight: 700, textDecoration: 'none'
          }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        padding: '200px 60px 100px', textAlign: 'center', position: 'relative',
        background: 'radial-gradient(circle at 50% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)'
      }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', 
            background: 'rgba(34, 197, 94, 0.1)', borderRadius: '20px', border: '1px solid rgba(34, 197, 94, 0.2)',
            color: 'var(--accent)', fontSize: '12px', fontWeight: 700, marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em'
          }}>
            <span style={{ fontSize: '16px' }}>✦</span> System Online: Mission Hub 2.0 Now Live
          </div>
          <motion.div 
            style={{ 
              x: (mousePos.x - window.innerWidth / 2) / 50,
              y: (mousePos.y - window.innerHeight / 2) / 50 
            }}
          >
            <h1 style={{ 
              fontSize: '104px', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.06em', 
              maxWidth: '1200px', margin: '0 auto 32px', color: '#fff',
              filter: 'drop-shadow(0 0 40px rgba(34, 197, 94, 0.15))'
            }}>
              The Unified <br />
              <span style={{ 
                background: 'linear-gradient(to right, #22c55e, #10b981, #3b82f6)', 
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>Security Intelligence</span>
            </h1>
          </motion.div>
          <p style={{ fontSize: '22px', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 48px', lineHeight: 1.6, fontWeight: 500 }}>
            Orchestrate organizational maturity, shadow-IT discovery, and autonomous training through a single mission-control interface.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/register" style={{ 
              padding: '16px 32px', background: 'var(--accent)', borderRadius: '12px', 
              color: '#000', fontSize: '16px', fontWeight: 800, textDecoration: 'none',
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
            }}>Launch Cockpit</Link>
            <Link to="/login" style={{ 
              padding: '16px 32px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', 
              color: '#fff', fontSize: '16px', fontWeight: 700, textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>Sign In</Link>
          </div>
        </motion.div>

        {/* Dashboard Preview Overlay */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ 
            marginTop: '80px', padding: '8px', background: 'rgba(255,255,255,0.03)', 
            borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)',
            maxWidth: '1100px', margin: '80px auto 0', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.6)',
            position: 'relative', overflow: 'hidden'
          }}
        >
          <div style={{ 
            background: '#1e293b', borderRadius: '18px', height: '540px', 
            display: 'flex', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' 
          }}>
            {/* Mock Sidebar */}
            <div style={{ width: '200px', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ height: '6px', width: i === 1 ? '80%' : '60%', background: i === 1 ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.05)', borderRadius: '3px' }}></div>
              ))}
            </div>

            {/* Mock Main Content */}
            <div style={{ flex: 1, padding: '32px', position: 'relative' }}>
              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
                {[
                  { label: 'Security Score', val: '88%', col: '#22c55e' },
                  { label: 'Total Assets', val: '1,204', col: '#3b82f6' },
                  { label: 'Active Risks', val: '12', col: '#ef4444' }
                ].map((s, i) => (
                  <div key={i} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>{s.label}</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: s.col }}>{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Large Chart Area */}
              <div style={{ height: '300px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 50% 50%, #22c55e 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                
                {/* Simulated Radar Pulse */}
                <motion.div 
                  animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px solid #22c55e', position: 'absolute' }}
                />
                
                <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Intelligence Matrix Active</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Real-time shadow-IT discovery in progress...</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '100px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#fff' }}>Engineered for Compliance</h2>
          <p style={{ color: '#94a3b8', marginTop: '12px' }}>Three pillars of organizational security integrity.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { 
              title: 'Mismatch Matrix', 
              text: 'Advanced network discovery logic that identifies rogue hardware by crossing detected telemetry with registered inventory.',
              icon: <Icons.radar />, color: '#3b82f6'
            },
            { 
              title: 'Anomaly Intelligence', 
              text: 'Multi-dimensional analysis of asset behavior using five deviation vectors to surface hidden risks before they escalate.',
              icon: <Icons.brain />, color: '#22c55e'
            },
            { 
              title: 'Training Academy', 
              text: 'Gamified mission hub that transforms employees into active security guardians through realistic chat simulations.',
              icon: <Icons.academy />, color: '#f59e0b'
            }
          ].map((f, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10, scale: 1.02 }}
              style={{ 
                padding: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', 
                border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s',
                position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ 
                width: '56px', height: '56px', borderRadius: '16px', 
                background: `linear-gradient(135deg, ${f.color}22 0%, transparent 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: f.color, marginBottom: '24px', border: `1px solid ${f.color}33`
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px', color: '#fff' }}>{f.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.6 }}>{f.text}</p>
              
              {/* Subtle accent line */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(to right, transparent, ${f.color}, transparent)`, opacity: 0.5 }}></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Compliance Section */}
      <section id="compliance" style={{ padding: '100px 60px', position: 'relative' }}>
        <div style={{ 
          maxWidth: '1000px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, transparent 100%)',
          borderRadius: '32px', padding: '60px', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', gap: '60px'
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '20px', color: '#fff' }}>Aligned with Law 18-07</h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
              CyberBase is architected to support organizational compliance with national and international security standards. From granular RBAC to automated risk documentation, we ensure your governance is evidence-based.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Data Minimization Enforcement', 'Integrated Audit Logging', 'Standardized Risk Matrix'].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 600 }}>
                  <span style={{ color: 'var(--accent)' }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>
            ⚖️
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '60px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <LogoMark />
          <span style={{ fontSize: '20px', fontWeight: 800 }}>CyberBase</span>
        </div>
        <p style={{ color: '#475569', fontSize: '14px' }}>© 2024 CyberBase Systems. All rights reserved.</p>
      </footer>

      {/* Global CSS for Animations */}
      {/* System Status Ticker */}
      <div style={{ 
        position: 'fixed', bottom: 0, width: '100%', background: 'rgba(15, 23, 42, 0.9)', 
        backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(34, 197, 94, 0.1)',
        padding: '10px 0', zIndex: 100, overflow: 'hidden'
      }}>
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ display: 'flex', gap: '40px', whiteSpace: 'nowrap', color: '#22c55e', fontSize: '10px', fontFamily: 'monospace', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}
        >
          <span>[SYSTEM OK]</span> <span>[NODE-ALPHA CONNECTED]</span> <span>[MISMATCH MATRIX SCANNING...]</span> <span>[ANOMALY_DETECTOR: STANDBY]</span> <span>[LAW 18-07 COMPLIANCE: 100%]</span>
          <span>[SYSTEM OK]</span> <span>[NODE-ALPHA CONNECTED]</span> <span>[MISMATCH MATRIX SCANNING...]</span> <span>[ANOMALY_DETECTOR: STANDBY]</span> <span>[LAW 18-07 COMPLIANCE: 100%]</span>
        </motion.div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        :root { --accent: #22c55e; }
        body { margin: 0; background: #0f172a; }
      `}</style>
    </div>
  );
}
