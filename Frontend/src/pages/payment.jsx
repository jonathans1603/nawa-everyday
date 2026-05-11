import { useState } from 'react';
import logoImg from '../assets/logo.jpg';
 
const API = 'https://nawa-everyday-production.up.railway.app/api';
const formatPrice = (p) => 'Rp.' + Number(p).toLocaleString('id-ID') + ',00';
 
export default function Payment({ cart, totalPrice, tableNumber, qrToken, onNavigate, onBack, onOrderSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
 
  const handleOrder = async (method) => {
    if (cart.length === 0) return;
    setLoading(true);
    setError(null);
 
    try {
      const res = await fetch(`${API}/orders`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_number:   tableNumber,
          qr_token:       qrToken || '',
          total_price:    totalPrice,
          payment_method: method === 'cash' ? 'Cash' : 'QRIS',
          items: cart.map(c => ({
            id:    c.id,
            name:  c.name,
            price: Number(c.price) + Number(c.addonTotal || 0),
            qty:   c.qty,
            addsOn: c.selectedAddons && c.selectedAddons.length > 0
              ? c.selectedAddons.map(a =>
                  a.price > 0
                    ? `${a.label} (+Rp${Number(a.price).toLocaleString('id-ID')})`
                    : a.label
                ).join(', ')
              : null,
          })),
        }),
      });
 
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal membuat pesanan');
      }
 
      const data = await res.json();
      onOrderSuccess(data.order_id);
      onNavigate(method === 'cash' ? 'cash' : 'qris');
 
    } catch (err) {
      setError(err.message || 'Koneksi ke server gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div style={{ minHeight: '100vh', background: '#e8e0cc', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 24px', background: '#d4cbb4', borderBottom: '1px solid #c0b898' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logoImg} alt="Nawa" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #c8a96e' }} />
          {tableNumber > 0 && (
            <span style={{ fontFamily: "'Georgia', serif", fontSize: '14px', fontWeight: '700', color: '#3d2b1f' }}>
              🪑 Meja {tableNumber}
            </span>
          )}
        </div>
        <button
          onClick={onBack}
          style={{
            marginLeft: 'auto',
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '9px 18px', borderRadius: '10px',
            background: '#3d2b1f', color: '#f5efe0',
            border: 'none', cursor: 'pointer',
            fontFamily: "'Georgia', serif", fontStyle: 'italic',
            fontSize: '14px', fontWeight: '700',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#5a3e2b'}
          onMouseLeave={e => e.currentTarget.style.background = '#3d2b1f'}
        >
          ← Kembali ke Menu
        </button>
      </div>
 
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 600, background: '#f0ead8', borderRadius: 16, border: '1.5px solid #c8b898', boxShadow: '0 4px 24px rgba(80,60,20,0.12)', overflow: 'hidden' }}>
 
          <div style={{ background: '#6B7C4A', padding: '16px 24px' }}>
            <h2 style={{ color: 'white', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, margin: 0 }}>Payment</h2>
          </div>
 
          <div>
            {cart.map((item, idx) => (
              <div key={item.cartKey || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 24px', borderBottom: '1px solid #d4c8a8', background: idx % 2 === 0 ? '#f0ead8' : '#e8e0cc' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#2d1f0a' }}>{item.name}</p>
                  {item.selectedAddons && item.selectedAddons.length > 0 && (
                    <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {item.selectedAddons.map(a => (
                        <span key={a.id} style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '20px', background: '#d4e4b8', color: '#2d4a10', fontWeight: '600' }}>
                          +{a.label}{a.price > 0 ? ` (+Rp${Number(a.price).toLocaleString('id-ID')})` : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 16, flexShrink: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#2d1f0a' }}>
                    {formatPrice((Number(item.price) + Number(item.addonTotal || 0)) * item.qty)}
                  </p>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#6B7C4A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                    {item.qty}
                  </div>
                </div>
              </div>
            ))}
          </div>
 
          <div style={{ minHeight: 40, background: '#f0ead8' }} />
 
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1.5px solid #c8b898', background: '#e8e0cc' }}>
            <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 20, fontWeight: 700, color: '#2d1f0a' }}>Total :</p>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 18, color: '#4a6b30' }}>{formatPrice(totalPrice)}</p>
          </div>
 
          {error && (
            <div style={{ margin: '0 24px 12px', padding: '10px 14px', background: '#f8d7da', color: '#721c24', borderRadius: 8, fontSize: 13 }}>
              ❌ {error}
            </div>
          )}
 
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '20px 24px', background: '#e8e0cc', borderTop: '1px solid #c8b898' }}>
            {['qris', 'cash'].map(method => (
              <button key={method} onClick={() => handleOrder(method)} disabled={loading}
                style={{ padding: '14px', borderRadius: 12, background: loading ? '#888' : '#4a5c2a', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 16, fontWeight: 700, letterSpacing: 2, transition: 'background 0.2s', textTransform: 'uppercase' }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#2d3d18'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#4a5c2a'; }}>
                {loading && method === 'cash' ? 'Memproses...' : method.toUpperCase()}
              </button>
            ))}
          </div>
 
        </div>
      </div>
    </div>
  );
}