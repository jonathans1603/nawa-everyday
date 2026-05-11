import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminMenu from './Admin/AdminMenu.jsx';
import AdminQRCode from './Admin/AdminQRcode.jsx';
import AdminUser from './Admin/Adminuser.jsx';
import AdminFeedback from './Admin/Adminfeedback.jsx';
import AdminReservation from './Admin/AdminReservation.jsx';
import AdminLaporan from './Admin/Adminlaporan.jsx';
import AdminAbout from './Admin/Adminabout.jsx';
import Nawalogo from '../assets/logo.jpg';
 
const navItems = [
  { id: 'menu',        label: 'Menu',        icon: '🍽️' },
  { id: 'qrcode',      label: 'QR-Code',     icon: '📱' },
  { id: 'user',        label: 'User',        icon: '👤' },
  { id: 'feedback',    label: 'Feedback',    icon: '💬' },
  { id: 'reservation', label: 'Reservation', icon: '📅' },
  { id: 'laporan',     label: 'Laporan',     icon: '📊' },
  { id: 'about',       label: 'About Us',    icon: '🍃' },
];
 
const sectionTitles = {
  menu:        'Menu Management',
  qrcode:      'QR-Code Management',
  user:        'User Management',
  feedback:    'Feedback',
  reservation: 'Reservation',
  laporan:     'Laporan & Statistik',
  about:       'About Us Management',
};
 
