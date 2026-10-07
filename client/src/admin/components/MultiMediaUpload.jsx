import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Video,
  Image as ImageIcon,
  Film,
  Play,
  Trash2,
  CheckCircle2,
  Star,
  Plus,
  Loader2,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import api from '../../services/api.js';

export const isVideoMedia = (url) => {
  if (!url || typeof url !== 'string') return false;
  return (
    /\.(mp4|webm|mov|ogg|mkv|m4v)(\?.*)?$/i.test(url) ||
    url.includes('/video/') ||
    url.includes('youtube.com') ||
    url.includes('youtu.be') ||
    url.includes('vimeo.com')
  );
};

export default function MultiMediaUpload({
  media = [],
  imageUrl = '',
  videoUrl = '',
  onMediaChange,
  onImageChange,
  onVideoChange,
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  const handleMultipleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const res = await api.uploadMultipleFiles(formData);
      if (res.files && res.files.length > 0) {
        const newUrls = res.files.map((f) => f.url);
        const updatedMedia = [...media, ...newUrls];
        onMediaChange(updatedMedia);

        // Auto-assign primary cover image if missing
        if (!imageUrl) {
          const firstImg = res.files.find((f) => !f.isVideo);
          if (firstImg) onImageChange(firstImg.url);
          else onImageChange(res.files[0].url);
        }

        // Auto-assign video preview if missing and video exists
        if (!videoUrl) {
          const firstVid = res.files.find((f) => f.isVideo);
          if (firstVid) onVideoChange(firstVid.url);
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Media upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    const trimmed = urlInput.trim();
    if (media.includes(trimmed)) {
      setError('This media URL is already added.');
      return;
    }

    const updated = [...media, trimmed];
    onMediaChange(updated);

    if (!imageUrl && !isVideoMedia(trimmed)) {
      onImageChange(trimmed);
    }
    if (!videoUrl && isVideoMedia(trimmed)) {
      onVideoChange(trimmed);
    }

    setUrlInput('');
    setError('');
  };

  const handleRemoveItem = (index) => {
    const itemToRemove = media[index];
    const updated = media.filter((_, idx) => idx !== index);
    onMediaChange(updated);

    // If removing current cover image
    if (imageUrl === itemToRemove) {
      const nextImg = updated.find((url) => !isVideoMedia(url)) || updated[0] || '';
      onImageChange(nextImg);
    }
    // If removing current video
    if (videoUrl === itemToRemove) {
      const nextVid = updated.find((url) => isVideoMedia(url)) || '';
      onVideoChange(nextVid);
    }
  };

  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= media.length) return;
    const newMedia = [...media];
    const temp = newMedia[index];
    newMedia[index] = newMedia[targetIdx];
    newMedia[targetIdx] = temp;
    onMediaChange(newMedia);
  };

  const setAsCover = (url) => {
    onImageChange(url);
  };

  const setAsVideo = (url) => {
    if (videoUrl === url) {
      onVideoChange(''); // Toggle off
    } else {
      onVideoChange(url);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl bg-white/[0.02] border border-white/10 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
            <Film className="w-4 h-4 text-cyan-400" />
            <span>Project Screenshots & Video Clips (Multiple)</span>
          </label>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Upload multiple screenshots and video previews. On the site, hover will play the video/cycle screenshots, and visitors can click for a full-screen 4D holographic preview.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-neon-primary px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 flex-shrink-0"
        >
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Uploading Media...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Images / Videos</span>
            </>
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleMultipleFiles}
          accept="image/*,video/*"
          multiple
          className="hidden"
        />
      </div>

      {/* Manual URL Adder */}
      <div className="flex gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Paste Image or MP4/WebM Video URL (/uploads/... or https://...)"
          className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs font-mono"
        />
        <button
          type="button"
          onClick={handleAddUrl}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-xs font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add URL</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/30">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Media Thumbnails Grid */}
      {media.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Media Library ({media.length} items)</span>
            <span className="text-cyan-400">★ Star = Main Cover | ▶ Play = Preview Video</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
            {media.map((url, idx) => {
              const isVid = isVideoMedia(url);
              const isMainCover = imageUrl === url;
              const isMainVideo = videoUrl === url;

              return (
                <div
                  key={`${url}-${idx}`}
                  className={`group relative rounded-xl overflow-hidden border bg-black/60 transition-all ${
                    isMainCover
                      ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : isMainVideo
                      ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="aspect-video relative overflow-hidden bg-slate-950 flex items-center justify-center">
                    {isVid ? (
                      <video
                        src={url}
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                        onMouseEnter={(e) => e.target.play().catch(() => {})}
                        onMouseLeave={(e) => {
                          e.target.pause();
                          e.target.currentTime = 0;
                        }}
                      />
                    ) : (
                      <img
                        src={url}
                        alt={`Media ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                    )}

                    {/* Media Type Badge */}
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-black/80 text-white border border-white/20 flex items-center gap-1 backdrop-blur-sm">
                      {isVid ? (
                        <>
                          <Video className="w-2.5 h-2.5 text-purple-400" />
                          <span>VIDEO</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-2.5 h-2.5 text-cyan-400" />
                          <span>IMAGE</span>
                        </>
                      )}
                    </span>

                    {/* Active indicators */}
                    <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 items-end">
                      {isMainCover && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-cyan-500/90 text-black font-bold flex items-center gap-0.5 shadow-sm">
                          <Star className="w-2.5 h-2.5 fill-black" />
                          <span>Cover</span>
                        </span>
                      )}
                      {isMainVideo && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-purple-500/90 text-white font-bold flex items-center gap-0.5 shadow-sm">
                          <Play className="w-2.5 h-2.5 fill-white" />
                          <span>Preview Vid</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Item Toolbar */}
                  <div className="p-2 bg-[#090d20] flex items-center justify-between gap-1 text-[10px] font-mono">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, -1)}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move left"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 1)}
                        disabled={idx === media.length - 1}
                        className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move right"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setAsCover(url)}
                        className={`p-1 rounded cursor-pointer transition-colors ${
                          isMainCover
                            ? 'text-cyan-400 bg-cyan-500/20'
                            : 'text-slate-400 hover:text-cyan-400 hover:bg-white/10'
                        }`}
                        title="Set as Main Cover Image"
                      >
                        <Star className={`w-3.5 h-3.5 ${isMainCover ? 'fill-cyan-400' : ''}`} />
                      </button>

                      {isVid && (
                        <button
                          type="button"
                          onClick={() => setAsVideo(url)}
                          className={`p-1 rounded cursor-pointer transition-colors ${
                            isMainVideo
                              ? 'text-purple-400 bg-purple-500/20'
                              : 'text-slate-400 hover:text-purple-400 hover:bg-white/10'
                          }`}
                          title={isMainVideo ? 'Remove as Preview Video' : 'Set as Preview Video'}
                        >
                          <Play className={`w-3.5 h-3.5 ${isMainVideo ? 'fill-purple-400' : ''}`} />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 cursor-pointer transition-colors"
                        title="Delete media"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="py-6 border border-dashed border-white/10 rounded-xl text-center space-y-2">
          <Film className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 font-mono">
            No screenshots or video clips uploaded yet. Click above to upload multiple files or paste URLs.
          </p>
        </div>
      )}

      {/* Main Cover & Video Controls Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-slate-400 text-[11px] uppercase block">Primary Cover Image</span>
          <p className="text-white truncate font-mono text-[11px]">
            {imageUrl || <span className="text-slate-500">None selected</span>}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-slate-400 text-[11px] uppercase block">Preview Hover Video (Optional)</span>
          <p className="text-purple-300 truncate font-mono text-[11px]">
            {videoUrl || <span className="text-slate-500">No hover video set</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
