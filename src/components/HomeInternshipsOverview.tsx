import React from 'react';
import { GraduationCap, ArrowRight, Award, ShieldCheck, DollarSign, Briefcase } from 'lucide-react';

interface HomeInternshipsOverviewProps {
  onExplore: () => void;
}

const INTERNSHIP_BENEFITS = [
  {
    icon: <DollarSign className="w-4 h-4 text-red-600" />,
    title: 'Verified Stipends',
    description: 'Directly track monthly stipends and compensation ranges from ₹15k to ₹50k/month without hidden clauses.'
  },
  {
    icon: <Award className="w-4 h-4 text-red-600" />,
    title: 'Pre-Placement Offers (PPOs)',
    description: 'Curated programs offering clear pathways to full-time engineering and product roles upon completion.'
  },
  {
    icon: <ShieldCheck className="w-4 h-4 text-red-600" />,
    title: 'Zero Application Fees',
    description: 'We strictly index genuine company portals and top tier boards. No paid registrations or training scams.'
  },
  {
    icon: <Briefcase className="w-4 h-4 text-red-600" />,
    title: 'Diverse Work Modes',
    description: 'Hybrid roles in Bengaluru, Mysuru, and Mangaluru, as well as 100% remote student opportunities.'
  }
];

export const HomeInternshipsOverview: React.FC<HomeInternshipsOverviewProps> = ({
  onExplore
}) => {
  return (
    <section id="home-internships-section" className="py-14 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Explore Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-bold mb-1.5 border border-amber-200">
              <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
              Early Career &amp; Students
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Internships
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              We aggregate and verify early-career internship opportunities from high-growth tech startups, unicorns, and multinational corporations across Karnataka.
            </p>
          </div>

          {/* Small Explore Button */}
          <button
            id="btn-explore-internships"
            onClick={onExplore}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-red-700 hover:text-red-800 text-xs font-bold rounded-lg border border-amber-300/80 transition-all shadow-xs shrink-0 self-start sm:self-auto active:scale-95"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Benefits Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INTERNSHIP_BENEFITS.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
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
