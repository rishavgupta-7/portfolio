import React, { useState, useEffect, useRef } from 'react';
import {
  ExternalLink,
  Sparkles,
  Maximize2,
  Play,
  Film,
  Video,
  Image as ImageIcon,
  Eye,
  Activity,
  Layers,
} from 'lucide-react';
import { GithubIcon } from './Icons.jsx';
import ProjectPreviewModal from './ProjectPreviewModal.jsx';
import { isVideoMedia } from '../admin/components/MultiMediaUpload.jsx';

export default function ProjectCard({ project }) {
  const {
    title,
    tagline,
    description,
    imageUrl,
    videoUrl,
    media = [],
    category,
    techStack = [],
    liveUrl,
    githubUrl,
    featured,
  } = project;

  const [isHovered, setIsHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const videoRef = useRef(null);

  // Compile list of media
  const allMedia = React.useMemo(() => {
    const list = [];
    if (videoUrl && !list.includes(videoUrl)) {
      list.push(videoUrl);
    }
    if (Array.isArray(media)) {
      media.forEach((item) => {
        if (item && !list.includes(item)) list.push(item);
      });
    }
    if (imageUrl && !list.includes(imageUrl)) {
      list.push(imageUrl);
    }
    if (list.length === 0 && imageUrl) list.push(imageUrl);
    return list;
  }, [videoUrl, media, imageUrl]);

  const hasVideo = Boolean(videoUrl || allMedia.some((u) => isVideoMedia(u)));
  const primaryVideo = videoUrl || allMedia.find((u) => isVideoMedia(u));
  const imageScreenshots = allMedia.filter((u) => !isVideoMedia(u));
  const effectiveImages = imageScreenshots.length > 0 ? imageScreenshots : [imageUrl];

  // Auto-cycle screenshots on hover if multiple images exist and no primary video
  useEffect(() => {
    let interval;
    if (isHovered && effectiveImages.length > 1 && !primaryVideo) {
      interval = setInterval(() => {
        setActiveImageIdx((prev) => (prev + 1) % effectiveImages.length);
      }, 1600);
    } else {
      setActiveImageIdx(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, effectiveImages.length, primaryVideo]);

  // Video hover auto-play
  useEffect(() => {
    if (!videoRef.current) return;
    if (isHovered && primaryVideo) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented or interrupted
        });
      }
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered, primaryVideo]);

  const currentDisplayImage = effectiveImages[activeImageIdx] || imageUrl;

  return (
    <>
      <div
        className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col h-full border border-white/10 group transition-all duration-300 relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail & Interactive Media Preview Area */}
        <div
          onClick={() => setModalOpen(true)}
          className="relative aspect-[16/10] overflow-hidden bg-[#030611] cursor-pointer select-none"
        >
          {/* Base Static Image */}
          <img
            src={currentDisplayImage}
            alt={title}
            className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered && !primaryVideo ? 'scale-105 filter brightness-105' : 'scale-100'
            }`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Hover Video Preview Layer */}
          {primaryVideo && (
            <video
              ref={videoRef}
              src={primaryVideo}
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                isHovered ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
              }`}
            />
          )}

          {/* Vignette / Bottom Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d20] via-transparent to-transparent opacity-80 pointer-events-none z-10" />

          {/* Futuristic Cybernetic Corners on Hover */}
          <div
            className={`absolute inset-2 pointer-events-none z-20 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />

            {/* Scanning Laser Beam on Hover */}
            <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(6,182,212,1)] animate-[scanline_3s_linear_infinite]" />
          </div>

          {/* Category Pill */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-[#05070f]/80 text-cyan-400 border border-cyan-500/30 backdrop-blur-md shadow-md">
              {category}
            </span>
          </div>

          {/* Featured Pill & Media Counters */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 pointer-events-none">
            {hasVideo && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-purple-950/80 text-purple-300 border border-purple-500/40 backdrop-blur-md flex items-center gap-1 shadow-sm">
                <Play className="w-2.5 h-2.5 fill-purple-400 text-purple-400" />
                <span>VIDEO</span>
              </span>
            )}
            {effectiveImages.length > 1 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 backdrop-blur-md flex items-center gap-1 shadow-sm">
                <Film className="w-2.5 h-2.5 text-cyan-400" />
                <span>{effectiveImages.length} SHOTS</span>
              </span>
            )}
            {featured && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/30 text-purple-300 border border-purple-500/50 backdrop-blur-md shadow-[0_0_12px_rgba(168,85,247,0.3)]">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Featured
              </span>
            )}
          </div>

          {/* On-Hover Futuristic Quick Action & HUD Telemetry */}
          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-center p-4 transition-all duration-300 pointer-events-none ${
              isHovered ? 'opacity-100 bg-black/40 backdrop-blur-[2px]' : 'opacity-0'
            }`}
          >
            {/* Center Hover Action Button */}
            <div className="btn-neon-primary px-4 py-2 rounded-2xl text-xs font-bold font-mono uppercase tracking-wider text-white inline-flex items-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.6)] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect 4D Telemetry</span>
            </div>

            {/* Telemetry info bar at bottom of thumbnail */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-cyan-300/90 pointer-events-none">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>
                  {primaryVideo ? 'LIVE_STREAM // 60FPS' : `FRAME ${String(activeImageIdx + 1).padStart(2, '0')}/${String(effectiveImages.length).padStart(2, '0')}`}
                </span>
              </div>
              <span className="text-slate-400 hidden sm:inline">CLICK FOR FULLSCREEN</span>
            </div>

            {/* Frame indicator dots for multiple screenshots */}
            {effectiveImages.length > 1 && !primaryVideo && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20">
                {effectiveImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      idx === activeImageIdx
                        ? 'w-4 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                        : 'w-1.5 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
          <div className="space-y-2">
            {tagline && (
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" />
                <span>{tagline}</span>
              </span>
            )}
            <h3
              onClick={() => setModalOpen(true)}
              className="text-xl sm:text-2xl font-display font-bold text-white group-hover:text-cyan-400 transition-colors cursor-pointer"
            >
              {title}
            </h3>
            <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed font-light">
              {description}
            </p>
          </div>

          {/* Tech Stack Chips */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap gap-1.5">
              {techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium text-slate-300 bg-white/5 border border-white/5"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action Links */}
            <div className="flex items-center gap-2 pt-3 border-t border-white/5">
              {/* Fullscreen 4D Preview Button */}
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="px-3 py-2 rounded-xl text-xs font-mono font-semibold text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Full-Screen 4D Preview"
              >
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Preview</span>
              </button>

              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white btn-neon-primary"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 p-2.5 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  title="View Code on GitHub"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Futuristic Full-Site Preview Modal */}
      <ProjectPreviewModal
        project={project}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
