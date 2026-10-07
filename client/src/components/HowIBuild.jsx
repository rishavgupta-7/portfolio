import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  Search,
  FileText,
  Code2,
  Rocket,
  Compass,
  Activity,
  Layers,
  Zap,
  Globe,
  Radio,
  Workflow,
  Crosshair,
} from 'lucide-react';

export default function HowIBuild({ setting = {}, steps = [] }) {
  const sectionRef = useRef(null);
  const mapContainerRef = useRef(null);
  const cardRefs = useRef([]);

  const [inView, setInView] = useState(false);
  const [activeStage, setActiveStage] = useState(0); // 0, 1, 2, 3
  const [hoveredStage, setHoveredStage] = useState(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // 4D Map spatial tilt & mouse telemetry
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, mouseX: 0, mouseY: 0 });
  const [cardHoverGlow, setCardHoverGlow] = useState({});
  const [lineCoords, setLineCoords] = useState(null);

  // Section setting metadata
  const eyebrow = setting.eyebrow || 'MY PROCESS';
  const heading = setting.heading || 'How I Develop';
  const description =
    setting.description ||
    'A simple and transparent process to turn your ideas into a successful digital product.';

  // 4D Dimensions mapping
  const dimensionsMeta = [
    { dim: 'DIM-X', axis: 'Spatial Target', coord: '[X: 12.4 • Y: 0.0 • Z: 0.0 • T: 0.00s]', tag: 'Origin' },
    { dim: 'DIM-Y', axis: 'Blueprint Mesh', coord: '[X: 24.8 • Y: 46.2 • Z: 0.0 • T: +0.25s]', tag: 'Structure' },
    { dim: 'DIM-Z', axis: 'Neural Synthesis', coord: '[X: 48.6 • Y: 72.4 • Z: 89.2 • T: +0.50s]', tag: 'Execution' },
    { dim: 'DIM-T', axis: 'Temporal Orbit', coord: '[X: 96.0 • Y: 98.8 • Z: 180.4 • T: +1.00s]', tag: 'Continuum' },
  ];

  // Default steps fallback (with Develop replacing Build)
  const displaySteps = useMemo(() => {
    if (steps && steps.length > 0) {
      return steps
        .filter((s) => s.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((s) => ({
          ...s,
          title: s.title.toLowerCase() === 'build' ? 'Develop' : s.title,
        }));
    }
    return [
      {
        id: 1,
        stepNumber: '01',
        title: 'Discover',
        icon: 'Search',
        description: 'Understand your goals, requirements and target audience.',
      },
      {
        id: 2,
        stepNumber: '02',
        title: 'Design',
        icon: 'FileText',
        description: 'Create a detailed plan, wireframes and modern UI/UX design.',
      },
      {
        id: 3,
        stepNumber: '03',
        title: 'Develop',
        icon: 'Code',
        description: 'Develop with clean, scalable and maintainable code.',
      },
      {
        id: 4,
        stepNumber: '04',
        title: 'Deploy',
        icon: 'Rocket',
        description: 'Launch and provide ongoing support and improvements.',
      },
    ];
  }, [steps]);

  // Reduced motion preference
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(media.matches);
    const handler = (e) => setIsReducedMotion(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Continuous 4D Workflow Loop (01 -> 02 -> 03 -> 04 -> 01)
  useEffect(() => {
    if (!inView || isReducedMotion || hoveredStage !== null) return;

    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % displaySteps.length);
    }, 3400);

    return () => clearInterval(interval);
  }, [inView, isReducedMotion, hoveredStage, displaySteps.length]);

  // 4D Map Interactive Tilt on Mouse Move
  const handleMouseMove = (e) => {
    if (isReducedMotion || !mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt angles (-6deg to +6deg)
    const rotateY = ((x - centerX) / centerX) * 5;
    const rotateX = -((y - centerY) / centerY) * 4;

    setTilt({
      rotateX,
      rotateY,
      mouseX: ((x - centerX) / centerX) * 20,
      mouseY: ((y - centerY) / centerY) * 20,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, mouseX: 0, mouseY: 0 });
  };

  const handleCardMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCardHoverGlow((prev) => ({ ...prev, [index]: { x, y } }));
  };

  // Measure timeline coordinates for connection paths
  const updateTimeline = () => {
    if (!mapContainerRef.current || cardRefs.current.length < 2) return;
    const container = mapContainerRef.current.getBoundingClientRect();

    const points = cardRefs.current.filter(Boolean).map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - container.left,
        y: rect.top + rect.height / 2 - container.top,
      };
    });

    if (points.length >= 2) {
      setLineCoords(points);
    }
  };

  useEffect(() => {
    updateTimeline();
    window.addEventListener('resize', updateTimeline);
    const timer = setTimeout(updateTimeline, 400);
    return () => {
      window.removeEventListener('resize', updateTimeline);
      clearTimeout(timer);
    };
  }, [displaySteps, inView]);

  const currentHighlight = hoveredStage !== null ? hoveredStage : activeStage;
  const currentDim = dimensionsMeta[currentHighlight] || dimensionsMeta[0];

  return (
    <section
      ref={sectionRef}
      id="process"
      className="py-24 sm:py-32 relative overflow-hidden bg-[#030612] border-t border-white/5 select-none"
    >
      {/* 4D Topological Deep Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#030612] via-transparent to-[#030612] pointer-events-none" />

      {/* Rotating 4D Hypercube / Tesseract Watermark Simulation (SVG) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none opacity-[0.035] overflow-hidden">
        <svg viewBox="0 0 400 400" className="w-full h-full animate-spin-slow">
          <circle cx="200" cy="200" r="180" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 8" />
          <circle cx="200" cy="200" r="130" fill="none" stroke="#a855f7" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="80" fill="none" stroke="#ec4899" strokeWidth="1" strokeDasharray="4 6" />
          {/* Outer isometric cube */}
          <polygon points="200,60 320,130 320,270 200,340 80,270 80,130" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Inner hypercube */}
          <polygon points="200,120 260,155 260,245 200,280 140,245 140,155" fill="none" stroke="#a855f7" strokeWidth="1.5" />
          {/* 4D Vector connection lines */}
          <line x1="200" y1="60" x2="200" y2="120" stroke="#38bdf8" strokeWidth="1" />
          <line x1="320" y1="130" x2="260" y2="155" stroke="#38bdf8" strokeWidth="1" />
          <line x1="320" y1="270" x2="260" y2="245" stroke="#38bdf8" strokeWidth="1" />
          <line x1="200" y1="340" x2="200" y2="280" stroke="#38bdf8" strokeWidth="1" />
          <line x1="80" y1="270" x2="140" y2="245" stroke="#38bdf8" strokeWidth="1" />
          <line x1="80" y1="130" x2="140" y2="155" stroke="#38bdf8" strokeWidth="1" />
        </svg>
      </div>

      {/* Ambient Parallax Radial Atmosphere */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[140px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${tilt.mouseX * 1.5}px, ${tilt.mouseY * 1.5}px, 0)`,
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${-tilt.mouseX * 1.5}px, ${-tilt.mouseY * 1.5}px, 0)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          {/* Eyebrow Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span>4D WORKFLOW TOPOLOGY • {eyebrow}</span>
          </div>

          {/* Heading with Cyber Gradient */}
          <h2
            className={`text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight transition-all duration-700 delay-100 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {heading}
          </h2>

          {/* Description */}
          <p
            className={`text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {description}
          </p>
        </div>

        {/* ================= 4D MAP HUD BAR ================= */}
        <div
          className={`mb-8 p-4 rounded-2xl glass-card border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono transition-all duration-700 delay-250 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Left: Map System Mode & Radar Sweep */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
              <span className="absolute w-6 h-6 rounded-full border border-cyan-400/50 animate-ping opacity-60" />
            </div>
            <div>
              <span className="text-white font-bold tracking-wider">4D TOPOLOGICAL MAP</span>
              <span className="text-slate-400 hidden sm:inline"> // REAL-TIME ORBITAL PIPELINE</span>
            </div>
          </div>

          {/* Center: Interactive Dimension Badges */}
          <div className="flex items-center gap-1.5">
            {dimensionsMeta.map((dim, i) => (
              <button
                key={dim.dim}
                onClick={() => setActiveStage(i)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono tracking-wider transition-all cursor-pointer ${
                  currentHighlight === i
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {dim.dim}
              </button>
            ))}
          </div>

          {/* Right: Real-time Telemetry Coordinates */}
          <div className="flex items-center gap-2 text-cyan-300">
            <Crosshair className="w-3.5 h-3.5 animate-spin-slow text-cyan-400" />
            <span className="text-[11px] tracking-widest">{currentDim.coord}</span>
          </div>
        </div>

        {/* ================= 4D MAP CANVAS (PERSPECTIVE PLANE) ================= */}
        <div
          ref={mapContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative py-8 transition-transform duration-300 ease-out"
          style={{
            perspective: '1200px',
            transform: !isReducedMotion
              ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
              : 'none',
          }}
        >
          {/* Holographic Radar Scanner Beam sweeping across the 4D Map */}
          {!isReducedMotion && inView && (
            <div
              className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent pointer-events-none blur-md animate-pulse hidden md:block"
              style={{
                left: `${(currentHighlight / (displaySteps.length - 1)) * 80 + 10}%`,
                transition: 'left 1s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          )}

          {/* SVG 4D Quantum Vector Laser Path (Desktop & Tablet) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <filter id="vector-laser-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="laser-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                <stop offset="33%" stopColor="#818cf8" stopOpacity="0.9" />
                <stop offset="66%" stopColor="#a855f7" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {lineCoords && lineCoords.length >= 2 && (
              <>
                {/* Dual Guide Wire Rails */}
                <path
                  d={`M ${lineCoords[0].x} ${lineCoords[0].y - 8} L ${
                    lineCoords[lineCoords.length - 1].x
                  } ${lineCoords[lineCoords.length - 1].y - 8}`}
                  fill="none"
                  stroke="rgba(56, 189, 248, 0.15)"
                  strokeWidth="1"
                  strokeDasharray="3 6"
                />
                <path
                  d={`M ${lineCoords[0].x} ${lineCoords[0].y + 8} L ${
                    lineCoords[lineCoords.length - 1].x
                  } ${lineCoords[lineCoords.length - 1].y + 8}`}
                  fill="none"
                  stroke="rgba(168, 85, 247, 0.15)"
                  strokeWidth="1"
                  strokeDasharray="3 6"
                />

                {/* Core Laser Beam with Progressive Glow */}
                <path
                  d={`M ${lineCoords[0].x} ${lineCoords[0].y} L ${
                    lineCoords[lineCoords.length - 1].x
                  } ${lineCoords[lineCoords.length - 1].y}`}
                  fill="none"
                  stroke="url(#laser-grad)"
                  strokeWidth="2.5"
                  filter="url(#vector-laser-glow)"
                  className={inView && !isReducedMotion ? 'opacity-90' : 'opacity-0'}
                  style={{ transition: 'opacity 1s ease' }}
                />

                {/* Traveling 4D Photonic Data Packet */}
                {inView && !isReducedMotion && (
                  <g>
                    <circle r="6" fill="#ffffff" filter="url(#vector-laser-glow)">
                      <animateMotion
                        dur="4s"
                        repeatCount="indefinite"
                        path={`M ${lineCoords[0].x} ${lineCoords[0].y} L ${
                          lineCoords[lineCoords.length - 1].x
                        } ${lineCoords[lineCoords.length - 1].y}`}
                      />
                    </circle>
                    <circle r="2.5" fill="#38bdf8">
                      <animateMotion
                        dur="4s"
                        repeatCount="indefinite"
                        path={`M ${lineCoords[0].x} ${lineCoords[0].y} L ${
                          lineCoords[lineCoords.length - 1].x
                        } ${lineCoords[lineCoords.length - 1].y}`}
                      />
                    </circle>
                  </g>
                )}
              </>
            )}
          </svg>

          {/* Mobile Vertical Vector Line */}
          <svg
            className="absolute left-7 top-6 bottom-6 w-1 pointer-events-none z-0 md:hidden"
            style={{ overflow: 'visible' }}
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              stroke="rgba(56, 189, 248, 0.3)"
              strokeWidth="2"
              strokeDasharray="4 6"
            />
            {inView && !isReducedMotion && (
              <circle cx="0" r="4" fill="#38bdf8" filter="url(#vector-laser-glow)">
                <animate attributeName="cy" from="0%" to="100%" dur="3.8s" repeatCount="indefinite" />
              </circle>
            )}
          </svg>

          {/* ================= 4D MAP NODES GRID ================= */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative z-10">
            {displaySteps.map((step, idx) => {
              const isActive = currentHighlight === idx;
              const dimMeta = dimensionsMeta[idx] || dimensionsMeta[0];
              const cardHover = cardHoverGlow[idx] || { x: 100, y: 100 };
              const entranceDelay = `${idx * 150 + 120}ms`;

              return (
                <div
                  key={step.id || step.stepNumber}
                  ref={(el) => (cardRefs.current[idx] = el)}
                  onMouseEnter={() => setHoveredStage(idx)}
                  onMouseLeave={() => setHoveredStage(null)}
                  onMouseMove={(e) => handleCardMouseMove(e, idx)}
                  className={`relative flex flex-col items-center transition-all duration-500 group cursor-pointer ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 blur-sm'
                  }`}
                  style={{
                    transitionDelay: entranceDelay,
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Outer Holographic Card Container */}
                  <div
                    className={`w-full glass-card p-6 sm:p-7 rounded-3xl border transition-all duration-400 relative overflow-hidden flex flex-col items-center justify-between min-h-[340px] ${
                      isActive
                        ? 'border-cyan-400/80 shadow-[0_0_40px_rgba(6,182,212,0.35)] bg-gradient-to-b from-[#0c1432]/95 via-[#080d22]/90 to-[#040817]/95 -translate-y-2.5 scale-[1.02]'
                        : 'border-white/10 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] bg-[#070b1c]/80 hover:-translate-y-1.5'
                    }`}
                  >
                    {/* Corner Cyber Brackets */}
                    <span className="absolute top-2.5 left-2.5 text-[9px] font-mono text-cyan-500/40 select-none">
                      ┌ 4D
                    </span>
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-mono text-cyan-500/40 select-none">
                      ┐
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 text-[9px] font-mono text-cyan-500/40 select-none">
                      └
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 text-[9px] font-mono text-cyan-500/40 select-none">
                      ┘
                    </span>

                    {/* Interactive Cursor Light Field */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle 130px at ${cardHover.x}px ${cardHover.y}px, rgba(56, 189, 248, 0.18), transparent 70%)`,
                      }}
                    />

                    {/* Top Row: Dimension Coordinate & Step Number */}
                    <div className="w-full flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border transition-all ${
                            isActive
                              ? 'text-cyan-300 bg-cyan-950/70 border-cyan-400/50 shadow-[0_0_8px_#22d3ee]'
                              : 'text-slate-400 bg-white/5 border-white/10'
                          }`}
                        >
                          {dimMeta.dim}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase hidden sm:inline">
                          {dimMeta.tag}
                        </span>
                      </div>

                      <span
                        className={`text-xl font-display font-extrabold font-mono transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        {step.stepNumber}
                      </span>
                    </div>

                    {/* 4D Concentric Quantum Orbital Portal Node */}
                    <div className="relative my-4 flex items-center justify-center">
                      {/* Radiating Sonar Waves on Active Stage */}
                      {isActive && !isReducedMotion && (
                        <>
                          <span className="absolute w-24 h-24 rounded-full border border-cyan-400/40 animate-ping opacity-50" />
                          <span className="absolute w-28 h-28 rounded-full border border-purple-500/30 animate-pulse opacity-40" />
                        </>
                      )}

                      {/* Counter-rotating Outer Dash Ring */}
                      <div
                        className={`absolute w-20 h-20 rounded-full border border-dashed transition-all duration-700 pointer-events-none ${
                          isActive
                            ? 'border-cyan-400/70 animate-spin-slow'
                            : 'border-white/15 group-hover:border-purple-400/40'
                        }`}
                      />

                      {/* Ambient Glowing Aura */}
                      <div
                        className={`absolute w-20 h-20 rounded-full transition-all duration-500 blur-xl pointer-events-none ${
                          isActive
                            ? 'bg-cyan-500/40 scale-125'
                            : 'bg-purple-500/15 group-hover:bg-cyan-500/30 group-hover:scale-110'
                        }`}
                      />

                      {/* Central Glowing Portal Circle */}
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center relative z-10 transition-all duration-400 border backdrop-blur-xl ${
                          isActive
                            ? 'bg-gradient-to-tr from-cyan-950/90 via-[#0a102b] to-purple-950/90 border-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.6)] scale-110 text-white'
                            : 'bg-[#080d22]/90 border-white/15 group-hover:border-cyan-400/60 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] text-slate-300 group-hover:text-white'
                        }`}
                      >
                        <StageIcon
                          iconName={step.icon}
                          stageTitle={step.title}
                          isActive={isActive}
                          isReducedMotion={isReducedMotion}
                        />
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2 mt-2 w-full text-center">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-cyan-400/80 block uppercase tracking-widest">
                          {dimMeta.axis}
                        </span>
                        <h3
                          className={`text-lg sm:text-xl font-display font-extrabold tracking-wide transition-colors duration-300 ${
                            isActive ? 'text-white' : 'text-slate-100 group-hover:text-cyan-300'
                          }`}
                        >
                          {step.title}
                        </h3>
                      </div>

                      <p
                        className={`text-xs leading-relaxed transition-colors duration-300 ${
                          isActive ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-300'
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>

                    {/* Bottom Telemetry Status */}
                    <div className="mt-4 pt-3 border-t border-white/5 w-full flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Radio className="w-2.5 h-2.5 text-cyan-400" />
                        <span>NODE_{step.stepNumber}</span>
                      </span>

                      {isActive ? (
                        <span className="text-cyan-300 font-bold flex items-center gap-1 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          <span>4D SYNC</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 group-hover:text-purple-300 transition-colors">
                          STANDBY
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Stage Specific Micro-Animations with 4D Aesthetics
function StageIcon({ iconName, stageTitle, isActive, isReducedMotion }) {
  const normTitle = (stageTitle || '').toLowerCase();
  const normIcon = (iconName || '').toLowerCase();

  // 1. DISCOVER — Optical Radar Scan
  if (normIcon.includes('search') || normTitle.includes('discover')) {
    return (
      <div className="relative flex items-center justify-center">
        <Search
          className={`w-7 h-7 transition-transform duration-500 ${
            isActive && !isReducedMotion
              ? 'animate-bounce text-cyan-300'
              : 'group-hover:rotate-12 transition-transform'
          }`}
          style={{ animationDuration: '2.4s' }}
        />
        <span
          className={`absolute w-3 h-3 rounded-full bg-cyan-400/50 blur-xs transition-opacity ${
            isActive ? 'opacity-100 scale-125' : 'opacity-0'
          }`}
        />
      </div>
    );
  }

  // 2. DESIGN — Blueprint Vector Drafter
  if (normIcon.includes('file') || normTitle.includes('design')) {
    return (
      <div className="relative flex items-center justify-center">
        <FileText
          className={`w-7 h-7 transition-colors duration-300 ${
            isActive ? 'text-indigo-300' : 'group-hover:text-indigo-300'
          }`}
        />
        <span
          className={`absolute inset-x-2 top-3 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-opacity duration-300 ${
            isActive && !isReducedMotion ? 'opacity-100 animate-pulse' : 'opacity-0'
          }`}
        />
      </div>
    );
  }

  // 3. DEVELOP — Neural Code Compiler with Matrix Pulse
  if (normIcon.includes('code') || normTitle.includes('develop') || normTitle.includes('build')) {
    return (
      <div className="relative flex items-center justify-center">
        <Code2
          className={`w-7 h-7 transition-transform duration-300 ${
            isActive && !isReducedMotion
              ? 'scale-115 text-emerald-300'
              : 'group-hover:scale-105 group-hover:text-emerald-300'
          }`}
        />
        <span
          className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] transition-opacity ${
            isActive && !isReducedMotion ? 'opacity-100 animate-ping' : 'opacity-0'
          }`}
        />
        {/* Animated code stream pill */}
        <span
          className={`absolute -bottom-2 text-[8px] font-mono text-emerald-300 bg-black/60 px-1 rounded transition-opacity ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        >
          &lt;/&gt;
        </span>
      </div>
    );
  }

  // 4. DEPLOY — Orbital Thrust Rocket
  if (normIcon.includes('rocket') || normTitle.includes('deploy')) {
    return (
      <div className="relative flex items-center justify-center">
        <Rocket
          className={`w-7 h-7 transition-all duration-500 ${
            isActive && !isReducedMotion
              ? '-translate-y-1 text-pink-300 rotate-12'
              : 'group-hover:-translate-y-1 group-hover:rotate-6 group-hover:text-pink-300'
          }`}
        />
        <span
          className={`absolute -bottom-1.5 w-3.5 h-2.5 rounded-full bg-gradient-to-t from-amber-500 via-rose-500 to-transparent blur-xs transition-opacity duration-300 ${
            isActive && !isReducedMotion ? 'opacity-100 animate-pulse' : 'opacity-0'
          }`}
        />
      </div>
    );
  }

  return <Workflow className="w-7 h-7 text-cyan-400" />;
}
