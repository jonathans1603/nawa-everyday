import { useState } from 'react';
import Header  from '../components/Header';
import cafeImg from '../assets/background_satu.png';
import logoImg  from '../assets/logo.jpg';
 
const API = 'http://localhost:5000/api';
 
const aspects = [
  { icon: '🍽️', label: 'Kualitas Makanan' },
  { icon: '☕',  label: 'Kualitas Minuman' },
  { icon: '💁',  label: 'Pelayanan'        },
  { icon: '✨',  label: 'Kebersihan'       },
  { icon: '🪑',  label: 'Kenyamanan'       },
  { icon: '💰',  label: 'Harga'            },
];
 
const reasons = [
  { num: '01', title: 'Bantu Kami Berkembang',   icon: '🌱', desc: 'Masukan kamu sangat berarti untuk meningkatkan kualitas layanan dan menu kami setiap harinya.' },
  { num: '02', title: 'Suaramu Didengar',        icon: '🎙️', desc: 'Setiap feedback akan dibaca langsung oleh tim Nawa Everyday dan ditindaklanjuti dengan serius.' },
  { num: '03', title: 'Hanya 2 Menit',           icon: '⏱️', desc: 'Formulir singkat, mudah diisi, dan sangat membantu kami memberikan pengalaman terbaik untukmu.' },
];
 
