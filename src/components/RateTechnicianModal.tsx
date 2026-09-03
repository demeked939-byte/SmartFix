import React, { useState } from 'react';
import { Star, X, Check, Award, ThumbsUp, Heart, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { Booking, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface RateTechnicianModalProps {
  booking: Booking;
  language: Language;
  onClose: () => void;
  onSubmitRating: (bookingId: string, rating: number, comment?: string, tags?: string[], tip?: number) => void;
}

const PRAISE_TAGS: Record<Language, string[]> = {
  en: [
    '⚡ Rapid Arrival (<15m)',
    '🔧 Master Craftsmanship',
    '🧹 Clean Worksite',
    '💳 Transparent Pricing',
    '🗣️ Polite & Professional',
    '🔒 30-Day Guarantee Verified'
  ],
  am: [
    '⚡ ፈጣን መድረስ (<15 ደቂቃ)',
    '🔧 ጥራት ያለው ሙያ',
    '🧹 ንጹህ የስራ ቦታ',
    '💳 ግልጽ እና ትክክለኛ ዋጋ',
    '🗣️ ጨዋ እና አክባሪ',
    '🔒 የ30 ቀን ዋስትና'
  ],
  om: [
    '⚡ Dafee Ga’uu (<15m)',
    '🔧 Ogummaa Olaanaa',
    '🧹 Bakka Hojii Qulqulluu',
    '💳 Gatii Qulqullina Qabu',
    '🗣️ Kabajaa fi Naamusa',
    '🔒 Wabii Guyyaa 30'
  ],
  ti: [
    '⚡ ቅልጡፍ ምብጻሕ (<15 ደቒቕ)',
    '🔧 ብሉጽ ሞያ',
    '🧹 ጽሩይ ናይ ስራሕ ቦታ',
    '💳 ግሉጽን ትክክለኛን ዋጋ',
    '🗣️ ትሑትን ኣኽባርን',
    '🔒 ናይ 30 መዓልቲ ውሕስነት'
  ],
  so: [
    '⚡ Imaansho Degdeg ah (<15m)',
    '🔧 Xirfad Heer Sare ah',
    '🧹 Goob Shaqo oo Nadiif ah',
    '💳 Qiimo Caddaan ah',
    '🗣️ Asluub & Xushmad',
    '🔒 Dammaanad 30 Maalmood'
  ]
};

const RATING_LABELS: Record<Language, Record<number, string>> = {
  en: {
    1: 'Needs Improvement',
    2: 'Fair Service',
    3: 'Good Quality',
    4: 'Very Good & Prompt',
    5: 'Exceptional Master Craftsmanship'
  },
  am: {
    1: 'መሻሻል የሚፈልግ',
    2: 'መካከለኛ',
    3: 'ጥሩ አገልግሎት',
    4: 'በጣም ጥሩ እና ፈጣን',
    5: 'እጅግ የላቀ ባለሙያዊ ጥገና'
  },
  om: {
    1: 'Fooyya’uu Qaba',
    2: 'Giddu-galeessa',
    3: 'Gaarii',
    4: 'Baay’ee Gaarii',
    5: 'Ogummaa Addaa fi Qulqullina'
  },
  ti: {
    1: 'ምምሕያሽ ዘድልዮ',
    2: 'ማእከላይ',
    3: 'ጽቡቕ',
    4: 'ብጣዕሚ ጽቡቕን ቅልጡፍን',
    5: 'ዝለዓለ ደረጃ ዘለዎ ብሉጽ ጽገና'
  },
  so: {
    1: 'Wuxuu u Baahan Yahay Horumarin',
    2: 'Dhexdhexaad',
    3: 'Wanaagsan',
    4: 'Aad u Wanaagsan',
    5: 'Heer Sare iyo Tayo Buuxda'
  }
};

export function RateTechnicianModal({
  booking,
  language,
  onClose,
  onSubmitRating
}: RateTechnicianModalProps) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    PRAISE_TAGS[language]?.[0] || PRAISE_TAGS.en[0],
    PRAISE_TAGS[language]?.[1] || PRAISE_TAGS.en[1]
  ]);
  const [comment, setComment] = useState<string>('');
  const [tipAmount, setTipAmount] = useState<number>(50);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const activeRating = hoverRating !== null ? hoverRating : selectedRating;
  const ratingText = RATING_LABELS[language]?.[activeRating] || RATING_LABELS.en[activeRating];
  const tagsList = PRAISE_TAGS[language] || PRAISE_TAGS.en;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitRating(booking.id, selectedRating, comment, selectedTags, tipAmount);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-[#0B1326] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-500 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {t.rateTechnician}
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">Order #{booking.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Technician Profile Snapshot */}
        <div className="p-3 bg-gradient-to-r from-blue-50/80 to-slate-50 dark:from-blue-950/40 dark:to-slate-900/40 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-amber-400/50 shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
              alt={booking.technicianName || 'Technician'}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                {booking.technicianName || 'Master Tech Dawit Abebe'}
              </h4>
              <span className="text-[9px] font-bold bg-amber-400/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.2 rounded flex-shrink-0">
                Verified
              </span>
            </div>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mt-0.5">
              {booking.serviceName || 'Appliance & Electrical Repair'}
            </p>
            <p className="text-[10px] text-slate-500 font-mono">Completed in {booking.zone || 'Addis Ababa'}</p>
          </div>
        </div>

        {/* Star Rating Bar */}
        <div className="text-center space-y-2 py-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            {t.rateTechTitle}
          </label>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                onClick={() => setSelectedRating(star)}
                className="p-1 transition-transform hover:scale-125 active:scale-95 focus:outline-hidden"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= activeRating
                      ? 'fill-amber-400 text-amber-400 drop-shadow-md'
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono">
            {ratingText} ({selectedRating}.0 / 5.0)
          </div>
        </div>

        {/* Quick Praise Badges */}
        <div className="space-y-1.5 text-xs">
          <label className="font-bold text-slate-700 dark:text-slate-300 block">
            Select Highlights:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {tagsList.map((tag) => {
              const isTagSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                    isTagSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Written Feedback Form */}
        <div className="space-y-1 text-xs">
          <label className="font-bold text-slate-700 dark:text-slate-300 block">
            Customer Comment / Review:
          </label>
          <textarea
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share feedback on technician punctuality, work cleanliness, and pricing..."
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080E1B] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Optional Tip Section (Telebirr / CBE Birr) */}
        <div className="p-3 bg-slate-50 dark:bg-[#091122] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-red-500" />
              <span>Add Tip for Master Tech (Telebirr)</span>
            </span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
              +{tipAmount} {t.etb}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[0, 50, 100, 200].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setTipAmount(amt)}
                className={`py-1.5 rounded-lg font-mono text-xs font-bold border transition-all ${
                  tipAmount === amt
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                }`}
              >
                {amt === 0 ? 'No Tip' : `${amt} ETB`}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#1D4ED8] hover:to-[#3B82F6] text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{isSubmitting ? 'Submitting Review...' : t.rateSubmitBtn}</span>
        </button>
      </div>
    </div>
  );
}
