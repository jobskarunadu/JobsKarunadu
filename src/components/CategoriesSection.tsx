import React from 'react';
import { 
  Code2, 
  Cpu, 
  BarChart3, 
  Database, 
  Globe, 
  Smartphone, 
  CheckSquare, 
  ShieldCheck, 
  Palette, 
  TrendingUp, 
  DollarSign, 
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { Category } from '../types';

interface CategoriesSectionProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  CheckSquare: <CheckSquare className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  DollarSign: <DollarSign className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />
};

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  onSelectCategory
}) => {
  return (
    <section id="categories-section" className="py-12 bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
              Explore Fields
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Popular Job Categories
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Browse verified openings across Karnataka and beyond categorized by specialization and tech stack.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const icon = ICON_MAP[cat.icon_name] || <Briefcase className="w-5 h-5" />;
            return (
              <div
                key={cat.id}
                id={`cat-card-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className="group p-4 bg-white rounded-xl border border-slate-200/80 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-red-700 border border-amber-200/60 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-amber-300 group-hover:border-red-600 transition-all shadow-xs">
                    {icon}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-red-600 transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium text-slate-700">
                    {cat.job_count !== undefined ? `${cat.job_count} jobs` : 'View jobs'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-slate-400 group-hover:text-red-600" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
