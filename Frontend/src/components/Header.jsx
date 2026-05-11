import { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo.jpg';
 
const navItems = [
  { label: 'Menu',        page: 'menu'        },
  { label: 'Home',        page: 'home'        },
  { label: 'About us',    page: 'about'       },
  { label: 'Reservation', page: 'reservation' },
  { label: 'Contact',     page: 'contact'     },
  { label: 'Feedback',    page: 'feedback'    },
];
 
export default function Header({ activePage = 'home', onNavigate, onCartClick, totalItems = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
 
  // Tutup menu saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);
 
  // Tutup menu saat navigasi
  const handleNavigate = (page) => {
    onNavigate?.(page);
    setMenuOpen(false);
  };
 
  return (
    <header className="sticky top-0 z-50 bg-[#6B7C4A] shadow-md px-6 py-3 flex items-center justify-between">
 
      {/* Logo */}
      <div className="flex items-center gap-3">
        <button onClick={() => handleNavigate('home')} className="focus:outline-none">
          <img
            src={logo}
            alt="Nawa Logo"
            className="w-12 h-12 rounded-full object-cover border-2 border-[#c8b97a] shadow hover:scale-105 transition"
          />
        </button>
      </div>
 
      {/* Nav desktop — hidden di mobile */}
      <nav className="hidden md:flex items-center gap-2 flex-wrap justify-end">
        {navItems.map(({ label, page }) => {
          const isActive = activePage === page;
          return (
            <button
              key={page}
              onClick={() => handleNavigate(page)}
              className={[
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 shadow-sm',
                isActive
                  ? 'bg-[#3d2b1f] text-[#c8b97a] cursor-default'
                  : 'bg-[#a8b87a] text-[#2e3a1a] hover:bg-[#c8d49a]',
              ].join(' ')}
            >
              {label}
            </button>
          );
        })}
 
        {/* Keranjang desktop */}
        {onCartClick && (
          <button
            onClick={onCartClick}
            className="relative flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium
                       bg-[#3d2b1f] text-[#c8b97a] hover:bg-[#5a3e2b] transition-colors duration-200 shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            Keranjang
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs
                               font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
        )}
      </nav>
 
      {/* Kanan mobile: keranjang + burger */}
      <div className="flex md:hidden items-center gap-2" ref={menuRef}>
 
        {/* Keranjang mobile */}
        {onCartClick && (
          <button
            onClick={onCartClick}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                       bg-[#3d2b1f] text-[#c8b97a] hover:bg-[#5a3e2b] transition-colors duration-200 shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs
                               font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
        )}
 
        {/* Tombol Burger */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="flex flex-col justify-center items-center w-10 h-10 rounded-full
                     bg-[#a8b87a] hover:bg-[#c8d49a] transition-colors duration-200 shadow-sm gap-1.5"
          aria-label="Toggle menu"
        >
          {/* 3 garis animasi ke X */}
          <span className={`block h-0.5 bg-[#2e3a1a] rounded transition-all duration-300 origin-center
            ${menuOpen ? 'w-5 rotate-45 translate-y-2' : 'w-5'}`} />
          <span className={`block h-0.5 bg-[#2e3a1a] rounded transition-all duration-300
            ${menuOpen ? 'w-0 opacity-0' : 'w-5'}`} />
          <span className={`block h-0.5 bg-[#2e3a1a] rounded transition-all duration-300 origin-center
            ${menuOpen ? 'w-5 -rotate-45 -translate-y-2' : 'w-5'}`} />
        </button>
 
        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-[72px] left-4 w-52 bg-[#f5f0e4] rounded-2xl shadow-xl
                          border border-[#c8b97a] overflow-hidden z-50
                          animate-[fadeDown_0.2s_ease_both]">
            <style>{`
              @keyframes fadeDown {
                from { opacity: 0; transform: translateY(-8px); }
                to   { opacity: 1; transform: translateY(0); }
              }
            `}</style>
 
            <div className="p-2 flex flex-col gap-1">
              {navItems.map(({ label, page }) => {
                const isActive = activePage === page;
                return (
                  <button
                    key={page}
                    onClick={() => handleNavigate(page)}
                    className={[
                      'w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150',
                      isActive
                        ? 'bg-[#3d2b1f] text-[#c8b97a]'
                        : 'text-[#2e3a1a] hover:bg-[#ddd5bb]',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
 
    </header>
  );
}