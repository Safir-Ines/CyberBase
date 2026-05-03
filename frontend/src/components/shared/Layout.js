import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_COLORS, ROLE_LABELS } from '../../utils/roles';
import Icons from '../../utils/Icons';
import { NAV_BY_ROLE, LIVE_STATUS_BY_ROLE, ROLE_SECTION_LABELS } from '../../utils/navigation';

// CyberBase logo mark SVG
const LogoMark = () => (
  <svg width="28" height="28" viewBox="180 240 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sidebarLogoGradient" x1="390.5" y1="249" x2="390.5" y2="658.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#000B3D" />
        <stop offset="0.475962" stopColor="#003544" />
        <stop offset="0.653493" stopColor="#005C4A" />
        <stop offset="0.759615" stopColor="#00923E" />
        <stop offset="1" stopColor="#00FF00" />
      </linearGradient>
    </defs>
    <path d="M357.5 638L311.5 332L390.5 249L470.536 332H471L470.94 332.419L471.5 333L470.857 332.995L427 638L392 658.5L357.5 638Z" fill="url(#sidebarLogoGradient)"/>
    <path d="M588.416 413.853L589 414L490 620L457.5 631L441 607.5L480 386.5L548.135 343L588.416 413.853Z" fill="url(#sidebarLogoGradient)"/>
    <path d="M303 389.5L302.464 389.61L343.156 606.654L343.5 607L329 636L294.819 620.644L192.635 413.323L192 412.5L230.5 344.5L303 389.5Z" fill="url(#sidebarLogoGradient)" fillOpacity="0.4"/>
  </svg>
);

