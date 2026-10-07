import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Terminal,
  Activity,
  Layers,
  Cpu,
  ShoppingBag,
  Database,
  Server,
  Code2,
  Wrench,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

// Fallback high-contrast brand icons as crisp SVG
const BrandIcons = {
  react: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400 fill-current" aria-label="React">
      <path d="M12 9a3 3 0 100 6 3 3 0 000-6z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 1.5c4.694 0 8.5 3.806 8.5 8.5s-3.806 8.5-8.5 8.5S3.5 16.694 3.5 12 7.306 3.5 12 3.5z"
      />
    </svg>
  ),
  nodejs: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-400 fill-current" aria-label="Node.js">
      <path d="M12 2l9 5.2v10.4L12 22.8 3 17.6V7.2L12 2zm0 2.3L5 8.5v7l7 4.2 7-4.2v-7l-7-4.2z" />
    </svg>
  ),
  database: () => <Database className="w-5 h-5 text-blue-400" />,
  ecommerce: () => <ShoppingBag className="w-5 h-5 text-emerald-400" />,
  tools: () => <Wrench className="w-5 h-5 text-purple-400" />,
};

export default function TechEcosystem({ data = {}, technologies = [] }) {
  const sectionRef = useRef(null);
  const graphContainerRef = useRef(null);
  const cardRefs = useRef({});

  const [inView, setInView] = useState(false);
  const [terminalLinesRevealed, setTerminalLinesRevealed] = useState(0);
  const [connectingLines, setConnectingLines] = useState([]);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Settings from admin with fallbacks
  const eco = data.techEcosystem || {};
  const eyebrow = eco.eyebrow || 'SKILLS & TECHNOLOGIES';
  const heading = eco.heading || 'My Tech Ecosystem';
  const subtitle =
    eco.subtitle || 'Technologies I use to build modern and scalable applications.';
  const description =
    eco.description ||
    'A combination of modern tools, frameworks and best practices to build high-performance web applications and e-commerce solutions.';
  const buttonText = eco.buttonText || 'View Full Stack →';
  const buttonUrl = eco.buttonUrl || '/stack';
  const terminalHeader = eco.terminalHeader || "~/rishav's dev --stack";
  const systemStatusText = eco.systemStatusText || 'All Systems Operational';
  const systemStatusActive = eco.systemStatusActive !== false;

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Filter active technologies by ecosystem categories
  const activeTechs = useMemo(() => {
    return technologies.filter((t) => t.isActive !== false);
  }, [technologies]);

  // Frontend technologies
  const frontendTechs = useMemo(() => {
    const list = activeTechs.filter(
      (t) => (t.category || '').toLowerCase() === 'frontend'
    );
    if (list.length > 0) return list;
    return [
      { id: 'f1', name: 'React.js', version: 'v19' },
      { id: 'f2', name: 'Next.js', version: 'latest' },
      { id: 'f3', name: 'Tailwind CSS', version: 'latest' },
    ];
  }, [activeTechs]);

  // Backend technologies
  const backendTechs = useMemo(() => {
    const list = activeTechs.filter(
      (t) => (t.category || '').toLowerCase() === 'backend'
    );
    if (list.length > 0) return list;
    return [
      { id: 'b1', name: 'Node.js', version: 'v22' },
      { id: 'b2', name: 'Express.js', version: 'latest' },
      { id: 'b3', name: 'REST APIs', version: 'v2' },
    ];
  }, [activeTechs]);

  // Database technologies
  const databaseTechs = useMemo(() => {
    const list = activeTechs.filter(
      (t) => (t.category || '').toLowerCase() === 'database'
    );
    if (list.length > 0) return list;
    return [
      { id: 'd1', name: 'PostgreSQL', version: 'v17' },
      { id: 'd2', name: 'MongoDB', version: 'latest' },
    ];
  }, [activeTechs]);

  // Tools & Others technologies
  const toolsTechs = useMemo(() => {
    const list = activeTechs.filter((t) => {
      const cat = (t.category || '').toLowerCase();
      return cat === 'tools & others' || cat === 'tools' || cat === 'core';
    });
    if (list.length > 0) return list;
    return [
      { id: 't1', name: 'Git', version: 'v2.4' },
      { id: 't2', name: 'Docker', version: 'v27' },
      { id: 't3', name: 'Prisma', version: 'latest' },
      { id: 't4', name: 'Socket.io', version: 'v4.8' },
      { id: 't5', name: 'Cloudinary', version: 'v2.0' },
    ];
  }, [activeTechs]);

  // E-commerce technologies
  const ecommerceTechs = useMemo(() => {
    const list = activeTechs.filter(
      (t) => (t.category || '').toLowerCase() === 'e-commerce'
    );
    if (list.length > 0) return list;
    return [
      { id: 'e1', name: 'Shopify', version: 'Plus' },
      { id: 'e2', name: 'Liquid', version: 'v5.4' },
      { id: 'e3', name: 'Storefront API', version: '2026-01' },
    ];
  }, [activeTechs]);

  // Terminal stack items (either designated or default)
  const terminalItems = useMemo(() => {
    const designated = activeTechs
      .filter((t) => t.showInTerminal)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    if (designated.length > 0) {
      return designated.map((t) => ({
        name: t.name,
        version: t.terminalVersion || t.version || 'latest',
      }));
    }

    return [
      { name: 'React', version: 'v19' },
      { name: 'Node.js', version: 'v22' },
      { name: 'Express', version: 'latest' },
      { name: 'PostgreSQL', version: 'v17' },
      { name: 'MongoDB', version: 'latest' },
      { name: 'Next.js', version: 'latest' },
      { name: 'Prisma', version: 'latest' },
      { name: 'Tailwind CSS', version: 'latest' },
    ];
  }, [activeTechs]);

  // Terminal typing / line reveal animation sequence
  useEffect(() => {
    if (!inView) return;
    if (isReducedMotion) {
      setTerminalLinesRevealed(terminalItems.length);
      return;
    }

    setTerminalLinesRevealed(0);
    const interval = setInterval(() => {
      setTerminalLinesRevealed((prev) => {
        if (prev < terminalItems.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 160);

    return () => clearInterval(interval);
  }, [inView, terminalItems, isReducedMotion]);

  // Dynamic SVG connection path calculation
  const updateConnectingLines = () => {
    if (!graphContainerRef.current) return;
    const container = graphContainerRef.current.getBoundingClientRect();

    // Check if we are on mobile / stacked layout (if container width is small, we skip complex bezier overlay)
    if (container.width < 768) {
      setConnectingLines([]);
      return;
    }

    const getCenter = (key, side = 'center') => {
      const el = cardRefs.current[key];
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const x =
        side === 'left'
          ? rect.left - container.left
          : side === 'right'
          ? rect.right - container.left
          : rect.left + rect.width / 2 - container.left;
      const y = rect.top + rect.height / 2 - container.top;
      return { x, y, width: rect.width, height: rect.height };
    };

    const frontend = getCenter('frontend', 'right');
    const backendLeft = getCenter('backend', 'left');
    const backendRight = getCenter('backend', 'right');
    const backendBottom = getCenter('backend', 'bottom');
    const ecommerce = getCenter('ecommerce', 'right');
    const database = getCenter('database', 'left');
    const tools = getCenter('tools', 'left');

    const lines = [];

    // 1. Frontend -> Backend
    if (frontend && backendLeft) {
      const startX = frontend.x;
      const startY = frontend.y;
      const endX = backendLeft.x;
      const endY = backendLeft.y;
      const c1x = startX + (endX - startX) * 0.5;
      const c1y = startY;
      const c2x = startX + (endX - startX) * 0.5;
      const c2y = endY;
      const path = `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`;
      lines.push({ id: 'line-frontend-backend', path, color: '#38bdf8', dur: '3.2s' });
    }

    // 2. E-commerce -> Backend
    if (ecommerce && backendLeft) {
      const startX = ecommerce.x;
      const startY = ecommerce.y;
      const endX = backendLeft.x;
      const endY = backendLeft.y + 15;
      const c1x = startX + (endX - startX) * 0.5;
      const c1y = startY;
      const c2x = startX + (endX - startX) * 0.5;
      const c2y = endY;
      const path = `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`;
      lines.push({ id: 'line-ecommerce-backend', path, color: '#10b981', dur: '3.8s' });
    }

    // 3. Backend -> Database
    if (backendRight && database) {
      const startX = backendRight.x;
      const startY = backendRight.y - 12;
      const endX = database.x;
      const endY = database.y;
      const c1x = startX + (endX - startX) * 0.5;
      const c1y = startY;
      const c2x = startX + (endX - startX) * 0.5;
      const c2y = endY;
      const path = `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`;
      lines.push({ id: 'line-backend-database', path, color: '#6366f1', dur: '3.0s' });
    }

    // 4. Backend <-> Tools & Others
    if (backendRight && tools) {
      const startX = backendRight.x;
      const startY = backendRight.y + 12;
      const endX = tools.x;
      const endY = tools.y;
      const c1x = startX + (endX - startX) * 0.5;
      const c1y = startY;
      const c2x = startX + (endX - startX) * 0.5;
      const c2y = endY;
      const path = `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`;
      lines.push({ id: 'line-backend-tools', path, color: '#a855f7', dur: '3.5s' });
    }

    setConnectingLines(lines);
  };

  // Recalculate SVG lines on resize and mount
  useEffect(() => {
    updateConnectingLines();
    const handleResize = () => {
      updateConnectingLines();
    };
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(updateConnectingLines, 400);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [technologies]);

  return (
    <section
      ref={sectionRef}
      id="tech-ecosystem"
      className="py-20 sm:py-28 relative overflow-hidden bg-[#040714] border-y border-white/5 select-none"
    >
      {/* Background cyber grid & subtle radial glow */}
      <div className="absolute inset-0 cyber-grid opacity-60 pointer-events-none" />
      <div className="absolute -top-40 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ================= SECTION HEADER ================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 sm:mb-20">
          {/* Top-Left */}
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{eyebrow}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              {heading}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{subtitle}</p>
          </div>

          {/* Top-Right */}
          <div className="lg:text-right max-w-md space-y-4">
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{description}</p>
            <div>
              <Link
                to={buttonUrl}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-400/50 shadow-sm transition-all duration-300 group"
              >
                <span>{buttonText}</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* ================= MAIN ECOSYSTEM LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ---------------- LEFT/CENTER: INTERCONNECTED CARDS CANVAS (7 COLS) ---------------- */}
          <div
            ref={graphContainerRef}
            className="lg:col-span-7 xl:col-span-8 relative py-2"
          >
            {/* SVG Connecting Lines Overlay (Desktop & Tablet) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Glow filter */}
                <filter id="eco-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Gradients */}
                <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.3" />
                </linearGradient>

                <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
                </linearGradient>

                <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {connectingLines.map((line) => (
                <g key={line.id}>
                  {/* Subtle static ambient line */}
                  <path
                    d={line.path}
                    fill="none"
                    stroke={line.color}
                    strokeWidth="1.5"
                    strokeOpacity="0.22"
                    strokeDasharray="4 4"
                  />
                  {/* Animated glowing pulse line */}
                  <path
                    d={line.path}
                    fill="none"
                    stroke={line.color}
                    strokeWidth="2.5"
                    strokeOpacity="0.75"
                    strokeDasharray="10 30"
                    filter="url(#eco-glow)"
                    className={!isReducedMotion ? 'animate-pulse' : ''}
                  />

                  {/* Traveling data pulse particle along curve */}
                  {!isReducedMotion && inView && (
                    <circle r="4" fill="#ffffff" filter="url(#eco-glow)">
                      <animateMotion
                        dur={line.dur}
                        repeatCount="indefinite"
                        path={line.path}
                      />
                    </circle>
                  )}
                </g>
              ))}
            </svg>

            {/* Grid Layout of the 5 Interconnected Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {/* ===== COLUMN 1: FRONTEND & E-COMMERCE ===== */}
              <div className="flex flex-col gap-6 justify-between">
                {/* 1. FRONTEND CARD */}
                <div
                  ref={(el) => (cardRefs.current['frontend'] = el)}
                  className={`glass-card p-6 rounded-3xl border border-cyan-500/20 hover:border-cyan-400/60 shadow-lg shadow-cyan-950/20 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden backdrop-blur-xl ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transition: 'all 0.5s ease-out 0.1s' }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />

                  <div className="flex items-center gap-3.5 mb-5 pb-3 border-b border-white/5">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center p-2 shadow-inner group-hover:scale-110 transition-transform">
                      <BrandIcons.react />
                    </div>
                    <div>
                      <h3 className="text-base font-display font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                        Frontend
                      </h3>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/80">
                        Client Layer
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {frontendTechs.map((tech) => (
                      <div
                        key={tech.id || tech.name}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-cyan-500/20 group-hover:bg-white/[0.05] transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {tech.logoUrl ? (
                            <img
                              src={tech.logoUrl}
                              alt={tech.name}
                              className="w-4 h-4 object-contain filter"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          )}
                          <span className="text-xs font-semibold text-slate-200 truncate">
                            {tech.name}
                          </span>
                        </div>
                        {tech.version && (
                          <span className="text-[10px] font-mono text-cyan-400/90 font-medium">
                            {tech.version}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="text-cyan-400/70">Flow: Outbound</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  </div>
                </div>

                {/* 2. E-COMMERCE CARD */}
                <div
                  ref={(el) => (cardRefs.current['ecommerce'] = el)}
                  className={`glass-card p-6 rounded-3xl border border-emerald-500/20 hover:border-emerald-400/60 shadow-lg shadow-emerald-950/20 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden backdrop-blur-xl ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transition: 'all 0.5s ease-out 0.25s' }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

                  <div className="flex items-center gap-3.5 mb-5 pb-3 border-b border-white/5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center p-2 shadow-inner group-hover:scale-110 transition-transform">
                      <BrandIcons.ecommerce />
                    </div>
                    <div>
                      <h3 className="text-base font-display font-bold text-white tracking-wide group-hover:text-emerald-300 transition-colors">
                        E-commerce
                      </h3>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80">
                        Storefronts
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {ecommerceTechs.map((tech) => (
                      <div
                        key={tech.id || tech.name}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-emerald-500/20 group-hover:bg-white/[0.05] transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {tech.logoUrl ? (
                            <img
                              src={tech.logoUrl}
                              alt={tech.name}
                              className="w-4 h-4 object-contain filter"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          )}
                          <span className="text-xs font-semibold text-slate-200 truncate">
                            {tech.name}
                          </span>
                        </div>
                        {tech.version && (
                          <span className="text-[10px] font-mono text-emerald-400/90 font-medium">
                            {tech.version}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="text-emerald-400/70">Shopify Plus / Headless</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* ===== COLUMN 2: BACKEND (CENTRAL HUB) ===== */}
              <div className="flex flex-col justify-center">
                <div
                  ref={(el) => (cardRefs.current['backend'] = el)}
                  className={`glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 hover:border-indigo-400/70 shadow-2xl shadow-indigo-950/30 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden backdrop-blur-xl ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transition: 'all 0.5s ease-out 0.2s' }}
                >
                  {/* Central glowing hub aura */}
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-cyan-500/10 opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all pointer-events-none" />

                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10 relative z-10">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-950/70 border border-indigo-500/40 flex items-center justify-center p-2 shadow-inner group-hover:scale-110 transition-transform">
                        <BrandIcons.nodejs />
                      </div>
                      <div>
                        <h3 className="text-lg font-display font-extrabold text-white tracking-wide group-hover:text-indigo-300 transition-colors">
                          Backend
                        </h3>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-semibold">
                          Core Orchestration
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Central Hub
                    </span>
                  </div>

                  <div className="space-y-3 relative z-10">
                    {backendTechs.map((tech) => (
                      <div
                        key={tech.id || tech.name}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 group-hover:border-indigo-500/30 group-hover:bg-white/[0.07] transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {tech.logoUrl ? (
                            <img
                              src={tech.logoUrl}
                              alt={tech.name}
                              className="w-4 h-4 object-contain filter"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-indigo-400" />
                          )}
                          <span className="text-xs sm:text-sm font-semibold text-white truncate">
                            {tech.name}
                          </span>
                        </div>
                        {tech.version && (
                          <span className="text-[11px] font-mono text-indigo-300 font-bold px-1.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/20">
                            {tech.version}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-300 relative z-10">
                    <span className="flex items-center gap-1.5 text-cyan-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Node.js v22 Runtime</span>
                    </span>
                    <span className="text-indigo-400/80">Bi-directional</span>
                  </div>
                </div>
              </div>

              {/* ===== COLUMN 3: DATABASE & TOOLS & OTHERS ===== */}
              <div className="flex flex-col gap-6 justify-between">
                {/* 3. DATABASE CARD */}
                <div
                  ref={(el) => (cardRefs.current['database'] = el)}
                  className={`glass-card p-6 rounded-3xl border border-blue-500/20 hover:border-blue-400/60 shadow-lg shadow-blue-950/20 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden backdrop-blur-xl ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transition: 'all 0.5s ease-out 0.3s' }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all pointer-events-none" />

                  <div className="flex items-center gap-3.5 mb-5 pb-3 border-b border-white/5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center p-2 shadow-inner group-hover:scale-110 transition-transform">
                      <BrandIcons.database />
                    </div>
                    <div>
                      <h3 className="text-base font-display font-bold text-white tracking-wide group-hover:text-blue-300 transition-colors">
                        Database
                      </h3>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400/80">
                        Persistence
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {databaseTechs.map((tech) => (
                      <div
                        key={tech.id || tech.name}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-blue-500/20 group-hover:bg-white/[0.05] transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {tech.logoUrl ? (
                            <img
                              src={tech.logoUrl}
                              alt={tech.name}
                              className="w-4 h-4 object-contain filter"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          )}
                          <span className="text-xs font-semibold text-slate-200 truncate">
                            {tech.name}
                          </span>
                        </div>
                        {tech.version && (
                          <span className="text-[10px] font-mono text-blue-400/90 font-medium">
                            {tech.version}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="text-blue-400/70">ACID & Schema Sync</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  </div>
                </div>

                {/* 4. TOOLS & OTHERS CARD */}
                <div
                  ref={(el) => (cardRefs.current['tools'] = el)}
                  className={`glass-card p-6 rounded-3xl border border-purple-500/20 hover:border-purple-400/60 shadow-lg shadow-purple-950/20 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden backdrop-blur-xl ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transition: 'all 0.5s ease-out 0.35s' }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

                  <div className="flex items-center gap-3.5 mb-5 pb-3 border-b border-white/5">
                    <div className="w-10 h-10 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center p-2 shadow-inner group-hover:scale-110 transition-transform">
                      <BrandIcons.tools />
                    </div>
                    <div>
                      <h3 className="text-base font-display font-bold text-white tracking-wide group-hover:text-purple-300 transition-colors">
                        Tools & Others
                      </h3>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400/80">
                        DevOps & Cloud
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {toolsTechs.slice(0, 5).map((tech) => (
                      <div
                        key={tech.id || tech.name}
                        className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-purple-500/20 group-hover:bg-white/[0.05] transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {tech.logoUrl ? (
                            <img
                              src={tech.logoUrl}
                              alt={tech.name}
                              className="w-3.5 h-3.5 object-contain filter"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          )}
                          <span className="text-xs font-semibold text-slate-200 truncate">
                            {tech.name}
                          </span>
                        </div>
                        {tech.version && (
                          <span className="text-[10px] font-mono text-purple-400/90 font-medium">
                            {tech.version}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="text-purple-400/70">CI/CD & Realtime</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- RIGHT: TERMINAL PANEL & SYSTEM STATUS CARD (5 COLS) ---------------- */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* ================= 1. FUTURISTIC TERMINAL CARD ================= */}
            <div
              className={`glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-black/60 relative group hover:border-cyan-500/30 transition-all duration-300 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transition: 'all 0.5s ease-out 0.2s' }}
            >
              {/* Terminal Title Bar */}
              <div className="px-5 py-3.5 bg-black/60 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block border border-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block border border-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block border border-emerald-500" />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="truncate max-w-[200px] text-slate-300 font-medium">
                    {terminalHeader}
                  </span>
                </div>
                <div className="w-8" />
              </div>

              {/* Terminal Content Body */}
              <div className="p-6 font-mono text-xs sm:text-sm bg-[#060a17]/90 space-y-2.5 min-h-[300px]">
                <div className="text-slate-400 flex items-center gap-2 text-[11px] pb-2 border-b border-white/5 mb-3">
                  <span className="text-emerald-400 font-bold">rishav@workstation:~$</span>
                  <span className="text-cyan-300">dev --stack --all</span>
                </div>

                {terminalItems.slice(0, terminalLinesRevealed).map((item, idx) => (
                  <div
                    key={item.name + idx}
                    className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-white/[0.04] transition-colors group/row"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-cyan-400 font-bold select-none">&gt;</span>
                      <span className="text-slate-100 font-semibold truncate group-hover/row:text-cyan-200 transition-colors">
                        {item.name}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded ${
                        item.version.includes('v')
                          ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30'
                          : 'text-purple-300 bg-purple-950/60 border border-purple-500/30'
                      }`}
                    >
                      {item.version}
                    </span>
                  </div>
                ))}

                {/* Blinking Cursor line */}
                <div className="flex items-center gap-2 pt-2 text-cyan-400 text-xs">
                  <span className="text-emerald-400">&gt;</span>
                  <span className="w-2 h-4 bg-cyan-400 inline-block animate-pulse" />
                </div>
              </div>

              {/* Subtle bottom telemetry bar */}
              <div className="px-5 py-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-slate-400">PERN Stack Environment</span>
                <span className="text-emerald-400 font-semibold">Active Session</span>
              </div>
            </div>

            {/* ================= 2. SYSTEM STATUS CARD ================= */}
            <div
              className={`glass-card p-5 rounded-3xl border border-white/10 hover:border-emerald-500/30 shadow-xl transition-all duration-300 flex items-center justify-between gap-4 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transition: 'all 0.5s ease-out 0.35s' }}
            >
              <div className="flex items-center gap-3.5">
                <div className="relative flex-shrink-0">
                  <span
                    className={`w-3.5 h-3.5 rounded-full inline-block ${
                      systemStatusActive
                        ? 'bg-emerald-400 shadow-[0_0_12px_#34d399]'
                        : 'bg-rose-400 shadow-[0_0_12px_#f87171]'
                    }`}
                  />
                  {systemStatusActive && !isReducedMotion && (
                    <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                  )}
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                    System Status
                  </div>
                  <div className="text-sm font-bold text-white tracking-wide">
                    {systemStatusText}
                  </div>
                </div>
              </div>

              {/* Animated Audio Equalizer Visualization */}
              <div className="flex items-end gap-1.5 h-6 px-3 py-1 rounded-xl bg-white/[0.03] border border-white/5">
                {[
                  { delay: '0ms', dur: '0.9s', max: '22px' },
                  { delay: '150ms', dur: '0.7s', max: '18px' },
                  { delay: '300ms', dur: '1.1s', max: '24px' },
                  { delay: '75ms', dur: '0.8s', max: '15px' },
                  { delay: '220ms', dur: '1.0s', max: '20px' },
                ].map((bar, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full bg-gradient-to-t from-emerald-500 to-cyan-400 inline-block ${
                      !isReducedMotion ? 'animate-pulse' : ''
                    }`}
                    style={{
                      height: inView ? bar.max : '6px',
                      animationDuration: bar.dur,
                      animationDelay: bar.delay,
                      transition: 'height 0.4s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
