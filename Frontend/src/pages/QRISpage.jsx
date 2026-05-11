import { useState, useEffect } from 'react';
import logoImg from '../assets/logo.jpg';
 
// ── Dummy QR Code SVG (QRIS-style pattern)
function QRISCode({ size = 220 }) {
  const cells = 29;
  const cellSize = size / cells;
  const seed = 42;
  const pattern = Array.from({ length: cells }, (_, r) =>
    Array.from({ length: cells }, (_, c) => {
      if (r < 7 && c < 7) {
        if (r === 0 || r === 6 || c === 0 || c === 6) return 1;
        if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return 1;
        return 0;
      }
      if (r < 7 && c >= cells - 7) {
        const cc = c - (cells - 7);
        if (r === 0 || r === 6 || cc === 0 || cc === 6) return 1;
        if (r >= 2 && r <= 4 && cc >= 2 && cc <= 4) return 1;
        return 0;
      }
      if (r >= cells - 7 && c < 7) {
        const rr = r - (cells - 7);
        if (rr === 0 || rr === 6 || c === 0 || c === 6) return 1;
        if (rr >= 2 && rr <= 4 && c >= 2 && c <= 4) return 1;
        return 0;
      }
      if (r === 6 && c > 7 && c < cells - 7) return c % 2 === 0 ? 1 : 0;
      if (c === 6 && r > 7 && r < cells - 7) return r % 2 === 0 ? 1 : 0;
      if (r >= cells - 9 && r <= cells - 5 && c >= cells - 9 && c <= cells - 5) {
        const rr = r - (cells - 9), cc = c - (cells - 9);
        if (rr === 0 || rr === 4 || cc === 0 || cc === 4 || (rr === 2 && cc === 2)) return 1;
        return 0;
      }
      const hash = ((r * 31 + c) * seed * 1103515245 + 12345) & 0x7fffffff;
      return hash % 3 === 0 ? 1 : 0;
    })
  );
 
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <rect width={size} height={size} fill="white" />
      {pattern.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize} fill="#000" />
          ) : null
        )
      )}
    </svg>
  );
}
 
function QRISHeader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ background: '#000', color: '#fff', fontWeight: 900, fontSize: '15px', padding: '3px 7px', borderRadius: '3px', fontFamily: "'Georgia', serif", letterSpacing: '1px', border: '2px solid #000' }}>
          QRIS
        </div>
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: '9px', color: '#555', fontFamily: 'sans-serif', fontWeight: 700, letterSpacing: '0.5px' }}>QR Code Standar</div>
          <div style={{ fontSize: '8px', color: '#555', fontFamily: 'sans-serif' }}>Pembayaran Nasional</div>
        </div>
      </div>
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #c8102e, #e8001d)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 900, fontFamily: 'sans-serif' }}>
        GPN
      </div>
    </div>
  );
}
 
