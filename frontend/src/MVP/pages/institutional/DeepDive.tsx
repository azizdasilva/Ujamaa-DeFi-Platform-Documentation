/**
 * Deep Dive Technical Documentation Page
 *
 * Comprehensive technical documentation for the Ujamaa DeFi Platform MVP.
 * Includes 6 sections: Architecture, Smart Contracts, Backend, API, Security, Performance.
 *
 * @reference 09_DEEP_DIVE_INVESTORS_ROOM.md Section 1
 * @reference 02_MVP_IMPLEMENTATION_PLAN.md Phase 4
 * @reference SRS v2.0
 *
 * Route: /deep-dive
 *
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 * @notice Last Updated: March 2026
 */

import React, { useState, useEffect } from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import MockDataBadge from '../../components/MockDataBadge';
import Card from '../../components/Card';

// Section types
type SectionId = 'architecture' | 'smart-contracts' | 'backend' | 'api' | 'security' | 'performance';

interface Section {
  id: SectionId;
  title: string;
  icon: React.ReactNode;
}

const sections: Section[] = [
  {
    id: 'architecture',
    title: 'Architecture Overview',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: 'smart-contracts',
    title: 'Smart Contracts',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 'backend',
    title: 'Backend Services',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
  },
  {
    id: 'api',
    title: 'API Reference',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'security',
    title: 'Security Model',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 'performance',
    title: 'Performance',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const DeepDive: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('architecture');

  // Scroll to section when active section changes
  useEffect(() => {
    const element = document.getElementById(activeSection);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-[#F3F8FA]">
      {/* MVP Banner */}
      <MVPBanner />

      {/* Header */}
      <header className="bg-white border-b border-[#48A9F0]/30">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-[#023D7A]">Deep Dive</h1>
              <p className="text-[#333333] mt-2 text-lg">Technical Documentation - MVP Architecture</p>
            </div>
            <div className="flex items-center gap-3">
              <TestnetNotice variant="badge" />
              <MockDataBadge />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex gap-12">
          {/* Sticky Sidebar Navigation */}
          <aside className="w-72 flex-shrink-0">
            <nav className="sticky top-8 space-y-2">
              <p className="text-xs font-bold text-[#333333]/60 uppercase tracking-wider mb-4">
                Sections
              </p>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl
                    transition-all duration-200
                    ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-[#00A8A8] to-[#023D7A] text-white shadow-lg'
                        : 'text-[#023D7A] hover:bg-[#023D7A]/5'
                    }
                  `}
                >
                  <span className={activeSection === section.id ? 'text-white' : 'text-[#00A8A8]'}>
                    {section.icon}
                  </span>
                  {section.title}
                </button>
              ))}

              {/* Quick Info */}
              <div className="mt-8 p-5 bg-gradient-to-br from-[#023D7A]/5 to-[#00A8A8]/5 rounded-2xl border border-[#48A9F0]/30">
                <p className="text-xs font-bold text-[#023D7A] mb-3">📊 Quick Stats</p>
                <ul className="text-xs text-[#023D7A] space-y-2">
                  <li>• 11 Smart Contracts</li>
                  <li>• 5 Pool Families</li>
                  <li>• 15+ API Endpoints</li>
                  <li>• 12 Blocked Jurisdictions</li>
                  <li>• Solidity 0.8.20</li>
                  <li>• Polygon Amoy Testnet</li>
                </ul>
              </div>

              {/* Contract Addresses */}
              <div className="mt-6 p-5 bg-white rounded-2xl border border-[#48A9F0]/30">
                <p className="text-xs font-bold text-[#023D7A] mb-3">🔗 Contract Status</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#333333]">ULPTokenizer:</span>
                    <span className="text-[#00A8A8] font-mono">Deployed ✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#333333]">GuaranteeTokenizer:</span>
                    <span className="text-[#00A8A8] font-mono">Deployed ✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#333333]">LiquidityPool:</span>
                    <span className="text-[#00A8A8] font-mono">Deployed ✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#333333]">IndustrialGateway:</span>
                    <span className="text-[#00A8A8] font-mono">Deployed ✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#333333]">JurisdictionCompliance:</span>
                    <span className="text-[#00A8A8] font-mono">Deployed ✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#333333]">IdentityRegistry:</span>
                    <span className="text-[#00A8A8] font-mono">Deployed ✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#333333]">Compliance:</span>
                    <span className="text-[#00A8A8] font-mono">Deployed ✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#333333]">MockEUROD:</span>
                    <span className="text-[#00A8A8] font-mono">Deployed ✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#333333]">MockEscrow:</span>
                    <span className="text-[#00A8A8] font-mono">Deployed ✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#333333]">MockFiatRamp:</span>
                    <span className="text-[#00A8A8] font-mono">Deployed ✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#333333]">NavGateway:</span>
                    <span className="text-[#00A8A8] font-mono">Deployed ✓</span>
                  </div>
                </div>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-12">
            {/* Architecture Section */}
            <section id="architecture" className="scroll-mt-8">
              <Card header={
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#00A8A8] to-[#023D7A] rounded-xl text-white">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#023D7A]">Architecture Overview</h2>
                </div>
              }>
                <div className="space-y-8">
                  <p className="text-[#333333] text-lg leading-relaxed">
                    The Ujamaa DeFi Platform MVP is built on a modular, layered architecture with clear separation
                    between smart contracts, backend services, and frontend components. The system employs a factory
                    pattern for mock/production service swapping, enabling seamless transition from testnet to mainnet.
                  </p>

                  {/* System Diagram */}
                  <div className="bg-gradient-to-br from-[#F3F8FA] to-white rounded-2xl p-8 border border-[#48A9F0]/30">
                    <h3 className="text-lg font-bold text-[#023D7A] mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#00A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                      System Architecture
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-gradient-to-br from-[#023D7A] to-[#00A8A8] rounded-2xl text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-3 right-3 opacity-20">
                          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                          </svg>
                        </div>
                        <p className="font-bold text-lg mb-2">Frontend Layer</p>
                        <p className="text-white/90 text-sm mb-3">React 19 + TypeScript</p>
                        <div className="space-y-1 text-xs text-white/80">
                          <p className="flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            Vite 5.1 Build Tool
                          </p>
                          <p className="flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
                            Tailwind CSS 4
                          </p>
                          <p className="flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                            React Query 5
                          </p>
                          <p className="flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                            React Router 7
                          </p>
                        </div>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-[#00A8A8] to-[#48A9F0] rounded-2xl text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-3 right-3 opacity-20">
                          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2zm4-8h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6v-2z"/>
                          </svg>
                        </div>
                        <p className="font-bold text-lg mb-2">Backend Layer</p>
                        <p className="text-white/90 text-sm mb-3">FastAPI + Python</p>
                        <div className="space-y-1 text-xs text-white/80">
                          <p className="flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg>
                            PostgreSQL Database
                          </p>
                          <p className="flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            Redis Caching
                          </p>
                          <p className="flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                            Mock Service Factory
                          </p>
                          <p className="flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                            Yield Calculator
                          </p>
                        </div>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-[#48A9F0] to-[#023D7A] rounded-2xl text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-3 right-3 opacity-20">
                          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                          </svg>
                        </div>
                        <p className="font-bold text-lg mb-2">Blockchain Layer</p>
                        <p className="text-white/90 text-sm mb-3">Solidity 0.8.20</p>
                        <div className="space-y-1 text-xs text-white/80">
                          <p className="flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            Polygon Amoy Testnet
                          </p>
                          <p className="flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                            ERC-3643 Compliance
                          </p>
                          <p className="flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                            11 Smart Contracts
                          </p>
                          <p className="flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                            Foundry Testing
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Component Table */}
                  <div>
                    <h3 className="text-lg font-bold text-[#023D7A] mb-4">Core Components</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-[#48A9F0]/30">
                            <th className="text-left py-4 px-4 font-bold text-[#023D7A]">Layer</th>
                            <th className="text-left py-4 px-4 font-bold text-[#023D7A]">Components</th>
                            <th className="text-left py-4 px-4 font-bold text-[#023D7A]">Technology</th>
                          </tr>
                        </thead>
                        <tbody className="text-[#333333]">
                          <tr className="border-b border-[#48A9F0]/20">
                            <td className="py-4 px-4 font-semibold">Smart Contracts</td>
                            <td className="py-4 px-4">ULPTokenizer, LiquidityPool, JurisdictionCompliance, IdentityRegistry, Compliance, GuaranteeTokenizer, IndustrialGateway, MockEscrow, MockFiatRamp, NavGateway, MockEUROD</td>
                            <td className="py-4 px-4">Solidity 0.8.20, ERC-3643, ERC-721</td>
                          </tr>
                          <tr className="border-b border-[#48A9F0]/20">
                            <td className="py-4 px-4 font-semibold">Backend Services</td>
                            <td className="py-4 px-4">MockBank, MockGDIZ, YieldCalculator, Pool API, Compliance API, FastAPI</td>
                            <td className="py-4 px-4">Python 3.11+, FastAPI, PostgreSQL</td>
                          </tr>
                          <tr>
                            <td className="py-4 px-4 font-semibold">Frontend</td>
                            <td className="py-4 px-4">Dashboard, Pool Marketplace, Portfolio, Deep Dive, Investors Room, Glossary</td>
                            <td className="py-4 px-4">React 19, TypeScript 5.4, Vite</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Data Flow */}
                  <div className="bg-white rounded-2xl p-6 border border-[#48A9F0]/30">
                    <h3 className="text-lg font-bold text-[#023D7A] mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#00A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Investment Data Flow
                    </h3>
                    <div className="relative">
                      {/* Connection Line */}
                      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00A8A8] via-[#023D7A] to-[#48A9F0] hidden md:block"/>
                      
                      <div className="space-y-6">
                        {[
                          {
                            step: '1',
                            title: 'User Interaction',
                            desc: 'Investor submits investment via frontend',
                            icon: (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/>
                              </svg>
                            ),
                            color: 'from-[#023D7A] to-[#00A8A8]'
                          },
                          {
                            step: '2',
                            title: 'API Validation',
                            desc: 'Backend validates compliance & jurisdiction',
                            icon: (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                            ),
                            color: 'from-[#00A8A8] to-[#48A9F0]'
                          },
                          {
                            step: '3',
                            title: 'Smart Contract Execution',
                            desc: 'LiquidityPool mints uLP tokens at current NAV',
                            icon: (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                              </svg>
                            ),
                            color: 'from-[#48A9F0] to-[#023D7A]'
                          },
                          {
                            step: '4',
                            title: 'Yield Distribution',
                            desc: 'Yield accrues, NAV increases, value grows',
                            icon: (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                            ),
                            color: 'from-[#00A8A8] to-[#D57028]'
                          },
                        ].map((item, index) => (
                          <div key={item.step} className="flex items-center gap-4 relative">
                            {/* Step Number Ondo Finance */}
                            <div className={`hidden md:flex w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} items-center justify-center text-white font-bold text-xl shadow-lg z-10 flex-shrink-0`}>
                              {item.step}
                            </div>
                            
                            {/* Content Card */}
                            <div className="flex-1 p-5 bg-gradient-to-br from-[#F3F8FA] to-white rounded-xl border border-[#48A9F0]/30 hover:shadow-lg transition-all duration-300">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} text-white md:hidden`}>
                                  {item.icon}
                                </div>
                                <div className="hidden md:block text-[#00A8A8]">
                                  {item.icon}
                                </div>
                                <p className="font-bold text-[#023D7A]">{item.title}</p>
                              </div>
                              <p className="text-sm text-[#333333] ml-0 md:ml-1">{item.desc}</p>
                            </div>
                            
                            {/* Arrow */}
                            {index < 3 && (
                              <svg className="w-6 h-6 text-[#00A8A8] flex-shrink-0 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Smart Contracts Section */}
            <section id="smart-contracts" className="scroll-mt-8">
              <Card header={
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#48A9F0] to-[#023D7A] rounded-xl text-white">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#023D7A]">Smart Contracts</h2>
                </div>
              }>
                <div className="space-y-8">
                  <p className="text-[#333333] text-lg leading-relaxed">
                    MVP deploys 11 smart contracts on Polygon Amoy testnet (Chain ID: 80002).
                    All contracts implement ERC-3643 compliance primitives for identity verification
                    and transfer restrictions. Built with Solidity 0.8.20 and tested with Foundry.
                  </p>

                  {/* Contract Hierarchy */}
                  <div>
                    <h3 className="text-lg font-bold text-[#023D7A] mb-4">Contract Hierarchy</h3>
                    <div className="space-y-3">
                      {[
                        {
                          name: 'ULPTokenizer.sol',
                          desc: 'Yield-bearing LP token (ERC-3643)',
                          lines: '~720',
                          color: 'from-[#023D7A] to-[#00A8A8]',
                          features: ['Value-accrual model', 'NAV-based pricing', 'ERC-3643 transfer checks', 'Role-based access']
                        },
                        {
                          name: 'IdentityRegistry.sol',
                          desc: 'ERC-3643 identity management',
                          lines: '~260',
                          color: 'from-[#7C3AED] to-[#A855F7]',
                          features: ['Identity registration', 'On-chain verification', 'Jurisdiction tracking']
                        },
                        {
                          name: 'Compliance.sol',
                          desc: 'Transfer compliance module',
                          lines: '~220',
                          color: 'from-[#A855F7] to-[#023D7A]',
                          features: ['Transfer validation', 'Compliance reason codes', 'Identity-linked']
                        },
                        {
                          name: 'LiquidityPool.sol',
                          desc: 'Multi-asset pool manager (5 families)',
                          lines: '~980',
                          color: 'from-[#00A8A8] to-[#48A9F0]',
                          features: ['5 pool families', 'Diversification limits', 'UGT minting on financing', 'Yield distribution']
                        },
                        {
                          name: 'JurisdictionCompliance.sol',
                          desc: '12 blocked jurisdictions (OFAC+UN+EU+FATF)',
                          lines: '~450',
                          color: 'from-[#48A9F0] to-[#023D7A]',
                          features: ['OFAC + UN + EU + FATF lists', 'Real-time checks', 'Investor registration']
                        },
                        {
                          name: 'GuaranteeTokenizer.sol',
                          desc: 'ERC-721 NFT collateral (UGT)',
                          lines: '~450',
                          color: 'from-[#D57028] to-[#F59E0B]',
                          features: ['Collateral NFTs', 'Forced transfer', 'Liquidation support']
                        },
                        {
                          name: 'IndustrialGateway.sol',
                          desc: 'Asset certification authority',
                          lines: '~384',
                          color: 'from-[#023D7A] to-[#8B5B3D]',
                          features: ['Certificate minting', 'GDIZ integration', 'Asset verification', 'UGT minting']
                        },
                        {
                          name: 'MockEscrow.sol',
                          desc: 'Simulated bank escrow',
                          lines: '~750',
                          color: 'from-[#8B5B3D] to-[#023D7A]',
                          features: ['10M demo accounts', 'Wire transfer simulation', 'Factory pattern']
                        },
                        {
                          name: 'MockFiatRamp.sol',
                          desc: 'Simulated fiat on/off ramp',
                          lines: '~520',
                          color: 'from-[#00A8A8] to-[#D57028]',
                          features: ['EUROD simulation', 'FX conversion', 'Ondo Finance integration ready']
                        },
                        {
                          name: 'MockEUROD.sol',
                          desc: 'ERC-20 Euro-pegged stablecoin',
                          lines: '~180',
                          color: 'from-[#10B981] to-[#059669]',
                          features: ['ERC-20 standard', 'Role-based minting', 'Testnet stablecoin']
                        },
                        {
                          name: 'NavGateway.sol',
                          desc: 'NAV price feed oracle',
                          lines: '~200',
                          color: 'from-[#3B82F6] to-[#1D4ED8]',
                          features: ['NAV updates', 'Yield accrual', 'Historical tracking']
                        },
                      ].map((contract) => (
                        <div key={contract.name} className="p-5 bg-gradient-to-br from-white to-[#F3F8FA] rounded-2xl border border-[#48A9F0]/30 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-3">
                                <p className="font-mono text-base font-bold text-[#023D7A]">{contract.name}</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${contract.color}`}>
                                  {contract.lines} lines
                                </span>
                              </div>
                              <p className="text-sm text-[#333333] mt-2">{contract.desc}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {contract.features.map((feature, idx) => (
                              <span key={idx} className="px-3 py-1 bg-[#00A8A8]/10 text-[#00A8A8] rounded-full text-xs font-bold">
                                ✓ {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Code Example */}
                  <div>
                    <h3 className="text-lg font-bold text-[#023D7A] mb-4">ULPTokenizer: Deposit Function</h3>
                    <div className="bg-[#023D7A] rounded-2xl p-6 overflow-x-auto">
                      <pre className="text-gray-100 text-sm font-mono leading-relaxed">
                        <code>{`// ULPTokenizer.sol - Deposit EUROD and mint ulp
function deposit(uint256 ujeurAmount) external nonReentrant returns (uint256) {
    if (ujeurAmount == 0) revert ZeroDeposit();

    // Calculate uLP to mint based on current NAV
    uint256 ulpMinted = ujeurAmount / s_navPerShare;
    if (totalSupply() == 0) ulpMinted = ujeurAmount; // 1:1 at inception

    // Update pool state
    s_totalPoolValue += ujeurAmount;
    _mint(msg.sender, ulpMinted);
    _transferUJEURFrom(msg.sender, address(this), ujeurAmount);

    emit Deposit(msg.sender, ujeurAmount, ulpMinted, s_navPerShare);
    return ulpMinted;
}`}</code>
                      </pre>
                    </div>
                    <p className="text-xs text-[#333333] mt-3">
                      <span className="font-bold">Note:</span> This function demonstrates the value-accrual model where
                      users deposit EUROD and receive uLP tokens at the current NAV per share.
                    </p>
                  </div>

                  {/* Key Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 bg-gradient-to-br from-[#00A8A8]/10 to-[#023D7A]/10 rounded-2xl border border-[#00A8A8]/30">
                      <p className="font-bold text-[#023D7A] mb-2">Value-Accrual Model</p>
                      <p className="text-sm text-[#333333]">Balance constant, NAV increases with yield</p>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-[#023D7A]/10 to-[#48A9F0]/10 rounded-2xl border border-[#023D7A]/30">
                      <p className="font-bold text-[#023D7A] mb-2">ERC-3643 Compliant</p>
                      <p className="text-sm text-[#333333]">Identity verification on all transfers</p>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-[#48A9F0]/10 to-[#00A8A8]/10 rounded-2xl border border-[#48A9F0]/30">
                      <p className="font-bold text-[#023D7A] mb-2">Foundry Tested</p>
                      <p className="text-sm text-[#333333]">256 fuzz runs, invariant testing</p>
                    </div>
                  </div>

                  {/* Pool Families */}
                  <div>
                    <h3 className="text-lg font-bold text-[#023D7A] mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#00A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                      Pool Families
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { 
                          name: 'Pool Industry', 
                          apy: '10-12%', 
                          lockup: '365 days', 
                          risk: 'Medium',
                          icon: '🏭',
                          desc: 'Manufacturing & GDIZ (Benin) partners',
                          color: 'from-[#023D7A] to-[#00A8A8]'
                        },
                        { 
                          name: 'Pool Agriculture', 
                          apy: '12-15%', 
                          lockup: '180 days', 
                          risk: 'Medium',
                          icon: '🌾',
                          desc: 'Coffee, cocoa, cotton, cashews',
                          color: 'from-[#00A8A8] to-[#48A9F0]'
                        },
                        { 
                          name: 'Pool Trade Finance', 
                          apy: '8-10%', 
                          lockup: '90 days', 
                          risk: 'Low',
                          icon: '📦',
                          desc: 'Invoice tokenization',
                          color: 'from-[#48A9F0] to-[#023D7A]'
                        },
                        { 
                          name: 'Pool Renewable Energy', 
                          apy: '9-11%', 
                          lockup: '730 days', 
                          risk: 'Low',
                          icon: '⚡',
                          desc: 'Solar, wind, hydro projects',
                          color: 'from-[#00A8A8] to-[#D57028]'
                        },
                        { 
                          name: 'Pool Real Estate', 
                          apy: '8-12%', 
                          lockup: '1095 days', 
                          risk: 'Medium',
                          icon: '🏢',
                          desc: 'Commercial & residential',
                          color: 'from-[#D57028] to-[#F59E0B]'
                        },
                      ].map((pool) => (
                        <div key={pool.name} className="p-5 bg-white rounded-2xl border border-[#48A9F0]/30 hover:border-[#00A8A8]/60 hover:shadow-xl transition-all duration-300 group">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pool.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                              {pool.icon}
                            </div>
                            <p className="font-bold text-[#023D7A] flex-1">{pool.name}</p>
                          </div>
                          <p className="text-xs text-[#333333] mb-3">{pool.desc}</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-[#333333]">Target APY:</span>
                              <span className="font-bold text-[#00A8A8]">{pool.apy}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#333333]">Lock-up:</span>
                              <span className="font-bold text-[#023D7A]">{pool.lockup}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#333333]">Risk:</span>
                              <span className={`font-bold px-2 py-1 rounded-full text-xs ${
                                pool.risk === 'Low' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-amber-100 text-amber-700'
                              }`}>{pool.risk}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Backend Services Section */}
            <section id="backend" className="scroll-mt-8">
              <Card header={
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#023D7A] to-[#8B5B3D] rounded-xl text-white">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#023D7A]">Backend Services</h2>
                </div>
              }>
                <div className="space-y-8">
                  <p className="text-[#333333] text-lg leading-relaxed">
                    Backend services use the factory pattern for mock/production swap. All mock services
                    implement the same interface as their production counterparts, enabling zero-code-change
                    deployment to mainnet.
                  </p>

                  {/* Service Architecture */}
                  <div>
                    <h3 className="text-lg font-bold text-[#023D7A] mb-4">Service Architecture</h3>
                    <div className="space-y-4">
                      {[
                        { 
                          name: 'MockBankService', 
                          interface: 'IBankService', 
                          desc: 'Simulated bank escrow with €10M demo accounts',
                          status: 'Active'
                        },
                        { 
                          name: 'MockGDIZService', 
                          interface: 'IGDIZService', 
                          desc: 'Industrial gateway simulation for asset certification',
                          status: 'Active'
                        },
                        { 
                          name: 'MockFiatRampService', 
                          interface: 'IFiatRampService', 
                          desc: 'Simulated EUROD stablecoin operations (Ondo Finance-ready)',
                          status: 'Active'
                        },
                        { 
                          name: 'YieldCalculator', 
                          interface: 'N/A', 
                          desc: 'Real yield math (NOT mocked) - uses actual formulas',
                          status: 'Production-Ready'
                        },
                        { 
                          name: 'JurisdictionService', 
                          interface: 'IComplianceService', 
                          desc: '12 blocked jurisdictions (OFAC + UN + EU + FATF)',
                          status: 'Production-Ready'
                        },
                      ].map((service) => (
                        <div key={service.name} className="p-5 bg-white rounded-2xl border border-[#48A9F0]/30 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-bold text-[#023D7A] text-lg">{service.name}</p>
                              <p className="text-sm text-[#333333] mt-1">{service.desc}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-[#333333]/60 bg-[#F3F8FA] px-3 py-1 rounded-lg">{service.interface}</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                service.status === 'Active' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-[#00A8A8]/10 text-[#00A8A8]'
                              }`}>
                                {service.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Yield Formulas */}
                  <div>
                    <h3 className="text-lg font-bold text-[#023D7A] mb-4">Yield Calculation Formulas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { 
                          name: 'Daily Yield', 
                          formula: 'yield_daily = principal × (APY / 365)',
                          example: '€100,000 × (10% / 365) = €27.39/day'
                        },
                        { 
                          name: 'NAV per Share', 
                          formula: 'NAV = total_pool_value / total_shares',
                          example: '€10,000,000 / 10,000,000 uLP = €1.00/ulp'
                        },
                        { 
                          name: 'Management Fee', 
                          formula: 'fee = principal × (fee_rate × days / 365)',
                          example: '€100,000 × (2% × 365 / 365) = €2,000/year'
                        },
                        { 
                          name: 'Performance Fee', 
                          formula: 'fee = (yield_earned - hurdle_yield) × performance_rate',
                          example: '(€10,000 - €5,000) × 20% = €1,000'
                        },
                      ].map((item) => (
                        <div key={item.name} className="p-5 bg-gradient-to-br from-[#F3F8FA] to-white rounded-xl border border-[#48A9F0]/30">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-[#023D7A]">{item.name}</span>
                          </div>
                          <code className="text-sm font-mono text-[#00A8A8] bg-white px-3 py-2 rounded-lg block mb-2">{item.formula}</code>
                          <p className="text-xs text-[#333333]/80">Example: {item.example}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mock vs Production */}
                  <div className="bg-gradient-to-br from-[#023D7A]/5 to-[#00A8A8]/5 rounded-2xl p-6 border border-[#00A8A8]/30">
                    <h3 className="text-lg font-bold text-[#023D7A] mb-4">🏭 Factory Pattern: Mock → Production Swap</h3>
                    <p className="text-[#333333] mb-4">
                      The factory pattern enables seamless transition from testnet to mainnet with zero code changes:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-xl border border-[#48A9F0]/30">
                        <p className="font-bold text-[#023D7A] mb-2">Testnet (Current)</p>
                        <ul className="text-sm text-[#333333] space-y-1">
                          <li>• MockBankService → Simulated escrow</li>
                          <li>• MockGDIZService → Test certificates</li>
                          <li>• MockFiatRamp → Test EUROD</li>
                          <li>• Polygon Amoy (Chain ID: 80002)</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-[#48A9F0]/30">
                        <p className="font-bold text-[#023D7A] mb-2">Production (Ready)</p>
                        <ul className="text-sm text-[#333333] space-y-1">
                          <li>• BankService → BIIC (Banque Internationale pour l'Industrie et le Commerce)/MCB integration</li>
                          <li>• GDIZService → Real certification</li>
                          <li>• FiatRamp → Ondo Finance EUROD</li>
                          <li>• Polygon Mainnet (Chain ID: 137)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* API Reference Section */}
            <section id="api" className="scroll-mt-8">
              <Card header={
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#D57028] to-[#F59E0B] rounded-xl text-white">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#023D7A]">API Reference</h2>
                </div>
              }>
                <div className="space-y-8">
                  <p className="text-[#333333] text-lg leading-relaxed">
                    RESTful API with 15+ endpoints for pool management and compliance.
                    Rate limited: 100 req/min (public), 1000 req/hr (authenticated).
                    Built with FastAPI, documented with Swagger/OpenAPI.
                  </p>

                  {/* Base URL */}
                  <div className="bg-gradient-to-br from-[#023D7A] to-[#00A8A8] rounded-2xl p-6 text-white">
                    <p className="text-sm text-white/80 mb-2">Base URL</p>
                    <code className="text-lg font-mono bg-white/10 px-4 py-3 rounded-xl block">
                      {import.meta.env.DEV ? 'http://localhost:8000/api/v2' : 'https://ujamaa-de-fi-platform-backend.vercel.app/api/v2'}
                    </code>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs">
                      <span className="px-3 py-1 bg-white/20 rounded-full">Swagger: /docs</span>
                      <span className="px-3 py-1 bg-white/20 rounded-full">ReDoc: /redoc</span>
                      <span className="px-3 py-1 bg-white/20 rounded-full">OpenAPI: /openapi.json</span>
                    </div>
                  </div>

                  {/* Pool Endpoints */}
                  <div>
                    <h3 className="text-lg font-bold text-[#023D7A] mb-4">Pool Endpoints</h3>
                    <div className="space-y-3">
                      {[
                        { method: 'GET', path: '/api/v2/pools', desc: 'List all pools', params: '' },
                        { method: 'GET', path: '/api/v2/pools/{poolId}', desc: 'Get pool details', params: 'poolId: string' },
                        { method: 'POST', path: '/api/v2/pools/{poolId}/invest', desc: 'Invest in pool', params: 'amount, investorId' },
                        { method: 'POST', path: '/api/v2/pools/{poolId}/redeem', desc: 'Redeem from pool', params: 'shares, investorId' },
                        { method: 'GET', path: '/api/v2/pools/portfolio/{investorId}', desc: 'Investor portfolio', params: 'investorId: string' },
                        { method: 'GET', path: '/api/v2/pools/stats', desc: 'Pool statistics', params: 'poolId: string' },
                      ].map((endpoint) => (
                        <div key={endpoint.path} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#48A9F0]/30 hover:shadow-lg transition-all duration-300">
                          <span className={`text-xs font-mono font-bold px-3 py-2 rounded-lg ${
                            endpoint.method === 'GET' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {endpoint.method}
                          </span>
                          <code className="text-sm font-mono text-[#023D7A] flex-1">{endpoint.path}</code>
                          <span className="text-sm text-[#333333]">{endpoint.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compliance Endpoints */}
                  <div>
                    <h3 className="text-lg font-bold text-[#023D7A] mb-4">Compliance Endpoints</h3>
                    <div className="space-y-3">
                      {[
                        { method: 'POST', path: '/api/v2/compliance/check-jurisdiction', desc: 'Check jurisdiction', params: 'jurisdiction: string' },
                        { method: 'GET', path: '/api/v2/compliance/blocked-jurisdictions', desc: 'Get blocked list', params: '' },
                        { method: 'POST', path: '/api/v2/compliance/investors/register', desc: 'Register investor', params: 'investorData' },
                        { method: 'GET', path: '/api/v2/compliance/investors/{investorId}', desc: 'Get investor status', params: 'investorId: string' },
                      ].map((endpoint) => (
                        <div key={endpoint.path} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#48A9F0]/30 hover:shadow-lg transition-all duration-300">
                          <span className={`text-xs font-mono font-bold px-3 py-2 rounded-lg ${
                            endpoint.method === 'GET' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {endpoint.method}
                          </span>
                          <code className="text-sm font-mono text-[#023D7A] flex-1">{endpoint.path}</code>
                          <span className="text-sm text-[#333333]">{endpoint.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Response Example */}
                  <div>
                    <h3 className="text-lg font-bold text-[#023D7A] mb-4">Response Example</h3>
                    <div className="bg-[#023D7A] rounded-2xl p-6 overflow-x-auto">
                      <pre className="text-gray-100 text-sm font-mono leading-relaxed">
                        <code>{`{
  "success": true,
  "data": {
    "poolId": "POOL_INDUSTRIE",
    "name": "Pool Industrie",
    "totalValue": 10000000,
    "navPerShare": 1.05,
    "apy": 11.5,
    "lockupDays": 365,
    "riskLevel": "medium"
  },
  "timestamp": "2026-03-20T10:30:00Z",
  "is_testnet": true
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Security Model Section */}
            <section id="security" className="scroll-mt-8">
              <Card header={
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#023D7A] to-[#48A9F0] rounded-xl text-white">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#023D7A]">Security Model</h2>
                </div>
              }>
                <div className="space-y-8">
                  <p className="text-[#333333] text-lg leading-relaxed">
                    Defense in depth with 4 security layers: Smart Contract, Backend, API, and Compliance.
                    All contracts use OpenZeppelin libraries and follow industry best practices.
                  </p>

                  {/* Security Layers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { 
                        layer: 'Layer 1', 
                        name: 'Smart Contract', 
                        desc: 'ReentrancyGuard, AccessControl, ERC-3643, SafeERC20',
                        color: 'from-[#023D7A] to-[#00A8A8]'
                      },
                      { 
                        layer: 'Layer 2', 
                        name: 'Backend', 
                        desc: 'Input validation, Rate limiting, Authentication, CORS',
                        color: 'from-[#00A8A8] to-[#48A9F0]'
                      },
                      { 
                        layer: 'Layer 3', 
                        name: 'API', 
                        desc: 'CORS policies, CSP headers, Request validation, HTTPS',
                        color: 'from-[#48A9F0] to-[#023D7A]'
                      },
                      { 
                        layer: 'Layer 4', 
                        name: 'Compliance', 
                        desc: 'KYC/AML, Jurisdiction checks, KYB, Sanctions screening',
                        color: 'from-[#D57028] to-[#F59E0B]'
                      },
                    ].map((item) => (
                      <div key={item.layer} className="p-5 bg-gradient-to-br from-white to-[#F3F8FA] rounded-2xl border border-[#48A9F0]/30 hover:shadow-lg transition-all duration-300">
                        <p className="text-xs font-bold text-[#333333]/60 mb-2">{item.layer}</p>
                        <p className="font-bold text-[#023D7A] text-lg mb-2">{item.name}</p>
                        <p className="text-sm text-[#333333]">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Blocked Jurisdictions */}
                  <div>
                    <h3 className="text-lg font-bold text-[#023D7A] mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                      </svg>
                      Blocked Jurisdictions
                    </h3>
                    <p className="text-[#333333] mb-4">
                      Ujamaa blocks investors from 12 jurisdictions based on combined OFAC, UN, EU, and FATF sanctions lists:
                    </p>
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
                      <div className="flex flex-wrap gap-3">
                        {[
                          { code: 'KP', name: 'North Korea', reason: 'UN Sanctions' },
                          { code: 'IR', name: 'Iran', reason: 'OFAC Sanctions' },
                          { code: 'SY', name: 'Syria', reason: 'EU Sanctions' },
                          { code: 'CU', name: 'Cuba', reason: 'OFAC Sanctions' },
                          { code: 'MM', name: 'Myanmar', reason: 'UN Sanctions' },
                          { code: 'BY', name: 'Belarus', reason: 'EU Sanctions' },
                          { code: 'RU', name: 'Russia', reason: 'OFAC/EU Sanctions' },
                          { code: 'VE', name: 'Venezuela', reason: 'OFAC Sanctions' },
                          { code: 'SD', name: 'Sudan', reason: 'UN Sanctions' },
                          { code: 'YE', name: 'Yemen', reason: 'UN Sanctions' },
                          { code: 'ML', name: 'Mali', reason: 'FATF High-Risk' },
                          { code: 'BF', name: 'Burkina Faso', reason: 'FATF High-Risk' },
                        ].map((country) => (
                          <div key={country.code} className="group relative">
                            <div className="px-4 py-2.5 bg-white text-red-700 rounded-xl text-sm font-bold border-2 border-red-200 hover:border-red-400 hover:shadow-lg transition-all cursor-help flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                              </svg>
                              {country.code}
                            </div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-3 bg-[#023D7A] text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
                              <p className="font-bold">{country.name}</p>
                              <p className="text-white/80 mt-1">{country.reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex items-start gap-3 p-4 bg-white rounded-xl border border-red-200">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p className="text-xs text-[#333333]">
                          <span className="font-bold">Note:</span> Strictest combined list: OFAC + UN + EU + FATF High-Risk
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Smart Contract Security */}
                  <div className="bg-gradient-to-br from-[#023D7A]/5 to-[#00A8A8]/5 rounded-2xl p-6 border border-[#00A8A8]/30">
                    <h3 className="text-lg font-bold text-[#023D7A] mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#00A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                      </svg>
                      Smart Contract Security Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-xl border border-[#48A9F0]/30 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-[#023D7A] to-[#00A8A8] rounded-lg text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a2 2 0 01-2-2v-2.343a1 1 0 01-.293-.707l-1-1a1 1 0 010-1.414l1-1a1 1 0 011.414 0l1 1a1 1 0 001.414 0L9 4.414V2h2v2.343a1 1 0 00.293.707l1 1a1 1 0 010 1.414l-1 1a1 1 0 01-1.414 0L9 7.414A6 6 0 0115 7z"/>
                            </svg>
                          </div>
                          <p className="font-bold text-[#023D7A]">Access Control</p>
                        </div>
                        <ul className="text-sm text-[#333333] space-y-1 ml-10">
                          <li className="flex items-center gap-2">
                            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                            Role-based permissions
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                            Pool Manager
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                            Compliance Officer
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                            Minter / Redeemer
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-[#48A9F0]/30 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-[#00A8A8] to-[#48A9F0] rounded-lg text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                            </svg>
                          </div>
                          <p className="font-bold text-[#023D7A]">Reentrancy Protection</p>
                        </div>
                        <ul className="text-sm text-[#333333] space-y-1 ml-10">
                          <li className="flex items-center gap-2">
                            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                            ReentrancyGuard on state-changing functions
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                            Checks-Effects-Interactions pattern
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                            Mutex locks on critical sections
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-[#48A9F0]/30 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-[#48A9F0] to-[#023D7A] rounded-lg text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                            </svg>
                          </div>
                          <p className="font-bold text-[#023D7A]">Safe Token Handling</p>
                        </div>
                        <ul className="text-sm text-[#333333] space-y-1 ml-10">
                          <li className="flex items-center gap-2">
                            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                            SafeERC20 for all token transfers
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                            Balance checks before transfers
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                            Approval validation
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-[#48A9F0]/30 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-[#D57028] to-[#F59E0B] rounded-lg text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                            </svg>
                          </div>
                          <p className="font-bold text-[#023D7A]">Testing Coverage</p>
                        </div>
                        <ul className="text-sm text-[#333333] space-y-1 ml-10">
                          <li className="flex items-center gap-2">
                            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                            Foundry fuzz testing (256 runs)
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                            Invariant testing (15 depth)
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                            Gas optimization reports
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Performance Section */}
            <section id="performance" className="scroll-mt-8">
              <Card header={
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#00A8A8] to-[#023D7A] rounded-xl text-white">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#023D7A]">Performance</h2>
                </div>
              }>
                <div className="space-y-8">
                  <p className="text-[#333333] text-lg leading-relaxed">
                    Performance targets and optimization strategies for MVP.
                    The platform is optimized for fast load times, efficient gas usage, and scalable backend operations.
                  </p>

                  {/* Performance Targets */}
                  <div>
                    <h3 className="text-lg font-bold text-[#023D7A] mb-4">Performance Targets</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-[#48A9F0]/30">
                            <th className="text-left py-4 px-4 font-bold text-[#023D7A]">Metric</th>
                            <th className="text-left py-4 px-4 font-bold text-[#023D7A]">Target</th>
                            <th className="text-left py-4 px-4 font-bold text-[#023D7A]">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-[#333333]">
                          <tr className="border-b border-[#48A9F0]/20">
                            <td className="py-4 px-4">First Contentful Paint (FCP)</td>
                            <td className="py-4 px-4">&lt; 1.5s</td>
                            <td className="py-4 px-4">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">✓ Achieved</span>
                            </td>
                          </tr>
                          <tr className="border-b border-[#48A9F0]/20">
                            <td className="py-4 px-4">Time to Interactive (TTI)</td>
                            <td className="py-4 px-4">&lt; 3.5s</td>
                            <td className="py-4 px-4">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">✓ Achieved</span>
                            </td>
                          </tr>
                          <tr className="border-b border-[#48A9F0]/20">
                            <td className="py-4 px-4">Lighthouse Score</td>
                            <td className="py-4 px-4">&gt; 90</td>
                            <td className="py-4 px-4">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">✓ Achieved</span>
                            </td>
                          </tr>
                          <tr className="border-b border-[#48A9F0]/20">
                            <td className="py-4 px-4">Bundle Size (Initial JS)</td>
                            <td className="py-4 px-4">&lt; 150KB</td>
                            <td className="py-4 px-4">
                              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">⚠ In Progress</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-4 px-4">Gas Optimization</td>
                            <td className="py-4 px-4">&lt; 200k gas/deposit</td>
                            <td className="py-4 px-4">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">✓ Optimized</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Optimization Strategies */}
                  <div>
                    <h3 className="text-lg font-bold text-[#023D7A] mb-4">Optimization Strategies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { category: 'Frontend', items: ['Code splitting by route', 'Tree shaking for unused code', 'Image optimization (WebP/AVIF)', 'Service worker caching'] },
                        { category: 'Backend', items: ['API response caching with Redis', 'Database query optimization', 'Connection pooling', 'Async I/O operations'] },
                        { category: 'Smart Contracts', items: ['Gas-efficient data structures', 'Minimal storage writes', 'Batch operations', 'Assembly optimizations'] },
                        { category: 'Network', items: ['CDN for static assets', 'Compression (gzip/brotli)', 'HTTP/2 multiplexing', 'Edge caching'] },
                      ].map((group) => (
                        <div key={group.category} className="p-5 bg-white rounded-2xl border border-[#48A9F0]/30">
                          <p className="font-bold text-[#023D7A] mb-3">{group.category}</p>
                          <ul className="space-y-2">
                            {group.items.map((item, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-[#333333]">
                                <svg className="w-4 h-4 text-[#00A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gas Optimization */}
                  <div className="bg-gradient-to-br from-[#00A8A8]/5 to-[#023D7A]/5 rounded-2xl p-6 border border-[#00A8A8]/30">
                    <h3 className="text-lg font-bold text-[#023D7A] mb-4">⛽ Gas Optimization</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-white rounded-xl border border-[#48A9F0]/30">
                        <p className="text-sm text-[#333333] mb-1">Deposit Function</p>
                        <p className="text-2xl font-bold text-[#023D7A]">~85,000</p>
                        <p className="text-xs text-[#333333]/60 mt-1">gas units</p>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-[#48A9F0]/30">
                        <p className="text-sm text-[#333333] mb-1">Redeem Function</p>
                        <p className="text-2xl font-bold text-[#023D7A]">~95,000</p>
                        <p className="text-xs text-[#333333]/60 mt-1">gas units</p>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-[#48A9F0]/30">
                        <p className="text-sm text-[#333333] mb-1">Avg. Transaction</p>
                        <p className="text-2xl font-bold text-[#023D7A]">~€0.05</p>
                        <p className="text-xs text-[#333333]/60 mt-1">on Polygon Amoy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t-2 border-[#48A9F0]/30 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#023D7A]">
                🚀 MVP: Institutional Architecture - Testnet Release
              </p>
              <p className="text-xs text-[#333333]/60 mt-1">
                Polygon Amoy (Chain ID: 80002) • Solidity 0.8.20 • Last Updated: March 2026
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a href="/docs/glossary" className="text-sm text-[#00A8A8] hover:text-[#023D7A] font-bold transition-colors">
                📖 Glossary
              </a>
              <a href="/investors-room" className="text-sm text-[#00A8A8] hover:text-[#023D7A] font-bold transition-colors">
                📚 Investors Room
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DeepDive;
