import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.jpg';
 
const API_URL = import.meta.env.VITE_API_URL || 'https://nawa-everyday-production.up.railway.app/api';
 
const STATUS_CONFIG = {
  Pending:    { label: 'Pending',    bg: '#fff3cd', color: '#856404', border: '#ffc107', icon: '🔔' },
  Diproses:   { label: 'Diproses',   bg: '#cfe2ff', color: '#084298', border: '#0d6efd', icon: '🔄' },
  Selesai:    { label: 'Selesai',    bg: '#d1e7dd', color: '#0a3622', border: '#198754', icon: '✅' },
  Dibatalkan: { label: 'Dibatalkan', bg: '#f8d7da', color: '#842029', border: '#dc3545', icon: '❌' },
};
 
function formatRupiah(num) { return 'Rp ' + Number(num).toLocaleString('id-ID'); }
function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 60000);
  if (diff < 1)  return 'baru saja';
  if (diff < 60) return `${diff} mnt lalu`;
  return `${Math.floor(diff/60)} jam lalu`;
}
 
// ── Komponen baris item dengan adds-on ──
function OrderItemsCell({ summary }) {
  // summary format dari backend: "Nasi Goreng x2, Kopi Susu x1"
  // adds_on tersimpan per item di order_items.adds_on
  if (!summary) return <span style={{ color: '#c0b898' }}>—</span>;
 
  // Pisahkan per item (dipisah koma)
  const items = summary.split(', ');
  return (
    <div style={{ maxWidth: '320px' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: i < items.length - 1 ? '4px' : 0 }}>
          <span style={{ fontSize: '13px', color: '#3d2b1f', fontWeight: '500' }}>🍽️ {item}</span>
        </div>
      ))}
    </div>
  );
}
 
