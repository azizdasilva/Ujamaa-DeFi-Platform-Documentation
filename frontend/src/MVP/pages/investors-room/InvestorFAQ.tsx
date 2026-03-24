/**
 * Investor FAQ
 * Frequently asked questions from investors
 */

import React, { useState } from 'react';
import DocPage from './DocPage';

const InvestorFAQ: React.FC = () => {
  const [openCategory, setOpenCategory] = useState<string | null>('general');

  return (
    <DocPage
      title="Investor FAQ"
      category="14_EDUCATIONAL"
      categoryId="04"
      lastUpdated="March 21, 2026"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Frequently Asked Questions</h2>
          <p className="text-[#333333] leading-relaxed mb-6">
            Find answers to common questions about investing in Ujamaa DeFi Platform.
          </p>
        </section>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          <CategoryTab id="general" label="📖 General" open={openCategory} setOpen={setOpenCategory} />
          <CategoryTab id="investment" label="💰 Investment" open={openCategory} setOpen={setOpenCategory} />
          <CategoryTab id="tokens" label="🪙 Tokens" open={openCategory} setOpen={setOpenCategory} />
          <CategoryTab id="compliance" label="⚖️ Compliance" open={openCategory} setOpen={setOpenCategory} />
          <CategoryTab id="technical" label="🔧 Technical" open={openCategory} setOpen={setOpenCategory} />
        </div>

        {/* General Questions */}
        {openCategory === 'general' && (
          <section className="space-y-4">
            <FAQItem 
              question="What is Ujamaa DeFi Platform?"
              answer="Ujamaa DeFi is an institutional-grade platform for tokenizing African real-world assets (RWA). We connect global investors with African SMEs through blockchain-based liquidity pools, offering 8-15% APY while supporting economic development."
            />
            <FAQItem 
              question="Who can invest?"
              answer="Accredited investors, family offices, and institutional investors from eligible jurisdictions. Minimum investment starts at €1,000 for uLP tokens. All investors must complete KYC verification."
            />
            <FAQItem 
              question="Where is Ujamaa based?"
              answer="Ujamaa DeFi Platform Ltd is incorporated in Mauritius with an FSC CIS Manager License. Our operations span across African markets including Côte d'Ivoire, Ghana, Kenya, and Benin."
            />
            <FAQItem 
              question="What are the minimum investments?"
              answer="uLP (Pool Token): €1,000 minimum. UAT (Single Asset): €50,000+ depending on the asset. UGT is not an investment token—it's collateral for originators."
            />
            <FAQItem 
              question="How do I get started?"
              answer="1) Complete KYC/KYB verification, 2) Review investment documents, 3) Choose uLP or UAT tokens, 4) Subscribe via the investor portal, 5) Receive tokens in your wallet."
            />
          </section>
        )}

        {/* Investment Questions */}
        {openCategory === 'investment' && (
          <section className="space-y-4">
            <FAQItem 
              question="What returns can I expect?"
              answer="uLP (Pool tokens): 8-12% APR, diversified and stable. UAT (Single asset): 8-15% APR, varies by asset performance. Returns are paid quarterly in EURC stablecoin."
            />
            <FAQItem 
              question="What are the fees?"
              answer="Management fee: 2.0% per annum. Performance fee: 20% above 8% hurdle rate. Origination fee: 1-3% (built into investment). No hidden fees."
            />
            <FAQItem 
              question="Is there a lock-up period?"
              answer="Yes, 180-365 days depending on the pool/asset. Early redemption may be possible on the secondary market (when available) subject to liquidity."
            />
            <FAQItem 
              question="How are distributions paid?"
              answer="Quarterly distributions in EURC stablecoin directly to your wallet. You can reinvest or withdraw to your bank account via our fiat ramp partners."
            />
            <FAQItem 
              question="What happens if a borrower defaults?"
              answer="For uLP: The pool absorbs the loss; diversification protects investors. UGT collateral is liquidated to recover funds. For UAT: You bear the loss directly (higher risk, higher return)."
            />
            <FAQItem 
              question="Can I reinvest my returns?"
              answer="Yes! You can automatically reinvest distributions into additional uLP/UAT tokens to compound your returns."
            />
          </section>
        )}

        {/* Token Questions */}
        {openCategory === 'tokens' && (
          <section className="space-y-4">
            <FAQItem 
              question="What is the difference between UAT, uLP, and UGT?"
              answer="UAT (Ujamaa Asset Token): Single asset investment, like buying one stock. uLP (Ujamaa Liquidity Provider Token): Diversified pool investment, like an ETF. UGT (Ujamaa Guarantee Token): Collateral token for originators, NOT an investment."
            />
            <FAQItem 
              question="What blockchain are tokens on?"
              answer="Polygon (MATIC) for low fees and fast transactions. All tokens are ERC-3643 compliant for regulatory compliance. UGT is ERC-721 + ERC-3643 (NFT)."
            />
            <FAQItem 
              question="Can I transfer my tokens?"
              answer="Yes, but only to verified wallets that pass compliance checks. ERC-3643 enforces KYC at the token level—unverified wallets cannot receive tokens."
            />
            <FAQItem 
              question="What wallet should I use?"
              answer="Any ERC-3643 compatible wallet: MetaMask (with compliance module), Fireblocks (institutional), or our native Ujamaa wallet (coming Q3 2026)."
            />
            <FAQItem 
              question="Can I convert UAT to uLP?"
              answer="No direct conversion. You would need to sell UAT on the secondary market and buy uLP, or wait for maturity and reinvest."
            />
          </section>
        )}

        {/* Compliance Questions */}
        {openCategory === 'compliance' && (
          <section className="space-y-4">
            <FAQItem 
              question="Which jurisdictions are eligible?"
              answer="50+ jurisdictions including EU, UK, Switzerland, UAE, Singapore, and most African countries. US persons and sanctioned jurisdictions (OFAC/UN/FATF) are restricted."
            />
            <FAQItem 
              question="What KYC is required?"
              answer="Individuals: Government ID, proof of address, source of funds. Entities: Certificate of incorporation, beneficial owners, AML policies. Processing time: 2-5 business days."
            />
            <FAQItem 
              question="Is Ujamaa regulated?"
              answer="Yes, licensed by Mauritius FSC as a CIS Manager. We comply with EU AMLD5/6, FATF travel rule, and local regulations in all operating jurisdictions."
            />
            <FAQItem 
              question="How is my data protected?"
              answer="GDPR compliant. Data encrypted at rest and in transit. Third-party audits annually. We never sell your data."
            />
            <FAQItem 
              question="What about tax reporting?"
              answer="We provide annual tax statements showing your investments, distributions, and gains. Consult your tax advisor for jurisdiction-specific guidance."
            />
          </section>
        )}

        {/* Technical Questions */}
        {openCategory === 'technical' && (
          <section className="space-y-4">
            <FAQItem 
              question="Are the smart contracts audited?"
              answer="Yes, CertiK audit scheduled for Q2 2026. Bug bounty program live with Immunefi. All code is open source on GitHub."
            />
            <FAQItem 
              question="What custody solution is used?"
              answer="Fireblocks institutional custody with MPC (Multi-Party Computation). Insurance coverage up to $1B. Your assets are segregated and protected."
            />
            <FAQItem 
              question="How do I verify my tokens?"
              answer="Use Etherscan (Polygon) and enter your wallet address. ERC-3643 compliance layer shows verification status. Or use our investor portal dashboard."
            />
            <FAQItem 
              question="What if I lose my wallet?"
              answer="Contact support immediately. For institutional clients with Fireblocks, recovery is possible via social recovery. For self-custody, backup your seed phrase securely."
            />
            <FAQItem 
              question="Can I interact with contracts directly?"
              answer="Yes, advanced users can interact via Etherscan or Web3. However, all compliance checks still apply—unverified addresses cannot receive tokens."
            />
          </section>
        )}

        {/* Contact */}
        <section className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] rounded-xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
          <div className="space-y-2">
            <p><strong>Investor Relations:</strong> investors@ujamaa.defi</p>
            <p><strong>Support:</strong> support@ujamaa.defi</p>
            <p><strong>Response Time:</strong> 24 hours</p>
            <a href="/investors-room/contact" className="inline-block mt-4 px-6 py-3 bg-white text-[#023D7A] rounded-lg font-bold hover:bg-[#F3F8FA] transition-colors">
              Schedule a Call
            </a>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

const CategoryTab: React.FC<{ id: string; label: string; open: string | null; setOpen: (id: string | null) => void }> = ({ id, label, open, setOpen }) => (
  <button
    onClick={() => setOpen(open === id ? null : id)}
    className={`px-4 py-2 rounded-lg font-bold transition-colors ${
      open === id ? 'bg-[#023D7A] text-white' : 'bg-[#F3F8FA] text-[#023D7A] hover:bg-[#023D7A]/10'
    }`}
  >
    {label}
  </button>
);

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#00A8A8]">
    <h4 className="text-lg font-bold text-[#023D7A] mb-3">{question}</h4>
    <p className="text-[#333333] leading-relaxed">{answer}</p>
  </div>
);

export default InvestorFAQ;
