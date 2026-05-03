import React, { useEffect, useState } from 'react';
import { risksAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import InfoBox from '../../components/shared/InfoBox';

export default function RisksPage() {
  const { user } = useAuth();
  const isManager = user?.role === 'manager';
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', severity: 'medium', likelihood: 3, impact: 3 });

  const load = () => risksAPI.list().then(r => setRisks(r.data.risks)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await risksAPI.create({ ...form, likelihood: +form.likelihood, impact: +form.impact });
    setForm({ title: '', description: '', severity: 'medium', likelihood: 3, impact: 3 });
    setShowForm(false);
    load();
  };

  const updateStatus = async (id, status) => { await risksAPI.update(id, { status }); load(); };
  const remove = async (id) => { if (window.confirm('Delete this risk?')) { await risksAPI.remove(id); load(); } };

  return (
    <div style={{ padding: 28, animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-cyan)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>RISK MATRIX</p>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Risks</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{risks.length} risk(s) · network scans automatically open new ones for rogue devices.</p>
        </div>
        {isManager && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ New Risk</button>
        )}
      </div>

      {showForm && isManager && (
        <form onSubmit={create} className="card" style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <textarea placeholder="Description" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <select value={form.severity} onChange={e => setForm({...form, severity: e.target.value})}>
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
            </select>
            <input type="number" min={1} max={5} placeholder="Likelihood (1-5)" value={form.likelihood} onChange={e => setForm({...form, likelihood: e.target.value})} />
            <input type="number" min={1} max={5} placeholder="Impact (1-5)" value={form.impact} onChange={e => setForm({...form, impact: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary">Create</button>
        </form>
      )}

      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {risks.map(r => (
            <div key={r._id} className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span className={`badge badge-${r.severity}`}>{r.severity}</span>
                    <span className="badge badge-info" style={{ fontSize: 10 }}>{r.source}</span>
                    <span className={`badge badge-${r.status === 'resolved' ? 'low' : r.status === 'open' ? 'critical' : 'medium'}`}>{r.status}</span>
                    <strong style={{ fontSize: 14 }}>{r.title}</strong>
                  </div>
                  {r.description && <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{r.description}</p>}
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>L{r.likelihood} × I{r.impact} = score {r.likelihood * r.impact}</p>
                </div>
                {isManager && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {r.status !== 'mitigating' && <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 11 }} onClick={() => updateStatus(r._id, 'mitigating')}>Mitigate</button>}
                    {r.status !== 'resolved' && <button className="btn btn-success" style={{ padding: '6px 10px', fontSize: 11 }} onClick={() => updateStatus(r._id, 'resolved')}>Resolve</button>}
                    <button className="btn btn-danger" style={{ padding: '6px 10px', fontSize: 11 }} onClick={() => remove(r._id)}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {risks.length === 0 && (
            <InfoBox title="No risks yet" icon="✓" color="var(--accent-green)">
              {isManager ? 'Click "+ New Risk" to add one, or run a network scan — rogue devices auto-create risks.' : 'No active risks.'}
            </InfoBox>
          )}
        </div>
      )}
    </div>
  );
}
