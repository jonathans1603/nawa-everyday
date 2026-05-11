import Header from '../components/Header';
 
function formatPrice(p) {
  return 'Rp.' + Number(p).toLocaleString('id-ID') + ',00';
}
 
export default function CashConfirmation({ cart, totalPrice, orderId, tableNumber, onNavigate }) {
  return (
    <div style={{ minHeight: '100vh', background: '#e8e0cc', fontFamily: 'sans-serif' }}>
 
      <Header activePage="" onNavigate={onNavigate} />
 
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{
          width: '100%', maxWidth: 600,
          background: '#f0ead8', borderRadius: 16,
          border: '1.5px solid #c8b898',
          boxShadow: '0 4px 24px rgba(80,60,20,0.12)',
          overflow: 'hidden',
        }}>
 
          {/* Title bar */}
          <div style={{ background: '#6B7C4A', padding: '16px 24px' }}>
            <h2 style={{ color: 'white', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, margin: 0 }}>
              Cash
            </h2>
          </div>
 
          {/* Thank you message */}
          <div style={{ padding: '24px', textAlign: 'center', borderBottom: '1px solid #d4c8a8' }}>
            <p style={{ color: '#2d1f0a', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              Terima kasih sudah memesan, Silahkan<br />membayar di Kasir
            </p>
          </div>
 
          {/* No. Pesanan + No. Meja */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #d4c8a8' }}>
            <p style={{ color: '#2d1f0a', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>
              No.Pesanan : {orderId ?? '-'}
            </p>
            <p style={{ color: '#2d1f0a', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 16, fontWeight: 600, margin: 0 }}>
              No.Meja : {tableNumber ?? '-'}
            </p>
          </div>
 
          {/* Item list */}
          <div>
            {cart.map((item, idx) => {
              // ✅ Gunakan selectedAddons (bukan addons + ADDON_MAP lama)
              const addons = item.selectedAddons || [];
 
              return (
                <div key={item.cartKey || idx} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  padding: '14px 24px',
                  borderBottom: idx < cart.length - 1 ? '1px solid #d4c8a8' : 'none',
                  background: idx % 2 === 0 ? '#f0ead8' : '#e8e0cc',
                }}>
                  {/* Nama & add-ons */}
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#2d1f0a' }}>
                      {item.name}
                    </p>
                    {/* ✅ Tampilkan selectedAddons sebagai tag */}
                    {addons.length > 0 && (
                      <div style={{ marginTop: '5px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {addons.map(a => (
                          <span key={a.id} style={{
                            fontSize: '10px', padding: '2px 7px', borderRadius: '20px',
                            background: '#d4e4b8', color: '#2d4a10', fontWeight: '600',
                          }}>
                            +{a.label}{a.price > 0 ? ` (+Rp${Number(a.price).toLocaleString('id-ID')})` : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
 
                  {/* Harga + qty badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 16, flexShrink: 0 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#2d1f0a' }}>
                      {/* ✅ Number() agar tidak ada bug string + number */}
                      {formatPrice((Number(item.price) + Number(item.addonTotal || 0)) * item.qty)}
                    </p>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: '#6B7C4A', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700,
                    }}>
                      {item.qty}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
 
          {/* Total */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 24px',
            background: '#f0ead8',
            borderTop: '1.5px solid #c8b898',
            borderBottom: '1px solid #d4c8a8',
          }}>
            <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 20, fontWeight: 700, color: '#2d1f0a' }}>
              Total :
            </p>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 18, color: '#2d1f0a' }}>
              {formatPrice(totalPrice)}
            </p>
          </div>
 
          {/* Feedback button */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px', background: '#e8e0cc' }}>
            <button
              onClick={() => onNavigate('feedback')}
              style={{
                padding: '12px 48px', borderRadius: 12,
                border: '2px solid #4a5c2a', background: '#6B7C4A',
                color: 'white', fontSize: 18,
                fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 700,
                cursor: 'pointer', letterSpacing: 0.5,
                transition: 'background 0.2s',
                boxShadow: '0 2px 8px rgba(74,92,42,0.18)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#4a5c2a'}
              onMouseLeave={e => e.currentTarget.style.background = '#6B7C4A'}
            >
              Feedback
            </button>
          </div>
 
        </div>
      </div>
    </div>
  );
}