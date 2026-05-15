import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

type Props = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}