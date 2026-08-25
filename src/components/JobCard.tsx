import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  DollarSign, 
  Calendar, 
  Flag, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Check, 
  Layers
} from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
  onViewDetails: (job: Job) => void;
  onReport: (job: Job) => void;
  isApplying?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onApply,
  onViewDetails,
  onReport,
  isApplying = false
}) => {
  const [copied, setCopied] = useState(false);

  // Format posted date
  const getPostedAgo = (dateStr: string) => {
    try {
      const diffDays = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 3600 * 24));
      if (diffDays <= 0) return 'Today';
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 30) return `${diffDays} days ago`;
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  // Format deadline
  const getDeadlineStatus = (deadlineStr?: string | null) => {
    if (!deadlineStr) return null;
    try {
      const deadline = new Date(deadlineStr);
      const now = new Date();
      const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 3600 * 24));
      if (diffDays < 0) return { label: 'Expired', isUrgent: true };
      if (diffDays === 0) return { label: 'Closes Today', isUrgent: true };
      if (diffDays <= 3) return { label: `Closes in ${diffDays}d`, isUrgent: true };
      return { label: `Deadline: ${deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, isUrgent: false };
    } catch {
      return null;
    }
  };

  const deadlineStatus = getDeadlineStatus(job.deadline);

  // Source styling
  const getSourceBadgeStyle = (sourceName: string) => {
    const src = sourceName.toLowerCase();
    if (src.includes('linkedin')) return 'bg-[#0a66c2]/10 text-[#0a66c2] border-[#0a66c2]/20';
    if (src.includes('naukri')) return 'bg-[#275df5]/10 text-[#275df5] border-[#275df5]/20';
    if (src.includes('indeed')) return 'bg-[#2164f3]/10 text-[#2164f3] border-[#2164f3]/20';
    if (src.includes('wellfound')) return 'bg-[#ea4335]/10 text-[#ea4335] border-[#ea4335]/20';
    if (src.includes('internshala')) return 'bg-[#1295d8]/10 text-[#1295d8] border-[#1295d8]/20';
    if (src.includes('foundit')) return 'bg-[#6c25ff]/10 text-[#6c25ff] border-[#6c25ff]/20';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/jobs/${job.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id={`job-card-${job.id}`}
      className={`group relative bg-white rounded-xl border transition-all duration-200 hover:shadow-md hover:border-amber-300 flex flex-col justify-between p-5 ${
        job.is_featured 
          ? 'border-amber-300 bg-gradient-to-br from-amber-50/50 via-white to-red-50/20 shadow-sm ring-1 ring-amber-400/20' 
          : 'border-slate-200 shadow-xs'
      }`}
    >
      <div>
        {/* Top Header: Source, Share & Report */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center flex-wrap gap-1.5">
            {/* Verified Source Badge */}
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getSourceBadgeStyle(job.source_platform)}`}>
              <ShieldCheck className="w-3 h-3" />
              <span>Via {job.source_platform}</span>
            </span>
          </div>

          {/* Card Actions: Share & Report */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              id={`btn-share-job-${job.id}`}
              onClick={handleShare}
              title="Copy job link"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
            <button
              id={`btn-report-job-${job.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onReport(job);
              }}
              title="Report broken or expired link"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Company Info & Job Title */}
        <div className="flex items-start gap-3 mb-3">
          {job.company_logo_url ? (
            <img
              src={job.company_logo_url}
              alt={job.company_name}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-50"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-11 h-11 rounded-lg bg-amber-50 text-red-700 font-extrabold flex items-center justify-center text-sm border border-amber-200 shrink-0">
              {job.company_name.substring(0, 2).toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 
              onClick={() => onViewDetails(job)}
              className="text-base font-bold text-slate-900 leading-snug cursor-pointer group-hover:text-red-600 transition-colors line-clamp-2"
            >
              {job.title}
            </h3>
            <p className="text-xs font-medium text-slate-600 mt-0.5 flex items-center gap-1.5">
              <span className="text-slate-800 font-semibold">{job.company_name}</span>
              {job.category_name && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{job.category_name}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Meta Attributes: Location, Work mode, Experience, Salary */}
        <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-xs text-slate-600 mb-3.5 pt-1">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>

          <div className="flex items-center gap-1.5 truncate">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="capitalize">{job.work_mode} • {job.employment_type.replace('_', ' ')}</span>
          </div>

          <div className="flex items-center gap-1.5 truncate">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.experience}</span>
          </div>

          {job.salary_text ? (
            <div className="flex items-center gap-1.5 truncate font-medium text-slate-900">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate text-emerald-700">{job.salary_text}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-400 italic text-[11px]">
              <span>Salary not disclosed</span>
            </div>
          )}
        </div>

        {/* Skills Tags */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {job.skills.slice(0, 4).map((skill, idx) => (
              <span 
                key={idx} 
                className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-[10px] text-slate-400 font-medium self-center px-1">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Timestamps, Details & Apply Now CTA */}
      <div className="pt-3 border-t border-slate-100 mt-auto">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2.5">
          <span>Posted {getPostedAgo(job.posted_date)}</span>
          
          {deadlineStatus && (
            <span className={`font-medium ${deadlineStatus.isUrgent ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
              {deadlineStatus.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            id={`btn-view-details-${job.id}`}
            onClick={() => onViewDetails(job)}
            className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 hover:text-red-700 bg-slate-100 hover:bg-amber-50 rounded-lg transition-colors text-center border border-transparent hover:border-amber-200"
          >
            View Details
          </button>

          <button
            id={`btn-apply-now-${job.id}`}
            onClick={() => onApply(job)}
            disabled={isApplying}
            className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all shadow-xs shadow-red-600/30 flex items-center justify-center gap-1.5 active:scale-95 group/btn"
          >
            <span>Apply Now</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-300 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <p className="text-[10px] text-slate-400 text-center mt-2">
          Application handled by {job.source_platform}
        </p>
      </div>
    </div>
  );
};
