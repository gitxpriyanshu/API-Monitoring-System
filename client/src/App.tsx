import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './pages/DashboardLayout';
import Overview from './pages/Overview';
import Endpoints from './pages/Endpoints';
import Performance from './pages/Performance';
import Errors from './pages/Errors';
import Realtime from './pages/Realtime';

import Analytics from './pages/Analytics';
import Keys from './pages/Keys';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        
        {}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="realtime" element={<Realtime />} />
          <Route path="performance" element={<Performance />} />
          <Route path="endpoints" element={<Endpoints />} />
          <Route path="errors" element={<Errors />} />
          <Route path="keys" element={<Keys />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {}
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
