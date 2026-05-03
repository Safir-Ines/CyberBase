import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { assessmentsAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import InfoBox from '../../components/shared/InfoBox';

export default function AssessmentPage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      assessmentsAPI.questions(),
      assessmentsAPI.myLatest().catch(() => ({ data: { response: null } })),
    ]).then(([q, l]) => {
      setQuestions(q.data.questions);
      setLatest(l.data.response);
    }).finally(() => setLoading(false));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer every question.'); return;
    }
    setSubmitting(true);
    try {
      const r = await assessmentsAPI.submit(answers);
      setResult(r.data);
    } finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  // After submit OR if already submitted, show result
  if (result || latest) {
    const r = result || latest;
    return (
      <div style={{ padding: 28, animation: 'fadeIn 0.4s ease', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-cyan)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>ASSESSMENT COMPLETE</p>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Hi {user?.name?.split(' ')[0]} — here's your security awareness score</h1>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: 32, borderColor: r.isSuspicious ? 'rgba(255,51,102,0.3)' : 'rgba(0,255,148,0.3)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>YOUR RISK SCORE</p>
          <p style={{ fontSize: 64, fontWeight: 800, fontFamily: 'var(--font-display)', color: r.riskScore >= 60 ? 'var(--accent-red)' : r.riskScore >= 30 ? 'var(--accent-orange)' : 'var(--accent-green)', lineHeight: 1, marginTop: 8 }}>{r.riskScore}<span style={{ fontSize: 24, color: 'var(--text-muted)' }}>/100</span></p>
          <p style={{ marginTop: 12, fontSize: 14, color: 'var(--text-secondary)' }}>
            {r.riskScore < 30 ? '✓ Strong security awareness. Keep it up!'
             : r.riskScore < 60 ? '⚠ Some habits to improve.'
             : '🚩 Several behaviors put the company at risk. Your IT Manager will reach out for training.'}
          </p>
        </div>

        {r.redFlags?.length > 0 && (
          <div className="card" style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 16, marginBottom: 10 }}>Things to work on</h3>
            <ul style={{ marginLeft: 18, color: 'var(--text-secondary)' }}>
              {r.redFlags.map((f, i) => <li key={i} style={{ marginBottom: 4 }}>⚠ {f}</li>)}
            </ul>
          </div>
        )}

        <InfoBox title="Need help?" icon="✦" color="var(--accent-cyan)">
          The phishing chatbot can answer any security question — try it: <Link to="/employee/chatbot" style={{ color: 'var(--accent-cyan)' }}>Open Phishing Help →</Link>
        </InfoBox>
      </div>
    );
  }

  return (
    <div style={{ padding: 28, animation: 'fadeIn 0.4s ease', maxWidth: 760, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-cyan)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>WELCOME · {user?.name?.split(' ')[0]}</p>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Security Awareness Assessment</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{questions.length} quick questions. Honest answers help your team protect the company.</p>
      </div>

      {/* Gamified Mission Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1923 0%, #1e293b 100%)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        border: '1px solid rgba(34,197,94,0.3)',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-20px', right: '-20px',
          width: '100px', height: '100px',
          background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ fontSize: '40px' }}>🎮</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#22c55e', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>TRAINING MISSION</div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px', color: '#fff' }}>New Mission Available: Phishing Attack</h3>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Complete this short interactive scenario to earn +150 XP and a new badge!</p>
        </div>
        <Link 
          to="/employee/training" 
          style={{
            background: '#22c55e', color: '#0f1923', padding: '10px 20px',
            borderRadius: '10px', textDecoration: 'none', fontWeight: '800',
            fontSize: '13px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(34,197,94,0.3)'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          START MISSION →
        </Link>
      </div>

      <InfoBox icon="ⓘ" color="var(--accent-purple)">
        Answers stay private. Your IT Manager only sees an overall risk score and any specific red flags — not which option you picked for each question.
      </InfoBox>

      <form onSubmit={submit} style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {questions.map((q, idx) => (
          <div key={q.id} className="card" style={{ padding: 18 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>QUESTION {idx + 1} / {questions.length}</p>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>{q.text}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.options.map(o => {
                const selected = answers[q.id] === o.value;
                return (
                  <label key={o.value} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    background: selected ? 'var(--accent-cyan-dim)' : 'var(--bg-elevated)',
                    border: `1px solid ${selected ? 'var(--accent-cyan)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                    <input type="radio" name={q.id} value={o.value} checked={selected}
                      onChange={() => setAnswers({...answers, [q.id]: o.value})}
                      style={{ width: 'auto', margin: 0 }} />
                    <span style={{ fontSize: 14 }}>{o.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        <button type="submit" className="btn btn-primary" style={{ padding: 14, justifyContent: 'center', fontSize: 15 }} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Assessment →'}
        </button>
      </form>
    </div>
  );
}
