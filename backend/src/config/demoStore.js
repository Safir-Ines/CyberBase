/**
 * demoStore.js
 *
 * In-memory data store that replaces MongoDB for demo mode.
 * Pre-seeded with the same data as seed.js but lives only in RAM.
 */

const { scoreAllAssets } = require('../services/anomalyDetection.service');
const { scoreResponse } = require('../services/riskScoring.service');
const { simulateScan } = require('../services/networkScan.service');

// ── helpers ──────────────────────────────────────────────────────────────────
let _id = 1;
const newId = () => String(_id++);

function hashPw(pw) {
  // Simple deterministic fake hash for demo — NOT for production use
  let h = 0;
  for (const c of String(pw)) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
  return 'demo$' + Math.abs(h).toString(16);
}

// ── seed data ─────────────────────────────────────────────────────────────────
const ORG_ID = 'org_acme';

const ORGANIZATION = {
  _id: ORG_ID,
  name: 'Acme Corp',
  industry: 'tech',
  size: 'medium',
  createdAt: new Date('2024-01-01'),
};

const USERS_SEED = [
  { name: 'Sarah Chen',     email: 'ceo@acme.com',       role: 'ceo',      password: 'password123' },
  { name: 'Reda Bensalem',  email: 'manager@acme.com',   role: 'manager',  password: 'password123' },
  { name: 'Yasmine Ait',    email: 'employee1@acme.com', role: 'employee', password: 'password123' },
  { name: 'Karim Tlemcani', email: 'employee2@acme.com', role: 'employee', password: 'password123' },
  { name: 'Fatima Saleh',   email: 'employee3@acme.com', role: 'employee', password: 'password123' },
  { name: 'Omar Khalil',    email: 'employee4@acme.com', role: 'employee', password: 'password123' },
];

