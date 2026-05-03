import React, { useState, useRef, useEffect } from 'react';
import { chatbotAPI } from '../../utils/api';

const SEV_COLORS = { critical: 'var(--accent-red)', high: 'var(--accent-orange)', medium: 'var(--accent-yellow)', low: 'var(--accent-green)' };
const SUGGESTIONS = [
  'How do I spot a phishing email?',
  'What do I do if I clicked a bad link?',
  'Is it OK to plug in a USB I found?',
  'My boss emailed asking for gift cards — is this real?',
  'How should I create strong passwords?',
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { from: 'ai', payload: { answer: 'Hi! I\'m here to help you stay safe online. Ask me anything about phishing, suspicious emails, passwords, or what to do if something feels wrong. Try one of these to start:', severity: 'low', recommendations: SUGGESTIONS } }
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
      const r = await chatbotAPI.ask(q);
      setMessages(m => [...m, { from: 'ai', payload: r.data }]);
    } catch {
      setMessages(m => [...m, { from: 'ai', payload: { answer: 'Hmm, something went wrong. Try again?', severity: 'low', recommendations: [] } }]);
    } finally { setLoading(false); }
  };

  const onKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <div style={{ padding: 28, height: '100vh', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.4s ease', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-cyan)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>SECURITY HELP</p>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>✦ Phishing Help</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Confidential. Ask anything — there are no dumb questions when it comes to security.</p>
      </div>

      <div className="card" style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map((m, i) => (
          m.from === 'user' ? (
            <div key={i} style={{ alignSelf: 'flex-end', maxWidth: '80%', background: 'var(--accent-green-dim)', border: '1px solid rgba(0,255,148,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 14 }}>
              {m.text}
            </div>
          ) : (
            <div key={i} style={{ alignSelf: 'flex-start', maxWidth: '90%', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 14, borderLeft: `3px solid ${SEV_COLORS[m.payload.severity] || 'var(--accent-cyan)'}` }}>
              <p style={{ fontSize: 14, marginBottom: m.payload.recommendations?.length ? 10 : 0, lineHeight: 1.6 }}>{m.payload.answer}</p>
              {m.payload.recommendations?.length > 0 && (
                <ul style={{ marginLeft: 18, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}>
                  {m.payload.recommendations.map((r, j) => (
                    <li key={j} style={{ cursor: i === 0 ? 'pointer' : 'default', color: i === 0 ? 'var(--accent-cyan)' : 'inherit' }}
                        onClick={() => i === 0 && send(r)}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          )
        ))}
        {loading && <div style={{ alignSelf: 'flex-start', color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: 13 }}>Thinking...</div>}
        <div ref={endRef} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKeyDown} placeholder="Ask anything about security..." />
        <button className="btn btn-primary" onClick={() => send()} disabled={loading || !input.trim()}>Send →</button>
      </div>
    </div>
  );
}
