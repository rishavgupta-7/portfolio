import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import {
  ShoppingBag,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Code2,
  Server,
  Zap,
  Cpu,
  Layers,
} from 'lucide-react';

const iconOptions = ['Code2', 'ShoppingBag', 'Server', 'Zap', 'Cpu', 'Layers'];

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Code2',
    technologies: '',
    order: 0,
    isActive: true,
  });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminServices();
      setServices(data);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to fetch services.' });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (svc = null) => {
    if (svc) {
      setEditingService(svc);
      setFormData({
        title: svc.title,
        description: svc.description,
        icon: svc.icon || 'Code2',
        technologies: Array.isArray(svc.technologies) ? svc.technologies.join(', ') : svc.technologies || '',
        order: svc.order || 0,
        isActive: svc.isActive !== false,
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        icon: 'Code2',
        technologies: '',
        order: services.length + 1,
        isActive: true,
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingService(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const payload = {
        ...formData,
        technologies: formData.technologies
          ? formData.technologies.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };

      if (editingService) {
        await api.updateService(editingService.id, payload);
        setStatus({ type: 'success', message: `Service "${formData.title}" updated!` });
      } else {
        await api.createService(payload);
        setStatus({ type: 'success', message: `Service "${formData.title}" created!` });
      }
      closeModal();
      fetchServices();
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete service "${title}"?`)) return;
    try {
      await api.deleteService(id);
      setStatus({ type: 'success', message: `Service "${title}" deleted.` });
      fetchServices();
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to delete service.' });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Service Catalog Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Services & Offerings
          </h1>
          <p className="text-xs text-slate-400">
            Configure client service offerings, tech frameworks, and descriptions.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="btn-neon-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
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

      {/* Services Grid */}
      {loading ? (
        <div className="py-20 text-center font-mono text-cyan-400 text-sm">Loading services...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                    Icon: {svc.icon}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">{svc.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed font-light">{svc.description}</p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
                  <button
                    onClick={() => openModal(svc)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(svc.id, svc.title)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {svc.technologies && svc.technologies.length > 0 && (
                <div className="pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                  {svc.technologies.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-lg font-display font-bold text-white">
                {editingService ? `Edit Service: ${editingService.title}` : 'Add New Service'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Shopify & Headless Commerce"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Service Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090d20] border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Service Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of deliverables, outcomes, and value provided..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm resize-none"
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Technologies (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="Shopify Plus, Liquid, Hydrogen, Next.js"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
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
                    <span>Active / Visible</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-neon-primary px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
