import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import {
  BarChart2,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Hash,
} from 'lucide-react';

export default function StatsAdmin() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [formData, setFormData] = useState({
    value: '',
    label: '',
    order: 0,
    isActive: true,
  });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminStats();
      setStats(data);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to fetch statistics.' });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (stat = null) => {
    if (stat) {
      setEditingStat(stat);
      setFormData({
        value: stat.value,
        label: stat.label,
        order: stat.order || 0,
        isActive: stat.isActive !== false,
      });
    } else {
      setEditingStat(null);
      setFormData({
        value: '',
        label: '',
        order: stats.length + 1,
        isActive: true,
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingStat(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      if (editingStat) {
        await api.updateStat(editingStat.id, formData);
        setStatus({ type: 'success', message: `Statistic "${formData.label}" updated!` });
      } else {
        await api.createStat(formData);
        setStatus({ type: 'success', message: `Statistic "${formData.label}" created!` });
      }
      closeModal();
      fetchStats();
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, label) => {
    if (!window.confirm(`Delete statistic "${label}"?`)) return;
    try {
      await api.deleteStat(id);
      setStatus({ type: 'success', message: `Statistic removed.` });
      fetchStats();
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to delete statistic.' });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-1">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Hero Metric Counters</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Statistics Management
          </h1>
          <p className="text-xs text-slate-400">
            Control the dynamic numeric highlights displayed directly beneath the hero section.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="btn-neon-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Statistic</span>
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

      {/* Stats Cards */}
      {loading ? (
        <div className="py-20 text-center font-mono text-cyan-400 text-sm">Loading statistics...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((s) => (
            <div
              key={s.id}
              className="glass-card p-6 rounded-2xl border border-white/5 flex items-center justify-between gap-4"
            >
              <div>
                <span className="text-3xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  {s.value}
                </span>
                <h4 className="text-sm font-semibold text-white mt-1">{s.label}</h4>
                <span className="text-[10px] font-mono text-slate-500">Order: {s.order}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal(s)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(s.id, s.label)}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card w-full max-w-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-lg font-display font-bold text-white">
                {editingStat ? 'Edit Statistic' : 'Add Statistic'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Display Value (e.g. 10+, 99.9%, 2+) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="10+"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Label / Description *
                </label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Projects Completed"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded bg-white/5 border-white/10 text-cyan-500 focus:ring-0"
                    />
                    <span>Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-neon-primary px-5 py-2 rounded-xl text-xs font-bold uppercase text-white"
                >
                  {submitting ? 'Saving...' : 'Save Statistic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
