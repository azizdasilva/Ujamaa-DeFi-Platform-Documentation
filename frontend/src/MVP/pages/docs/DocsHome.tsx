/**
 * Documentation Home Page
 * Central hub for all Ujamaa DeFi documentation
 */

import React from 'react';
import Navigation from '../../components/Navigation';

const DocsHome: React.FC = () => {
  const docCategories = [
    {
      id: 'specifications',
      title: 'Specifications',
      description: 'Complete software requirements and technical specifications',
      icon: '📋',
      color: 'from-[#023D7A] to-[#00A8A8]',
      link: '/docs/specifications',
      items: 7,
    },
    {
      id: 'technical',
      title: 'Technical Guides',
      description: 'Implementation guides and technical documentation',
      icon: '🔧',
      color: 'from-[#00A8A8] to-[#48A9F0]',
      link: '/docs/technical',
      items: 10,
    },
    {
      id: 'operations',
      title: 'Operations',
      description: 'Operational procedures and monitoring guides',
      icon: '⚙️',
      color: 'from-[#48A9F0] to-[#023D7A]',
      link: '/docs/operations',
      items: 3,
    },
    {
      id: 'mvp',
      title: 'MVP Execution',
      description: 'MVP implementation and execution documentation',
      icon: '🚀',
      color: 'from-[#D57028] to-[#00A8A8]',
      link: '/docs/mvp',
      items: 15,
    },
    {
      id: 'investors',
      title: 'Investors Room',
      description: 'Investor resources, reports, and legal documents',
      icon: '💼',
      color: 'from-[#023D7A] to-[#D57028]',
      link: '/docs/investors',
      items: 22,
    },
    {
      id: 'algorithms',
      title: 'Algorithms',
      description: 'Algorithm specifications and implementation details',
      icon: '🧮',
      color: 'from-[#D57028] to-[#48A9F0]',
      link: '/docs/algorithms',
      items: 5,
    },
  ];

  const quickLinks = [
    { title: 'White Paper', href: '/docs/white-paper', icon: '📄' },
    { title: 'Investment Memorandum', href: '/docs/investment-memorandum', icon: '📊' },
    { title: 'Terms of Service', href: '/docs/terms-of-service', icon: '📜' },
    { title: 'Privacy Policy', href: '/docs/privacy-policy', icon: '🔒' },
    { title: 'Risk Disclosure', href: '/docs/risk-disclosure', icon: '⚠️' },
    { title: 'Executive Summary', href: '/docs/executive-summary', icon: '📝' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F8FA]">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] text-white py-24">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-5xl font-extrabold mb-6">
            Documentation Center
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Complete technical documentation, investor resources, and operational guides for the Ujamaa DeFi Platform
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/docs/white-paper"
              className="px-8 py-4 bg-white text-[#023D7A] font-bold rounded-lg hover:bg-[#F3F8FA] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              📄 Read White Paper
            </a>
            <a
              href="/docs/investors"
              className="px-8 py-4 bg-[#023D7A]/30 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-[#023D7A]/50 transition-all duration-300"
            >
              💼 Investor Resources
            </a>
          </div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-extrabold text-[#023D7A] mb-12 text-center">
            Documentation Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {docCategories.map((category) => (
              <a
                key={category.id}
                href={category.link}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#48A9F0]/20 hover:border-[#00A8A8]/40"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#023D7A] mb-3 group-hover:text-[#00A8A8] transition-colors">
                  {category.title}
                </h3>
                <p className="text-[#333333] mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">
                    {category.items} documents
                  </span>
                  <span className="text-[#00A8A8] font-bold group-hover:translate-x-2 transition-transform">
                    View All →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-extrabold text-[#023D7A] mb-12 text-center">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="flex items-center gap-4 p-6 bg-[#F3F8FA] rounded-xl hover:bg-[#023D7A] hover:text-white transition-all duration-300 group"
              >
                <span className="text-3xl">{link.icon}</span>
                <div>
                  <h3 className="font-bold text-[#023D7A] group-hover:text-white transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-white/80 transition-colors">
                    View Document →
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-gradient-to-r from-[#023D7A] to-[#00A8A8] text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-extrabold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Explore our platform and start investing in African real-world assets
          </p>
          <a
            href="/demo-accounts"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#023D7A] font-bold rounded-lg hover:bg-[#F3F8FA] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Select Your Role
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
};

export default DocsHome;
