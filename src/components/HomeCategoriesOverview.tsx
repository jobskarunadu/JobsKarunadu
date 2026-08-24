import React from 'react';
import { 
  Code2, 
  Cpu, 
  BarChart3, 
  Database, 
  Globe, 
  Smartphone, 
  ShieldCheck, 
  Palette, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Category } from '../types';

interface HomeCategoriesOverviewProps {
  categories: Category[];
  onExplore: () => void;
  onSelectCategory: (categoryId: string) => void;
}

const CATEGORY_HIGHLIGHTS = [
  {
    title: 'Web & Full Stack Development',
    description: 'Frontend (React, Vue, Next.js), Backend (Node.js, Java, Python), REST & GraphQL APIs.',
    icon: <Code2 className="w-5 h-5 text-red-600" />,
    badge: 'High Demand'
  },
  {
    title: 'AI, Data & Machine Learning',
    description: 'Generative AI engineering, PyTorch, Data Analytics, BI dashboards, and ML pipeline design.',
    icon: <Cpu className="w-5 h-5 text-red-600" />,
    badge: 'Trending'
  },
  {
    title: 'Cloud, DevOps & Infrastructure',
    description: 'AWS, Azure, GCP, Kubernetes, CI/CD pipelines, Docker containerization, and Site Reliability.',
    icon: <Globe className="w-5 h-5 text-red-600" />,
    badge: 'Enterprise'
  },
  {
    title: 'UI/UX & Product Design',
    description: 'Wireframing, Figma design systems, usability research, mobile interaction, and visual branding.',
    icon: <Palette className="w-5 h-5 text-red-600" />,
    badge: 'Creative'
  }
];

export const HomeCategoriesOverview: React.FC<HomeCategoriesOverviewProps> = ({
  onExplore
}) => {
  return (
    <section id="home-categories-section" className="py-14 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Explore Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-bold mb-1.5 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Comprehensive Domain Coverage
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Popular Job Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              We curate verified tech and non-tech job opportunities categorized by specialized technical stacks, experience levels, and regional employment hubs across Karnataka.
            </p>
          </div>

          {/* Small Explore Button */}
          <button
            id="btn-explore-categories"
            onClick={onExplore}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-red-700 hover:text-red-800 text-xs font-bold rounded-lg border border-amber-300/80 transition-all shadow-xs shrink-0 self-start sm:self-auto active:scale-95"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Feature Grid Highlighting What We Provide */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORY_HIGHLIGHTS.map((cat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100/70 border border-amber-200 flex items-center justify-center shadow-xs">
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                    {cat.badge}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mb-1.5">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-medium text-slate-600">
                <span>Verified Direct Portals</span>
                <span className="text-red-600 font-bold">100% Genuine</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
