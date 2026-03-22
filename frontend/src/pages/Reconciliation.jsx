import React, { useEffect, useState } from 'react';
import { getReconciliation, addReconciliation, getReconciliationSummary } from '../api';

const DEMO = [
  { reconciliation_id: 1, transaction_id: 101, match_status: 'MATCHED',   remarks: 'All records match' },
  { reconciliation_id: 2, transaction_id: 102, match_status: 'UNMATCHED', remarks: 'Bank status FAILED, gateway shows SUCCESS' },
  { reconciliation_id: 3, transaction_id: 103, match_status: 'MATCHED',   remarks: 'All records match' },
  { reconciliation_id: 4, transaction_id: 104, match_status: 'UNMATCHED', remarks: 'Amount mismatch in merchant record' },
  { reconciliation_id: 5, transaction_id: 105, match_status: 'MATCHED',   remarks: 'All records match' },
  { reconciliation_id: 6, transaction_id: 106, match_status: 'UNMATCHED', remarks: 'Merchant record missing' },
];

export default function Reconciliation() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('ALL');
  const [modalOpen, setModal] = useState(false);
  const [form, setForm]       = useState({ reconciliation_id: '', transaction_id: '', match_status: 'MATCHED', remarks: '' });
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState(null);

  const load = () => {
    setLoading(true);
    getReconciliation().then(r => setData(r.data)).catch(() => setData(DEMO)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = filter === 'ALL' ? data : data.filter(r => r.match_status === filter);
  const matched   = data.filter(r => r.match_status === 'MATCHED').length;
  const unmatched = data.filter(r => r.match_status === 'UNMATCHED').length;
  const matchRate = data.length ? ((matched / data.length) * 100).toFixed(1) : '0';

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      await addReconciliation(form);
      setMsg({ type: 'success', text: 'Record added!' });
      setModal(false); load();
    } catch { setMsg({ type: 'error', text: 'Failed. Check backend.' }); }
    finally { setSaving(false); setTimeout(() => setMsg(null), 3000); }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:800 }}>Reconciliation</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:13, marginTop:4 }}>Compare records across bank, gateway and merchant</p>
        </div>
        <button onClick={() => setModal(true)} style={{ padding:'9px 18px', background:'var(--accent-purple)', color:'#fff', border:'none', borderRadius:'var(--radius-sm)', fontWeight:700, fontSize:13, cursor:'pointer' }}>
          + Add Record
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        {[
          { label:'Match Rate',  value:`${matchRate}%`, color:'var(--accent-cyan)',   icon:'◈' },
          { label:'Matched',     value:matched,          color:'var(--accent-green)',  icon:'✓' },
          { label:'Unmatched',   value:unmatched,        color:'var(--accent-red)',    icon:'✗' },
        ].map(card => (
          <div key={card.label} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'20px 22px', position:'relative', overflow:'hidden' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <span style={{ color:card.color, fontSize:18 }}>{card.icon}</span>
              <span style={{ fontSize:11, fontWeight:600, letterSpacing:'0.08em', color:'var(--text-secondary)', textTransform:'uppercase' }}>{card.label}</span>
            </div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:800, color:card.color }}>{card.value}</div>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:card.color, opacity:0.5 }} />
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'16px 20px', marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
          <span style={{ color:'var(--text-secondary)', fontSize:12 }}>Reconciliation Progress</span>
          <span style={{ color:'var(--accent-cyan)', fontFamily:'var(--font-mono)', fontSize:13, fontWeight:600 }}>{matchRate}% matched</span>
        </div>
        <div style={{ height:6, background:'var(--border)', borderRadius:3, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${matchRate}%`, background:'linear-gradient(90deg, var(--accent-cyan), var(--accent-green))', borderRadius:3, transition:'width 0.6s ease' }} />
        </div>
      </div>

      {/* Message */}
      {msg && (
        <div style={{ padding:'10px 16px', borderRadius:'var(--radius-sm)', border:'1px solid', background:'var(--bg-card)', marginBottom:16, fontSize:13, borderColor: msg.type==='success'?'var(--accent-green)':'var(--accent-red)', color: msg.type==='success'?'var(--accent-green)':'var(--accent-red)' }}>
          {msg.text}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:16 }}>
        {['ALL','MATCHED','UNMATCHED'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding:'7px 14px', background: filter===s?'rgba(168,85,247,0.1)':'none', border:`1px solid ${filter===s?'var(--accent-purple)':'var(--border)'}`, color: filter===s?'var(--accent-purple)':'var(--text-muted)', borderRadius:'var(--radius-sm)', fontSize:11, fontWeight:600, letterSpacing:'0.06em', cursor:'pointer' }}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ color:'var(--text-muted)', textAlign:'center', padding:48, fontStyle:'italic' }}>Loading records...</div>
      ) : (
        <div style={{ overflowX:'auto', borderRadius:'var(--radius-md)', border:'1px solid var(--border)' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Recon ID','Txn ID','Match Status','Remarks'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', background:'var(--bg-secondary)', borderBottom:'1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} style={{ padding:48, textAlign:'center', color:'var(--text-muted)', background:'var(--bg-card)', fontStyle:'italic' }}>No records found</td></tr>
              ) : filtered.map((row, i) => (
                <tr key={i} style={{ borderBottom:'1px solid var(--border)' }}>
                  <td style={{ padding:'13px 16px', fontFamily:'var(--font-mono)', background:'var(--bg-card)', color:'var(--accent-purple)' }}>#{row.reconciliation_id}</td>
                  <td style={{ padding:'13px 16px', fontFamily:'var(--font-mono)', background:'var(--bg-card)', color:'var(--accent-cyan)' }}>#{row.transaction_id}</td>
                  <td style={{ padding:'13px 16px', background:'var(--bg-card)' }}>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, letterSpacing:'0.06em', color: row.match_status==='MATCHED'?'var(--accent-green)':'var(--accent-red)', background: row.match_status==='MATCHED'?'rgba(0,255,136,0.1)':'rgba(255,71,87,0.1)' }}>
                      <span style={{ width:5, height:5, borderRadius:'50%', background: row.match_status==='MATCHED'?'var(--accent-green)':'var(--accent-red)', flexShrink:0 }} />
                      {row.match_status}
                    </span>
                  </td>
                  <td style={{ padding:'13px 16px', fontFamily:'var(--font-body)', background:'var(--bg-card)', color:'var(--text-secondary)', fontSize:13 }}>{row.remarks || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(4,8,16,0.85)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }} onClick={() => setModal(false)}>
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-bright)', borderRadius:'var(--radius-lg)', width:'100%', maxWidth:520, boxShadow:'0 20px 60px rgba(0,0,0,0.6)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 24px', borderBottom:'1px solid var(--border)' }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:700, color:'var(--accent-purple)' }}>Add Reconciliation Record</h2>
              <button onClick={() => setModal(false)} style={{ background:'none', border:'1px solid var(--border)', color:'var(--text-secondary)', width:28, height:28, borderRadius:'var(--radius-sm)', cursor:'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding:24 }}>
              {[
                { label:'Reconciliation ID', name:'reconciliation_id' },
                { label:'Transaction ID',    name:'transaction_id' },
                { label:'Remarks',           name:'remarks' },
              ].map(f => (
                <div key={f.name} style={{ marginBottom:16 }}>
                  <label style={{ display:'block', fontSize:11, fontWeight:600, letterSpacing:'0.07em', textTransform:'uppercase', color:'var(--text-secondary)', marginBottom:6 }}>{f.label}</label>
                  <input name={f.name} value={form[f.name]} onChange={handleChange} style={{ width:'100%', padding:'10px 12px', background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', color:'var(--text-primary)', fontSize:13, fontFamily:'var(--font-mono)', outline:'none', boxSizing:'border-box' }} />
                </div>
              ))}
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, letterSpacing:'0.07em', textTransform:'uppercase', color:'var(--text-secondary)', marginBottom:6 }}>Match Status</label>
                <select name="match_status" value={form.match_status} onChange={handleChange} style={{ width:'100%', padding:'10px 12px', background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', color:'var(--text-primary)', fontSize:13, outline:'none' }}>
                  <option value="MATCHED">MATCHED</option>
                  <option value="UNMATCHED">UNMATCHED</option>
                </select>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button type="submit" disabled={saving} style={{ flex:1, padding:11, background:'var(--accent-purple)', color:'#fff', border:'none', borderRadius:'var(--radius-sm)', fontWeight:700, fontSize:13, cursor:'pointer' }}>{saving?'Saving...':'Save Record'}</button>
                <button type="button" onClick={() => setModal(false)} style={{ padding:'11px 20px', background:'none', border:'1px solid var(--border)', color:'var(--text-secondary)', borderRadius:'var(--radius-sm)', fontSize:13, cursor:'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}