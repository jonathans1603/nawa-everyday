import { useState, useEffect } from 'react';
 
const API = 'http://localhost:5000/api';
 
const roleColor = {
  admin:   'bg-red-100 text-red-700 border-red-200',
  kasir:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  dapur:   'bg-green-100 text-green-700 border-green-200',
  kitchen: 'bg-green-100 text-green-700 border-green-200',
  owner:   'bg-purple-100 text-purple-700 border-purple-200',
};
 
const ROLES = ['admin', 'kasir', 'dapur', 'owner'];
 
export default function AdminUser() {
  const [users, setUsers]       = useState([]);
  const [search, setSearch]     = useState('');
  const [msg, setMsg]           = useState(null);
 
  // State untuk modal edit
  const [editUser, setEditUser]   = useState(null); // user yang sedang diedit
  const [editForm, setEditForm]   = useState({ password: '', role: '' });
 
  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };
 
  // ── Fetch semua user ──
  const fetchUsers = async () => {
    try {
      const res  = await fetch(`${API}/users`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    }
  };
 
  useEffect(() => { fetchUsers(); }, []);
 
  // ── Filter search ──
  const filtered = users.filter(u =>
    (u.username?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (u.role?.toLowerCase()     || '').includes(search.toLowerCase())
  );
 
  // ── Hapus user ──
  const handleDelete = async (id, username) => {
    if (!window.confirm(`Hapus user "${username}"?`)) return;
    try {
      const res = await fetch(`${API}/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showMsg('success', data.message);
        setUsers(prev => prev.filter(u => u.user_id !== id));
      } else {
        showMsg('error', data.message);
      }
    } catch {
      showMsg('error', 'Koneksi ke server gagal');
    }
  };
 
  // ── Buka modal edit ──
  const handleEditOpen = (user) => {
    setEditUser(user);
    setEditForm({ password: '', role: user.role });
  };
 
  // ── Simpan edit ──
  const handleEditSave = async () => {
    if (!editForm.role) { showMsg('error', 'Role wajib dipilih'); return; }
    try {
      const res = await fetch(`${API}/users/${editUser.user_id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: editForm.password || editUser.password, // jika kosong, password lama
          role:     editForm.role,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg('success', 'User berhasil diupdate');
        setEditUser(null);
        fetchUsers();
      } else {
        showMsg('error', data.message);
      }
    } catch {
      showMsg('error', 'Koneksi ke server gagal');
    }
  };
 
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
 
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
 
      {/* ── Header ── */}
      <div className="section-box" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontWeight: '700', fontSize: '16px', color: '#3d2b1f', margin: 0 }}>User Management</h2>
            <p style={{ fontSize: '12px', color: '#9a8070', margin: '3px 0 0' }}>
              Kelola akun Admin, Kasir, Dapur, dan Owner — {users.length} user terdaftar
            </p>
          </div>
          <input
            type="text"
            placeholder="🔍 Cari username atau role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '9px 14px', border: '1.5px solid #e2d5bb',
              borderRadius: '8px', fontSize: '13px', color: '#3d2b1f',
              background: '#fdf9f4', outline: 'none', width: '260px',
            }}
          />
        </div>
      </div>
 
      {/* ── Tabel ── */}
      <div className="section-box">
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Password</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#9a8070' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👤</div>
                    Tidak ada user ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map(u => (
                  <tr key={u.user_id}>
                    <td style={{ color: '#a89060', fontSize: '12px' }}>#{u.user_id}</td>
                    <td style={{ fontWeight: '600', color: '#3d2b1f' }}>{u.username}</td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${roleColor[u.role?.toLowerCase()] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ color: '#ccc', letterSpacing: '3px', fontSize: '11px' }}>••••••••</td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button
                          onClick={() => handleEditOpen(u)}
                          style={{ padding: '5px 10px', background: '#e8f0da', color: '#3d5a1a', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(u.user_id, u.username)}
                          style={{ padding: '5px 10px', background: '#fde8e8', color: '#8b1a1a', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                          🗑️ Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
 
      {/* ── Modal Edit ── */}
      {editUser && (
        <div onClick={() => setEditUser(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#f5efe0', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '380px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
 
            <h3 style={{ fontFamily: "'Georgia',serif", fontSize: '18px', color: '#3d2b1f', margin: '0 0 20px' }}>
              ✏️ Edit User — <em>{editUser.username}</em>
            </h3>
 
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Password baru (opsional) */}
              <div>
                <label style={labelStyle}>Password Baru <span style={{ color: '#9a8070', fontWeight: '400' }}>(kosongkan jika tidak diganti)</span></label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={editForm.password}
                  onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))}
                  style={inputStyle}
                />
              </div>
 
              {/* Role */}
              <div>
                <label style={labelStyle}>Role *</label>
                <select
                  value={editForm.role}
                  onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                  style={inputStyle}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
 
              {/* Tombol */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button onClick={handleEditSave}
                  style={{ flex: 1, padding: '10px', background: '#6B7C4A', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Georgia',serif" }}>
                  Simpan
                </button>
                <button onClick={() => setEditUser(null)}
                  style={{ padding: '10px 18px', background: '#e2d5bb', color: '#3d2b1f', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 
const inputStyle = {
  width: '100%', padding: '9px 12px',
  border: '1.5px solid #e2d5bb', borderRadius: '8px',
  fontSize: '13px', color: '#3d2b1f', background: '#fdf9f4',
  fontFamily: 'sans-serif', boxSizing: 'border-box', outline: 'none',
};
 
const labelStyle = {
  display: 'block', fontSize: '12px', fontWeight: '600',
  color: '#7a6652', marginBottom: '5px',
};