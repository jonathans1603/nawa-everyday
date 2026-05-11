import { useState, useEffect } from 'react';
import Header from '../components/Header';
import cafeImg from '../assets/background_satu.png';
import logoImg  from '../assets/logo.jpg';
 
const API = 'https://nawa-everyday-production.up.railway.app/api';
 
const accentColors = ['#6B7C4A', '#8b5e3c', '#4a7c59', '#7c4a6b', '#4a617c'];
const bgColors     = ['#f0ede4', '#f7f0e8', '#edf4ef', '#f4edf4', '#edf0f7'];
const icons        = ['🍃', '☕', '🕘', '🌿', '🍜'];
 
const values = [
  { label: 'Berdiri',  value: '2025', sub: 'Juni'               },
  { label: 'Menu',     value: '20+',  sub: 'Pilihan Sajian'     },
  { label: 'Jam Buka', value: '13',   sub: 'Jam per hari'       },
  { label: 'Lokasi',   value: '1',    sub: 'Cijantung, Jakarta' },
];
 
// Banner config per status
const STATUS_BANNER = {
  'Closed': {
    bg: '#fee2e2', border: '#fca5a5', color: '#991b1b',
    icon: '🔴', title: 'Kami Sedang Tutup',
    desc: 'Nawa Everyday saat ini sedang tutup. Kami akan segera kembali melayani Anda. Terima kasih atas pengertiannya.',
  },
  'Private Event': {
    bg: '#fef3c7', border: '#fcd34d', color: '#92400e',
    icon: '🔒', title: 'Closed for Private Event',
    desc: 'Nawa Everyday hari ini ditutup untuk acara privat. Kami mohon maaf atas ketidaknyamanan ini dan berterima kasih atas pengertian Anda.',
  },
};
 
