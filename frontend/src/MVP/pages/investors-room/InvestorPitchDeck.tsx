/**
 * Investor Pitch Deck
 * Investment presentation for investor meetings
 */

import React from 'react';
import DocPage from './DocPage';

const InvestorPitchDeck: React.FC = () => {
  return (
    <DocPage
      title="Investor Pitch Deck"
      category="00_EXECUTIVE"
      categoryId="03"
      lastUpdated="March 21, 2026"
    >
      <div className="space-y-8">
        {/* Slide 1: Title */}
        <section className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] rounded-xl shadow-lg p-12 text-white text-center">
          <h1 className="text-5xl font-bold mb-4">UJAMAA DeFi Platform</h1>
          <p className="text-2xl mb-8">Institutional DeFi for African Real-World Assets</p>
          <p className="text-lg opacity-90">Investment Opportunity | March 2026</p>
        </section>

        {/* Slide 2: Problem */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">❌ The Problem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProblemCard 
              title="African SMEs"
              problem="€500B+ financing gap"
              details="Creditworthy businesses denied capital despite strong fundamentals"
            />
            <ProblemCard 
              title="Investors"
              problem="Limited yield opportunities"
              details="Traditional finance offers 2-5% returns in developed markets"
            />
            <ProblemCard 
              title="Inefficiency"
              problem="High costs & slow processes"
              details="Traditional trade finance takes weeks with high intermediary costs"
            />
            <ProblemCard 
              title="Lack of Transparency"
              problem="Opaque operations"
              details="Investors cannot track asset performance in real-time"
            />
          </div>
        </section>

        {/* Slide 3: Solution */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">✅ Our Solution</h2>
          <div className="space-y-6">
            <SolutionCard 
              number="01"
              title="Tokenization"
              description="Convert real-world assets into ERC-3643 compliant tokens"
              benefit="Fractional ownership, 24/7 trading, instant settlement"
            />
            <SolutionCard 
              number="02"
              title="Liquidity Pools"
              description="Diversified pools of income-generating African assets"
              benefit="8-15% APY with institutional-grade risk management"
            />
            <SolutionCard 
              number="03"
              title="Compliance-First"
              description="Built-in KYC/AML, jurisdiction controls, ERC-3643"
              benefit="Regulatory compliant across 50+ jurisdictions"
            />
            <SolutionCard 
              number="04"
              title="Transparency"
              description="Real-time asset tracking on blockchain"
              benefit="Full visibility into asset performance and collateral"
            />
          </div>
        </section>

        {/* Slide 4: Market Opportunity */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">📊 Market Opportunity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MarketCard 
              metric="€500B+"
              label="African SME Financing Gap"
              source="World Bank, 2025"
            />
            <MarketCard 
              metric="€2.5T"
              label="African Real-World Assets"
              source="AfDB, 2025"
            />
            <MarketCard 
              metric="15-25%"
              label="Average SME Interest Rates"
              source="IMF, 2025"
            />
          </div>
          <div className="mt-8 p-6 bg-[#F3F8FA] rounded-lg">
            <h4 className="font-bold text-[#023D7A] mb-2">Target Market (MVP)</h4>
            <ul className="space-y-2 text-[#333333]">
              <li>• <strong>Industrial Sector:</strong> €50M pool (manufacturing, equipment)</li>
              <li>• <strong>Agriculture:</strong> €30M pool (cocoa, cotton, cashews)</li>
              <li>• <strong>Trade Finance:</strong> €20M pool (invoice factoring)</li>
            </ul>
          </div>
        </section>

        {/* Slide 5: Business Model */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">💰 Business Model</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#F3F8FA] rounded-lg">
              <h4 className="font-bold text-[#023D7A] mb-4">Revenue Streams</h4>
              <ul className="space-y-3">
                <RevenueItem source="Management Fee" rate="2.0% AUM" desc="Annual fee on assets under management" />
                <RevenueItem source="Performance Fee" rate="20%" desc="Above 8% hurdle rate" />
                <RevenueItem source="Origination Fee" rate="1-3%" desc="Asset origination & structuring" />
                <RevenueItem source="Secondary Trading" rate="0.5%" desc="Trading fee on secondary market" />
              </ul>
            </div>
            <div className="p-6 bg-[#F3F8FA] rounded-lg">
              <h4 className="font-bold text-[#023D7A] mb-4">Unit Economics (Per €100M AUM)</h4>
              <ul className="space-y-3">
                <UnitItem metric="Management Fee" value="€2.0M" />
                <UnitItem metric="Performance Fee" value="€0.8M" />
                <UnitItem metric="Origination Fee" value="€0.5M" />
                <UnitItem metric="Total Revenue" value="€3.3M" />
                <UnitItem metric="Operating Costs" value="€1.2M" />
                <UnitItem metric="Net Revenue" value="€2.1M" />
              </ul>
            </div>
          </div>
        </section>

        {/* Slide 6: Traction */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">🚀 Traction (MVP)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <TractionCard metric="3" label="Pools Launched" />
            <TractionCard metric="€100M" label="Target AUM" />
            <TractionCard metric="50+" label="Pipeline Assets" />
            <TractionCard metric="Mauritius" label="FSC Licensed" />
          </div>
          <div className="mt-8 p-6 bg-gradient-to-r from-[#023D7A] to-[#00A8A8] rounded-lg text-white">
            <h4 className="font-bold mb-4">Key Partnerships</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Partner name="GDIZ" role="Industrial Network" />
              <Partner name="Fireblocks" role="Institutional Custody" />
              <Partner name="BIIC/MCB" role="Bank Escrow" />
              <Partner name="Polygon" role="Blockchain" />
            </div>
          </div>
        </section>

        {/* Slide 7: Token Economics */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">🪙 Token Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TokenCard 
              symbol="UAT"
              name="Ujamaa Asset Token"
              desc="Single asset investment"
              return="8-15% APY"
              min="€50,000"
            />
            <TokenCard 
              symbol="UPT"
              name="Ujamaa Pool Token"
              desc="Diversified pool investment"
              return="8-12% APY"
              min="€1,000"
              featured
            />
            <TokenCard 
              symbol="UGT"
              name="Ujamaa Guarantee Token"
              desc="Collateral token (originators)"
              return="N/A"
              min="N/A"
            />
          </div>
        </section>

        {/* Slide 8: Roadmap */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">📅 Roadmap</h2>
          <div className="space-y-4">
            <RoadmapItem 
              quarter="Q1 2026"
              title="MVP Testnet Launch"
              status="completed"
              items={['Smart contracts deployed', 'Frontend live', 'Documentation complete']}
            />
            <RoadmapItem 
              quarter="Q2 2026"
              title="Security Audits"
              status="current"
              items={['CertiK audit', 'Bug bounty program', 'Penetration testing']}
            />
            <RoadmapItem 
              quarter="Q3 2026"
              title="Mainnet Launch"
              status="upcoming"
              items={['Polygon mainnet', 'First €10M pool', '50+ investors']}
            />
            <RoadmapItem 
              quarter="Q4 2026"
              title="Scale"
              status="upcoming"
              items={['€100M AUM target', 'Secondary market', 'Mobile app']}
            />
          </div>
        </section>

        {/* Slide 9: Team */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">👥 Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TeamMember
              name="Lead Architect"
              role="10+ years blockchain, fintech expert"
              bio="Former major financial institution"
            />
            <TeamMember
              name="Chief Financial Officer"
              role="Ex-investment banker"
              bio="Emerging markets expert"
            />
            <TeamMember
              name="Chief Compliance Officer"
              role="Former regulator"
              bio="Mauritius FSC licensed"
            />
          </div>
        </section>

        {/* Slide 10: Ask */}
        <section className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] rounded-xl shadow-lg p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-6">💰 Investment Ask</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/10 rounded-lg p-6">
              <p className="text-5xl font-bold mb-2">€5M</p>
              <p className="text-lg">Seed Round</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <p className="text-5xl font-bold mb-2">€100M</p>
              <p className="text-lg">Target AUM (Year 1)</p>
            </div>
          </div>
          <p className="text-xl mb-8">Use of Funds: 40% Technology, 30% Compliance & Licensing, 20% Operations, 10% Marketing</p>
          <a href="/investors-room/contact" className="inline-block px-8 py-4 bg-white text-[#023D7A] rounded-lg font-bold text-xl hover:bg-[#F3F8FA] transition-colors">
            Schedule a Meeting
          </a>
        </section>
      </div>
    </DocPage>
  );
};

// Sub-components
const ProblemCard: React.FC<{ title: string; problem: string; details: string }> = ({ title, problem, details }) => (
  <div className="p-6 bg-red-50 rounded-lg border-l-4 border-red-500">
    <h4 className="font-bold text-[#023D7A] mb-2">{title}</h4>
    <p className="text-red-600 font-bold mb-2">{problem}</p>
    <p className="text-sm text-[#333333]">{details}</p>
  </div>
);

const SolutionCard: React.FC<{ number: string; title: string; description: string; benefit: string }> = ({ number, title, description, benefit }) => (
  <div className="flex gap-4 p-6 bg-[#F3F8FA] rounded-lg">
    <div className="text-4xl font-bold text-[#00A8A8]">{number}</div>
    <div>
      <h4 className="font-bold text-[#023D7A] mb-2">{title}</h4>
      <p className="text-[#333333] mb-2">{description}</p>
      <p className="text-sm text-[#00A8A8] font-bold">→ {benefit}</p>
    </div>
  </div>
);

const MarketCard: React.FC<{ metric: string; label: string; source: string }> = ({ metric, label, source }) => (
  <div className="text-center p-6 bg-[#F3F8FA] rounded-lg">
    <p className="text-4xl font-bold text-[#023D7A] mb-2">{metric}</p>
    <p className="text-[#333333] font-bold">{label}</p>
    <p className="text-xs text-[#333333]/60 mt-2">{source}</p>
  </div>
);

const RevenueItem: React.FC<{ source: string; rate: string; desc: string }> = ({ source, rate, desc }) => (
  <div className="flex justify-between items-center border-b border-[#48A9F0]/20 pb-2">
    <div>
      <p className="font-bold text-[#023D7A]">{source}</p>
      <p className="text-xs text-[#333333]">{desc}</p>
    </div>
    <p className="text-lg font-bold text-[#00A8A8]">{rate}</p>
  </div>
);

const UnitItem: React.FC<{ metric: string; value: string }> = ({ metric, value }) => (
  <div className="flex justify-between border-b border-[#48A9F0]/20 pb-2">
    <span className="text-[#333333]">{metric}</span>
    <span className="font-bold text-[#023D7A]">{value}</span>
  </div>
);

const TractionCard: React.FC<{ metric: string; label: string }> = ({ metric, label }) => (
  <div className="text-center p-6 bg-gradient-to-br from-[#023D7A] to-[#00A8A8] rounded-lg text-white">
    <p className="text-4xl font-bold mb-2">{metric}</p>
    <p className="text-sm">{label}</p>
  </div>
);

const Partner: React.FC<{ name: string; role: string }> = ({ name, role }) => (
  <div className="text-center p-4 bg-white/10 rounded-lg">
    <p className="font-bold">{name}</p>
    <p className="text-sm opacity-80">{role}</p>
  </div>
);

const TokenCard: React.FC<{ symbol: string; name: string; desc: string; return: string; min: string; featured?: boolean }> = ({ symbol, name, desc, return: ret, min, featured }) => (
  <div className={`p-6 rounded-lg border-2 ${featured ? 'bg-[#023D7A] text-white border-[#00A8A8]' : 'bg-[#F3F8FA] text-[#023D7A] border-[#48A9F0]/30'}`}>
    <p className={`text-3xl font-bold mb-2 ${featured ? 'text-[#00A8A8]' : ''}`}>{symbol}</p>
    <p className="font-bold mb-2">{name}</p>
    <p className="text-sm mb-4 opacity-80">{desc}</p>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm opacity-80">Return:</span>
        <span className="font-bold">{ret}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm opacity-80">Minimum:</span>
        <span className="font-bold">{min}</span>
      </div>
    </div>
  </div>
);

const RoadmapItem: React.FC<{ quarter: string; title: string; status: string; items: string[] }> = ({ quarter, title, status, items }) => (
  <div className={`flex gap-4 p-6 rounded-lg ${status === 'current' ? 'bg-[#F3F8FA] border-l-4 border-[#00A8A8]' : 'bg-white border border-[#48A9F0]/20'}`}>
    <div className="text-center min-w-[100px]">
      <p className="font-bold text-[#023D7A]">{quarter}</p>
      <span className={`text-xs px-2 py-1 rounded ${status === 'completed' ? 'bg-green-100 text-green-700' : status === 'current' ? 'bg-[#00A8A8]/20 text-[#00A8A8]' : 'bg-gray-100 text-gray-600'}`}>
        {status === 'completed' ? '✅ Done' : status === 'current' ? '🔄 Current' : '⏳ Upcoming'}
      </span>
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-[#023D7A] mb-2">{title}</h4>
      <ul className="space-y-1">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm text-[#333333]">• {item}</li>
        ))}
      </ul>
    </div>
  </div>
);

const TeamMember: React.FC<{ name: string; role: string; bio: string }> = ({ name, role, bio }) => (
  <div className="text-center p-6 bg-[#F3F8FA] rounded-lg">
    <div className="w-24 h-24 bg-[#023D7A] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
      {name.split(' ').map(n => n[0]).join('').substring(0, 2)}
    </div>
    <p className="font-bold text-[#023D7A]">{name}</p>
    <p className="text-[#00A8A8] font-bold text-sm mb-2">{role}</p>
    <p className="text-sm text-[#333333]">{bio}</p>
  </div>
);

export default InvestorPitchDeck;
