import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Layers,
  ShoppingBag,
  Code2,
  Quote,
  Star,
  CheckCircle2,
} from 'lucide-react';
import Hero from '../components/Hero.jsx';
import TechEcosystem from '../components/TechEcosystem.jsx';
import HowIBuild from '../components/HowIBuild.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import ServiceCard from '../components/ServiceCard.jsx';

export default function Home({ data = {} }) {
  const {
    hero = {},
    heroStats = [],
    technologies = [],
    projects = [],
    services = [],
    testimonials = [],
    processSetting = {},
    processSteps = [],
  } = data;

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3);

  return (
    <div>
      {/* 1. HERO SECTION */}
      <Hero
        hero={hero}
        stats={heroStats}
        technologies={technologies}
      />

      {/* 2. MY TECH ECOSYSTEM */}
      <TechEcosystem
        data={data}
        technologies={technologies}
      />

      {/* 3. FEATURED PROJECTS SECTION */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-2 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Selected Portfolio Case Studies</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
                Featured Work
              </h2>
            </div>

            <Link
              to="/work"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white btn-neon-secondary self-start md:self-auto"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION */}
      <section className="py-24 bg-[#04060e] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-purple-400 text-xs font-mono uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-purple-950/30 border border-purple-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Services & Expertise</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
              High-Impact Engineering Solutions
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              End-to-end full-stack development, modern headless commerce, and high-performance storefronts engineered for maximum conversion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <ServiceCard key={service.id || idx} service={service} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW I BUILD / MY PROCESS SECTION */}
      <HowIBuild
        setting={processSetting}
        steps={processSteps}
      />

      {/* 6. TESTIMONIALS SECTION */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-24 relative overflow-hidden border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold block mb-2">
                Client Testimonials
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                Trusted by Founders & Brands
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col justify-between space-y-6 relative"
                >
                  <Quote className="w-10 h-10 text-cyan-500/20 absolute top-6 right-6 pointer-events-none" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-200 text-base italic leading-relaxed">
                      "{t.content}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                    {t.avatarUrl ? (
                      <img
                        src={t.avatarUrl}
                        alt={t.clientName}
                        className="w-12 h-12 rounded-full object-cover border border-cyan-500/30 shadow-md"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-white font-bold">
                        {t.clientName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-white font-bold text-base">{t.clientName}</h4>
                      <p className="text-xs text-slate-400 font-mono">
                        {t.clientRole} {t.company && `• ${t.company}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 sm:p-14 rounded-3xl border border-cyan-500/30 text-center relative overflow-hidden shadow-2xl shadow-cyan-950/40">
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-purple-600/15 to-cyan-600/10 pointer-events-none"></div>

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-cyan-300 bg-cyan-950/40 border border-cyan-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                Available for New Projects & Contracts
              </span>

              <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
                Have a project in mind? Let's engineer something iconic.
              </h2>

              <p className="text-slate-300 text-base sm:text-lg font-light">
                Whether you need a custom Shopify storefront, a scalable React application, or API architecture, I'm ready to bring your vision to life.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/contact"
                  className="btn-neon-primary inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider text-white shadow-xl"
                >
                  <span>Start a Conversation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/work"
                  className="btn-neon-secondary inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold tracking-wider text-slate-200"
                >
                  <span>Explore Portfolio</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
