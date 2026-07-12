import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Booking from './pages/Booking.jsx';
import Maintenance from './pages/Maintenance.jsx';
import Audit from './pages/Audit.jsx';
import Reports from './pages/Reports.jsx';
import OrganizationSetup from './pages/OrganizationSetup.jsx';

function Layout() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  return (
    <div className={isLogin ? '' : 'flex'}>
      {!isLogin && (
        <ProtectedRoute>
          <Navbar />
        </ProtectedRoute>
      )}
      <main className={isLogin ? '' : 'min-h-screen flex-1 overflow-y-auto p-8'}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organization"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <OrganizationSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance"
            element={
              <ProtectedRoute>
                <Maintenance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit"
            element={
              <ProtectedRoute allowedRoles={['admin', 'asset_manager']}>
                <Audit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['admin', 'asset_manager', 'department_head']}>
                <Reports />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}