export default function KasirDashboard() {
  const [orders, setOrders]         = useState([]);
  const [filter, setFilter]         = useState('Semua');
  const [user, setUser]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [clock, setClock]           = useState(new Date());
  const [toast, setToast]           = useState(null);
  const [expandedId, setExpandedId] = useState(null); // untuk expand detail
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
 
  useEffect(() => {
    const stored = sessionStorage.getItem('nawa_user');
    if (!stored) { navigate('/login', { replace: true }); return; }
    try {
      const u = JSON.parse(stored);
      if (u?.role?.toLowerCase() !== 'kasir') { navigate('/login', { replace: true }); return; }
      setUser(u);
    } catch { sessionStorage.removeItem('nawa_user'); navigate('/login', { replace: true }); }
  }, [navigate]);
 
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
 
  useEffect(() => {
    fetchOrders();
    const poll = setInterval(fetchOrders, 15000);
    return () => clearInterval(poll);
  }, []);
 
  async function fetchOrders() {
    try {
      const res = await fetch(`${API_URL}/api/orders`);
      if (!res.ok) throw new Error();
      setOrders(await res.json());
    } catch { setOrders([]); }
    finally { setLoading(false); }
  }
 
  async function updateStatus(id, newStatus, payment_method) {
    setOrders(prev => prev.map(o => o.order_id === id ? { ...o, status: newStatus } : o));
    showToast(`Order #${id} → ${newStatus}`);
    try {
      await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, payment_method: payment_method || null }),
      });
    } catch { /* silent */ }
  }
 
  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }
  const handleLogout = () => { setShowLogoutModal(true); };
  const confirmLogout = () => { sessionStorage.removeItem('nawa_user'); navigate('/login', { replace: true }); };
  const filtered = filter === 'Semua' ? orders : orders.filter(o => o.status === filter);
 
  const counts = {
    Semua:      orders.length,
    Pending:    orders.filter(o => o.status === 'Pending').length,
    Diproses:   orders.filter(o => o.status === 'Diproses').length,
    Selesai:    orders.filter(o => o.status === 'Selesai').length,
    Dibatalkan: orders.filter(o => o.status === 'Dibatalkan').length,
  };
 
  const totalRevenue = orders.filter(o => o.status === 'Selesai').reduce((s, o) => s + Number(o.total || 0), 0);
 
  if (!user) return null;
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes toastIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:.3}}
        .kasir-layout{display:flex;flex-direction:column;min-height:100vh;background:#f0ead8}
        .kasir-header{background:linear-gradient(135deg,#fffef5,#f0ead8);padding:14px 32px;display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid rgba(200,185,122,.4);box-shadow:0 2px 16px rgba(61,43,31,.1)}
        .kasir-brand{display:flex;align-items:center;gap:12px}
        .kasir-logo{width:70px;height:70px;background:#C4D0A3;border:2px solid #c8b97a;border-radius:50%;overflow:hidden;}
        .kasir-title{font-family:'Playfair Display',serif;font-size:1.25rem;font-style:italic}
        .kasir-title em{color:#8B1A1A}.kasir-title span{color:#3d2b1f;font-style:normal}
        .kasir-clock{font-family:'Playfair Display',serif;font-size:1.5rem;color:#6B7C4A;letter-spacing:2px;font-weight:700}
        .logout-btn{display:flex;align-items:center;gap:7px;padding:8px 16px;border-radius:8px;border:none;background:rgba(220,38,38,.08);color:#dc2626;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s}
        .logout-btn:hover{background:rgba(220,38,38,.15)}
        .live-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block;animation:pulse-dot 1.5s infinite}
        .stats-bar{padding:16px 32px;display:flex;gap:16px;flex-wrap:wrap;background:#f8f3e8;border-bottom:1px solid rgba(200,185,122,.3)}
        .stat-card{background:#fff;border-radius:12px;padding:14px 20px;display:flex;align-items:center;gap:14px;box-shadow:0 2px 10px rgba(61,43,31,.07);border:1px solid rgba(200,185,122,.2);flex:1;min-width:160px;animation:fadeUp .4s ease both}
        .stat-icon-wrap{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0}
        .stat-num{font-size:1.5rem;font-weight:700;color:#3d2b1f;line-height:1}
        .stat-label{font-size:12px;color:#a89060;margin-top:3px}
        .filter-bar{background:#f8f3e8;padding:10px 32px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(200,185,122,.2)}
        .filter-btn{padding:6px 16px;border-radius:20px;border:1.5px solid rgba(200,185,122,.4);background:transparent;color:#a89060;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all .15s}
        .filter-btn:hover{border-color:#6B7C4A;color:#3d2b1f}
        .filter-btn.active{background:#6B7C4A;border-color:#6B7C4A;color:#fff}
        .filter-count{background:rgba(0,0,0,.1);border-radius:10px;padding:1px 7px;font-size:11px}
        .table-area{flex:1;padding:20px 32px;overflow-y:auto}
        .order-table-wrap{background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(61,43,31,.1);border:1px solid rgba(200,185,122,.25)}
        .order-table{width:100%;border-collapse:separate;border-spacing:0}
        .order-table thead th{background:#6B7C4A;color:#f0ebd0;padding:12px 18px;text-align:left;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase}
        .order-table tbody td{padding:12px 18px;font-size:13px;color:#3d2b1f;border-bottom:1px solid rgba(200,185,122,.15);vertical-align:top}
        .order-table tbody tr:last-child td{border-bottom:none}
        .order-table tbody tr{transition:background .15s;animation:fadeUp .3s ease both}
        .order-table tbody tr:hover td{background:rgba(107,124,74,.04)}
        .no-circle{width:28px;height:28px;border-radius:50%;background:#e8dfc0;color:#5a4a30;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700}
        .table-chip{display:inline-flex;align-items:center;gap:5px;background:#f0ead8;color:#5a4a30;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600}
        .time-text{font-size:12px;color:#7a6848}
        .total-text{font-weight:700;color:#6B7C4A;font-size:13px}
        .status-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;border:1.5px solid}
        .btn-ongoing{padding:5px 12px;border-radius:6px;border:none;background:#0d6efd;color:#fff;font-size:11px;font-weight:600;cursor:pointer;transition:all .15s}
        .btn-ongoing:hover{background:#0a58ca}
        .btn-cancel{padding:5px 10px;border-radius:6px;border:none;background:rgba(220,38,38,.1);color:#dc2626;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s}
        .btn-cancel:hover{background:rgba(220,38,38,.2)}
        .btn-done{padding:5px 12px;border-radius:6px;border:none;background:#d1d5db;color:#9ca3af;font-size:11px;font-weight:600;cursor:not-allowed}
        .addon-tag{display:inline-block;font-size:10px;padding:2px 7px;border-radius:20px;background:#e8f0da;color:#3d5a1a;font-weight:600;margin:2px 2px 0 0}
        .expand-btn{background:none;border:none;cursor:pointer;font-size:11px;color:#6B7C4A;font-weight:600;padding:2px 0;text-decoration:underline}
        .kasir-footer{background:#f8f3e8;padding:12px 32px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;border-top:1px solid rgba(200,185,122,.3)}
        .footer-item{font-size:12px;color:#7a6848;display:flex;align-items:center;gap:6px}
        .footer-item strong{color:#3d2b1f}
        .toast{position:fixed;bottom:28px;right:28px;background:#3d2b1f;color:#f0ebd0;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.2);animation:toastIn .3s ease;z-index:9999;display:flex;align-items:center;gap:8px}
        .empty-state{text-align:center;padding:60px 20px;color:#a89060}
        .empty-state div{font-size:2.5rem;margin-bottom:12px}
      `}</style>
 
      <div className="kasir-layout">
        <header className="kasir-header">
          <div className="kasir-brand">
            <div className="kasir-logo" style={{ padding: 0, overflow: 'hidden' }}>
              <img
                src={logoImg}
                alt="Nawa Logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            <div>
              <div className="kasir-title"><em>Kasir</em> <span>- Order Management</span></div>
              <div style={{ fontSize: '11px', color: '#a89060', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="live-dot" /> Auto-refresh setiap 15 detik
              </div>
            </div>
          </div>
          <div className="kasir-clock">{clock.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#3d2b1f' }}>{user.name || user.username}</div>
              <div style={{ fontSize: '11px', color: '#a89060', textTransform: 'uppercase', letterSpacing: '1px' }}>Kasir</div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
          </div>
        </header>
 
        {/* STAT CARDS */}
        <div className="stats-bar">
          {[
            { icon: '📋', bg: '#fef3c7', num: counts.Semua,    label: 'Total Order' },
            { icon: '🔔', bg: '#fef9c3', num: counts.Pending,  label: 'Pending' },
            { icon: '🔄', bg: '#dbeafe', num: counts.Diproses, label: 'Diproses' },
            { icon: '✅', bg: '#d1fae5', num: counts.Selesai,  label: 'Selesai', extra: formatRupiah(totalRevenue) },
          ].map((s, i) => (
            <div className="stat-card" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="stat-icon-wrap" style={{ background: s.bg }}>{s.icon}</div>
              <div>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
                {s.extra && <div style={{ fontSize: '11px', color: '#6B7C4A', fontWeight: 700, marginTop: '2px' }}>{s.extra}</div>}
              </div>
            </div>
          ))}
        </div>
 
        {/* FILTER */}
        <div className="filter-bar">
          <span style={{ fontSize: '12px', color: '#a89060', fontWeight: 600, marginRight: '4px' }}>FILTER:</span>
          {['Semua', 'Pending', 'Diproses', 'Selesai'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'Pending' ? '🔔' : f === 'Diproses' ? '🔄' : f === 'Selesai' ? '✅' : '📋'} {f}
              <span className="filter-count">{counts[f] ?? orders.length}</span>
            </button>
          ))}
        </div>
 
        {/* TABLE */}
        <div className="table-area">
          <div className="order-table-wrap">
            {loading ? (
              <div className="empty-state"><div>⏳</div><p>Memuat data pesanan...</p></div>
            ) : filtered.length === 0 ? (
              <div className="empty-state"><div>📭</div><p>Tidak ada pesanan</p></div>
            ) : (
              <table className="order-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Menu & Add-on</th>
                    <th>Meja</th>
                    <th>Waktu</th>
                    <th>Total</th>
                    <th>Pembayaran</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o, i) => {
                    const st       = STATUS_CONFIG[o.status] || STATUS_CONFIG['Pending'];
                    const isExpand = expandedId === o.order_id;
                    return (
                      <tr key={o.order_id} style={{ animationDelay: `${i * 0.04}s` }}>
                        <td><span className="no-circle">{i + 1}</span></td>
 
                        {/* ✅ Kolom Menu + Add-on */}
                        <td>
                          <OrderItemsCell summary={o.items_summary} />
                          {/* Tombol lihat detail add-on jika ada */}
                          {o.items_summary && o.items_summary.includes('|') && (
                            <button className="expand-btn" onClick={() => setExpandedId(isExpand ? null : o.order_id)}>
                              {isExpand ? '▲ Sembunyikan' : '▼ Lihat add-on'}
                            </button>
                          )}
                          {/* Detail add-on per item saat expand */}
                          {isExpand && o.items_detail && (
                            <div style={{ marginTop: '8px', padding: '8px 10px', background: '#f8f4ec', borderRadius: '8px', border: '1px solid #e8dfc0' }}>
                              {o.items_detail.split('; ').map((detail, di) => (
                                <div key={di} style={{ fontSize: '11px', color: '#7a6652', marginBottom: '3px' }}>• {detail}</div>
                              ))}
                            </div>
                          )}
                        </td>
 
                        <td>
                          <span className="table-chip">🪑 {o.table_name || (o.table_number ? `Meja ${o.table_number}` : '—')}</span>
                        </td>
                        <td>
                          <div className="time-text">
                            <div>⏰ {o.created_at ? new Date(o.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '—'}</div>
                            <div style={{ fontSize: '11px', marginTop: '2px', color: '#c8a84b' }}>{o.created_at ? timeAgo(o.created_at) : ''}</div>
                          </div>
                        </td>
                        <td className="total-text">{o.total ? formatRupiah(o.total) : '—'}</td>
                        <td>{o.payment_method ? (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                            background: o.payment_method === 'Cash' ? '#d1fae5' : '#dbeafe',
                            color:      o.payment_method === 'Cash' ? '#065f46' : '#1e40af',
                            border: `1.5px solid ${o.payment_method === 'Cash' ? '#6ee7b7' : '#93c5fd'}`,
                          }}>
                            {o.payment_method === 'Cash' ? '💵' : '📱'} {o.payment_method}
                          </span>
                          ) : (
                          <span style={{ fontSize: '11px', color: '#c0b898' }}>—</span>
                          )}
                        </td>
                        <td>
                          <span className="status-badge" style={{ background: st.bg, color: st.color, borderColor: st.border }}>
                            {st.icon} {st.label}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            {o.status === 'Pending' && <>
                            <button className="btn-ongoing" onClick={() => updateStatus(o.order_id, 'Diproses', o.payment_method)}>
                              ✅ Konfirmasi Bayar
                            </button>
                            <button className="btn-cancel" onClick={() => updateStatus(o.order_id, 'Dibatalkan')}>✕</button>
                            </>}
                            {o.status === 'Diproses'   && <span style={{ fontSize: 12, color: '#084298' }}>🔄 Diproses Dapur...</span>}
                            {o.status === 'Selesai'    && <button className="btn-done" disabled>✔ Selesai</button>}
                            {o.status === 'Dibatalkan' && <span style={{ fontSize: 12, color: '#dc2626' }}>❌ Dibatalkan</span>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
 
        <footer className="kasir-footer">
          <div className="footer-item">📋 Total: <strong>{counts.Semua}</strong></div>
          <div className="footer-item">🔔 Pending: <strong>{counts.Pending}</strong></div>
          <div className="footer-item">🔄 Diproses: <strong>{counts.Diproses}</strong></div>
          <div className="footer-item">✅ Selesai: <strong>{counts.Selesai}</strong></div>
          <div style={{ marginLeft: 'auto' }} className="footer-item">
            💰 Pendapatan hari ini: <strong style={{ color: '#6B7C4A' }}>{formatRupiah(totalRevenue)}</strong>
          </div>
        </footer>
 
        
  {/* ── Modal Konfirmasi Logout ── */}
  {showLogoutModal && (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fffef5', borderRadius: '16px',
        padding: '32px 28px', maxWidth: '360px', width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        border: '1.5px solid rgba(200,185,122,0.4)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🚪</div>
        <h3 style={{
          fontFamily: "'Playfair Display', serif", fontSize: '18px',
          color: '#3d2b1f', margin: '0 0 8px',
        }}>Konfirmasi Logout</h3>
        <p style={{ fontSize: '13px', color: '#7a6848', margin: '0 0 24px', lineHeight: 1.6 }}>
          Apakah kamu yakin ingin keluar dari sesi ini?
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => setShowLogoutModal(false)}
            style={{
              padding: '10px 24px', borderRadius: '8px',
              border: '1.5px solid rgba(200,185,122,0.5)',
              background: '#f5f0e0', color: '#5a4a30',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#e8dfc0'}
            onMouseLeave={e => e.currentTarget.style.background = '#f5f0e0'}
          >
            Batal
          </button>
          <button
            onClick={confirmLogout}
            style={{
              padding: '10px 24px', borderRadius: '8px',
              border: 'none', background: '#dc2626', color: '#fff',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#b91c1c'}
            onMouseLeave={e => e.currentTarget.style.background = '#dc2626'}
          >
            Ya, Logout
          </button>
        </div>
      </div>
    </div>
  )}
 
        {toast && <div className="toast">✅ {toast}</div>}
      </div>
    </>
  );
}