export default function Feedback({ onNavigate }) {
  const [form, setForm]       = useState({ nama_customer: '', no_meja: '', Kritik: '', Saran: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState(null);
 
  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama_customer.trim() || !form.no_meja) {
      setError('Nama dan nomor meja wajib diisi.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/feedback`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ nama_customer: '', no_meja: '', Kritik: '', Saran: '' });
      } else {
        const err = await res.json();
        setError(err.error || 'Gagal mengirim feedback.');
      }
    } catch {
      setError('Koneksi ke server gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen" style={{ background: '#f0f4ec', fontFamily: "'Georgia', serif" }}>
      <Header activePage="feedback" onNavigate={onNavigate} />
 
      {/* ── Hero Banner ── */}
      <div className="relative w-full overflow-hidden" style={{ height: 300 }}>
        <img src={cafeImg} alt="Nawa Feedback" className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(10,24,6,0.78) 100%)' }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-6">
          <div
            className="px-8 py-2 mb-4 rounded-full"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            <span style={{ color: '#d4eabc', fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'sans-serif', fontStyle: 'normal' }}>
              Rate us & Share Your Experience
            </span>
          </div>
          <h1
            className="text-white text-center italic"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', textShadow: '0 2px 16px rgba(0,0,0,0.5)', margin: 0, lineHeight: 1.2 }}
          >
            Feedback
          </h1>
          <p
            className="text-center mt-3"
            style={{ color: '#b8d49a', fontSize: 14, fontFamily: 'sans-serif', fontStyle: 'normal', maxWidth: 480, lineHeight: 1.6 }}
          >
            Ceritakan pengalamanmu dan bantu kami menjadi lebih baik setiap harinya
          </p>
        </div>
      </div>
 
      {/* ── Aspects bar ── */}
      <div className="w-full py-8 px-6" style={{ background: '#2d3d20' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-center mb-5"
            style={{ color: '#7a9c5a', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
            Aspek Penilaian
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {aspects.map((a, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(107,140,60,0.2)' }}
              >
                <span style={{ fontSize: 22 }}>{a.icon}</span>
                <span style={{ color: '#a8cc7a', fontSize: 10, fontFamily: 'sans-serif', textAlign: 'center', lineHeight: 1.4 }}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* ── Why feedback matters ── */}
      <div className="max-w-3xl mx-auto px-6 py-14">
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px" style={{ background: '#7a9c5a', opacity: 0.4 }} />
          <span style={{ color: '#4a6b30', fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'sans-serif', whiteSpace: 'nowrap' }}>
            Kenapa Feedback Kamu Penting
          </span>
          <div className="flex-1 h-px" style={{ background: '#7a9c5a', opacity: 0.4 }} />
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {reasons.map((r, i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl overflow-hidden"
              style={{ background: '#eef3e8', border: '1.5px solid rgba(74,107,48,0.18)', boxShadow: '0 4px 24px rgba(40,70,20,0.08)' }}
            >
              <div style={{ height: 4, background: i === 0 ? '#6B7C4A' : i === 1 ? '#4a7c30' : '#3d6b24' }} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span style={{ fontSize: 38, fontFamily: 'Georgia, serif', color: '#6B7C4A', opacity: 0.18, fontWeight: 700, lineHeight: 1 }}>
                    {r.num}
                  </span>
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{ width: 44, height: 44, background: 'rgba(107,124,74,0.12)', border: '1.5px solid rgba(107,124,74,0.25)', fontSize: 20 }}
                  >
                    {r.icon}
                  </div>
                </div>
                <h3 style={{ color: '#2d3d20', fontSize: 16, fontFamily: 'Georgia, serif', fontStyle: 'italic', margin: '0 0 8px' }}>
                  {r.title}
                </h3>
                <p style={{ color: '#3d5228', fontSize: 13, lineHeight: 1.75, fontFamily: 'sans-serif', margin: 0 }}>
                  {r.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
 
        {/* ── Form Feedback (menggantikan Google Form) ── */}
        <div className="rounded-3xl overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(30,50,18,0.15)' }}>
 
          {/* Header card */}
          <div
            className="flex flex-col items-center py-10 px-8 text-center"
            style={{ background: '#2d3d20' }}
          >
            <img
              src={logoImg}
              alt="Nawa"
              className="rounded-full object-cover mb-5"
              style={{ width: 72, height: 72, border: '3px solid rgba(107,140,60,0.4)' }}
            />
            <p style={{ color: '#a8cc7a', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 20, margin: '0 0 4px' }}>
              Beri Kami Feedback
            </p>
            <p style={{ color: '#7a9c5a', fontSize: 11, fontFamily: 'sans-serif', letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 16px' }}>
              Nawa Everyday
            </p>
            <div className="w-10 h-px mb-5" style={{ background: '#7a9c5a', opacity: 0.35 }} />
            <p style={{ color: '#5a7040', fontSize: 13, fontFamily: 'sans-serif', lineHeight: 1.75, maxWidth: 380, margin: 0 }}>
              Terima kasih sudah mengunjungi Nawa Everyday! Ceritakan pengalamanmu melalui formulir berikut.
            </p>
          </div>
 
          {/* Form area */}
          <div style={{ background: '#eef3e8', padding: '36px 32px' }}>
            {sent ? (
              // ── Pesan sukses ──
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <h3 style={{ color: '#2d3d20', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, margin: '0 0 8px' }}>
                  Terima Kasih!
                </h3>
                <p style={{ color: '#3d5228', fontSize: 14, fontFamily: 'sans-serif', lineHeight: 1.7, marginBottom: 24 }}>
                  Feedback kamu telah berhasil dikirim dan akan segera kami baca.
                </p>
                <button
                  onClick={() => setSent(false)}
                  style={{
                    padding: '10px 28px', background: '#6B7C4A', color: '#fff',
                    border: 'none', borderRadius: '12px', fontSize: 14,
                    fontFamily: 'sans-serif', cursor: 'pointer',
                  }}
                >
                  Kirim Feedback Lagi
                </button>
              </div>
            ) : (
              // ── Form ──
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
 
                {error && (
                  <div style={{
                    padding: '10px 14px', background: '#f8d7da', color: '#721c24',
                    borderRadius: '8px', fontSize: '13px', border: '1px solid #f5c6cb',
                  }}>
                    ❌ {error}
                  </div>
                )}
 
                {/* Nama */}
                <div>
                  <label style={labelStyle}>Nama Kamu *</label>
                  <input
                    type="text"
                    name="nama_customer"
                    placeholder="contoh: Budi Santoso"
                    value={form.nama_customer}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>
 
                {/* Nomor Meja */}
                <div>
                  <label style={labelStyle}>Nomor Meja *</label>
                  <input
                    type="number"
                    name="no_meja"
                    placeholder="contoh: 3"
                    value={form.no_meja}
                    onChange={handleChange}
                    required
                    min="1"
                    style={inputStyle}
                  />
                </div>
 
                {/* Kritik */}
                <div>
                  <label style={labelStyle}>Kritik</label>
                  <textarea
                    name="Kritik"
                    placeholder="Sampaikan kritik kamu di sini..."
                    value={form.Kritik}
                    onChange={handleChange}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>
 
                {/* Saran */}
                <div>
                  <label style={labelStyle}>Saran</label>
                  <textarea
                    name="Saran"
                    placeholder="Sampaikan saran kamu di sini..."
                    value={form.Saran}
                    onChange={handleChange}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
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
                  {loading ? 'Mengirim...' : '✍️ Kirim Feedback'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
 
      {/* ── Quote footer ── */}
      <div className="w-full py-10 px-6" style={{ background: '#2d3d20' }}>
        <p
          className="text-center italic"
          style={{ color: '#7a9c5a', fontSize: 13, fontFamily: 'Georgia, serif', letterSpacing: 0.5, margin: '0 0 6px' }}
        >
          "Kepuasanmu adalah semangat kami untuk terus berkembang"
        </p>
        <p style={{ color: '#3d5228', fontSize: 11, fontFamily: 'sans-serif', textAlign: 'center', margin: 0, letterSpacing: 2, textTransform: 'uppercase' }}>
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
  fontWeight: '600', color: '#3d5228', marginBottom: '6px',
  fontFamily: 'sans-serif',
};