const ASSETS_SEED = [
  { name: 'srv-app-01',     type: 'server',      criticality: 'critical', owner: 'IT Team',    ipAddress: '192.168.1.10', macAddress: 'AA:BB:CC:00:00:01', os: 'Linux Ubuntu 22.04',  registered: true },
  { name: 'srv-db-01',      type: 'database',    criticality: 'critical', owner: 'IT Team',    ipAddress: '192.168.1.11', macAddress: 'AA:BB:CC:00:00:02', os: 'Linux Debian 12',      registered: true },
  { name: 'srv-mail-01',    type: 'server',      criticality: 'high',     owner: 'IT Team',    ipAddress: '192.168.1.12', macAddress: 'AA:BB:CC:00:00:03', os: 'Linux Ubuntu 22.04',  registered: true },
  { name: 'fw-perimeter',   type: 'firewall',    criticality: 'critical', owner: 'IT Team',    ipAddress: '192.168.1.1',  macAddress: 'AA:BB:CC:00:00:04', os: 'pfSense',              registered: true },
  { name: 'core-router',    type: 'router',      criticality: 'high',     owner: 'IT Team',    ipAddress: '192.168.1.2',  macAddress: 'AA:BB:CC:00:00:05', os: 'Cisco IOS',            registered: true },
  { name: 'sw-floor-1',     type: 'switch',      criticality: 'medium',   owner: 'IT Team',    ipAddress: '192.168.1.3',  macAddress: 'AA:BB:CC:00:00:06', os: 'Cisco IOS',            registered: true },
  { name: 'wks-finance-01', type: 'workstation', criticality: 'medium',   owner: 'Finance',    ipAddress: '192.168.1.20', macAddress: 'AA:BB:CC:00:01:01', os: 'Windows 11',           registered: true },
  { name: 'wks-finance-02', type: 'workstation', criticality: 'medium',   owner: 'Finance',    ipAddress: '192.168.1.21', macAddress: 'AA:BB:CC:00:01:02', os: 'Windows 11',           registered: true },
  { name: 'wks-hr-01',      type: 'workstation', criticality: 'medium',   owner: 'HR',         ipAddress: '192.168.1.22', macAddress: 'AA:BB:CC:00:01:03', os: 'Windows 10',           registered: true },
  { name: 'wks-dev-01',     type: 'workstation', criticality: 'medium',   owner: 'Dev Team',   ipAddress: '192.168.1.23', macAddress: 'AA:BB:CC:00:01:04', os: 'Windows 11',           registered: true },
  { name: 'wks-dev-02',     type: 'workstation', criticality: 'medium',   owner: 'Dev Team',   ipAddress: '192.168.1.24', macAddress: 'AA:BB:CC:00:01:05', os: 'macOS 14',             registered: true },
  { name: 'lap-ceo',        type: 'laptop',      criticality: 'high',     owner: 'Executive',  ipAddress: '192.168.1.30', macAddress: 'AA:BB:CC:00:02:01', os: 'macOS 14',             registered: true },
  { name: 'lap-manager',    type: 'laptop',      criticality: 'medium',   owner: 'IT Team',    ipAddress: '192.168.1.31', macAddress: 'AA:BB:CC:00:02:02', os: 'Windows 11',           registered: true },
  { name: 'lap-sales-01',   type: 'laptop',      criticality: 'medium',   owner: 'Sales',      ipAddress: '192.168.1.32', macAddress: 'AA:BB:CC:00:02:03', os: 'Windows 11',           registered: true },
  { name: 'lap-sales-02',   type: 'laptop',      criticality: 'medium',   owner: 'Sales',      ipAddress: '192.168.1.33', macAddress: 'AA:BB:CC:00:02:04', os: 'Windows 11',           registered: true },
  { name: 'printer-floor1', type: 'printer',     criticality: 'low',      owner: 'IT Team',    ipAddress: '192.168.1.40', macAddress: 'AA:BB:CC:00:03:01', os: 'Embedded',             registered: true },
  { name: 'printer-floor2', type: 'printer',     criticality: 'low',      owner: 'IT Team',    ipAddress: '192.168.1.41', macAddress: 'AA:BB:CC:00:03:02', os: 'Embedded',             registered: true },
  { name: 'crm-saas',       type: 'app',         criticality: 'high',     owner: 'Sales',      ipAddress: '',             macAddress: '',                  os: 'Cloud',                registered: true },
  { name: 'iot-cam-lobby',  type: 'iot',         criticality: 'critical', owner: 'Facilities', ipAddress: '192.168.1.50', macAddress: 'AA:BB:CC:00:04:01', os: 'Embedded',             registered: true },
  { name: 'old-fileserver', type: 'server',      criticality: 'low',      owner: 'Unknown',    ipAddress: '192.168.1.60', macAddress: 'AA:BB:CC:00:04:02', os: 'Windows Server 2008',  registered: false, lastSeen: new Date(Date.now() - 400 * 24 * 3600 * 1000) },
];

const RISKS_SEED = [
  { title: 'No MFA on email',              description: 'Microsoft 365 still allows password-only login.',                          severity: 'high',     likelihood: 4, impact: 4, status: 'open',   source: 'manual' },
  { title: 'Backups not tested in 6 months', description: 'No documented restore test.',                                            severity: 'medium',   likelihood: 3, impact: 5, status: 'open',   source: 'manual' },
  { title: 'Outdated Windows Server 2008', description: 'old-fileserver is running an EOL OS with no security patches available.', severity: 'critical', likelihood: 4, impact: 5, status: 'open',   source: 'manual' },
  { title: 'No endpoint detection on IoT', description: 'iot-cam-lobby lacks EDR/monitoring.',                                     severity: 'medium',   likelihood: 3, impact: 3, status: 'open',   source: 'manual' },
  { title: 'Weak Wi-Fi encryption',        description: 'Guest Wi-Fi uses WPA, not WPA3.',                                         severity: 'low',      likelihood: 2, impact: 2, status: 'open',   source: 'manual' },
];

