import React, { useState, useRef, useEffect } from 'react';
import { copilotAPI } from '../../utils/api';
import InfoBox from '../../components/shared/InfoBox';

const SEV_COLORS = { critical: 'var(--accent-red)', high: 'var(--accent-orange)', medium: 'var(--accent-yellow)', low: 'var(--accent-green)' };
const SUGGESTIONS = [
  'Nmap detected an unknown device using port 3389, what should I do?',
  'How do I protect against ransomware?',
  'A rogue device appeared on the network — what now?',
  'Should I expose SSH on port 22?',
  'How fast should I patch critical vulnerabilities?',
];

export default function CopilotPage() {
  const [messages, setMessages] = useState([
    { from: 'ai', payload: { answer: 'Hi! I\'m the IT Copilot. Ask me about ports, ransomware, rogue devices, phishing, VPN, patching, MFA, firewalls, or backups. Try one of the suggestions below.', severity: 'low', recommendations: SUGGESTIONS, sources: [] } }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setMessages(m => [...m, { from: 'user', text: q }]);
    setInput(''); setLoading(true);
    try {
      const r = await copilotAPI.ask(q);
      setMessages(m => [...m, { from: 'ai', payload: r.data }]);
    } catch (e) {
      setMessages(m => [...m, { from: 'ai', payload: { answer: 'Something went wrong. Try again.', severity: 'low', recommendations: [], sources: [] } }]);
    } finally { setLoading(false); }
  };

  const onKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <div style={{ padding: 28, height: '100vh', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-cyan)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>ASSISTANT</p>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>✦ AI Copilot</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>IT-focused security advisor. Specific port numbers, IPs, and suspicious behavior get the most useful answers.</p>
      </div>

      <div className="card" style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map((m, i) => (
          m.from === 'user' ? (
            <div key={i} style={{ alignSelf: 'flex-end', maxWidth: '80%', background: 'var(--accent-cyan-dim)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 14 }}>
              {m.text}
            </div>
          ) : (
            <div key={i} style={{ alignSelf: 'flex-start', maxWidth: '90%', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 14, borderLeft: `3px solid ${SEV_COLORS[m.payload.severity] || 'var(--accent-cyan)'}` }}>
              <p style={{ fontSize: 14, marginBottom: m.payload.recommendations?.length ? 10 : 0 }}>{m.payload.answer}</p>
              {m.payload.recommendations?.length > 0 && (
                <ul style={{ marginLeft: 18, color: 'var(--text-secondary)', fontSize: 13 }}>
                  {m.payload.recommendations.map((r, j) => (
                    <li key={j} style={{ cursor: 'pointer', color: 'var(--accent-cyan)' }}
                        onClick={() => send(r)}>{r}</li>
                  ))}
                </ul>
              )}
              {m.payload.sources?.length > 0 && (
                <p style={{ marginTop: 8, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Sources: {m.payload.sources.join(' · ')}</p>
              )}
            </div>
          )
        ))}
        {loading && <div style={{ alignSelf: 'flex-start', color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: 13 }}>Copilot is thinking...</div>}
        <div ref={endRef} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKeyDown} placeholder="Ask about ports, ransomware, rogue devices..." />
        <button className="btn btn-primary" onClick={() => send()} disabled={loading || !input.trim()}>Send →</button>
      </div>
    </div>
  );
}
