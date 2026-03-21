/**
 * Tokenization Guide - Educational Document
 */

import React from 'react';
import DocPage from './DocPage';

const TokenizationGuide: React.FC = () => {
  const tableOfContents = [
    { id: 'overview', title: 'What is Tokenization?' },
    { id: 'process', title: 'Tokenization Process' },
    { id: 'benefits', title: 'Benefits' },
    { id: 'examples', title: 'Real-World Examples' },
  ];

  return (
    <DocPage
      title="Tokenization Guide"
      category="Educational"
      categoryId="educational"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        <section id="overview" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">What is Tokenization?</h2>
          <div className="bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10 border-l-4 border-[#00A8A8] p-6 rounded-r-lg">
            <p className="text-[#333333] leading-relaxed text-lg">
              Tokenization is the process of converting real-world assets into digital tokens 
              on a blockchain, enabling fractional ownership and increased liquidity.
            </p>
          </div>
        </section>

        <section id="process" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Tokenization Process</h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Asset Selection', desc: 'Identify and verify the real-world asset (invoice, inventory, equipment)' },
              { step: '2', title: 'Valuation', desc: 'Professional appraisal to determine asset value' },
              { step: '3', title: 'Legal Structure', desc: 'Establish legal framework for token representation' },
              { step: '4', title: 'Token Creation', desc: 'Mint digital tokens on blockchain (ERC-3643 standard)' },
              { step: '5', title: 'Distribution', desc: 'Tokens distributed to investors via liquidity pools' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#023D7A] text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {item.step}
                </div>
                <div className="flex-1 bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#023D7A] mb-2">{item.title}</h3>
                  <p className="text-[#333333]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="benefits" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Benefits of Tokenization</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '💧', title: 'Increased Liquidity', desc: 'Fractional ownership enables easier trading' },
              { icon: '🔒', title: 'Enhanced Security', desc: 'Blockchain immutability and transparency' },
              { icon: '⚡', title: 'Faster Settlement', desc: 'Near-instant transactions 24/7' },
              { icon: '🌍', title: 'Global Access', desc: 'Borderless investment opportunities' },
              { icon: '💰', title: 'Lower Costs', desc: 'Reduced intermediaries and fees' },
              { icon: '📊', title: 'Transparency', desc: 'Real-time ownership and valuation tracking' },
            ].map((item) => (
              <div key={item.title} className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6 text-center">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-lg font-bold text-[#023D7A] mb-3">{item.title}</h3>
                <p className="text-sm text-[#333333]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="examples" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Real-World Examples</h2>
          <div className="grid grid-cols-1 gap-6">
            {[
              { asset: 'Trade Finance', example: 'Tokenized invoices worth €2M financed through Pool Trade Finance', icon: '💼' },
              { asset: 'Agricultural Inventory', example: '1,000 cotton bales tokenized as collateral for €500K financing', icon: '🌾' },
              { asset: 'Manufacturing Equipment', example: 'Production machinery tokenized for €1.5M industrial loan', icon: '🏭' },
              { asset: 'Real Estate', example: 'Commercial property fractional ownership via tokenization', icon: '🏢' },
            ].map((item) => (
              <div key={item.asset} className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6 flex items-start gap-4">
                <span className="text-4xl">{item.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-[#023D7A] mb-2">{item.asset}</h3>
                  <p className="text-[#333333]">{item.example}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default TokenizationGuide;