function CountdownTimer({ seconds, onExpire }) {
  const [remaining, setRemaining] = useState(seconds);
 
  useEffect(() => {
    if (remaining <= 0) { onExpire?.(); return; }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);
 
  const mins  = Math.floor(remaining / 60);
  const secs  = remaining % 60;
  const pct   = (remaining / seconds) * 100;
  const color = remaining > 60 ? '#6B7C4A' : remaining > 30 ? '#f59e0b' : '#ef4444';
 
  return (
    <div style={{ textAlign: 'center', marginBottom: '14px' }}>
      <div style={{ fontSize: '11px', color: '#7a6652', fontFamily: 'sans-serif', marginBottom: '6px' }}>
        QR Code berlaku selama
      </div>
      <div style={{ fontSize: '22px', fontWeight: 700, color, fontFamily: "'Georgia', serif", letterSpacing: '2px' }}>
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>
      <div style={{ margin: '8px auto 0', width: '140px', height: '4px', background: '#e8dfc0', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: '2px', width: `${pct}%`, background: color, transition: 'width 1s linear, background 0.5s' }} />
      </div>
    </div>
  );
}
 
const formatPrice = (p) => 'Rp.' + Number(p).toLocaleString('id-ID') + ',00';
 
export default function QRISPage({ cart = [], totalPrice = 0, tableNumber, orderId, onNavigate }) {
  const [expired, setExpired] = useState(false);
  const [paid,    setPaid]    = useState(false);
 
  // ✅ Mapping cart dengan selectedAddons (bukan ADDON_MAP lama)
  const items = cart.map(c => ({
    name:       c.name,
    qty:        c.qty,
    // ✅ Number() agar tidak ada bug string + number
    price:      Number(c.price) + Number(c.addonTotal || 0),
    selectedAddons: c.selectedAddons || [],
  }));
 
  // Polling status pembayaran setiap 5 detik
  useEffect(() => {
    if (!orderId || paid) return;
    const interval = setInterval(async () => {
      try {
        const res  = await fetch(`http://localhost:5000/api/orders/${orderId}`);
        const data = await res.json();
        if (data.order?.status === 'Diproses' || data.order?.status === 'Selesai') {
          setPaid(true);
          clearInterval(interval);
        }
      } catch { /* server offline — abaikan */ }
    }, 5000);
    return () => clearInterval(interval);
  }, [orderId, paid]);
 
  return (
    <div style={{ minHeight: '100vh', background: '#C4D0A3', display: 'flex', flexDirection: 'column' }}>
 
      {/* Header */}
      <header style={{ background: '#6B7C4A', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(61,43,31,0.2)' }}>
        <img src={logoImg} alt="Nawa" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #c8b97a' }} />
        <nav style={{ display: 'flex', gap: '10px' }}>
          {['Menu', 'About Us', 'Reservation', 'Contact'].map(label => (
            <button key={label} style={{ padding: '6px 16px', borderRadius: '20px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#f0ebd0', fontSize: '12px', fontFamily: "'Georgia', serif", cursor: 'pointer' }}>
              {label}
            </button>
          ))}
        </nav>
      </header>
 
      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 24px' }}>
        <div style={{ background: '#eef3e8', borderRadius: '16px', padding: '28px 32px', width: '100%', maxWidth: '760px', boxShadow: '0 4px 24px rgba(61,43,31,0.12)' }}>
 
          <div style={{ background: '#6B7C4A', color: '#f0ebd0', padding: '10px 20px', borderRadius: '8px', marginBottom: '24px', display: 'inline-block', fontFamily: "'Georgia', serif", fontSize: '18px', fontStyle: 'italic', fontWeight: 700 }}>
            QRIS
          </div>
 
          {paid ? (
            /* ── LUNAS ── */
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: '24px', color: '#3d2b1f', margin: '0 0 10px', fontStyle: 'italic' }}>
                Pembayaran Diterima!
              </h2>
              <p style={{ color: '#7a6652', fontSize: '14px', marginBottom: '24px' }}>
                Terima kasih telah membayar. Invoice akan segera diantarkan ke meja Anda.
              </p>
              <button onClick={() => onNavigate('feedback')}
                style={{ padding: '12px 36px', borderRadius: '50px', background: '#6B7C4A', color: '#f0ebd0', border: 'none', fontFamily: "'Georgia', serif", fontSize: '16px', fontStyle: 'italic', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(107,124,74,0.4)' }}>
                Feedback
              </button>
            </div>
 
          ) : expired ? (
            /* ── EXPIRED ── */
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>⏰</div>
              <h2 style={{ fontFamily: "'Georgia', serif", color: '#3d2b1f', margin: '0 0 10px' }}>QR Code Kedaluwarsa</h2>
              <p style={{ color: '#7a6652', fontSize: '13px', marginBottom: '20px' }}>
                Waktu pembayaran habis. Silakan kembali ke menu dan buat pesanan baru.
              </p>
              <button onClick={() => onNavigate('menu')}
                style={{ padding: '10px 28px', borderRadius: '50px', background: '#3d2b1f', color: '#c8b97a', border: 'none', fontFamily: "'Georgia', serif", fontSize: '14px', cursor: 'pointer' }}>
                Kembali ke Menu
              </button>
            </div>
 
          ) : (
            /* ── MAIN ── */
            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
 
              {/* Kiri: Info Pesanan */}
              <div style={{ flex: '1', minWidth: '220px', background: '#f5efe0', borderRadius: '14px', padding: '24px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', boxShadow: '0 2px 12px rgba(61,43,31,0.08)' }}>
                <img src={logoImg} alt="Nawa" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6B7C4A', marginBottom: '4px' }} />
 
                {/* No Meja & Order ID */}
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '13px', fontFamily: 'sans-serif', color: '#3d2b1f', border: '1px solid #c8b97a', borderRadius: '8px', overflow: 'hidden' }}>
                  <span style={{ padding: '6px 14px', borderRight: '1px solid #c8b97a', fontWeight: 600 }}>
                    🪑 Meja {tableNumber ?? '-'}
                  </span>
                  <span style={{ padding: '6px 14px', fontWeight: 600 }}>
                    Order #{orderId ?? '-'}
                  </span>
                </div>
 
                {/* Total */}
                <div style={{ textAlign: 'center', marginTop: '6px' }}>
                  <p style={{ fontFamily: "'Georgia', serif", fontSize: '14px', color: '#7a6652', margin: '0 0 4px' }}>Total Pembayaran</p>
                  <p style={{ fontFamily: "'Georgia', serif", fontSize: '22px', fontWeight: 700, color: '#6B7C4A', margin: 0 }}>
                    {formatPrice(totalPrice)}
                  </p>
                </div>
 
                {/* ✅ Rincian item + selectedAddons */}
                {items.length > 0 && (
                  <div style={{ width: '100%', marginTop: '8px', padding: '10px 12px', background: '#ede5cc', borderRadius: '8px' }}>
                    {items.map((item, i) => (
                      <div key={i} style={{ marginBottom: i < items.length - 1 ? '8px' : 0 }}>
                        {/* Nama + harga */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'sans-serif', color: '#5a4a30', fontWeight: 600 }}>
                          <span>{item.name} ×{item.qty}</span>
                          <span>{formatPrice(item.price * item.qty)}</span>
                        </div>
                        {/* ✅ Tag selectedAddons per item */}
                        {item.selectedAddons.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '3px' }}>
                            {item.selectedAddons.map(a => (
                              <span key={a.id} style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '20px', background: '#d4e4b8', color: '#2d4a10', fontWeight: 600 }}>
                                +{a.label}{a.price > 0 ? ` (+Rp${Number(a.price).toLocaleString('id-ID')})` : ''}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
 
                <div style={{ width: '100%', height: '1px', background: '#c8b97a', opacity: 0.4, margin: '4px 0' }} />
 
                <p style={{ fontSize: '12px', color: '#7a6652', textAlign: 'center', fontFamily: 'sans-serif', lineHeight: 1.6, margin: 0 }}>
                  Terima Kasih sudah membayar<br />
                  Invoice pembayaran akan kami antarkan
                </p>
 
                <CountdownTimer seconds={300} onExpire={() => setExpired(true)} />
 
                <button onClick={() => onNavigate('feedback')}
                  style={{ padding: '10px 32px', borderRadius: '50px', background: 'transparent', border: '2.5px solid #6B7C4A', color: '#3d2b1f', fontFamily: "'Georgia', serif", fontSize: '16px', fontStyle: 'italic', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#6B7C4A'; e.currentTarget.style.color = '#f0ebd0'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3d2b1f'; }}>
                  Feedback
                </button>
              </div>
 
              {/* Kanan: QR Code */}
              <div style={{ flex: '1', minWidth: '260px', background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 16px rgba(61,43,31,0.1)', border: '2px solid #c8b97a', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <QRISHeader />
 
                <div style={{ textAlign: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <p style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a1a', margin: '0 0 2px', fontFamily: 'sans-serif' }}>Nawa Everyday</p>
                  <p style={{ fontSize: '11px', color: '#666', margin: 0, fontFamily: 'sans-serif' }}>NMID: ID2025NAWA0000001</p>
                </div>
 
                <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
                  <div style={{ padding: '12px', background: 'white', borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <QRISCode size={200} />
                  </div>
                </div>
 
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 700, fontSize: '12px', color: '#1a1a1a', margin: '0 0 2px', fontFamily: 'sans-serif', letterSpacing: '0.5px' }}>SATU QRIS UNTUK SEMUA</p>
                  <p style={{ fontSize: '10px', color: '#888', margin: 0, fontFamily: 'sans-serif' }}>Cek aplikasi penyelenggara di: www.aspi-qris.id</p>
                </div>
 
                {/* Total di QR card */}
                <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#666', fontFamily: 'sans-serif' }}>Total Pembayaran</p>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1a1a1a', fontFamily: 'sans-serif' }}>
                    {formatPrice(totalPrice)}
                  </p>
                </div>
 
                {/* Cara bayar */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', padding: '8px 0 0', borderTop: '1px solid #eee' }}>
                  {['Buka Aplikasi', 'Scan QR', 'Bayar'].map((step, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e8e8e8', margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                        {['📱', '📷', '✅'][i]}
                      </div>
                      <p style={{ fontSize: '9px', color: '#888', margin: 0, fontFamily: 'sans-serif' }}>{step}</p>
                    </div>
                  ))}
                </div>
 
                <p style={{ fontSize: '9px', color: '#aaa', textAlign: 'center', margin: 0, fontFamily: 'sans-serif' }}>
                  Dicetak oleh: Nawa Everyday System · v1.0.0
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}