import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/register.jsx';
import AdminDashboard from './pages/Admindashboard.jsx';
import KitchenDashboard from './pages/kitchendashboard.jsx';
import KasirDashboard from './pages/kasirdashboard.jsx';
import OwnerDashboard from './pages/ownerdashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin: hanya role 'admin' */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Kitchen: hanya role 'dapur' atau 'kitchen' */}
        <Route path="/kitchen" element={
          <ProtectedRoute allowedRoles={['dapur', 'kitchen']}>
            <KitchenDashboard />
          </ProtectedRoute>
        } />

        {/* Kasir: hanya role 'kasir' */}
        <Route path="/kasir" element={
          <ProtectedRoute allowedRoles={['kasir']}>
            <KasirDashboard />
          </ProtectedRoute>
        } />

        {/* Owner: hanya role 'owner' */}
        <Route path="/owner" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
