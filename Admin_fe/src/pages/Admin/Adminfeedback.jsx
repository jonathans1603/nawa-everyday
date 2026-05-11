import { useState, useEffect } from 'react';
 
const API = 'http://localhost:5000/api';
 
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};
 
export default function AdminFeedback() {
  const [items, setItems]       = useState([]);
  const [filter, setFilter]     = useState('Semua');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [msg, setMsg]           = useState(null);
 
  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };
 
  // ── Fetch semua feedback dari DB ──
  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/feedback`);
      const data = await res.json();
      const formatted = data.map(f => ({
        id:     f.id_form,
        name:   f.nama_customer,
        table:  `Meja ${f.no_meja}`,
        kritik: f.Kritik || '-',
        saran:  f.Saran  || '-',
        date:   formatDate(f.submited_time),
        // Ambil status langsung dari kolom is_read di DB
        status: f.is_read === 1 ? 'Dibaca' : 'Belum Dibaca',
      }));
      setItems(formatted);
    } catch {
      showMsg('error', 'Gagal memuat data feedback');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { fetchFeedback(); }, []);
 
  // ── Tandai satu feedback dibaca (simpan ke DB) ──
  const markRead = async (id) => {
    try {
      const res = await fetch(`${API}/feedback/${id}/read`, { method: 'PATCH' });
      if (res.ok) {
        setItems(prev => prev.map(f => f.id === id ? { ...f, status: 'Dibaca' } : f));
        // Update selected panel jika sedang terbuka
        setSelected(prev => prev?.id === id ? { ...prev, status: 'Dibaca' } : prev);
      } else {
        showMsg('error', 'Gagal menandai feedback');
      }
    } catch {
      showMsg('error', 'Gagal menandai feedback');
    }
  };
 
  // ── Tandai semua dibaca (simpan ke DB) ──
  const markAllRead = async () => {
    try {
      const res = await fetch(`${API}/feedback/read-all`, { method: 'PATCH' });
      if (res.ok) {
        setItems(prev => prev.map(f => ({ ...f, status: 'Dibaca' })));
        setSelected(prev => prev ? { ...prev, status: 'Dibaca' } : null);
      } else {
        showMsg('error', 'Gagal menandai semua feedback');
      }
    } catch {
      showMsg('error', 'Gagal menandai semua feedback');
    }
  };
 
  // ── Hapus feedback ──
  const deleteF = async (id) => {
    if (!window.confirm('Hapus feedback ini?')) return;
    try {
      const res = await fetch(`${API}/feedback/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMsg('success', 'Feedback berhasil dihapus');
        setItems(prev => prev.filter(f => f.id !== id));
        if (selected?.id === id) setSelected(null);
      }
    } catch {
      showMsg('error', 'Gagal menghapus feedback');
    }
  };
 
  // ── Filter ──
  const filterOptions = ['Semua', 'Belum Dibaca', 'Dibaca'];
  const filtered = filter === 'Semua' ? items : items.filter(f => f.status === filter);
 
  // ── Stats ──
  const unread = items.filter(f => f.status === 'Belum Dibaca').length;
 
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
 
      {/* ── Notifikasi ── */}
      {msg && (
        <div style={{
          padding: '12px 18px', borderRadius: '10px', fontSize: '14px',
          background: msg.type === 'success' ? '#d4edda' : '#f8d7da',
          color:      msg.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${msg.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
        }}>
          {msg.type === 'success' ? '✅ ' : '❌ '}{msg.text}
        </div>
      )}
 
      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        {[
          { icon: '💬', num: items.length,                                        label: 'Total Feedback'  },
          { icon: '🔔', num: unread,                                               label: 'Belum Dibaca'    },
          { icon: '✅', num: items.filter(f => f.status === 'Dibaca').length,      label: 'Sudah Dibaca'    },
          { icon: '📅', num: items.filter(f => {
              if (!f.date || f.date === '-') return false;
              const today = new Date().toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' });
              return f.date.startsWith(today.split(',')[0]);
            }).length,                                                              label: 'Masuk Hari Ini'  },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
 
      {/* ── Filter tabs ── */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {filterOptions.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: '6px 16px', borderRadius: '20px', border: '1.5px solid',
            borderColor: filter === c ? '#6B7C4A' : 'rgba(200,185,122,0.4)',
            background:  filter === c ? '#6B7C4A' : 'rgba(255,254,245,0.8)',
            color:       filter === c ? '#f0ebd0' : '#5a4a30',
            fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}>{c}</button>
        ))}
      </div>
 
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: '20px' }}>
 
        {/* ── Tabel Feedback ── */}
        <div className="section-box">
          <div className="section-box-header">
            <span className="section-box-title">
              Feedback Pelanggan ({filtered.length})
            </span>
            <button className="action-btn action-btn-view" onClick={markAllRead}>
              ✓ Tandai Semua Dibaca
            </button>
          </div>
 
          {loading ? (
            <p style={{ padding: '30px', textAlign: 'center', color: '#9a8070' }}>Memuat data...</p>
          ) : filtered.length === 0 ? (
            <p style={{ padding: '30px', textAlign: 'center', color: '#9a8070' }}>Belum ada feedback masuk.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pelanggan</th>
                  <th>Meja</th>
                  <th>Kritik</th>
                  <th>Saran</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(f => (
                  <tr
                    key={f.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelected(selected?.id === f.id ? null : f)}
                  >
                    <td>
                      <div style={{ fontWeight: 600, color: '#3d2b1f' }}>{f.name}</div>
                      <div style={{ fontSize: '11px', color: '#a89060' }}>{f.date}</div>
                    </td>
                    <td style={{ fontSize: '12px' }}>{f.table}</td>
                    <td style={{ fontSize: '12px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {f.kritik}
                    </td>
                    <td style={{ fontSize: '12px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {f.saran}
                    </td>
                    <td>
                      <span className={`badge ${f.status === 'Dibaca' ? 'badge-green' : 'badge-yellow'}`}>
                        {f.status}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {f.status !== 'Dibaca' && (
                          <button className="action-btn action-btn-view" onClick={() => markRead(f.id)}>✓</button>
                        )}
                        <button className="action-btn action-btn-del" onClick={() => deleteF(f.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
 
        {/* ── Detail Panel ── */}
        {selected && (
          <div className="section-box" style={{ height: 'fit-content' }}>
            <div className="section-box-header">
              <span className="section-box-title">Detail Feedback</span>
              <button
                onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#7a6848' }}
              >✕</button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
 
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: '#e8dfc0', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.4rem',
                }}>😊</div>
                <div>
                  <p style={{ fontWeight: 700, color: '#3d2b1f', margin: '0 0 2px', fontFamily: "'Playfair Display', serif" }}>
                    {selected.name}
                  </p>
                  <p style={{ fontSize: '12px', color: '#7a6848', margin: 0 }}>
                    {selected.table} · {selected.date}
                  </p>
                </div>
              </div>
 
              <div>
                <span className={`badge ${selected.status === 'Dibaca' ? 'badge-green' : 'badge-yellow'}`}>
                  {selected.status}
                </span>
              </div>
 
              <div>
                <p style={{ fontSize: '11px', color: '#a89060', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kritik</p>
                <div style={{
                  background: '#f5f0e0', borderRadius: '10px', padding: '14px',
                  fontSize: '14px', color: '#3d2b1f', lineHeight: 1.6,
                  fontStyle: 'italic', borderLeft: '3px solid #ef4444',
                }}>
                  "{selected.kritik}"
                </div>
              </div>
 
              <div>
                <p style={{ fontSize: '11px', color: '#a89060', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Saran</p>
                <div style={{
                  background: '#f5f0e0', borderRadius: '10px', padding: '14px',
                  fontSize: '14px', color: '#3d2b1f', lineHeight: 1.6,
                  fontStyle: 'italic', borderLeft: '3px solid #6B7C4A',
                }}>
                  "{selected.saran}"
                </div>
              </div>
 
              {selected.status !== 'Dibaca' && (
                <button
                  className="primary-btn"
                  style={{ width: '100%' }}
                  onClick={() => markRead(selected.id)}
                >
                  ✓ Tandai Sudah Dibaca
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}