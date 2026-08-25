import React from 'react';
import { BookOpen, Sparkles, Compass, CheckCircle2, Bell, Clock, GraduationCap, ArrowRight } from 'lucide-react';

interface CoursesPageProps {
  onNavigateJobs: () => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onNavigateJobs }) => {
  return (
    <div id="courses-page-container" className="min-h-[80vh] flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Top Badges */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300 text-xs font-bold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="uppercase tracking-wider">JobsKarunadu Academy</span>
        </div>

        {/* Coming Soon Headline */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Courses &amp; Upskilling
          </h1>
          <div className="inline-block px-4 py-1.5 rounded-xl bg-red-600 text-amber-300 font-extrabold text-lg tracking-wide shadow-md">
            COMING SOON
          </div>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed pt-2">
            We are curating job-ready learning roadmaps, technical interview masterclasses, and hands-on coding tracks tailored for Karnataka’s tech aspirants and graduates.
          </p>
        </div>

        {/* What to Expect Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
          <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-red-600 border border-amber-200 flex items-center justify-center mb-2.5">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Job-Ready Tracks</h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">Full-Stack, Python, Cloud, and Data Science with real portfolio projects.</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-red-600 border border-amber-200 flex items-center justify-center mb-2.5">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Interview Prep</h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">Data Structures, Algorithms, System Design, and Karnataka MNC interview guides.</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-red-600 border border-amber-200 flex items-center justify-center mb-2.5">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Verified Certifications</h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">Recognized course completion credentials to stand out to verified recruiters.</p>
          </div>
        </div>

        {/* Back to Jobs Button */}
        <div className="pt-2">
          <button
            onClick={onNavigateJobs}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <span>Explore Current Jobs &amp; Internships</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

      </div>
    </div>
  );
};
