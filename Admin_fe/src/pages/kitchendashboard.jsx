import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.jpg';
 
const API_URL = import.meta.env.VITE_API_URL || 'https://nawa-everyday-production.up.railway.app/api';
 
const statusStyle = {
  Baru:     { bg: '#fff3cd', color: '#856404', border: '#ffc107', icon: '🔔' },
  Diproses: { bg: '#cfe2ff', color: '#084298', border: '#0d6efd', icon: '🔥' },
  Selesai:  { bg: '#d1e7dd', color: '#0a3622', border: '#198754', icon: '✅' },
};
 
export default function KitchenDashboard() {
  const [orders, setOrders]   = useState([]);
  const [user, setUser]       = useState(null);
  const [filter, setFilter]   = useState('Semua');
  const [clock, setClock]     = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState(null);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
 
  useEffect(() => {
    const stored = sessionStorage.getItem('nawa_user');
    if (!stored) { navigate('/login', { replace: true }); return; }
    try {
      const u    = JSON.parse(stored);
      const role = u?.role?.toLowerCase() || '';
      if (!['kitchen', 'dapur'].includes(role)) { navigate('/login', { replace: true }); return; }
      setUser(u);
    } catch { sessionStorage.removeItem('nawa_user'); navigate('/login', { replace: true }); }
  }, [navigate]);
 
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
 
  useEffect(() => {
    fetchOrders();
    const poll = setInterval(fetchOrders, 10000);
    return () => clearInterval(poll);
  }, []);
 
  async function fetchOrders() {
    try {
      const res  = await fetch(`${API_URL}/api/orders/kitchen`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const formatted = data.map(o => ({
        ...o,
        id:         o.id || o.item_id,
        table_name: `Meja ${o.table_number}`,
        time:       o.created_at ? new Date(o.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--',
        status:     o.status || 'Baru',
        // ✅ adds_on sudah ada dari backend (field adds_on di order_items)
        addsOn:     o.adds_on || null,
      }));
      setOrders(formatted);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }
 
  async function nextStatus(id) {
    const current = orders.find(o => o.id === id);
    if (!current || current.status === 'Selesai') return;
 
    const newStatus = current.status === 'Baru' ? 'Diproses' : 'Selesai';
 
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    showToast(`Item #${id} → ${newStatus}`);
 
    try {
      await fetch(`${API_URL}/api/orders/kitchen/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status: newStatus }),
      });
 
      if (newStatus === 'Selesai') {
        const orderItems = orders.filter(o => o.order_id === current.order_id);
        const allDone    = orderItems.every(o => o.id === id ? true : o.status === 'Selesai');
        if (allDone) {
          await fetch(`${API_URL}/api/orders/${current.order_id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Selesai' }),
          });
        }
      }
    } catch { /* silent */ }
  }
 
  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }
  const handleLogout = () => { setShowLogoutModal(true); };
  const confirmLogout = () => { sessionStorage.removeItem('nawa_user'); navigate('/login', { replace: true }); };
 
  const filtered = filter === 'Semua' ? orders : orders.filter(o => o.status === filter);
  const counts = {
    Semua:    orders.length,
    Baru:     orders.filter(o => o.status === 'Baru').length,
    Diproses: orders.filter(o => o.status === 'Diproses').length,
    Selesai:  orders.filter(o => o.status === 'Selesai').length,
  };
 
  if (!user) return null;
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;background:#1a1a18}
        @keyframes slideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(255,193,7,.4)}70%{box-shadow:0 0 0 8px rgba(255,193,7,0)}100%{box-shadow:0 0 0 0 rgba(255,193,7,0)}}
        @keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes toastIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}
        .kitchen-layout{display:flex;flex-direction:column;min-height:100vh;background:#1a1a18}
        .kitchen-header{background:linear-gradient(135deg,#2a1f0f 0%,#3d2b1f 100%);padding:14px 32px;display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #c8a84b;box-shadow:0 4px 20px rgba(0,0,0,.4)}
        .kitchen-logo{display:flex;align-items:center;gap:12px}
        .kitchen-logo-icon {width: 70px; height: 70px; border-radius: 50%; background: #C4D0A3; border: 2px solid #c8a84b; overflow: hidden;}
        .kitchen-title{font-family:'Playfair Display',serif;font-size:1.3rem;font-style:italic;color:#c8a84b}
        .kitchen-title span{color:#f0ebd0;font-style:normal;font-size:1rem;font-family:'DM Sans',sans-serif;font-weight:400;display:block;margin-top:1px}
        .kitchen-clock{font-family:'Playfair Display',serif;font-size:1.6rem;color:#c8a84b;letter-spacing:2px}
        .logout-btn{display:flex;align-items:center;gap:8px;padding:8px 18px;border-radius:8px;border:none;background:rgba(239,68,68,.15);color:#fca5a5;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s}
        .logout-btn:hover{background:rgba(239,68,68,.3)}
        .live-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block;animation:pulse-dot 1.5s infinite}
        .filter-bar{background:#231c10;padding:12px 32px;display:flex;align-items:center;gap:10px}
        .filter-btn{padding:7px 16px;border-radius:20px;border:1.5px solid rgba(200,168,75,.2);background:transparent;color:rgba(240,235,208,.5);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:6px}
        .filter-btn:hover{border-color:rgba(200,168,75,.5);color:#f0ebd0}
        .filter-btn.active{background:#c8a84b;border-color:#c8a84b;color:#1a1a18}
        .filter-count{background:rgba(0,0,0,.2);border-radius:10px;padding:1px 7px;font-size:11px}
        .table-wrap{flex:1;padding:24px 32px;overflow-y:auto}
        .order-table{width:100%;border-collapse:separate;border-spacing:0;background:#fffef5;border-radius:14px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.35);border:1.5px solid rgba(200,168,75,.3)}
        .order-table thead th{background:#4a5c30;color:#f0ebd0;padding:13px 20px;text-align:left;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase}
        .order-table tbody td{padding:13px 20px;font-size:13px;color:#3d2b1f;border-bottom:1px solid rgba(200,168,75,.15);vertical-align:top}
        .order-table tbody tr:last-child td{border-bottom:none}
        .order-table tbody tr{transition:background .15s;animation:slideIn .3s ease both}
        .order-table tbody tr:hover td{background:rgba(200,168,75,.06)}
        .no-badge{width:28px;height:28px;border-radius:50%;background:#4a5c30;color:#f0ebd0;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700}
        .table-chip{display:inline-flex;align-items:center;gap:5px;background:#e8dfc0;color:#5a4a30;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600}
        .time-chip{font-size:12px;color:#7a6848}
        .status-chip{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:20px;font-size:12px;font-weight:700;border:1.5px solid}
        .advance-btn{padding:6px 16px;border-radius:7px;border:none;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;background:#6B7C4A;color:#f0ebd0}
        .advance-btn:hover{background:#3d2b1f;transform:translateY(-1px)}
        .advance-btn:disabled{background:#d1d5db;color:#9ca3af;cursor:not-allowed;transform:none}
        .pulse-new{animation:pulse-ring 2s infinite}
        .addon-tag{display:inline-block;font-size:10px;padding:2px 7px;border-radius:20px;background:#e8f0da;color:#3d5a1a;font-weight:600;margin:2px 2px 0 0;border:1px solid #c8d8a8}
        .kitchen-footer{background:#231c10;padding:10px 32px;display:flex;align-items:center;gap:24px;border-top:1px solid rgba(200,168,75,.2)}
        .footer-stat{display:flex;align-items:center;gap:8px}
        .footer-dot{width:10px;height:10px;border-radius:50%}
        .footer-stat span{font-size:12px;color:rgba(240,235,208,.55)}
        .footer-stat strong{color:#f0ebd0}
        .empty-state{text-align:center;padding:60px 20px;color:#7a6848}
        .empty-state div{font-size:2.5rem;margin-bottom:12px}
        .toast{position:fixed;bottom:28px;right:28px;background:#c8a84b;color:#1a1a18;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,.3);animation:toastIn .3s ease;z-index:9999;display:flex;align-items:center;gap:8px}
        .menu-cell{display:flex;flex-direction:column;gap:4px}
        .menu-name-row{display:flex;align-items:center;gap:6px}
        .qty-badge{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:#4a5c30;color:#f0ebd0;font-size:10px;font-weight:700;flex-shrink:0}
      `}</style>
 
      <div className="kitchen-layout">
 
        {/* HEADER */}
        <header className="kitchen-header">
          <div className="kitchen-logo">
            <div className="kitchen-logo-icon" style={{ padding: 0, overflow: 'hidden' }}>
              <img
                src={logoImg}
                alt="Nawa Logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            <div>
              <div className="kitchen-title">Nawa <span>Kitchen · Order Management</span></div>
              <div style={{ fontSize: '11px', color: 'rgba(200,168,75,0.5)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="live-dot" /> Auto-refresh setiap 10 detik
              </div>
            </div>
          </div>
          <div className="kitchen-clock">{clock.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#c8a84b', fontSize: '12px', fontWeight: 600 }}>{user.username}</div>
              <div style={{ color: 'rgba(240,235,208,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Dapur</div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
          </div>
        </header>
 
        {/* FILTER */}
        <div className="filter-bar">
          <span style={{ color: 'rgba(240,235,208,0.4)', fontSize: '12px', fontWeight: 600, marginRight: '4px', letterSpacing: '0.5px' }}>FILTER:</span>
          {['Semua', 'Baru', 'Diproses', 'Selesai'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'Baru' ? '🔔' : f === 'Diproses' ? '🔥' : f === 'Selesai' ? '✅' : '📋'} {f}
              <span className="filter-count">{counts[f]}</span>
            </button>
          ))}
        </div>
 
        {/* TABLE */}
        <div className="table-wrap">
          {loading ? (
            <div className="empty-state"><div>⏳</div><p style={{ color: '#7a6848' }}>Memuat pesanan dapur...</p></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div>🍽️</div><p style={{ color: '#7a6848' }}>Tidak ada pesanan</p></div>
          ) : (
            <table className="order-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Menu</th>
                  <th>Add-on</th>     {/* ✅ KOLOM BARU */}
                  <th>Meja</th>
                  <th>Waktu</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o, i) => {
                  const st    = statusStyle[o.status] || statusStyle['Baru'];
                  const isNew = o.status === 'Baru';
                  return (
                    <tr key={o.id} style={{ animationDelay: `${i * 0.04}s` }}>
                      <td>
                        <div className={`no-badge ${isNew ? 'pulse-new' : ''}`}>{i + 1}</div>
                      </td>
 
                      {/* Nama menu + qty */}
                      <td>
                        <div className="menu-name-row">
                          <span className="qty-badge">{o.quantity || 1}</span>
                          <span style={{ fontWeight: 600, color: '#2a1f0f', fontSize: '13px' }}>🍽️ {o.menu_name || o.menu}</span>
                        </div>
                      </td>
 
                      {/* ✅ KOLOM ADD-ON: tampil tag per pilihan */}
                      <td>
                        {o.addsOn ? (
                          <div>
                            {o.addsOn.split(', ').map((tag, ti) => (
                              <span key={ti} className="addon-tag">✨ {tag}</span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'rgba(61,43,31,0.3)', fontStyle: 'italic' }}>—</span>
                        )}
                      </td>
 
                      <td><span className="table-chip">🪑 {o.table_name}</span></td>
                      <td><span className="time-chip">⏰ {o.time}</span></td>
                      <td>
                        <span className="status-chip" style={{ background: st.bg, color: st.color, borderColor: st.border }}>
                          {st.icon} {o.status}
                        </span>
                      </td>
                      <td>
                        <button className="advance-btn" onClick={() => nextStatus(o.id)} disabled={o.status === 'Selesai'}>
                          {o.status === 'Baru' ? '🔥 Proses' : o.status === 'Diproses' ? '✅ Selesai' : '✔ Done'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
 
        {/* FOOTER */}
        <footer className="kitchen-footer">
          <div className="footer-stat"><div className="footer-dot" style={{ background: '#ffc107' }} /><span>Baru: <strong>{counts.Baru}</strong></span></div>
          <div className="footer-stat"><div className="footer-dot" style={{ background: '#0d6efd' }} /><span>Diproses: <strong>{counts.Diproses}</strong></span></div>
          <div className="footer-stat"><div className="footer-dot" style={{ background: '#198754' }} /><span>Selesai: <strong>{counts.Selesai}</strong></span></div>
          <div style={{ marginLeft: 'auto', color: 'rgba(240,235,208,0.35)', fontSize: '11px' }}>
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </footer>
      </div>
 
      
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
 
        {toast && <div className="toast">🔔 {toast}</div>}
    </>
  );
}