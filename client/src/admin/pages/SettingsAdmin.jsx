import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import ImageUpload from '../components/ImageUpload.jsx';
import {
  Settings,
  Save,
  Lock,
  CheckCircle2,
  AlertCircle,
  Shield,
  Globe,
} from 'lucide-react';

export default function SettingsAdmin() {
  const [settings, setSettings] = useState({
    siteTitle: '',
    metaDescription: '',
    ogImage: '',
    contactEmail: '',
    contactPhone: '',
    footerText: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [status, setStatus] = useState(null);
  const [passwordStatus, setPasswordStatus] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminSettings();
      setSettings(data);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to fetch settings.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setStatus(null);

    try {
      await api.updateAdminSettings(settings);
      setStatus({ type: 'success', message: 'SEO and Site Settings updated!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to save settings.' });
    } finally {
      setSavingSettings(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordStatus({ type: 'error', message: 'Password must be at least 8 characters long.' });
      return;
    }

    setSavingPassword(true);
    try {
      await api.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordStatus({ type: 'success', message: 'Admin security password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordStatus({ type: 'error', message: err.message || 'Failed to update password.' });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center font-mono text-cyan-400 text-sm">Loading settings...</div>;
  }

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>System & Security</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
          Global Settings & Security
        </h1>
        <p className="text-xs text-slate-400">
          Manage SEO meta tags, social preview thumbnails, footer text, and admin authentication credentials.
        </p>
      </div>

      {/* 1. Site & SEO Settings Form */}
      <form onSubmit={handleSettingsSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-display font-bold text-white">
            SEO & Brand Metadata
          </h2>
        </div>

        {status && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-sm ${
              status.type === 'success'
                ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
            Browser Page Title (SEO)
          </label>
          <input
            type="text"
            required
            value={settings.siteTitle || ''}
            onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
            placeholder="Rishav Gupta | Full-Stack & Shopify Developer"
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
            Meta Description (Search Engines & Social Cards)
          </label>
          <textarea
            rows={2}
            value={settings.metaDescription || ''}
            onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
            placeholder="Portfolio of Rishav Gupta - Full-Stack Developer & Shopify Specialist..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm resize-none font-light"
          ></textarea>
        </div>

        <ImageUpload
          label="Open Graph / Social Sharing Image (1200x630)"
          value={settings.ogImage || ''}
          onChange={(url) => setSettings({ ...settings, ogImage: url })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Public Contact Email
            </label>
            <input
              type="email"
              value={settings.contactEmail || ''}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Public Contact Phone
            </label>
            <input
              type="text"
              value={settings.contactPhone || ''}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
            Footer Copyright Text
          </label>
          <input
            type="text"
            value={settings.footerText || ''}
            onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
            placeholder="Engineered with React, Node.js & Prisma. All rights reserved."
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingSettings}
            className="btn-neon-primary px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

      {/* 2. Admin Password Change Form */}
      <form onSubmit={handlePasswordSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Shield className="w-5 h-5 text-purple-400" />
          <h2 className="text-base font-display font-bold text-white">
            Admin Account Credentials
          </h2>
        </div>

        {passwordStatus && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-sm ${
              passwordStatus.type === 'success'
                ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
            }`}
          >
            {passwordStatus.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            )}
            <span>{passwordStatus.message}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Current Admin Password *
            </label>
            <input
              type="password"
              required
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                New Admin Password * (min 8 chars)
              </label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingPassword}
            className="btn-neon-primary px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{savingPassword ? 'Updating...' : 'Change Password'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
