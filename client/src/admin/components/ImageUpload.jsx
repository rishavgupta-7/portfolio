import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../../services/api.js';

export default function ImageUpload({
  label = 'Upload Image',
  value = '',
  onChange,
  aspectRatio = 'square',
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.uploadImage(formData);
      if (res.url) {
        onChange(res.url);
      }
    } catch (err) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Preview Box */}
        <div className="relative w-24 h-24 rounded-2xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
          {value ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-slate-600" />
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Input & Upload Button */}
        <div className="flex-1 space-y-2 w-full">
          <div className="flex gap-2">
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Or enter image URL (/uploads/... or https://...)"
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs font-mono"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {error && <p className="text-xs text-rose-400">{error}</p>}
          <p className="text-[11px] text-slate-500 font-mono">
            Supported formats: PNG, JPG, WEBP, SVG (Max 10MB). Automatically stored in server uploads.
          </p>
        </div>
      </div>
    </div>
  );
}
