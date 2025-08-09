import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const { session, loading } = useAuth();
  if (loading) return <div />; // evita parpadeo y redirecciones prematuras
  if (!session) return <Navigate to="/admin/login" replace />;
  return children;
}


