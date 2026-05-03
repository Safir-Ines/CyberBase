import React, { useEffect, useState } from 'react';
import { assetsAPI } from '../../utils/api';
import AnomalyBadge from '../../components/shared/AnomalyBadge';
import InfoBox from '../../components/shared/InfoBox';

const TYPES = ['server','workstation','laptop','mobile','iot','printer','router','firewall','switch','database','app','other'];
const CRITICALITIES = ['low','medium','high','critical'];

const empty = { name: '', type: 'workstation', criticality: 'medium', owner: '', ipAddress: '', macAddress: '', os: '', registered: true };

export default function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(empty);
  const [filter, setFilter] = useState('all');

  const load = () => assetsAPI.list().then(r => setAssets(r.data.assets)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (editingId) await assetsAPI.update(editingId, form);
    else await assetsAPI.create(form);
    setForm(empty); setEditingId(null); setShowForm(false); load();
  };
  const startEdit = (a) => { setForm({ name: a.name, type: a.type, criticality: a.criticality, owner: a.owner, ipAddress: a.ipAddress, macAddress: a.macAddress, os: a.os, registered: a.registered }); setEditingId(a._id); setShowForm(true); };
  const remove = async (id) => { if (window.confirm('Delete this asset?')) { await assetsAPI.remove(id); load(); } };

  const filtered = filter === 'all' ? assets : filter === 'flagged' ? assets.filter(a => a.flagged) : filter === 'shadow' ? assets.filter(a => !a.registered) : assets;

  return (
    <div style={{ padding: 28, animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-cyan)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>INVENTORY</p>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Asset Map</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{assets.length} assets · {assets.filter(a => a.flagged).length} flagged by AI · {assets.filter(a => !a.registered).length} unregistered</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingId(null); setForm(empty); setShowForm(!showForm); }}>+ Add Asset</button>
      </div>

      <InfoBox title="Anomaly badges">Each asset gets a 0–100 anomaly score (hover for reasons). Score &gt; 60 → flagged with red ⚠.</InfoBox>

      {showForm && (
        <form onSubmit={submit} className="card" style={{ marginTop: 16, marginBottom: 16, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
          <select value={form.criticality} onChange={e => setForm({...form, criticality: e.target.value})}>{CRITICALITIES.map(c => <option key={c}>{c}</option>)}</select>
          <input placeholder="Owner (e.g. IT Team)" value={form.owner} onChange={e => setForm({...form, owner: e.target.value})} />
          <input placeholder="IP Address" value={form.ipAddress} onChange={e => setForm({...form, ipAddress: e.target.value})} />
          <input placeholder="MAC Address" value={form.macAddress} onChange={e => setForm({...form, macAddress: e.target.value})} />
          <input placeholder="OS" value={form.os} onChange={e => setForm({...form, os: e.target.value})} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13 }}>
            <input type="checkbox" checked={form.registered} onChange={e => setForm({...form, registered: e.target.checked})} style={{ width: 'auto' }} />
            Registered (officially approved)
          </label>
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary">{editingId ? 'Save' : 'Create'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => { setShowForm(false); setEditingId(null); setForm(empty); }}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', gap: 8, margin: '16px 0 12px', flexWrap: 'wrap' }}>
        {['all', 'flagged', 'shadow'].map(k => (
          <button key={k} onClick={() => setFilter(k)} className={`btn ${filter === k ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: '6px 14px', fontSize: 12 }}>{k}</button>
        ))}
      </div>

      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(a => (
            <div key={a._id} className="card" style={{ padding: 12, borderLeft: a.flagged ? '3px solid var(--accent-red)' : '3px solid transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>{a.name}</strong>
                    <span className="badge badge-info">{a.type}</span>
                    <span className={`badge badge-${a.criticality}`}>{a.criticality}</span>
                    {!a.registered && <span className="badge badge-critical">SHADOW IT</span>}
                    <AnomalyBadge score={a.anomalyScore} reasons={a.anomalyReasons} />
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                    {a.ipAddress || '—'} · {a.macAddress || '—'} · {a.os || '—'} · owner: {a.owner}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 11 }} onClick={() => startEdit(a)}>Edit</button>
                  <button className="btn btn-danger" style={{ padding: '6px 10px', fontSize: 11 }} onClick={() => remove(a._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 20 }}>No assets match.</p>}
        </div>
      )}
    </div>
  );
}
