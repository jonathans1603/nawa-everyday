import { useState, useEffect } from 'react';
 
const API = 'https://nawa-everyday-production.up.railway.app/api';
 
const STATUS_OPTIONS = [
  { value: 'Open',          label: '🟢 Open',          color: '#065f46', bg: '#d1fae5', border: '#6ee7b7' },
  { value: 'Closed',        label: '🔴 Closed',         color: '#991b1b', bg: '#fee2e2', border: '#fca5a5' },
  { value: 'Private Event', label: '🔒 Private Event',  color: '#92400e', bg: '#fef3c7', border: '#fcd34d' },
];
 
export default function AdminAbout() {
  const [stories, setStories]         = useState([]);
  const [dailyStatus, setDailyStatus] = useState('Open');
  const [loading, setLoading]         = useState(true);
  const [msg, setMsg]                 = useState(null);
 
  // Form tambah/edit
  const [form, setForm]         = useState({ title: '', content: '' });
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);
 
  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };
 
  // ── Fetch semua data ──
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [resStory, resStatus] = await Promise.all([
        fetch(`${API}/about`),
        fetch(`${API}/about/status`),
      ]);
      const stories = await resStory.json();
      const { daily_status } = await resStatus.json();
      setStories(Array.isArray(stories) ? stories : []);
      setDailyStatus(daily_status || 'Open');
    } catch {
      showMsg('error', 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { fetchAll(); }, []);
 
  // ── Update daily status ──
  const handleStatusChange = async (val) => {
    try {
      const res = await fetch(`${API}/about/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ daily_status: val }),
      });
      if (res.ok) {
        setDailyStatus(val);
        showMsg('success', `Status diubah ke "${val}"`);
      }
    } catch {
      showMsg('error', 'Gagal mengubah status');
    }
  };
 
  // ── Submit form tambah/edit ──
  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      showMsg('error', 'Title dan content tidak boleh kosong');
      return;
    }
    try {
      const url    = editId ? `${API}/about/${editId}` : `${API}/about`;
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showMsg('success', editId ? 'Story berhasil diupdate' : 'Story berhasil ditambahkan');
        setForm({ title: '', content: '' });
        setEditId(null);
        setShowForm(false);
        fetchAll();
      }
    } catch {
      showMsg('error', 'Gagal menyimpan story');
    }
  };
 
  const handleEdit = (s) => {
    setForm({ title: s.title, content: s.content });
    setEditId(s.id_blog);
    setShowForm(true);
  };
 
  const handleDelete = async (id) => {
    if (!window.confirm('Hapus story ini?')) return;
    try {
      const res = await fetch(`${API}/about/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMsg('success', 'Story berhasil dihapus');
        fetchAll();
      }
    } catch {
      showMsg('error', 'Gagal menghapus story');
    }
  };
 
  const cancelForm = () => {
    setForm({ title: '', content: '' });
    setEditId(null);
    setShowForm(false);
  };
 
  const statusInfo = STATUS_OPTIONS.find(s => s.value === dailyStatus) || STATUS_OPTIONS[0];
 
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
 
      {/* Notifikasi */}
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
 
      {/* ── Status Banner ── */}
      <div className="section-box">
        <div className="section-box-header">
          <span className="section-box-title">🏪 Status Restoran (Ditampilkan di About Us)</span>
        </div>
        <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '12px', color: '#7a6848', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
              Status saat ini
            </p>
            <span style={{
              display: 'inline-block', padding: '6px 16px', borderRadius: '20px',
              fontSize: '14px', fontWeight: 700,
              background: statusInfo.bg, color: statusInfo.color,
              border: `1.5px solid ${statusInfo.border}`,
            }}>
              {statusInfo.label}
            </span>
            <p style={{ fontSize: '11px', color: '#a89060', margin: '8px 0 0' }}>
              Status "Private Event" atau "Closed" akan menampilkan banner peringatan di halaman About Us.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleStatusChange(opt.value)}
                style={{
                  padding: '8px 18px', borderRadius: '8px', border: `1.5px solid ${opt.border}`,
                  background: dailyStatus === opt.value ? opt.bg : '#fffef5',
                  color: opt.color, fontSize: '13px', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: dailyStatus === opt.value ? `0 2px 8px ${opt.border}66` : 'none',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
 
      {/* ── Story Cards ── */}
      <div className="section-box">
        <div className="section-box-header">
          <span className="section-box-title">📖 Story Cards ({stories.length})</span>
          {!showForm && (
            <button className="primary-btn" onClick={() => setShowForm(true)}>+ Tambah Story</button>
          )}
        </div>
 
        {/* Form tambah/edit */}
        {showForm && (
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(200,185,122,0.25)', background: '#fffef5' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#3d2b1f', margin: '0 0 14px' }}>
              {editId ? '✏️ Edit Story' : '➕ Tambah Story Baru'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="form-label">Title</label>
                <input
                  className="form-input"
                  placeholder="Contoh: Who We Are"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="form-label">Content</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Deskripsi story..."
                  value={form.content}
                  onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  style={{ resize: 'vertical', lineHeight: 1.6 }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="primary-btn" onClick={handleSubmit}>
                  {editId ? '💾 Simpan Perubahan' : '➕ Tambah'}
                </button>
                <button
                  onClick={cancelForm}
                  style={{
                    padding: '9px 22px', borderRadius: '8px',
                    border: '1.5px solid rgba(200,185,122,0.5)',
                    background: '#f5f0e0', color: '#5a4a30',
                    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
 
        {loading ? (
          <p style={{ padding: '30px', textAlign: 'center', color: '#9a8070' }}>Memuat data...</p>
        ) : stories.length === 0 ? (
          <p style={{ padding: '30px', textAlign: 'center', color: '#9a8070' }}>Belum ada story. Tambahkan yang pertama!</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Content</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {stories.map((s, i) => (
                <tr key={s.id_blog}>
                  <td style={{ fontSize: '12px', color: '#a89060', width: '40px' }}>{i + 1}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#3d2b1f', fontSize: '13px' }}>{s.title}</div>
                  </td>
                  <td style={{ maxWidth: '320px' }}>
                    <div style={{ fontSize: '12px', color: '#7a6848', lineHeight: 1.5,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.content}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="action-btn action-btn-edit" onClick={() => handleEdit(s)}>✏️ Edit</button>
                      <button className="action-btn action-btn-del" onClick={() => handleDelete(s.id_blog)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
 