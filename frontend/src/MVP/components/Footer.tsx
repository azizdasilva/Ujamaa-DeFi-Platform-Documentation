/**
 * Global Footer Component
 * Displayed on all pages across the platform
 */

import React from 'react';
import TestnetNotice from './TestnetNotice';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#023D7A] text-white py-12 mt-auto" style={{ backgroundColor: '#023D7A' }}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4" style={{ color: '#FFFFFF' }}>Ujamaa DeFi Platform</h3>
            <p className="text-sm mb-4" style={{ color: '#FFFFFF' }}>
              Institutional DeFi for African Real-World Assets
            </p>
            <TestnetNotice variant="badge" />
          </div>

          {/* Documentation */}
          <div>
            <h4 className="text-lg font-bold mb-4" style={{ color: '#FFFFFF' }}>Documentation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/deep-dive" className="block py-1" style={{ color: '#FFFFFF', fontWeight: '400' }}>
                  Deep Dive
                </a>
              </li>
              <li>
                <a href="/docs/glossary" className="block py-1" style={{ color: '#FFFFFF', fontWeight: '400' }}>
                  📖 Glossary
                </a>
              </li>
              <li>
                <a href="/investors-room" className="block py-1" style={{ color: '#FFFFFF', fontWeight: '400' }}>
                  Investors Room
                </a>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-lg font-bold mb-4" style={{ color: '#FFFFFF' }}>Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/select-role" className="block py-1" style={{ color: '#FFFFFF', fontWeight: '400' }}>
                  Select Role
                </a>
              </li>
              <li>
                <a href="/institutional/pools" className="block py-1" style={{ color: '#FFFFFF', fontWeight: '400' }}>
                  Pool Marketplace
                </a>
              </li>
              <li>
                <a href="/onboarding" className="block py-1" style={{ color: '#FFFFFF', fontWeight: '400' }}>
                  Onboarding
                </a>
              </li>
            </ul>
          </div>

          {/* Network */}
          <div>
            <h4 className="text-lg font-bold mb-4" style={{ color: '#FFFFFF' }}>Network</h4>
            <ul className="space-y-2 text-sm">
              <li style={{ color: '#FFFFFF' }}>Polygon Amoy</li>
              <li style={{ color: '#FFFFFF' }}>Chain ID: 80002</li>
              <li>
                <a
                  href="https://amoy.polygonscan.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1"
                  style={{ color: '#00A8A8', fontWeight: '700' }}
                >
                  Block Explorer
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-8" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-center md:text-left" style={{ color: '#FFFFFF' }}>
              © 2026 Ujamaa DeFi Platform. All rights reserved.
            </p>
            <p className="text-sm text-center md:text-right" style={{ color: '#FFFFFF' }}>
              🚀 MVP Testnet • No real funds are handled
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
