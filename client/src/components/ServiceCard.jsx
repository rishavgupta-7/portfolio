import React from 'react';
import {
  Code2,
  ShoppingBag,
  Server,
  Zap,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const iconMap = {
  Code2: Code2,
  ShoppingBag: ShoppingBag,
  Server: Server,
  Zap: Zap,
  Cpu: Cpu,
  Layers: Layers,
};

export default function ServiceCard({ service, index = 0 }) {
  const { title, description, icon, technologies = [] } = service;
  const IconComponent = iconMap[icon] || Code2;

  return (
    <div className="glass-card glass-card-hover p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between group relative overflow-hidden">
      {/* Decorative gradient corner on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 via-purple-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:from-cyan-500/20 transition-all duration-300"></div>

      <div className="space-y-5">
        {/* Service Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:text-purple-300 group-hover:border-purple-500/50 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-cyan-500/10">
          <IconComponent className="w-7 h-7" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white group-hover:text-cyan-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed font-light">
            {description}
          </p>
        </div>
      </div>

      {/* Tech Pills */}
      <div className="mt-6 pt-5 border-t border-white/5 space-y-3">
        <span className="text-[11px] uppercase tracking-wider font-mono text-slate-400 block">
          Key Tech & Frameworks:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {technologies.map((t, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono text-cyan-300 bg-cyan-950/30 border border-cyan-500/20"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
