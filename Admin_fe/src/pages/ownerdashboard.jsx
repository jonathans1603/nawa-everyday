import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logonawa from '../assets/logo.jpg';
 
const API_URL = import.meta.env.VITE_API_URL || 'https://nawa-everyday-production.up.railway.app/api';
 
const fmt = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
 
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};
 
const formatTime = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};
 
export default function OwnerDashboard() {
  const [user, setUser]         = useState(null);
  const [laporan, setLaporan]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo]     = useState('');
  const [toast, setToast]       = useState(null);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
 
  useEffect(() => {
    const stored = sessionStorage.getItem('nawa_user');
    if (!stored) { navigate('/login'); return; }
    setUser(JSON.parse(stored));
  }, []);
 
  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('from', dateFrom);
      if (dateTo)   params.append('to',   dateTo);
      const res  = await fetch(`${API_URL}/orders/laporan?${params}`);
      const data = await res.json();
      setLaporan(data);
    } catch {
      setLaporan([]);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { fetchLaporan(); }, []);
 
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
 
  const handleLogout = () => { setShowLogoutModal(true); };
  const confirmLogout = () => { sessionStorage.removeItem('nawa_user'); navigate('/login', { replace: true }); };
 
  // ── Stats ──
  const totalPendapatan = laporan.reduce((s, o) => s + Number(o.total), 0);
  const totalTransaksi  = laporan.length;
  const totalItem       = laporan.reduce((s, o) => s + Number(o.total_qty || 0), 0);
  const rataRata        = totalTransaksi > 0 ? Math.round(totalPendapatan / totalTransaksi) : 0;
 
  // ── Download CSV / Excel ──
  const downloadCSV = () => {
    const headers = ['No','Order ID','Tanggal','Waktu','Meja','Menu','Total','Metode Bayar'];
    const rows = laporan.map((o, i) => [
      i + 1, o.order_id,
      formatDate(o.created_at),
      formatTime(o.created_at),
      `Meja ${o.table_number}`,
      `"${o.items_summary || '-'}"`,
      Number(o.total),
      o.payment_method || '-'
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `laporan_nawa_${dateFrom || 'all'}_${dateTo || 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Laporan Excel/CSV berhasil diunduh!');
  };
 
  // ── Download PDF (print) ──
  const downloadPDF = () => {
    const rowsHtml = laporan.map((o, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>#${o.order_id}</td>
        <td>${formatDate(o.created_at)}</td>
        <td>${formatTime(o.created_at)}</td>
        <td>Meja ${o.table_number}</td>
        <td>${o.items_summary || '-'}</td>
        <td style="text-align:right"><strong>${fmt(o.total)}</strong></td>
        <td style="text-align:center">${o.payment_method || '-'}</td>
      </tr>`).join('');
 
    const periodLabel = (dateFrom && dateTo)
      ? `${dateFrom} s/d ${dateTo}`
      : dateFrom ? `Dari ${dateFrom}`
      : dateTo   ? `Sampai ${dateTo}`
      : 'Semua Periode';
 
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
      <title>Laporan Nawa — ${periodLabel}</title>
      <style>
        body{font-family:sans-serif;margin:40px;color:#2a1f0f;font-size:12px}
        .hdr{display:flex;justify-content:space-between;border-bottom:2px solid #c8b97a;padding-bottom:16px;margin-bottom:20px}
        .brand{font-size:20px;font-weight:700;color:#3d2b1f}
        .brand small{display:block;font-size:11px;color:#7a6848;font-weight:400;margin-top:2px}
        .stats{display:flex;gap:10px;margin-bottom:20px}
        .stat{flex:1;border:1px solid #e0d5b0;border-radius:6px;padding:10px 14px}
        .stat .v{font-size:16px;font-weight:700;color:#3d2b1f}
        .stat .l{font-size:10px;color:#7a6848;text-transform:uppercase;letter-spacing:.5px}
        table{width:100%;border-collapse:collapse;font-size:11px}
        thead th{background:#4a5c30;color:#f0ebd0;padding:8px 10px;text-align:left;text-transform:uppercase;font-size:10px;letter-spacing:.5px}
        tbody td{padding:7px 10px;border-bottom:1px solid #e8dfc0}
        tbody tr:nth-child(even) td{background:#faf8f0}
        tfoot td{padding:9px 10px;font-weight:700;border-top:2px solid #c8b97a;background:#f5f0e0}
        .foot{margin-top:24px;text-align:center;font-size:10px;color:#a89060}
        @media print { body{margin:20px} }
      </style></head><body>
      <div class="hdr">
        <div><div class="brand">Nawa Everyday<small>Everyday Coffee & Eatery</small></div></div>
        <div style="text-align:right;font-size:11px;color:#7a6848">
          <div><strong>Laporan Pemesanan</strong></div>
          <div>Periode: ${periodLabel}</div>
          <div>Dicetak: ${new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</div>
        </div>
      </div>
      <div class="stats">
        <div class="stat"><div class="v">${totalTransaksi}</div><div class="l">Total Transaksi</div></div>
        <div class="stat"><div class="v">${totalItem}</div><div class="l">Total Item</div></div>
        <div class="stat"><div class="v">${fmt(rataRata)}</div><div class="l">Rata-rata / Transaksi</div></div>
        <div class="stat"><div class="v">${fmt(totalPendapatan)}</div><div class="l">Total Pendapatan</div></div>
      </div>
      <table>
        <thead><tr><th>No</th><th>Order ID</th><th>Tanggal</th><th>Waktu</th><th>Meja</th><th>Menu</th><th style="text-align:right">Total</th><th style="text-align:center">Bayar</th></tr></thead>
        <tbody>${rowsHtml}</tbody>
        <tfoot><tr>
          <td colspan="6" style="text-align:right">TOTAL PENDAPATAN</td>
          <td style="text-align:right;color:#3d6b24">${fmt(totalPendapatan)}</td>
          <td></td>
        </tr></tfoot>
      </table>
      <div class="foot">Dokumen dibuat otomatis oleh sistem Nawa — ${new Date().toLocaleString('id-ID')}</div>
      <script>window.onload=()=>{window.print();}<\/script>
    </body></html>`;
 
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    showToast('Halaman cetak PDF dibuka!');
  };
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;background:#f0ead8}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes toastSlide{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}
        .fade-up{animation:fadeUp .35s ease both}
        .toast-in{animation:toastSlide .3s ease both}
      `}</style>
 
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f0ead8' }}>
 
        {/* ── Sidebar ── */}
        <aside style={{ width: '80px', background: '#3d2b1f', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: '8px', flexShrink: 0 }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #c8b97a', overflow: 'hidden', marginBottom: '16px', flexShrink: 0 }}>
            <img src={logonawa} alt="Nawa Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
          <div style={{ background: '#6B7C4A', color: '#f0ebd0', padding: '8px 6px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', textAlign: 'center', width: '64px', cursor: 'default' }}>
            Laporan
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={handleLogout}
            style={{ background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '18px', color: '#fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ⎋
          </button>
        </aside>
 
        {/* ── Main ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
 
          {/* Header */}
          <header style={{ background: 'linear-gradient(135deg, #fffef5, #f0ead8)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid rgba(200,185,122,0.3)', boxShadow: '0 2px 12px rgba(61,43,31,0.08)' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>
              <em style={{ color: '#8B1A1A' }}>Owner</em>
              <span style={{ color: '#3d2b1f', fontStyle: 'italic' }}> - Report Management</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#3d2b1f' }}>{user?.name || user?.username}</div>
              <div style={{ fontSize: '11px', color: '#a89060', textTransform: 'uppercase', letterSpacing: '1px' }}>Owner</div>
            </div>
          </header>
 
          <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
 
            {/* Stats */}
            <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { icon: '🧾', num: totalTransaksi,      label: 'Total Transaksi' },
                { icon: '📦', num: totalItem,            label: 'Total Item' },
                { icon: '📊', num: fmt(rataRata),        label: 'Rata-rata/Transaksi' },
                { icon: '💰', num: fmt(totalPendapatan), label: 'Total Pendapatan', highlight: true },
              ].map((s, i) => (
                <div key={i} style={{
                  background: s.highlight ? 'linear-gradient(135deg,#4a5c30,#6B7C4A)' : '#fffef5',
                  borderRadius: '14px', padding: '18px 20px',
                  border: '1.5px solid rgba(200,185,122,0.3)',
                  boxShadow: '0 2px 12px rgba(61,43,31,0.08)',
                  animationDelay: `${i * 0.07}s`,
                }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{s.icon}</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: s.highlight ? '#f0ebd0' : '#3d2b1f', fontFamily: "'Playfair Display', serif" }}>{s.num}</div>
                  <div style={{ fontSize: '11px', color: s.highlight ? 'rgba(240,235,208,0.7)' : '#7a6848', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '3px' }}>{s.label}</div>
                </div>
              ))}
            </div>
 
            {/* Filter + Download */}
            <div className="fade-up" style={{ background: '#fffef5', borderRadius: '14px', padding: '18px 20px', marginBottom: '20px', border: '1.5px solid rgba(200,185,122,0.3)', display: 'flex', alignItems: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <label style={labelStyle}>Dari Tanggal</label>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Sampai Tanggal</label>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inputStyle} />
              </div>
              <button onClick={fetchLaporan}
                style={{ padding: '9px 20px', background: '#6B7C4A', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
                🔍 Filter
              </button>
              <button onClick={() => { setDateFrom(''); setDateTo(''); setTimeout(fetchLaporan, 50); }}
                style={{ padding: '9px 16px', background: '#e2d5bb', color: '#3d2b1f', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                Reset
              </button>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                <button onClick={downloadCSV} disabled={laporan.length === 0}
                  style={{ padding: '9px 18px', background: 'linear-gradient(135deg,#1e6631,#2d9b4f)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: laporan.length === 0 ? 'not-allowed' : 'pointer', fontSize: '13px', opacity: laporan.length === 0 ? 0.5 : 1 }}>
                  📥 Unduh Excel
                </button>
                <button onClick={downloadPDF} disabled={laporan.length === 0}
                  style={{ padding: '9px 18px', background: 'linear-gradient(135deg,#8B1A1A,#c0392b)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: laporan.length === 0 ? 'not-allowed' : 'pointer', fontSize: '13px', opacity: laporan.length === 0 ? 0.5 : 1 }}>
                  🖨️ Cetak PDF
                </button>
              </div>
            </div>
 
            {/* Table */}
            <div className="fade-up" style={{ background: '#fffef5', borderRadius: '14px', overflow: 'hidden', border: '1.5px solid rgba(200,185,122,0.25)' }}>
              <div style={{ padding: '14px 20px', background: 'linear-gradient(135deg,#f5f0e0,#ede5cc)', borderBottom: '1px solid rgba(200,185,122,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: '700', color: '#3d2b1f' }}>📋 Tabel Laporan Pemesanan</span>
                <span style={{ fontSize: '12px', color: '#7a6848' }}>{laporan.length} transaksi ditemukan</span>
              </div>
 
              {loading ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#9a8070' }}>⏳ Memuat data...</div>
              ) : laporan.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.4 }}>📭</div>
                  <p style={{ color: '#9a8070' }}>Tidak ada data pada periode ini</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr>
                        {['No','Order ID','Tanggal','Waktu','Meja','Menu','Total','Metode Bayar'].map((h, i) => (
                          <th key={i} style={{ background: '#4a5c30', color: '#f0ebd0', padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {laporan.map((o, i) => (
                        <tr key={o.order_id} style={{ borderBottom: '1px solid rgba(200,185,122,0.15)', background: i % 2 === 0 ? '#fffef5' : '#faf8f0' }}>
                          <td style={{ padding: '10px 14px', color: '#a89060', fontSize: '12px' }}>{i + 1}</td>
                          <td style={{ padding: '10px 14px', fontWeight: '700', color: '#6B7C4A' }}>#{o.order_id}</td>
                          <td style={{ padding: '10px 14px', fontSize: '12px', color: '#7a6848' }}>{formatDate(o.created_at)}</td>
                          <td style={{ padding: '10px 14px', fontSize: '12px', color: '#7a6848' }}>{formatTime(o.created_at)}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{ background: '#e8dfc0', color: '#5a4a30', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                              🪑 {o.table_name}
                            </span>
                          </td>
                          <td style={{ padding: '10px 14px', fontSize: '12px', color: '#3d2b1f', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            🍽️ {o.items_summary || '-'}
                          </td>
                          <td style={{ padding: '10px 14px', fontWeight: '700', color: '#3d2b1f' }}>{fmt(o.total)}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{
                              padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                              background: o.payment_method === 'QRIS' ? '#e8f4fd' : '#d4edda',
                              color:      o.payment_method === 'QRIS' ? '#0c5460'  : '#155724',
                            }}>
                              {o.payment_method === 'QRIS' ? '📱 QRIS' : '💵 Cash'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: 'linear-gradient(135deg,#f5f0e0,#ede5cc)', borderTop: '2px solid rgba(200,185,122,0.5)' }}>
                        <td colSpan={6} style={{ padding: '12px 14px', fontWeight: '700', textAlign: 'right', color: '#5a4a30', fontSize: '13px' }}>TOTAL PENDAPATAN</td>
                        <td style={{ padding: '12px 14px', fontWeight: '800', color: '#4a5c30', fontSize: '15px' }}>{fmt(totalPendapatan)}</td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
 
      {toast && (
        <div className="toast-in" style={{ position: 'fixed', bottom: '28px', right: '28px', background: '#3d2b1f', color: '#f0ebd0', padding: '12px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px' }}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}
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
 
    </>
  );
}
 
const inputStyle = {
  padding: '8px 12px', border: '1.5px solid rgba(200,185,122,0.4)', borderRadius: '8px',
  fontSize: '13px', color: '#3d2b1f', background: '#fffef5',
  fontFamily: 'sans-serif', outline: 'none',
};
 
const labelStyle = {
  display: 'block', fontSize: '12px', fontWeight: '600',
  color: '#5a4a30', marginBottom: '5px',
  textTransform: 'uppercase', letterSpacing: '0.4px',
};