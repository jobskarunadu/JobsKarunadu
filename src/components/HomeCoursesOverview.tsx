import React from 'react';
import { BookOpen, ArrowRight, Sparkles, Terminal, Code, Target, Award } from 'lucide-react';

interface HomeCoursesOverviewProps {
  onExplore: () => void;
}

const COURSE_TRACKS = [
  {
    icon: <Terminal className="w-4 h-4 text-red-600" />,
    title: 'Full Stack Web & Cloud Architect',
    description: 'Modern TypeScript, React, Next.js, Node.js microservices, Docker, and AWS deployment roadmaps.'
  },
  {
    icon: <Code className="w-4 h-4 text-red-600" />,
    title: 'DSA & Tech Interview Bootcamps',
    description: 'Pattern-based Data Structures, Algorithmic thinking, and mock interviews for product companies.'
  },
  {
    icon: <Target className="w-4 h-4 text-red-600" />,
    title: 'Practical AI & Machine Learning',
    description: 'Applied Python, LLM app development, model fine-tuning, and production AI pipelines.'
  },
  {
    icon: <Award className="w-4 h-4 text-red-600" />,
    title: 'Career Launch & Resume Mentorship',
    description: 'Portfolio building, ATS-friendly resume tailoring, and direct networking with Karnataka recruiters.'
  }
];

export const HomeCoursesOverview: React.FC<HomeCoursesOverviewProps> = ({
  onExplore
}) => {
  return (
    <section id="home-courses-section" className="py-14 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Explore Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-bold mb-1.5 border border-amber-200">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              Skill Development &amp; Learning
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Courses &amp; Upskilling Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              We are preparing industry-backed skill curriculums, interview masterclasses, and hands-on coding tracks engineered to help you crack Karnataka’s most competitive tech roles.
            </p>
          </div>

          {/* Small Explore Button */}
          <button
            id="btn-explore-courses"
            onClick={onExplore}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-red-700 hover:text-red-800 text-xs font-bold rounded-lg border border-amber-300/80 transition-all shadow-xs shrink-0 self-start sm:self-auto active:scale-95"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COURSE_TRACKS.map((track, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-amber-100/70 border border-amber-200 flex items-center justify-center mb-3 shadow-xs">
                  {track.icon}
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">
                  {track.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {track.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-amber-900">
                <span className="bg-amber-100 px-2 py-0.5 rounded text-[10px] text-amber-950 font-bold">Upcoming</span>
                <span className="text-red-700">Curriculum Ready</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
