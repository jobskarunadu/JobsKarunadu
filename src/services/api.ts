import {
  AdminAuthResponse,
  AdminStats,
  Category,
  Job,
  JobFilterParams,
  JobSource,
  JobsResponse,
  Report
} from '../types';

const API_BASE = '/api';

export const api = {
  // Public APIs
  async getJobs(params: JobFilterParams = {}): Promise<JobsResponse> {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.location && params.location !== 'all') query.set('location', params.location);
    if (params.work_mode && params.work_mode !== 'all') query.set('work_mode', params.work_mode);
    if (params.employment_type && params.employment_type !== 'all') query.set('employment_type', params.employment_type);
    if (params.experience && params.experience !== 'all') query.set('experience', params.experience);
    if (params.source && params.source !== 'all') query.set('source', params.source);
    if (params.is_fresher) query.set('is_fresher', 'true');
    if (params.is_remote) query.set('is_remote', 'true');
    if (params.is_featured) query.set('is_featured', 'true');
    if (params.sort) query.set('sort', params.sort);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/jobs?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async getJob(idOrSlug: string): Promise<Job> {
    const res = await fetch(`${API_BASE}/jobs/${encodeURIComponent(idOrSlug)}`);
    if (!res.ok) throw new Error('Job not found or has expired');
    return res.json();
  },

  async applyToJob(id: string): Promise<{ success: boolean; original_url: string; apply_clicks: number }> {
    const res = await fetch(`${API_BASE}/jobs/${encodeURIComponent(id)}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to record apply click');
    return res.json();
  },

  async reportJob(jobId: string, reason: string, details?: string, reporter_email?: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/jobs/${encodeURIComponent(jobId)}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, details, reporter_email })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit report');
    }
    return res.json();
  },

  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getSources(): Promise<JobSource[]> {
    const res = await fetch(`${API_BASE}/sources`);
    if (!res.ok) throw new Error('Failed to fetch sources');
    return res.json();
  },

  async getStats(): Promise<{
    total_active_jobs: number;
    remote_jobs: number;
    fresher_jobs: number;
    total_applications_routed: number;
    verified_platforms: number;
  }> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Admin APIs
  async adminLogin(username: string, password: string): Promise<AdminAuthResponse> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invalid admin credentials');
    return data;
  },

  async adminVerifySession(token: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/admin/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async adminGetStats(token: string): Promise<AdminStats> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Unauthorized or failed to load stats');
    return res.json();
  },

  async adminGetJobs(token: string, params: { q?: string; status?: string; category?: string; source?: string; employment_type?: string; is_featured?: string; page?: number; limit?: number } = {}) {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.status) query.set('status', params.status);
    if (params.category) query.set('category', params.category);
    if (params.source) query.set('source', params.source);
    if (params.employment_type) query.set('employment_type', params.employment_type);
    if (params.is_featured) query.set('is_featured', params.is_featured);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/admin/jobs?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch admin jobs');
    return res.json();
  },

  async adminCreateJob(token: string, jobData: Partial<Job>): Promise<{ success: boolean; job: Job; message: string }> {
    const res = await fetch(`${API_BASE}/admin/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(jobData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create job');
    }
    return data;
  },

  async adminUpdateJob(token: string, id: string, jobData: Partial<Job>): Promise<{ success: boolean; job: Job }> {
    const res = await fetch(`${API_BASE}/admin/jobs/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(jobData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update job');
    }
    return data;
  },

  async adminUpdateStatus(token: string, id: string, status: 'draft' | 'published' | 'expired') {
    const res = await fetch(`${API_BASE}/admin/jobs/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update status');
    return data;
  },

  async adminToggleFeatured(token: string, id: string, is_featured: boolean) {
    const res = await fetch(`${API_BASE}/admin/jobs/${encodeURIComponent(id)}/featured`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ is_featured })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update featured flag');
    return data;
  },

  async adminDeleteJob(token: string, id: string) {
    const res = await fetch(`${API_BASE}/admin/jobs/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete job');
    }
    return res.json();
  },

  async adminGetReports(token: string, status?: string): Promise<Report[]> {
    const query = status ? `?status=${status}` : '';
    const res = await fetch(`${API_BASE}/admin/reports${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  async adminUpdateReport(token: string, id: string, status: Report['status']) {
    const res = await fetch(`${API_BASE}/admin/reports/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update report');
    return res.json();
  },

  async adminAddCategory(token: string, name: string, description?: string): Promise<{ success: boolean; category: Category }> {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, description })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add category');
    return data;
  },

  async adminDeleteCategory(token: string, id: string) {
    const res = await fetch(`${API_BASE}/admin/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete category');
    return data;
  },

  async adminResetSampleData(token: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/admin/seed-reset`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to reset sample data');
    return res.json();
  }
};
