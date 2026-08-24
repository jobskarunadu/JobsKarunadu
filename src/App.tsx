import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { Job, JobFilterParams, Category, JobSource } from './types';
import { api } from './services/api';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { JobCard } from './components/JobCard';
import { FilterSidebar } from './components/FilterSidebar';
import { JobDetailsModal } from './components/JobDetailsModal';
import { ReportJobModal } from './components/ReportJobModal';
import { SingleJobPage } from './components/SingleJobPage';
import { CategoriesSection } from './components/CategoriesSection';
import { HomeCategoriesOverview } from './components/HomeCategoriesOverview';
import { HomeInternshipsOverview } from './components/HomeInternshipsOverview';
import { HomeFreelancingOverview } from './components/HomeFreelancingOverview';
import { HomeCoursesOverview } from './components/HomeCoursesOverview';
import { CoursesPage } from './components/CoursesPage';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

function MainApp() {
  const { isAdmin } = useAuth();

  // Parse direct shared job link from URL path (/jobs/:slug) or query (?job=:slug)
  const getInitialJobParam = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromQuery = params.get('job');
      if (fromQuery) return decodeURIComponent(fromQuery);
      const path = window.location.pathname;
      const match = path.match(/^\/jobs?\/(.+)$/);
      if (match && match[1]) {
        return decodeURIComponent(match[1].replace(/\/+$/, ''));
      }
    } catch {
      return null;
    }
    return null;
  };

  // Check if admin URL /admin or query param ?admin=login / ?admin=true is present
  const checkIsAdminPath = () => {
    try {
      const path = window.location.pathname.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      return path === '/admin' || path.startsWith('/admin/') || params.get('admin') === 'login' || params.get('admin') === 'true';
    } catch {
      return false;
    }
  };

  // Direct Job Link State
  const [directJobSlug, setDirectJobSlug] = useState<string | null>(getInitialJobParam);
  const [directJob, setDirectJob] = useState<Job | null>(null);
  const [directJobLoading, setDirectJobLoading] = useState<boolean>(false);
  const [directJobError, setDirectJobError] = useState<string | null>(null);

  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'jobs' | 'internship' | 'freelancing' | 'courses' | 'admin'>('home');
  
  // Data State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sources, setSources] = useState<JobSource[]>([]);
  const [stats, setStats] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [filters, setFilters] = useState<JobFilterParams>({
    q: '',
    category: 'all',
    location: '',
    work_mode: 'all',
    employment_type: 'all',
    experience: 'all',
    source: 'all',
    is_fresher: false,
    is_remote: false,
    sort: 'newest',
    page: 1,
    limit: 12
  });

  // Modals
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [reportingJob, setReportingJob] = useState<Job | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(() => {
    return !isAdmin && checkIsAdminPath();
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // If user navigated directly to /admin and is already logged in, set tab to admin
  useEffect(() => {
    if (checkIsAdminPath()) {
      if (isAdmin) {
        setActiveTab('admin');
      } else {
        setIsAdminLoginOpen(true);
      }
    }
  }, [isAdmin]);

  // Toast / Status Message
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Load direct job when directJobSlug changes
  useEffect(() => {
    if (directJobSlug) {
      loadDirectJob(directJobSlug);
    } else {
      setDirectJob(null);
      setDirectJobError(null);
    }
  }, [directJobSlug]);

  const loadDirectJob = async (slugOrId: string) => {
    setDirectJobLoading(true);
    setDirectJobError(null);
    try {
      const job = await api.getJob(slugOrId);
      setDirectJob(job);
    } catch (err: any) {
      console.error('Error fetching direct job:', err);
      setDirectJobError('This listing could not be found or has expired.');
    } finally {
      setDirectJobLoading(false);
    }
  };

  // Listen to browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const slug = getInitialJobParam();
      setDirectJobSlug(slug);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load initial public data
  useEffect(() => {
    loadPublicData();
  }, []);

  // Fetch jobs whenever filters or pagination change
  useEffect(() => {
    fetchFilteredJobs();
  }, [filters, currentPage]);

  const loadPublicData = async () => {
    try {
      const [cats, srcs, st] = await Promise.all([
        api.getCategories(),
        api.getSources(),
        api.getStats()
      ]);
      setCategories(cats);
      setSources(srcs);
      setStats(st);
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  };

  const fetchFilteredJobs = async () => {
    setLoading(true);
    try {
      const res = await api.getJobs({ ...filters, page: currentPage, limit: 12 });
      setJobs(res.jobs);
      setTotalJobs(res.total);
      setTotalPages(res.total_pages);
      if (res.categories && res.categories.length > 0) {
        setCategories(res.categories);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Handle Apply Now redirection + click analytics
  const handleApply = async (job: Job) => {
    showToast(`Redirecting to original job application on ${job.source_platform}...`);
    try {
      const res = await api.applyToJob(job.id);
      const targetUrl = res.original_url || job.original_url;
      // Open original URL in new tab
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      // Update local click count
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, apply_clicks: (j.apply_clicks || 0) + 1 } : j));
    } catch (err) {
      // Fallback open
      window.open(job.original_url, '_blank', 'noopener,noreferrer');
    }
  };

  // Quick Filters from Hero
  const handleHeroSearch = (searchTerm: string, locationTerm?: string) => {
    setFilters(prev => ({
      ...prev,
      q: searchTerm,
      location: locationTerm || '',
      employment_type: 'all',
      page: 1
    }));
    setCurrentPage(1);
    setActiveTab('jobs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickFilter = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      employment_type: 'all',
      page: 1
    }));
    setCurrentPage(1);
    setActiveTab('jobs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterUpdate = (updates: Partial<JobFilterParams>) => {
    setFilters(prev => ({
      ...prev,
      ...updates,
      page: 1
    }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      q: '',
      category: 'all',
      location: '',
      work_mode: 'all',
      employment_type: activeTab === 'internship' ? 'internship' : activeTab === 'freelancing' ? 'freelance' : 'all',
      experience: 'all',
      source: 'all',
      is_fresher: false,
      is_remote: false,
      sort: 'newest',
      page: 1,
      limit: 12
    });
    setCurrentPage(1);
  };

  const handleSelectCategory = (catId: string) => {
    setFilters(prev => ({
      ...prev,
      category: catId,
      employment_type: 'all',
      page: 1
    }));
    setCurrentPage(1);
    setActiveTab('jobs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenJobDetails = (job: Job) => {
    setSelectedJob(job);
    window.history.pushState({ jobId: job.id, slug: job.slug }, '', `/jobs/${job.slug || job.id}`);
  };

  const handleCloseJobDetails = () => {
    setSelectedJob(null);
    if (window.location.pathname.startsWith('/jobs/') || window.location.search.includes('job=')) {
      window.history.pushState({}, '', '/');
    }
  };

  const handleBackFromDirectJob = () => {
    setDirectJob(null);
    setDirectJobSlug(null);
    setDirectJobError(null);
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (tab: 'home' | 'jobs' | 'internship' | 'freelancing' | 'courses' | 'admin') => {
    // Clear direct job view if active
    if (directJobSlug) {
      setDirectJob(null);
      setDirectJobSlug(null);
      setDirectJobError(null);
      window.history.pushState({}, '', '/');
    }

    if (tab === 'internship') {
      setFilters(prev => ({ ...prev, employment_type: 'internship', is_fresher: false, page: 1 }));
      setCurrentPage(1);
      setActiveTab('internship');
    } else if (tab === 'freelancing') {
      setFilters(prev => ({ ...prev, employment_type: 'freelance', is_fresher: false, page: 1 }));
      setCurrentPage(1);
      setActiveTab('freelancing');
    } else if (tab === 'jobs') {
      setFilters(prev => ({ ...prev, employment_type: 'all', page: 1 }));
      setCurrentPage(1);
      setActiveTab('jobs');
    } else if (tab === 'courses') {
      setActiveTab('courses');
    } else if (tab === 'admin') {
      if (isAdmin) {
        setActiveTab('admin');
      } else {
        setIsAdminLoginOpen(true);
      }
    } else {
      setFilters(prev => ({ ...prev, employment_type: 'all', page: 1 }));
      setActiveTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans antialiased selection:bg-red-600 selection:text-white">
      
      {/* Top Header Navigation */}
      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* Outbound Application Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-amber-500/50 flex items-center gap-2.5 text-xs animate-slide-up">
          <ExternalLink className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main View Switcher */}
      <main className="flex-1">
        
        {/* ======================================================== */}
        {/* VIEW: DIRECT STANDALONE JOB PAGE (Shared Links)         */}
        {/* ======================================================== */}
        {directJobSlug ? (
          directJobLoading ? (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-amber-200 border-t-red-600 animate-spin mb-4" />
              <h2 className="text-base font-bold text-slate-800">Opening verified listing...</h2>
              <p className="text-xs text-slate-500 mt-1">Connecting to official employment source</p>
            </div>
          ) : directJobError || !directJob ? (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-red-600 border border-amber-200 flex items-center justify-center text-2xl font-bold mb-4 shadow-xs">
                !
              </div>
              <h2 className="text-lg font-black text-slate-900">Listing Not Available</h2>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {directJobError || 'This job listing may have expired, reached its deadline, or been removed by the employer.'}
              </p>
              <button
                onClick={handleBackFromDirectJob}
                className="mt-5 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/20 transition-all active:scale-95"
              >
                Browse All Active Opportunities
              </button>
            </div>
          ) : (
            <SingleJobPage
              job={directJob}
              onBackToDirectory={handleBackFromDirectJob}
              onApply={handleApply}
              onReport={(j) => setReportingJob(j)}
            />
          )
        ) : activeTab === 'admin' && isAdmin ? (
          /* ======================================================== */
          /* VIEW: ADMIN DASHBOARD (If Admin & Tab is 'admin')        */
          /* ======================================================== */
          <AdminDashboard />
        ) : activeTab === 'courses' ? (
          /* ======================================================== */
          /* VIEW: COURSES (COMING SOON)                             */
          /* ======================================================== */
          <CoursesPage onNavigateJobs={() => handleNavigate('jobs')} />
        ) : activeTab === 'home' ? (
          /* ======================================================== */
          /* VIEW: HOME PAGE (Hero + Highlight Sections)             */
          /* ======================================================== */
          <div>
            {/* Hero Section */}
            <HeroSection
              onSearch={handleHeroSearch}
              onQuickFilter={handleQuickFilter}
              stats={stats}
            />

            {/* 1. Popular Job Categories Overview */}
            <HomeCategoriesOverview
              categories={categories}
              onExplore={() => handleNavigate('jobs')}
              onSelectCategory={handleSelectCategory}
            />

            {/* 2. Featured Internships Overview */}
            <HomeInternshipsOverview
              onExplore={() => handleNavigate('internship')}
            />

            {/* 3. Freelancing Gigs Overview */}
            <HomeFreelancingOverview
              onExplore={() => handleNavigate('freelancing')}
            />

            {/* 4. Courses & Upskilling Overview */}
            <HomeCoursesOverview
              onExplore={() => handleNavigate('courses')}
            />
          </div>
        ) : (
          /* ======================================================== */
          /* VIEW: JOBS / INTERNSHIPS / FREELANCING                   */
          /* ======================================================== */
          <section id="main-job-explorer" className="py-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Mobile Filter Toggle (No title/count badge) */}
            <div className="lg:hidden mb-4 flex justify-end">
              <button
                id="btn-open-mobile-filters"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-red-700 flex items-center gap-1.5 shadow-xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-red-600" />
                <span>Filters</span>
              </button>
            </div>

            {/* Sidebar + 3-Cards-Per-Row Layout */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              
              {/* Desktop Left Sidebar Filters */}
              <div className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-20">
                <FilterSidebar
                  filters={filters}
                  categories={categories}
                  sources={sources}
                  onFilterChange={handleFilterUpdate}
                  onReset={handleResetFilters}
                  totalResults={totalJobs}
                  isFreelancing={activeTab === 'freelancing' || filters.employment_type === 'freelance'}
                />
              </div>

              {/* Mobile Filters Drawer */}
              {mobileFiltersOpen && (
                <div className="lg:hidden w-full mb-4">
                  <FilterSidebar
                    filters={filters}
                    categories={categories}
                    sources={sources}
                    onFilterChange={handleFilterUpdate}
                    onReset={handleResetFilters}
                    totalResults={totalJobs}
                    isFreelancing={activeTab === 'freelancing' || filters.employment_type === 'freelance'}
                  />
                </div>
              )}

              {/* Right Job Cards Feed (3 jobs in a row) */}
              <div className="flex-1 min-w-0 space-y-6">
                
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 py-4">
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <div key={n} className="bg-white p-5 rounded-xl border border-slate-200 animate-pulse h-64" />
                    ))}
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">
                      {activeTab === 'internship' 
                        ? 'No matching internship listings found' 
                        : activeTab === 'freelancing'
                        ? 'No matching freelance gigs found'
                        : 'No matching job listings found'}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Try relaxing your search terms or clearing specific filters like category, work mode, or platform.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-2 px-4 py-2 bg-amber-50 text-red-700 text-xs font-semibold rounded-lg hover:bg-amber-100 transition-colors inline-flex items-center gap-1.5 border border-amber-200"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Clear All Filters</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {jobs.map(job => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onApply={handleApply}
                        onViewDetails={handleOpenJobDetails}
                        onReport={setReportingJob}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                    <button
                      id="btn-pagination-prev"
                      disabled={currentPage <= 1}
                      onClick={() => {
                        setCurrentPage(prev => Math.max(1, prev - 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-amber-50 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <div className="text-xs font-medium text-slate-600">
                      Page <span className="font-bold text-slate-900">{currentPage}</span> of{' '}
                      <span className="font-bold text-slate-900">{totalPages}</span>
                    </div>

                    <button
                      id="btn-pagination-next"
                      disabled={currentPage >= totalPages}
                      onClick={() => {
                        setCurrentPage(prev => Math.min(totalPages, prev + 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-amber-50 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

              </div>

            </div>
          </section>
        )}

      </main>

      {/* 3. Global Footer */}
      <Footer
        categories={categories}
        sources={sources}
        onSelectCategory={handleSelectCategory}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* 4. Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        onClose={handleCloseJobDetails}
        onApply={handleApply}
        onReport={(job) => {
          handleCloseJobDetails();
          setReportingJob(job);
        }}
      />

      {/* 5. Report Job Modal */}
      <ReportJobModal
        job={reportingJob}
        onClose={() => setReportingJob(null)}
      />

      {/* 6. Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setActiveTab('admin');
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
