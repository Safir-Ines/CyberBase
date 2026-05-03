/**
 * aiKnowledge.service.js
 *
 * Rule-based knowledge engine for two assistants:
 *   - askCopilot(question)  — IT-Manager-facing technical advisor (ports, network, ransomware)
 *   - askChatbot(question)  — Employee-facing phishing / awareness coach
 *
 * Designed to feel real without requiring an external LLM. Every answer is
 * structured ({ answer, severity, recommendations, sources }) so the UI can
 * render it nicely.
 *
 * To swap in a real LLM (Groq, Gemini, Anthropic), replace the body of
 * askCopilot/askChatbot with an API call — keep the same return shape.
 */

// ---- shared utilities ----
const lower = (s) => (s || '').toLowerCase();
const has = (s, ...keywords) => keywords.some(k => lower(s).includes(k));

// =================================================================
//  COPILOT — for the IT MANAGER
// =================================================================
const PORT_INTEL = {
  3389: {
    service: 'RDP (Remote Desktop Protocol)',
    severity: 'critical',
    why: 'RDP is one of the top initial access vectors for ransomware. Public-facing RDP is constantly brute-forced.',
    actions: [
      'Block the device at the router/firewall level immediately.',
      'Disable RDP unless absolutely required, then put it behind a VPN.',
      'Enforce Network Level Authentication (NLA) and account lockout policies.',
      'Submit a budget request to the CEO for a managed VPN solution (e.g. WireGuard, Tailscale, OpenVPN).',
    ],
  },
  23: {
    service: 'Telnet',
    severity: 'critical',
    why: 'Telnet sends credentials in cleartext. Anyone on the network can sniff the password.',
    actions: ['Disable Telnet on the device.', 'Replace with SSH (port 22) using key-based auth.'],
  },
  21: {
    service: 'FTP',
    severity: 'high',
    why: 'FTP transmits credentials and files in cleartext.',
    actions: ['Disable FTP.', 'Migrate to SFTP (port 22) or FTPS.'],
  },
  445: {
    service: 'SMB',
    severity: 'high',
    why: 'SMB has a long history of wormable vulnerabilities (EternalBlue / WannaCry).',
    actions: ['Disable SMBv1.', 'Block SMB at the perimeter firewall.', 'Patch the host.'],
  },
  5900: {
    service: 'VNC',
    severity: 'high',
    why: 'VNC is often unauthenticated or weakly authenticated. Should not be exposed.',
    actions: ['Disable VNC or place behind VPN.', 'Use authenticated alternatives (RustDesk + auth, AnyDesk).'],
  },
  22: {
    service: 'SSH',
    severity: 'medium',
    why: 'SSH is fine when hardened, but exposed SSH is a common brute-force target.',
    actions: ['Disable password auth, use SSH keys only.', 'Move SSH off port 22 or place behind VPN.', 'Enable fail2ban.'],
  },
};

function copilotPortAnswer(port) {
  const intel = PORT_INTEL[port];
  if (!intel) return null;
  return {
    answer: `Port ${port} is ${intel.service}. ${intel.why}`,
    severity: intel.severity,
    recommendations: intel.actions,
    sources: ['NIST SP 800-41', 'CISA Ransomware Guide', 'OWASP'],
  };
}

function extractPort(q) {
  const m = q.match(/\bport\s*(\d{2,5})\b/i) || q.match(/\b(\d{2,5})\b/);
  return m ? parseInt(m[1], 10) : null;
}

