import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import ImageUpload from '../components/ImageUpload.jsx';
import {
  User,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Sparkles,
} from 'lucide-react';

export default function AboutAdmin() {
  const [aboutData, setAboutData] = useState({
    heading: '',
    bio: '',
    profileImage: '',
    resumeUrl: '',
    location: '',
    email: '',
    phone: '',
    yearsExperience: '',
  });

  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingAbout, setSavingAbout] = useState(false);
  const [status, setStatus] = useState(null);

  // New Skill form state
  const [newSkill, setNewSkill] = useState({ name: '', level: 90, category: 'Frontend' });
  // New Experience form state
  const [newExp, setNewExp] = useState({
    role: '',
    company: '',
    location: 'Remote',
    startDate: '',
    endDate: 'Present',
    description: '',
    technologies: '',
  });

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminAbout();
      if (res.about) {
        setAboutData(res.about);
      }
      setSkills(res.skills || []);
      setExperiences(res.experiences || []);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to load about data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    setSavingAbout(true);
    setStatus(null);

    try {
      await api.updateAdminAbout(aboutData);
      setStatus({ type: 'success', message: 'About details updated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to save about details.' });
    } finally {
      setSavingAbout(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.name) return;
    try {
      const created = await api.createSkill(newSkill);
      setSkills([...skills, created]);
      setNewSkill({ name: '', level: 90, category: 'Frontend' });
      setStatus({ type: 'success', message: `Skill "${newSkill.name}" added!` });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to add skill.' });
    }
  };

  const handleDeleteSkill = async (id, name) => {
    try {
      await api.deleteSkill(id);
      setSkills(skills.filter((s) => s.id !== id));
      setStatus({ type: 'success', message: `Skill "${name}" removed.` });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to remove skill.' });
    }
  };

  const handleAddExp = async (e) => {
    e.preventDefault();
    if (!newExp.role || !newExp.company) return;
    try {
      const payload = {
        ...newExp,
        technologies: newExp.technologies
          ? newExp.technologies.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };
      const created = await api.createExperience(payload);
      setExperiences([...experiences, created]);
      setNewExp({
        role: '',
        company: '',
        location: 'Remote',
        startDate: '',
        endDate: 'Present',
        description: '',
        technologies: '',
      });
      setStatus({ type: 'success', message: 'Experience record added!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to add experience.' });
    }
  };

  const handleDeleteExp = async (id) => {
    try {
      await api.deleteExperience(id);
      setExperiences(experiences.filter((e) => e.id !== id));
      setStatus({ type: 'success', message: 'Experience record removed.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to delete experience.' });
    }
  };

  if (loading) {
    return <div className="py-20 text-center font-mono text-cyan-400 text-sm">Loading about details...</div>;
  }

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-1">
          <User className="w-3.5 h-3.5" />
          <span>Profile & Experience</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
          About & Career Management
        </h1>
        <p className="text-xs text-slate-400">
          Update your biography, avatar, competencies, and professional career milestones.
        </p>
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

      {/* 1. Bio & Overview Form */}
      <form onSubmit={handleAboutSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
        <h2 className="text-base font-display font-bold text-white border-b border-white/5 pb-3">
          Bio & Core Details
        </h2>

        <ImageUpload
          label="Profile Picture / Avatar"
          value={aboutData.profileImage}
          onChange={(url) => setAboutData({ ...aboutData, profileImage: url })}
        />

        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
            About Heading
          </label>
          <input
            type="text"
            required
            value={aboutData.heading}
            onChange={(e) => setAboutData({ ...aboutData, heading: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
            Biography / Narrative
          </label>
          <textarea
            required
            rows={4}
            value={aboutData.bio}
            onChange={(e) => setAboutData({ ...aboutData, bio: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm resize-none"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Years Experience
            </label>
            <input
              type="text"
              value={aboutData.yearsExperience}
              onChange={(e) => setAboutData({ ...aboutData, yearsExperience: e.target.value })}
              placeholder="2+"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Direct Contact Email
            </label>
            <input
              type="email"
              value={aboutData.email}
              onChange={(e) => setAboutData({ ...aboutData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Resume / CV URL
            </label>
            <input
              type="text"
              value={aboutData.resumeUrl || ''}
              onChange={(e) => setAboutData({ ...aboutData, resumeUrl: e.target.value })}
              placeholder="https://... or /uploads/resume.pdf"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingAbout}
            className="btn-neon-primary px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{savingAbout ? 'Saving...' : 'Update Bio Information'}</span>
          </button>
        </div>
      </form>

      {/* 2. Skills Management */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <h2 className="text-base font-display font-bold text-white border-b border-white/5 pb-3">
          Skills & Proficiency Levels
        </h2>

        {/* Add Skill Mini Form */}
        <form onSubmit={handleAddSkill} className="flex flex-wrap sm:flex-nowrap gap-3 items-end">
          <div className="flex-1 space-y-1">
            <label className="text-[11px] font-mono uppercase text-slate-400">Skill Name</label>
            <input
              type="text"
              required
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="e.g. Next.js"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
          </div>

          <div className="w-24 space-y-1">
            <label className="text-[11px] font-mono uppercase text-slate-400">Level (%)</label>
            <input
              type="number"
              min="10"
              max="100"
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) || 80 })}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
          </div>

          <div className="w-36 space-y-1">
            <label className="text-[11px] font-mono uppercase text-slate-400">Category</label>
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#090d20] border border-white/10 text-white text-xs"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="E-commerce">E-commerce</option>
              <option value="DevOps">DevOps</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn-neon-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1 cursor-pointer h-[38px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

        {/* Skills list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs"
            >
              <div>
                <span className="font-bold text-white">{skill.name}</span>
                <span className="text-slate-400 font-mono ml-2">({skill.level}%)</span>
                <span className="text-[10px] text-cyan-400 font-mono block">{skill.category}</span>
              </div>
              <button
                onClick={() => handleDeleteSkill(skill.id, skill.name)}
                className="text-rose-400 hover:text-rose-300 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Experiences Management */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <h2 className="text-base font-display font-bold text-white border-b border-white/5 pb-3">
          Career Timeline & Work Experiences
        </h2>

        {/* Add Experience Form */}
        <form onSubmit={handleAddExp} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={newExp.role}
              onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
              placeholder="Role Title (e.g. Lead Full-Stack Developer)"
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
            <input
              type="text"
              required
              value={newExp.company}
              onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
              placeholder="Company / Agency Name"
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={newExp.startDate}
              onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
              placeholder="Start Date (e.g. 2023)"
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
            <input
              type="text"
              value={newExp.endDate}
              onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
              placeholder="End Date (e.g. Present)"
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
            <input
              type="text"
              value={newExp.location}
              onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
              placeholder="Location (e.g. Remote)"
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
          </div>

          <textarea
            rows={2}
            value={newExp.description}
            onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
            placeholder="Key responsibilities and technical accomplishments..."
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs resize-none"
          ></textarea>

          <input
            type="text"
            value={newExp.technologies}
            onChange={(e) => setNewExp({ ...newExp, technologies: e.target.value })}
            placeholder="Tech used (Comma-separated, e.g. React, Shopify, Node.js)"
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-neon-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Experience Record</span>
            </button>
          </div>
        </form>

        {/* Existing Experiences List */}
        <div className="space-y-3 pt-2">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                  <span className="text-xs font-mono text-cyan-400">@ {exp.company}</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    ({exp.startDate} - {exp.endDate})
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-light">{exp.description}</p>
              </div>

              <button
                onClick={() => handleDeleteExp(exp.id)}
                className="text-rose-400 hover:text-rose-300 p-1.5"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
