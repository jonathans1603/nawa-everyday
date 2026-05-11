import { useState, useEffect } from 'react';
 
const API = 'http://localhost:5000/api';
 
const CATEGORIES = [
  'Main Course', 'Coffee', 'Snack', 'Non Coffee', 'Salad', 'Noodle',
];
 
const formatPrice = (price) =>
  'Rp.' + Number(price).toLocaleString('id-ID');
 
const emptyForm = {
  name: '', category: '', price: '', desc: '', image: null,
};
 
// Satu baris addon kosong
const emptyAddon = { label: '', price: '' };
 
// ─────────────────────────────────────────────
// Komponen utama AdminMenu
// ─────────────────────────────────────────────
export default function AdminMenu() {
  const [menuList, setMenuList] = useState([]);
  const [form, setForm]         = useState(emptyForm);
  const [addons, setAddons]     = useState([]);        // array of { label, price }
  const [editId, setEditId]     = useState(null);
  const [preview, setPreview]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState(null);
 
  const fetchMenu = async () => {
    try {
      const res  = await fetch(`${API}/menu`);
      const data = await res.json();
      setMenuList(data);
    } catch {
      showMsg('error', 'Gagal memuat data menu');
    }
  };
 
  useEffect(() => { fetchMenu(); }, []);
 
  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
  };
 
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  };
 
  // ── Addon handlers ──
  const handleAddonChange = (idx, field, value) => {
    setAddons(prev => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a));
  };
  const addAddonRow    = () => setAddons(prev => [...prev, { ...emptyAddon }]);
  const removeAddonRow = (idx) => setAddons(prev => prev.filter((_, i) => i !== idx));
 
  // ── Klik Edit ──
  const handleEdit = (item) => {
    setEditId(item.menu_id);
    setForm({
      name:     item.menu_name,
      category: item.kategori_menu,
      price:    item.menu_price,
      desc:     item.deskripsi_menu || '',
      image:    null,
    });
    // Parse adds_on JSON
    try {
      const parsed = JSON.parse(item.adds_on || '[]');
      setAddons(Array.isArray(parsed) ? parsed.map(a => ({ label: a.label, price: String(a.price || 0) })) : []);
    } catch {
      // fallback: jika masih string lama, konversi
      const fallback = (item.adds_on || '').split(',').map(s => s.trim()).filter(Boolean).map(s => ({ label: s, price: '0' }));
      setAddons(fallback);
    }
    setPreview(item.gambar_menu ? `http://localhost:5000/uploads/${item.gambar_menu}` : null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
 
  const handleReset = () => {
    setEditId(null);
    setForm(emptyForm);
    setAddons([]);
    setPreview(null);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
 
    // Validasi addon: label tidak boleh kosong jika ada baris
    const cleanAddons = addons.filter(a => a.label.trim());
    const addonPayload = JSON.stringify(
      cleanAddons.map(a => ({
        id:    a.label.toLowerCase().replace(/\s+/g, '_'),
        label: a.label.trim(),
        price: Number(a.price) || 0,
      }))
    );
 
    const formData = new FormData();
    formData.append('menu_name',      form.name);
    formData.append('kategori_menu',  form.category);
    formData.append('menu_price',     form.price);
    formData.append('deskripsi_menu', form.desc);
    formData.append('adds_on',        addonPayload);
    if (form.image) formData.append('gambar_menu', form.image);
 
    try {
      const url    = editId ? `${API}/menu/${editId}` : `${API}/menu`;
      const method = editId ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, body: formData });
 
      if (res.ok) {
        showMsg('success', editId ? 'Menu berhasil diperbarui!' : 'Menu berhasil ditambahkan!');
        handleReset();
        fetchMenu();
      } else {
        const err = await res.json();
        showMsg('error', err.error || 'Terjadi kesalahan');
      }
    } catch {
      showMsg('error', 'Koneksi ke server gagal');
    } finally {
      setLoading(false);
    }
  };
 
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus menu ini?')) return;
    try {
      const res = await fetch(`${API}/menu/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMsg('success', 'Menu berhasil dihapus');
        setMenuList(prev => prev.filter(m => m.menu_id !== id));
        if (editId === id) handleReset();
      }
    } catch {
      showMsg('error', 'Gagal menghapus menu');
    }
  };
 
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Tersedia' ? 'Habis' : 'Tersedia';
    try {
      const res = await fetch(`${API}/menu/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setMenuList(prev => prev.map(m => m.menu_id === id ? { ...m, menu_status: newStatus } : m));
      }
    } catch {
      showMsg('error', 'Gagal mengubah status');
    }
  };
 
  // Parse adds_on untuk tampilan list
  const parseAddons = (raw) => {
    try {
      const parsed = JSON.parse(raw || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
 
  return (
    <div style={{ minHeight: '100vh', background: '#f0ebe0', fontFamily: "'Georgia', serif" }}>
 
      {/* Header */}
      <div style={{ background: '#3d2b1f', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ color: '#f5efe0', margin: 0, fontSize: '20px', fontWeight: '700' }}>
          🍽️ Admin — Manajemen Menu
        </h1>
        <span style={{ color: '#b5c98a', fontSize: '13px' }}>
          {menuList.length} menu terdaftar
        </span>
      </div>
 
      {/* Notifikasi */}
      {msg && (
        <div style={{
          margin: '16px 28px 0', padding: '12px 18px', borderRadius: '10px',
          background: msg.type === 'success' ? '#d4edda' : '#f8d7da',
          color:      msg.type === 'success' ? '#155724' : '#721c24',
          fontSize: '14px',
          border: `1px solid ${msg.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
        }}>
          {msg.type === 'success' ? '✅ ' : '❌ '}{msg.text}
        </div>
      )}
 
      <div style={{ display: 'flex', gap: '24px', padding: '24px 28px', flexWrap: 'wrap' }}>
 
        {/* ══ FORM ══ */}
        <div style={{ flex: '0 0 360px', background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(61,43,31,0.1)', alignSelf: 'flex-start' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '16px', color: '#3d2b1f', fontWeight: '700' }}>
            {editId ? '✏️ Edit Menu' : '➕ Tambah Menu Baru'}
          </h2>
 
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
 
            <div>
              <label style={labelStyle}>Nama Menu *</label>
              <input type="text" placeholder="contoh: Nasi Goreng Spesial" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required style={inputStyle} />
            </div>
 
            <div>
              <label style={labelStyle}>Kategori *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required style={inputStyle}>
                <option value="">-- Pilih Kategori --</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
 
            <div>
              <label style={labelStyle}>Harga (Rp) *</label>
              <input type="number" placeholder="contoh: 42000" value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required min="0" style={inputStyle} />
            </div>
 
            <div>
              <label style={labelStyle}>Deskripsi</label>
              <textarea placeholder="Deskripsi singkat menu..." value={form.desc}
                onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={3}
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
 
            {/* ══ ADDS ON DINAMIS ══ */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={labelStyle}>Add-ons (pilihan customer)</label>
                <button type="button" onClick={addAddonRow}
                  style={{ padding: '4px 12px', background: '#e8f0da', color: '#3d5a1a', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                  + Tambah
                </button>
              </div>
 
              {addons.length === 0 && (
                <p style={{ fontSize: '12px', color: '#b0a090', fontStyle: 'italic', margin: '4px 0 0' }}>
                  Belum ada add-on. Klik "+ Tambah" untuk menambahkan.
                </p>
              )}
 
              {addons.map((addon, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <input
                    type="text"
                    placeholder="Label (contoh: Tambah Telur)"
                    value={addon.label}
                    onChange={e => handleAddonChange(idx, 'label', e.target.value)}
                    style={{ ...inputStyle, flex: 2, margin: 0 }}
                  />
                  <input
                    type="number"
                    placeholder="Harga"
                    value={addon.price}
                    min="0"
                    onChange={e => handleAddonChange(idx, 'price', e.target.value)}
                    style={{ ...inputStyle, flex: 1, margin: 0 }}
                  />
                  <button type="button" onClick={() => removeAddonRow(idx)}
                    style={{ width: '28px', height: '28px', background: '#fde8e8', color: '#8b1a1a', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>
                    ✕
                  </button>
                </div>
              ))}
 
              {addons.length > 0 && (
                <p style={{ fontSize: '11px', color: '#9a8070', marginTop: '4px' }}>
                  💡 Harga 0 = gratis (tidak ada tambahan biaya)
                </p>
              )}
            </div>
 
            {/* Gambar */}
            <div>
              <label style={labelStyle}>Gambar Menu {editId ? '(kosongkan jika tidak diganti)' : '*'}</label>
              <input type="file" accept="image/*" onChange={handleImage} required={!editId}
                style={{ ...inputStyle, padding: '6px' }} />
              {preview && (
                <img src={preview} alt="preview"
                  style={{ marginTop: '8px', width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2d5bb' }} />
              )}
            </div>
 
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" disabled={loading}
                style={{ flex: 1, padding: '10px', background: loading ? '#aaa' : '#6B7C4A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Georgia', serif" }}>
                {loading ? 'Menyimpan...' : editId ? 'Update Menu' : 'Simpan Menu'}
              </button>
              {editId && (
                <button type="button" onClick={handleReset}
                  style={{ padding: '10px 16px', background: '#e2d5bb', color: '#3d2b1f', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontFamily: "'Georgia', serif" }}>
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>
 
        {/* ══ DAFTAR MENU ══ */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '16px', color: '#3d2b1f', fontWeight: '700' }}>
            📋 Daftar Menu
          </h2>
 
          {menuList.length === 0 ? (
            <p style={{ color: '#9a8070', textAlign: 'center', marginTop: '40px' }}>Belum ada menu.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {menuList.map(item => {
                const itemAddons = parseAddons(item.adds_on);
                return (
                  <div key={item.menu_id} style={{
                    background: '#fff', borderRadius: '12px', padding: '14px 16px',
                    display: 'flex', alignItems: 'flex-start', gap: '14px',
                    boxShadow: '0 2px 10px rgba(61,43,31,0.08)',
                    border: editId === item.menu_id ? '2px solid #6B7C4A' : '2px solid transparent',
                  }}>
                    <img
                      src={item.gambar_menu ? `http://localhost:5000/uploads/${item.gambar_menu}` : '/default-image.png'}
                      alt={item.menu_name} onError={e => { e.target.src = '/default-image.png'; }}
                      style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0, background: '#e8dcc8' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: '700', fontSize: '14px', color: '#3d2b1f' }}>{item.menu_name}</span>
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
                          background: item.menu_status === 'Tersedia' ? '#d4edda' : '#f8d7da',
                          color:      item.menu_status === 'Tersedia' ? '#155724' : '#721c24', fontWeight: '600' }}>
                          {item.menu_status || 'Tersedia'}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#9a8070', marginTop: '2px' }}>
                        {item.kategori_menu} · {formatPrice(item.menu_price)}
                      </div>
                      {/* Tampilkan addons */}
                      {itemAddons.length > 0 && (
                        <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                          {itemAddons.map((a, i) => (
                            <span key={i} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: '#e8f0da', color: '#3d5a1a', fontWeight: '600' }}>
                              +{a.label} {a.price > 0 ? `(Rp${Number(a.price).toLocaleString('id-ID')})` : '(gratis)'}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                      <button onClick={() => handleToggleStatus(item.menu_id, item.menu_status)}
                        style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '600',
                          background: item.menu_status === 'Tersedia' ? '#fff3cd' : '#d4edda',
                          color:      item.menu_status === 'Tersedia' ? '#856404'  : '#155724' }}>
                        {item.menu_status === 'Tersedia' ? '⚠️ Set Habis' : '✅ Set Tersedia'}
                      </button>
                      <button onClick={() => handleEdit(item)}
                        style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '600', background: '#e8f0da', color: '#3d5a1a' }}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(item.menu_id)}
                        style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '600', background: '#fde8e8', color: '#8b1a1a' }}>
                        🗑️ Hapus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 
const inputStyle = {
  width: '100%', padding: '9px 12px', border: '1.5px solid #e2d5bb',
  borderRadius: '8px', fontSize: '13px', color: '#3d2b1f',
  background: '#fdf9f4', fontFamily: "'Georgia', serif",
  boxSizing: 'border-box', outline: 'none',
};
 
const labelStyle = {
  display: 'block', fontSize: '12px', fontWeight: '600',
  color: '#7a6652', marginBottom: '5px',
};