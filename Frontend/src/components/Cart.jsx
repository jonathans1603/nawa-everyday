import { useState } from 'react';
import logoImg from '../assets/logo.jpg';
 
const formatPrice = (price) => 'Rp.' + Number(price).toLocaleString('id-ID') + ',00';
 
export default function Cart({ open, cart, tableNumber, qrToken, onClose, onAdd, onSub, onClear, onNavigate }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError]     = useState(null);
 
  // Total sudah termasuk addonTotal per item
  const total = cart.reduce((sum, c) => sum + (Number(c.price) + Number(c.addonTotal || 0)) * c.qty, 0);
 
  const handlePayment = () => {
    if (cart.length === 0) return;
    onClose();
    onNavigate('payment');
  };
 
  const handleClose = () => {
    setSuccess(false);
    setOrderId(null);
    setError(null);
    onClose();
  };
 
  return (
    <>
      {open && (
        <div onClick={handleClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200 }} />
      )}
 
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: open ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.95)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none',
        transition: 'transform 0.25s ease, opacity 0.25s ease', zIndex: 201,
        width: '90%', maxWidth: '440px', maxHeight: '88vh',
        display: 'flex', flexDirection: 'column',
        background: '#f5efe0', borderRadius: '20px',
        boxShadow: '0 24px 64px rgba(61,43,31,0.3)', overflow: 'hidden',
        border: '2px solid #e2d5bb',
      }}>
 
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#f5efe0', borderBottom: '1px solid #e2d5bb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={handleClose} style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#3d2b1f', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: '700' }}>✕</button>
            <span style={{ fontFamily: "'Georgia', serif", fontStyle: 'italic', fontWeight: '700', fontSize: '18px', color: '#3d2b1f' }}>Keranjang Anda</span>
          </div>
          <img src={logoImg} alt="Nawa" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6B7C4A' }} />
        </div>
 
        {/* Info meja */}
        {tableNumber > 0 && (
          <div style={{ padding: '8px 20px', background: '#e8f0da', borderBottom: '1px solid #d4e4b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px' }}>🪑</span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#3d5a1a' }}>Meja {tableNumber}</span>
          </div>
        )}
 
        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
              <h3 style={{ fontFamily: "'Georgia', serif", color: '#3d2b1f', fontSize: 20, margin: '0 0 8px' }}>Pesanan Diterima!</h3>
              <p style={{ fontSize: 13, color: '#7a6652', lineHeight: 1.6, marginBottom: 6 }}>
                Pesanan kamu sudah masuk. Silakan tunggu, staff kami akan segera memproses.
              </p>
              <p style={{ fontSize: 12, color: '#9a8070' }}>No. Order: <strong style={{ color: '#6B7C4A' }}>#{orderId}</strong></p>
            </div>
 
          ) : cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
              <div style={{ fontSize: 40, marginBottom: 10, opacity: 0.4 }}>🛒</div>
              <p style={{ fontFamily: "'Georgia', serif", color: '#9a8070', fontSize: 14 }}>Keranjang masih kosong</p>
              <p style={{ fontSize: 12, color: '#b0a090' }}>Tambahkan menu yang ingin kamu pesan</p>
            </div>
 
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cart.map(item => (
                <CartItem key={item.cartKey} item={item} onAdd={onAdd} onSub={onSub} />
              ))}
            </div>
          )}
 
          {error && (
            <div style={{ marginTop: '12px', padding: '10px 14px', background: '#f8d7da', color: '#721c24', borderRadius: '8px', fontSize: '13px' }}>
              ❌ {error}
            </div>
          )}
        </div>
 
        {/* Footer */}
        {!success && cart.length > 0 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #e2d5bb', background: '#f5efe0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontFamily: "'Georgia', serif", fontSize: '18px', fontWeight: '700', color: '#3d2b1f' }}>Total :</span>
              <span style={{ fontFamily: "'Georgia', serif", fontSize: '16px', fontWeight: '700', color: '#3d2b1f' }}>{formatPrice(total)}</span>
            </div>
            <button onClick={handlePayment}
              style={{ width: '100%', padding: '14px', background: loading ? '#aaa' : '#3d2b1f', color: '#f5efe0', border: 'none', borderRadius: '12px', fontFamily: "'Georgia', serif", fontStyle: 'italic', fontSize: '17px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
              Payment
            </button>
          </div>
        )}
 
        {success && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #e2d5bb' }}>
            <button onClick={handleClose} style={{ width: '100%', padding: '12px', background: '#6B7C4A', color: '#fff', border: 'none', borderRadius: '12px', fontFamily: "'Georgia', serif", fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
              Tutup
            </button>
          </div>
        )}
      </div>
    </>
  );
}
 
// ── CartItem: tampilkan detail adds-on yang dipilih ──
function CartItem({ item, onSub }) {
  const unitPrice = Number(item.price) + Number(item.addonTotal || 0);
 
  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: '12px', boxShadow: '0 1px 6px rgba(61,43,31,0.07)', border: '1px solid #ede5d0' }}>
      <img src={item.image} alt={item.name} onError={e => { e.target.src = '/default-image.png'; }}
        style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, background: '#e8dcc8' }} />
 
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 2px', fontFamily: "'Georgia', serif", fontWeight: '700', fontSize: '13px', color: '#3d2b1f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.name}
        </p>
        <p style={{ margin: '0 0 3px', fontSize: '12px', color: '#6B7C4A', fontWeight: '700' }}>
          {formatPrice(item.price)}
        </p>
 
        {/* ✅ Tampilkan adds-on yang dipilih */}
        {item.selectedAddons && item.selectedAddons.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
            {item.selectedAddons.map(a => (
              <span key={a.id} style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '20px', background: '#e8f0da', color: '#3d5a1a', fontWeight: '600' }}>
                +{a.label}{a.price > 0 ? ` (+Rp${Number(a.price).toLocaleString('id-ID')})` : ''}
              </span>
            ))}
          </div>
        )}
 
        {/* Subtotal per item */}
        <p style={{ margin: 0, fontSize: '11px', color: '#9a8070' }}>
          Subtotal: <strong style={{ color: '#3d2b1f' }}>{formatPrice(unitPrice * item.qty)}</strong>
        </p>
      </div>
 
      {/* Qty + tombol kurang */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e53e3e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: '700' }}>
          {item.qty}
        </div>
        <button onClick={() => onSub(item.cartKey)}
          style={{ width: '24px', height: '24px', background: '#e2d5bb', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: '#3d2b1f', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
          −
        </button>
      </div>
    </div>
  );
}