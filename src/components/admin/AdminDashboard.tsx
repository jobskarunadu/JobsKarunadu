import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  Eye, 
  Trash2, 
  Edit, 
  Sparkles, 
  Flag, 
  BarChart2, 
  Layers, 
  RefreshCw, 
  Check, 
  X, 
  ShieldCheck, 
  FileText, 
  ArrowUpDown,
  RotateCcw,
  Globe,
  DollarSign
} from 'lucide-react';
import { AdminStats, Category, Job, JobSource, Report, WorkMode, EmploymentType, JobStatus } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { token, logout, username } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'jobs' | 'categories' | 'reports' | 'analytics'>('jobs');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Jobs state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobSearch, setJobSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [sources, setSources] = useState<JobSource[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [page, setPage] = useState(1);

  // Reports state
  const [reports, setReports] = useState<Report[]>([]);
  const [reportFilter, setReportFilter] = useState('all');

  // Delete Confirmation Modal State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; jobId: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Job Modal state (Add / Edit)
  const [modalMode, setModalMode] = useState<'job' | 'internship' | 'freelance'>('job');
  const [internshipStipendType, setInternshipStipendType] = useState<'stipend' | 'paid' | 'free'>('stipend');
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobFormData, setJobFormData] = useState<Partial<Job>>({
    title: '',
    company_name: '',
    company_logo_url: '',
    company_website: '',
    description: '',
    location: 'Bengaluru, India',
    work_mode: 'remote',
    employment_type: 'full_time',
    experience: '0-1 years (Fresher)',
    is_fresher: true,
    salary_text: '',
    skills: [],
    category_id: 'software-development',
    source_platform: 'LinkedIn',
    original_url: '',
    posted_date: new Date().toISOString().split('T')[0],
    deadline: '',
    status: 'published'
  });
  const [skillsInput, setSkillsInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // New Category state
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Initial load
  useEffect(() => {
    loadAllData();
  }, [token]);

  // Load jobs when filters or page change
  useEffect(() => {
    if (token) {
      loadJobs();
    }
  }, [token, jobSearch, statusFilter, categoryFilter, employmentTypeFilter, page]);

  // Load reports when filter changes
  useEffect(() => {
    if (token && activeTab === 'reports') {
      loadReports();
    }
  }, [token, reportFilter, activeTab]);

  const loadAllData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [statsData, catsData, sourcesData] = await Promise.all([
        api.adminGetStats(token),
        api.getCategories(),
        api.getSources()
      ]);
      setStats(statsData);
      setCategories(catsData);
      setSources(sourcesData);
      await loadJobs();
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadJobs = async () => {
    if (!token) return;
    try {
      const res = await api.adminGetJobs(token, {
        q: jobSearch,
        status: statusFilter,
        category: categoryFilter,
        employment_type: employmentTypeFilter,
        page,
        limit: 20
      });
      setJobs(res.jobs);
      setTotalJobs(res.total);
    } catch (err: any) {
      console.error('Failed to load jobs:', err);
    }
  };

  const loadReports = async () => {
    if (!token) return;
    try {
      const res = await api.adminGetReports(token, reportFilter);
      setReports(res);
    } catch (err: any) {
      console.error('Failed to load reports:', err);
    }
  };

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Open Add Job Modal
  const handleOpenAddJob = () => {
    setModalMode('job');
    setEditingJob(null);
    setJobFormData({
      title: '',
      company_name: '',
      company_logo_url: '',
      company_website: '',
      description: '',
      location: 'Bengaluru, India',
      work_mode: 'remote',
      employment_type: 'full_time',
      experience: '0-1 years (Fresher)',
      is_fresher: true,
      salary_text: '',
      skills: ['React', 'TypeScript'],
      category_id: categories[0]?.id || 'software-development',
      source_platform: 'LinkedIn',
      original_url: '',
      posted_date: new Date().toISOString().split('T')[0],
      deadline: '',
      status: 'published'
    });
    setSkillsInput('React, TypeScript');
    setFormError(null);
    setIsJobModalOpen(true);
  };

  // Open Add Internship Modal
  const handleOpenAddInternship = () => {
    setModalMode('internship');
    setInternshipStipendType('stipend');
    setEditingJob(null);
    setJobFormData({
      title: '',
      company_name: '',
      company_logo_url: '',
      company_website: '',
      description: '',
      location: 'Bengaluru, India',
      work_mode: 'remote',
      employment_type: 'internship',
      experience: '0-1 years (Fresher / Student)',
      is_fresher: true,
      salary_text: '₹15,000 - ₹25,000 / month',
      skills: ['Python', 'Problem Solving'],
      category_id: categories[0]?.id || 'software-development',
      source_platform: 'Internshala',
      original_url: '',
      posted_date: new Date().toISOString().split('T')[0],
      deadline: '',
      status: 'published'
    });
    setSkillsInput('Python, Problem Solving');
    setFormError(null);
    setIsJobModalOpen(true);
  };

  // Open Add Freelancing / Project Modal
  const handleOpenAddProject = () => {
    setModalMode('freelance');
    setEditingJob(null);
    setJobFormData({
      title: '',
      company_name: 'Client / Remote Studio',
      company_logo_url: '',
      company_website: '',
      description: '',
      location: 'Remote (Worldwide)',
      work_mode: 'remote',
      employment_type: 'freelance',
      experience: 'Any Experience Level',
      is_fresher: false,
      salary_text: '$1,500 - $3,000 (Fixed Project Milestone)',
      skills: ['Next.js', 'Tailwind CSS', 'Figma'],
      category_id: categories[0]?.id || 'software-development',
      source_platform: 'Contra',
      original_url: '',
      posted_date: new Date().toISOString().split('T')[0],
      deadline: '',
      status: 'published'
    });
    setSkillsInput('Next.js, Tailwind CSS, Figma');
    setFormError(null);
    setIsJobModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditJob = (job: Job) => {
    if (job.employment_type === 'internship') {
      setModalMode('internship');
      if (job.salary_text?.toLowerCase().includes('unpaid') || job.salary_text?.toLowerCase().includes('free')) {
        setInternshipStipendType('free');
      } else if (job.salary_text?.toLowerCase().includes('paid') || job.salary_text?.toLowerCase().includes('lpa') || job.salary_text?.toLowerCase().includes('yr')) {
        setInternshipStipendType('paid');
      } else {
        setInternshipStipendType('stipend');
      }
    } else if (job.employment_type === 'freelance') {
      setModalMode('freelance');
    } else {
      setModalMode('job');
    }

    setEditingJob(job);
    setJobFormData({
      ...job,
      posted_date: job.posted_date ? new Date(job.posted_date).toISOString().split('T')[0] : '',
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ''
    });
    setSkillsInput(job.skills ? job.skills.join(', ') : '');
    setFormError(null);
    setIsJobModalOpen(true);
  };

  // Submit Add / Edit Job Form
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const itemLabel = modalMode === 'internship' ? 'Internship' : modalMode === 'freelance' ? 'Project / Gig' : 'Job';

    if (!jobFormData.title || !jobFormData.company_name || !jobFormData.original_url) {
      setFormError(`${itemLabel} Title, Company/Client Name, and Original Application URL are required.`);
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    const skillsArray = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // Compute effective salary text for internship if set via type selector
    let effectiveSalary = jobFormData.salary_text;
    if (modalMode === 'internship') {
      if (internshipStipendType === 'free') {
        effectiveSalary = jobFormData.salary_text?.trim() ? `${jobFormData.salary_text} (Unpaid / Certificate)` : 'Unpaid (Certificate & Mentorship)';
      } else if (internshipStipendType === 'stipend' && !jobFormData.salary_text?.trim()) {
        effectiveSalary = 'Stipend Provided (Performance-based)';
      } else if (internshipStipendType === 'paid' && !jobFormData.salary_text?.trim()) {
        effectiveSalary = 'Paid Internship';
      }
    }

    const payload = {
      ...jobFormData,
      salary_text: effectiveSalary,
      employment_type: modalMode === 'internship' ? 'internship' : modalMode === 'freelance' ? 'freelance' : jobFormData.employment_type,
      skills: skillsArray,
      deadline: jobFormData.deadline ? new Date(jobFormData.deadline).toISOString() : null
    };

    try {
      if (editingJob) {
        await api.adminUpdateJob(token, editingJob.id, payload);
        showNotification(`${itemLabel} listing successfully updated!`);
      } else {
        await api.adminCreateJob(token, payload);
        showNotification(`New ${itemLabel.toLowerCase()} successfully published and indexed!`);
      }
      setIsJobModalOpen(false);
      await loadJobs();
      const newStats = await api.adminGetStats(token);
      setStats(newStats);
    } catch (err: any) {
      setFormError(err.message || `Failed to save ${itemLabel.toLowerCase()}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Quick Status Toggle
  const handleUpdateStatus = async (jobId: string, newStatus: JobStatus) => {
    if (!token) return;
    try {
      await api.adminUpdateStatus(token, jobId, newStatus);
      showNotification(`Listing status updated to ${newStatus}`);
      await loadJobs();
      const newStats = await api.adminGetStats(token);
      setStats(newStats);
    } catch (err: any) {
      showNotification(err.message || 'Status update failed');
    }
  };

  // Open Delete Confirmation Dialog
  const handlePromptDelete = (jobId: string, title: string) => {
    setDeleteConfirmation({
      isOpen: true,
      jobId,
      title
    });
  };

  // Execute Delete after confirmation
  const handleConfirmDelete = async () => {
    if (!token || !deleteConfirmation) return;
    setIsDeleting(true);
    try {
      await api.adminDeleteJob(token, deleteConfirmation.jobId);
      showNotification(`"${deleteConfirmation.title}" was permanently deleted.`);
      setDeleteConfirmation(null);
      await loadJobs();
      const newStats = await api.adminGetStats(token);
      setStats(newStats);
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete listing');
    } finally {
      setIsDeleting(false);
    }
  };

  // Update Report Status
  const handleUpdateReport = async (reportId: string, newStatus: Report['status']) => {
    if (!token) return;
    try {
      await api.adminUpdateReport(token, reportId, newStatus);
      showNotification(`Report marked as ${newStatus}`);
      await loadReports();
      const newStats = await api.adminGetStats(token);
      setStats(newStats);
    } catch (err: any) {
      showNotification(err.message || 'Failed to update report');
    }
  };

  // Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newCatName.trim()) return;
    try {
      await api.adminAddCategory(token, newCatName.trim(), newCatDesc.trim());
      setNewCatName('');
      setNewCatDesc('');
      showNotification('New category created!');
      const [catsData, newStats] = await Promise.all([
        api.getCategories(),
        api.adminGetStats(token)
      ]);
      setCategories(catsData);
      setStats(newStats);
    } catch (err: any) {
      alert(err.message || 'Failed to add category');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (catId: string, name: string) => {
    if (!token) return;
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await api.adminDeleteCategory(token, catId);
      showNotification('Category deleted.');
      const [catsData, newStats] = await Promise.all([
        api.getCategories(),
        api.adminGetStats(token)
      ]);
      setCategories(catsData);
      setStats(newStats);
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  return (
    <div id="admin-dashboard-container" className="min-h-screen bg-slate-100/70 pb-20">
      
      {/* Top Banner & Header */}
      <div className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Private Administration
                </span>
                <span className="text-xs text-slate-400">Logged in as {username}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2.5">
                <span className="inline-block w-3 h-3 rounded-full bg-red-600 ring-2 ring-amber-400"></span>
                JobsKarunadu Control Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Curate verified jobs, prevent duplicate listings, monitor click redirection metrics, and review user reports.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-admin-add-job-header"
                onClick={handleOpenAddJob}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/30 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
                <span>Add New Job</span>
              </button>

              <button
                id="btn-admin-add-internship-header"
                onClick={handleOpenAddInternship}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-200" />
                <span>Add New Internship</span>
              </button>

              <button
                id="btn-admin-add-project-header"
                onClick={handleOpenAddProject}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-200" />
                <span>Add New Project</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notification Message */}
      {feedbackMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* KPI Stat Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Listings</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{stats?.total_jobs ?? 0}</span>
            <span className="text-[10px] text-slate-400">All database records</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">Published Active</span>
            <span className="text-2xl font-bold text-emerald-600 mt-1 block">{stats?.published_jobs ?? 0}</span>
            <span className="text-[10px] text-emerald-600 font-medium">Visible to public</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">Drafts</span>
            <span className="text-2xl font-bold text-amber-600 mt-1 block">{stats?.draft_jobs ?? 0}</span>
            <span className="text-[10px] text-slate-400">Pending review</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Expired</span>
            <span className="text-2xl font-bold text-slate-600 mt-1 block">{stats?.expired_jobs ?? 0}</span>
            <span className="text-[10px] text-slate-400">Auto &amp; manually closed</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-indigo-200 bg-indigo-50/20 shadow-xs">
            <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block">Apply Clicks</span>
            <span className="text-2xl font-bold text-indigo-600 mt-1 block">{stats?.total_apply_clicks ?? 0}</span>
            <span className="text-[10px] text-indigo-600 font-medium">Outbound redirects</span>
          </div>

          <div className={`p-4 rounded-xl border shadow-xs ${
            (stats?.pending_reports || 0) > 0 ? 'bg-rose-50 border-rose-300' : 'bg-white border-slate-200'
          }`}>
            <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">Pending Reports</span>
            <span className="text-2xl font-bold text-rose-600 mt-1 block">{stats?.pending_reports ?? 0}</span>
            <span className="text-[10px] text-rose-600 font-medium">Broken / expired flags</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs mb-6 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              id="admin-tab-jobs"
              onClick={() => setActiveTab('jobs')}
              className={`px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'jobs'
                  ? 'border-red-600 text-red-700 bg-amber-50/50 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Jobs Management ({totalJobs})</span>
            </button>

            <button
              id="admin-tab-categories"
              onClick={() => setActiveTab('categories')}
              className={`px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'categories'
                  ? 'border-red-600 text-red-700 bg-amber-50/50 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Categories ({categories.length})</span>
            </button>

            <button
              id="admin-tab-reports"
              onClick={() => setActiveTab('reports')}
              className={`px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'reports'
                  ? 'border-red-600 text-red-700 bg-amber-50/50 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Flag className="w-4 h-4" />
              <span>User Reports</span>
              {(stats?.pending_reports || 0) > 0 && (
                <span className="px-1.5 py-0.5 bg-red-600 text-white rounded-full text-[10px] font-bold">
                  {stats?.pending_reports}
                </span>
              )}
            </button>

            <button
              id="admin-tab-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'border-red-600 text-red-700 bg-amber-50/50 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Click Analytics</span>
            </button>
          </div>

          {/* TAB 1: JOBS MANAGEMENT */}
          {activeTab === 'jobs' && (
            <div className="p-4 sm:p-6">
              
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4">
                <div className="w-full sm:w-80 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="admin-jobs-search-input"
                    type="text"
                    placeholder="Search by title, company, URL..."
                    value={jobSearch}
                    onChange={(e) => {
                      setJobSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
                  <select
                    id="admin-status-filter"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="text-xs p-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="published">Published Only</option>
                    <option value="draft">Drafts Only</option>
                    <option value="expired">Expired Only</option>
                  </select>

                  <select
                    id="admin-category-filter"
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setPage(1);
                    }}
                    className="text-xs p-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    id="admin-employment-type-filter"
                    value={employmentTypeFilter}
                    onChange={(e) => {
                      setEmploymentTypeFilter(e.target.value);
                      setPage(1);
                    }}
                    className="text-xs p-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="all">All Job / Gig Types</option>
                    <option value="full_time">Full-Time</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelancing / Gig</option>
                    <option value="contract">Contract</option>
                    <option value="part_time">Part-Time</option>
                  </select>
                </div>
              </div>

              {/* Jobs Data Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Job Title &amp; Company</th>
                      <th className="p-3.5">Category &amp; Source</th>
                      <th className="p-3.5">Work Mode / Type</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-center">Clicks</th>
                      <th className="p-3.5">Deadline</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          No jobs found matching the search/filter criteria.
                        </td>
                      </tr>
                    ) : (
                      jobs.map(job => (
                        <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                          
                          {/* Title & Company */}
                          <td className="p-3.5 max-w-xs">
                            <div className="font-semibold text-slate-900 truncate">{job.title}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span className="font-medium text-slate-700">{job.company_name}</span>
                              <span>•</span>
                              <span className="truncate">{job.location}</span>
                            </div>
                            <a
                              href={job.original_url}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="text-[10px] text-indigo-600 hover:underline inline-flex items-center gap-0.5 mt-0.5 truncate max-w-[200px]"
                              title={job.original_url}
                            >
                              <span>Original URL</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </td>

                          {/* Category & Source */}
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium block w-fit mb-1">
                              {job.category_name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold">
                              Via {job.source_platform}
                            </span>
                          </td>

                          {/* Work Mode & Type */}
                          <td className="p-3.5 capitalize">
                            <div className="font-medium text-slate-800">{job.work_mode}</div>
                            <div className="text-[11px] text-slate-500">{job.employment_type.replace('_', ' ')}</div>
                          </td>

                          {/* Status Badge & Quick Toggle */}
                          <td className="p-3.5">
                            {job.status === 'published' && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                                Published
                              </span>
                            )}
                            {job.status === 'draft' && (
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold">
                                Draft
                              </span>
                            )}
                            {job.status === 'expired' && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-bold">
                                Expired
                              </span>
                            )}
                          </td>

                          {/* Click Count */}
                          <td className="p-3.5 text-center font-bold text-slate-800">
                            {job.apply_clicks}
                          </td>

                          {/* Deadline */}
                          <td className="p-3.5 text-slate-500 text-[11px]">
                            {job.deadline ? (
                              <span className={new Date(job.deadline) < new Date() ? 'text-rose-600 font-semibold' : ''}>
                                {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">No deadline</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              
                              {/* Quick Publish / Unpublish */}
                              {job.status === 'published' ? (
                                <button
                                  onClick={() => handleUpdateStatus(job.id, 'draft')}
                                  title="Unpublish (Save as Draft)"
                                  className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateStatus(job.id, 'published')}
                                  title="Publish Live"
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Mark Expired */}
                              {job.status !== 'expired' && (
                                <button
                                  onClick={() => handleUpdateStatus(job.id, 'expired')}
                                  title="Mark as Expired"
                                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors text-[10px]"
                                >
                                  Expire
                                </button>
                              )}

                              {/* Edit */}
                              <button
                                onClick={() => handleOpenEditJob(job)}
                                title="Edit full details"
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete with Confirmation */}
                              <button
                                onClick={() => handlePromptDelete(job.id, job.title)}
                                title="Delete listing"
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 2: CATEGORIES MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="p-4 sm:p-6 space-y-6">
              
              {/* Add Category Form */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-xl">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Create New Category</h3>
                <form onSubmit={handleAddCategory} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name</label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g., DevOps / Cloud Architecture"
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Description (Optional)</label>
                    <input
                      type="text"
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      placeholder="e.g., Kubernetes, CI/CD, Terraform, AWS"
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                  >
                    Add Category
                  </button>
                </form>
              </div>

              {/* Categories List Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Category Name</th>
                      <th className="p-3.5">Slug ID</th>
                      <th className="p-3.5">Description</th>
                      <th className="p-3.5 text-center">Active Jobs</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categories.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50/70">
                        <td className="p-3.5 font-bold text-slate-900">{c.name}</td>
                        <td className="p-3.5 text-slate-400 font-mono text-[11px]">{c.slug || c.id}</td>
                        <td className="p-3.5 text-slate-500">{c.description || '-'}</td>
                        <td className="p-3.5 text-center font-bold text-indigo-600">{c.job_count || 0}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteCategory(c.id, c.name)}
                            className="text-xs text-rose-600 hover:underline font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: USER REPORTS INBOX */}
          {activeTab === 'reports' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Filter Reports:</span>
                  <select
                    value={reportFilter}
                    onChange={(e) => setReportFilter(e.target.value)}
                    className="text-xs p-1.5 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="all">All Reports</option>
                    <option value="pending">Pending Only</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="action_taken">Action Taken</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Reported Job</th>
                      <th className="p-3.5">Reason Flag</th>
                      <th className="p-3.5">Comments &amp; Reporter</th>
                      <th className="p-3.5">Submitted</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reports.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          No reports in this view.
                        </td>
                      </tr>
                    ) : (
                      reports.map(r => (
                        <tr key={r.id} className="hover:bg-slate-50/70">
                          <td className="p-3.5 font-semibold text-slate-900 max-w-xs truncate">
                            {r.job_title}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-bold text-[10px] rounded border border-rose-200 uppercase">
                              {r.reason.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600 max-w-sm">
                            <div>{r.details || '<No extra comments>'}</div>
                            {r.reporter_email && (
                              <div className="text-[10px] text-slate-400 mt-0.5">{r.reporter_email}</div>
                            )}
                          </td>
                          <td className="p-3.5 text-slate-400 text-[11px]">
                            {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleUpdateReport(r.id, 'action_taken')}
                                className="text-[10px] px-2 py-1 bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100 font-medium"
                              >
                                Resolved
                              </button>
                              <button
                                onClick={() => handleUpdateReport(r.id, 'dismissed')}
                                className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 font-medium"
                              >
                                Dismiss
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 4: CLICK ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="p-4 sm:p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Source Platform Performance */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    Clicks by Source Platform
                  </h3>
                  <div className="space-y-2.5">
                    {stats?.source_breakdown.map(src => {
                      const percentage = stats.total_apply_clicks > 0 
                        ? Math.round((src.clicks / stats.total_apply_clicks) * 100) 
                        : 0;
                      return (
                        <div key={src.source_name} className="bg-white p-3 rounded-lg border border-slate-200/80">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
                            <span>{src.source_name} ({src.count} listings)</span>
                            <span>{src.clicks} clicks ({percentage}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Listings by Category
                  </h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {stats?.category_breakdown.map(cat => (
                      <div key={cat.category_name} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200/80 text-xs">
                        <span className="font-medium text-slate-800">{cat.category_name}</span>
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{cat.count} listings</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* ADD / EDIT LISTING MODAL */}
      {isJobModalOpen && (
        <div 
          id="admin-job-modal-backdrop"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => setIsJobModalOpen(false)}
        >
          <div 
            id="admin-job-modal-container"
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-base">
                  {editingJob 
                    ? `Edit ${modalMode === 'internship' ? 'Internship' : modalMode === 'freelance' ? 'Project / Gig' : 'Job'} Listing` 
                    : modalMode === 'internship'
                    ? 'Publish New Verified Internship Link'
                    : modalMode === 'freelance'
                    ? 'Publish New Freelance Project / Gig Link'
                    : 'Publish New Verified Job Link'
                  }
                </h2>
                <p className="text-xs text-slate-500">
                  Direct external links only. Ensure the original application URL is verified and active.
                </p>
              </div>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveJob} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title & Company / Client */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {modalMode === 'internship' ? 'Internship Title' : modalMode === 'freelance' ? 'Project / Gig Title' : 'Job Title'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-job-title"
                    type="text"
                    required
                    value={jobFormData.title}
                    onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                    placeholder={
                      modalMode === 'internship' 
                        ? 'e.g. AI / ML Research Intern' 
                        : modalMode === 'freelance'
                        ? 'e.g. Full-Stack Web App Development (Milestone)'
                        : 'e.g. Senior Frontend Engineer (React)'
                    }
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {modalMode === 'freelance' ? 'Client / Hiring Entity' : 'Company Name'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-company-name"
                    type="text"
                    required
                    value={jobFormData.company_name}
                    onChange={(e) => setJobFormData({ ...jobFormData, company_name: e.target.value })}
                    placeholder={modalMode === 'freelance' ? 'e.g. Enterprise Client / Remote Studio' : 'e.g. Google, Razorpay, Swiggy'}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Original Application URL (Unique Constraint & Validation) */}
              <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1.5">
                <label className="block text-xs font-bold text-amber-950">
                  Original Application URL (Where users apply) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-original-url"
                  type="url"
                  required
                  value={jobFormData.original_url}
                  onChange={(e) => setJobFormData({ ...jobFormData, original_url: e.target.value })}
                  placeholder={
                    modalMode === 'internship' 
                      ? 'https://internshala.com/internship/... or https://careers.company.com/interns'
                      : modalMode === 'freelance'
                      ? 'https://contra.com/opportunity/... or https://www.upwork.com/jobs/...'
                      : 'https://www.linkedin.com/jobs/view/... or https://careers.company.com/...'
                  }
                  className="w-full text-xs p-2.5 border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono text-[11px]"
                />
                <p className="text-[10px] text-amber-800">
                  🔒 URL Duplicate Prevention: The system verifies this URL is unique to prevent duplicate listings.
                </p>
              </div>

              {/* Category & Source Platform */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    id="input-category"
                    value={jobFormData.category_id}
                    onChange={(e) => setJobFormData({ ...jobFormData, category_id: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Source Platform</label>
                  <select
                    id="input-source"
                    value={jobFormData.source_platform}
                    onChange={(e) => setJobFormData({ ...jobFormData, source_platform: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                  >
                    {sources.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                    <option value="Internshala">Internshala</option>
                    <option value="Unstop">Unstop</option>
                    <option value="Contra">Contra</option>
                    <option value="Upwork">Upwork</option>
                    <option value="Fiverr">Fiverr</option>
                    <option value="Company Career Page">Company Career Page</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Location & Work Mode & Employment / Internship Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={jobFormData.location}
                    onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                    placeholder="e.g. Bengaluru, India or Remote"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Mode</label>
                  <select
                    value={jobFormData.work_mode}
                    onChange={(e) => setJobFormData({ ...jobFormData, work_mode: e.target.value as WorkMode })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                  </select>
                </div>

                <div>
                  {modalMode === 'internship' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Internship Type</label>
                      <select
                        id="input-internship-type"
                        value={internshipStipendType}
                        onChange={(e) => {
                          const val = e.target.value as 'stipend' | 'paid' | 'free';
                          setInternshipStipendType(val);
                          if (val === 'free') {
                            setJobFormData(prev => ({ ...prev, salary_text: 'Unpaid (Certificate & Mentorship)' }));
                          } else if (val === 'stipend' && (!jobFormData.salary_text || jobFormData.salary_text.includes('Unpaid'))) {
                            setJobFormData(prev => ({ ...prev, salary_text: '₹15,000 - ₹25,000 / month' }));
                          }
                        }}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500 font-medium"
                      >
                        <option value="stipend">Stipend</option>
                        <option value="paid">Paid</option>
                        <option value="free">Free (Unpaid / Certificate)</option>
                      </select>
                    </div>
                  ) : modalMode === 'freelance' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Contract Model</label>
                      <select
                        value={jobFormData.employment_type}
                        onChange={(e) => setJobFormData({ ...jobFormData, employment_type: e.target.value as EmploymentType })}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500 font-medium"
                      >
                        <option value="freelance">Freelancing / Gig</option>
                        <option value="contract">Fixed Milestone Contract</option>
                        <option value="part_time">Part-Time Retainer</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Employment Type</label>
                      <select
                        value={jobFormData.employment_type}
                        onChange={(e) => setJobFormData({ ...jobFormData, employment_type: e.target.value as EmploymentType })}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500 font-medium"
                      >
                        <option value="full_time">Full-Time</option>
                        <option value="internship">Internship</option>
                        <option value="freelance">Freelancing / Gig</option>
                        <option value="contract">Contract</option>
                        <option value="part_time">Part-Time</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Experience & Compensation Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {modalMode === 'internship' ? 'Eligibility / Education' : 'Experience Requirement'}
                  </label>
                  <input
                    type="text"
                    value={jobFormData.experience}
                    onChange={(e) => setJobFormData({ ...jobFormData, experience: e.target.value })}
                    placeholder={modalMode === 'internship' ? 'e.g. Pre-final / Final year students or Freshers' : 'e.g. 0-1 years (Fresher) or 2-4 years'}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                  <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(jobFormData.is_fresher)}
                      onChange={(e) => setJobFormData({ ...jobFormData, is_fresher: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-[11px] text-slate-600 font-medium">Flag as Fresher / Student Friendly</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {modalMode === 'internship' 
                      ? 'Stipend Amount / Terms' 
                      : modalMode === 'freelance' 
                      ? 'Budget / Milestone Pay' 
                      : 'Salary Display Text'
                    } <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={jobFormData.salary_text || ''}
                    onChange={(e) => setJobFormData({ ...jobFormData, salary_text: e.target.value })}
                    placeholder={
                      modalMode === 'internship' 
                        ? 'e.g. ₹20,000 / month + Certificate' 
                        : modalMode === 'freelance'
                        ? 'e.g. $1,200 (Fixed Budget) or $40/hr'
                        : 'e.g. ₹8,00,000 - ₹12,00,000 / yr'
                    }
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Leave blank if undisclosed on original post.</p>
                </div>
              </div>

              {/* Skills Tags Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Required Skills <span className="text-slate-400 font-normal">(Comma separated)</span>
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="React, TypeScript, Next.js, Node.js, SQL"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Application Deadline & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Application Deadline <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    value={jobFormData.deadline || ''}
                    onChange={(e) => setJobFormData({ ...jobFormData, deadline: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    💡 Automatic Expiration: When deadline passes, listing is automatically moved to expired.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Publishing Status</label>
                  <select
                    value={jobFormData.status}
                    onChange={(e) => setJobFormData({ ...jobFormData, status: e.target.value as JobStatus })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="published">Published (Live to public)</option>
                    <option value="draft">Draft (Private admin only)</option>
                    <option value="expired">Expired (Closed)</option>
                  </select>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {modalMode === 'internship' ? 'Internship Description & Learning Scope' : modalMode === 'freelance' ? 'Project Deliverables & Scope' : 'Job Description & Responsibilities'}
                </label>
                <textarea
                  rows={6}
                  value={jobFormData.description}
                  onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                  placeholder="Paste brief description, requirements, and eligibility guidelines..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  id="btn-admin-submit-job"
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/30 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>
                    {formSubmitting 
                      ? 'Saving...' 
                      : editingJob 
                      ? `Update ${modalMode === 'internship' ? 'Internship' : modalMode === 'freelance' ? 'Project' : 'Job'}` 
                      : `Publish ${modalMode === 'internship' ? 'Internship' : modalMode === 'freelance' ? 'Project' : 'Job'}`
                    }
                  </span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmation?.isOpen && (
        <div 
          id="admin-delete-modal-backdrop"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => !isDeleting && setDeleteConfirmation(null)}
        >
          <div 
            id="admin-delete-modal-box"
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Confirm Permanent Deletion</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200">
              Are you sure you want to permanently delete <strong className="text-slate-900 font-semibold">"{deleteConfirmation.title}"</strong> from JobsKarunadu?
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                id="btn-confirm-delete"
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Listing'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
