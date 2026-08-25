import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Clock, 
  Calendar, 
  ExternalLink, 
  ShieldCheck, 
  Flag, 
  Share2, 
  Check, 
  Globe, 
  ArrowLeft,
  DollarSign,
  Layers,
  Sparkles
} from 'lucide-react';
import { Job } from '../types';

interface SingleJobPageProps {
  job: Job;
  onBackToDirectory: () => void;
  onApply: (job: Job) => void;
  onReport: (job: Job) => void;
}

export const SingleJobPage: React.FC<SingleJobPageProps> = ({
  job,
  onBackToDirectory,
  onApply,
  onReport
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/jobs/${job.slug || job.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const formattedPostedDate = new Date(job.posted_date || job.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedDeadline = job.deadline ? new Date(job.deadline).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : null;

  const isInternship = job.employment_type === 'internship';
  const isFreelance = job.employment_type === 'freelance';

  const typeLabel = isInternship ? 'Internship' : isFreelance ? 'Freelance Project' : 'Job';

  return (
    <div id="single-job-details-page" className="min-h-screen bg-slate-100/60 pb-20">
      
      {/* Top Breadcrumb & Action Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <button
            id="btn-back-to-all-jobs"
            onClick={onBackToDirectory}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-red-700 bg-slate-100 hover:bg-amber-50 px-3 py-2 rounded-lg border border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All {isInternship ? 'Internships' : isFreelance ? 'Projects' : 'Jobs'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              id="btn-share-direct-job"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              id="btn-report-direct-job"
              onClick={() => onReport(job)}
              title="Report broken or expired link"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-lg transition-colors"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* Main Job Detail Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Header Area */}
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-amber-50/20">
            
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              
              <div className="flex items-start gap-4 sm:gap-5">
                {job.company_logo_url ? (
                  <img
                    src={job.company_logo_url}
                    alt={job.company_name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shrink-0 bg-white shadow-xs"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-50 text-red-700 font-black flex items-center justify-center text-xl sm:text-2xl border border-amber-200 shrink-0 shadow-xs">
                    {job.company_name.substring(0, 2).toUpperCase()}
                  </div>
                )}

                <div>
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-red-700 border border-amber-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                      Verified via {job.source_platform}
                    </span>

                    {job.is_fresher && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {isInternship ? 'Student / Fresher Friendly' : 'Fresher Friendly'}
                      </span>
                    )}

                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {typeLabel}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    {job.title}
                  </h1>

                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                    <span className="font-bold text-slate-800 text-base">{job.company_name}</span>
                    {job.company_website && (
                      <a
                        href={job.company_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 hover:underline text-xs"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Primary Apply Button */}
              <div className="shrink-0 flex flex-col items-stretch sm:items-end gap-2">
                <button
                  id="btn-apply-direct-job"
                  onClick={() => onApply(job)}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 active:scale-95 text-center"
                >
                  <span>Apply on {job.source_platform}</span>
                  <ExternalLink className="w-4 h-4 text-amber-300" />
                </button>
                <span className="text-[11px] text-slate-400 text-center sm:text-right">
                  Direct official portal redirect
                </span>
              </div>

            </div>

            {/* Quick Key Facts Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-xs">
              
              <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Location</div>
                  <div className="font-bold text-slate-900 truncate">{job.location}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <Briefcase className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Work Mode</div>
                  <div className="font-bold text-slate-900 capitalize">{job.work_mode.replace('_', ' ')}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">
                    {isInternship ? 'Stipend' : isFreelance ? 'Budget' : 'Compensation'}
                  </div>
                  <div className="font-bold text-emerald-700 truncate">
                    {job.salary_text || (isInternship ? 'Stipend Disclosed' : 'Undisclosed')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Experience</div>
                  <div className="font-bold text-slate-900 truncate">{job.experience}</div>
                </div>
              </div>

            </div>

          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Skills & Technologies */}
            {job.skills && job.skills.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Required Skills &amp; Competencies</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description & Responsibilities */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>{isInternship ? 'Internship Overview & Details' : isFreelance ? 'Project Scope & Requirements' : 'Job Description & Responsibilities'}</span>
              </h2>
              
              <div className="prose prose-sm prose-slate max-w-none text-slate-700 bg-slate-50/50 p-5 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-line font-sans text-xs sm:text-sm">
                {job.description || 'No detailed description provided on original post. Please refer to the verified source portal.'}
              </div>
            </div>

            {/* Verification Metadata Box */}
            <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Direct Portal Application Guarantee</div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    JobsKarunadu redirects directly to the hiring employer or platform ({job.source_platform}). We do not store resumes or charge candidates.
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 shrink-0 space-y-1 sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-amber-200/50">
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Posted: <strong>{formattedPostedDate}</strong></span>
                </div>
                {formattedDeadline && (
                  <div className="text-red-700 font-bold">
                    Deadline: {formattedDeadline}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Call to Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <button
                onClick={onBackToDirectory}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Explore more opportunities in Karnataka</span>
              </button>

              <button
                onClick={() => onApply(job)}
                className="w-full sm:w-auto px-7 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Continue Application on {job.source_platform}</span>
                <ExternalLink className="w-4 h-4 text-amber-300" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
