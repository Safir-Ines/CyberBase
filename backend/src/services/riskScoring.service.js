/**
 * riskScoring.service.js
 *
 * Scores an employee security-awareness survey response.
 * Returns { riskScore: 0-100, isSuspicious: bool, redFlags: [reasons] }.
 *
 * Higher = riskier user. >= 60 → flagged as suspicious.
 *
 * The questionnaire is the same for every employee. Each question has a
 * `riskWeight` for its "wrong" answer. Some answers also push the user
 * into "suspicious" territory (concrete behavioral red flags).
 */

const QUESTIONS = [
  {
    id: 'q1',
    text: 'A coworker emails you a link asking for your login. What do you do?',
    options: [
      { value: 'click',  label: 'Click and log in to verify',                  risk: 30, redFlag: 'Would log in via emailed link (phishing-prone).' },
      { value: 'reply',  label: 'Reply asking what it\'s for',                 risk: 15 },
      { value: 'verify', label: 'Verify with the coworker through another channel', risk: 0 },
      { value: 'report', label: 'Report it to IT and don\'t click',            risk: 0 },
    ],
  },
  {
    id: 'q2',
    text: 'How often do you reuse the same password across services?',
    options: [
      { value: 'always',    label: 'Always — easier to remember', risk: 30, redFlag: 'Reuses passwords across services.' },
      { value: 'sometimes', label: 'Sometimes',                    risk: 18 },
      { value: 'rarely',    label: 'Rarely',                       risk: 6 },
      { value: 'never',     label: 'Never — I use a password manager', risk: 0 },
    ],
  },
  {
    id: 'q3',
    text: 'You receive an unexpected USB stick in the mail. Do you plug it into your work computer?',
    options: [
      { value: 'yes',       label: 'Yes, to see what\'s on it',         risk: 35, redFlag: 'Would plug an unknown USB into work device.' },
      { value: 'home',      label: 'Plug it into my home computer first', risk: 25, redFlag: 'Would plug an unknown USB anywhere.' },
      { value: 'no',        label: 'No, hand it to IT',                  risk: 0 },
      { value: 'destroy',   label: 'Destroy it without plugging in',     risk: 0 },
    ],
  },
  {
    id: 'q4',
    text: 'Has anyone ever asked you to share your password (even your manager)?',
    options: [
      { value: 'shared',    label: 'Yes, and I shared it',           risk: 35, redFlag: 'Has shared credentials in the past.' },
      { value: 'asked',     label: 'Yes, but I refused',             risk: 5 },
      { value: 'no',        label: 'No',                             risk: 0 },
    ],
  },
  {
    id: 'q5',
    text: 'How quickly do you install OS / software security updates?',
    options: [
      { value: 'never',     label: 'I postpone them indefinitely',   risk: 25, redFlag: 'Ignores security updates.' },
      { value: 'months',    label: 'After a few months',             risk: 18 },
      { value: 'weeks',     label: 'Within a couple of weeks',       risk: 8 },
      { value: 'asap',      label: 'As soon as they\'re released',   risk: 0 },
    ],
  },
  {
    id: 'q6',
    text: 'Do you use 2FA (two-factor authentication) on your work accounts?',
    options: [
      { value: 'no',        label: 'No, I find it annoying',         risk: 25, redFlag: 'No 2FA enabled on work accounts.' },
      { value: 'some',      label: 'On some accounts',               risk: 12 },
      { value: 'all',       label: 'On all accounts',                risk: 0 },
    ],
  },
  {
    id: 'q7',
    text: 'You connect your work laptop to public Wi-Fi (cafés, airports). How often?',
    options: [
      { value: 'always',    label: 'Frequently, without VPN',        risk: 28, redFlag: 'Uses public Wi-Fi without VPN.' },
      { value: 'vpn',       label: 'Sometimes, but always via VPN',  risk: 5 },
      { value: 'never',     label: 'Never',                          risk: 0 },
    ],
  },
  {
    id: 'q8',
    text: 'You spot a suspicious email from "the CEO" asking you to wire money urgently. What do you do?',
    options: [
      { value: 'wire',      label: 'Wire it — they said it\'s urgent', risk: 40, redFlag: 'Vulnerable to CEO/BEC fraud.' },
      { value: 'reply',     label: 'Reply asking for confirmation',    risk: 18 },
      { value: 'call',      label: 'Call the CEO directly to verify',  risk: 0 },
      { value: 'report',    label: 'Forward to IT/security team',      risk: 0 },
    ],
  },
];

// Maximum theoretical risk if every "worst" answer is selected
const MAX_RISK = QUESTIONS.reduce((s, q) => s + Math.max(...q.options.map(o => o.risk)), 0);

function scoreResponse(answers) {
  let raw = 0;
  const redFlags = [];

  QUESTIONS.forEach(q => {
    const chosen = answers?.[q.id];
    if (!chosen) return;
    const opt = q.options.find(o => o.value === chosen);
    if (!opt) return;
    raw += opt.risk;
    if (opt.redFlag) redFlags.push(opt.redFlag);
  });

  const riskScore = Math.round((raw / MAX_RISK) * 100);
  const isSuspicious = riskScore >= 60 || redFlags.length >= 3;

  return { riskScore, isSuspicious, redFlags };
}

function getQuestions() {
  // Strip the risk weight before sending to client
  return QUESTIONS.map(q => ({
    id: q.id,
    text: q.text,
    options: q.options.map(o => ({ value: o.value, label: o.label })),
  }));
}

module.exports = { QUESTIONS, getQuestions, scoreResponse };
