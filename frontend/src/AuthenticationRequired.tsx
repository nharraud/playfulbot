import { useContext, ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router';
import { UserContext } from './UserContext';

export function AuthenticationRequired({ children }: { children?: ReactNode }) {
  const { authenticated } = useContext(UserContext);

  if (!authenticated) {
    return <Navigate to={'/login'} replace />;
  }
  return children ? children : <Outlet/>;
}