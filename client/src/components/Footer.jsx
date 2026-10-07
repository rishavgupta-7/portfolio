import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  ArrowUp,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './Icons.jsx';

const iconMap = {
  Github: GithubIcon,
  Linkedin: LinkedinIcon,
  Twitter: TwitterIcon,
  Mail: Mail,
};

export default function Footer({
  heroName = 'Rishav Gupta',
  socialLinks = [],
  settings = {},
}) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerText =
    settings.footerText ||
    'Designed & Developed with React, Vite, Node.js & Prisma. All rights reserved.';

  return (
    <footer className="relative bg-[#03050c] border-t border-white/5 pt-16 pb-12 overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40rem] h-[10rem] bg-gradient-to-t from-cyan-600/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px]">
                <div className="w-full h-full bg-[#070b19] rounded-[7px] flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-display font-bold text-lg text-white">
                {heroName}
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Full-Stack & Shopify developer crafting high-performance digital architectures,
              custom storefronts, and futuristic web experiences.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((s, idx) => {
                const IconComponent = iconMap[s.icon] || Mail;
                return (
                  <a
                    key={s.id || idx}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-all duration-200"
                    title={s.platform}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold block">
              Navigation
            </span>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/work" className="hover:text-cyan-400 transition-colors">
                  Featured Work
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-cyan-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/stack" className="hover:text-cyan-400 transition-colors">
                  Tech Radar
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold block">
              Direct Contact
            </span>
            <p className="text-sm text-slate-400">
              Available for freelance collaborations, enterprise contracts, and bespoke Shopify Plus builds.
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white btn-neon-primary"
              >
                <span>Initiate Project</span>
                <Sparkles className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {heroName}. {footerText}</p>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>

            <span className="text-white/20">•</span>

            {/* Discreet Admin Entrance Link */}
            <Link
              to="/stark/login"
              className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors opacity-60 hover:opacity-100"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
