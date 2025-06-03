import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import RoomManager from './pages/RoomManager';
import AvailabilityManager from './pages/AvailabilityManager';

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
                <p className="text-gray-600">
                  Use the navigation above to manage your rooms and availability.
                </p>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/rooms"
          element={
            <ProtectedRoute>
              <RoomManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/availability"
          element={
            <ProtectedRoute>
              <AvailabilityManager />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
