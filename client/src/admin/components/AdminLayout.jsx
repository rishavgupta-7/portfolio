import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Sparkles,
  Cpu,
  Layers,
  ShoppingBag,
  User,
  Quote,
  BarChart2,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Terminal,
  Workflow,
} from 'lucide-react';

export default function AdminLayout() {
  const { admin, isAuthenticated, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070f] flex items-center justify-center text-cyan-400 font-mono text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Verifying Admin Credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/stark/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/stark/dashboard', icon: LayoutDashboard },
    { name: 'Hero Section', path: '/stark/hero', icon: Sparkles },
    { name: 'Technologies', path: '/stark/technologies', icon: Cpu },
    { name: 'Projects', path: '/stark/projects', icon: Layers },
    { name: 'Services', path: '/stark/services', icon: ShoppingBag },
    { name: 'Process & Workflow', path: '/stark/process', icon: Workflow },
    { name: 'About & Bio', path: '/stark/about', icon: User },
    { name: 'Testimonials', path: '/stark/testimonials', icon: Quote },
    { name: 'Statistics', path: '/stark/stats', icon: BarChart2 },
    { name: 'Messages', path: '/stark/messages', icon: Mail },
    { name: 'Settings', path: '/stark/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/stark/login');
  };

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#070b18] z-30">
        {/* Brand */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px]">
              <div className="w-full h-full bg-[#070b19] rounded-[11px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-base text-white tracking-wide">
                STARK<span className="text-cyan-400"> CMS</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                Admin Control
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">{admin?.name || 'Rishav Gupta'}</span>
              <span className="text-[10px] text-slate-500 font-mono truncate max-w-[140px]">
                {admin?.email}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Admin
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 bg-[#070b18]/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>/stark{location.pathname.replace('/stark', '')}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </a>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden p-4 border-b border-white/5 bg-[#070b18] space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm ${
                    active ? 'bg-cyan-500/10 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        )}

        {/* Dynamic Nested Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
