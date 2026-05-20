import React, { useState, useRef, useEffect, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { toPng } from 'html-to-image';
 
const API = 'https://nawa-everyday-production.up.railway.app/api';
const FRONTEND_URL = 'https://nawa-everyday-frontend.vercel.app';
const makeQRUrl = (token) => `${FRONTEND_URL}/menu?token=${token}`;
 
const QR_LIFETIME_MS = 90 * 60 * 1000; // 90 menit
 
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};
 
// Hitung sisa waktu dari qr_generated (atau qr_expires_at jika tersedia)
const calcTimeLeft = (table) => {
  const base = table.qr_expires_at
    ? new Date(table.qr_expires_at).getTime() - Date.now()
    : table.qr_generated
      ? (new Date(table.qr_generated).getTime() + QR_LIFETIME_MS) - Date.now()
      : 0;
  return Math.max(0, base);
};
 
const fmtCountdown = (ms) => {
  if (ms <= 0) return '00:00';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
  const s = (totalSec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};
 
function QRPreview({ url, qrRef }) {
  return (
    <div ref={qrRef} style={{
      background: 'white', padding: '20px',
      borderRadius: '12px', display: 'inline-block',
      boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
    }}>
      <QRCodeCanvas value={url} size={180} bgColor="#ffffff" fgColor="#3d2b1f" level="H" includeMargin={true} />
    </div>
  );
}
 
// Komponen countdown per baris tabel
function CountdownBadge({ table, onExpired }) {
  const [ms, setMs] = useState(() => calcTimeLeft(table));
 
  useEffect(() => {
    setMs(calcTimeLeft(table));
  }, [table.qr_generated, table.qr_expires_at]);
 
  useEffect(() => {
    if (ms <= 0) { onExpired(table.table_id); return; }
    const id = setInterval(() => {
      setMs(prev => {
        const next = prev - 1000;
        if (next <= 0) { clearInterval(id); onExpired(table.table_id); return 0; }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [ms]);
 
  const pct = Math.min(100, (ms / QR_LIFETIME_MS) * 100);
  const isWarning = ms < 10 * 60 * 1000; // < 10 menit
  const isDanger  = ms < 3 * 60 * 1000;  // < 3 menit
 
  const color = isDanger ? '#dc2626' : isWarning ? '#d97706' : '#6B7C4A';
 
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '90px' }}>
      <span style={{
        fontSize: '13px', fontWeight: '700', color,
        fontFamily: 'monospace', letterSpacing: '1px',
      }}>
        {ms <= 0 ? '⏰ Expired' : `⏱ ${fmtCountdown(ms)}`}
      </span>
      {/* Progress bar */}
      <div style={{ height: '4px', background: '#f0ebe0', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: color,
          borderRadius: '4px',
          transition: 'width 1s linear',
        }} />
      </div>
    </div>
  );
}
 
export default function AdminQRCode() {
  const [tables, setTables]       = useState([]);
  const [selected, setSelected]   = useState(null);
  const [newNumber, setNewNumber] = useState('');
  const [loading, setLoading]     = useState(false);
  const [msg, setMsg]             = useState(null);
  const [autoRefreshOn, setAutoRefreshOn] = useState(true);
  const [nextAutoRefresh, setNextAutoRefresh] = useState(QR_LIFETIME_MS);
  const autoRefreshRef = useRef(null);
  const countdownRef   = useRef(null);
  const qrRef = useRef(null);
 
  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
  };
 
  const fetchTables = async () => {
    try {
      const res  = await fetch(`${API}/tables`);
      const data = await res.json();
      setTables(data);
    } catch {
      showMsg('error', 'Gagal memuat data meja');
    }
  };
 
  useEffect(() => { fetchTables(); }, []);
 
  // ── Auto-refresh global setiap 90 menit ──
  const startAutoRefresh = useCallback(() => {
    clearInterval(autoRefreshRef.current);
    clearInterval(countdownRef.current);
 
    setNextAutoRefresh(QR_LIFETIME_MS);
 
    // Countdown tick
    countdownRef.current = setInterval(() => {
      setNextAutoRefresh(prev => Math.max(0, prev - 1000));
    }, 1000);
 
    // Trigger regenerate semua setelah 90 menit
    autoRefreshRef.current = setInterval(async () => {
      try {
        // Regenerate semua meja satu per satu (atau pakai endpoint bulk jika tersedia)
        const res  = await fetch(`${API}/tables`);
        const all  = await res.json();
        await Promise.all(all.map(t =>
          fetch(`${API}/tables/regenerate/${t.table_id}`, { method: 'PUT' })
        ));
        await fetchTables();
        setNextAutoRefresh(QR_LIFETIME_MS); // reset countdown display
        showMsg('success', '🔄 Semua QR Code telah diperbarui otomatis!');
        // Update selected jika ada
        setSelected(prev => {
          if (!prev) return null;
          return null; // tutup preview agar user tahu QR sudah berganti
        });
      } catch {
        showMsg('error', 'Auto-refresh gagal, coba manual');
      }
    }, QR_LIFETIME_MS);
  }, []);
 
  useEffect(() => {
    if (autoRefreshOn) {
      startAutoRefresh();
    } else {
      clearInterval(autoRefreshRef.current);
      clearInterval(countdownRef.current);
    }
    return () => {
      clearInterval(autoRefreshRef.current);
      clearInterval(countdownRef.current);
    };
  }, [autoRefreshOn]);
 
  // Jika salah satu QR expired (per baris), regenerate otomatis
  const handleRowExpired = useCallback(async (tableId) => {
    try {
      const res  = await fetch(`${API}/tables/regenerate/${tableId}`, { method: 'PUT' });
      const data = await res.json();
      if (res.ok) {
        setTables(prev => prev.map(t =>
          t.table_id === tableId
            ? { ...t, qr_token: data.qr_token, qr_generated: data.qr_generated, qr_expires_at: data.qr_expires_at }
            : t
        ));
        setSelected(prev =>
          prev?.table_id === tableId
            ? { ...prev, qr_token: data.qr_token, qr_generated: data.qr_generated, qr_expires_at: data.qr_expires_at }
            : prev
        );
        showMsg('success', `🔄 QR Meja diperbarui otomatis (token expired)`);
      }
    } catch {
      // silent fail, akan dicoba lagi
    }
  }, []);
 
  const handleAdd = async () => {
    const trimmed = newNumber.trim();
    if (!trimmed) return showMsg('error', 'Nomor meja tidak boleh kosong');
    if (tables.some(t => String(t.table_number) === trimmed)) {
      return showMsg('error', `Meja ${trimmed} sudah ada`);
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/tables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table_number: trimmed }),
      });
      if (res.ok) {
        showMsg('success', `Meja ${trimmed} berhasil ditambahkan`);
        setNewNumber('');
        fetchTables();
      } else {
        const err = await res.json();
        showMsg('error', err.error || 'Gagal menambahkan meja');
      }
    } catch {
      showMsg('error', 'Koneksi ke server gagal');
    } finally {
      setLoading(false);
    }
  };
 
  const handleRegenerate = async (id) => {
    if (!window.confirm('Regenerate QR? Token lama tidak akan bisa digunakan lagi.')) return;
    try {
      const res  = await fetch(`${API}/tables/regenerate/${id}`, { method: 'PUT' });
      const data = await res.json();
      if (res.ok) {
        showMsg('success', 'QR Code berhasil diperbarui');
        setTables(prev => prev.map(t =>
          t.table_id === id
            ? { ...t, qr_token: data.qr_token, qr_generated: data.qr_generated, qr_expires_at: data.qr_expires_at }
            : t
        ));
        if (selected?.table_id === id) {
          setSelected(prev => ({
            ...prev,
            qr_token: data.qr_token,
            qr_generated: data.qr_generated,
            qr_expires_at: data.qr_expires_at,
          }));
        }
      }
    } catch {
      showMsg('error', 'Gagal regenerate QR');
    }
  };
 
  const handleDelete = async (id, tableNumber) => {
    if (!window.confirm(`Hapus Meja ${tableNumber}?`)) return;
    try {
      const res = await fetch(`${API}/tables/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMsg('success', `Meja ${tableNumber} berhasil dihapus`);
        setTables(prev => prev.filter(t => t.table_id !== id));
        if (selected?.table_id === id) setSelected(null);
      }
    } catch {
      showMsg('error', 'Gagal menghapus meja');
    }
  };
 
  const handleDownload = async () => {
    if (!qrRef.current) return;
    try {
      const dataUrl = await toPng(qrRef.current);
      const link    = document.createElement('a');
      link.download = `Meja-${selected.table_number}-QR.png`;
      link.href     = dataUrl;
      link.click();
    } catch {
      showMsg('error', 'Gagal download QR');
    }
  };
 
  const handlePrint = () => {
    if (!qrRef.current) return;
    toPng(qrRef.current).then(dataUrl => {
      const win = window.open('', '_blank');
      win.document.write(`
        <html><body style="text-align:center;padding:40px;font-family:Georgia,serif;">
          <h2>Meja ${selected.table_number}</h2>
          <img src="${dataUrl}" style="width:220px;" /><br/>
          <p style="font-size:12px;color:#888;">Scan untuk melihat menu</p>
          <p style="font-size:10px;color:#aaa;word-break:break-all;">${makeQRUrl(selected.qr_token)}</p>
          <script>window.onload=()=>{window.print();}<\/script>
        </body></html>
      `);
    });
  };
 
  // Hitung countdown global untuk banner
  const globalPct = Math.min(100, (nextAutoRefresh / QR_LIFETIME_MS) * 100);
  const globalWarning = nextAutoRefresh < 10 * 60 * 1000;
 
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: "'Georgia', serif" }}>
 
      {/* Toast */}
      {msg && (
        <div style={{
          padding: '12px 18px', borderRadius: '10px', fontSize: '14px',
          background: msg.type === 'success' ? '#d4edda' : '#f8d7da',
          color:      msg.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${msg.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
        }}>
          {msg.text}
        </div>
      )}
 
      {/* ── Banner Auto-Refresh ── */}
      <div style={{
        background: autoRefreshOn
          ? (globalWarning ? 'linear-gradient(135deg,#7f1d1d,#991b1b)' : 'linear-gradient(135deg,#3a4a22,#4a5c30)')
          : '#4b5563',
        borderRadius: '14px', padding: '16px 20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        color: '#f0ebd0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔄 Auto-Refresh QR Code
              <span style={{
                fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
                background: autoRefreshOn ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                fontWeight: '600',
              }}>
                {autoRefreshOn ? 'AKTIF' : 'NONAKTIF'}
              </span>
            </div>
            {autoRefreshOn ? (
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                Semua QR akan diperbarui dalam:{' '}
                <span style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '14px' }}>
                  {fmtCountdown(nextAutoRefresh)}
                </span>
                {globalWarning && ' ⚠️ Segera diperbarui!'}
              </div>
            ) : (
              <div style={{ fontSize: '12px', opacity: 0.7 }}>QR tidak akan diperbarui otomatis</div>
            )}
          </div>
          <button
            onClick={() => setAutoRefreshOn(v => !v)}
            style={{
              padding: '8px 18px', borderRadius: '8px', border: 'none',
              background: autoRefreshOn ? 'rgba(255,255,255,0.15)' : '#6B7C4A',
              color: '#f0ebd0', fontSize: '12px', fontWeight: '700',
              cursor: 'pointer', fontFamily: "'Georgia', serif",
              transition: 'all 0.2s',
            }}
          >
            {autoRefreshOn ? '⏸ Nonaktifkan' : '▶ Aktifkan'}
          </button>
        </div>
        {/* Progress bar global */}
        {autoRefreshOn && (
          <div style={{ marginTop: '10px', height: '5px', background: 'rgba(255,255,255,0.15)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${globalPct}%`,
              background: globalWarning ? '#fca5a5' : '#c8b97a',
              borderRadius: '4px',
              transition: 'width 1s linear',
            }} />
          </div>
        )}
      </div>
 
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        {[
          { icon: '🪑', num: tables.length,                             label: 'Total Meja' },
          { icon: '✅', num: tables.filter(t => t.qr_token).length,     label: 'Punya QR' },
          { icon: '📅', num: tables.filter(t => t.qr_generated).length, label: 'QR Terbuat' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '18px', textAlign: 'center', boxShadow: '0 2px 10px rgba(61,43,31,0.08)' }}>
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>{s.icon}</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#3d2b1f' }}>{s.num}</div>
            <div style={{ fontSize: '12px', color: '#9a8070' }}>{s.label}</div>
          </div>
        ))}
      </div>
 
      {/* Form tambah meja */}
      <div style={{ background: '#fff', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 2px 10px rgba(61,43,31,0.08)', display: 'flex', alignItems: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: '0 0 200px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#7a6652', marginBottom: '5px' }}>
            Nomor Meja Baru
          </label>
          <input
            type="text"
            placeholder="contoh: 9"
            value={newNumber}
            onChange={e => setNewNumber(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2d5bb', borderRadius: '8px', fontSize: '14px', color: '#3d2b1f', background: '#fdf9f4', fontFamily: "'Georgia', serif", boxSizing: 'border-box' }}
          />
        </div>
        <button onClick={handleAdd} disabled={loading}
          style={{ padding: '9px 20px', background: loading ? '#aaa' : '#6B7C4A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Georgia', serif" }}>
          {loading ? 'Menambahkan...' : '➕ Tambah Meja'}
        </button>
        <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#9a8070', textAlign: 'right' }}>
          <div>QR mengarah ke:</div>
          <code style={{ fontSize: '11px', color: '#6B7C4A' }}>{FRONTEND_URL}/menu?token=...</code>
        </div>
      </div>
 
      {/* Tabel + Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 320px' : '1fr', gap: '20px', alignItems: 'start' }}>
 
        {/* Tabel */}
        <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 10px rgba(61,43,31,0.08)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0ebe0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', fontSize: '15px', color: '#3d2b1f' }}>📋 Daftar Meja & QR Code</span>
            <span style={{ fontSize: '12px', color: '#9a8070' }}>{tables.length} meja</span>
          </div>
 
          {tables.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9a8070', padding: '40px' }}>Belum ada meja. Tambahkan meja pertama!</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#fdf9f4' }}>
                  {['No', 'Meja', 'QR Token', 'URL QR', 'Dibuat', 'Sisa Waktu', 'Aksi'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', color: '#7a6652', fontWeight: '600', fontSize: '12px', borderBottom: '1px solid #f0ebe0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tables.map((t, i) => (
                  <tr key={t.table_id} style={{ borderBottom: '1px solid #f9f5ee', background: selected?.table_id === t.table_id ? '#f0f5e8' : 'white', transition: 'background 0.15s' }}>
                    <td style={{ padding: '12px 14px', color: '#a89060', fontSize: '12px' }}>{i + 1}</td>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#3d2b1f' }}>🪑 Meja {t.table_number}</td>
                    <td style={{ padding: '12px 14px' }}>
                      {t.qr_token ? (
                        <span style={{ fontSize: '10px', color: '#6B7C4A', background: '#e8f0da', padding: '3px 8px', borderRadius: '20px', fontFamily: 'monospace' }}>
                          {t.qr_token.substring(0, 12)}...
                        </span>
                      ) : <span style={{ fontSize: '11px', color: '#ccc' }}>-</span>}
                    </td>
                    <td style={{ padding: '12px 14px', maxWidth: '180px' }}>
                      <span style={{ fontSize: '10px', color: '#9a8070', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {FRONTEND_URL}/menu?token={t.qr_token?.substring(0, 8)}...
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#9a8070', fontSize: '11.5px' }}>{formatDate(t.qr_generated)}</td>
 
                    {/* ── Countdown per meja ── */}
                    <td style={{ padding: '12px 14px' }}>
                      {t.qr_token ? (
                        <CountdownBadge
                          table={t}
                          onExpired={handleRowExpired}
                        />
                      ) : (
                        <span style={{ fontSize: '11px', color: '#ccc' }}>-</span>
                      )}
                    </td>
 
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button onClick={() => setSelected(selected?.table_id === t.table_id ? null : t)}
                          style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '600', background: selected?.table_id === t.table_id ? '#6B7C4A' : '#e8f0da', color: selected?.table_id === t.table_id ? '#fff' : '#3d5a1a' }}>
                          📱 QR
                        </button>
                        <button onClick={() => handleRegenerate(t.table_id)}
                          style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '600', background: '#fff3cd', color: '#856404' }}>
                          🔄 Baru
                        </button>
                        <button onClick={() => handleDelete(t.table_id, t.table_number)}
                          style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '600', background: '#fde8e8', color: '#8b1a1a' }}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
 
        {/* Preview QR */}
        {selected && (
          <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 10px rgba(61,43,31,0.08)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0ebe0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', color: '#3d2b1f' }}>Preview — Meja {selected.table_number}</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#7a6848' }}>✕</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <QRPreview url={makeQRUrl(selected.qr_token)} qrRef={qrRef} />
 
              {/* Countdown di preview */}
              <div style={{ width: '100%', background: '#f9f5ee', borderRadius: '10px', padding: '12px 16px' }}>
                <div style={{ fontSize: '11px', color: '#9a8070', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Sisa Waktu QR
                </div>
                <CountdownBadge table={selected} onExpired={handleRowExpired} />
              </div>
 
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: '700', fontSize: '16px', color: '#3d2b1f', margin: '0 0 4px' }}>Meja {selected.table_number}</p>
                <p style={{ fontSize: '11px', color: '#9a8070', margin: '0 0 4px' }}>Dibuat: {formatDate(selected.qr_generated)}</p>
                <p style={{ fontSize: '10px', color: '#b0a090', margin: 0, wordBreak: 'break-all', maxWidth: '240px' }}>
                  {makeQRUrl(selected.qr_token)}
                </p>
              </div>
              <button onClick={handleDownload}
                style={{ width: '100%', padding: '10px', background: '#6B7C4A', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: "'Georgia', serif" }}>
                ⬇️ Download QR
              </button>
              <button onClick={handlePrint}
                style={{ width: '100%', padding: '10px', background: '#e8f0da', color: '#3d5a1a', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: "'Georgia', serif" }}>
                🖨️ Print QR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}