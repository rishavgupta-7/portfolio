import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import ImageUpload from '../components/ImageUpload.jsx';
import {
  Quote,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Star,
} from 'lucide-react';

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    clientName: '',
    clientRole: 'CEO',
    company: '',
    avatarUrl: '',
    content: '',
    rating: 5,
    order: 0,
    isActive: true,
  });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminTestimonials();
      setTestimonials(data);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to fetch testimonials.' });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (t = null) => {
    if (t) {
      setEditingTestimonial(t);
      setFormData({
        clientName: t.clientName,
        clientRole: t.clientRole || '',
        company: t.company || '',
        avatarUrl: t.avatarUrl || '',
        content: t.content,
        rating: t.rating || 5,
        order: t.order || 0,
        isActive: t.isActive !== false,
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        clientName: '',
        clientRole: '',
        company: '',
        avatarUrl: '',
        content: '',
        rating: 5,
        order: testimonials.length + 1,
        isActive: true,
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTestimonial(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      if (editingTestimonial) {
        await api.updateTestimonial(editingTestimonial.id, formData);
        setStatus({ type: 'success', message: `Testimonial from ${formData.clientName} updated!` });
      } else {
        await api.createTestimonial(formData);
        setStatus({ type: 'success', message: `Testimonial from ${formData.clientName} added!` });
      }
      closeModal();
      fetchTestimonials();
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete testimonial from "${name}"?`)) return;
    try {
      await api.deleteTestimonial(id);
      setStatus({ type: 'success', message: `Testimonial deleted.` });
      fetchTestimonials();
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to delete testimonial.' });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-1">
            <Quote className="w-3.5 h-3.5" />
            <span>Social Proof Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Client Testimonials
          </h1>
          <p className="text-xs text-slate-400">
            Manage genuine client reviews, company endorsements, and ratings.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="btn-neon-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
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

      {/* Testimonials Grid */}
      {loading ? (
        <div className="py-20 text-center font-mono text-cyan-400 text-sm">Loading testimonials...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openModal(t)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, t.clientName)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-200 italic leading-relaxed font-light">"{t.content}"</p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                {t.avatarUrl ? (
                  <img
                    src={t.avatarUrl}
                    alt={t.clientName}
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    {t.clientName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-white">{t.clientName}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {t.clientRole} {t.company && `• ${t.company}`}
                  </p>
                </div>
              </div>
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
                {editingTestimonial ? `Edit Testimonial` : 'Add Testimonial'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-slate-300">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-slate-300">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-slate-300">Client Role</label>
                  <input
                    type="text"
                    value={formData.clientRole}
                    onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
                    placeholder="CEO / Founder"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-slate-300">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <ImageUpload
                label="Client Avatar Photo"
                value={formData.avatarUrl}
                onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
              />

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-slate-300">Testimonial Content *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Client feedback..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs resize-none font-light"
                ></textarea>
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
                  {submitting ? 'Saving...' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
