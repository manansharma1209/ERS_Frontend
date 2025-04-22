import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = ({ children }) => {
  const { auth } = useAuth();
  
  if (!auth) {
    return <Navigate to="/login" />;
  }
  if (auth?.role !== "ADMIN") {
    return <Navigate to="/home" />;
  }
  return children;
};