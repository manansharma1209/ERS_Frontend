import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

export const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "ADMIN") return <Navigate to="/home" />;
  return children;
};

export const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/home"} />;
  }
  return children;
};
