import React from 'react';
import { Laptop, ArrowRight, DollarSign, Globe2, ShieldCheck, Zap } from 'lucide-react';

interface HomeFreelancingOverviewProps {
  onExplore: () => void;
}

const FREELANCE_HIGHLIGHTS = [
  {
    icon: <Globe2 className="w-4 h-4 text-red-600" />,
    title: '100% Remote Global Clients',
    description: 'Work directly from Bengaluru, Mysuru, or anywhere in Karnataka with US, European, and Indian clients.'
  },
  {
    icon: <DollarSign className="w-4 h-4 text-red-600" />,
    title: 'Direct Platform Contracts',
    description: 'Verified freelance gigs and fixed-price milestones hosted securely on Upwork, Contra, Fiverr Pro, and Toptal.'
  },
  {
    icon: <Zap className="w-4 h-4 text-red-600" />,
    title: 'High-Demand Niches',
    description: 'Full-stack Next.js MVPs, Figma design systems, AI scrapers, backend microservices, and SEO content.'
  },
  {
    icon: <ShieldCheck className="w-4 h-4 text-red-600" />,
    title: 'Escrow & Milestone Safe',
    description: 'Zero listing fees on JobsKarunadu. Direct links to escrow-protected job posts on authentic platforms.'
  }
];

export const HomeFreelancingOverview: React.FC<HomeFreelancingOverviewProps> = ({
  onExplore
}) => {
  return (
    <section id="home-freelancing-section" className="py-14 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Explore Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-bold mb-1.5 border border-amber-200">
              <Laptop className="w-3.5 h-3.5 text-amber-600" />
              Freelance &amp; Remote Contracts
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Freelancing &amp; High-Value Gigs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Find verified freelance opportunities, project-based contracts, and remote client gigs across leading platforms like Upwork, Fiverr, Contra, Toptal, and Freelancer.
            </p>
          </div>

          {/* Explore Button */}
          <button
            id="btn-explore-freelancing"
            onClick={onExplore}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-red-700 hover:text-red-800 text-xs font-bold rounded-lg border border-amber-300/80 transition-all shadow-xs shrink-0 self-start sm:self-auto active:scale-95"
          >
            <span>Explore Gigs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Highlight Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FREELANCE_HIGHLIGHTS.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-amber-100/70 border border-amber-200 flex items-center justify-center mb-3 shadow-xs">
                  {item.icon}
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
