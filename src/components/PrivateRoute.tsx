import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  requiredRole?: 'ADMIN' | 'UNIVERSITY' | 'STUDENT';
}

const PrivateRoute = ({ requiredRole }: Props) => {
  const { token, user } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
