/**
 * networkScan.service.js
 *
 * Simulates an Nmap scan. Real nmap requires admin/root + LAN access, which
 * is incompatible with a hosted SaaS. This simulator returns a realistic
 * scan result: it includes most registered devices, drops some (offline),
 * and adds a handful of unregistered ("rogue") devices with suspicious
 * services/ports. The Manager UI then renders the Mismatch Matrix.
 */

const RANDOM_VENDORS = ['Apple', 'Dell', 'HP', 'Lenovo', 'TP-Link', 'Cisco', 'Xiaomi', 'Samsung', 'Asus', 'Unknown'];
const RANDOM_HOSTNAMES = ['DESKTOP-7XK2', 'iPhone-Reda', 'Cam-Hall-01', 'NAS-Backup', 'PrinterEpson', 'Guest-Phone', 'Raspberry-Pi', 'unknown.local'];
const RANDOM_OS = ['Windows 10', 'Windows 11', 'macOS 14', 'Linux Ubuntu 22.04', 'Android 13', 'iOS 17', 'Embedded Linux'];

// Risky ports we care about flagging
const RISKY_PORTS = [
  { port: 3389, service: 'RDP (Remote Desktop)', risk: 'critical' },
  { port: 23,   service: 'Telnet (cleartext)',   risk: 'critical' },
  { port: 21,   service: 'FTP (cleartext)',       risk: 'high' },
  { port: 445,  service: 'SMB (file sharing)',    risk: 'high' },
  { port: 5900, service: 'VNC (Remote Desktop)',  risk: 'high' },
  { port: 22,   service: 'SSH',                   risk: 'medium' },
  { port: 80,   service: 'HTTP',                  risk: 'low' },
  { port: 443,  service: 'HTTPS',                 risk: 'low' },
  { port: 8080, service: 'HTTP Proxy',            risk: 'medium' },
  { port: 53,   service: 'DNS',                   risk: 'low' },
];

const rand = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rand(arr.length)];

function fakeMac() {
  const hex = () => rand(256).toString(16).padStart(2, '0').toUpperCase();
  return `${hex()}:${hex()}:${hex()}:${hex()}:${hex()}:${hex()}`;
}
function fakeIp(subnet = '192.168.1') {
  return `${subnet}.${10 + rand(240)}`;
}
function fakePorts(rogue = false) {
  const n = 1 + rand(rogue ? 4 : 3);
  const set = new Set();
  const out = [];
  while (out.length < n) {
    const p = pick(RISKY_PORTS);
    if (set.has(p.port)) continue;
    set.add(p.port);
    out.push({ ...p });
  }
  // Ensure at least one rogue device has a critical port for demo drama
  if (rogue && !out.some(p => p.risk === 'critical') && Math.random() > 0.5) {
    out.push({ port: 3389, service: 'RDP (Remote Desktop)', risk: 'critical' });
  }
  return out;
}

/**
 * Simulate an nmap scan against the registered assets.
 * @param {Array} registeredAssets — assets from DB
 * @returns { devices, registeredCount, detectedCount, rogueCount, durationMs }
 */
function simulateScan(registeredAssets) {
  const start = Date.now();
  const devices = [];
  const registeredCount = registeredAssets.length;

  // ~85% of registered assets are detected (some offline)
  registeredAssets.forEach(a => {
    if (Math.random() < 0.85) {
      devices.push({
        ipAddress: a.ipAddress || fakeIp(),
        macAddress: a.macAddress || fakeMac(),
        hostname: a.name,
        os: a.os || pick(RANDOM_OS),
        openPorts: fakePorts(false),
        isRogue: false,
      });
    }
  });

  // Add 2-4 rogue devices (the "shadow IT" alert engine)
  const rogueCount = 2 + rand(3);
  for (let i = 0; i < rogueCount; i++) {
    devices.push({
      ipAddress: fakeIp(),
      macAddress: fakeMac(),
      hostname: pick(RANDOM_HOSTNAMES),
      os: pick(RANDOM_OS),
      openPorts: fakePorts(true),
      isRogue: true,
    });
  }

  return {
    devices,
    registeredCount,
    detectedCount: devices.length,
    rogueCount: devices.filter(d => d.isRogue).length,
    durationMs: Date.now() - start + 800 + rand(1200), // pretend it took a couple seconds
  };
}

module.exports = { simulateScan };
