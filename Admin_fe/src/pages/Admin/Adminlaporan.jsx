import { useState, useEffect } from 'react';
 
const API = 'http://localhost:5000/api';
 
const fmt = (n) =>
  'Rp ' + Number(n).toLocaleString('id-ID');
 
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};
 
const formatTime = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit'
  });
};
 
export default function AdminLaporan() {
  const [laporan, setLaporan]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [msg, setMsg]           = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo]     = useState('');
 
  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };
 
  // ── Fetch laporan dari DB ──
  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('from', dateFrom);
      if (dateTo)   params.append('to',   dateTo);
      const res  = await fetch(`${API}/orders/laporan?${params}`);
      const data = await res.json();
      setLaporan(data);
    } catch {
      showMsg('error', 'Gagal memuat data laporan');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { fetchLaporan(); }, []);
 
  // ── Hapus 1 baris laporan ──
  const handleDelete = async (id, orderNum) => {
    if (!window.confirm(`Hapus laporan Order #${orderNum}?`)) return;
    try {
      const res = await fetch(`${API}/orders/laporan/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMsg('success', `Order #${orderNum} berhasil dihapus`);
        setLaporan(prev => prev.filter(l => l.order_id !== id));
      } else {
        const err = await res.json();
        showMsg('error', err.error || 'Gagal menghapus');
      }
    } catch {
      showMsg('error', 'Koneksi ke server gagal');
    }
  };
 
  const totalPendapatan = laporan.reduce((s, o) => s + Number(o.total), 0);
  const totalTransaksi  = laporan.length;
  const cashCount       = laporan.filter(o => o.payment_method === 'Cash').length;
  const qrisCount       = laporan.filter(o => o.payment_method === 'QRIS').length;
 
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
          { icon: '🧾', num: totalTransaksi,        label: 'Total Transaksi' },
          { icon: '💰', num: fmt(totalPendapatan),   label: 'Total Pendapatan' },
          { icon: '💵', num: cashCount,              label: 'Bayar Cash' },
          { icon: '📱', num: qrisCount,              label: 'Bayar QRIS' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-num" style={{ fontSize: '1.3rem' }}>{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
 
      {/* ── Filter Bar ── */}
      <div className="section-box" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <label style={labelStyle}>Dari Tanggal</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Sampai Tanggal</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inputStyle} />
          </div>
          <button onClick={fetchLaporan}
            style={{ padding: '8px 20px', background: '#6B7C4A', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
            🔍 Filter
          </button>
          <button onClick={() => { setDateFrom(''); setDateTo(''); setTimeout(fetchLaporan, 50); }}
            style={{ padding: '8px 16px', background: '#e2d5bb', color: '#3d2b1f', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
            Reset
          </button>
          <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#9a8070' }}>
            {laporan.length} transaksi selesai
          </div>
        </div>
      </div>
 
      {/* ── Tabel ── */}
      <div className="section-box">
        <div className="section-box-header">
          <span className="section-box-title">📋 Riwayat Transaksi Selesai</span>
          <span style={{ fontSize: '12px', color: '#9a8070' }}>
            Admin dapat menghapus sebelum finalisasi ke Owner
          </span>
        </div>
 
        {loading ? (
          <p style={{ padding: '40px', textAlign: 'center', color: '#9a8070' }}>Memuat data...</p>
        ) : laporan.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📭</div>
            <p style={{ color: '#9a8070' }}>Belum ada transaksi selesai</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Meja</th>
                <th>Menu</th>
                <th>Tanggal</th>
                <th>Waktu</th>
                <th>Total</th>
                <th>Pembayaran</th>
                <th>Hapus</th>
              </tr>
            </thead>
            <tbody>
              {laporan.map((o, i) => (
                <tr key={o.order_id}>
                  <td style={{ fontWeight: '700', color: '#6B7C4A' }}>#{o.order_id}</td>
                  <td>
                    <span style={{ background: '#e8dfc0', color: '#5a4a30', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                      🪑 {o.table_name}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: '#3d2b1f', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    🍽️ {o.items_summary || '-'}
                  </td>
                  <td style={{ fontSize: '12px', color: '#7a6848' }}>{formatDate(o.created_at)}</td>
                  <td style={{ fontSize: '12px', color: '#7a6848' }}>{formatTime(o.created_at)}</td>
                  <td style={{ fontWeight: '700', color: '#3d2b1f' }}>{fmt(o.total)}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                      background: o.payment_method === 'QRIS' ? '#e8f4fd' : '#d4edda',
                      color:      o.payment_method === 'QRIS' ? '#0c5460'  : '#155724',
                    }}>
                      {o.payment_method === 'QRIS' ? '📱 QRIS' : '💵 Cash'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(o.order_id, o.order_id)}
                      style={{ padding: '5px 10px', background: '#fde8e8', color: '#8b1a1a', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                      🗑️ Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f5f0e0', borderTop: '2px solid #e2d5bb' }}>
                <td colSpan={5} style={{ padding: '12px 16px', fontWeight: '700', textAlign: 'right', color: '#5a4a30' }}>
                  TOTAL PENDAPATAN
                </td>
                <td style={{ padding: '12px 16px', fontWeight: '700', color: '#6B7C4A', fontSize: '15px' }}>
                  {fmt(totalPendapatan)}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
 
const inputStyle = {
  padding: '8px 12px', border: '1.5px solid #e2d5bb', borderRadius: '8px',
  fontSize: '13px', color: '#3d2b1f', background: '#fdf9f4',
  fontFamily: 'sans-serif', outline: 'none',
};
 
const labelStyle = {
  display: 'block', fontSize: '12px', fontWeight: '600',
  color: '#7a6652', marginBottom: '5px',
};