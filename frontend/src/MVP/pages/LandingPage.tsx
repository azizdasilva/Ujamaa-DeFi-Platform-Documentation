/**
 * Landing Page - Home Page for Ujamaa DeFi Platform
 * 
 * This is the FIRST page users see before selecting a role.
 * Features:
 * - Hero section with value proposition
 * - Feature highlights
 * - Call-to-action to select role
 * - Trust indicators
 */

import React from 'react';
import Navigation from '../components/Navigation';
import TestnetNotice from '../components/TestnetNotice';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Institutional DeFi for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#023D7A] to-[#00A8A8]">
                African Real-World Assets
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Tokenize assets, access liquidity, and earn yield from African industrial growth.
              Powered by blockchain technology and compliant with international regulations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="/select-role"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-[#F3F8FA] bg-gradient-to-r from-[#00A8A8] to-[#023D7A] rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Get Started
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/deep-dive"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-[#F3F8FA] bg-[#023D7A]/10 backdrop-blur-sm border-2 border-[#00A8A8] rounded-xl hover:bg-[#00A8A8]/20 transition-all duration-300"
              >
                Learn More
              </a>
            </div>

            {/* Testnet Notice */}
            <div className="flex justify-center">
              <TestnetNotice variant="badge" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Ujamaa DeFi Platform?
            </h2>
            <p className="text-xl text-gray-600">
              Built for institutional investors and African industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-gradient-to-br from-[#023D7A]/5 to-white rounded-2xl border border-[#48A9F0]/30 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-[#023D7A] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#023D7A] mb-3">Compliant & Secure</h3>
              <p className="text-[#333333]">
                ERC-3643 compliant tokens with identity verification. Regulated under Mauritius FSC framework.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-gradient-to-br from-[#00A8A8]/5 to-white rounded-2xl border border-[#48A9F0]/30 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-[#00A8A8] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#023D7A] mb-3">Yield-Bearing Tokens</h3>
              <p className="text-[#333333]">
                Earn 8-15% APY from real industrial assets. Automatic yield distribution via uLP tokens.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-gradient-to-br from-[#48A9F0]/5 to-white rounded-2xl border border-[#48A9F0]/30 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-[#48A9F0] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#023D7A] mb-3">African Growth</h3>
              <p className="text-[#333333]">
                Direct access to African industrial opportunities. Manufacturing, agriculture, trade finance, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-[#023D7A] to-[#00A8A8] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">5</div>
              <div className="text-white/80">Pool Families</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">8-15%</div>
              <div className="text-white/80">Target APY</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">6</div>
              <div className="text-white/80">User Roles</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-white/80">Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Choose your role and start your journey with Ujamaa DeFi Platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/select-role"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-[#00A8A8] to-[#023D7A] rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Select Your Role
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="/onboarding"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-[#023D7A] bg-[#F3F8FA] border-2 border-[#023D7A] rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              🚀 Investor Onboarding
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
