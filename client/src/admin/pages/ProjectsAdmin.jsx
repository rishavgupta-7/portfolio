import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import ImageUpload from '../components/ImageUpload.jsx';
import MultiMediaUpload, { isVideoMedia } from '../components/MultiMediaUpload.jsx';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Star,
  Video,
  Film,
  Play,
} from 'lucide-react';

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    tagline: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    media: [],
    category: 'Full-Stack',
    techStack: '',
    liveUrl: '',
    githubUrl: '',
    featured: false,
    order: 0,
    isActive: true,
  });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminProjects();
      setProjects(data);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to fetch projects.' });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (proj = null) => {
    if (proj) {
      setEditingProject(proj);
      const projMedia = Array.isArray(proj.media) && proj.media.length > 0
        ? proj.media
        : (proj.imageUrl ? [proj.imageUrl] : []);
      setFormData({
        title: proj.title,
        slug: proj.slug,
        tagline: proj.tagline || '',
        description: proj.description,
        imageUrl: proj.imageUrl || '',
        videoUrl: proj.videoUrl || '',
        media: projMedia,
        category: proj.category || 'Full-Stack',
        techStack: Array.isArray(proj.techStack) ? proj.techStack.join(', ') : proj.techStack || '',
        liveUrl: proj.liveUrl || '',
        githubUrl: proj.githubUrl || '',
        featured: proj.featured || false,
        order: proj.order || 0,
        isActive: proj.isActive !== false,
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        slug: '',
        tagline: '',
        description: '',
        imageUrl: '',
        videoUrl: '',
        media: [],
        category: 'Full-Stack',
        techStack: '',
        liveUrl: '',
        githubUrl: '',
        featured: false,
        order: projects.length + 1,
        isActive: true,
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      // Ensure primary imageUrl exists
      let primaryImage = formData.imageUrl;
      if (!primaryImage && formData.media.length > 0) {
        primaryImage = formData.media.find(u => !isVideoMedia(u)) || formData.media[0];
      }

      if (!primaryImage) {
        throw new Error('Please upload at least one image or screenshot for this project.');
      }

      const payload = {
        ...formData,
        imageUrl: primaryImage,
        videoUrl: formData.videoUrl || null,
        media: Array.isArray(formData.media) ? formData.media : [],
        techStack: formData.techStack
          ? formData.techStack.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };

      if (editingProject) {
        await api.updateProject(editingProject.id, payload);
        setStatus({ type: 'success', message: `Project "${formData.title}" updated!` });
      } else {
        await api.createProject(payload);
        setStatus({ type: 'success', message: `Project "${formData.title}" created!` });
      }
      closeModal();
      fetchProjects();
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete project "${title}"?`)) return;
    try {
      await api.deleteProject(id);
      setStatus({ type: 'success', message: `Project "${title}" deleted.` });
      fetchProjects();
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to delete project.' });
    }
  };

  const categories = ['Full-Stack', 'Shopify', 'React/Next.js', 'API/Backend', 'Mobile'];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Case Studies Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Projects Management
          </h1>
          <p className="text-xs text-slate-400">
            Add new projects, upload screenshots, feature items, and manage live URLs.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="btn-neon-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
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

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 text-center font-mono text-cyan-400 text-sm">Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="glass-card rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/9] bg-slate-900">
                <img
                  src={proj.imageUrl}
                  alt={proj.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-black/70 text-cyan-400 border border-cyan-500/30">
                  {proj.category}
                </span>
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {proj.videoUrl && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-purple-600/90 text-white flex items-center gap-1 shadow-sm">
                      <Play className="w-2.5 h-2.5 fill-white" />
                      Video
                    </span>
                  )}
                  {proj.featured && (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-purple-500/30 text-purple-300 border border-purple-500/50">
                      <Star className="w-3 h-3 text-purple-400 fill-purple-400" />
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1">{proj.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono">
                    {proj.media && proj.media.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                        <Film className="w-3 h-3" />
                        {proj.media.length} {proj.media.length === 1 ? 'asset' : 'assets'}
                      </span>
                    )}
                    {proj.videoUrl && (
                      <span className="inline-flex items-center gap-1 text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20">
                        <Video className="w-3 h-3" />
                        Preview clip
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-[11px] font-mono text-slate-400">Order: {proj.order}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openModal(proj)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id, proj.title)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card w-full max-w-3xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-lg font-display font-bold text-white">
                {editingProject ? `Edit: ${editingProject.title}` : 'Add New Project'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Apex Luxury Store"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    Category
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

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Tagline / Subheading
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="High-conversion bespoke Shopify Plus storefront"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive case study details, architectural highlights, and client outcomes..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm resize-none"
                ></textarea>
              </div>

              <MultiMediaUpload
                media={formData.media}
                imageUrl={formData.imageUrl}
                videoUrl={formData.videoUrl}
                onMediaChange={(newMedia) => setFormData((prev) => ({ ...prev, media: newMedia }))}
                onImageChange={(newImg) => setFormData((prev) => ({ ...prev, imageUrl: newImg }))}
                onVideoChange={(newVid) => setFormData((prev) => ({ ...prev, videoUrl: newVid }))}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  placeholder="Shopify Plus, Liquid, Tailwind CSS, JavaScript, GraphQL"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://client-store.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    GitHub Code Repository URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/rishav/project"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
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
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded bg-white/5 border-white/10 text-purple-500 focus:ring-0"
                    />
                    <span>Featured on Home</span>
                  </label>
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
                  disabled={submitting || (!formData.imageUrl && formData.media.length === 0)}
                  className="btn-neon-primary px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingProject ? 'Save Changes' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
