/**
 * Subscription Form Template
 * Investors Room - Templates
 */

import React from 'react';
import DocPage from './DocPage';

const SubscriptionForm: React.FC = () => {
  const tableOfContents = [
    { id: 'investor', title: 'Investor Information' },
    { id: 'investment', title: 'Investment Details' },
    { id: 'payment', title: 'Payment Instructions' },
    { id: 'signature', title: 'Signature' },
  ];

  return (
    <DocPage
      title="Subscription Form"
      category="Templates"
      categoryId="templates"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        <section id="investor" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Investor Information</h2>
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Full Name / Entity Name', placeholder: '[As shown on ID]' },
                { label: 'Date of Birth / Incorporation', placeholder: '[DD/MM/YYYY]' },
                { label: 'Nationality / Jurisdiction', placeholder: '[Country]' },
                { label: 'Residential / Registered Address', placeholder: '[Full Address]' },
                { label: 'Email Address', placeholder: '[Email]' },
                { label: 'Phone Number', placeholder: '[Phone]' },
                { label: 'Tax ID / VAT Number', placeholder: '[Number]' },
                { label: 'Occupation / Business Type', placeholder: '[Description]' },
              ].map((field) => (
                <div key={field.label} className="border-b border-gray-200 pb-4">
                  <p className="text-sm text-gray-600 mb-2">{field.label}</p>
                  <div className="bg-[#F3F8FA] px-4 py-3 rounded-lg">
                    <p className="text-gray-400 italic">{field.placeholder}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="investment" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Investment Details</h2>
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-8">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Selected Pool</p>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {['Industrial', 'Agriculture', 'Trade Finance', 'Renewable', 'Real Estate'].map((pool) => (
                    <div key={pool} className="border-2 border-[#48A9F0]/30 rounded-lg p-3 text-center cursor-pointer hover:border-[#00A8A8] hover:bg-[#00A8A8]/5">
                      <p className="font-bold text-[#023D7A]">{pool}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-600 mb-2">Investment Amount (EUROD)</p>
                <div className="bg-[#F3F8FA] px-4 py-3 rounded-lg">
                  <p className="text-2xl font-bold text-[#023D7A]">€[Amount]</p>
                  <p className="text-xs text-gray-500 mt-1">Minimum: €100,000 (Institutional)</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-600 mb-2">Investor Type</p>
                <div className="space-y-3">
                  {[
                    'Individual Accredited Investor',
                    'Corporate/Institutional Investor',
                    'Family Office',
                    'Trust',
                  ].map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="investorType" className="w-4 h-4 text-[#00A8A8]" />
                      <span className="text-[#333333]">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="payment" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Payment Instructions</h2>
          <div className="bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10 border-l-4 border-[#00A8A8] p-6 rounded-r-lg">
            <h3 className="text-xl font-bold text-[#023D7A] mb-4">Wire Transfer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Beneficiary Bank</p>
                <p className="font-bold text-[#023D7A]">[Bank Name]</p>
                <p className="text-[#333333]">[Bank Address]</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">SWIFT/BIC</p>
                <p className="font-bold text-[#023D7A]">[SWIFT Code]</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Account Number</p>
                <p className="font-bold text-[#023D7A]">[Account Number]</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">IBAN</p>
                <p className="font-bold text-[#023D7A]">[IBAN]</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">Beneficiary</p>
                <p className="font-bold text-[#023D7A]">Ujamaa DeFi Platform - Client Account</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">Reference</p>
                <p className="font-bold text-[#023D7A]">[Investor Name] - [Pool Name]</p>
              </div>
            </div>
          </div>
        </section>

        <section id="signature" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Declaration & Signature</h2>
          <div className="bg-[#F3F8FA] border-l-4 border-[#023D7A] p-8 rounded-r-lg">
            <p className="text-[#333333] mb-6">
              I hereby declare that all information provided in this subscription form is true, 
              complete, and accurate. I have read and understood the Investment Memorandum, 
              Risk Disclosure, and Terms of Service. I acknowledge that this investment involves 
              substantial risk and I may lose some or all of my invested capital.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="border-b-2 border-[#023D7A] pb-4">
                <p className="text-sm text-gray-500 mb-8">Investor Signature</p>
                <p className="text-xs text-gray-400">By submitting this form, you electronically sign this document</p>
              </div>
              <div className="border-b-2 border-[#023D7A] pb-4">
                <p className="text-sm text-gray-500 mb-8">Date</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-8">
              This electronic subscription has the same legal validity as a handwritten signature. 
              By submitting this form, you agree to be bound by all terms and conditions.
            </p>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default SubscriptionForm;
