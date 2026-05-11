import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import nawaLogo from '../assets/logo.jpg';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async () => {
  if (!form.username || !form.password) {
    setError('Username dan password wajib diisi.');
    return;
  }

  try {
    // 1. Gunakan URL lengkap ke backend port 5000
    const response = await fetch('http://localhost:5000/api/login', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.username, // Tetap gunakan username agar cocok dengan controller
        password: form.password,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.message || 'Login gagal. Coba lagi.');
      return;
    }

    const data = await response.json();
    
   // 1. Simpan data user ke sessionStorage agar bisa dibaca di Dashboard
    sessionStorage.setItem('nawa_user', JSON.stringify(data.user));
    
    // 2. Logika Redirect berdasarkan ROLE dari Database
    const userRole = data.user.role.toLowerCase(); // Pastikan huruf kecil untuk perbandingan

    if (userRole === 'admin') {
      navigate('/admin'); // Arahkan ke Admindashboard.jsx
    } else if (userRole === 'kasir') {
      navigate('/kasir'); // Arahkan ke KasirDashboard
    } else if (userRole === 'dapur' || userRole === 'kitchen') {
      navigate('/kitchen'); // Arahkan ke KitchenDashboard
    } else if (userRole === 'owner') {   // ← TAMBAH INI
      navigate('/owner');
    } else {
      navigate('/');; 
    }

  } catch (err) {
    setError('Tidak dapat terhubung ke server backend');
  }
};

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #C4D0A3 0%, #a8ba80 100%)' }}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm px-10 py-10 flex flex-col items-center"
        style={{ boxShadow: '0 20px 60px rgba(61,75,35,0.18)' }}
      >
        {/* Logo */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6 overflow-hidden shadow-md"
          style={{ background: '#C4D0A3', border: '3px solid #a8ba80' }}
        >
          <img src={nawaLogo} alt="Nawa Everyday" className="w-full h-full object-cover" />
        </div>

        {/* Judul */}
        <h1
          className="text-3xl font-bold text-center mb-1 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#1a1a1a' }}
        >
          Welcome<br />Back
        </h1>
        <p className="text-sm mb-6" style={{ color: '#7a8a60' }}>Masuk ke sistem Nawa</p>

        {/* Error */}
        {error && (
          <div
            className="w-full mb-4 px-4 py-2 rounded-lg text-sm"
            style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold" style={{ color: '#2e2e2e' }}>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Masukkan username"
              className="w-full border rounded-lg px-3 py-2 text-sm transition"
              style={{ borderColor: '#d1d5db', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#6B7C4A'}
              onBlur={e => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold" style={{ color: '#2e2e2e' }}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              className="w-full border rounded-lg px-3 py-2 text-sm transition"
              style={{ borderColor: '#d1d5db', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#6B7C4A'}
              onBlur={e => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          {/* Login button */}
          <button
            onClick={handleLogin}
            className="w-full mt-2 font-semibold text-lg py-3 rounded-full transition-all duration-200 shadow-sm"
            style={{
              background: '#6B7C4A',
              color: '#f0ebd0',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              letterSpacing: '0.5px',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#3d2b1f'}
            onMouseLeave={e => e.currentTarget.style.background = '#6B7C4A'}
          >
            Login →
          </button>

          {/* Register button */}
          <button
            onClick={() => navigate('/register')}
            className="w-full py-3 rounded-full font-semibold text-base transition-all duration-200"
            style={{
              background: 'transparent',
              border: '1.5px solid #6B7C4A',
              color: '#6B7C4A',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              letterSpacing: '0.5px',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#6B7C4A'; e.currentTarget.style.color = '#f0ebd0'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7C4A'; }}
          >
            Register
          </button>

          <p className="text-center text-xs mt-1" style={{ color: '#a0a0a0' }}>
            Belum punya akun? Daftar di atas
          </p>
        </div>
      </div>
    </div>
  );
}
