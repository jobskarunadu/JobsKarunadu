import React, { useState } from 'react';
import { ShieldAlert, X, ExternalLink, CheckCircle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div id="disclaimer-banner" className="bg-gradient-to-r from-amber-500/15 via-red-500/10 to-amber-500/15 border-b border-amber-200/80 text-amber-950 px-4 py-2.5 text-xs sm:text-sm">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1">
          <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
            !
          </div>
          <p className="leading-snug">
            <span className="font-semibold text-red-900">Direct Application Link Notice:</span>{' '}
            JobsKarunadu publishes verified job openings and redirects applicants directly to original external application pages (LinkedIn, Naukri, Indeed, Company career portals). We do not collect resumes, charge fees, or make hiring decisions. Always verify employer credentials before applying.
          </p>
        </div>
        <button
          id="btn-dismiss-disclaimer"
          onClick={() => setDismissed(true)}
          className="text-amber-800 hover:text-red-900 p-1 rounded hover:bg-amber-100/80 transition-colors shrink-0"
          title="Dismiss notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
