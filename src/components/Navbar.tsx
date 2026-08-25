import React, { useState } from 'react';
import { Briefcase, BookOpen, Lock, Menu, X, LogOut, GraduationCap, Laptop } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: 'home' | 'jobs' | 'internship' | 'freelancing' | 'courses' | 'admin';
  onNavigate: (tab: 'home' | 'jobs' | 'internship' | 'freelancing' | 'courses' | 'admin') => void;
  onOpenAdminLogin: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  onOpenAdminLogin
}) => {
  const { isAdmin, logout, username } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: 'home' | 'jobs' | 'internship' | 'freelancing' | 'courses' | 'admin') => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand Identity (Karnataka Flag Yellow & Red Motif) */}
          <div 
            id="brand-logo"
            onClick={() => handleNav('home')} 
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            {/* Karnataka flag dual-tone icon (Yellow Top, Red Bottom) */}
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-amber-300/60 flex flex-col group-hover:scale-105 transition-transform shrink-0">
              <div className="h-1/2 bg-amber-400 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 opacity-60" />
              </div>
              <div className="h-1/2 bg-red-600 flex items-center justify-center text-white">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center">
                  Jobs<span className="text-red-600">Karunadu</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Verified Career &amp; Job Application Hub</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-btn-home"
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'home'
                  ? 'bg-amber-50 text-red-600 font-bold border-b-2 border-red-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              id="nav-btn-jobs"
              onClick={() => handleNav('jobs')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'jobs'
                  ? 'bg-amber-50 text-red-600 font-bold border-b-2 border-red-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Jobs
            </button>
            <button
              id="nav-btn-internship"
              onClick={() => handleNav('internship')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'internship'
                  ? 'bg-amber-50 text-red-600 font-bold border-b-2 border-red-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
              Internship
            </button>
            <button
              id="nav-btn-freelancing"
              onClick={() => handleNav('freelancing')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'freelancing'
                  ? 'bg-amber-50 text-red-600 font-bold border-b-2 border-red-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Laptop className="w-3.5 h-3.5 text-amber-600" />
              Freelancing
            </button>
            <button
              id="nav-btn-courses"
              onClick={() => handleNav('courses')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'courses'
                  ? 'bg-amber-50 text-red-600 font-bold border-b-2 border-red-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              Course
            </button>
          </nav>

          {/* Right Actions: Admin Access */}
          <div className="flex items-center gap-2.5">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  id="nav-btn-admin-dashboard"
                  onClick={() => handleNav('admin')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    activeTab === 'admin'
                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                      : 'bg-amber-50 text-red-700 border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  Admin Dashboard
                </button>
                <button
                  id="nav-btn-admin-logout"
                  onClick={logout}
                  title="Logout from Admin"
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="nav-btn-admin-icon-login"
                onClick={onOpenAdminLogin}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-amber-50 rounded-lg border border-slate-200 transition-colors"
                title="Portal"
                aria-label="Portal Login"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            {/* Mobile menu toggle button */}
            <button
              id="nav-btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div id="mobile-nav-drawer" className="md:hidden border-t border-slate-200 py-3 space-y-1 bg-white">
            <button
              onClick={() => handleNav('home')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'home' ? 'bg-amber-50 text-red-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('jobs')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'jobs' ? 'bg-amber-50 text-red-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Jobs
            </button>
            <button
              onClick={() => handleNav('internship')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                activeTab === 'internship' ? 'bg-amber-50 text-red-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-amber-600" />
              Internship
            </button>
            <button
              onClick={() => handleNav('freelancing')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                activeTab === 'freelancing' ? 'bg-amber-50 text-red-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Laptop className="w-4 h-4 text-amber-600" />
              Freelancing
            </button>
            <button
              onClick={() => handleNav('courses')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                activeTab === 'courses' ? 'bg-amber-50 text-red-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              Course
            </button>
            {isAdmin && (
              <button
                onClick={() => handleNav('admin')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-red-600 text-white mt-2 flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Admin Dashboard ({username})
              </button>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
