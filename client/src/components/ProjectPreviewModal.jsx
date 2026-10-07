import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  Sparkles,
  Layers,
  Terminal,
  Film,
  Video,
  Image as ImageIcon,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { GithubIcon } from './Icons.jsx';
import { isVideoMedia } from '../admin/components/MultiMediaUpload.jsx';

export default function ProjectPreviewModal({ project, isOpen, onClose }) {
  if (!isOpen || !project) return null;

  // Compile list of all media items:
  // Combine media array, imageUrl, and videoUrl into a unique list
  const allMedia = React.useMemo(() => {
    const list = [];
    if (project.videoUrl && !list.includes(project.videoUrl)) {
      list.push(project.videoUrl);
    }
    if (Array.isArray(project.media)) {
      project.media.forEach((item) => {
        if (item && !list.includes(item)) list.push(item);
      });
    }
    if (project.imageUrl && !list.includes(project.imageUrl)) {
      list.push(project.imageUrl);
    }
    // If empty fallback
    if (list.length === 0 && project.imageUrl) list.push(project.imageUrl);
    return list;
  }, [project]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isGlitching, setIsGlitching] = useState(false);
  const videoRef = useRef(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock scroll on body
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activeIndex, allMedia.length]);

  const handleNext = () => {
    if (allMedia.length <= 1) return;
    triggerGlitch();
    setActiveIndex((prev) => (prev + 1) % allMedia.length);
  };

  const handlePrev = () => {
    if (allMedia.length <= 1) return;
    triggerGlitch();
    setActiveIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  };

  const triggerGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 220);
  };

  const currentMediaUrl = allMedia[activeIndex] || project.imageUrl;
  const isCurrentVideo = isVideoMedia(currentMediaUrl);

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300"
    >
      {/* Background ambient futuristic lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      </div>

      {/* Main HUD Container */}
      <div className="relative w-full max-w-6xl max-h-[96vh] glass-card rounded-3xl border border-cyan-500/30 shadow-[0_0_80px_rgba(6,182,212,0.18)] flex flex-col overflow-hidden">
        {/* Futuristic Top HUD Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#060914]/90 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-3">
            {/* Tech Genius HUD Label */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <div className="font-mono text-xs text-cyan-400 font-bold tracking-widest uppercase flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>STARK_OS // 4D_PREVIEW_TELEMETRY</span>
              </div>
            </div>

            <span className="hidden sm:inline-block text-white/20 font-mono text-xs">|</span>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
              <Cpu className="w-2.5 h-2.5 text-cyan-400" />
              <span>GPU_ACCELERATED</span>
            </span>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-purple-950/60 text-purple-300 border border-purple-500/30">
              {project.category || 'Engineering'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
              FRAME {String(activeIndex + 1).padStart(2, '0')} / {String(allMedia.length).padStart(2, '0')}
            </span>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer group"
              title="Close Preview (Esc)"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between">
          {/* Main Visual Display Area */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/10] bg-[#02040a] flex items-center justify-center overflow-hidden group select-none">
            {/* Tech Corner HUD Overlays */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400/80 pointer-events-none z-20" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400/80 pointer-events-none z-20" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400/80 pointer-events-none z-20" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400/80 pointer-events-none z-20" />

            {/* Scanning Laser Line */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 animate-[scanline_4s_linear_infinite] pointer-events-none z-10" />

            {/* Visual Glitch Transition Effect */}
            <div
              className={`w-full h-full flex items-center justify-center transition-all duration-300 ${
                isGlitching ? 'opacity-40 scale-[0.99] blur-[2px]' : 'opacity-100 scale-100 blur-0'
              }`}
            >
              {isCurrentVideo ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  <video
                    ref={videoRef}
                    key={currentMediaUrl}
                    src={currentMediaUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-contain"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />

                  {/* Video Controls HUD Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 opacity-90 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={toggleVideoPlay}
                        className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 cursor-pointer"
                        title={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={toggleMute}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 cursor-pointer"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        LIVE_VIDEO_STREAM
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest hidden sm:inline">
                      Auto-Loop Telemetry
                    </span>
                  </div>
                </div>
              ) : (
                <img
                  key={currentMediaUrl}
                  src={currentMediaUrl}
                  alt={project.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              )}
            </div>

            {/* Navigation Arrows */}
            {allMedia.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-2xl bg-black/60 hover:bg-cyan-500/30 text-white hover:text-cyan-300 border border-white/10 hover:border-cyan-500/50 backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-110 active:scale-95"
                  title="Previous (Left Arrow)"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-2xl bg-black/60 hover:bg-cyan-500/30 text-white hover:text-cyan-300 border border-white/10 hover:border-cyan-500/50 backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-110 active:scale-95"
                  title="Next (Right Arrow)"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}

            {/* Media Type Flag */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-black/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md flex items-center gap-1.5 shadow-md">
                {isCurrentVideo ? (
                  <>
                    <Video className="w-3.5 h-3.5 text-purple-400" />
                    <span>Video Clip</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>HD Screenshot</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Interactive Filmstrip Thumbnails */}
          {allMedia.length > 1 && (
            <div className="px-5 py-3 bg-[#070b18] border-y border-white/10 flex items-center gap-3 overflow-x-auto scrollbar-thin">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
                <Film className="w-3 h-3 text-cyan-400" />
                <span>Gallery:</span>
              </span>

              {allMedia.map((url, idx) => {
                const isVid = isVideoMedia(url);
                const isActive = idx === activeIndex;

                return (
                  <button
                    key={`${url}-${idx}`}
                    onClick={() => {
                      triggerGlitch();
                      setActiveIndex(idx);
                    }}
                    className={`relative flex-shrink-0 w-20 sm:w-24 aspect-video rounded-xl overflow-hidden border transition-all cursor-pointer ${
                      isActive
                        ? 'border-cyan-400 ring-2 ring-cyan-500/40 scale-105 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'border-white/10 hover:border-white/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {isVid ? (
                      <video
                        src={url}
                        muted
                        className="w-full h-full object-cover pointer-events-none"
                      />
                    ) : (
                      <img
                        src={url}
                        alt={`Thumb ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=150&q=80';
                        }}
                      />
                    )}

                    {isVid && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                      </div>
                    )}

                    <span className="absolute bottom-1 right-1 px-1 rounded text-[8px] font-mono bg-black/80 text-slate-300">
                      #{idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Project Details Footer & Telemetry */}
          <div className="p-5 sm:p-7 bg-[#050814] flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-white/5">
            <div className="space-y-2 max-w-2xl">
              {project.tagline && (
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>{project.tagline}</span>
                </div>
              )}
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                {project.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                {project.description}
              </p>

              {/* Tech Stack Pills */}
              {project.techStack && project.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-mono text-slate-300 bg-white/5 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 self-start md:self-center flex-shrink-0">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-neon-primary px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white inline-flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Launch Live Project</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 inline-flex items-center gap-2 transition-colors cursor-pointer"
                  title="Inspect Source Code"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>Source Code</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
