/**
 * Token Comparison Guide
 * Comprehensive comparison of uLP, UAT, and UGT tokens
 */

import React from 'react';
import DocPage from './DocPage';

const TokenComparisonGuide: React.FC = () => {
  return (
    <DocPage
      title="Token Comparison Guide"
      category="14_EDUCATIONAL"
      categoryId="05"
      lastUpdated="March 21, 2026"
    >
      <div className="space-y-8">
        {/* Quick Comparison */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Quick Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#023D7A] text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Feature</th>
                  <th className="px-6 py-4 text-left">UAT</th>
                  <th className="px-6 py-4 text-left">uLP</th>
                  <th className="px-6 py-4 text-left">UGT</th>
                </tr>
              </thead>
              <tbody>
                <ComparisonRow feature="Full Name" uat="Ujamaa Asset Token" upt="Ujamaa Liquidity Provider Token" ugt="Ujamaa Guarantee Token" />
                <ComparisonRow feature="Token Standard" uat="ERC-3643" upt="ERC-3643 (Fungible)" ugt="ERC-721 + ERC-3643 (NFT)" />
                <ComparisonRow feature="What You Own" uat="Single asset" upt="Diversified pool share" ugt="Collateral (not investment)" />
                <ComparisonRow feature="Value Model" uat="Fixed nominal value" upt="NAV appreciates over time" ugt="Collateral value" />
                <ComparisonRow feature="Risk Level" uat="🔴 High (single asset)" upt="🟢 Low (diversified)" ugt="N/A" />
                <ComparisonRow feature="Expected Return" uat="8-15%" upt="8-12% APR" ugt="N/A" />
                <ComparisonRow feature="Minimum" uat="€50,000+" upt="€1,000" ugt="N/A" />
                <ComparisonRow feature="For" uat="Sophisticated investors" upt="All investors" ugt="Originators only" />
              </tbody>
            </table>
          </div>
        </section>

        {/* What Are They */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TokenCard
            symbol="UAT"
            name="Ujamaa Asset Token"
            description="Single asset investment token"
            example="UAT-LGREIT → Lagos property"
            analogy="Like buying Apple stock"
            color="from-blue-500 to-blue-600"
          />
          <TokenCard
            symbol="uLP"
            name="Ujamaa Liquidity Provider Token"
            description="Diversified pool investment (yield-bearing)"
            example="uLP-IND → 50+ factories pool"
            analogy="Like an S&P 500 ETF"
            color="from-[#00A8A8] to-[#023D7A]"
            featured
          />
          <TokenCard
            symbol="UGT"
            name="Ujamaa Guarantee Token"
            description="Collateral NFT for originators"
            example="UGT-001 → 1,000 cotton bales"
            analogy="Like a warehouse receipt"
            color="from-purple-500 to-purple-600"
          />
        </section>

        {/* Token Mechanics */}
        <section className="bg-gradient-to-br from-[#023D7A] to-[#00A8A8] rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">🪙 How uLP Works (Value-Accrual Model)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="font-bold text-xl mb-4">📈 NAV Appreciation</h3>
              <p className="text-white/90 mb-4">
                Unlike traditional tokens, uLP uses a <strong>value-accrual model</strong> where the token balance stays constant but the NAV (Net Asset Value) per token increases over time.
              </p>
              <div className="bg-white/20 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2">Initial: 1,000 uLP × €1.00 = €1,000</p>
                <p className="mb-2">After 1 year: 1,000 uLP × €1.10 = €1,100</p>
                <p className="text-green-300">Gain: +€100 (+10%) without selling</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="font-bold text-xl mb-4">💰 Yield Distribution</h3>
              <p className="text-white/90 mb-4">
                Yield from underlying assets (loan repayments, interest) increases the pool's total value, which increases NAV per share.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Interest from industrial loans</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Principal repayments</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>UGT collateral liquidations</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Comparison */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Risk Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RiskProfile
              token="UAT"
              risks={[
                { name: 'Default Risk', level: 'high', reason: 'Single asset exposure' },
                { name: 'Concentration', level: 'high', reason: '100% in one asset' },
                { name: 'Liquidity', level: 'medium', reason: 'Asset-specific market' },
                { name: 'Volatility', level: 'high', reason: 'Single asset performance' },
              ]}
            />
            <RiskProfile
              token="uLP"
              risks={[
                { name: 'Default Risk', level: 'low', reason: 'Diversified across 50+ assets' },
                { name: 'Concentration', level: 'low', reason: 'Spread across pool' },
                { name: 'Liquidity', level: 'low', reason: 'Standardized tokens' },
                { name: 'Volatility', level: 'low', reason: 'Averaged returns' },
              ]}
              featured
            />
            <RiskProfile
              token="UGT"
              risks={[
                { name: 'Collateral Loss', level: 'high', reason: 'Default = lose merchandise' },
                { name: 'Valuation', level: 'medium', reason: 'Appraisal required' },
                { name: 'Transfer', level: 'low', reason: 'Pool ↔ Originator only' },
                { name: 'Investment', level: 'none', reason: 'Not an investment token' },
              ]}
            />
          </div>
        </section>

        {/* Which to Choose */}
        <section className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Which Should YOU Choose?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChooseCard
              title="Choose uLP If..."
              items={[
                'You want diversified exposure',
                'You prefer lower risk',
                'You want stable 8-12% returns',
                'You\'re a retail or institutional investor',
                'Minimum €1,000 works for you',
                'You want NAV to appreciate over time',
              ]}
              recommended
            />
            <ChooseCard
              title="Choose UAT If..."
              items={[
                'You\'re a sophisticated investor',
                'You have sector expertise',
                'You want potentially higher returns (12-15%)',
                'You accept concentration risk',
                'Minimum €50,000+ is acceptable',
                'You prefer single-asset exposure',
              ]}
            />
          </div>
          <div className="mt-8 p-6 bg-white/10 rounded-lg backdrop-blur-sm">
            <h3 className="font-bold mb-2">⚠️ About UGT</h3>
            <p>UGT is NOT an investment token. It's an NFT collateral for originators who need financing. Investors do NOT buy UGT.</p>
          </div>
        </section>

        {/* Pool Families */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">🏛️ uLP Pool Families</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <PoolFamilyCard
              name="Pool Industry"
              icon="🏭"
              apy="10-12%"
              lockup="365 days"
              assets="Manufacturing, GDIZ partners"
              color="from-blue-500 to-blue-600"
            />
            <PoolFamilyCard
              name="Pool Agriculture"
              icon="🌱"
              apy="12-15%"
              lockup="180 days"
              assets="Coffee, cocoa, cotton, cashews"
              color="from-green-500 to-emerald-600"
            />
            <PoolFamilyCard
              name="Pool Trade Finance"
              icon="📦"
              apy="8-10%"
              lockup="90 days"
              assets="Invoice tokenization"
              color="from-purple-500 to-purple-600"
            />
            <PoolFamilyCard
              name="Pool Renewable Energy"
              icon="⚡"
              apy="9-11%"
              lockup="730 days"
              assets="Solar, wind, hydro projects"
              color="from-cyan-500 to-cyan-600"
            />
            <PoolFamilyCard
              name="Pool Real Estate"
              icon="🏢"
              apy="8-12%"
              lockup="1095 days"
              assets="Commercial & residential"
              color="from-amber-500 to-orange-600"
            />
          </div>
        </section>

        {/* Portfolio Examples */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Sample Portfolios</h2>
          <div className="space-y-6">
            <PortfolioExample
              title="Conservative Investor"
              allocation={[{ token: 'uLP', percentage: 100 }]}
              rationale="100% uLP provides instant diversification across 50+ assets with stable returns and minimal risk."
            />
            <PortfolioExample
              title="Balanced Investor"
              allocation={[{ token: 'uLP', percentage: 70 }, { token: 'UAT', percentage: 30 }]}
              rationale="70/30 split balances stable core returns with targeted high-conviction bets in specific assets."
            />
            <PortfolioExample
              title="Sophisticated Investor"
              allocation={[{ token: 'uLP', percentage: 50 }, { token: 'UAT', percentage: 50 }]}
              rationale="Equal split for investors with sector expertise seeking higher returns while maintaining core diversification."
            />
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Common Questions</h2>
          <div className="space-y-4">
            <FAQItem
              q="How does uLP value increase?"
              a="As the underlying pool earns yield from loan repayments and interest, the total pool value increases. Since the number of uLP tokens stays constant, the NAV (Net Asset Value) per token increases. Your token balance stays the same, but each token is worth more."
            />
            <FAQItem
              q="Can I hold both UAT and uLP?"
              a="Yes! Many investors use a barbell approach: uLP for diversified core holdings, UAT for targeted high-conviction bets on specific assets."
            />
            <FAQItem
              q="Can I convert UAT to uLP?"
              a="No direct conversion exists. You would need to sell UAT on the secondary market (or wait for maturity) and then use proceeds to buy uLP."
            />
            <FAQItem
              q="Can investors buy UGT?"
              a="No. UGT is an NFT collateral token for originators only. It's not an investment product and cannot be purchased by investors."
            />
            <FAQItem
              q="Which is more liquid?"
              a="uLP is more liquid due to lower minimums (€1,000 vs €50,000+), larger investor base, and diversified appeal. UAT liquidity depends on the specific asset."
            />
            <FAQItem
              q="How do I redeem uLP?"
              a="Submit a redemption request through the platform. Redemptions are processed quarterly, subject to pool liquidity and any applicable lock-up periods."
            />
          </div>
        </section>
      </div>
    </DocPage>
  );
};

// Sub-components
const ComparisonRow: React.FC<{ feature: string; uat: string; upt: string; ugt: string }> = ({ feature, uat, upt, ugt }) => (
  <tr className="border-b border-[#48A9F0]/20">
    <td className="px-6 py-4 font-bold text-[#023D7A]">{feature}</td>
    <td className="px-6 py-4 text-[#333333]">{uat}</td>
    <td className="px-6 py-4 text-[#333333] bg-[#F3F8FA]">{upt}</td>
    <td className="px-6 py-4 text-[#333333]">{ugt}</td>
  </tr>
);

const TokenCard: React.FC<{ symbol: string; name: string; description: string; example: string; analogy: string; color: string; featured?: boolean }> = ({ symbol, name, description, example, analogy, color, featured }) => (
  <div className={`rounded-xl shadow-lg overflow-hidden ${featured ? 'ring-4 ring-[#00A8A8]' : ''}`}>
    <div className={`bg-gradient-to-r ${color} p-6 text-white`}>
      <p className="text-4xl font-bold mb-2">{symbol}</p>
      <p className="text-xl font-bold">{name}</p>
    </div>
    <div className="p-6 bg-white">
      <p className="text-[#333333] mb-4">{description}</p>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-[#333333]/60">Example</p>
          <p className="font-bold text-[#023D7A]">{example}</p>
        </div>
        <div>
          <p className="text-xs text-[#333333]/60">Think of it like</p>
          <p className="font-bold text-[#00A8A8]">{analogy}</p>
        </div>
      </div>
    </div>
  </div>
);

const PoolFamilyCard: React.FC<{ name: string; icon: string; apy: string; lockup: string; assets: string; color: string }> = ({ name, icon, apy, lockup, assets, color }) => (
  <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
      {icon}
    </div>
    <h3 className="text-lg font-bold text-[#103b5b] mb-2">{name}</h3>
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Target APY</span>
        <span className="font-bold text-green-600">{apy}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Lock-up</span>
        <span className="font-bold text-gray-900">{lockup}</span>
      </div>
      <div className="pt-2 border-t border-gray-200">
        <p className="text-gray-600">{assets}</p>
      </div>
    </div>
  </div>
);

const RiskProfile: React.FC<{ token: string; risks: { name: string; level: string; reason: string }[]; featured?: boolean }> = ({ token, risks, featured }) => (
  <div className={`p-6 rounded-xl ${featured ? 'bg-[#F3F8FA] border-2 border-[#00A8A8]' : 'bg-white border border-[#48A9F0]/20'}`}>
    <h3 className="text-2xl font-bold text-[#023D7A] mb-4">{token}</h3>
    <div className="space-y-3">
      {risks.map((risk, idx) => (
        <div key={idx}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-bold text-[#023D7A]">{risk.name}</span>
            <span className={`text-xs px-2 py-1 rounded ${
              risk.level === 'high' ? 'bg-red-100 text-red-700' :
              risk.level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              risk.level === 'low' ? 'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-700'
            }`}>{risk.level.toUpperCase()}</span>
          </div>
          <p className="text-xs text-[#333333]">{risk.reason}</p>
        </div>
      ))}
    </div>
  </div>
);

const ChooseCard: React.FC<{ title: string; items: string[]; recommended?: boolean }> = ({ title, items, recommended }) => (
  <div className={`p-6 rounded-lg ${recommended ? 'bg-white text-[#023D7A]' : 'bg-white/10'}`}>
    {recommended && <span className="text-xs font-bold text-[#00A8A8] mb-2 block">⭐ RECOMMENDED FOR MOST</span>}
    <h3 className={`text-xl font-bold mb-4 ${recommended ? '' : 'text-white'}`}>{title}</h3>
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <li key={idx} className="flex gap-3">
          <span className={recommended ? 'text-[#00A8A8]' : 'text-white'}>✓</span>
          <span className={recommended ? 'text-[#333333]' : 'text-white/90'}>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const PortfolioExample: React.FC<{ title: string; allocation: { token: string; percentage: number }[]; rationale: string }> = ({ title, allocation, rationale }) => (
  <div className="p-6 bg-[#F3F8FA] rounded-lg">
    <h4 className="font-bold text-[#023D7A] mb-4">{title}</h4>
    <div className="flex gap-2 mb-4">
      {allocation.map((a, idx) => (
        <div key={idx} className="flex-1 text-center p-3 bg-white rounded-lg">
          <p className="text-2xl font-bold text-[#00A8A8]">{a.percentage}%</p>
          <p className="text-sm text-[#333333]">{a.token}</p>
        </div>
      ))}
    </div>
    <p className="text-sm text-[#333333]">{rationale}</p>
  </div>
);

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => (
  <div className="p-4 bg-[#F3F8FA] rounded-lg">
    <p className="font-bold text-[#023D7A] mb-2">{q}</p>
    <p className="text-[#333333]">{a}</p>
  </div>
);

export default TokenComparisonGuide;
