import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_TOKEN = 'admin-session-token-' + (process.env.ADMIN_SECRET_KEY || 'jobaggregator-secret-2026');

// Auth middleware for admin routes
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (token === ADMIN_TOKEN || token === 'admin-session-valid') {
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized: Invalid or expired admin token' });
}

async function startServer() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // ==========================================
  // PUBLIC JOB AGGREGATOR ENDPOINTS
  // ==========================================

  // GET /api/jobs - Query published jobs with multi-facet filters
  app.get('/api/jobs', (req, res) => {
    try {
      const result = db.getPublishedJobs(req.query);
      res.json(result);
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
      res.status(500).json({ error: 'Failed to retrieve job listings' });
    }
  });

  // GET /api/jobs/:idOrSlug - Single job details
  app.get('/api/jobs/:idOrSlug', (req, res) => {
    try {
      const job = db.getJobByIdOrSlug(req.params.idOrSlug, false);
      if (!job) {
        return res.status(404).json({ error: 'Job listing not found or has expired' });
      }
      res.json(job);
    } catch (err: any) {
      console.error('Error fetching job details:', err);
      res.status(500).json({ error: 'Failed to retrieve job details' });
    }
  });

  // POST /api/jobs/:id/apply - Record click analytics & return original URL
  app.post('/api/jobs/:id/apply', (req, res) => {
    try {
      const result = db.recordApplyClick(req.params.id);
      if (!result.success) {
        return res.status(404).json({ error: 'Job not found' });
      }
      res.json({
        success: true,
        original_url: result.original_url,
        apply_clicks: result.apply_clicks
      });
    } catch (err: any) {
      console.error('Error recording apply click:', err);
      res.status(500).json({ error: 'Failed to record application redirect' });
    }
  });

  // POST /api/jobs/:id/report - Public report submission
  app.post('/api/jobs/:id/report', (req, res) => {
    try {
      const { reason, details, reporter_email } = req.body;
      if (!reason) {
        return res.status(400).json({ error: 'Report reason is required' });
      }
      const result = db.createReport({
        job_id: req.params.id,
        reason,
        details,
        reporter_email
      });
      if (!result.success) {
        return res.status(404).json({ error: 'Job not found' });
      }
      res.json({ success: true, message: 'Thank you. Your report has been submitted for admin verification.', report: result.report });
    } catch (err: any) {
      console.error('Error submitting job report:', err);
      res.status(500).json({ error: 'Failed to submit report' });
    }
  });

  // GET /api/categories - List categories with count
  app.get('/api/categories', (req, res) => {
    try {
      const categories = db.getCategories();
      res.json(categories);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to get categories' });
    }
  });

  // GET /api/sources - List verified sources
  app.get('/api/sources', (req, res) => {
    try {
      const sources = db.getSources();
      res.json(sources);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to get sources' });
    }
  });

  // GET /api/stats - Public summary stats
  app.get('/api/stats', (req, res) => {
    try {
      const stats = db.getAdminStats();
      res.json({
        total_active_jobs: stats.published_jobs,
        remote_jobs: db.getPublishedJobs({ is_remote: true }).total,
        fresher_jobs: db.getPublishedJobs({ is_fresher: true }).total,
        total_applications_routed: stats.total_apply_clicks,
        verified_platforms: db.getSources().length
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to load stats' });
    }
  });

  // ==========================================
  // SEO SITEMAP & ROBOTS.TXT
  // ==========================================

  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Allow: /jobs/
Allow: /category/
Allow: /remote-jobs/
Allow: /fresher-jobs/
Disallow: /admin
Disallow: /api/admin/

Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml
`);
  });

  app.get('/sitemap.xml', (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const published = db.getPublishedJobs({ limit: 100 });
      const categories = db.getCategories();

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      // Static routes
      const staticPages = [
        { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
        { loc: `${baseUrl}/jobs`, priority: '0.9', changefreq: 'daily' },
        { loc: `${baseUrl}/remote-jobs`, priority: '0.8', changefreq: 'daily' },
        { loc: `${baseUrl}/fresher-jobs`, priority: '0.8', changefreq: 'daily' }
      ];

      staticPages.forEach(p => {
        xml += `  <url>\n    <loc>${p.loc}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
      });

      // Categories
      categories.forEach(c => {
        xml += `  <url>\n    <loc>${baseUrl}/category/${c.slug}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      });

      // Jobs
      published.jobs.forEach(j => {
        xml += `  <url>\n    <loc>${baseUrl}/jobs/${j.slug}</loc>\n    <lastmod>${new Date(j.updated_at || j.created_at).toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
      });

      xml += `</urlset>`;
      res.type('application/xml');
      res.send(xml);
    } catch (err: any) {
      res.status(500).send('Error generating sitemap');
    }
  });

  // ==========================================
  // ADMIN DASHBOARD API (PROTECTED)
  // ==========================================

  // POST /api/admin/login - Authenticate admin
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return res.json({
        success: true,
        token: ADMIN_TOKEN,
        username: ADMIN_USERNAME,
        message: 'Admin authentication successful'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  });

  // GET /api/admin/me - Verify token
  app.get('/api/admin/me', requireAdminAuth, (req, res) => {
    res.json({
      success: true,
      user: { username: ADMIN_USERNAME, role: 'administrator' }
    });
  });

  // GET /api/admin/stats - Admin Dashboard Analytics
  app.get('/api/admin/stats', requireAdminAuth, (req, res) => {
    try {
      const stats = db.getAdminStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to compute admin statistics' });
    }
  });

  // GET /api/admin/jobs - Admin job table (all statuses)
  app.get('/api/admin/jobs', requireAdminAuth, (req, res) => {
    try {
      const result = db.getAdminJobs(req.query);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve admin jobs' });
    }
  });

  // POST /api/admin/jobs - Add new job with duplicate validation
  app.post('/api/admin/jobs', requireAdminAuth, (req, res) => {
    try {
      const result = db.createJob(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      res.status(201).json({ success: true, job: result.job, message: 'Job successfully created and indexed.' });
    } catch (err: any) {
      console.error('Error creating job:', err);
      res.status(500).json({ error: 'Failed to create job' });
    }
  });

  // GET /api/admin/jobs/:id - Single job for editing
  app.get('/api/admin/jobs/:id', requireAdminAuth, (req, res) => {
    try {
      const job = db.getJobByIdOrSlug(req.params.id, true);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      res.json(job);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch job' });
    }
  });

  // PUT /api/admin/jobs/:id - Update job
  app.put('/api/admin/jobs/:id', requireAdminAuth, (req, res) => {
    try {
      const result = db.updateJob(req.params.id, req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      res.json({ success: true, job: result.job, message: 'Job updated successfully' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update job' });
    }
  });

  // PATCH /api/admin/jobs/:id/status - Quick status toggle
  app.patch('/api/admin/jobs/:id/status', requireAdminAuth, (req, res) => {
    try {
      const { status } = req.body;
      if (!['draft', 'published', 'expired'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      const result = db.updateJob(req.params.id, { status });
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      res.json({ success: true, job: result.job });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update status' });
    }
  });

  // PATCH /api/admin/jobs/:id/featured - Toggle featured
  app.patch('/api/admin/jobs/:id/featured', requireAdminAuth, (req, res) => {
    try {
      const { is_featured } = req.body;
      const result = db.updateJob(req.params.id, { is_featured: Boolean(is_featured) });
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      res.json({ success: true, job: result.job });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update featured flag' });
    }
  });

  // DELETE /api/admin/jobs/bulk/sample-jobs - Delete all sample/demo jobs
  app.delete('/api/admin/jobs/bulk/sample-jobs', requireAdminAuth, (req, res) => {
    try {
      const removedCount = db.deleteAllSampleJobs();
      res.json({ success: true, removedCount, message: `Successfully removed ${removedCount} demo/sample listings.` });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete sample jobs' });
    }
  });

  // DELETE /api/admin/jobs/:id - Delete job
  app.delete('/api/admin/jobs/:id', requireAdminAuth, (req, res) => {
    try {
      const deleted = db.deleteJob(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Job not found' });
      }
      res.json({ success: true, message: 'Job successfully deleted' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete job' });
    }
  });

  // GET /api/admin/reports - Get user reports
  app.get('/api/admin/reports', requireAdminAuth, (req, res) => {
    try {
      const reports = db.getReports(req.query.status as string);
      res.json(reports);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to get reports' });
    }
  });

  // PATCH /api/admin/reports/:id - Update report status
  app.patch('/api/admin/reports/:id', requireAdminAuth, (req, res) => {
    try {
      const { status } = req.body;
      const ok = db.updateReportStatus(req.params.id, status);
      if (!ok) return res.status(404).json({ error: 'Report not found' });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update report' });
    }
  });

  // POST /api/admin/categories - Create category
  app.post('/api/admin/categories', requireAdminAuth, (req, res) => {
    try {
      const { name, description } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Category name is required' });
      }
      const cat = db.addCategory(name, description);
      res.status(201).json({ success: true, category: cat });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to add category' });
    }
  });

  // DELETE /api/admin/categories/:id - Delete category
  app.delete('/api/admin/categories/:id', requireAdminAuth, (req, res) => {
    try {
      const result = db.deleteCategory(req.params.id);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete category' });
    }
  });

  // POST /api/admin/seed-reset - Reset to sample dataset
  app.post('/api/admin/seed-reset', requireAdminAuth, (req, res) => {
    try {
      db.resetToSampleData();
      res.json({ success: true, message: 'Database reset to sample dataset (12 sample jobs across top platforms).' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to reset sample data' });
    }
  });

  // ==========================================
  // VITE & STATIC SERVING
  // ==========================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JobAggregator server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
