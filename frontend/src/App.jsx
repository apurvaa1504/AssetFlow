import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Booking from './pages/Booking.jsx';
import Maintenance from './pages/Maintenance.jsx';
import Audit from './pages/Audit.jsx';
import Reports from './pages/Reports.jsx';

export default function App() {
  return (
    <div className="flex">
      <Navbar />
      <main className="min-h-screen flex-1 overflow-y-auto p-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
}
