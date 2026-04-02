/**
 * Unauthorized Access Page
 * Displayed when user tries to access a route they don't have permission for
 */

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import MVPBanner from '../../components/MVPBanner';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Get user's dashboard based on role
  const getDashboardPath = () => {
    if (!user) return '/login';
    
    const dashboardPaths: Record<string, string> = {
      INSTITUTIONAL_INVESTOR: '/institutional/dashboard',
      RETAIL_INVESTOR: '/retail/dashboard',
      INDUSTRIAL_OPERATOR: '/originator/dashboard',
      COMPLIANCE_OFFICER: '/compliance/dashboard',
      ADMIN: '/admin/dashboard',
      REGULATOR: '/regulator/dashboard',
    };
    
    return dashboardPaths[user.role] || '/demo-accounts';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F8FA] to-[#E8F4F8]">
      <MVPBanner />
      
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          {/* Error Icon */}
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-[#023D7A] mb-4">
            Access Denied
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            You don't have permission to access this page.
          </p>
          {user && (
            <p className="text-sm text-gray-500 mb-8">
              Your role ({user.role.replace(/_/g, ' ')}) doesn't include access to this feature.
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 mb-8">
            <Link
              to={getDashboardPath()}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-[#00A8A8] to-[#023D7A] rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              📊 Go to Your Dashboard
            </Link>
            
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-[#023D7A] bg-white border-2 border-[#023D7A] rounded-xl hover:bg-[#023D7A]/5 transition-all"
            >
              ← Go Back
            </button>
            
            <Link
              to="/demo-accounts"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-[#00A8A8] bg-[#00A8A8]/10 rounded-xl hover:bg-[#00A8A8]/20 transition-all"
            >
              🎯 Try Different Demo Account
            </Link>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Currently logged in as:</p>
              <p className="font-bold text-[#023D7A]">{user.name}</p>
              <p className="text-sm text-gray-500">{user.role.replace(/_/g, ' ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
