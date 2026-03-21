/**
 * Sanctions Declaration
 * Investors Room - Legal & Compliance
 */

import React from 'react';
import DocPage from './DocPage';

const SanctionsDeclaration: React.FC = () => {
  const tableOfContents = [
    { id: 'overview', title: 'Sanctions Overview' },
    { id: 'blocked', title: 'Blocked Jurisdictions' },
    { id: 'declaration', title: 'Investor Declaration' },
  ];

  return (
    <DocPage
      title="Sanctions Declaration"
      category="Legal & Compliance"
      categoryId="legal"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        <section id="overview" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Sanctions Overview</h2>
          <div className="bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10 border-l-4 border-[#00A8A8] p-6 rounded-r-lg">
            <p className="text-[#333333] leading-relaxed text-lg">
              Ujamaa DeFi Platform complies with all applicable international sanctions including 
              OFAC (US), UN Security Council, EU, and UK sanctions regimes. We do not conduct business 
              with sanctioned individuals, entities, or jurisdictions.
            </p>
          </div>
        </section>

        <section id="blocked" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Blocked Jurisdictions</h2>
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-red-700 mb-4">⛔ Prohibited Countries and Territories</h3>
            <p className="text-[#333333] mb-6">
              Investors from the following jurisdictions are strictly prohibited from using the platform:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'North Korea', reason: 'OFAC Sanctions' },
                { name: 'Iran', reason: 'OFAC Sanctions' },
                { name: 'Syria', reason: 'OFAC Sanctions' },
                { name: 'Cuba', reason: 'OFAC Sanctions' },
                { name: 'Crimea', reason: 'Territorial Sanctions' },
                { name: 'Donetsk', reason: 'Territorial Sanctions' },
                { name: 'Luhansk', reason: 'Territorial Sanctions' },
                { name: 'Sevastopol', reason: 'Territorial Sanctions' },
              ].map((country) => (
                <div key={country.name} className="bg-white border border-red-200 rounded-lg p-3">
                  <p className="font-bold text-red-700">{country.name}</p>
                  <p className="text-xs text-gray-500">{country.reason}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
            <h3 className="text-lg font-bold text-amber-700 mb-3">⚠️ Additional Restrictions</h3>
            <p className="text-[#333333] mb-4">
              The following may also be restricted based on ongoing sanctions reviews:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">•</span>
                <span className="text-[#333333]">Individuals on OFAC SDN (Specially Designated Nationals) List</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">•</span>
                <span className="text-[#333333]">Entities owned 50% or more by sanctioned parties</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">•</span>
                <span className="text-[#333333]">Politically Exposed Persons (PEPs) without enhanced due diligence</span>
              </li>
            </ul>
          </div>
        </section>

        <section id="declaration" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Investor Declaration</h2>
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-8">
            <p className="text-[#333333] mb-6">
              By using Ujamaa DeFi Platform, I hereby declare and represent that:
            </p>
            <ol className="space-y-4">
              {[
                'I am not a resident, citizen, or entity organized under the laws of any blocked jurisdiction',
                'I am not acting on behalf of any person or entity from a blocked jurisdiction',
                'I am not listed on any sanctions list including OFAC SDN, UN Consolidated List, or EU Sanctions List',
                'I am not owned or controlled by any sanctioned party',
                'I will not transfer my tokens to any sanctioned party or blocked jurisdiction',
                'I will immediately notify the platform if my sanctions status changes',
                'I understand that violation may result in immediate account termination and regulatory reporting',
              ].map((decl, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#023D7A] text-white rounded flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-[#333333]">{decl}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-bold text-center">
                FALSE DECLARATIONS MAY RESULT IN CRIMINAL PROSECUTION AND CIVIL PENALTIES
              </p>
            </div>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default SanctionsDeclaration;
