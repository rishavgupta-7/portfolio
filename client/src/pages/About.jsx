import React from 'react';
import {
  User,
  MapPin,
  Mail,
  Calendar,
  Briefcase,
  Download,
  Sparkles,
  Award,
} from 'lucide-react';

export default function About({ about = {}, skills = [], experiences = [] }) {
  const {
    heading = 'Crafting Scalable Code & High-Conversion E-Commerce',
    bio = 'I am Rishav Gupta, a Full-Stack & Shopify developer dedicated to building polished, futuristic digital products.',
    location = 'India • Available for Remote Worldwide',
    email = 'rishav@example.com',
    yearsExperience = '2+',
    resumeUrl = '#',
    profileImage = '/uploads/hero-developer.png',
  } = about;

  return (
    <div className="pt-32 pb-24 min-h-screen cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Profile Intro Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-square rounded-3xl p-3 glass-card border border-cyan-500/30 shadow-2xl shadow-cyan-950/40">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
                <img
                  src={profileImage || '/uploads/hero-developer.png'}
                  alt="Profile"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-2xl glass-card border border-purple-500/40 bg-[#0c1025]/90 text-purple-300 font-mono text-xs shadow-xl flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span>{yearsExperience} Years Experience</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400 bg-cyan-950/30 border border-cyan-500/20">
              <User className="w-3.5 h-3.5" />
              <span>Full-Stack & Shopify Specialist</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              {heading}
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed whitespace-pre-line font-light">
              {bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 pt-2">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/5">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>{email}</span>
              </div>
            </div>

            {resumeUrl && resumeUrl !== '#' && (
              <div className="pt-2">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-neon-primary inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Curriculum Vitae (CV)</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Experience Timeline */}
        {experiences && experiences.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Briefcase className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Career History & Milestones
              </h2>
            </div>

            <div className="relative border-l-2 border-cyan-500/30 ml-4 pl-6 sm:pl-8 space-y-10">
              {experiences.map((exp, idx) => (
                <div key={exp.id || idx} className="relative group">
                  {/* Glowing Node Dot */}
                  <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#05070f] border-2 border-cyan-400 group-hover:border-purple-400 group-hover:scale-125 transition-all shadow-[0_0_10px_#22d3ee]"></span>

                  <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="text-xl font-display font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {exp.role}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/20 w-fit">
                        <Calendar className="w-3.5 h-3.5" />
                        {exp.startDate} — {exp.endDate}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-slate-300">
                      {exp.company} {exp.location && `• ${exp.location}`}
                    </p>

                    <p className="text-sm text-slate-300 leading-relaxed font-light">
                      {exp.description}
                    </p>

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {exp.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-md text-[11px] font-mono text-slate-400 bg-white/5 border border-white/5"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Breakdown */}
        {skills && skills.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Core Proficiencies
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skill, idx) => (
                <div
                  key={skill.id || idx}
                  className="glass-card p-5 rounded-2xl border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-white">{skill.name}</span>
                    <span className="font-mono text-cyan-400 text-xs">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    {skill.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
