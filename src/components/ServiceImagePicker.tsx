import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Link, Check, Sparkles, RefreshCw } from 'lucide-react';
import { PRESET_SERVICE_IMAGES } from '../data/servicesData';

interface ServiceImagePickerProps {
  currentImage: string;
  onSelectImage: (imageUrl: string) => void;
  serviceCategory?: string;
}

export function ServiceImagePicker({
  currentImage,
  onSelectImage,
  serviceCategory
}: ServiceImagePickerProps) {
  const [tab, setTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [urlInput, setUrlInput] = useState<string>(currentImage || '');
  const [selectedPresetCategory, setSelectedPresetCategory] = useState<string>('all');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Group preset images by category
  const categories = Array.from(new Set(PRESET_SERVICE_IMAGES.map(img => img.category)));

  const filteredPresets = PRESET_SERVICE_IMAGES.filter(img =>
    selectedPresetCategory === 'all' ? true : img.category === selectedPresetCategory
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be under 5MB.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onSelectImage(result);
        setUrlInput(result);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read file.');
    };
    reader.readAsDataURL(file);
  };

  const handleUrlApply = () => {
    if (urlInput.trim()) {
      onSelectImage(urlInput.trim());
    }
  };

  return (
    <div className="space-y-3 p-3.5 bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
          <span>Service Cover Artwork</span>
        </label>
        
        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-0.5 rounded-xl text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setTab('presets')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
              tab === 'presets'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Preset Gallery</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
              tab === 'upload'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Device Upload</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
              tab === 'url'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Link className="w-3 h-3" />
            <span>Direct URL</span>
          </button>
        </div>
      </div>

      {/* ACTIVE PREVIEW THUMBNAIL */}
      <div className="flex items-center gap-3 p-2 bg-white dark:bg-[#070D1B] rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-16 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
          <img
            src={currentImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
            alt="Current Service"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Active Cover</span>
          <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
            {currentImage?.startsWith('data:') ? 'Custom Uploaded Image (Stored)' : currentImage}
          </p>
        </div>
      </div>

      {/* TAB 1: PRESET GALLERY */}
      {tab === 'presets' && (
        <div className="space-y-2">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-bold scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedPresetCategory('all')}
              className={`px-2 py-0.5 rounded-full shrink-0 transition-colors ${
                selectedPresetCategory === 'all'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              All ({PRESET_SERVICE_IMAGES.length})
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedPresetCategory(c)}
                className={`px-2 py-0.5 rounded-full shrink-0 transition-colors ${
                  selectedPresetCategory === c
                    ? 'bg-[#1E3A8A] text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Preset Images Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 bg-white dark:bg-[#070D1B] rounded-xl border border-slate-200 dark:border-slate-800">
            {filteredPresets.map((img, idx) => {
              const isSelected = currentImage === img.url;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onSelectImage(img.url);
                    setUrlInput(img.url);
                  }}
                  className={`group relative rounded-lg overflow-hidden border-2 transition-all aspect-video flex flex-col justify-end text-left cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-500/40'
                      : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}

                  <span className="relative z-10 text-[9px] font-bold text-white px-1.5 py-0.5 truncate drop-shadow-md">
                    {img.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: DEVICE FILE UPLOAD */}
      {tab === 'upload' && (
        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-white dark:bg-[#070D1B] transition-colors text-center"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Click to browse or drop an image here
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                PNG, JPG, WEBP up to 5MB (Saved immediately to your catalog)
              </p>
            </div>
          </div>

          {uploadError && (
            <p className="text-[11px] text-rose-500 font-bold">{uploadError}</p>
          )}
        </div>
      )}

      {/* TAB 3: DIRECT IMAGE URL */}
      {tab === 'url' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 p-2 bg-white dark:bg-[#070D1B] border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
            />
            <button
              type="button"
              onClick={handleUrlApply}
              className="px-3 py-2 bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold rounded-xl shrink-0"
            >
              Apply
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Paste any direct HTTPS image link (Unsplash, Pexels, Cloudinary, etc.)
          </p>
        </div>
      )}
    </div>
  );
}
