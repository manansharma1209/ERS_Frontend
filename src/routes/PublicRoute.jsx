import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PublicRoute = ({ children }) => {
  const { auth } = useAuth();
  
  if (auth) {
    return <Navigate to={auth.role === "ADMIN" ? "/admin" : "/home"} />;
  }
  return children;
};