// Avatar component
const Avatar = ({ name, size = 34, color = '#22c55e' }) => {
  const initials = name ? name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) : '?';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700, color: '#fff',
      flexShrink: 0, letterSpacing: '-0.02em',
    }}>
      {initials}
    </div>
  );
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const nav = NAV_BY_ROLE[user?.role] || [];
  const liveStatus = LIVE_STATUS_BY_ROLE[user?.role] || [];
  const sectionLabel = ROLE_SECTION_LABELS[user?.role] || 'PORTAL';
  
  const handleLogout = () => { logout(); navigate('/login'); };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      window.location.reload();
    }, 1200);
  };

  const handleSearchClick = () => {
    setShowSearchModal(true);
    setShowNotifications(false);
    setShowUserMenu(false);
  };

  const allPages = nav.map(p => ({ ...p, type: 'Module' }));
  
  const searchResults = search.trim().length > 0 
    ? [
        ...allPages.filter(p => p.label.toLowerCase().includes(search.toLowerCase())),
        ...(search.toLowerCase().includes('asset') || search.toLowerCase().includes('device') 
            ? [{ path: '/manager/assets', icon: Icons.assets, label: 'Asset Inventory', type: 'Database' }] : []),
        ...(search.toLowerCase().includes('scan') || search.toLowerCase().includes('network') 
            ? [{ path: '/manager/scan', icon: Icons.scan, label: 'Network Scanner', type: 'Tool' }] : []),
        ...(search.toLowerCase().includes('threat') || search.toLowerCase().includes('risk') 
            ? [{ path: '/manager/risks', icon: Icons.risks, label: 'Risk Matrix', type: 'Intelligence' }] : []),
        ...(search.toLowerCase().includes('ai') || search.toLowerCase().includes('copilot') 
            ? [{ path: '/manager/copilot', icon: Icons.copilot, label: 'AI Security Copilot', type: 'Assistant' }] : []),
      ].filter((v, i, a) => a.findIndex(t => t.path === v.path) === i) // unique by path
    : [];

  const mockNotifications = [
    { id: 1, title: 'Intrusion Alert', time: '2m ago', type: 'critical', text: 'Multiple failed SSH attempts detected from 192.168.1.45.', icon: '🚨' },
    { id: 2, title: 'Asset Update', time: '1h ago', type: 'info', text: '3 new workstations successfully registered to Inventory.', icon: '📦' },
    { id: 3, title: 'Policy Violation', time: '3h ago', type: 'warning', text: 'Employee "J. Doe" attempted to access restricted Segment C.', icon: '⚠️' },
    { id: 4, title: 'System Healthy', time: '5h ago', type: 'success', text: 'All network segments reporting normal latency and zero rogue devices.', icon: '✅' },
  ];

  // Derive current page title from nav or path
  let currentPage = nav.find(p => location.pathname.includes(p.path));
  if (!currentPage && location.pathname.includes('/profile')) {
    currentPage = { label: 'Profile Settings', icon: '👤' };
  }
  if (!currentPage) currentPage = { label: 'Cockpit', icon: '✦' };
  const pageTitle = currentPage?.label || 'Dashboard';

  // Format date like CyberBase
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0f172a', position: 'relative', color: '#fff' }}>
      {/* Global Background Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
        zIndex: 0,
      }}></div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 49,
        }} />
      )}

      {/* Mobile trigger */}
      <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-trigger" style={{
        position: 'fixed', top: 14, left: 14, zIndex: 100, display: 'none',
        width: 38, height: 38, borderRadius: 8, background: '#1e293b',
        border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', fontSize: 18,
        alignItems: 'center', justifyContent: 'center',
      }}>☰</button>

      <style>{`
        @media (max-width: 768px) {
          .mobile-trigger { display: flex !important; }
          .sidebar-panel {
            position: fixed !important;
            height: 100vh;
            transform: translateX(${mobileOpen ? '0' : '-100%'});
            z-index: 50;
          }
          .hide-mobile { display: none !important; }
        }
        .nav-link:hover {
          background: rgba(255,255,255,0.03) !important;
          color: #fff !important;
        }
        .live-dot-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside className="sidebar-panel" style={{
        width: 260,
        background: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: 'transform 0.28s ease',
        overflow: 'hidden',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        zIndex: 60
      }}>

        {/* Logo */}
        <div style={{
          padding: '24px 24px 20px',
          display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: '1px solid rgba(255,255,255,0.03)'
        }}>
          <LogoMark />
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 19, color: '#ffffff', letterSpacing: '-0.02em',
          }}>CyberBase</div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto' }}>
          {nav.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className="nav-link"
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                borderRadius: '12px',
                color: isActive ? '#fff' : 'rgba(148,163,184,0.6)',
                background: isActive ? 'rgba(34,197,94,0.1)' : 'transparent',
                boxShadow: isActive ? 'inset 0 0 0 1px rgba(34,197,94,0.15)' : 'none',
                fontSize: 14, fontWeight: isActive ? 600 : 500,
                textDecoration: 'none',
                transition: 'all 0.2s',
              })}
            >
              <span style={{ 
                color: 'inherit', 
                opacity: 0.9, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 20
              }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.label === 'Asset Intelligence' && (
                <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>3</span>
              )}
              {item.label === 'Staff SOS Alerts' && (
                <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>4</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '12px',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px', color: '#94a3b8', fontSize: 14, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-start',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
          >
            {Icons.logout}
            Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>

        {/* Top Header Bar */}
        <header style={{
          height: 72,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center',
          padding: '0 32px',
          gap: 24,
          flexShrink: 0,
          zIndex: 10,
        }}>
          {/* Page title + date */}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 20, color: '#ffffff', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              {pageTitle === 'Overview' ? 'Telemetry & Threat Overview' : pageTitle}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(148,163,184,0.6)', marginTop: 2, fontWeight: 500 }}>
              {dateStr} {user?.organization?.name && ` · ${user.organization.name}`}
            </div>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', width: 320 }} className="hide-mobile">
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(148,163,184,0.5)', zIndex: 5 }}>{Icons.search}</span>
            <input
              placeholder="Search devices, alerts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => { setShowNotifications(false); setShowUserMenu(false); }}
              style={{
                paddingLeft: 42, height: 42, borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                fontSize: 14, color: '#ffffff', width: '100%',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocusCapture={e => { e.target.style.borderColor = 'rgba(34,197,94,0.4)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
              onBlurCapture={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
            />
            {/* Search Results Dropdown */}
            {search.trim().length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, width: '100%',
                marginTop: 8, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
                padding: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', zIndex: 1000,
              }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', padding: '0 8px' }}>Global Search</div>
                {searchResults.length > 0 ? searchResults.map((res, i) => (
                  <button 
                    key={i} 
                    onClick={() => { navigate(res.path); setSearch(''); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                      background: 'transparent', border: 'none', borderRadius: '10px', cursor: 'pointer',
                      textAlign: 'left', transition: 'all 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ color: '#22c55e' }}>{res.icon}</span>
                    <div>
                      <div style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{res.label}</div>
                      <div style={{ color: 'rgba(148,163,184,0.6)', fontSize: '11px' }}>{res.type}</div>
                    </div>
                  </button>
                )) : (
                  <div style={{ padding: '16px', textAlign: 'center', color: 'rgba(148,163,184,0.6)', fontSize: '13px' }}>
                    No results found for "{search}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Notification bell */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                style={{
                  width: 42, height: 42, borderRadius: '12px', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)', color: showNotifications ? '#22c55e' : '#94a3b8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {Icons.bell}
              </button>
              <div style={{
                position: 'absolute', top: -4, right: -4,
                width: 18, height: 18, borderRadius: '50%',
                background: '#ef4444', color: '#fff',
                fontSize: 10, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #0f172a',
              }}>2</div>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, width: '320px',
                  marginTop: 12, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px',
                  padding: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', zIndex: 1000,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>Intelligence Alerts</span>
                    <button onClick={() => setShowNotifications(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Mark all read</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {mockNotifications.map(n => (
                      <div key={n.id} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <span style={{ fontSize: '18px' }}>{n.icon}</span>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{n.title}</span>
                            <span style={{ fontSize: '10px', color: 'rgba(148,163,184,0.5)' }}>{n.time}</span>
                          </div>
                          <p style={{ fontSize: '11px', color: 'rgba(148,163,184,0.7)', marginTop: '4px', lineHeight: 1.4 }}>{n.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button style={{ width: '100%', marginTop: '16px', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                    View All Intelligence
                  </button>
                </div>
              )}
            </div>

            {/* User profile */}
            {user && (
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 16, borderLeft: '1px solid rgba(255,255,255,0.1)',
                    background: 'transparent', border: 'none', cursor: 'pointer'
                  }}
                >
                  <Avatar name={user.name} size={38} color="#22c55e" />
                  <div className="hide-mobile" style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.6)', fontWeight: 600, textTransform: 'capitalize' }}>{ROLE_LABELS[user.role]}</div>
                  </div>
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, width: '220px',
                    marginTop: 12, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
                    padding: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', zIndex: 1000,
                  }}>
                    <div style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '4px' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(148,163,184,0.5)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Organization</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>{user.organization?.name || 'Acmecorp Node'}</div>
                    </div>
                    <button 
                      onClick={() => { navigate(`/${user.role}/profile`); setShowUserMenu(false); }}
                      style={{ 
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                        background: 'transparent', border: 'none', borderRadius: '8px', color: 'rgba(148,163,184,0.8)',
                        fontSize: '13px', fontWeight: 600, cursor: 'pointer', textAlign: 'left'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      👤 Account Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      style={{ 
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                        background: 'transparent', border: 'none', borderRadius: '8px', color: '#ef4444',
                        fontSize: '13px', fontWeight: 600, cursor: 'pointer', textAlign: 'left'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      🚪 Terminate Session
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
