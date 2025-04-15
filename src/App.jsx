import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ApiProvider } from './contexts/ApiContext';
import { Login } from './Components/Login';
import { AdminApp } from './Components/Admin/AdminPage';
import { Dashboard } from './components/Dashboard';
import { ProtectedRoute, AdminRoute, PublicRoute } from './components/RouteGuards';

function App() {
  return (
    <AuthProvider>
      <ApiProvider>
        <Router>
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/home" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/*" element={
              <AdminRoute>
                <AdminApp />
              </AdminRoute>
            } />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </ApiProvider>
    </AuthProvider>
  );
}

export default App;