export default function AdminDashboard() {
  const [active, setActive] = useState('menu');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
 
  useEffect(() => {
    const loggedInUser = sessionStorage.getItem('nawa_user');
    if (!loggedInUser) {
      // Jika tidak ada data login, tendang balik ke halaman login
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(loggedInUser);
    if (parsedUser.role !== 'admin') {
      // Jika dia login tapi BUKAN admin, arahkan ke halaman sesuai rolenya
      navigate('/' + parsedUser.role);
      return;
    }
 
    setUser(parsedUser);
  }, [navigate]);
 
  const handleLogout = () => { setShowLogoutModal(true); };
  const confirmLogout = () => { sessionStorage.removeItem('nawa_user'); navigate('/login', { replace: true }); };
 
  const renderContent = () => {
    switch (active) {
      case 'menu':        return <AdminMenu />;
      case 'qrcode':      return <AdminQRCode />;
      case 'user':        return <AdminUser />;
      case 'feedback':    return <AdminFeedback />;
      case 'reservation': return <AdminReservation />;
      case 'laporan':     return <AdminLaporan />;
      case 'about':       return <AdminAbout />;
      default:            return <AdminMenu />;
    }
  };
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'DM Sans', sans-serif; }
 
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .content-anim { animation: fadeIn 0.3s ease both; }
 
        .nav-btn {
          display: flex; align-items: center; gap: 10px;
          width: calc(100% - 16px); margin: 0 8px;
          padding: 10px 14px; border-radius: 10px;
          border: none; background: transparent;
          color: rgba(255,255,255,0.65);
          font-size: 13px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; text-align: left;
          transition: all 0.2s ease;
          letter-spacing: 0.2px;
        }
        .nav-btn:hover { background: rgba(200,185,122,0.15); color: #c8b97a; padding-left: 18px; }
        .nav-btn.active {
          background: linear-gradient(135deg, #3d2b1f, #5a3e2b);
          color: #c8b97a; font-weight: 700;
          box-shadow: 3px 0 16px rgba(61,43,31,0.35);
          padding-left: 18px;
        }
 
        .admin-table { width: 100%; border-collapse: collapse; font-family: 'DM Sans', sans-serif; }
        .admin-table thead th {
          background: #4a5c30; color: #f0ebd0;
          padding: 11px 16px; text-align: left;
          font-size: 12px; font-weight: 600; letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .admin-table thead th:first-child { border-radius: 10px 0 0 0; }
        .admin-table thead th:last-child  { border-radius: 0 10px 0 0; }
        .admin-table tbody td {
          padding: 11px 16px; font-size: 13px; color: #3d2b1f;
          border-bottom: 1px solid rgba(200,185,122,0.2);
        }
        .admin-table tbody tr:hover td { background: rgba(200,185,122,0.08); }
        .admin-table tbody tr:last-child td { border-bottom: none; }
 
        .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .badge-green  { background: #d1fae5; color: #065f46; }
        .badge-yellow { background: #fef3c7; color: #92400e; }
        .badge-red    { background: #fee2e2; color: #991b1b; }
        .badge-blue   { background: #dbeafe; color: #1e40af; }
 
        .action-btn {
          padding: 5px 12px; border-radius: 6px; border: none;
          font-size: 12px; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: all 0.15s;
        }
        .action-btn-edit   { background: #fef3c7; color: #92400e; }
        .action-btn-edit:hover { background: #fde68a; }
        .action-btn-del    { background: #fee2e2; color: #991b1b; }
        .action-btn-del:hover { background: #fca5a5; }
        .action-btn-view   { background: #dbeafe; color: #1e40af; }
        .action-btn-view:hover { background: #bfdbfe; }
 
        .stat-card {
          background: linear-gradient(145deg, #fffef5, #f5f0e0);
          border: 1.5px solid rgba(200,185,122,0.3);
          border-radius: 14px;
          padding: 20px;
          box-shadow: 0 3px 16px rgba(61,43,31,0.08);
        }
        .stat-num { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: #3d2b1f; }
        .stat-label { font-size: 12px; color: #7a6848; font-weight: 500; letter-spacing: 0.3px; margin-top: 4px; }
        .stat-icon { font-size: 1.8rem; margin-bottom: 8px; }
 
        .form-input {
          width: 100%; padding: 9px 13px; border: 1.5px solid rgba(200,185,122,0.45);
          border-radius: 8px; font-size: 13px; color: #3d2b1f;
          font-family: 'DM Sans', sans-serif; background: #fffef5;
          outline: none; transition: border-color 0.2s;
        }
        .form-input:focus { border-color: #6B7C4A; box-shadow: 0 0 0 3px rgba(107,124,74,0.15); }
        .form-label { font-size: 12px; font-weight: 600; color: #5a4a30; margin-bottom: 5px; display: block; text-transform: uppercase; letter-spacing: 0.5px; }
 
        .primary-btn {
          padding: 9px 22px; border-radius: 8px; border: none;
          background: #6B7C4A; color: #f0ebd0;
          font-size: 13px; font-weight: 700; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        .primary-btn:hover { background: #3d2b1f; transform: translateY(-1px); }
 
        .section-box {
          background: white; border-radius: 14px;
          border: 1.5px solid rgba(200,185,122,0.25);
          box-shadow: 0 4px 24px rgba(61,43,31,0.08);
          overflow: hidden;
        }
        .section-box-header {
          padding: 16px 20px; background: linear-gradient(135deg, #f5f0e0, #ede5cc);
          border-bottom: 1px solid rgba(200,185,122,0.3);
          display: flex; align-items: center; justify-content: space-between;
        }
        .section-box-title { font-family: 'Playfair Display', serif; font-size: 15px; color: #3d2b1f; font-weight: 700; }
      `}</style>
 
      <div style={{ display: 'flex', minHeight: '100vh', background: '#e8dfc0', fontFamily: "'DM Sans', sans-serif" }}>
 
        {/* ── SIDEBAR ── */}
        <aside style={{
          width: '180px', minWidth: '180px',
          background: 'linear-gradient(180deg, #3a4a22 0%, #6B7C4A 55%, #4a5c30 100%)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '4px 0 24px rgba(61,43,31,0.18)',
          position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
        }}>
          {/* Logo area */}
          <div style={{
            padding: '24px 16px 20px', borderBottom: '1px solid rgba(200,185,122,0.2)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          }}>
            <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            border: '2.5px solid #c8b97a',
            overflow: 'hidden',
          }}>
            <img
              src={Nawalogo}
              alt="Nawa Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
</div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#c8b97a', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '14px', fontWeight: 700, margin: 0 }}>
                Nawa
              </p>
              <p style={{ color: 'rgba(200,185,122,0.5)', fontSize: '10px', margin: '2px 0 0', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Admin Panel
              </p>
            </div>
          </div>
 
          {/* User info */}
          {user && (
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(200,185,122,0.15)', marginBottom: '8px' }}>
              <p style={{ color: 'rgba(240,235,208,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 2px' }}>Masuk sebagai</p>
              <p style={{ color: '#f0ebd0', fontSize: '12px', fontWeight: 600, margin: 0 }}>{user.username}</p>
            </div>
          )}
 
          {/* Nav */}
          <nav style={{ flex: 1, padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-btn ${active === item.id ? 'active' : ''}`}
                onClick={() => setActive(item.id)}
              >
                <span style={{ fontSize: '14px' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
 
          {/* Logout */}
          <div style={{ padding: '16px 8px', borderTop: '1px solid rgba(200,185,122,0.15)' }}>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                width: 'calc(100% - 0px)', padding: '10px 14px', borderRadius: '10px',
                border: 'none', background: 'rgba(239,68,68,0.12)',
                color: '#fca5a5', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </aside>
 
        {/* ── MAIN ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
 
          {/* Top header */}
          <header style={{
            background: 'linear-gradient(135deg, #fffef5 0%, #f0ead8 100%)',
            padding: '16px 32px',
            borderBottom: '1.5px solid rgba(200,185,122,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 2px 12px rgba(61,43,31,0.08)',
          }}>
            <div>
              <h1 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#3d2b1f' }}>
                <span style={{ fontStyle: 'italic', color: '#8B1A1A' }}>Admin</span>
                {' '}<span style={{ color: '#5a5a5a', fontSize: '1.2rem', fontWeight: 400 }}>-</span>{' '}
                <span style={{ fontStyle: 'italic' }}>{sectionTitles[active]}</span>
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: '#7a6848' }}>
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: '#6B7C4A', color: '#f0ebd0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: 700,
              }}>
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
          </header>
 
          {/* Content */}
          <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', background: '#e8dfc0' }}>
            <div className="content-anim" key={active}>
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
  {/* ── Modal Konfirmasi Logout ── */}
  {showLogoutModal && (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fffef5', borderRadius: '16px',
        padding: '32px 28px', maxWidth: '360px', width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        border: '1.5px solid rgba(200,185,122,0.4)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🚪</div>
        <h3 style={{
          fontFamily: "'Playfair Display', serif", fontSize: '18px',
          color: '#3d2b1f', margin: '0 0 8px',
        }}>Konfirmasi Logout</h3>
        <p style={{ fontSize: '13px', color: '#7a6848', margin: '0 0 24px', lineHeight: 1.6 }}>
          Apakah kamu yakin ingin keluar dari sesi ini?
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => setShowLogoutModal(false)}
            style={{
              padding: '10px 24px', borderRadius: '8px',
              border: '1.5px solid rgba(200,185,122,0.5)',
              background: '#f5f0e0', color: '#5a4a30',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#e8dfc0'}
            onMouseLeave={e => e.currentTarget.style.background = '#f5f0e0'}
          >
            Batal
          </button>
          <button
            onClick={confirmLogout}
            style={{
              padding: '10px 24px', borderRadius: '8px',
              border: 'none', background: '#dc2626', color: '#fff',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#b91c1c'}
            onMouseLeave={e => e.currentTarget.style.background = '#dc2626'}
          >
            Ya, Logout
          </button>
        </div>
      </div>
    </div>
  )}
    </>
  );
}