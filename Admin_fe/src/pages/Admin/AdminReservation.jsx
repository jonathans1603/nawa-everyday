import { useState, useEffect } from 'react';

const API = 'https://nawa-everyday-production.up.railway.app/api';

const statusConfig = {
  Menunggu:     { badge: 'badge-yellow', dot: '#f59e0b', label: 'Menunggu' },
  Dikonfirmasi: { badge: 'badge-green',  dot: '#10b981', label: 'Dikonfirmasi' },
  Ditolak:      { badge: 'badge-red',    dot: '#ef4444', label: 'Ditolak' },
  Selesai:      { badge: 'badge-blue',   dot: '#3b82f6', label: 'Selesai' },
};

const eventColors = {
  'Ulang Tahun': '#c8b97a',
  'Syukuran':    '#6B7C4A',
  'Lamaran':     '#ec4899',
  'Wisuda':      '#8b5cf6',
  'Gathering':   '#f97316',
  'Meeting':     '#3b82f6',
};

const eventIcons = {
  'Ulang Tahun': '🎂',
  'Syukuran':    '🙏',
  'Lamaran':     '💍',
  'Wisuda':      '🎓',
  'Gathering':   '🎉',
  'Meeting':     '💼',
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function StatCard({ icon, num, label, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-num">{num}</div>
      <div className="stat-label">{label}</div>
      {sub && <div style={{ fontSize: '11px', color: '#a89060', marginTop: '2px' }}>{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.Menunggu;
  return (
    <span className={`badge ${cfg.badge}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
      {cfg.label}
    </span>
  );
}

function DetailRow({ label, value, mono }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '9px 0', borderBottom: '1px solid rgba(200,185,122,0.15)', gap: '12px',
    }}>
      <span style={{ fontSize: '11px', color: '#7a6848', fontWeight: 600, whiteSpace: 'nowrap', minWidth: '100px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        {label}
      </span>
      <span style={{ fontSize: '13px', color: '#3d2b1f', fontWeight: 500, textAlign: 'right', fontFamily: mono ? 'monospace' : 'inherit', lineHeight: 1.5 }}>
        {value}
      </span>
    </div>
  );
}

function WhatsAppBtn({ phone, name, eventType, date }) {
  const msg = encodeURIComponent(
    `Halo ${name}, kami dari Nawa Everyday ingin mengkonfirmasi reservasi event *${eventType}* Anda pada tanggal *${date}*. Mohon balas pesan ini untuk detail lebih lanjut. Terima kasih! 🌿`
  );
  return (
    <a
      href={`https://wa.me/62${String(phone).replace(/^0/, '')}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        width: '100%', padding: '10px', borderRadius: '8px',
        background: '#25D366', color: 'white',
        fontSize: '13px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
        textDecoration: 'none', transition: 'all 0.2s',
        boxShadow: '0 2px 8px rgba(37,211,102,0.3)',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#1aad4f'}
      onMouseLeave={e => e.currentTarget.style.background = '#25D366'}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      Hubungi via WhatsApp
    </a>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AdminReservation() {
  const [items, setItems]           = useState([]);
  const [selected, setSelected]     = useState(null);
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [filterEvent, setFilterEvent]   = useState('Semua');
  const [search, setSearch]         = useState('');
  const [sortBy, setSortBy]         = useState('submittedAt');
  const [loading, setLoading]       = useState(true);
  const [msg, setMsg]               = useState(null);

  // ── Notifikasi ──
  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  // ── Fetch semua reservasi ──
  const fetchReservasi = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/reservasi`);
      const data = await res.json();
      // Normalisasi field dari DB ke format komponen
      const formatted = data.map(r => ({
        id:          r.id_reservasi,
        name:        r.name,
        phone:       String(r.phone),
        email:       r.email || '',
        eventType:   r.event_type,
        eventIcon:   eventIcons[r.event_type] || '📋',
        date:        r.date,
        time:        r.time ? r.time.substring(0, 5) : '-',
        guests:      r.guest,
        notes:       r.notes || '',
        status:      r.status || 'Menunggu',
        submittedAt: formatDateTime(r.submited_time || r.created_at),
      }));
      setItems(formatted);
    } catch {
      showMsg('error', 'Gagal memuat data reservasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReservasi(); }, []);

  // ── Derived ──
  const eventTypeList = ['Semua', ...new Set(items.map(r => r.eventType))];
  const statuses      = ['Semua', 'Menunggu', 'Dikonfirmasi', 'Ditolak', 'Selesai'];

  const filtered = items
    .filter(r => filterStatus === 'Semua' || r.status === filterStatus)
    .filter(r => filterEvent  === 'Semua' || r.eventType === filterEvent)
    .filter(r =>
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search) ||
      r.eventType.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'submittedAt') return b.submittedAt.localeCompare(a.submittedAt);
      if (sortBy === 'date')        return (a.date || '').localeCompare(b.date || '');
      if (sortBy === 'guests')      return b.guests - a.guests;
      return 0;
    });

  // ── Update status ke DB ──
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/reservasi/status/${id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      });
      if (res.ok) {
        setItems(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
        showMsg('success', `Status diubah ke "${status}"`);
      }
    } catch {
      showMsg('error', 'Gagal mengubah status');
    }
  };

  // ── Hapus reservasi ──
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus reservasi dari ${name}?`)) return;
    try {
      const res = await fetch(`${API}/reservasi/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(prev => prev.filter(r => r.id !== id));
        if (selected?.id === id) setSelected(null);
        showMsg('success', 'Reservasi berhasil dihapus');
      }
    } catch {
      showMsg('error', 'Gagal menghapus reservasi');
    }
  };

  const menunggu     = items.filter(r => r.status === 'Menunggu').length;
  const dikonfirmasi = items.filter(r => r.status === 'Dikonfirmasi').length;
  const totalTamu    = items.filter(r => r.status === 'Dikonfirmasi').reduce((a, b) => a + Number(b.guests), 0);

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

      {/* ── STAT CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <StatCard icon="📋" num={items.length}  label="Total Reservasi"  sub="dari formulir" />
        <StatCard icon="⏳" num={menunggu}        label="Menunggu Review"  sub="perlu tindakan" />
        <StatCard icon="✅" num={dikonfirmasi}     label="Dikonfirmasi"     sub="acara terjadwal" />
        <StatCard icon="👥" num={totalTamu}        label="Total Tamu"       sub="acara confirmed" />
      </div>

      {/* ── INFO BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(107,124,74,0.12), rgba(200,185,122,0.1))',
        border: '1.5px solid rgba(107,124,74,0.25)',
        borderRadius: '12px', padding: '12px 18px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <span style={{ fontSize: '1.3rem' }}>📋</span>
        <div>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#3d2b1f' }}>
            Data Reservasi Langsung dari Database
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#7a6848' }}>
            Semua data berasal dari formulir reservasi event Nawa Everyday. Konfirmasi peserta via WhatsApp setelah direview.
          </p>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '11px', color: '#7a6848' }}>Terakhir sync</p>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#6B7C4A' }}>
            {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div style={{
        background: 'rgba(255,254,245,0.8)', borderRadius: '12px',
        border: '1.5px solid rgba(200,185,122,0.25)', padding: '14px 18px',
        display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '180px' }}>
          <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#a89060', fontSize: '13px' }}>🔍</span>
          <input
            className="form-input"
            style={{ paddingLeft: '30px', padding: '8px 12px 8px 30px', width: '100%', boxSizing: 'border-box' }}
            placeholder="Cari nama, nomor, acara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: '6px 14px', borderRadius: '20px', border: '1.5px solid',
                borderColor: filterStatus === s ? '#6B7C4A' : 'rgba(200,185,122,0.4)',
                background:  filterStatus === s ? '#6B7C4A' : 'transparent',
                color:       filterStatus === s ? '#f0ebd0' : '#5a4a30',
                fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >{s}</button>
          ))}
        </div>

        {/* Event type filter */}
        <select
          className="form-input"
          style={{ width: 'auto', padding: '7px 12px', minWidth: '140px' }}
          value={filterEvent}
          onChange={e => setFilterEvent(e.target.value)}
        >
          {eventTypeList.map(e => <option key={e}>{e}</option>)}
        </select>

        {/* Sort */}
        <select
          className="form-input"
          style={{ width: 'auto', padding: '7px 12px' }}
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="submittedAt">Terbaru masuk</option>
          <option value="date">Tanggal acara</option>
          <option value="guests">Jumlah tamu</option>
        </select>
      </div>

      {/* ── MAIN CONTENT: TABLE + DETAIL PANEL ── */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '20px', alignItems: 'flex-start' }}>

        {/* TABLE */}
        <div className="section-box">
          <div className="section-box-header">
            <span className="section-box-title">
              Daftar Reservasi Event
              <span style={{ marginLeft: '8px', fontSize: '12px', color: '#7a6848', fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>
                ({filtered.length} entri)
              </span>
            </span>
            {menunggu > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef3c7', padding: '5px 12px', borderRadius: '20px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#92400e', fontFamily: "'DM Sans', sans-serif" }}>
                  {menunggu} menunggu review
                </span>
              </div>
            )}
          </div>

          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <p style={{ padding: '48px', textAlign: 'center', color: '#a89060' }}>Memuat data...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '36px' }}>#</th>
                    <th>Pemesan</th>
                    <th>Jenis Acara</th>
                    <th>Tanggal & Waktu</th>
                    <th>Tamu</th>
                    <th>Masuk</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: '#a89060' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📭</div>
                        Tidak ada reservasi ditemukan
                      </td>
                    </tr>
                  ) : filtered.map((r, i) => (
                    <tr
                      key={r.id}
                      style={{
                        cursor: 'pointer',
                        background: selected?.id === r.id ? 'rgba(107,124,74,0.06)' : 'transparent',
                      }}
                      onClick={() => setSelected(selected?.id === r.id ? null : r)}
                    >
                      <td style={{ color: '#a89060', fontSize: '11px' }}>{i + 1}</td>

                      {/* Pemesan */}
                      <td>
                        <div style={{ fontWeight: 700, color: '#3d2b1f', fontSize: '13px' }}>{r.name}</div>
                        <div style={{ fontSize: '11px', color: '#7a6848', marginTop: '2px' }}>📞 {r.phone}</div>
                      </td>

                      {/* Jenis Acara */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '8px',
                            background: `${eventColors[r.eventType] || '#ccc'}22`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px', flexShrink: 0,
                            border: `1px solid ${eventColors[r.eventType] || '#ccc'}44`,
                          }}>
                            {r.eventIcon}
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: eventColors[r.eventType] || '#5a4a30' }}>
                            {r.eventType}
                          </span>
                        </div>
                      </td>

                      {/* Tanggal */}
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: '#3d2b1f' }}>
                          {r.date ? new Date(r.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#7a6848' }}>🕐 {r.time} WIB</div>
                      </td>

                      {/* Tamu */}
                      <td>
                        <span style={{ fontWeight: 700, color: '#6B7C4A', fontSize: '14px' }}>{r.guests}</span>
                        <span style={{ fontSize: '11px', color: '#7a6848' }}> org</span>
                      </td>

                      {/* Masuk */}
                      <td style={{ fontSize: '11px', color: '#a89060', whiteSpace: 'nowrap' }}>{r.submittedAt}</td>

                      {/* Status */}
                      <td><StatusBadge status={r.status} /></td>

                      {/* Aksi */}
                      <td onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {r.status === 'Menunggu' && (
                            <>
                              <button className="action-btn action-btn-view" title="Konfirmasi" onClick={() => updateStatus(r.id, 'Dikonfirmasi')}>✅</button>
                              <button className="action-btn action-btn-del"  title="Tolak"      onClick={() => updateStatus(r.id, 'Ditolak')}>❌</button>
                            </>
                          )}
                          {r.status === 'Dikonfirmasi' && (
                            <button className="action-btn action-btn-edit" title="Tandai Selesai" onClick={() => updateStatus(r.id, 'Selesai')}>🏁</button>
                          )}
                          <button
                            className="action-btn"
                            title="Lihat detail"
                            style={{ background: selected?.id === r.id ? '#e8dfc0' : '#f5f0e0', color: '#5a4a30' }}
                            onClick={() => setSelected(selected?.id === r.id ? null : r)}
                          >👁️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── DETAIL PANEL ── */}
        {selected && (
          <div className="section-box" style={{ position: 'sticky', top: '20px' }}>
            <div className="section-box-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span className="section-box-title">Detail Reservasi</span>
                <button onClick={() => setSelected(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#7a6848', lineHeight: 1 }}>✕</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: `${eventColors[selected.eventType] || '#ccc'}22`,
                  border: `2px solid ${eventColors[selected.eventType] || '#ccc'}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
                }}>
                  {selected.eventIcon}
                </div>
                <div>
                  <p style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3d2b1f', fontSize: '15px' }}>
                    {selected.eventType}
                  </p>
                  <StatusBadge status={selected.status} />
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '0' }}>
              <DetailRow label="👤 Nama"     value={selected.name} />
              <DetailRow label="📞 WhatsApp" value={selected.phone} mono />
              <DetailRow label="✉️ Email"    value={selected.email || '—'} />
              <DetailRow label="📅 Tanggal"  value={selected.date ? new Date(selected.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'} />
              <DetailRow label="🕐 Waktu"    value={selected.time + ' WIB'} />
              <DetailRow label="👥 Tamu"     value={selected.guests + ' orang'} />
              <DetailRow label="📤 Diterima" value={selected.submittedAt} />

              {selected.notes && (
                <div style={{ marginTop: '12px', marginBottom: '4px' }}>
                  <p style={{ fontSize: '11px', color: '#7a6848', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', margin: '0 0 6px' }}>
                    📝 Catatan dari Pemesan
                  </p>
                  <div style={{
                    background: 'linear-gradient(135deg, #f5f0e0, #ede5cc)',
                    borderRadius: '10px', padding: '12px 14px',
                    fontSize: '13px', color: '#3d2b1f', lineHeight: 1.65,
                    fontStyle: 'italic', borderLeft: '3px solid #c8b97a',
                  }}>
                    "{selected.notes}"
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                <WhatsAppBtn
                  phone={selected.phone}
                  name={selected.name}
                  eventType={selected.eventType}
                  date={selected.date ? new Date(selected.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                />

                {selected.status === 'Menunggu' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button className="primary-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      onClick={() => updateStatus(selected.id, 'Dikonfirmasi')}>
                      ✅ Konfirmasi
                    </button>
                    <button className="action-btn action-btn-del" style={{ padding: '9px', fontSize: '12px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      onClick={() => updateStatus(selected.id, 'Ditolak')}>
                      ❌ Tolak
                    </button>
                  </div>
                )}

                {selected.status === 'Dikonfirmasi' && (
                  <button className="action-btn action-btn-edit" style={{ padding: '10px', fontSize: '12px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    onClick={() => updateStatus(selected.id, 'Selesai')}>
                    🏁 Tandai Selesai
                  </button>
                )}

                {(selected.status === 'Ditolak' || selected.status === 'Selesai') && (
                  <button className="action-btn" style={{ padding: '10px', fontSize: '12px', width: '100%', background: '#f5f0e0', color: '#5a4a30', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    onClick={() => updateStatus(selected.id, 'Menunggu')}>
                    🔄 Kembalikan ke Menunggu
                  </button>
                )}

                <button
                  style={{
                    padding: '8px', borderRadius: '8px', border: 'none',
                    background: 'none', color: '#a89060', fontSize: '12px',
                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.color = '#a89060'}
                  onClick={() => handleDelete(selected.id, selected.name)}
                >
                  🗑️ Hapus Reservasi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
