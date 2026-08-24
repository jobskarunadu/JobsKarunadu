import React from 'react';
import { Briefcase, ShieldCheck, ExternalLink, Lock, CheckCircle2, Heart, MapPin } from 'lucide-react';
import { Category, JobSource } from '../types';

interface FooterProps {
  categories: Category[];
  sources: JobSource[];
  onSelectCategory: (categoryId: string) => void;
  onOpenAdminLogin: () => void;
  onNavigate: (tab: 'home' | 'jobs' | 'internship' | 'freelancing' | 'courses' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({
  categories,
  sources,
  onSelectCategory,
  onOpenAdminLogin,
  onNavigate
}) => {
  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      
      {/* Top Disclaimer Band */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
              !
            </div>
            <div className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
              <span className="font-semibold text-amber-400">Direct Application Link Notice:</span>{' '}
              JobsKarunadu publishes verified external job openings and redirects applicants directly to original application pages. We do NOT collect resumes, charge application fees, host interviews, or make employment decisions. Always verify the employer and application details directly on the target platform before applying.
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Platform Overview */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-400/50 flex flex-col shrink-0">
                <div className="h-1/2 bg-amber-400" />
                <div className="h-1/2 bg-red-600 flex items-center justify-center text-white">
                  <Briefcase className="w-2.5 h-2.5" />
                </div>
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                Jobs<span className="text-red-500">Karunadu</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Curated verified career opportunities across Karnataka and beyond. Direct links to official company portals and verified hiring channels.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 text-amber-300 text-[11px] font-medium border border-amber-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                Hand-Verified Direct Links
              </span>
            </div>
          </div>

          {/* Col 2: Job Categories */}
          <div>
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3">
              Top Categories
            </h4>
            <ul className="space-y-1.5">
              {categories.slice(0, 6).map(c => (
                <li key={c.id}>
                  <button
                    onClick={() => onSelectCategory(c.id)}
                    className="hover:text-amber-300 transition-colors text-left"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Verified Sources */}
          <div>
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3">
              Verified Sources
            </h4>
            <ul className="space-y-1.5">
              {sources.map(s => (
                <li key={s.id} className="flex items-center gap-1.5">
                  <span className="text-amber-500">•</span>
                  <span>{s.name} ({s.domain})</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Quick Navigation & Admin */}
          <div>
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3">
              Explore &amp; Admin
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('jobs')} className="hover:text-amber-300 transition-colors">
                  Jobs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('internship')} className="hover:text-amber-300 transition-colors">
                  Internships
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('freelancing')} className="hover:text-amber-300 transition-colors">
                  Freelancing Gigs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-amber-300 transition-colors">
                  Course
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} JobsKarunadu. For informational and career enablement purposes.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Direct Apply Links</span>
            <span>•</span>
            <span>Zero Personal Data Collected</span>
            <span>•</span>
            <span>No Account Required</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
