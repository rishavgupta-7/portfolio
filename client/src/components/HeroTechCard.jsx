import React from 'react';

const positionClasses = {
  'top-left': 'top-4 -left-6 sm:top-8 sm:-left-8 md:top-12 md:-left-10',
  'top-right': 'top-2 -right-6 sm:top-6 sm:-right-8 md:top-8 md:-right-10',
  'center-right': 'top-1/2 -right-8 sm:-right-12 md:-right-14 -translate-y-1/2',
  'bottom-right': 'bottom-6 -right-6 sm:bottom-10 sm:-right-8 md:bottom-12 md:-right-8',
  'bottom-left': 'bottom-4 -left-6 sm:bottom-8 sm:-left-8 md:bottom-10 md:-left-8',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
  'floating': 'top-1/3 left-0',
};

const floatAnimations = [
  'animate-float-slow',
  'animate-float-medium',
  'animate-float-fast',
];

export default function HeroTechCard({ tech, index = 0 }) {
  const posClass = positionClasses[tech.position] || positionClasses['floating'];
  const animClass = floatAnimations[index % floatAnimations.length];

  return (
    <div
      className={`absolute ${posClass} z-20 transition-all duration-300 pointer-events-auto`}
      style={{
        animationDelay: `${tech.animationDelay || index * 0.4}s`,
      }}
    >
      <div
        className={`${animClass} group relative flex items-center gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl glass-card border border-cyan-500/20 shadow-lg shadow-cyan-500/10 hover:border-purple-500/60 hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-xl bg-[#090d20]/80`}
      >
        {/* Glowing aura inside card */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Tech Logo */}
        <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-black/40 p-1 flex items-center justify-center border border-white/5 shadow-inner">
          <img
            src={tech.logoUrl}
            alt={tech.name}
            className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-200"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Tech Info */}
        <div className="relative flex flex-col text-left">
          <span className="text-xs sm:text-sm font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors">
            {tech.name}
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
            {tech.category || 'Tech'}
          </span>
        </div>

        {/* Small glowing indicator dot */}
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse"></span>
      </div>
    </div>
  );
}
