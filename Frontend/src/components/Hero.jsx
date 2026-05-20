import { useState, useEffect, useRef, useCallback } from 'react';
import slide1 from '../assets/background_default.jpg';
import slide2 from '../assets/background_satu.png';
 
const slides = [
  { id: 1, image: slide1, label: 'Selamat\nDatang di...', bold: 'Nawa Everyday' },
  { id: 2, image: slide2, label: 'South-East\nAsian Foods',  bold: 'Good Vibes ✦'  },
];
 
const CLONED = [slides[slides.length - 1], ...slides, slides[0]];
const TOTAL  = slides.length;
const OFFSET = 1;
 
export default function Hero() {
  const [pos, setPos]           = useState(OFFSET);
  const [animated, setAnimated] = useState(true);
 
  const moveTo = useCallback((next, anim = true) => {
    setAnimated(anim);
    setPos(next);
  }, []);
 
  useEffect(() => {
    if (pos === 0)          { const id = setTimeout(() => moveTo(TOTAL, false), 650); return () => clearTimeout(id); }
    if (pos === TOTAL + 1)  { const id = setTimeout(() => moveTo(1,     false), 650); return () => clearTimeout(id); }
  }, [pos, moveTo]);
 
  const goNext = useCallback(() => setPos(p => p + 1), []);
  const goPrev = useCallback(() => setPos(p => p - 1), []);
 
  const realIdx    = (pos - OFFSET + TOTAL) % TOTAL;
  const translateX = -(pos * 100);
 
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(320px, 55vw, 520px)' }}
 
    >
      {/* ── Track */}
      <div
        className="flex h-full"
        style={{
          width:      `${CLONED.length * 100}%`,
          transform:  `translateX(${translateX / CLONED.length}%)`,
          transition: animated ? 'transform 0.65s cubic-bezier(0.4,0,0.2,1)' : 'none',
          willChange: 'transform',
        }}
      >
        {CLONED.map((slide, i) => (
          <div
            key={`${slide.id}-${i}`}
            className="relative h-full flex-shrink-0"
            style={{ width: `${100 / CLONED.length}%` }}
          >
            {/* Gambar */}
            <img
              src={slide.image}
              alt={slide.bold}
              className="w-full h-full object-cover block"
            />
 
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.04) 100%)' }}
            />
 
            {/* Teks */}
            <div className="absolute inset-0 flex items-center justify-end pr-[clamp(48px,6vw,80px)]">
              <div className="text-right">
                <p
                  className="text-white font-serif italic leading-snug mb-1.5 whitespace-pre-line drop-shadow-lg"
                  style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.6rem)' }}
                >
                  {slide.label}
                </p>
                <p
                  className="text-white font-serif font-bold leading-tight drop-shadow-xl"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3.4rem)' }}
                >
                  {slide.bold}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
 
      {/* ── Tombol Kiri */}
      <button
        onClick={() => goPrev()}
        aria-label="Previous"
        className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/70 border-2 border-white/90 text-[#2e3a1a] shadow-md hover:bg-white/95 hover:scale-110 transition-all duration-200 flex items-center justify-center"
        style={{ fontSize: 26, lineHeight: 1, paddingBottom: 2 }}
      >
        ‹
      </button>
 
      {/* ── Tombol Kanan */}
      <button
        onClick={() => goNext()}
        aria-label="Next"
        className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/70 border-2 border-white/90 text-[#2e3a1a] shadow-md hover:bg-white/95 hover:scale-110 transition-all duration-200 flex items-center justify-center"
        style={{ fontSize: 26, lineHeight: 1, paddingBottom: 2 }}
      >
        ›
      </button>
 
      {/* ── Dot indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
 
        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => moveTo(i + OFFSET)}
              aria-label={`Slide ${i + 1}`}
              className="h-2.5 rounded-full border border-white/80 cursor-pointer p-0 transition-all duration-300"
              style={{
                width:      realIdx === i ? 28 : 10,
                background: realIdx === i ? 'white' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}