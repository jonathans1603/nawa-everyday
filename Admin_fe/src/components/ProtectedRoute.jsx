import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute — Wrapper untuk melindungi halaman berdasarkan role user.
 *
 * Cara pakai di App.jsx:
 *   <Route path="/kitchen" element={
 *     <ProtectedRoute allowedRoles={['dapur', 'kitchen', 'admin']}>
 *       <KitchenDashboard />
 *     </ProtectedRoute>
 *   } />
 *
 * @param {string[]} allowedRoles - Role yang diizinkan mengakses halaman ini
 * @param {ReactNode} children    - Komponen halaman yang akan dirender
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  // Ambil data user dari sessionStorage
  const stored = sessionStorage.getItem('nawa_user');

  // Jika tidak ada session → redirect ke login
  if (!stored) {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(stored);
  } catch {
    // Jika data corrupt → hapus dan redirect ke login
    sessionStorage.removeItem('nawa_user');
    return <Navigate to="/login" replace />;
  }

  // Cek apakah role user termasuk dalam allowedRoles (case-insensitive)
  const userRole = user?.role?.toLowerCase() || '';
  const isAllowed = allowedRoles.map(r => r.toLowerCase()).includes(userRole);

  if (!isAllowed) {
    // Sudah login tapi role salah → redirect ke halaman yang sesuai rolenya
    if (userRole === 'admin')              return <Navigate to="/admin"   replace />;
    if (userRole === 'kasir')              return <Navigate to="/kasir"   replace />;
    if (['dapur', 'kitchen'].includes(userRole)) return <Navigate to="/kitchen" replace />;
    if (userRole === 'owner')              return <Navigate to="/owner"   replace />;
    // Role tidak dikenal → ke login
    return <Navigate to="/login" replace />;
  }

  return children;
}