// Pre-seeded assessment responses (2 employees already submitted)
const ASSESSMENTS_SEED = [
  // Yasmine (risky answers — will be suspicious)
  {
    userId: null, // filled after user creation
    emailKey: 'employee1@acme.com',
    answers: { q1: 'click', q2: 'always', q3: 'yes',  q4: 'shared', q5: 'never',  q6: 'no',   q7: 'always', q8: 'wire'  },
  },
  // Karim (mostly safe)
  {
    userId: null,
    emailKey: 'employee2@acme.com',
    answers: { q1: 'report', q2: 'never', q3: 'no',  q4: 'no',     q5: 'asap',   q6: 'all',  q7: 'vpn',    q8: 'call'  },
  },
];

// ── build in-memory store ──────────────────────────────────────────────────────
const db = {
  organizations: [ORGANIZATION],
  users: [],
  assets: [],
  risks: [],
  assessments: [],
  networkScans: [],
  gameProgress: [],
};

// Build users
for (const u of USERS_SEED) {
  db.users.push({
    _id: newId(),
    name: u.name,
    email: u.email.toLowerCase(),
    passwordHash: hashPw(u.password),
    role: u.role,
    organization: ORG_ID,
    lastRiskScore: null,
    isSuspicious: false,
    createdAt: new Date('2024-01-15'),
  });
}

// Build assets
for (const a of ASSETS_SEED) {
  db.assets.push({
    _id: newId(),
    organization: ORG_ID,
    registered: true,
    lastSeen: new Date(),
    createdAt: new Date('2024-01-15'),
    ...a,
  });
}

// Build risks
for (const r of RISKS_SEED) {
  db.risks.push({
    _id: newId(),
    organization: ORG_ID,
    status: 'open',
    source: 'manual',
    createdBy: db.users[1]._id, // manager
    createdAt: new Date('2024-02-01'),
    relatedAsset: null,
    ...r,
  });
}

// Build assessment responses
for (const a of ASSESSMENTS_SEED) {
  const user = db.users.find(u => u.email === a.emailKey);
  if (!user) continue;
  const { riskScore, isSuspicious, redFlags } = scoreResponse(a.answers);
  const resp = {
    _id: newId(),
    organization: ORG_ID,
    user: user._id,
    answers: a.answers,
    riskScore,
    isSuspicious,
    redFlags,
    createdAt: new Date('2024-03-01'),
  };
  db.assessments.push(resp);
  user.lastRiskScore = riskScore;
  user.isSuspicious = isSuspicious;
}