export default function AboutUs({ onNavigate }) {
  const [stories, setStories]         = useState([]);
  const [dailyStatus, setDailyStatus] = useState('Open');
  const [loading, setLoading]         = useState(true);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resStory, resStatus] = await Promise.all([
          fetch(`${API}/about`),
          fetch(`${API}/about/status`),
        ]);
        const storyData  = await resStory.json();
        const { daily_status } = await resStatus.json();
        setStories(Array.isArray(storyData) ? storyData : []);
        setDailyStatus(daily_status || 'Open');
      } catch (e) {
        console.error('Gagal fetch about:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
 
  const banner = STATUS_BANNER[dailyStatus] || null;
 
  return (
    <div className="min-h-screen" style={{ background: '#f5f0e8', fontFamily: "'Georgia', serif" }}>
      <Header activePage="about" onNavigate={onNavigate} />
 
      {/* ── Hero Banner */}
      <div className="relative w-full overflow-hidden" style={{ height: 340 }}>
        <img src={cafeImg} alt="Nawa Everyday" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(30,20,10,0.72) 100%)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-6">
          <div className="px-8 py-2 mb-4 rounded-full"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}>
            <span style={{ color: '#e8d9b8', fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'sans-serif', fontStyle: 'normal' }}>
              Restaurant
            </span>
          </div>
          <h1 className="text-white text-center italic"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', textShadow: '0 2px 16px rgba(0,0,0,0.5)', margin: 0, lineHeight: 1.2 }}>
            About Us
          </h1>
          <p className="text-center mt-3"
            style={{ color: '#d4c4a0', fontSize: 14, fontFamily: 'sans-serif', fontStyle: 'normal', maxWidth: 480, lineHeight: 1.6 }}>
            Tempat di mana setiap sajian bercerita tentang kekayaan kuliner Asia Tenggara
          </p>
        </div>
      </div>
 
      {/* ── Stat bar */}
      <div className="w-full flex justify-center" style={{ background: '#357832' }}>
        <div className="w-full max-w-4xl grid grid-cols-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {values.map((v, i) => (
            <div key={i} className="flex flex-col items-center py-5"
              style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
              <span style={{ color: '#ffffff', fontFamily: 'Georgia, serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', lineHeight: 1 }}>
                {v.value}
              </span>
              <span style={{ color: '#fbfbfb', fontSize: 11, fontFamily: 'sans-serif', marginTop: 4, letterSpacing: 1, textTransform: 'uppercase' }}>{v.label}</span>
              <span style={{ color: '#ffffff', fontSize: 11, fontFamily: 'sans-serif' }}>{v.sub}</span>
            </div>
          ))}
        </div>
      </div>
 
      {/* ── Story section */}
      <div className="max-w-4xl mx-auto px-6 py-14">
 
        {/* Divider heading */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px" style={{ background: '#c8a96e', opacity: 0.4 }} />
          <span style={{ color: '#8b5e3c', fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'sans-serif', whiteSpace: 'nowrap' }}>
            Our Story
          </span>
          <div className="flex-1 h-px" style={{ background: '#c8a96e', opacity: 0.4 }} />
        </div>
 
        {/* ── Status Banner (ditampilkan jika bukan Open) ── */}
        {banner && (
          <div style={{
            marginBottom: '32px',
            padding: '20px 24px',
            borderRadius: '16px',
            background: banner.bg,
            border: `2px solid ${banner.border}`,
            display: 'flex', alignItems: 'flex-start', gap: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontSize: '2rem', flexShrink: 0, marginTop: '2px' }}>{banner.icon}</div>
            <div>
              <p style={{
                fontFamily: 'Georgia, serif', fontStyle: 'italic',
                fontSize: '18px', fontWeight: 700, color: banner.color,
                margin: '0 0 6px',
              }}>
                {banner.title}
              </p>
              <p style={{ fontSize: '13.5px', color: banner.color, margin: 0, lineHeight: 1.7, fontFamily: 'sans-serif' }}>
                {banner.desc}
              </p>
            </div>
          </div>
        )}
 
        {/* Story cards dari DB */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#8b5e3c', fontFamily: 'sans-serif', padding: '40px 0' }}>
            Memuat...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stories.map((s, i) => {
              const accent = accentColors[i % accentColors.length];
              const bg     = bgColors[i % bgColors.length];
              const icon   = icons[i % icons.length];
              const num    = String(i + 1).padStart(2, '0');
              return (
                <div key={s.id_blog}
                  className="flex flex-col rounded-2xl overflow-hidden"
                  style={{ background: bg, border: `1.5px solid ${accent}22`, boxShadow: '0 4px 24px rgba(80,50,20,0.09)' }}>
                  <div style={{ height: 4, background: accent, borderRadius: '4px 4px 0 0' }} />
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <span style={{ fontSize: 42, fontFamily: 'Georgia, serif', color: accent, opacity: 0.18, lineHeight: 1, fontWeight: 700 }}>
                        {num}
                      </span>
                      <div className="flex items-center justify-center rounded-full"
                        style={{ width: 44, height: 44, background: `${accent}18`, border: `1.5px solid ${accent}33`, fontSize: 20 }}>
                        {icon}
                      </div>
                    </div>
                    <h3 className="mb-3" style={{ color: '#3d2b1f', fontSize: 17, fontFamily: 'Georgia, serif', fontStyle: 'italic', margin: '0 0 10px' }}>
                      {s.title}
                    </h3>
                    <p style={{ color: '#5c4535', fontSize: 13.5, lineHeight: 1.75, fontFamily: 'sans-serif', margin: 0, flex: 1 }}>
                      {s.content}
                    </p>
                    <div className="mt-5" style={{ height: 2, borderRadius: 999, background: `${accent}30`, width: '40%' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
 
      {/* ── Quote section */}
      <div className="w-full py-14 px-6" style={{ background: '#357832' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div style={{ color: '#c8a96e', fontSize: 48, lineHeight: 1, opacity: 0.4, fontFamily: 'Georgia, serif' }}>"</div>
          <p className="italic" style={{ color: '#e8d9b8', fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontFamily: 'Georgia, serif', lineHeight: 1.8, margin: '-8px 0 16px' }}>
            Kami percaya bahwa makanan bukan sekadar kebutuhan — ia adalah cara untuk terhubung, berbagi cerita, dan menciptakan kenangan.
          </p>
          <div className="flex items-center justify-center gap-3">
            <div style={{ height: 1, width: 40, background: '#c8a96e', opacity: 0.5 }} />
            <img src={logoImg} alt="Nawa Logo" className="rounded-full object-cover"
              style={{ width: 36, height: 36, border: '2px solid #c8a96e66' }} />
            <div style={{ height: 1, width: 40, background: '#c8a96e', opacity: 0.5 }} />
          </div>
          <p style={{ color: '#a8896e', fontSize: 12, fontFamily: 'sans-serif', marginTop: 10, letterSpacing: 2, textTransform: 'uppercase' }}>
            Nawa Everyday — Cijantung, Jakarta
          </p>
        </div>
      </div>
    </div>
  );
}
 
