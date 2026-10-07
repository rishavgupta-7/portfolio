import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import ImageUpload from '../components/ImageUpload.jsx';
import { Save, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

export default function HeroAdmin() {
  const [formData, setFormData] = useState({
    name: '',
    highlightedName: '',
    title: '',
    description: '',
    availabilityText: '',
    location: '',
    remoteText: '',
    techLabels: '',
    primaryBtnText: '',
    primaryBtnUrl: '',
    secondaryBtnText: '',
    secondaryBtnUrl: '',
    clientProofText: '',
    heroImage: '',
    bgImage: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminHero();
      if (res.hero) {
        setFormData({
          name: res.hero.name || '',
          highlightedName: res.hero.highlightedName || '',
          title: res.hero.title || '',
          description: res.hero.description || '',
          availabilityText: res.hero.availabilityText || '',
          location: res.hero.location || '',
          remoteText: res.hero.remoteText || '',
          techLabels: Array.isArray(res.hero.techLabels)
            ? res.hero.techLabels.join(', ')
            : res.hero.techLabels || '',
          primaryBtnText: res.hero.primaryBtnText || '',
          primaryBtnUrl: res.hero.primaryBtnUrl || '',
          secondaryBtnText: res.hero.secondaryBtnText || '',
          secondaryBtnUrl: res.hero.secondaryBtnUrl || '',
          clientProofText: res.hero.clientProofText || '',
          heroImage: res.hero.heroImage || '',
          bgImage: res.hero.bgImage || '',
        });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to load Hero data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const payload = {
        ...formData,
        techLabels: formData.techLabels
          ? formData.techLabels.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };
      await api.updateHero(payload);
      setStatus({ type: 'success', message: 'Hero section saved successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to update Hero section.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center font-mono text-cyan-400 text-sm">Loading Hero configuration...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Content Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Hero Section Editor
          </h1>
          <p className="text-xs text-slate-400">
            Edit text, upload developer illustrations, and update hero button actions.
          </p>
        </div>

        <button
          onClick={fetchHero}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload</span>
        </button>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images Card */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <h2 className="text-base font-display font-bold text-white border-b border-white/5 pb-3">
            Developer Illustration & Graphics
          </h2>

          <ImageUpload
            label="Developer / Hero Illustration"
            value={formData.heroImage}
            onChange={(url) => setFormData({ ...formData, heroImage: url })}
          />

          <ImageUpload
            label="Optional Background Graphic / Texture"
            value={formData.bgImage}
            onChange={(url) => setFormData({ ...formData, bgImage: url })}
          />
        </div>

        {/* Identity & Headings Card */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
          <h2 className="text-base font-display font-bold text-white border-b border-white/5 pb-3">
            Name, Titles & Availability
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Rishav Gupta"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Highlighted Word in Name
              </label>
              <input
                type="text"
                name="highlightedName"
                value={formData.highlightedName}
                onChange={handleChange}
                placeholder="Rishav"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Main Professional Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Full-Stack & Shopify Developer"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Hero Introduction / Description
            </label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm resize-none font-light"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Availability Badge Text
              </label>
              <input
                type="text"
                name="availabilityText"
                value={formData.availabilityText}
                onChange={handleChange}
                placeholder="Available for freelance work"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="India"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Remote Availability
              </label>
              <input
                type="text"
                name="remoteText"
                value={formData.remoteText}
                onChange={handleChange}
                placeholder="Available for Remote Worldwide"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Technology Category Labels (Comma separated)
            </label>
            <input
              type="text"
              name="techLabels"
              value={formData.techLabels}
              onChange={handleChange}
              placeholder="Full-Stack Development, Shopify Plus, React Ecosystem, Node.js & APIs"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm font-mono"
            />
          </div>
        </div>

        {/* CTA Buttons & Social Proof Card */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
          <h2 className="text-base font-display font-bold text-white border-b border-white/5 pb-3">
            Buttons & Social Proof
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Primary Button Text
              </label>
              <input
                type="text"
                name="primaryBtnText"
                value={formData.primaryBtnText}
                onChange={handleChange}
                placeholder="Start a Project"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Primary Button URL
              </label>
              <input
                type="text"
                name="primaryBtnUrl"
                value={formData.primaryBtnUrl}
                onChange={handleChange}
                placeholder="/contact"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Secondary Button Text
              </label>
              <input
                type="text"
                name="secondaryBtnText"
                value={formData.secondaryBtnText}
                onChange={handleChange}
                placeholder="Explore Work"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Secondary Button URL
              </label>
              <input
                type="text"
                name="secondaryBtnUrl"
                value={formData.secondaryBtnUrl}
                onChange={handleChange}
                placeholder="/work"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Social Proof / Rating Text
            </label>
            <input
              type="text"
              name="clientProofText"
              value={formData.clientProofText}
              onChange={handleChange}
              placeholder="5.0 Rating • 100% Client Satisfaction Worldwide"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-neon-primary px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating Database...' : 'Save Hero Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
