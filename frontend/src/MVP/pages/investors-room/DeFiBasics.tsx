/**
 * DeFi Basics - Educational Document
 */

import React from 'react';
import DocPage from './DocPage';

const DeFiBasics: React.FC = () => {
  const tableOfContents = [
    { id: 'what', title: 'What is DeFi?' },
    { id: 'benefits', title: 'Benefits of DeFi' },
    { id: 'risks', title: 'Understanding Risks' },
    { id: 'getting', title: 'Getting Started' },
  ];

  return (
    <DocPage
      title="DeFi Basics"
      category="Educational"
      categoryId="educational"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        <section id="what" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">What is DeFi?</h2>
          <div className="bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10 border-l-4 border-[#00A8A8] p-6 rounded-r-lg">
            <p className="text-[#333333] leading-relaxed text-lg">
              Decentralized Finance (DeFi) refers to financial services built on blockchain technology 
              that operate without traditional intermediaries like banks or brokers.
            </p>
          </div>
        </section>

        <section id="benefits" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Benefits of DeFi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '🔓', title: 'Accessibility', desc: 'Open to anyone with internet access, 24/7 availability' },
              { icon: '💰', title: 'Higher Yields', desc: 'Competitive returns compared to traditional finance' },
              { icon: '🔐', title: 'Transparency', desc: 'All transactions visible on blockchain' },
              { icon: '⚡', title: 'Efficiency', desc: 'Fast settlements, no intermediaries' },
            ].map((item) => (
              <div key={item.title} className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-xl font-bold text-[#023D7A] mb-3">{item.title}</h3>
                <p className="text-[#333333]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="risks" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Understanding Risks</h2>
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-700 mb-4">⚠️ Key Risks to Understand</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-xl">•</span>
                <div>
                  <p className="font-bold text-red-700">Smart Contract Risk</p>
                  <p className="text-[#333333]">Code vulnerabilities could result in loss of funds</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-xl">•</span>
                <div>
                  <p className="font-bold text-red-700">Market Volatility</p>
                  <p className="text-[#333333]">Crypto asset prices can fluctuate significantly</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-xl">•</span>
                <div>
                  <p className="font-bold text-red-700">Regulatory Uncertainty</p>
                  <p className="text-[#333333]">Evolving regulations may affect operations</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section id="getting" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Getting Started</h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Create a Wallet', desc: 'Set up a compatible crypto wallet (MetaMask, WalletConnect)' },
              { step: '2', title: 'Complete KYC', desc: 'Verify your identity through our compliance process' },
              { step: '3', title: 'Deposit Funds', desc: 'Transfer EURC or other supported assets to your account' },
              { step: '4', title: 'Choose a Pool', desc: 'Select from our diversified pool families based on your goals' },
              { step: '5', title: 'Start Earning', desc: 'Receive uLP tokens and begin earning yield automatically' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#00A8A8] text-white rounded-full flex items-center justify-center font-bold text-xl">
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
      </div>
    </DocPage>
  );
};

export default DeFiBasics;
