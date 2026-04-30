import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;

  const adminRoles = ['admin', 'superadmin', 'moderator', 'analyst', 'editor'];

  if (role === 'admin') {
    if (!adminRoles.includes(user.role)) {
      return <Navigate to="/403" replace />;
    }
  } else if (role === 'superadmin') {
    if (user.role !== 'superadmin') {
      return <Navigate to="/403" replace />;
    }
  } else if (role === 'user') {
    if (user.role !== 'user') {
      
      
      return <Navigate to="/admin-dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
