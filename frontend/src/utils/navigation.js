import Icons from './Icons';

export const NAV_BY_ROLE = {
  ceo: [
    { path: '/ceo/dashboard',       icon: Icons.dashboard,       label: 'Overview' },
    { path: '/ceo/anomalies',       icon: Icons.anomalies,       label: 'AI Insights' },
    { path: '/ceo/recommendations', icon: Icons.recommendations, label: 'Recommendations' },
    { path: '/ceo/risks',           icon: Icons.risks,           label: 'Risk Matrix' },
  ],
  manager: [
    { path: '/manager/dashboard', icon: Icons.dashboard, label: 'Control Center' },
    { path: '/manager/scan',      icon: Icons.scan,      label: 'Network Scan' },
    { path: '/manager/assets',    icon: Icons.assets,    label: 'Asset Inventory' },
    { path: '/manager/anomalies', icon: Icons.anomalies, label: 'AI Intelligence' },
    { path: '/manager/risks',     icon: Icons.risks,     label: 'Risk Matrix' },
    { path: '/manager/reviews',   icon: Icons.assessments, label: 'Assessments' },
    { path: '/manager/copilot',   icon: Icons.copilot,   label: 'AI Copilot' },
  ],
  employee: [
    { path: '/employee/assessment', icon: Icons.assessment2, label: 'Security Audit' },
    { path: '/employee/training',   icon: Icons.phishing,    label: 'Academy Hub' },
    { path: '/employee/chatbot',    icon: Icons.copilot,     label: 'Support Bot' },
  ]
};

export const LIVE_STATUS_BY_ROLE = {
  ceo: [
    { label: 'Security Level', value: '2 of 5', color: '#f97316' },
    { label: 'Open Risks', value: '12', color: '#ef4444' },
    { label: 'Law 18-07', value: '⚠ At Risk', color: '#eab308' },
  ],
  manager: [
    { label: 'Live Devices', value: '1,204', color: '#22c55e' },
    { label: 'Rogue', value: '3', color: '#ef4444' },
    { label: 'Last Scan', value: '10:31 AM', color: '#64748b' },
  ],
  employee: [
    { label: 'Security XP', value: '1,250', color: '#a855f7' },
    { label: 'Current Rank', value: 'Guardian', color: '#22c55e' }
  ],
};

export const ROLE_SECTION_LABELS = {
  ceo: 'GOVERNANCE Cockpit',
  manager: 'SECOPS COMMAND',
  employee: 'ACADEMY TERMINAL',
};
