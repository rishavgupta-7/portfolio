import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import {
  Workflow,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Save,
  Sliders,
  Search,
  FileText,
  Code,
  Rocket,
  Layers,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

const iconComponents = {
  Search: Search,
  FileText: FileText,
  Code: Code,
  Rocket: Rocket,
  Workflow: Workflow,
  Layers: Layers,
};

const iconOptions = ['Search', 'FileText', 'Code', 'Rocket', 'Workflow', 'Layers'];

export default function ProcessAdmin() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(true);

  // Section level process settings
  const [processSettings, setProcessSettings] = useState({
    eyebrow: 'MY PROCESS',
    heading: 'How I Develop',
    description: 'A simple and transparent process to turn your ideas into a successful digital product.',
  });

  const [savingSettings, setSavingSettings] = useState(false);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Step modal form data
  const [formData, setFormData] = useState({
    stepNumber: '01',
    title: '',
    description: '',
    icon: 'Search',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminProcess();
      if (data.setting) {
        setProcessSettings({
          eyebrow: data.setting.eyebrow || 'MY PROCESS',
          heading: data.setting.heading || 'How I Build',
          description:
            data.setting.description ||
            'A simple and transparent process to turn your ideas into a successful digital product.',
        });
      }
      setSteps(data.steps || []);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to fetch process data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setStatus(null);
    try {
      await api.updateAdminProcessSettings(processSettings);
      setStatus({ type: 'success', message: 'Process section settings updated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to save settings.' });
    } finally {
      setSavingSettings(false);
    }
  };

  const openModal = (step = null) => {
    if (step) {
      setEditingStep(step);
      setFormData({
        stepNumber: step.stepNumber || '01',
        title: step.title || '',
        description: step.description || '',
        icon: step.icon || 'Search',
        order: step.order || 0,
        isActive: step.isActive !== false,
      });
    } else {
      setEditingStep(null);
      const nextNum = (steps.length + 1).toString().padStart(2, '0');
      setFormData({
        stepNumber: nextNum,
        title: '',
        description: '',
        icon: 'Search',
        order: steps.length + 1,
        isActive: true,
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingStep(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      if (editingStep) {
        await api.updateAdminProcessStep(editingStep.id, formData);
        setStatus({ type: 'success', message: `Step "${formData.title}" updated!` });
      } else {
        await api.createAdminProcessStep(formData);
        setStatus({ type: 'success', message: `Step "${formData.title}" added!` });
      }
      closeModal();
      const updated = await api.getAdminProcess();
      setSteps(updated.steps || []);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove step "${title}"?`)) return;
    try {
      await api.deleteAdminProcessStep(id);
      setStatus({ type: 'success', message: `Step "${title}" deleted.` });
      const updated = await api.getAdminProcess();
      setSteps(updated.steps || []);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to delete step.' });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono uppercase tracking-widest mb-1">
            <Workflow className="w-3.5 h-3.5" />
            <span>Workflow & Pipeline Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            How I Build — Process CMS
          </h1>
          <p className="text-xs text-slate-400">
            Manage the animated 4-stage developer workflow, icons, descriptions, and section metadata.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="btn-neon-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white self-start sm:self-auto cursor-pointer shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Process Step</span>
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
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Section Header & Copy Settings</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-400 border border-purple-500/30">
                  Global
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Eyebrow, main heading, and section description text
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
          <form onSubmit={handleSaveSettings} className="p-6 space-y-6 border-t border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Section Eyebrow Label
                </label>
                <input
                  type="text"
                  value={processSettings.eyebrow}
                  onChange={(e) =>
                    setProcessSettings({ ...processSettings, eyebrow: e.target.value })
                  }
                  placeholder="MY PROCESS"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400 text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Main Heading
                </label>
                <input
                  type="text"
                  value={processSettings.heading}
                  onChange={(e) =>
                    setProcessSettings({ ...processSettings, heading: e.target.value })
                  }
                  placeholder="How I Develop"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400 text-sm"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Section Description
                </label>
                <textarea
                  rows={2}
                  value={processSettings.description}
                  onChange={(e) =>
                    setProcessSettings({ ...processSettings, description: e.target.value })
                  }
                  placeholder="A simple and transparent process to turn your ideas into a successful digital product."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400 text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-white/5">
              <button
                type="submit"
                disabled={savingSettings}
                className="btn-neon-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? 'Saving Settings...' : 'Save Process Settings'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ================= PROCESS STEPS GRID ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <span>Workflow Stages</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
              {steps.length} stages
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="py-20 text-center font-mono text-purple-400 text-sm">
            Loading workflow steps...
          </div>
        ) : steps.length === 0 ? (
          <div className="p-12 text-center glass-card rounded-3xl border border-white/5 space-y-3">
            <p className="text-slate-400 text-sm">No workflow stages configured yet.</p>
            <button
              onClick={() => openModal()}
              className="btn-neon-secondary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stage</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step) => {
              const IconComponent = iconComponents[step.icon] || Workflow;
              return (
                <div
                  key={step.id}
                  className={`glass-card p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-4 group ${
                    step.isActive
                      ? 'border-white/10 hover:border-purple-500/40 hover:bg-white/[0.04]'
                      : 'border-white/5 opacity-50 bg-black/40'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center p-2.5 text-purple-300 shadow-inner group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-xl font-display font-extrabold text-purple-400/80 font-mono">
                        {step.stepNumber}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        step.isActive
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/20'
                          : 'bg-rose-950/60 text-rose-300 border border-rose-500/20'
                      }`}
                    >
                      {step.isActive ? 'Active' : 'Disabled'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openModal(step)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(step.id, step.title)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= ADD / EDIT MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card w-full max-w-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Workflow className="w-5 h-5 text-purple-400" />
                <span>{editingStep ? `Edit: ${editingStep.title}` : 'Add Process Stage'}</span>
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-white cursor-pointer p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    Step Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.stepNumber}
                    onChange={(e) => setFormData({ ...formData, stepNumber: e.target.value })}
                    placeholder="01"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400 text-sm font-mono"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Stage Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Discover, Design, Develop, Deploy"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090d20] border border-white/10 text-white focus:outline-none focus:border-purple-400 text-sm"
                >
                  {iconOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Stage Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Understand your goals, requirements and target audience."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400 text-sm resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded bg-white/5 border-white/10 text-purple-500 focus:ring-0 w-4 h-4"
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
                  disabled={submitting}
                  className="btn-neon-primary px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : editingStep ? 'Save Changes' : 'Create Stage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