// ── query helpers (mimics Mongoose API surface) ───────────────────────────────
const store = {
  // ── Organizations ──
  findOrg(id) { return db.organizations.find(o => o._id === id) || null; },
  findOrgByName(name) { return db.organizations.find(o => o.name === name) || null; },
  createOrg(data) {
    const org = { _id: newId(), createdAt: new Date(), ...data };
    db.organizations.push(org);
    return org;
  },

  // ── Users ──
  findUserByEmail(email) { return db.users.find(u => u.email === email.toLowerCase()) || null; },
  findUserById(id) { return db.users.find(u => u._id === id) || null; },
  findUsersByOrg(orgId, role) {
    let list = db.users.filter(u => u.organization === orgId);
    if (role) list = list.filter(u => u.role === role);
    return list;
  },
  countUsersByOrg(orgId) { return db.users.filter(u => u.organization === orgId).length; },
  createUser(data) {
    const user = {
      _id: newId(),
      organization: ORG_ID,
      lastRiskScore: null,
      isSuspicious: false,
      createdAt: new Date(),
      ...data,
      passwordHash: hashPw(data.password),
    };
    delete user.password;
    db.users.push(user);
    return user;
  },
  updateUser(id, patch) {
    const u = db.users.find(u => u._id === id);
    if (u) Object.assign(u, patch);
    return u;
  },
  checkPassword(user, pw) { return user.passwordHash === hashPw(pw); },
  safeUser(u) {
    const { passwordHash, ...safe } = u;
    return safe;
  },

  // ── Assets ──
  listAssets(orgId) { return db.assets.filter(a => a.organization === orgId).sort((a, b) => b.createdAt - a.createdAt); },
  createAsset(data) {
    const asset = { _id: newId(), organization: ORG_ID, registered: true, lastSeen: new Date(), createdAt: new Date(), ...data };
    db.assets.push(asset);
    return asset;
  },
  updateAsset(id, orgId, patch) {
    const a = db.assets.find(a => a._id === id && a.organization === orgId);
    if (a) Object.assign(a, patch);
    return a || null;
  },
  deleteAsset(id, orgId) {
    const idx = db.assets.findIndex(a => a._id === id && a.organization === orgId);
    if (idx === -1) return null;
    return db.assets.splice(idx, 1)[0];
  },

  // ── Risks ──
  listRisks(orgId) {
    return db.risks
      .filter(r => r.organization === orgId)
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(r => ({
        ...r,
        relatedAsset: r.relatedAsset ? db.assets.find(a => a._id === r.relatedAsset) || null : null,
      }));
  },
  createRisk(data) {
    const risk = { _id: newId(), organization: ORG_ID, status: 'open', source: 'manual', relatedAsset: null, createdAt: new Date(), ...data };
    db.risks.push(risk);
    return risk;
  },
  updateRisk(id, orgId, patch) {
    const r = db.risks.find(r => r._id === id && r.organization === orgId);
    if (r) Object.assign(r, patch);
    return r || null;
  },
  deleteRisk(id, orgId) {
    const idx = db.risks.findIndex(r => r._id === id && r.organization === orgId);
    if (idx === -1) return null;
    return db.risks.splice(idx, 1)[0];
  },

  // ── Assessments ──
  listAssessments(orgId, userId) {
    let list = db.assessments.filter(a => a.organization === orgId);
    if (userId) list = list.filter(a => a.user === userId);
    return list.sort((a, b) => b.createdAt - a.createdAt).map(a => ({
      ...a,
      user: db.users.find(u => u._id === a.user) ? store.safeUser(db.users.find(u => u._id === a.user)) : a.user,
    }));
  },
  latestAssessment(orgId, userId) {
    return db.assessments
      .filter(a => a.organization === orgId && a.user === userId)
      .sort((a, b) => b.createdAt - a.createdAt)[0] || null;
  },
  createAssessment(data) {
    const resp = { _id: newId(), organization: ORG_ID, createdAt: new Date(), ...data };
    db.assessments.push(resp);
    return resp;
  },

  // ── Network scans ──
  listNetworkScans(orgId) { return db.networkScans.filter(s => s.organization === orgId).sort((a, b) => b.createdAt - a.createdAt); },
  latestScan(orgId) { return store.listNetworkScans(orgId)[0] || null; },
  createScan(data) {
    const scan = { _id: newId(), organization: ORG_ID, createdAt: new Date(), ...data };
    db.networkScans.push(scan);
    return scan;
  },

  // ── Game Progress ──
  getGameProgress(orgId, userId) {
    return db.gameProgress.find(p => p.organization === orgId && p.user === userId) || {
      user: userId,
      organization: orgId,
      points: 0,
      level: 1,
      badges: [],
      completedScenarios: [],
      lastPlayed: null,
    };
  },
  saveGameProgress(orgId, userId, data) {
    let p = db.gameProgress.find(p => p.organization === orgId && p.user === userId);
    if (!p) {
      p = { _id: newId(), organization: orgId, user: userId, points: 0, level: 1, badges: [], completedScenarios: [], lastPlayed: null };
      db.gameProgress.push(p);
    }
    Object.assign(p, data, { lastPlayed: new Date() });
    return p;
  },

  // ── Convenience ──
  scoreAllAssets,
};

module.exports = store;
