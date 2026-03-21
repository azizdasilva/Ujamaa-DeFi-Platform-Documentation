/**
 * Jurisdiction Eligibility Guide
 * Investors Room - Onboarding
 */

import React from 'react';
import DocPage from './DocPage';

const JurisdictionEligibilityGuide: React.FC = () => {
  const tableOfContents = [
    { id: 'allowed', title: 'Allowed Jurisdictions' },
    { id: 'blocked', title: 'Blocked Jurisdictions' },
    { id: 'restricted', title: 'Restricted Jurisdictions' },
    { id: 'verification', title: 'Residency Verification' },
  ];

  return (
    <DocPage
      title="Jurisdiction Eligibility Guide"
      category="Onboarding"
      categoryId="onboarding"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        <section id="allowed" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Allowed Jurisdictions</h2>
          <div className="bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10 border-l-4 border-[#00A8A8] p-6 rounded-r-lg mb-6">
            <p className="text-[#333333] leading-relaxed">
              Ujamaa DeFi Platform welcomes investors from the following jurisdictions, 
              subject to meeting all other eligibility requirements.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#023D7A] mb-4">🇪🇺 Europe</h3>
              <ul className="space-y-2 text-sm">
                {['United Kingdom', 'Germany', 'France', 'Netherlands', 'Switzerland', 'Luxembourg', 'Malta', 'Mauritius'].map((country) => (
                  <li key={country} className="flex items-center gap-2">
                    <span className="text-[#00A8A8] font-bold">✓</span>
                    <span className="text-[#333333]">{country}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#023D7A] mb-4">🌍 Africa</h3>
              <ul className="space-y-2 text-sm">
                {['South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Egypt', 'Morocco', 'Tanzania', 'Uganda'].map((country) => (
                  <li key={country} className="flex items-center gap-2">
                    <span className="text-[#00A8A8] font-bold">✓</span>
                    <span className="text-[#333333]">{country}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#023D7A] mb-4">🌏 Asia & Others</h3>
              <ul className="space-y-2 text-sm">
                {['Singapore', 'Hong Kong', 'UAE', 'Qatar', 'Australia', 'Japan', 'Canada'].map((country) => (
                  <li key={country} className="flex items-center gap-2">
                    <span className="text-[#00A8A8] font-bold">✓</span>
                    <span className="text-[#333333]">{country}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="blocked" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Blocked Jurisdictions</h2>
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-700 mb-4">⛔ Strictly Prohibited</h3>
            <p className="text-[#333333] mb-4">
              Investors from the following jurisdictions are strictly prohibited from using the platform 
              due to international sanctions and regulatory restrictions:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['North Korea', 'Iran', 'Syria', 'Cuba', 'Crimea', 'Donetsk', 'Luhansk', 'Sevastopol'].map((country) => (
                <div key={country} className="bg-red-100 border border-red-300 rounded-lg p-3 text-center">
                  <p className="font-bold text-red-700">{country}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="restricted" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Restricted Jurisdictions</h2>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
            <h3 className="text-lg font-bold text-amber-700 mb-3">⚠️ Enhanced Due Diligence Required</h3>
            <p className="text-[#333333] mb-4">
              Investors from the following jurisdictions may be subject to enhanced due diligence 
              and additional documentation requirements:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['United States', 'China', 'Russia', 'Belarus', 'Myanmar', 'Venezuela'].map((country) => (
                <div key={country} className="bg-white border border-amber-300 rounded-lg p-3">
                  <p className="font-bold text-amber-700">{country}</p>
                  <p className="text-xs text-gray-500">Enhanced DD Required</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="verification" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Residency Verification</h2>
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-[#023D7A] mb-4">Accepted Proof of Residency</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-[#023D7A] mb-3">Primary Documents</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-[#00A8A8] font-bold">📄</span>
                    <span className="text-[#333333]">Utility bill (electricity, water, gas) &lt;3 months</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00A8A8] font-bold">📄</span>
                    <span className="text-[#333333]">Bank statement &lt;3 months</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00A8A8] font-bold">📄</span>
                    <span className="text-[#333333]">Tax assessment notice</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#023D7A] mb-3">Secondary Documents</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-[#00A8A8] font-bold">📄</span>
                    <span className="text-[#333333]">Government correspondence</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00A8A8] font-bold">📄</span>
                    <span className="text-[#333333]">Insurance policy documents</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00A8A8] font-bold">📄</span>
                    <span className="text-[#333333]">Employment contract</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default JurisdictionEligibilityGuide;
