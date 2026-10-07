import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import ImageUpload from '../components/ImageUpload.jsx';
import {
  Cpu,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  Sparkles,
  Terminal,
  Activity,
  Save,
  Sliders,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function TechnologiesAdmin() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [settingsOpen, setSettingsOpen] = useState(true);

  // Section level ecosystem settings
  const [ecosystemSettings, setEcosystemSettings] = useState({
    eyebrow: 'SKILLS & TECHNOLOGIES',
    heading: 'My Tech Ecosystem',
    subtitle: 'Technologies I use to build modern and scalable applications.',
    description:
      'A combination of modern tools, frameworks and best practices to build high-performance web applications and e-commerce solutions.',
    buttonText: 'View Full Stack →',
    buttonUrl: '/stack',
    terminalHeader: "~/rishav's dev --stack",
    systemStatusText: 'All Systems Operational',
    systemStatusActive: true,
  });

  const [savingSettings, setSavingSettings] = useState(false);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Technology form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    logoUrl: '',
    position: 'floating',
    animationDelay: 0.0,
    order: 0,
    isActive: true,
    isHero: false,
    version: 'latest',
    description: '',
    showInTerminal: false,
    terminalVersion: 'latest',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [techs, eco] = await Promise.all([
        api.getAdminTechnologies(),
        api.getAdminTechEcosystem().catch(() => null),
      ]);
      setTechnologies(techs || []);
      if (eco) {
        setEcosystemSettings({
          eyebrow: eco.eyebrow || 'SKILLS & TECHNOLOGIES',
          heading: eco.heading || 'My Tech Ecosystem',
          subtitle: eco.subtitle || 'Technologies I use to build modern and scalable applications.',
          description:
            eco.description ||
            'A combination of modern tools, frameworks and best practices to build high-performance web applications and e-commerce solutions.',
          buttonText: eco.buttonText || 'View Full Stack →',
          buttonUrl: eco.buttonUrl || '/stack',
          terminalHeader: eco.terminalHeader || "~/rishav's dev --stack",
          systemStatusText: eco.systemStatusText || 'All Systems Operational',
          systemStatusActive: eco.systemStatusActive !== false,
        });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to fetch data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEcosystemSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setStatus(null);
    try {
      await api.updateAdminTechEcosystem(ecosystemSettings);
      setStatus({ type: 'success', message: 'Ecosystem section settings updated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to save ecosystem settings.' });
    } finally {
      setSavingSettings(false);
    }
  };

  const openModal = (tech = null) => {
    if (tech) {
      setEditingTech(tech);
      setFormData({
        name: tech.name || '',
        category: tech.category || 'Frontend',
        logoUrl: tech.logoUrl || '',
        position: tech.position || 'floating',
        animationDelay: tech.animationDelay || 0.0,
        order: tech.order || 0,
        isActive: tech.isActive !== false,
        isHero: tech.isHero === true,
        version: tech.version || 'latest',
        description: tech.description || '',
        showInTerminal: tech.showInTerminal === true,
        terminalVersion: tech.terminalVersion || tech.version || 'latest',
      });
    } else {
      setEditingTech(null);
      setFormData({
        name: '',
        category: 'Frontend',
        logoUrl: '',
        position: 'floating',
        animationDelay: 0.0,
        order: technologies.length + 1,
        isActive: true,
        isHero: false,
        version: 'latest',
        description: '',
        showInTerminal: false,
        terminalVersion: 'latest',
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTech(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      if (editingTech) {
        await api.updateTechnology(editingTech.id, formData);
        setStatus({ type: 'success', message: `Technology "${formData.name}" updated!` });
      } else {
        await api.createTechnology(formData);
        setStatus({ type: 'success', message: `Technology "${formData.name}" added!` });
      }
      closeModal();
      const updated = await api.getAdminTechnologies();
      setTechnologies(updated || []);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}"?`)) return;
    try {
      await api.deleteTechnology(id);
      setStatus({ type: 'success', message: `Technology "${name}" deleted.` });
      const updated = await api.getAdminTechnologies();
      setTechnologies(updated || []);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to delete technology.' });
    }
  };

  const positions = [
    { label: 'Floating Hero: Top-Left', value: 'top-left' },
    { label: 'Floating Hero: Top-Right', value: 'top-right' },
    { label: 'Floating Hero: Center-Right', value: 'center-right' },
    { label: 'Floating Hero: Bottom-Right', value: 'bottom-right' },
    { label: 'Floating Hero: Bottom-Left', value: 'bottom-left' },
    { label: 'Floating Hero: Bottom-Center', value: 'bottom-center' },
    { label: 'Standard Ecosystem Card Only', value: 'floating' },
  ];

  const categories = ['Frontend', 'Backend', 'Database', 'Tools & Others', 'E-commerce', 'Core'];

  const filteredTechnologies = technologies.filter((t) => {
    if (activeCategoryFilter === 'All') return true;
    if (activeCategoryFilter === 'Terminal') return t.showInTerminal;
    return (t.category || '').toLowerCase() === activeCategoryFilter.toLowerCase();
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Tech Ecosystem CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            My Tech Ecosystem & Technologies
          </h1>
          <p className="text-xs text-slate-400">
            Control the animated tech ecosystem, terminal stack, system status, and floating cards.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="btn-neon-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white self-start sm:self-auto cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Technology</span>
        </button>
      </div>

      {status && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in ${
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

      {/* ================= SECTION SETTINGS CARD ================= */}
      <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-xl">
        <button
          type="button"
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="w-full px-6 py-4 flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Ecosystem Section & Terminal Settings</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                  Global CMS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Eyebrow, headings, descriptions, button link, terminal prompt, and system status
              </p>
            </div>
          </div>
          {settingsOpen ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {settingsOpen && (
          <form onSubmit={handleSaveEcosystemSettings} className="p-6 space-y-6 border-t border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Section Eyebrow Label
                </label>
                <input
                  type="text"
                  value={ecosystemSettings.eyebrow}
                  onChange={(e) =>
                    setEcosystemSettings({ ...ecosystemSettings, eyebrow: e.target.value })
                  }
                  placeholder="SKILLS & TECHNOLOGIES"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Main Section Heading
                </label>
                <input
                  type="text"
                  value={ecosystemSettings.heading}
                  onChange={(e) =>
                    setEcosystemSettings({ ...ecosystemSettings, heading: e.target.value })
                  }
                  placeholder="My Tech Ecosystem"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Subtitle (Left Side)
                </label>
                <input
                  type="text"
                  value={ecosystemSettings.subtitle}
                  onChange={(e) =>
                    setEcosystemSettings({ ...ecosystemSettings, subtitle: e.target.value })
                  }
                  placeholder="Technologies I use to build modern and scalable applications."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Description (Top Right Side)
                </label>
                <textarea
                  rows={2}
                  value={ecosystemSettings.description}
                  onChange={(e) =>
                    setEcosystemSettings({ ...ecosystemSettings, description: e.target.value })
                  }
                  placeholder="A combination of modern tools, frameworks and best practices to build high-performance web applications and e-commerce solutions."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Button Text
                </label>
                <input
                  type="text"
                  value={ecosystemSettings.buttonText}
                  onChange={(e) =>
                    setEcosystemSettings({ ...ecosystemSettings, buttonText: e.target.value })
                  }
                  placeholder="View Full Stack →"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Button Destination URL
                </label>
                <input
                  type="text"
                  value={ecosystemSettings.buttonUrl}
                  onChange={(e) =>
                    setEcosystemSettings({ ...ecosystemSettings, buttonUrl: e.target.value })
                  }
                  placeholder="/stack"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Terminal Header Prompt</span>
                </label>
                <input
                  type="text"
                  value={ecosystemSettings.terminalHeader}
                  onChange={(e) =>
                    setEcosystemSettings({ ...ecosystemSettings, terminalHeader: e.target.value })
                  }
                  placeholder="~/rishav's dev --stack"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>System Status Text</span>
                </label>
                <input
                  type="text"
                  value={ecosystemSettings.systemStatusText}
                  onChange={(e) =>
                    setEcosystemSettings({ ...ecosystemSettings, systemStatusText: e.target.value })
                  }
                  placeholder="All Systems Operational"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-200">
                <input
                  type="checkbox"
                  checked={ecosystemSettings.systemStatusActive}
                  onChange={(e) =>
                    setEcosystemSettings({
                      ...ecosystemSettings,
                      systemStatusActive: e.target.checked,
                    })
                  }
                  className="rounded bg-white/5 border-white/10 text-emerald-500 focus:ring-0 w-4 h-4"
                />
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>System Status Operational Indicator (Green Pulse)</span>
                </span>
              </label>

              <button
                type="submit"
                disabled={savingSettings}
                className="btn-neon-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50 cursor-pointer self-start sm:self-auto shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? 'Saving Settings...' : 'Save Ecosystem Settings'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ================= CATEGORY FILTER TABS ================= */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        {['All', ...categories, 'Terminal'].map((cat) => {
          const count =
            cat === 'All'
              ? technologies.length
              : cat === 'Terminal'
              ? technologies.filter((t) => t.showInTerminal).length
              : technologies.filter((t) => (t.category || '').toLowerCase() === cat.toLowerCase()).length;

          return (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategoryFilter === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeCategoryFilter === cat ? 'bg-black/30 text-white' : 'bg-white/10 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ================= TECHNOLOGY CARDS GRID ================= */}
      {loading ? (
        <div className="py-20 text-center font-mono text-cyan-400 text-sm">Loading technologies...</div>
      ) : filteredTechnologies.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-3xl border border-white/5 space-y-3">
          <p className="text-slate-400 text-sm">No technologies found in this category.</p>
          <button
            onClick={() => openModal()}
            className="btn-neon-secondary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add One Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTechnologies.map((tech) => (
            <div
              key={tech.id}
              className={`glass-card p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 group ${
                tech.isActive
                  ? 'border-white/5 hover:border-cyan-500/40 hover:bg-white/[0.04]'
                  : 'border-white/5 opacity-50 bg-black/40'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 p-2 flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  <img
                    src={tech.logoUrl}
                    alt={tech.name}
                    className="w-full h-full object-contain filter"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white truncate">{tech.name}</h3>
                    {tech.version && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/20">
                        {tech.version}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <span className="text-slate-300 font-semibold">{tech.category}</span>
                    <span>•</span>
                    <span>#{tech.order}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    {tech.showInTerminal && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-purple-950/50 text-purple-300 border border-purple-500/20">
                        <Terminal className="w-2.5 h-2.5" />
                        <span>Terminal: {tech.terminalVersion || tech.version}</span>
                      </span>
                    )}
                    {tech.isHero && (
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-950/50 text-cyan-300 border border-cyan-500/20">
                        ★ Hero
                      </span>
                    )}
                    {!tech.isActive && (
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-rose-950/50 text-rose-300 border border-rose-500/20">
                        Disabled
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => openModal(tech)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Edit Technology"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(tech.id, tech.name)}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors cursor-pointer"
                  title="Delete Technology"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= ADD / EDIT MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card w-full max-w-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <span>{editingTech ? `Edit: ${editingTech.name}` : 'Add Technology'}</span>
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-white cursor-pointer p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    Technology Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. React.js, PostgreSQL"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    Ecosystem Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090d20] border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <ImageUpload
                label="Technology Logo (SVG / PNG)"
                value={formData.logoUrl}
                onChange={(url) => setFormData({ ...formData, logoUrl: url })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    Version / Label
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="e.g. v19, latest, v22"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>
              </div>

              {/* Terminal settings */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-200">
                  <input
                    type="checkbox"
                    checked={formData.showInTerminal}
                    onChange={(e) =>
                      setFormData({ ...formData, showInTerminal: e.target.checked })
                    }
                    className="rounded bg-white/5 border-white/10 text-cyan-500 focus:ring-0 w-4 h-4"
                  />
                  <span className="font-bold flex items-center gap-1.5 text-cyan-300">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Include in Terminal Panel Stack</span>
                  </span>
                </label>

                {formData.showInTerminal && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                      Terminal Version Display
                    </label>
                    <input
                      type="text"
                      value={formData.terminalVersion}
                      onChange={(e) =>
                        setFormData({ ...formData, terminalVersion: e.target.value })
                      }
                      placeholder="e.g. v19, latest"
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-xs font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Hero floating orbit settings (preserved) */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-200">
                    <input
                      type="checkbox"
                      checked={formData.isHero}
                      onChange={(e) => setFormData({ ...formData, isHero: e.target.checked })}
                      className="rounded bg-white/5 border-white/10 text-cyan-500 focus:ring-0 w-4 h-4"
                    />
                    <span>Float in Hero Developer Section</span>
                  </label>
                </div>

                {formData.isHero && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">Orbit Position</label>
                      <select
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#090d20] border border-white/10 text-white text-xs"
                      >
                        {positions.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">Delay (sec)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.animationDelay}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            animationDelay: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded bg-white/5 border-white/10 text-cyan-500 focus:ring-0 w-4 h-4"
                  />
                  <span className="text-slate-200">Active (Visible on Portfolio)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.logoUrl}
                  className="btn-neon-primary px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : editingTech ? 'Save Changes' : 'Create Technology'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
