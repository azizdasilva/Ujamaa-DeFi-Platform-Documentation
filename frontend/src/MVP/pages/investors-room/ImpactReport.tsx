/**
 * Impact Report
 * Social and economic impact of Ujamaa investments
 */

import React from 'react';
import DocPage from './DocPage';

const ImpactReport: React.FC = () => {
  return (
    <DocPage
      title="Impact Report 2025"
      category="00_EXECUTIVE"
      categoryId="09A"
      lastUpdated="March 21, 2026"
    >
      <div className="space-y-8">
        {/* Header */}
        <section className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] rounded-xl shadow-lg p-12 text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Impact Report 2025</h1>
          <p className="text-xl opacity-90">Measuring Social & Economic Impact Across Africa</p>
        </section>

        {/* Impact Metrics */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">📊 Impact at a Glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ImpactMetric value="€100M" label="Capital Deployed" sub="To African SMEs" />
            <ImpactMetric value="5,000+" label="Jobs Created" sub="Direct & indirect" />
            <ImpactMetric value="50+" label="SMEs Financed" sub="Across 8 countries" />
            <ImpactMetric value="12%" label="Avg. Income Increase" sub="For workers" />
          </div>
        </section>

        {/* SDG Alignment */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">🌍 UN Sustainable Development Goals</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <SDGCard number="1" title="No Poverty" impact="€100M to underserved SMEs" color="bg-red-500" />
            <SDGCard number="8" title="Decent Work & Economic Growth" impact="5,000+ jobs created" color="bg-red-600" />
            <SDGCard number="9" title="Industry, Innovation & Infrastructure" impact="50+ factories financed" color="bg-orange-500" />
            <SDGCard number="10" title="Reduced Inequalities" impact="Financing in 8 African countries" color="bg-pink-500" />
            <SDGCard number="12" title="Responsible Consumption" impact="Sustainable supply chains" color="bg-yellow-500" />
            <SDGCard number="17" title="Partnerships for Goals" impact="GDIZ (Benin), Fireblocks, MCB partnerships" color="bg-blue-500" />
          </div>
        </section>

        {/* Regional Impact */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">🌍 Impact by Region</h2>
          <div className="space-y-4">
            <RegionImpact country="West Africa" countries="Côte d'Ivoire, Ghana, Benin, Togo" financed="€45M" jobs="2,200" smes="22" />
            <RegionImpact country="East Africa" countries="Kenya, Tanzania, Uganda" financed="€30M" jobs="1,500" smes="15" />
            <RegionImpact country="Southern Africa" countries="Zambia, Zimbabwe" financed="€15M" jobs="800" smes="8" />
            <RegionImpact country="Central Africa" countries="Cameroon, Gabon" financed="€10M" jobs="500" smes="5" />
          </div>
        </section>

        {/* Sector Impact */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">🏭 Impact by Sector</h2>
          <div className="space-y-6">
            <SectorImpact 
              sector="Industrial Manufacturing"
              percentage={40}
              description="Factories producing textiles, equipment, consumer goods"
              outcomes={['2,000 direct jobs', '€40M exports enabled', '15% avg. wage increase']}
            />
            <SectorImpact 
              sector="Agriculture & Agribusiness"
              percentage={30}
              description="Cocoa, cotton, cashews, coffee value chains"
              outcomes={['1,500 smallholder farmers', '€30M farmer income', 'Post-harvest loss reduced 30%']}
            />
            <SectorImpact 
              sector="Trade Finance"
              percentage={20}
              description="Invoice factoring, working capital"
              outcomes={['200+ SMEs supported', 'Payment cycles reduced 60%', 'Cash flow stability improved']}
            />
            <SectorImpact 
              sector="Green Energy"
              percentage={10}
              description="Solar, biomass, energy efficiency"
              outcomes={['5MW renewable capacity', '500 green jobs', '10K tons CO2 avoided']}
            />
          </div>
        </section>

        {/* Case Study */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">📖 Impact Case Study</h2>
          <div className="bg-[#F3F8FA] rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#023D7A] mb-4">Cocoa Cooperative, Côte d'Ivoire</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-[#023D7A] mb-2">Before Ujamaa</h4>
                <ul className="space-y-2 text-[#333333]">
                  <li>• 200 smallholder farmers</li>
                  <li>• €50K annual revenue</li>
                  <li>• No access to formal credit</li>
                  <li>• 40% post-harvest losses</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#023D7A] mb-2">After Ujamaa Financing</h4>
                <ul className="space-y-2 text-[#333333]">
                  <li>• 350 smallholder farmers (+75%)</li>
                  <li>• €200K annual revenue (+300%)</li>
                  <li>• UAT-COCOA token investment</li>
                  <li>• 10% post-harvest losses (-75%)</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-[#00A8A8]/10 rounded-lg">
              <p className="text-[#023D7A] font-bold">"Ujamaa financing allowed us to build a storage facility and buy processing equipment. Our farmers now earn 3x more income."</p>
              <p className="text-sm text-[#333333] mt-2">— Cooperative President, Soubré, Côte d'Ivoire</p>
            </div>
          </div>
        </section>

        {/* Investor Impact */}
        <section className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">💰 Double Bottom Line</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Financial Returns</h3>
              <ul className="space-y-2">
                <li className="flex justify-between"><span>uLP Average Return:</span><span className="font-bold">10.2% APR</span></li>
                <li className="flex justify-between"><span>UAT Average Return:</span><span className="font-bold">12.5% APR</span></li>
                <li className="flex justify-between"><span>Default Rate:</span><span className="font-bold">0.2%</span></li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Social Returns</h3>
              <ul className="space-y-2">
                <li className="flex justify-between"><span>Jobs per €1M:</span><span className="font-bold">50 jobs</span></li>
                <li className="flex justify-between"><span>Income Multiplier:</span><span className="font-bold">2.5x</span></li>
                <li className="flex justify-between"><span>Tax Revenue Generated:</span><span className="font-bold">€8M</span></li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

const ImpactMetric: React.FC<{ value: string; label: string; sub: string }> = ({ value, label, sub }) => (
  <div className="text-center p-6 bg-[#F3F8FA] rounded-lg">
    <p className="text-4xl font-bold text-[#023D7A] mb-2">{value}</p>
    <p className="font-bold text-[#333333]">{label}</p>
    <p className="text-sm text-[#333333]/60">{sub}</p>
  </div>
);

const SDGCard: React.FC<{ number: string; title: string; impact: string; color: string }> = ({ number, title, impact, color }) => (
  <div className={`${color} rounded-lg p-4 text-white`}>
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#023D7A] font-bold">{number}</div>
      <p className="font-bold text-sm">{title}</p>
    </div>
    <p className="text-xs opacity-90">{impact}</p>
  </div>
);

const RegionImpact: React.FC<{ country: string; countries: string; financed: string; jobs: string; smes: string }> = ({ country, countries, financed, jobs, smes }) => (
  <div className="flex justify-between items-center p-4 bg-[#F3F8FA] rounded-lg">
    <div>
      <p className="font-bold text-[#023D7A]">{country}</p>
      <p className="text-sm text-[#333333]">{countries}</p>
    </div>
    <div className="flex gap-6">
      <div className="text-center">
        <p className="font-bold text-[#00A8A8]">{financed}</p>
        <p className="text-xs text-[#333333]">Financed</p>
      </div>
      <div className="text-center">
        <p className="font-bold text-[#00A8A8]">{jobs}</p>
        <p className="text-xs text-[#333333]">Jobs</p>
      </div>
      <div className="text-center">
        <p className="font-bold text-[#00A8A8]">{smes}</p>
        <p className="text-xs text-[#333333]">SMEs</p>
      </div>
    </div>
  </div>
);

const SectorImpact: React.FC<{ sector: string; percentage: number; description: string; outcomes: string[] }> = ({ sector, percentage, description, outcomes }) => (
  <div className="p-6 bg-[#F3F8FA] rounded-lg">
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-bold text-[#023D7A]">{sector}</h4>
      <span className="text-lg font-bold text-[#00A8A8]">{percentage}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
      <div className="bg-[#00A8A8] h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
    </div>
    <p className="text-sm text-[#333333] mb-4">{description}</p>
    <ul className="space-y-1">
      {outcomes.map((outcome, idx) => (
        <li key={idx} className="text-sm text-[#333333]">✓ {outcome}</li>
      ))}
    </ul>
  </div>
);

export default ImpactReport;
