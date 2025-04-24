import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../Components/Login';
import { Dashboard } from '../Components/Dashboard';
import { AdminApp } from '../Components/Admin/AdminPage';
import { PublicRoute } from './PublicRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { useAuth } from '../context/AuthContext';

export function AppRoutes() {
  const { auth } = useAuth();
  
  const isAuthenticated = () => auth !== null;
  const isAdmin = () => auth?.role === "ADMIN";

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Navigate to={isAuthenticated() ? (isAdmin() ? "/admin" : "/home") : "/login"} />
        } />
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
        <Route path="*" element={
          <Navigate to={isAuthenticated() ? (isAdmin() ? "/admin" : "/home") : "/login"} />
        } />
      </Routes>
    </Router>
  );
}