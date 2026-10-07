import React from 'react';
import { Cpu, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Stack({ technologies = [] }) {
  // Group technologies by category
  const categories = ['Frontend', 'Backend', 'E-commerce', 'Database', 'Core', 'Tools'];

  return (
    <div className="pt-32 pb-24 min-h-screen cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400 bg-cyan-950/30 border border-cyan-500/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>Technical Ecosystem</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
            Technology Stack & Radar
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Battle-tested frameworks, cloud architecture, and modern programming languages utilized across client systems.
          </p>
        </div>

        {/* Grouped Tech Sections */}
        <div className="space-y-12">
          {categories.map((cat) => {
            const groupTechs = technologies.filter(
              (t) => (t.category || '').toLowerCase() === cat.toLowerCase()
            );

            if (groupTechs.length === 0) return null;

            return (
              <div key={cat} className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                    {cat} Technologies
                  </h2>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                    {groupTechs.length} items
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {groupTechs.map((tech) => (
                    <div
                      key={tech.id}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/40 hover:bg-white/[0.07] transition-all duration-300 flex flex-col items-center text-center space-y-3 group cursor-default"
                    >
                      <div className="w-12 h-12 rounded-xl bg-black/40 p-2 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                        <img
                          src={tech.logoUrl}
                          alt={tech.name}
                          className="w-full h-full object-contain filter"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                        {tech.name}
                      </span>
                      {tech.isHero && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          Hero Card
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
