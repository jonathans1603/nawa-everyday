import { useState, useEffect, useRef, useCallback } from 'react';
import nasigoreng  from '../assets/Nasi goreng Nusantara.png';
import beefpadkrao from '../assets/Pad kra pao 1.png';
import manggomatcha from '../assets/Manggo Matcha.png';
import kopinawa     from '../assets/Kopi nawa.png';
import background   from '../assets/background_kayu.png';
import nasidori     from '../assets/Rice Dori.png';

const menuItems = [
  { id: 1, name: "Nasi Goreng Nusantara", image: nasigoreng  },
  { id: 2, name: "Beef Pad Kra Pao",      image: beefpadkrao },
  { id: 3, name: "Mango Matcha",           image: manggomatcha },
  { id: 4, name: "Kopi Nawa",              image: kopinawa    },
  { id: 5, name: "Nasi Dori",              image: nasidori    },
];

// ── duplikat untuk infinite loop: [last, ...all, first]
const CLONED = [
  { ...menuItems[menuItems.length - 1], id: 'clone-start' },
  ...menuItems,
  { ...menuItems[0], id: 'clone-end' },
];
const TOTAL   = menuItems.length;   // 5
const OFFSET  = 1;                  // clone di depan

// ── berapa card tampil per breakpoint
function useVisible() {
  const get = () =>
    window.innerWidth >= 1024 ? 5 :
    window.innerWidth >= 768  ? 3 : 2;
  const [v, setV] = useState(get);
  useEffect(() => {
    const h = () => setV(get());
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return v;
}

// ── satu card
function MenuCard({ name, image, active }) {
  return (
    <div
      className="flex flex-col items-center rounded-2xl border-2 bg-[#e8dbbf] overflow-hidden shadow-md transition-all duration-500"
      style={{
        borderColor: active ? '#8b2e2e' : '#c4a882',
        transform:   active ? 'scale(1.06)' : 'scale(0.93)',
        opacity:     active ? 1 : 0.72,
        boxShadow:   active
          ? '0 8px 28px rgba(139,46,46,0.28)'
          : '0 2px 8px rgba(0,0,0,0.10)',
      }}
    >
      <div className="w-full p-3">
        <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#d4c9a8]">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>
      <p
        className="w-full text-center font-semibold text-sm leading-snug font-serif px-2 pb-3 transition-colors duration-300"
        style={{ color: active ? '#3d2b1f' : '#7a6655' }}
      >
        {name}
      </p>
    </div>
  );
}

export default function Specialties() {
  // posisi di array CLONED; mulai di index OFFSET (item pertama asli)
  const [pos, setPos]         = useState(OFFSET);
  const [animated, setAnimated] = useState(true);
  const timerRef              = useRef(null);
  const visible               = useVisible();

  // indeks item "aktif" (tengah viewport)
  const realIndex = (pos - OFFSET + TOTAL) % TOTAL;

  // lebar 1 card dalam persen terhadap track
  const cardW = 100 / visible;

  // offset track sehingga card aktif berada di tengah
  const centerOffset = (visible - 1) / 2;
  const translateX   = -((pos - centerOffset) * cardW);

  // ── navigasi
  const moveTo = useCallback((next, anim = true) => {
    setAnimated(anim);
    setPos(next);
  }, []);

  // setelah lompat ke clone → diam-diam reset ke item asli
  useEffect(() => {
    if (pos === 0) {
      // kita baru tiba di clone-start → loncat ke item terakhir asli
      const id = setTimeout(() => moveTo(TOTAL, false), 500);
      return () => clearTimeout(id);
    }
    if (pos === TOTAL + 1) {
      // kita baru tiba di clone-end → loncat ke item pertama asli
      const id = setTimeout(() => moveTo(1, false), 500);
      return () => clearTimeout(id);
    }
  }, [pos, moveTo]);

  const goNext = useCallback(() => moveTo(p => p + 1), [moveTo]);
  const goPrev = useCallback(() => moveTo(p => p - 1), [moveTo]);
  const goDot  = useCallback((i) => moveTo(i + OFFSET), [moveTo]);

  // ── auto-slide 5 detik
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goNext, 5000);
  }, [goNext]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const handlePrev = () => { goPrev(); startTimer(); };
  const handleNext = () => { goNext(); startTimer(); };
  const handleDot  = (i) => { goDot(i); startTimer(); };

  // ── progress bar (5 detik)
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress(0);
    const step = 50;
    const inc  = (step / 5000) * 100;
    const id   = setInterval(() => setProgress(p => Math.min(p + inc, 100)), step);
    return () => clearInterval(id);
  }, [pos]);

  return (
    <section
      className="py-10 px-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-5xl mx-auto">

        {/* ── Judul */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-white rounded-xl border-2 border-[#8b2e2e] px-7 py-3 shadow-md">
            <h2 className="text-[#3d2b1f] font-bold text-xl font-serif italic">
              Our Specialties
            </h2>
          </div>
        </div>

        {/* ── Wrapper: tombol kiri | track | tombol kanan */}
        <div className="flex items-center gap-3">

          {/* Tombol Kiri */}
          <button
            onClick={handlePrev}
            aria-label="Previous"
            className="flex-shrink-0 w-11 h-11 rounded-full bg-white border-2 border-[#8b2e2e] text-[#8b2e2e] text-xl font-bold flex items-center justify-center shadow-md hover:bg-[#8b2e2e] hover:text-white transition-colors duration-200"
          >
            ‹
          </button>

          {/* Track */}
          <div className="flex-1 overflow-hidden rounded-2xl">
            <div
              className="flex"
              style={{
                transform:  `translateX(${translateX}%)`,
                transition: animated ? 'transform 0.5s cubic-bezier(0.4,0,0.2,1)' : 'none',
                willChange: 'transform',
              }}
            >
              {CLONED.map((item, i) => (
                <div
                  key={`${item.id}-${i}`}
                  style={{
                    flex: `0 0 ${cardW}%`,
                    padding: '8px 6px',
                    boxSizing: 'border-box',
                  }}
                >
                  <MenuCard
                    name={item.name}
                    image={item.image}
                    active={i === pos}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tombol Kanan */}
          <button
            onClick={handleNext}
            aria-label="Next"
            className="flex-shrink-0 w-11 h-11 rounded-full bg-white border-2 border-[#8b2e2e] text-[#8b2e2e] text-xl font-bold flex items-center justify-center shadow-md hover:bg-[#8b2e2e] hover:text-white transition-colors duration-200"
          >
            ›
          </button>
        </div>

        {/* ── Dot indicator + progress bar */}
        <div className="flex flex-col items-center gap-3 mt-5">

          {/* Dots */}
          <div className="flex gap-2">
            {menuItems.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDot(i)}
                aria-label={`Slide ${i + 1}`}
                className="transition-all duration-300"
                style={{
                  width:        realIndex === i ? 24 : 10,
                  height:       10,
                  borderRadius: 999,
                  background:   realIndex === i ? '#8b2e2e' : 'rgba(255,255,255,0.65)',
                  border:       '1.5px solid #8b2e2e',
                  cursor:       'pointer',
                  padding:      0,
                }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-32 h-1 rounded-full bg-white/40 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#8b2e2e] transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
