import React, { useState } from 'react';
import { Search, MapPin, Sparkles, Globe, GraduationCap, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string, location?: string) => void;
  onQuickFilter: (filterKey: string, value: any) => void;
  stats?: {
    total_active_jobs: number;
    remote_jobs: number;
    fresher_jobs: number;
    total_applications_routed: number;
    verified_platforms: number;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onQuickFilter,
  stats
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, locationTerm);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Subtle background ambient mesh with warm yellow & red cultural glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />
      
      {/* Yellow / Red Ambient Glows */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-16 right-1/4 translate-x-1/2 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center">
        
        {/* Primary Headline with Yellow & White accent */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Jobs for <span className="text-amber-400 font-black">Karunadu</span>
        </h1>

        {/* Subhead with clear value proposition */}
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Hand-verified openings from LinkedIn, Naukri, Indeed, Wellfound, Internshala, and leading company career portals. Click Apply and jump straight to the source.
        </p>

        {/* Search Box Form */}
        <form 
          id="hero-search-form"
          onSubmit={handleSubmit} 
          className="mt-8 max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-2xl shadow-black/50 border border-slate-200 text-slate-900 flex flex-col sm:flex-row gap-2"
        >
          <div className="flex-1 flex items-center px-3.5 py-2 sm:py-0 border-b sm:border-b-0 sm:border-r border-slate-200">
            <Search className="w-5 h-5 text-slate-400 shrink-0 mr-2.5" />
            <input
              id="hero-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Job title, skills (React, Java, Python), or company..."
              className="w-full bg-transparent text-sm focus:outline-none text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="sm:w-60 flex items-center px-3.5 py-2 sm:py-0">
            <MapPin className="w-5 h-5 text-red-500 shrink-0 mr-2.5" />
            <input
              id="hero-location-input"
              type="text"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
              placeholder="City (Bengaluru, Mysuru, Remote...)"
              className="w-full bg-transparent text-sm focus:outline-none text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <button
            id="hero-search-btn"
            type="submit"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-md shadow-red-600/30 flex items-center justify-center gap-2 shrink-0 active:scale-95 group"
          >
            <span>Search Jobs</span>
            <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        {/* Quick Filter Chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
          <button
            id="chip-bengaluru"
            onClick={() => onSearch('', 'Bengaluru')}
            className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-amber-500/30 text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            Bengaluru Jobs
          </button>

          <button
            id="chip-remote"
            onClick={() => onQuickFilter('is_remote', true)}
            className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            Remote Jobs
          </button>

          <button
            id="chip-fresher"
            onClick={() => onQuickFilter('is_fresher', true)}
            className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            Fresher / 0-1 Yrs
          </button>

          <button
            id="chip-internship"
            onClick={() => onQuickFilter('employment_type', 'internship')}
            className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Internships
          </button>

          <button
            id="chip-ai-ml"
            onClick={() => onQuickFilter('category', 'ai-ml')}
            className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            AI & Machine Learning
          </button>
        </div>

        {/* Live Key Stats */}
        <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
              {stats ? `${stats.total_active_jobs}+` : '100+'}
            </div>
            <div className="text-xs text-slate-400 mt-1">Verified Active Openings</div>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-red-400">
              {stats ? `${stats.verified_platforms}+` : '7+'}
            </div>
            <div className="text-xs text-slate-400 mt-1">Direct Platform Sources</div>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">
              {stats ? `${stats.remote_jobs}` : '40+'}
            </div>
            <div className="text-xs text-slate-400 mt-1">Remote Positions</div>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {stats ? `${stats.total_applications_routed}+` : '500+'}
            </div>
            <div className="text-xs text-slate-400 mt-1">Direct Applies Routed</div>
          </div>
        </div>

      </div>
    </section>
  );
};