function askCopilot(question) {
  const q = lower(question);
  const port = extractPort(q);

  // 1. Port-specific question
  if (port && PORT_INTEL[port]) {
    return copilotPortAnswer(port);
  }

  // 2. Topic-based fallbacks
  if (has(q, 'ransomware', 'ransom')) {
    return {
      answer: 'Ransomware attacks typically start with phishing, exposed RDP, or unpatched VPNs.',
      severity: 'critical',
      recommendations: [
        'Maintain offline (3-2-1) backups and test restores monthly.',
        'Patch internet-facing services within 72 hours of vendor release.',
        'Block RDP, SMB, Telnet at the perimeter.',
        'Enforce MFA on every remote-access account.',
        'Run an EDR (CrowdStrike, SentinelOne, MS Defender for Endpoint).',
      ],
      sources: ['CISA #StopRansomware', 'NIST CSF'],
    };
  }
  if (has(q, 'rogue', 'shadow it', 'unknown device', 'unregistered')) {
    return {
      answer: 'A rogue/unregistered device is any host on your network not in your asset inventory. Treat it as compromised until proven otherwise.',
      severity: 'high',
      recommendations: [
        'Quarantine the device at the switch port (802.1X) or the router (MAC filter).',
        'Identify the user — track the switch port back to a desk.',
        'If unknown owner: power it off and physically inspect.',
        'Add legitimate devices to the inventory; raise a Risk for the rest.',
      ],
      sources: ['NIST 800-53 CM-8', 'CIS Control 1: Inventory of Authorized Devices'],
    };
  }
  if (has(q, 'phish', 'phishing', 'email')) {
    return {
      answer: 'Phishing is the #1 initial access vector. Defense is layered: technical filters + user training + reporting workflow.',
      severity: 'high',
      recommendations: [
        'Enable SPF, DKIM, DMARC on your domain.',
        'Run quarterly simulated phishing campaigns (GoPhish, KnowBe4).',
        'Add a "Report Phishing" button in the email client.',
        'Block known malicious domains via DNS filtering.',
      ],
      sources: ['Verizon DBIR', 'CISA Phishing Guidance'],
    };
  }
  if (has(q, 'vpn')) {
    return {
      answer: 'A VPN is the right control to gate remote access services. Don\'t expose RDP/SSH directly to the internet.',
      severity: 'medium',
      recommendations: [
        'WireGuard for performance; OpenVPN for compatibility; Tailscale for ease.',
        'Combine VPN with MFA — a stolen VPN password alone shouldn\'t be enough.',
        'Log and alert on geographically improbable VPN connections.',
      ],
      sources: ['NSA Hardening Guide for VPNs'],
    };
  }
  if (has(q, 'patch', 'update', 'vulnerab')) {
    return {
      answer: 'Unpatched software is a top-3 cause of breaches. You need a defined patch SLA.',
      severity: 'high',
      recommendations: [
        'Critical CVEs: patch within 72 hours.',
        'High: within 7 days. Medium: within 30 days.',
        'Use a patch manager (WSUS, Intune, Ansible) — don\'t rely on users.',
      ],
      sources: ['CISA KEV Catalog', 'NIST 800-40'],
    };
  }
  if (has(q, 'mfa', '2fa', 'two factor')) {
    return {
      answer: 'MFA blocks ~99% of credential-stuffing attacks. It is the highest ROI control you can deploy.',
      severity: 'high',
      recommendations: [
        'Enforce MFA on email, VPN, admin panels, code repos, cloud consoles.',
        'Prefer app-based (Authy, Google Auth) or hardware keys (YubiKey) over SMS.',
        'Add conditional access: block legacy auth protocols.',
      ],
      sources: ['Microsoft "MFA blocks 99.9% of attacks" study'],
    };
  }
  if (has(q, 'firewall')) {
    return {
      answer: 'A firewall enforces what traffic is allowed in and out. Default policy must be DENY.',
      severity: 'medium',
      recommendations: [
        'Default-deny inbound; allow only what\'s needed.',
        'Egress filter outbound — block traffic to known malicious IPs.',
        'Segment the network: workstations should not see servers directly.',
      ],
      sources: ['NIST 800-41'],
    };
  }
  if (has(q, 'backup')) {
    return {
      answer: '3-2-1 rule: 3 copies, 2 different media, 1 offsite/offline. An online backup is not a backup against ransomware.',
      severity: 'high',
      recommendations: [
        'At least one backup must be immutable or air-gapped.',
        'Test restore at least quarterly — backups you haven\'t restored don\'t exist.',
        'Encrypt backups at rest and in transit.',
      ],
      sources: ['NIST 800-34'],
    };
  }

  // Default copilot response
  return {
    answer: 'I can advise on ports, ransomware, rogue devices, phishing, VPN, patching, MFA, firewalls, and backups. Try asking something like "port 3389 was detected on an unknown device, what should I do?"',
    severity: 'low',
    recommendations: [
      'Be specific: include ports, IPs, hostnames, or the suspicious behavior.',
      'I work best when you describe what you see in the scan.',
    ],
    sources: [],
  };
}

