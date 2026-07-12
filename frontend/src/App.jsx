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
import EmployeeDirectory from './pages/EmployeeDirectory.jsx';
import AssetDirectory from './pages/AssetDirectory.jsx';
import MyAssets from './pages/MyAssets.jsx';
import DepartmentAssets from './pages/DepartmentAssets.jsx';
import Notifications from './pages/Notifications.jsx';

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
              <ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organization"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <OrganizationSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <EmployeeDirectory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER']}>
                <AssetDirectory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-assets"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                <MyAssets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/department-assets"
            element={
              <ProtectedRoute allowedRoles={['DEPARTMENT_HEAD']}>
                <DepartmentAssets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']}>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER', 'EMPLOYEE']}>
                <Maintenance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER']}>
                <Audit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD']}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']}>
                <Notifications />
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
