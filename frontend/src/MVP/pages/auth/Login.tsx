/**
 * Login Page
 * User authentication with email/password or wallet
 *
 * Route: /login
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { InvestorRole } from '../../../types';
import MVPBanner from '../../components/MVPBanner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginMethod, setLoginMethod] = useState<'email' | 'wallet'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock email/password authentication
    setTimeout(() => {
      // In production, this would validate against backend
      if (email && password) {
        // Determine role based on email (mock logic)
        let role: InvestorRole = 'RETAIL_INVESTOR';
        if (email.includes('institutional')) role = 'INSTITUTIONAL_INVESTOR';
        else if (email.includes('operator') || email.includes('industrial')) role = 'INDUSTRIAL_OPERATOR';
        else if (email.includes('compliance')) role = 'COMPLIANCE_OFFICER';
        else if (email.includes('admin')) role = 'ADMIN';
        else if (email.includes('regulator')) role = 'REGULATOR';

        login(role);
        navigate(`/${role.toLowerCase()}/dashboard`);
      } else {
        setError('Please enter valid credentials');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleWalletLogin = () => {
    setError('');
    setIsLoading(true);

    // Mock wallet connection
    setTimeout(() => {
      // In production, this would connect to actual wallet
      login('RETAIL_INVESTOR', '0x1234...5678');
      navigate('/retail/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F8FA] to-[#E8F4F8]">
      <MVPBanner />
      
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="/assets/images/logo-transparent.png"
              alt="Ujamaa DeFi"
              className="h-32 mx-auto"
            />
            <h1 className="text-3xl font-bold text-[#023D7A] mt-4">Welcome Back</h1>
            <p className="text-[#333333] mt-2">Sign in to access your dashboard</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#48A9F0]/20">
            {/* Login Method Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                  loginMethod === 'email'
                    ? 'bg-gradient-to-r from-[#00A8A8] to-[#023D7A] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📧 Email
              </button>
              <button
                onClick={() => setLoginMethod('wallet')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                  loginMethod === 'wallet'
                    ? 'bg-gradient-to-r from-[#00A8A8] to-[#023D7A] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                👛 Wallet
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Email Login Form */}
            {loginMethod === 'email' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#023D7A] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A8A8] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#023D7A] mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A8A8] focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-[#00A8A8] hover:text-[#0D7A7A] font-bold">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-[#00A8A8] to-[#023D7A] hover:from-[#0D7A7A] hover:to-[#034F9A] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* Wallet Login */}
            {loginMethod === 'wallet' && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-800 font-semibold mb-2">
                    🔗 Connect Your Wallet
                  </p>
                  <p className="text-xs text-blue-700">
                    Connect your MetaMask or WalletConnect compatible wallet to sign in.
                  </p>
                </div>

                <button
                  onClick={handleWalletLogin}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-[#00A8A8] to-[#023D7A] hover:from-[#0D7A7A] hover:to-[#034F9A] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M29.96 8.06a2.9 2.9 0 00-1.67-1.36l-3.28-.86-1.35-3.12a2.93 2.93 0 00-5.32 0l-1.35 3.12-3.28.86a2.9 2.9 0 00-1.67 1.36L2.04 12.6a2.9 2.9 0 001.67 4.14l3.28.86 1.35 3.12a2.93 2.93 0 005.32 0l1.35-3.12 3.28-.86a2.9 2.9 0 001.67-4.14l-3.28-4.54zM16 21.5a5.5 5.5 0 110-11 5.5 5.5 0 010 11z"/>
                  </svg>
                  {isLoading ? 'Connecting...' : 'Connect MetaMask'}
                </button>

                <button
                  onClick={handleWalletLogin}
                  disabled={isLoading}
                  className="w-full py-3 border-2 border-gray-300 hover:border-[#00A8A8] text-gray-700 hover:text-[#00A8A8] font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Connect WalletConnect
                </button>
              </div>
            )}

            {/* Demo Accounts Link */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 mb-3">
                Want to try the platform first?
              </p>
              <Link
                to="/demo-accounts"
                className="block w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all text-center"
              >
                🎯 Try Demo Accounts
              </Link>
            </div>

            {/* Register Link */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#00A8A8] hover:text-[#0D7A7A] font-bold">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-[#023D7A] font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
