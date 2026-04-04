/**
 * Protected Route Component
 * Restricts access to routes based on user role
 *
 * Role Hierarchy:
 *   ADMIN            -> Full access to everything (read + write)
 *   COMPLIANCE_OFFICER -> View everything (like REGULATOR) + compliance write ops
 *   REGULATOR        -> View everything (read-only global access)
 *   INVESTOR/OPERATOR -> Access their own areas only
 *
 * Usage:
 *   <ProtectedRoute requiredRoles={['ADMIN']}>
 *     <AdminPage />
 *   </ProtectedRoute>
 *
 *   <ProtectedRoute requiredRoles={['COMPLIANCE_OFFICER']} writeOnly>
 *     <ComplianceAction />
 *   </ProtectedRoute>
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { InvestorRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: InvestorRole[];
  fallbackPath?: string;
  /**
   * If true, only ADMIN can access (write-protected).
   * REGULATOR and COMPLIANCE_OFFICER will be denied even if listed in requiredRoles.
   * Use this for pages with write/admin operations.
   * Default: false (read-access mode).
   */
  writeOnly?: boolean;
}

// Roles that have global read access (can see everything)
const GLOBAL_READ_ROLES: InvestorRole[] = ['REGULATOR', 'COMPLIANCE_OFFICER'];

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  fallbackPath = '/unauthorized',
  writeOnly = false,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F3F8FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00A8A8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#023D7A] font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ADMIN bypass: can access everything (read + write)
  if (user.role === 'ADMIN') {
    return <>{children}</>;
  }

  // For write-only endpoints, only ADMIN is allowed
  if (writeOnly) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Global read access: REGULATOR and COMPLIANCE_OFFICER can view any page
  // (but not write-only pages, handled above)
  if (GLOBAL_READ_ROLES.includes(user.role)) {
    return <>{children}</>;
  }

  // Standard role check for investor/operator roles
  if (!requiredRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // User is authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
