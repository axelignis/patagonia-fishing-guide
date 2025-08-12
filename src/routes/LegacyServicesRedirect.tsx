import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * LegacyServicesRedirect
 * - Si un admin entra por la ruta vieja /admin/guides/:id/services lo mandamos a la nueva si quiere ver como guía
 * - Si un guía (no admin) intenta acceder a la antigua ruta, redirigimos de inmediato a la nueva ruta limpia.
 * - Evita que se perciba como un área administrativa.
 */
// Redirección legacy desde /admin/guides/:id/services a /panel-guia/guides/:id/services
export default function LegacyServicesRedirect(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, canAccessAdmin } = useAuth();

  // Si no hay id válido, mandar al panel
  if (!id) return <Navigate to="/panel-guia" replace />;

  // Admin puede seguir usando la ruta admin si quisiera auditar, pero sugerimos moverlo
  // Para simplificar, siempre redirigimos a la nueva ruta.
  const target = `/panel-guia/guides/${id}/services`;

  return <Navigate to={target} replace />;
}