// =================================================================
//  CHATBOT — for the EMPLOYEE
// =================================================================
function askChatbot(question) {
  const q = lower(question);

  if (has(q, 'phish', 'phishing')) {
    return {
      answer: 'Phishing is when an attacker pretends to be someone you trust (a coworker, your bank, a delivery service) to trick you into giving up information or clicking a malicious link.',
      severity: 'medium',
      recommendations: [
        'Hover over links before clicking — does the URL match what you expect?',
        'Be suspicious of urgency: "act now or lose access" is a classic trick.',
        'Never enter your password from an emailed link. Type the URL yourself.',
        'When in doubt, ask IT — that\'s what we\'re here for.',
      ],
      sources: [],
    };
  }
  if (has(q, 'spot', 'how do i know', 'how to recognize', 'recognize')) {
    return {
      answer: 'Phishing emails usually have at least one of these tells:',
      severity: 'low',
      recommendations: [
        'A sender address that almost-but-not-quite matches a real one (admin@m1crosoft.com).',
        'Generic greetings ("Dear customer") or unexpected urgency.',
        'Spelling/grammar mistakes, or weirdly formal language.',
        'Attachments you didn\'t expect (especially .zip, .iso, .htm, or files asking you to "enable macros").',
        'Links that don\'t match the real website when you hover over them.',
      ],
      sources: [],
    };
  }
  if (has(q, 'click', 'clicked', 'i clicked')) {
    return {
      answer: 'If you think you clicked a phishing link or entered credentials — don\'t panic, but act fast.',
      severity: 'high',
      recommendations: [
        'Disconnect from Wi-Fi/network immediately.',
        'Tell IT right away — the faster they know, the smaller the damage.',
        'Change your password from a different device.',
        'Don\'t hide it. Reporting is treated as a help, not a mistake.',
      ],
      sources: [],
    };
  }
  if (has(q, 'password')) {
    return {
      answer: 'Strong passwords + a password manager + 2FA = 95% of personal security solved.',
      severity: 'low',
      recommendations: [
        'Use a password manager (Bitwarden, 1Password, KeePass) — let it generate long random passwords.',
        'Never reuse a password across sites. One leak shouldn\'t cascade.',
        'Turn on 2FA wherever it\'s offered, especially on email.',
        'A passphrase like "violet-ocean-stamp-rocket" is stronger than "P@ssw0rd!".',
      ],
      sources: [],
    };
  }
  if (has(q, '2fa', 'mfa', 'two factor', 'two-factor')) {
    return {
      answer: '2FA (two-factor authentication) means logging in needs two things: your password + a code from your phone. Even if someone steals your password, they can\'t log in.',
      severity: 'low',
      recommendations: [
        'Use an app (Google Authenticator, Authy, Microsoft Authenticator) instead of SMS when possible.',
        'Save your backup codes in your password manager.',
      ],
      sources: [],
    };
  }
  if (has(q, 'usb', 'flash drive')) {
    return {
      answer: 'An unknown USB stick can install malware in seconds. There\'s a real attack called "USB drop" where attackers leave infected sticks in parking lots.',
      severity: 'high',
      recommendations: [
        'Never plug a USB you didn\'t buy yourself into a work computer.',
        'Found one? Hand it to IT — don\'t even plug it in to "see who it belongs to".',
      ],
      sources: [],
    };
  }
  if (has(q, 'wifi', 'wi-fi', 'public network')) {
    return {
      answer: 'Public Wi-Fi (cafés, airports, hotels) can be spoofed. Anyone can set up a hotspot called "Free_Airport_WiFi".',
      severity: 'medium',
      recommendations: [
        'Use the company VPN whenever you\'re on a network you don\'t control.',
        'Avoid logging into work accounts on public Wi-Fi unless you\'re on the VPN.',
        'When in doubt, tether from your phone — your mobile data is safer than a random hotspot.',
      ],
      sources: [],
    };
  }
  if (has(q, 'urgent', 'ceo', 'boss', 'gift card', 'wire')) {
    return {
      answer: 'CEO fraud (Business Email Compromise) is when an attacker pretends to be your boss and asks you to do something urgent — usually buy gift cards or wire money. It looks real because it uses pressure and authority.',
      severity: 'high',
      recommendations: [
        'No real CEO will ever ask you to buy gift cards over email. That request alone = scam.',
        'If asked to wire money urgently, verify by calling the person on a phone number you already have. Not the one in the email.',
        'When unsure, forward to IT before acting.',
      ],
      sources: [],
    };
  }
  if (has(q, 'attachment', 'file', 'macro')) {
    return {
      answer: 'Attachments are how a lot of malware gets in. The dangerous ones often pretend to be invoices, CVs, or shipping receipts.',
      severity: 'medium',
      recommendations: [
        'Don\'t open attachments you weren\'t expecting, even from people you know.',
        'NEVER click "Enable Content" or "Enable Macros" in a Word/Excel file from email — that\'s a malware install button.',
        'Suspicious extensions: .zip, .iso, .htm, .scr, .exe, .js.',
      ],
      sources: [],
    };
  }
  if (has(q, 'report', 'how do i report')) {
    return {
      answer: 'Reporting suspected phishing is the most useful thing you can do for the company.',
      severity: 'low',
      recommendations: [
        'Forward the email to IT (or use the "Report Phishing" button if your email client has one).',
        'Don\'t delete it before reporting — IT needs the headers.',
        'Reporting is never a bother. False alarms are how the team learns the patterns.',
      ],
      sources: [],
    };
  }

  // Default chatbot answer
  return {
    answer: 'I can help you with phishing, suspicious emails, passwords, 2FA, USB sticks, public Wi-Fi, attachments, and what to do if you clicked something you shouldn\'t have. Try asking: "How do I spot a phishing email?"',
    severity: 'low',
    recommendations: [
      'Phishing — what it is and how to spot it',
      'Passwords & 2FA — how to set them up properly',
      'I clicked a bad link — what now?',
      'Suspicious attachment — should I open it?',
    ],
    sources: [],
  };
}

module.exports = { askCopilot, askChatbot };
