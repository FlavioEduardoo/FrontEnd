import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

type Props = {
  children: React.ReactNode;
};

export function PublicOnlyRoute({ children }: Props) {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}