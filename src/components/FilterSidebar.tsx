import React from 'react';
import { Filter, RotateCcw, Check } from 'lucide-react';
import { Category, JobFilterParams, JobSource } from '../types';

interface FilterSidebarProps {
  filters: JobFilterParams;
  categories: Category[];
  sources: JobSource[];
  onFilterChange: (updates: Partial<JobFilterParams>) => void;
  onReset: () => void;
  totalResults: number;
  isFreelancing?: boolean;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  categories,
  sources,
  onFilterChange,
  onReset,
  isFreelancing = false
}) => {
  const isFreelanceMode = isFreelancing || filters.employment_type === 'freelance';

  const isFiltered = Boolean(
    filters.q ||
    (filters.category && filters.category !== 'all') ||
    (!isFreelanceMode && filters.work_mode && filters.work_mode !== 'all') ||
    (!isFreelanceMode && filters.experience && filters.experience !== 'all') ||
    (filters.source && filters.source !== 'all')
  );

  return (
    <aside id="filter-sidebar" className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-red-600" />
          <h2 className="font-bold text-slate-900 text-sm">
            {isFreelanceMode ? 'Filter Freelance Gigs' : 'Filter Openings'}
          </h2>
        </div>
        
        {isFiltered && (
          <button
            id="btn-reset-filters"
            onClick={onReset}
            className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            Reset all
          </button>
        )}
      </div>

      <div className="space-y-6 pt-4">
        
        {/* Work Mode - Hidden in Freelancing mode because almost all freelancing is remote */}
        {!isFreelanceMode && (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Work Mode</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: 'All Modes', value: 'all' },
                { label: 'Remote', value: 'remote' },
                { label: 'Hybrid', value: 'hybrid' },
                { label: 'On-site', value: 'onsite' }
              ].map(opt => (
                <button
                  key={opt.value}
                  id={`filter-workmode-${opt.value}`}
                  onClick={() => onFilterChange({ work_mode: opt.value })}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-medium text-center border transition-colors ${
                    (filters.work_mode || 'all') === opt.value
                      ? 'bg-red-600 text-white border-red-600 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-red-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Experience Level - Hidden in Freelancing mode */}
        {!isFreelanceMode && (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Experience</label>
            <div className="space-y-1">
              {[
                { label: 'All Experience Levels', value: 'all' },
                { label: 'Fresher (0 - 1 year)', value: 'fresher' },
                { label: '1 - 3 years', value: '1-3' },
                { label: '3 - 5 years', value: '3-5' },
                { label: '5+ years (Senior)', value: '5+' }
              ].map(opt => (
                <button
                  key={opt.value}
                  id={`filter-exp-${opt.value}`}
                  onClick={() => onFilterChange({ experience: opt.value })}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors ${
                    (filters.experience || 'all') === opt.value
                      ? 'bg-amber-50 text-red-700 font-bold border border-amber-200/80'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{opt.label}</span>
                  {(filters.experience || 'all') === opt.value && <Check className="w-3.5 h-3.5 text-red-600" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Job Category */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            <button
              id="filter-cat-all"
              onClick={() => onFilterChange({ category: 'all' })}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                !filters.category || filters.category === 'all'
                  ? 'bg-amber-50 text-red-700 font-bold border border-amber-200/80'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>All Categories</span>
              {(!filters.category || filters.category === 'all') && <Check className="w-3.5 h-3.5 text-red-600" />}
            </button>
            
            {categories.map(cat => (
              <button
                key={cat.id}
                id={`filter-cat-${cat.id}`}
                onClick={() => onFilterChange({ category: cat.id })}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  filters.category === cat.id
                    ? 'bg-amber-50 text-red-700 font-bold border border-amber-200/80'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="truncate pr-2">{cat.name}</span>
                <span className="text-[10px] text-slate-400 font-normal shrink-0">
                  {cat.job_count || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Verified Source Platform */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {isFreelanceMode ? 'Freelancing Platform' : 'Source Platform'}
          </label>
          <div className="space-y-1">
            <button
              id="filter-source-all"
              onClick={() => onFilterChange({ source: 'all' })}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                !filters.source || filters.source === 'all'
                  ? 'bg-amber-50 text-red-700 font-bold border border-amber-200/80'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{isFreelanceMode ? 'All Freelance Platforms' : 'All Verified Sources'}</span>
              {(!filters.source || filters.source === 'all') && <Check className="w-3.5 h-3.5 text-red-600" />}
            </button>
            {sources.map(src => (
              <button
                key={src.id}
                id={`filter-source-${src.id}`}
                onClick={() => onFilterChange({ source: src.name })}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  filters.source === src.name
                    ? 'bg-amber-50 text-red-700 font-bold border border-amber-200/80'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="truncate">{src.name}</span>
                {filters.source === src.name && <Check className="w-3.5 h-3.5 text-red-600" />}
              </button>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
};
