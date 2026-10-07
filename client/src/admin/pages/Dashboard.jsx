import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  ShoppingBag,
  Cpu,
  Mail,
  Quote,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import api from '../../services/api.js';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.getOverview();
        setData(res);
      } catch (err) {
        console.error('Failed to load dashboard overview:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center font-mono text-cyan-400 text-sm">
        Loading CMS metrics...
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const recentMessages = data?.recentMessages || [];

  const statCards = [
    { label: 'Total Projects', value: metrics.projects || 0, icon: Layers, link: '/stark/projects', color: 'from-blue-500/20 to-cyan-500/20 text-cyan-400' },
    { label: 'Active Services', value: metrics.services || 0, icon: ShoppingBag, link: '/stark/services', color: 'from-purple-500/20 to-pink-500/20 text-purple-400' },
    { label: 'Technology Stack', value: metrics.technologies || 0, icon: Cpu, link: '/stark/technologies', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400' },
    { label: 'Unread Inquiries', value: metrics.unreadMessages || 0, icon: Mail, link: '/stark/messages', color: 'from-amber-500/20 to-orange-500/20 text-amber-400' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/20 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STARK CMS Online</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Admin Command Center
          </h1>
          <p className="text-sm text-slate-300 font-light max-w-xl">
            Manage and update the entire portfolio dynamically without touching source code. All changes sync directly with PostgreSQL.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <Link
            to="/stark/hero"
            className="btn-neon-primary px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white"
          >
            Edit Hero Section
          </Link>
          <Link
            to="/stark/projects"
            className="btn-neon-secondary px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-200"
          >
            Manage Projects
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="glass-card p-6 rounded-2xl border border-white/5 hover:border-cyan-500/40 transition-all duration-300 space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  {card.label}
                </span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-display font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {card.value}
                </span>
                <span className="text-xs font-mono text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Manage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Contact Submissions */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg sm:text-xl font-display font-bold text-white">
              Recent Client Messages
            </h2>
          </div>
          <Link
            to="/stark/messages"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View All ({metrics.messages || 0}) →
          </Link>
        </div>

        {recentMessages.length > 0 ? (
          <div className="divide-y divide-white/5">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{msg.name}</span>
                    <span className="text-xs text-slate-400 font-mono">({msg.email})</span>
                    {!msg.isRead && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{msg.subject}</p>
                  <p className="text-xs text-slate-400 line-clamp-1">{msg.message}</p>
                </div>
                <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 font-mono py-6 text-center">
            No contact messages received yet.
          </p>
        )}
      </div>
    </div>
  );
}
