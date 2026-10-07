import React from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard.jsx';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Headphones, CheckCircle2 } from 'lucide-react';

export default function Services({ services = [] }) {
  const perks = [
    {
      title: 'Performance-First',
      desc: 'Obsessive focus on Core Web Vitals, sub-second TTFB, and fluid 60fps micro-interactions.',
    },
    {
      title: 'Scalable Architecture',
      desc: 'Clean code paradigms, strongly-typed contracts, and automated PostgreSQL database migrations.',
    },
    {
      title: 'Direct Developer Access',
      desc: 'Transparent communication, daily staging updates, and zero agency bureaucratic overhead.',
    },
    {
      title: 'Full Ownership & Warranty',
      desc: 'Clean documentation, thorough handover, and 30-day post-launch bug warranty included.',
    },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-widest text-purple-400 bg-purple-950/30 border border-purple-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core Capabilities</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
            Services & Solutions
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Bespoke engineering solutions engineered for founders, fast-scaling startups, and modern e-commerce leaders.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {services.map((service, idx) => (
            <ServiceCard key={service.id || idx} service={service} index={idx} />
          ))}
        </div>

        {/* The Engineering Standard Section */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden mb-20">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold block mb-2">
              Engineering Guarantees
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
              What Sets My Work Apart
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-white font-bold text-base">{perk.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/contact"
            className="btn-neon-primary inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider text-white shadow-xl"
          >
            <span>Book a Technical Discovery Call</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
