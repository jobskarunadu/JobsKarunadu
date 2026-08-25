export type WorkMode = 'remote' | 'hybrid' | 'onsite';
export type EmploymentType = 'full_time' | 'part_time' | 'internship' | 'contract' | 'freelance';
export type JobStatus = 'draft' | 'published' | 'expired';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon_name: string;
  description?: string;
  job_count?: number;
}

export interface JobSource {
  id: string;
  name: string;
  domain: string;
  badge_color: string;
  badge_bg: string;
  logo_url?: string;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  company_name: string;
  company_logo_url?: string;
  company_website?: string;
  description: string;
  location: string;
  work_mode: WorkMode;
  employment_type: EmploymentType;
  experience: string; // e.g. "0-1 years (Fresher)", "1-3 years", "3-5 years", "5+ years"
  is_fresher: boolean;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: string;
  salary_period?: 'year' | 'month' | 'hour';
  salary_text?: string; // Formatted or raw string e.g. "₹12 - ₹18 LPA" or "$110k - $140k/yr"
  skills: string[];
  category_id: string;
  category_name?: string;
  source_platform: string; // e.g. "LinkedIn", "Naukri", "Indeed", "Wellfound", "Internshala", "Company Career Page"
  original_url: string;
  posted_date: string; // ISO date string or formatted date
  deadline?: string | null; // ISO date string or null
  created_at: string;
  updated_at: string;
  status: JobStatus;
  is_featured: boolean;
  apply_clicks: number;
  views_count?: number;
  report_count?: number;
}

export interface Report {
  id: string;
  job_id: string;
  job_title: string;
  reason: 'expired' | 'broken_link' | 'scam_fake' | 'wrong_details' | 'duplicate' | 'other';
  details?: string;
  reporter_email?: string;
  created_at: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'action_taken';
}

export interface JobFilterParams {
  q?: string;
  category?: string;
  location?: string;
  work_mode?: string;
  employment_type?: string;
  experience?: string;
  source?: string;
  is_fresher?: boolean | string;
  is_remote?: boolean | string;
  is_featured?: boolean | string;
  sort?: 'newest' | 'closing_soon' | 'most_applied' | 'salary_high';
  page?: number;
  limit?: number;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  categories: Category[];
  sources: JobSource[];
}

export interface AdminStats {
  total_jobs: number;
  published_jobs: number;
  draft_jobs: number;
  expired_jobs: number;
  featured_jobs: number;
  total_apply_clicks: number;
  pending_reports: number;
  category_breakdown: { category_name: string; count: number }[];
  source_breakdown: { source_name: string; clicks: number; count: number }[];
}

export interface AdminAuthResponse {
  success: boolean;
  token?: string;
  username?: string;
  message?: string;
}
