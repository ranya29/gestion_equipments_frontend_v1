import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');

  // لو ما فماش token → رجّعو للـ SignIn
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
