import { useState } from 'react';
import Header  from '../components/Header';
import cafeImg from '../assets/background_satu.png';
import logoImg  from '../assets/logo.jpg';

const API = 'https://nawa-everyday-production.up.railway.app/api';

const eventTypes = [
  { icon: '🎂', label: 'Ulang Tahun' },
  { icon: '🙏', label: 'Syukuran'    },
  { icon: '💍', label: 'Lamaran'     },
  { icon: '🎓', label: 'Wisuda'      },
  { icon: '🎉', label: 'Gathering'   },
  { icon: '💼', label: 'Meeting'     },
];

const steps = [
  { num: '01', title: 'Isi Formulir',      desc: 'Isi formulir reservasi event dengan lengkap di bawah ini.' },
  { num: '02', title: 'Tunggu Konfirmasi', desc: 'Tim Nawa Everyday akan menghubungi kamu via WhatsApp dalam 1x24 jam.' },
  { num: '03', title: 'Datang & Rayakan', desc: 'Hadir di Nawa Everyday dan nikmati momen spesialmu bersama orang tersayang.' },
];

export default function Reservation({ onNavigate }) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    event_type: '', date: '', time: '',
    guest: '', notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState(null);

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi wajib
    if (!form.name.trim() || !form.phone.trim() || !form.event_type || !form.date || !form.time || !form.guest) {
      setError('Harap lengkapi semua field yang wajib diisi (*).');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/reservasi`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: '', phone: '', email: '', event_type: '', date: '', time: '', guest: '', notes: '' });
      } else {
        const err = await res.json();
        setError(err.error || 'Gagal mengirim reservasi.');
      }
    } catch {
      setError('Koneksi ke server gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#f0f4ec', fontFamily: "'Georgia', serif" }}>
      <Header activePage="reservation" onNavigate={onNavigate} />

      {/* ── Hero Banner ── */}
      <div className="relative w-full overflow-hidden" style={{ height: 300 }}>
        <img src={cafeImg} alt="Nawa Reservation" className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(30,20,10,0.78) 100%)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-6">
          <div className="px-8 py-2 mb-4 rounded-full"
            style={{ background: 'rgba(117, 158, 115, 0.28)', border: '1px solid rgba(255,255,255,0.3)' }}>
            <span style={{ color: '#e8d9b8', fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'sans-serif', fontStyle: 'normal' }}>
              Private Event
            </span>
          </div>
          <h1 className="text-white text-center italic"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', textShadow: '0 2px 16px rgba(0,0,0,0.5)', margin: 0, lineHeight: 1.2 }}>
            Reservation
          </h1>
          <p className="text-center mt-3"
            style={{ color: '#b8ccaa', fontSize: 14, fontFamily: 'sans-serif', fontStyle: 'normal', maxWidth: 480, lineHeight: 1.6 }}>
            Rayakan momen spesialmu bersama orang tersayang di Nawa Everyday
          </p>
        </div>
      </div>

      {/* ── Event Types ── */}
      <div className="w-full py-10 px-6" style={{ background: '#2d3d20' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-center mb-6"
            style={{ color: '#7a9c5a', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
            Jenis Acara
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {eventTypes.map((e, i) => (
              <div key={i} className="flex flex-col items-center gap-2 py-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(107,140,60,0.15)' }}>
                <span style={{ fontSize: 24 }}>{e.icon}</span>
                <span style={{ color: '#7a9c5a', fontSize: 11, fontFamily: 'sans-serif', textAlign: 'center' }}>{e.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="max-w-3xl mx-auto px-6 py-14">
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px" style={{ background: '#7a9c5a', opacity: 0.4 }} />
          <span style={{ color: '#4a6b30', fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'sans-serif', whiteSpace: 'nowrap' }}>
            Cara Reservasi
          </span>
          <div className="flex-1 h-px" style={{ background: '#7a9c5a', opacity: 0.4 }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col rounded-2xl overflow-hidden"
              style={{ background: '#eef3e8', border: '1.5px solid rgba(74,107,48,0.18)', boxShadow: '0 4px 24px rgba(40,70,20,0.08)' }}>
              <div style={{ height: 4, background: '#6B7C4A' }} />
              <div className="p-6">
                <span style={{ fontSize: 38, fontFamily: 'Georgia, serif', color: '#6B7C4A', opacity: 0.18, fontWeight: 700, lineHeight: 1, display: 'block', marginBottom: 8 }}>
                  {s.num}
                </span>
                <h3 style={{ color: '#2d3d20', fontSize: 16, fontFamily: 'Georgia, serif', fontStyle: 'italic', margin: '0 0 8px' }}>
                  {s.title}
                </h3>
                <p style={{ color: '#3d5228', fontSize: 13, lineHeight: 1.75, fontFamily: 'sans-serif', margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA Card + Form ── */}
        <div className="rounded-3xl overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(30,50,18,0.15)' }}>

          {/* Header card */}
          <div className="flex flex-col items-center py-10 px-8 text-center" style={{ background: '#2d3d20' }}>
            <img src={logoImg} alt="Nawa" className="rounded-full object-cover mb-5"
              style={{ width: 72, height: 72, border: '3px solid rgba(107,140,60,0.4)' }} />
            <p style={{ color: '#7a9c5a', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 20, margin: '0 0 4px' }}>
              Reservasi Event
            </p>
            <p style={{ color: '#7a9c5a', fontSize: 11, fontFamily: 'sans-serif', letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 16px' }}>
              Nawa Everyday
            </p>
            <div className="w-10 h-px mb-5" style={{ background: '#7a9c5a', opacity: 0.3 }} />
            <p style={{ color: '#5a7040', fontSize: 13, fontFamily: 'sans-serif', lineHeight: 1.75, maxWidth: 360, margin: 0 }}>
              Isi formulir di bawah untuk reservasi event. Tim kami akan segera menghubungimu untuk konfirmasi via WhatsApp.
            </p>
          </div>

          {/* Form area */}
          <div style={{ background: '#eef3e8', padding: '36px 32px' }}>
            {sent ? (
              // ── Pesan sukses ──
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <h3 style={{ color: '#2d3d20', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, margin: '0 0 8px' }}>
                  Reservasi Terkirim!
                </h3>
                <p style={{ color: '#3d5228', fontSize: 14, fontFamily: 'sans-serif', lineHeight: 1.7, marginBottom: 24 }}>
                  Terima kasih! Tim Nawa Everyday akan menghubungimu via WhatsApp dalam 1x24 jam untuk konfirmasi.
                </p>
                <button
                  onClick={() => setSent(false)}
                  style={{
                    padding: '10px 28px', background: '#6B7C4A', color: '#fff',
                    border: 'none', borderRadius: '12px', fontSize: 14,
                    fontFamily: 'sans-serif', cursor: 'pointer',
                  }}
                >
                  Buat Reservasi Lain
                </button>
              </div>
            ) : (
              // ── Form ──
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {error && (
                  <div style={{
                    padding: '10px 14px', background: '#f8d7da', color: '#721c24',
                    borderRadius: '8px', fontSize: '13px', border: '1px solid #f5c6cb',
                  }}>
                    ❌ {error}
                  </div>
                )}

                {/* Row: Nama + No HP */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Nama Lengkap *</label>
                    <input type="text" name="name" placeholder="contoh: Budi Santoso"
                      value={form.name} onChange={handleChange} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>No. WhatsApp *</label>
                    <input type="tel" name="phone" placeholder="contoh: 08123456789"
                      value={form.phone} onChange={handleChange} required style={inputStyle} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" name="email" placeholder="contoh: nama@email.com"
                    value={form.email} onChange={handleChange} style={inputStyle} />
                </div>

                {/* Jenis Acara */}
                <div>
                  <label style={labelStyle}>Jenis Acara *</label>
                  <select name="event_type" value={form.event_type} onChange={handleChange} required style={inputStyle}>
                    <option value="">-- Pilih Jenis Acara --</option>
                    {eventTypes.map(e => (
                      <option key={e.label} value={e.label}>{e.icon} {e.label}</option>
                    ))}
                  </select>
                </div>

                {/* Row: Tanggal + Waktu */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Tanggal Acara *</label>
                    <input type="date" name="date" value={form.date} onChange={handleChange} required
                      min={new Date().toISOString().split('T')[0]} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Waktu Mulai *</label>
                    <input type="time" name="time" value={form.time} onChange={handleChange} required style={inputStyle} />
                  </div>
                </div>

                {/* Jumlah Tamu */}
                <div>
                  <label style={labelStyle}>Jumlah Tamu *</label>
                  <input type="number" name="guest" placeholder="contoh: 20" min="1"
                    value={form.guest} onChange={handleChange} required style={inputStyle} />
                </div>

                {/* Catatan */}
                <div>
                  <label style={labelStyle}>Catatan Tambahan</label>
                  <textarea name="notes" rows={3}
                    placeholder="Dekorasi, kebutuhan khusus, atau informasi lainnya..."
                    value={form.notes} onChange={handleChange}
                    style={{ ...inputStyle, resize: 'vertical' }} />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '13px', background: loading ? '#aaa' : '#6B7C4A',
                    color: '#fff', border: 'none', borderRadius: '12px',
                    fontSize: 15, fontFamily: 'sans-serif', fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 16px rgba(107,124,74,0.35)',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#4a5c2a'; }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#6B7C4A'; }}
                >
                  {loading ? 'Mengirim...' : '📋 Kirim Reservasi'}
                </button>

                <p style={{ textAlign: 'center', color: '#7a9060', fontSize: 11, fontFamily: 'sans-serif', margin: 0 }}>
                  * Field wajib diisi. Tim kami akan menghubungi via WhatsApp dalam 1x24 jam.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Quote footer ── */}
      <div className="w-full py-10 px-6" style={{ background: '#2d3d20' }}>
        <p className="text-center italic"
          style={{ color: '#ffffff', fontSize: 13, fontFamily: 'Georgia, serif', letterSpacing: 0.5, margin: '0 0 6px' }}>
          "Setiap momen spesial layak dirayakan dengan cara yang istimewa"
        </p>
        <p style={{ color: '#ffffff', fontSize: 11, fontFamily: 'sans-serif', textAlign: 'center', margin: 0, letterSpacing: 2, textTransform: 'uppercase' }}>
          Nawa Everyday — Cijantung, Jakarta
        </p>
      </div>
    </div>
  );
}

// ── Style helpers ──
const inputStyle = {
  width: '100%', padding: '11px 14px',
  border: '1.5px solid #c8d8b0', borderRadius: '10px',
  fontSize: '14px', color: '#2d3d20', background: '#f8faf4',
  fontFamily: 'sans-serif', boxSizing: 'border-box', outline: 'none',
};

const labelStyle = {
  display: 'block', fontSize: '13px',
  fontWeight: '600', color: '#3d5228',
  marginBottom: '6px', fontFamily: 'sans-serif',
};
