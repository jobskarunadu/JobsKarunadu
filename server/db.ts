import fs from 'fs';
import path from 'path';
import { Category, Job, JobFilterParams, JobSource, Report, AdminStats } from '../src/types';
import { INITIAL_CATEGORIES, INITIAL_SOURCES, SAMPLE_JOBS } from './seedData';

interface DatabaseSchema {
  jobs: Job[];
  categories: Category[];
  sources: JobSource[];
  reports: Report[];
  last_updated: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url.trim());
    // remove common tracking parameters
    parsed.searchParams.delete('utm_source');
    parsed.searchParams.delete('utm_medium');
    parsed.searchParams.delete('utm_campaign');
    parsed.searchParams.delete('utm_term');
    parsed.searchParams.delete('utm_content');
    parsed.searchParams.delete('trk');
    parsed.searchParams.delete('ref');
    return parsed.toString().replace(/\/+$/, '');
  } catch {
    return url.trim().toLowerCase().replace(/\/+$/, '');
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

class Database {
  private data: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.data = this.loadData();
    this.checkAndExpireJobs();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.jobs && Array.isArray(parsed.jobs)) {
          // Merge any newly introduced sources
          const existingSourceIds = new Set(parsed.sources?.map((s: JobSource) => s.id) || []);
          INITIAL_SOURCES.forEach(s => {
            if (!existingSourceIds.has(s.id)) {
              parsed.sources.push(s);
            }
          });

          // Merge any newly introduced sample jobs (e.g. gig-1, gig-2, etc.)
          const existingJobIds = new Set(parsed.jobs.map((j: Job) => j.id));
          let addedNewJobs = false;
          SAMPLE_JOBS.forEach(j => {
            if (!existingJobIds.has(j.id)) {
              parsed.jobs.push(j);
              addedNewJobs = true;
            }
          });

          if (addedNewJobs || parsed.sources.length !== INITIAL_SOURCES.length) {
            this.saveDataImmediately(parsed);
          }
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error reading db.json, initializing with default sample data', err);
    }

    // Default state with seed data
    const initialData: DatabaseSchema = {
      jobs: SAMPLE_JOBS,
      categories: INITIAL_CATEGORIES,
      sources: INITIAL_SOURCES,
      reports: [
        {
          id: 'report-demo-1',
          job_id: 'job-12',
          job_title: 'Senior Systems Architect - Cloud Infrastructure',
          reason: 'expired',
          details: 'Application link is closed on the company portal.',
          reporter_email: 'applicant@example.com',
          created_at: '2026-08-19T10:00:00Z',
          status: 'reviewed'
        }
      ],
      last_updated: new Date().toISOString()
    };
    this.saveDataImmediately(initialData);
    return initialData;
  }

  private saveDataImmediately(dataToSave: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to db.json:', err);
    }
  }

  private scheduleSave() {
    this.data.last_updated = new Date().toISOString();
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.saveDataImmediately(this.data);
    }, 200);
  }

  // Automatic expiration logic
  public checkAndExpireJobs(): boolean {
    const now = new Date();
    let hasChanges = false;

    this.data.jobs.forEach(job => {
      if (job.status === 'published' && job.deadline) {
        const deadlineDate = new Date(job.deadline);
        if (!isNaN(deadlineDate.getTime()) && deadlineDate < now) {
          job.status = 'expired';
          job.updated_at = new Date().toISOString();
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      this.scheduleSave();
    }
    return hasChanges;
  }

  // Public Query (Only published and non-expired)
  public getPublishedJobs(params: JobFilterParams) {
    this.checkAndExpireJobs();

    let filtered = this.data.jobs.filter(j => j.status === 'published');

    // Search query: title, company, skills, location, description
    if (params.q && params.q.trim()) {
      const q = params.q.trim().toLowerCase();
      filtered = filtered.filter(j => {
        const matchTitle = j.title.toLowerCase().includes(q);
        const matchCompany = j.company_name.toLowerCase().includes(q);
        const matchLoc = j.location.toLowerCase().includes(q);
        const matchSkills = j.skills.some(s => s.toLowerCase().includes(q));
        const matchCategory = (j.category_name || '').toLowerCase().includes(q);
        return matchTitle || matchCompany || matchLoc || matchSkills || matchCategory;
      });
    }

    // Category filter
    if (params.category && params.category !== 'all') {
      const cat = params.category.toLowerCase();
      filtered = filtered.filter(j => j.category_id === cat || j.category_name?.toLowerCase() === cat);
    }

    // Location filter
    if (params.location && params.location !== 'all') {
      const loc = params.location.toLowerCase();
      filtered = filtered.filter(j => j.location.toLowerCase().includes(loc));
    }

    // Work mode filter
    if (params.work_mode && params.work_mode !== 'all') {
      filtered = filtered.filter(j => j.work_mode === params.work_mode);
    }

    // Employment type filter
    if (params.employment_type && params.employment_type !== 'all') {
      filtered = filtered.filter(j => j.employment_type === params.employment_type);
    }

    // Experience filter
    if (params.experience && params.experience !== 'all') {
      if (params.experience === 'fresher') {
        filtered = filtered.filter(j => j.is_fresher || j.experience.toLowerCase().includes('0-') || j.experience.toLowerCase().includes('fresher') || j.experience.toLowerCase().includes('intern'));
      } else if (params.experience === '1-3') {
        filtered = filtered.filter(j => j.experience.includes('1-3') || j.experience.includes('1-2') || j.experience.includes('2-4'));
      } else if (params.experience === '3-5') {
        filtered = filtered.filter(j => j.experience.includes('3-5') || j.experience.includes('3-6'));
      } else if (params.experience === '5+') {
        filtered = filtered.filter(j => j.experience.includes('5+') || j.experience.includes('5-') || j.experience.includes('senior'));
      }
    }

    // Source platform filter
    if (params.source && params.source !== 'all') {
      const src = params.source.toLowerCase();
      filtered = filtered.filter(j => j.source_platform.toLowerCase().includes(src));
    }

    // Fresher flag
    if (params.is_fresher === true || params.is_fresher === 'true') {
      filtered = filtered.filter(j => j.is_fresher || j.experience.toLowerCase().includes('fresher') || j.experience.toLowerCase().includes('0-') || j.employment_type === 'internship');
    }

    // Remote flag
    if (params.is_remote === true || params.is_remote === 'true') {
      filtered = filtered.filter(j => j.work_mode === 'remote');
    }

    // Featured flag
    if (params.is_featured === true || params.is_featured === 'true') {
      filtered = filtered.filter(j => j.is_featured);
    }

    // Sorting (Newest listings first)
    const sort = params.sort || 'newest';
    if (sort === 'newest') {
      filtered.sort((a, b) => {
        const timeB = new Date(b.posted_date || b.created_at || 0).getTime() || 0;
        const timeA = new Date(a.posted_date || a.created_at || 0).getTime() || 0;
        if (timeB !== timeA) return timeB - timeA;
        const createdB = new Date(b.created_at || 0).getTime() || 0;
        const createdA = new Date(a.created_at || 0).getTime() || 0;
        return createdB - createdA;
      });
    } else if (sort === 'closing_soon') {
      filtered.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    } else if (sort === 'most_applied') {
      filtered.sort((a, b) => b.apply_clicks - a.apply_clicks);
    } else if (sort === 'salary_high') {
      filtered.sort((a, b) => (b.salary_max || b.salary_min || 0) - (a.salary_max || a.salary_min || 0));
    }

    const total = filtered.length;
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(params.limit) || 12));
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    // Calculate category job counts
    const categoriesWithCount = this.data.categories.map(c => {
      const count = this.data.jobs.filter(j => j.status === 'published' && j.category_id === c.id).length;
      return { ...c, job_count: count };
    });

    return {
      jobs: paginated,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit) || 1,
      categories: categoriesWithCount,
      sources: this.data.sources
    };
  }

  // Get single job by ID or slug
  public getJobByIdOrSlug(identifier: string, isAdmin = false): Job | null {
    this.checkAndExpireJobs();
    const job = this.data.jobs.find(j => j.id === identifier || j.slug === identifier);
    if (!job) return null;
    if (!isAdmin && job.status !== 'published') {
      return null;
    }
    // Increment view count if public
    if (!isAdmin) {
      job.views_count = (job.views_count || 0) + 1;
      this.scheduleSave();
    }
    return job;
  }

  // Increment Apply clicks and return URL
  public recordApplyClick(jobId: string): { success: boolean; original_url?: string; apply_clicks?: number } {
    const job = this.data.jobs.find(j => j.id === jobId);
    if (!job) {
      return { success: false };
    }
    job.apply_clicks = (job.apply_clicks || 0) + 1;
    this.scheduleSave();
    return {
      success: true,
      original_url: job.original_url,
      apply_clicks: job.apply_clicks
    };
  }

  // Create Job with duplicate URL check
  public createJob(jobData: Partial<Job>): { success: boolean; job?: Job; error?: string } {
    if (!jobData.title || !jobData.company_name || !jobData.original_url) {
      return { success: false, error: 'Title, Company Name, and Original Application URL are required.' };
    }

    const normalizedNew = normalizeUrl(jobData.original_url);

    // Duplicate check
    const existing = this.data.jobs.find(j => normalizeUrl(j.original_url) === normalizedNew);
    if (existing) {
      return {
        success: false,
        error: `Duplicate listing detected! This application URL is already registered for "${existing.title}" at ${existing.company_name} (ID: ${existing.id}).`
      };
    }

    const id = 'job-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const rawSlug = slugify(`${jobData.title} ${jobData.company_name} ${jobData.location || ''}`);
    let slug = rawSlug;
    let counter = 1;
    while (this.data.jobs.some(j => j.slug === slug)) {
      slug = `${rawSlug}-${counter++}`;
    }

    // Category name lookup
    const category = this.data.categories.find(c => c.id === jobData.category_id);
    const categoryName = category ? category.name : (jobData.category_name || 'Other Roles');

    const newJob: Job = {
      id,
      slug,
      title: jobData.title.trim(),
      company_name: jobData.company_name.trim(),
      company_logo_url: jobData.company_logo_url || '',
      company_website: jobData.company_website || '',
      description: jobData.description || '',
      location: jobData.location || 'Remote',
      work_mode: jobData.work_mode || 'remote',
      employment_type: jobData.employment_type || 'full_time',
      experience: jobData.experience || '0-1 years (Fresher)',
      is_fresher: jobData.is_fresher ?? (jobData.experience?.toLowerCase().includes('0-') || jobData.experience?.toLowerCase().includes('fresher') || false),
      salary_min: jobData.salary_min !== undefined ? jobData.salary_min : null,
      salary_max: jobData.salary_max !== undefined ? jobData.salary_max : null,
      salary_currency: jobData.salary_currency || 'INR',
      salary_period: jobData.salary_period || 'year',
      salary_text: jobData.salary_text || '',
      skills: Array.isArray(jobData.skills) ? jobData.skills : (typeof jobData.skills === 'string' ? (jobData.skills as string).split(',').map(s => s.trim()).filter(Boolean) : []),
      category_id: jobData.category_id || 'software-development',
      category_name: categoryName,
      source_platform: jobData.source_platform || 'LinkedIn',
      original_url: jobData.original_url.trim(),
      posted_date: jobData.posted_date || new Date().toISOString(),
      deadline: jobData.deadline || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: jobData.status || 'published',
      is_featured: Boolean(jobData.is_featured),
      apply_clicks: 0,
      views_count: 0,
      report_count: 0
    };

    // Auto-expire check before saving
    if (newJob.status === 'published' && newJob.deadline && new Date(newJob.deadline) < new Date()) {
      newJob.status = 'expired';
    }

    this.data.jobs.unshift(newJob);
    this.scheduleSave();
    return { success: true, job: newJob };
  }

  // Update Job
  public updateJob(id: string, updates: Partial<Job>): { success: boolean; job?: Job; error?: string } {
    const jobIndex = this.data.jobs.findIndex(j => j.id === id);
    if (jobIndex === -1) {
      return { success: false, error: 'Job not found' };
    }

    const currentJob = this.data.jobs[jobIndex];

    // If URL changed, check duplicate
    if (updates.original_url && updates.original_url.trim() !== currentJob.original_url) {
      const normalized = normalizeUrl(updates.original_url);
      const duplicate = this.data.jobs.find(j => j.id !== id && normalizeUrl(j.original_url) === normalized);
      if (duplicate) {
        return {
          success: false,
          error: `Duplicate listing detected! URL is already used by "${duplicate.title}" (ID: ${duplicate.id}).`
        };
      }
    }

    // Category name resolution
    let categoryName = currentJob.category_name;
    if (updates.category_id && updates.category_id !== currentJob.category_id) {
      const cat = this.data.categories.find(c => c.id === updates.category_id);
      if (cat) categoryName = cat.name;
    }

    const updatedJob: Job = {
      ...currentJob,
      ...updates,
      category_name: categoryName,
      updated_at: new Date().toISOString(),
      skills: Array.isArray(updates.skills) ? updates.skills : (typeof updates.skills === 'string' ? (updates.skills as string).split(',').map(s => s.trim()).filter(Boolean) : currentJob.skills)
    };

    // Expiration check
    if (updatedJob.status === 'published' && updatedJob.deadline && new Date(updatedJob.deadline) < new Date()) {
      updatedJob.status = 'expired';
    }

    this.data.jobs[jobIndex] = updatedJob;
    this.scheduleSave();
    return { success: true, job: updatedJob };
  }

  // Delete Job
  public deleteJob(id: string): boolean {
    const initialLen = this.data.jobs.length;
    this.data.jobs = this.data.jobs.filter(j => j.id !== id);
    // Also remove associated reports
    this.data.reports = this.data.reports.filter(r => r.job_id !== id);
    if (this.data.jobs.length !== initialLen) {
      this.scheduleSave();
      return true;
    }
    return false;
  }

  // Admin All Jobs query
  public getAdminJobs(params: { q?: string; status?: string; category?: string; source?: string; employment_type?: string; is_featured?: string; page?: number; limit?: number }) {
    this.checkAndExpireJobs();

    let filtered = [...this.data.jobs];

    if (params.q && params.q.trim()) {
      const q = params.q.trim().toLowerCase();
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company_name.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.original_url.toLowerCase().includes(q)
      );
    }

    if (params.status && params.status !== 'all') {
      filtered = filtered.filter(j => j.status === params.status);
    }

    if (params.category && params.category !== 'all') {
      filtered = filtered.filter(j => j.category_id === params.category);
    }

    if (params.employment_type && params.employment_type !== 'all') {
      filtered = filtered.filter(j => j.employment_type === params.employment_type);
    }

    if (params.source && params.source !== 'all') {
      filtered = filtered.filter(j => j.source_platform.toLowerCase().includes(params.source!.toLowerCase()));
    }

    if (params.is_featured === 'true') {
      filtered = filtered.filter(j => j.is_featured);
    }

    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const total = filtered.length;
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 20));
    const startIndex = (page - 1) * limit;

    return {
      jobs: filtered.slice(startIndex, startIndex + limit),
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit) || 1
    };
  }

  // Add Report
  public createReport(reportData: { job_id: string; reason: Report['reason']; details?: string; reporter_email?: string }): { success: boolean; report?: Report } {
    const job = this.data.jobs.find(j => j.id === reportData.job_id);
    if (!job) {
      return { success: false };
    }

    const newReport: Report = {
      id: 'rep-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      job_id: job.id,
      job_title: job.title,
      reason: reportData.reason,
      details: reportData.details || '',
      reporter_email: reportData.reporter_email || '',
      created_at: new Date().toISOString(),
      status: 'pending'
    };

    job.report_count = (job.report_count || 0) + 1;
    this.data.reports.unshift(newReport);
    this.scheduleSave();
    return { success: true, report: newReport };
  }

  // Admin Reports
  public getReports(status?: string) {
    if (status && status !== 'all') {
      return this.data.reports.filter(r => r.status === status);
    }
    return this.data.reports;
  }

  public updateReportStatus(reportId: string, status: Report['status']) {
    const rep = this.data.reports.find(r => r.id === reportId);
    if (!rep) return false;
    rep.status = status;
    this.scheduleSave();
    return true;
  }

  // Admin Stats
  public getAdminStats(): AdminStats {
    this.checkAndExpireJobs();

    const total_jobs = this.data.jobs.length;
    const published_jobs = this.data.jobs.filter(j => j.status === 'published').length;
    const draft_jobs = this.data.jobs.filter(j => j.status === 'draft').length;
    const expired_jobs = this.data.jobs.filter(j => j.status === 'expired').length;
    const featured_jobs = this.data.jobs.filter(j => j.is_featured).length;
    const total_apply_clicks = this.data.jobs.reduce((sum, j) => sum + (j.apply_clicks || 0), 0);
    const pending_reports = this.data.reports.filter(r => r.status === 'pending').length;

    // Category breakdown
    const category_breakdown = this.data.categories.map(c => ({
      category_name: c.name,
      count: this.data.jobs.filter(j => j.category_id === c.id).length
    })).filter(c => c.count > 0);

    // Source breakdown
    const sourceClicksMap: Record<string, { clicks: number; count: number }> = {};
    this.data.jobs.forEach(j => {
      const src = j.source_platform || 'Other';
      if (!sourceClicksMap[src]) {
        sourceClicksMap[src] = { clicks: 0, count: 0 };
      }
      sourceClicksMap[src].clicks += j.apply_clicks || 0;
      sourceClicksMap[src].count += 1;
    });

    const source_breakdown = Object.entries(sourceClicksMap).map(([name, data]) => ({
      source_name: name,
      clicks: data.clicks,
      count: data.count
    }));

    return {
      total_jobs,
      published_jobs,
      draft_jobs,
      expired_jobs,
      featured_jobs,
      total_apply_clicks,
      pending_reports,
      category_breakdown,
      source_breakdown
    };
  }

  // Categories
  public getCategories(): Category[] {
    return this.data.categories.map(c => {
      const count = this.data.jobs.filter(j => j.status === 'published' && j.category_id === c.id).length;
      return { ...c, job_count: count };
    });
  }

  public addCategory(name: string, description?: string): Category {
    const slug = slugify(name);
    const newCat: Category = {
      id: slug,
      name: name.trim(),
      slug,
      icon_name: 'Briefcase',
      description: description || ''
    };
    this.data.categories.push(newCat);
    this.scheduleSave();
    return newCat;
  }

  public deleteCategory(id: string): { success: boolean; error?: string } {
    const inUseCount = this.data.jobs.filter(j => j.category_id === id).length;
    if (inUseCount > 0) {
      return { success: false, error: `Cannot delete category: ${inUseCount} jobs are currently assigned to it.` };
    }
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    this.scheduleSave();
    return { success: true };
  }

  // Sources
  public getSources(): JobSource[] {
    return this.data.sources;
  }

  // Reset / Seed DB
  public resetToSampleData(): void {
    this.data = {
      jobs: JSON.parse(JSON.stringify(SAMPLE_JOBS)),
      categories: JSON.parse(JSON.stringify(INITIAL_CATEGORIES)),
      sources: JSON.parse(JSON.stringify(INITIAL_SOURCES)),
      reports: [
        {
          id: 'report-demo-1',
          job_id: 'job-12',
          job_title: 'Senior Systems Architect - Cloud Infrastructure (Archived/Expired Demo)',
          reason: 'expired',
          details: 'Application link is marked closed on LinkedIn.',
          reporter_email: 'tester@example.com',
          created_at: '2026-08-19T10:00:00Z',
          status: 'reviewed'
        }
      ],
      last_updated: new Date().toISOString()
    };
    this.saveDataImmediately(this.data);
  }
}

export const db = new Database();
