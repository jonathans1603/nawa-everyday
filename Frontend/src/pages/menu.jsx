import { useState, useEffect } from 'react';
import Header from '../components/Header';
import logoImg from '../assets/logo.jpg';
import Cart from '../components/Cart';
 
const API = 'https://nawa-everyday-production.up.railway.app/api';
 
const categories = [
  { id: 'all',        label: 'All'        },
  { id: 'maincourse', label: 'Main Course' },
  { id: 'coffee',     label: 'Coffee'     },
  { id: 'snack',      label: 'Snack'      },
  { id: 'noncoffee',  label: 'Non Coffee' },
  { id: 'salad',      label: 'Salad'      },
  { id: 'noodle',     label: 'Noodle'     },
];
 
const formatPrice = (price) => 'Rp.' + Number(price).toLocaleString('id-ID');
 
// Parse adds_on dari JSON string → array [{id, label, price}]
const parseAddons = (raw) => {
  try {
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
 
// ── MenuCard ──
function MenuCard({ item, qty, onAdd, onSub, onOpenDetail }) {
  return (
    <div onClick={() => onOpenDetail(item)}
      style={{ background: '#f5efe0', borderRadius: '18px', boxShadow: '0 4px 18px rgba(61,43,31,0.13)', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.18s, box-shadow 0.18s', border: '1.5px solid #e2d5bb' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(61,43,31,0.2)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(61,43,31,0.13)'; }}
    >
      <div style={{ width: '100%', height: '160px', overflow: 'hidden', background: '#e8dcc8' }}>
        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => { e.target.src = '/default-image.png'; }} />
      </div>
      <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ fontFamily: "'Georgia', serif", fontWeight: '700', fontSize: '14px', color: '#3d2b1f', lineHeight: '1.3', flex: 1 }}>{item.name}</span>
          <span style={{ fontFamily: "'Georgia', serif", fontWeight: '700', fontSize: '13px', color: '#6B7C4A', whiteSpace: 'nowrap' }}>{formatPrice(item.price)}</span>
        </div>
        <p style={{ fontSize: '11.5px', color: '#7a6652', lineHeight: '1.45', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>{item.desc}</p>
        {/* Badge adds-on */}
        {item.addons.length > 0 && (
          <div style={{ fontSize: '10.5px', color: '#6B7C4A', marginTop: '2px' }}>
            ✨ {item.addons.length} pilihan add-on
          </div>
        )}
        <div style={{ marginTop: '10px' }} onClick={e => e.stopPropagation()}>
          {qty === 0 ? (
            <button onClick={() => onOpenDetail(item)}
              style={{ width: '100%', padding: '7px 0', background: '#6B7C4A', color: '#fff', border: 'none', borderRadius: '8px', fontFamily: "'Georgia', serif", fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#3d2b1f'} onMouseLeave={e => e.currentTarget.style.background = '#6B7C4A'}>
              Add
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#6B7C4A', borderRadius: '8px', padding: '4px 10px' }}>
              <button onClick={() => onSub(item.id)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer', fontWeight: '700', lineHeight: 1, padding: '0 4px' }}>−</button>
              <span style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>{qty}</span>
              <button onClick={() => onOpenDetail(item)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer', fontWeight: '700', lineHeight: 1, padding: '0 4px' }}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 
// ── DetailModal dengan pilihan Adds-On ──
function DetailModal({ item, onAddToCart, onClose }) {
  const [selectedAddons, setSelectedAddons] = useState([]);
 
  useEffect(() => {
    // Reset pilihan saat item berganti
    setSelectedAddons([]);
  }, [item?.id]);
 
  if (!item) return null;
 
  const toggleAddon = (addon) => {
    setSelectedAddons(prev => {
      const exists = prev.find(a => a.id === addon.id);
      if (exists) return prev.filter(a => a.id !== addon.id);
      return [...prev, addon];
    });
  };
 
  const addonTotal = selectedAddons.reduce((sum, a) => sum + Number(a.price || 0), 0);
  const totalPrice = Number(item.price) + addonTotal;
 
  const handleAdd = () => {
    onAddToCart(item, selectedAddons);
    onClose();
  };
 
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#f5efe0', borderRadius: '20px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.35)', overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
 
        {/* Gambar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img src={item.image} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'contain', background: '#e8dcc8' }} onError={e => { e.target.src = '/default-image.png'; }} />
          <button onClick={onClose} style={{ position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
 
        {/* Konten scroll */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '20px 22px' }}>
          {/* Nama & Harga */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <h2 style={{ fontFamily: "'Georgia', serif", fontSize: '20px', fontWeight: '700', color: '#3d2b1f', margin: 0, flex: 1 }}>{item.name}</h2>
            <span style={{ fontFamily: "'Georgia', serif", fontWeight: '700', fontSize: '16px', color: '#6B7C4A', marginLeft: '12px', flexShrink: 0 }}>{formatPrice(item.price)}</span>
          </div>
          <p style={{ fontSize: '13px', color: '#7a6652', lineHeight: '1.6', margin: '0 0 18px' }}>{item.desc}</p>
 
          {/* ── PILIHAN ADDS-ON ── */}
          {item.addons.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ flex: 1, height: '1px', background: '#e2d5bb' }} />
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#7a6652', whiteSpace: 'nowrap' }}>✨ Pilihan Add-on</span>
                <div style={{ flex: 1, height: '1px', background: '#e2d5bb' }} />
              </div>
 
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                {item.addons.map(addon => {
                  const isSelected = selectedAddons.find(a => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                        border: `2px solid ${isSelected ? '#6B7C4A' : '#e2d5bb'}`,
                        background: isSelected ? '#e8f0da' : '#fff',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Checkbox custom */}
                        <div style={{
                          width: '20px', height: '20px', borderRadius: '5px', border: `2px solid ${isSelected ? '#6B7C4A' : '#c0b898'}`,
                          background: isSelected ? '#6B7C4A' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s', flexShrink: 0,
                        }}>
                          {isSelected && <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700', lineHeight: 1 }}>✓</span>}
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#3d2b1f' }}>{addon.label}</span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: addon.price > 0 ? '#6B7C4A' : '#9a8070' }}>
                        {addon.price > 0 ? `+${formatPrice(addon.price)}` : 'Gratis'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
 
          {/* Ringkasan harga */}
          {selectedAddons.length > 0 && (
            <div style={{ background: '#e8f0da', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#7a6652', marginBottom: '4px' }}>
                <span>Harga menu</span><span>{formatPrice(item.price)}</span>
              </div>
              {selectedAddons.map(a => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#7a6652', marginBottom: '4px' }}>
                  <span>+ {a.label}</span><span>{a.price > 0 ? `+${formatPrice(a.price)}` : 'Gratis'}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #c8d8a8', marginTop: '6px', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '13px', color: '#3d5a1a' }}>
                <span>Total</span><span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          )}
        </div>
 
        {/* Tombol Add to Cart */}
        <div style={{ padding: '16px 22px', borderTop: '1px solid #e2d5bb', flexShrink: 0 }}>
          <button onClick={handleAdd}
            style={{ width: '100%', padding: '12px', background: '#6B7C4A', color: '#fff', border: 'none', borderRadius: '10px', fontFamily: "'Georgia', serif", fontWeight: '700', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onMouseEnter={e => e.currentTarget.style.background = '#3d2b1f'}
            onMouseLeave={e => e.currentTarget.style.background = '#6B7C4A'}>
            🛒 Tambah ke Keranjang
            {addonTotal > 0 && <span style={{ fontSize: '13px', opacity: 0.85 }}>— {formatPrice(totalPrice)}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
 
// ── FloatingCartButton ──
function FloatingCartButton({ totalItems, onClick }) {
  if (totalItems === 0) return null;
  return (
    <button onClick={onClick}
      style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 150, display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 22px', background: '#3d2b1f', color: '#f5efe0', border: 'none', borderRadius: '50px', boxShadow: '0 8px 32px rgba(61,43,31,0.45)', cursor: 'pointer', fontFamily: "'Georgia', serif", fontStyle: 'italic', fontWeight: '700', fontSize: '15px', transition: 'transform 0.2s, background 0.2s', animation: 'cartPop 0.3s ease' }}
      onMouseEnter={e => { e.currentTarget.style.background = '#6B7C4A'; e.currentTarget.style.transform = 'scale(1.05)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#3d2b1f'; e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <span style={{ fontSize: '20px' }}>🛒</span>
      <span>Keranjang</span>
      <span style={{ background: '#e53e3e', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', fontStyle: 'normal', fontFamily: 'sans-serif', flexShrink: 0 }}>{totalItems}</span>
    </button>
  );
}
 
// ─────────────────────────────────────────────
// Halaman Utama Menu
// ─────────────────────────────────────────────
export default function Menu({ onNavigate, cart, setCart, onTableResolved }) {
  const [menuData, setMenuData]             = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartOpen, setCartOpen]             = useState(false);
  const [detailItem, setDetailItem]         = useState(null);
 
  const [tableNumber, setTableNumber] = useState(0);
  const [tableId, setTableId]         = useState(null);
  const [tokenError, setTokenError]   = useState(false);
 
  const params  = new URLSearchParams(window.location.search);
  const qrToken = params.get('token') || '';
 
  useEffect(() => {
    if (!qrToken) return;
    const fetchTableByToken = async () => {
      try {
        const res  = await fetch(`${API}/tables/by-token/${qrToken}`);
        if (!res.ok) { setTokenError(true); return; }
        const data = await res.json();
        setTableNumber(data.table_number);
        setTableId(data.table_id);
        // ✅ kirim tableNumber DAN qrToken ke App.jsx
        if (onTableResolved) onTableResolved(data.table_number, data.qr_token);
      } catch {
        setTokenError(true);
      }
    };
    fetchTableByToken();
  }, [qrToken]);
 
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${API}/menu`);
        const data     = await response.json();
        const formattedData = data.map(item => ({
          id:       item.menu_id,
          category: item.kategori_menu.toLowerCase().replace(/\s+/g, ''),
          name:     item.menu_name,
          price:    item.menu_price,
          desc:     item.deskripsi_menu,
          image:    item.gambar_menu ? `https://nawa-everyday-production.up.railway.app/uploads/${item.gambar_menu}` : '/default-image.png',
          status:   item.menu_status,
          // ✅ Parse adds_on jadi array object
          addons:   parseAddons(item.adds_on),
        }));
        setMenuData(formattedData.filter(m => m.status === 'Tersedia'));
      } catch (err) {
        console.error('Gagal memuat menu:', err);
      }
    };
    fetchMenu();
  }, []);
 
  const filtered   = activeCategory === 'all' ? menuData : menuData.filter(item => item.category === activeCategory);
  const getQty     = (id) => cart.filter(c => c.id === id).reduce((sum, c) => sum + c.qty, 0);
  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
 
  // ── handleAdd: support addon per item ──
  // Setiap kombinasi item+addons = entry TERPISAH di cart
  const handleAddToCart = (item, selectedAddons = []) => {
    const addonTotal = selectedAddons.reduce((sum, a) => sum + Number(a.price || 0), 0);
    const addonKey   = selectedAddons.map(a => a.id).sort().join(',');
    const cartKey    = `${item.id}__${addonKey}`;
 
    setCart(prev => {
      const existing = prev.find(c => c.cartKey === cartKey);
      if (existing) return prev.map(c => c.cartKey === cartKey ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, {
        ...item,
        cartKey,
        qty:        1,
        selectedAddons,
        addonTotal,
        addonLabel: selectedAddons.map(a => a.label).join(', '),
        // ✅ pastikan price selalu Number
        price: Number(item.price),
      }];
    });
  };
 
  // handleAdd dari card (tanpa pilih addon → buka modal)
  const handleAdd = (item) => {
    setDetailItem(item);
  };
 
  const handleSub = (cartKey) => {
    setCart(prev => {
      const existing = prev.find(c => c.cartKey === cartKey);
      if (existing?.qty === 1) return prev.filter(c => c.cartKey !== cartKey);
      return prev.map(c => c.cartKey === cartKey ? { ...c, qty: c.qty - 1 } : c);
    });
  };
 
  return (
    <>
      <style>{`
        @keyframes cartPop {
          0%   { transform: scale(0.8); opacity: 0; }
          70%  { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
 
      <div className="flex flex-col min-h-screen" style={{ background: '#b5c98a' }}>
        <Header onCartClick={() => setCartOpen(true)} totalItems={totalItems} onNavigate={onNavigate} />
 
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside style={{ width: '130px', padding: '24px 12px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(0,0,0,0.08)', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              <img src={logoImg} alt="Logo" style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #6B7C4A', objectFit: 'cover' }} />
            </div>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                style={{ width: '100%', padding: '9px 8px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: "'Georgia', serif", fontWeight: activeCategory === cat.id ? '700' : '400', fontSize: '12.5px', background: activeCategory === cat.id ? '#6B7C4A' : 'rgba(255,255,255,0.45)', color: activeCategory === cat.id ? '#fff' : '#3d2b1f', transition: 'all 0.15s', textAlign: 'center' }}>
                {cat.label}
              </button>
            ))}
          </aside>
 
          {/* Main Grid */}
          <main style={{ flex: 1, padding: '24px', overflowY: 'auto', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(61,43,31,0.25)' }} />
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: '16px', fontStyle: 'italic', color: '#3d2b1f', margin: 0, whiteSpace: 'nowrap' }}>
                {categories.find(c => c.id === activeCategory)?.label}
              </h2>
              <div style={{ flex: 1, height: '1px', background: 'rgba(61,43,31,0.25)' }} />
            </div>
 
            {tokenError ? (
              <div style={{ marginBottom: '16px', padding: '10px 16px', background: '#f8d7da', color: '#721c24', borderRadius: '10px', fontSize: '13px', display: 'inline-block' }}>
                ⚠️ QR Code tidak valid atau sudah kadaluarsa
              </div>
            ) : tableNumber > 0 ? (
              <div style={{ marginBottom: '16px', padding: '10px 18px', background: 'rgba(255,255,255,0.7)', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(61,43,31,0.1)' }}>
                <span style={{ fontSize: '18px' }}>🪑</span>
                <span style={{ fontFamily: "'Georgia', serif", fontSize: '14px', fontWeight: '700', color: '#3d2b1f' }}>Meja {tableNumber}</span>
              </div>
            ) : qrToken ? (
              <div style={{ marginBottom: '16px', padding: '8px 14px', background: 'rgba(255,255,255,0.4)', borderRadius: '10px', display: 'inline-block', fontSize: '12px', color: '#7a6652' }}>
                ⏳ Memuat info meja...
              </div>
            ) : null}
 
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {filtered.length === 0 ? (
                <p style={{ color: '#3d2b1f', fontFamily: "'Georgia', serif", gridColumn: '1/-1', textAlign: 'center', marginTop: '40px' }}>
                  Tidak ada menu tersedia.
                </p>
              ) : (
                filtered.map(item => (
                  <MenuCard key={item.id} item={item} qty={getQty(item.id)} onAdd={handleAdd} onSub={handleSub} onOpenDetail={setDetailItem} />
                ))
              )}
            </div>
          </main>
        </div>
 
        {/* ✅ DetailModal baru dengan pilihan adds-on */}
        <DetailModal
          item={detailItem}
          onAddToCart={handleAddToCart}
          onClose={() => setDetailItem(null)}
        />
 
        <FloatingCartButton totalItems={totalItems} onClick={() => setCartOpen(true)} />
 
        <Cart
          open={cartOpen}
          cart={cart}
          tableNumber={tableNumber}
          qrToken={qrToken}
          onClose={() => setCartOpen(false)}
          onAdd={handleAddToCart}
          onSub={handleSub}
          onClear={() => setCart([])}
          onNavigate={onNavigate}
        />
      </div>
    </>
  );
}