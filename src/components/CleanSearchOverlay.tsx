import React, { useState, useMemo } from 'react';
import { Search, X, ArrowLeft, Star, ShieldCheck, Plus, Check, Zap, Tv, Laptop, Sun, Droplet, Paintbrush, Sparkles, Trees, Grid } from 'lucide-react';
import { ServiceItem, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { getLocalizedServiceName, getLocalizedServiceDescription } from '../data/serviceTranslations';

interface CleanSearchOverlayProps {
  services: ServiceItem[];
  language: Language;
  selectedLocation: string;
  onClose: () => void;
  onSelectService: (service: ServiceItem) => void;
  onBookService: (service: ServiceItem) => void;
}

export function CleanSearchOverlay({
  services,
  language,
  selectedLocation,
  onClose,
  onSelectService,
  onBookService
}: CleanSearchOverlayProps) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [query, setQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: t.allServices, icon: Grid },
    { id: 'electrical', label: t.electrical, icon: Zap },
    { id: 'appliances', label: t.appliances, icon: Tv },
    { id: 'electronics_it', label: t.electronics, icon: Laptop },
    { id: 'solar', label: t.solar, icon: Sun },
    { id: 'plumbing', label: t.plumbing, icon: Droplet },
    { id: 'painting', label: t.improvement, icon: Paintbrush },
    { id: 'cleaning', label: t.cleaning, icon: Sparkles },
    { id: 'outdoor', label: t.outdoor, icon: Trees }
  ];

  const getLocalizedName = (s: ServiceItem) => {
    return getLocalizedServiceName(s, language);
  };

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((srv) => {
      const matchCat = activeCategory === 'all' || srv.category === activeCategory;
      if (!matchCat) return false;
      if (!q) return true;

      const locName = getLocalizedServiceName(srv, language).toLowerCase();
      const engName = srv.name.toLowerCase();
      const locDesc = getLocalizedServiceDescription(srv, language).toLowerCase();
      const engDesc = (srv.description || '').toLowerCase();
      const cat = srv.category.toLowerCase();

      return locName.includes(q) || engName.includes(q) || locDesc.includes(q) || engDesc.includes(q) || cat.includes(q);
    });
  }, [services, query, activeCategory, language]);

  return (
    <div className="absolute inset-0 z-50 bg-[#F8FAFC] dark:bg-[#070B14] flex flex-col animate-fade-in">
      {/* Top Search App Bar */}
      <div className="px-3 pt-3 pb-2.5 bg-white dark:bg-[#0A1224] border-b border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-[#0E172B] border border-slate-200/90 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap flex items-center gap-1.5 transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header Info */}
      <div className="px-3.5 py-2 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <span>
          {filteredServices.length} {filteredServices.length === 1 ? 'service found' : 'services found'} in {selectedLocation}
        </span>
        {query && (
          <button onClick={() => setQuery('')} className="text-blue-600 dark:text-blue-400 hover:underline">
            Clear search
          </button>
        )}
      </div>

      {/* Services List */}
      <div className="flex-1 overflow-y-auto px-3.5 pb-6 space-y-2.5">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => {
            const locName = getLocalizedName(service);
            return (
              <div
                key={service.id}
                onClick={() => onSelectService(service)}
                className="p-2.5 bg-white dark:bg-[#0A1224] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-all flex items-center gap-3 cursor-pointer group"
              >
                {/* Thumbnail Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-110"
                  />
                  <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-xs px-1 py-0.2 rounded text-[8px] font-bold text-amber-300 flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                    <span>{service.rating}</span>
                  </div>
                </div>

                {/* Service Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                      {locName}
                    </h4>
                  </div>
                  {locName !== service.name && (
                    <p className="text-[10px] text-slate-400 truncate">{service.name}</p>
                  )}
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {getLocalizedServiceDescription(service, language)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-black text-xs font-mono text-[#1E3A8A] dark:text-[#60A5FA] flex items-baseline gap-0.5">
                      <span className="text-[9px] font-normal text-slate-500 lowercase">{t.priceFrom}</span>
                      <span>{service.price} {t.etb}</span>
                    </span>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      30d Warranty
                    </span>
                  </div>
                </div>

                {/* Action Book Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookService(service);
                  }}
                  className="px-2.5 py-2 bg-[#1E3A8A] hover:bg-[#2563EB] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 flex-shrink-0 active:scale-95 transition-transform"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.bookNow}</span>
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white dark:bg-[#0A1224] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">No services match "{query}"</h4>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              Try searching for Electrical, Plumbing, TV repair, Solar, Painting, or Appliances.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setActiveCategory('all');
              }}
              className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
