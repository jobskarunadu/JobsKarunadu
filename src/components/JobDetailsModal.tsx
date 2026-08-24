import React, { useState } from 'react';
import { 
  X, 
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
  AlertCircle,
  Globe,
  Sparkles,
  Info
} from 'lucide-react';
import { Job } from '../types';

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
  onApply: (job: Job) => void;
  onReport: (job: Job) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  onClose,
  onApply,
  onReport
}) => {
  const [copied, setCopied] = useState(false);

  if (!job) return null;

  const handleShare = () => {
    const url = `${window.location.origin}/jobs/${job.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

  return (
    <div 
      id="job-details-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="job-details-modal-container"
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {job.company_logo_url ? (
              <img
                src={job.company_logo_url}
                alt={job.company_name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0 bg-white shadow-xs"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-amber-50 text-red-700 font-extrabold flex items-center justify-center text-lg border border-amber-200 shrink-0 shadow-xs">
                {job.company_name.substring(0, 2).toUpperCase()}
              </div>
            )}

            <div>
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-red-700 border border-amber-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                  Verified via {job.source_platform}
                </span>

                {job.is_featured && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-red-600" />
                    Featured
                  </span>
                )}

                {job.is_fresher && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Fresher Friendly
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {job.title}
              </h1>

              <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">{job.company_name}</span>
                {job.company_website && (
                  <a
                    href={job.company_website}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-xs text-red-600 hover:underline flex items-center gap-0.5"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {job.category_name && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{job.category_name}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Close & Share buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id="btn-modal-share"
              onClick={handleShare}
              title="Share job link"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              id="btn-modal-close"
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Key Overview Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Location</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{job.location}</span>
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Work Mode & Type</span>
              <span className="font-semibold text-slate-800 capitalize flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{job.work_mode} • {job.employment_type.replace('_', ' ')}</span>
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Experience</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{job.experience}</span>
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400 block mb-0.5">Offered Compensation</span>
              <span className="font-semibold text-emerald-700 block leading-snug break-words">
                {job.salary_text || 'Not Disclosed'}
              </span>
            </div>
          </div>

          {/* Key Skills */}
          {job.skills && job.skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Required Skills & Technologies</h2>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-lg border border-slate-200/60">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Structured Job Description */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Role Overview & Responsibilities</h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white rounded-lg">
              {job.description}
            </div>
          </div>

          {/* Dates & Source Platform Details */}
          <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-500">
            <div>
              <span className="font-medium text-slate-700">Listing Posted: </span>
              <span>{formattedPostedDate}</span>
            </div>
            {formattedDeadline && (
              <div>
                <span className="font-medium text-slate-700">Application Deadline: </span>
                <span className="text-slate-900 font-semibold">{formattedDeadline}</span>
              </div>
            )}
            <div>
              <span className="font-medium text-slate-700">Verified Platform Source: </span>
              <span className="text-red-600 font-semibold">{job.source_platform}</span>
            </div>
            <div>
              <span className="font-medium text-slate-700">Direct Application Clicks: </span>
              <span>{job.apply_clicks} applicants routed</span>
            </div>
          </div>

          {/* Clear Direct Link Notice */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-950 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-red-900">Application handled by original job source.</span>{' '}
              Clicking &quot;Apply on {job.source_platform}&quot; will open the verified official job posting directly. We do not charge fees, collect resumes, or guarantee hiring.
            </div>
          </div>

        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <button
            id="btn-report-job-details"
            onClick={() => onReport(job)}
            className="text-xs text-slate-500 hover:text-red-600 font-medium flex items-center gap-1.5 transition-colors self-start sm:self-center"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report broken / expired link</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-xl transition-colors"
            >
              Back to listings
            </button>

            <button
              id={`btn-modal-apply-${job.id}`}
              onClick={() => onApply(job)}
              className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-600/30 transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              <span>Apply on {job.source_platform}</span>
              <ExternalLink className="w-4 h-4 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
