import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  MapPin,
  Globe2,
  Star,
  ShieldCheck,
  Code2,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import HeroTechCard from './HeroTechCard.jsx';

export default function Hero({ hero = {}, stats = [], technologies = [] }) {
  const name = hero.name || 'Rishav Gupta';
  const highlightedName = hero.highlightedName || 'Rishav';
  const title = hero.title || 'Full-Stack & Shopify Developer';
  const description =
    hero.description ||
    'Architecting high-performance web applications, modern headless commerce, and scalable digital solutions tailored for high-growth brands and enterprise clients.';
  const availabilityText = hero.availabilityText || 'Available for freelance work';
  const location = hero.location || 'India';
  const remoteText = hero.remoteText || 'Available for Remote Worldwide';
  const techLabels = Array.isArray(hero.techLabels)
    ? hero.techLabels
    : ['Full-Stack Development', 'Shopify Plus', 'React Ecosystem', 'Node.js & APIs'];

  const primaryBtnText = hero.primaryBtnText || 'Start a Project';
  const primaryBtnUrl = hero.primaryBtnUrl || '/contact';
  const secondaryBtnText = hero.secondaryBtnText || 'Explore Work';
  const secondaryBtnUrl = hero.secondaryBtnUrl || '/work';
  const clientProofText = hero.clientProofText || '5.0 Rating • 100% Client Satisfaction';
  const heroImage = hero.heroImage || '/uploads/hero-developer.png';

  // Filter floating tech cards for hero
  const heroTechs = (technologies || []).filter((t) => t.isHero);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden cyber-grid">
      {/* Background Neon Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] rounded-full bg-cyan-600/15 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-purple-600/20 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[50rem] h-[15rem] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-card border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 text-xs sm:text-sm font-medium shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>{availabilityText}</span>
            </div>

            {/* Name & Main Heading */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-sm sm:text-base uppercase tracking-widest font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Hello, I'm
                </span>
                <div className="h-[1px] w-12 bg-gradient-to-r from-cyan-400 to-transparent"></div>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.1]">
                {name.includes(highlightedName) ? (
                  <>
                    {name.split(highlightedName)[0]}
                    <span className="text-neon-gradient">{highlightedName}</span>
                    {name.split(highlightedName)[1]}
                  </>
                ) : (
                  <span className="text-neon-gradient">{name}</span>
                )}
              </h1>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-200 tracking-tight flex flex-wrap items-center gap-2">
                <span>{title}</span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
              {description}
            </p>

            {/* Location & Remote badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                <Globe2 className="w-4 h-4 text-purple-400" />
                <span>{remoteText}</span>
              </div>
            </div>

            {/* Technology Labels / Categories */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {techLabels.map((label, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-mono font-medium text-slate-300 bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:text-cyan-300 transition-colors"
                >
                  #{label}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to={primaryBtnUrl}
                className="btn-neon-primary inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-bold tracking-wide uppercase text-white shadow-xl group cursor-pointer"
              >
                <span>{primaryBtnText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to={secondaryBtnUrl}
                className="btn-neon-secondary inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide text-slate-200 hover:text-white cursor-pointer"
              >
                <Layers className="w-4 h-4 text-purple-400" />
                <span>{secondaryBtnText}</span>
              </Link>
            </div>

            {/* Client / Social Proof Area */}
            <div className="pt-2 flex items-center gap-4 border-t border-white/10 w-full max-w-lg">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#05070f] bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow"
                  >
                    ★
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="font-bold text-white ml-1">5.0</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {clientProofText}
                </span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN (HERO ILLUSTRATION & FLOATING CARDS) ================= */}
          <div className="lg:col-span-5 relative flex items-center justify-center mt-6 lg:mt-0">
            {/* Concentric Neon Halo Rings */}
            <div className="absolute w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] md:w-[480px] md:h-[480px] rounded-full border border-cyan-500/20 shadow-[0_0_60px_rgba(6,182,212,0.15)] animate-spin-slow pointer-events-none"></div>
            <div className="absolute w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] md:w-[400px] md:h-[400px] rounded-full border border-purple-500/20 shadow-[0_0_50px_rgba(168,85,247,0.15)] pointer-events-none"></div>
            <div className="absolute w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] rounded-full bg-gradient-to-tr from-cyan-500/20 via-purple-600/25 to-pink-500/10 blur-2xl pointer-events-none animate-pulse-glow"></div>

            {/* Developer Illustration Card Container */}
            <div className="relative w-full max-w-[380px] sm:max-w-[440px] md:max-w-[480px] aspect-square rounded-3xl p-3 sm:p-4 glass-card border border-white/10 shadow-2xl shadow-cyan-950/40 group overflow-visible">
              {/* Inner glowing picture container */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e162f] to-[#060813] border border-cyan-500/30 flex items-center justify-center">
                <img
                  src={heroImage}
                  alt={name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1534972195531-a756b1129f63?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                {/* Subtle gradient vignette over image */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070f] via-transparent to-transparent opacity-60 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#05070f]/40 via-transparent to-[#05070f]/40 pointer-events-none"></div>
              </div>

              {/* Decorative Handwritten / Code Tag Top-Right */}
              <div className="absolute -top-4 -right-2 sm:-top-5 sm:-right-4 px-3 py-1.5 rounded-xl glass-card border border-purple-500/40 bg-[#0c1025]/90 text-purple-300 font-mono text-[11px] sm:text-xs shadow-lg shadow-purple-500/20 flex items-center gap-1.5 z-30 animate-float-slow">
                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                <span>&lt;CleanCode /&gt;</span>
              </div>

              {/* Decorative Tag Bottom-Left */}
              <div className="absolute -bottom-4 -left-2 sm:-bottom-5 sm:-left-4 px-3 py-1.5 rounded-xl glass-card border border-cyan-500/40 bg-[#081126]/90 text-cyan-300 font-mono text-[11px] sm:text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 z-30 animate-float-medium">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>High Performance</span>
              </div>

              {/* Floating Dynamic Technology Cards */}
              {heroTechs.map((tech, idx) => (
                <HeroTechCard key={tech.id || idx} tech={tech} index={idx} />
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Statistics Row */}
        {stats && stats.length > 0 && (
          <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, idx) => (
              <div
                key={stat.id || idx}
                className="glass-card p-5 sm:p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all duration-300 flex flex-col items-center text-center group"
              >
                <span className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:scale-105 transition-transform duration-200">
                  {stat.value}
                </span>
                <span className="mt-1 text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
