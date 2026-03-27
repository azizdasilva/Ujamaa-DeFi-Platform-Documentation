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

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10" />

        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Institutional DeFi for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#023D7A] to-[#00A8A8]">
                African Real-World Assets
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              Tokenize assets, access liquidity, and earn yield from African industrial growth.
              Powered by blockchain technology and compliant with international regulations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href="/select-role"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-[#00A8A8] to-[#023D7A] rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                style={{ color: '#FFFFFF' }}
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
              style={{ color: '#FFFFFF' }}
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

      {/* Technology Badges Section */}
      <section className="py-12 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h4 className="text-xl font-bold text-[#023D7A] mb-2">
              🔧 Powered By
            </h4>
            <p className="text-sm text-gray-600">
              Enterprise-grade blockchain infrastructure
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Polygon Badge */}
            <div className="group bg-white border-2 border-[#8247E5]/30 rounded-xl p-5 hover:border-[#8247E5] hover:shadow-[0_0_20px_rgba(130,71,229,0.2)] transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-[#8247E5] to-[#8247E5]/80 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  {/* Polygon Logo */}
                  <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12.001,2.909 16.196,5.333 16.196,10.182 12.001,12.606 7.805,10.182 7.805,5.333" opacity="0.6"/>
                    <polygon points="12.001,11.394 16.196,13.818 16.196,18.667 12.001,21.091 7.805,18.667 7.805,13.818"/>
                    <polygon points="16.196,5.333 20.391,7.757 20.391,12.606 16.196,15.03 16.196,10.182 12.001,7.757"/>
                    <polygon points="7.805,7.757 12.001,10.182 12.001,15.03 7.805,17.454 7.805,12.606 3.609,10.182"/>
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-[#023D7A]">Polygon</h5>
                  <p className="text-xs text-gray-600">Layer 2 Scaling</p>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[9px] text-green-600 font-semibold">Amoy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ERC-3643 Badge */}
            <div className="group bg-white border-2 border-[#00A8A8]/30 rounded-xl p-5 hover:border-[#00A8A8] hover:shadow-[0_0_20px_rgba(0,168,168,0.2)] transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-[#00A8A8] to-[#023D7A] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  {/* ERC-3643 Token Icon */}
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-[#023D7A]">ERC-3643</h5>
                  <p className="text-xs text-gray-600">Permissioned Tokens</p>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-[9px] text-blue-600 font-semibold">Compliant</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Blockchain Badge */}
            <div className="group bg-white border-2 border-[#F59E0B]/30 rounded-xl p-5 hover:border-[#F59E0B] hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-[#F59E0B] to-[#F59E0B]/80 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  {/* Blockchain/Network Icon */}
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-[#023D7A]">Blockchain</h5>
                  <p className="text-xs text-gray-600">Smart Contracts</p>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-[9px] text-amber-600 font-semibold">Immutable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack Info */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm">
              <svg className="w-4 h-4 text-[#00A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Solidity 0.8.20
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm">
              <svg className="w-4 h-4 text-[#00A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Foundry Tested
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              OpenZeppelin
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Chain ID: 80002
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
