import React from 'react';

interface SmartFixLogoProps {
  variant?: 'full' | 'horizontal' | 'emblem' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
  isDark?: boolean;
}

export function SmartFixLogo({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showTagline = true,
  isDark = false
}: SmartFixLogoProps) {
  // Size mappings
  const emblemSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  const taglineSizes = {
    xs: 'text-[7px]',
    sm: 'text-[8.5px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  // The official vector SVG emblem (House roof + 4 windows + Chimney + Orange Wrench forming letter 'S')
  const EmblemSvg = ({ className: emblemClass = '' }: { className?: string }) => (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${emblemSizes[size]} ${emblemClass} drop-shadow-xs`}
    >
      <defs>
        {/* Blue Gradient for House & Top Curve */}
        <linearGradient id="sfBlueGrad" x1="20" y1="20" x2="180" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="45%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>

        {/* Orange Gradient for Wrench & Bottom Curve */}
        <linearGradient id="sfOrangeGrad" x1="40" y1="110" x2="175" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>

        {/* Subtle drop shadow filter for depth */}
        <filter id="sfGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* TOP 'S' HALF: House Roof, Chimney, 4 Windows, and Ribbon Spine */}
      <g filter="url(#sfGlow)">
        {/* Chimney */}
        <rect x="126" y="32" width="16" height="30" rx="3" fill="#0284C7" />

        {/* House Roof Gable */}
        <path
          d="M102 24 C104 22, 108 22, 110 24 L168 66 C173 70, 172 77, 166 79 L158 81 C154 82, 150 80, 147 77 L106 46 L65 77 C62 80, 58 82, 54 81 L46 79 C40 77, 39 70, 44 66 Z"
          fill="url(#sfBlueGrad)"
        />

        {/* 4 Square Window Panes (2x2 Grid) */}
        <rect x="91" y="52" width="9" height="9" rx="1.5" fill="#0284C7" />
        <rect x="106" y="52" width="9" height="9" rx="1.5" fill="#0284C7" />
        <rect x="91" y="65" width="9" height="9" rx="1.5" fill="#0284C7" />
        <rect x="106" y="65" width="9" height="9" rx="1.5" fill="#0284C7" />

        {/* Sweeping Blue Upper Curve of 'S' that folds down to middle */}
        <path
          d="M48 68 C34 82, 38 106, 60 114 C82 122, 134 116, 154 112 C168 109, 174 97, 168 86 C163 76, 149 75, 138 78 C116 84, 88 88, 72 82 C62 78, 60 70, 68 64 L102 38"
          stroke="url(#sfBlueGrad)"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* BOTTOM 'S' HALF: Dynamic Orange Wrench looping around and inside */}
      <g filter="url(#sfGlow)">
        {/* Curved Wrench Body / Outer lower S loop */}
        <path
          d="M152 108 C168 122, 164 150, 142 166 C120 182, 76 182, 54 162 C38 147, 44 128, 62 128 C80 128, 100 138, 118 132 C128 129, 134 120, 126 112"
          stroke="url(#sfOrangeGrad)"
          strokeWidth="17"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Wrench Head with Open Hexagonal Mouth pointing upwards inside the bowl */}
        <path
          d="M62 136 C66 130, 78 120, 94 110 C104 104, 114 96, 128 88 C132 86, 138 88, 142 92 L148 98 C152 102, 152 108, 148 112 L138 122 C132 128, 124 132, 114 136"
          fill="url(#sfOrangeGrad)"
        />
        {/* Open Jaw cut-out */}
        <path
          d="M128 92 L144 82 L154 94 L142 106 Z"
          fill="#FFFFFF"
          className="dark:fill-[#070C1A]"
        />
      </g>
    </svg>
  );

  if (variant === 'emblem' || variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <EmblemSvg />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Emblem */}
      <EmblemSvg />

      {/* Typography: "SmartFix" and "Better Homes • Happier Lives" */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center">
          <span
            className={`font-black tracking-tight ${textSizes[size]} ${
              isDark ? 'text-white' : 'text-[#0B1B3D] dark:text-white'
            }`}
          >
            Smart
          </span>
          <span
            className={`font-black tracking-tight ${textSizes[size]} text-[#EA580C] dark:text-[#FB923C] flex items-center`}
          >
            F
            {/* The 'i' with mini wrench dot */}
            <span className="inline-flex flex-col items-center justify-end mx-[0.5px]">
              <svg className="w-1.5 h-1.5 text-[#EA580C] dark:text-[#FB923C] mb-[1px]" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 1 L10 1 L9 4 L11 6 L9 8 L7 6 L6 7 L4 5 L6 3 Z" />
              </svg>
              <span className="w-1 h-2.5 bg-[#EA580C] dark:bg-[#FB923C] rounded-xs inline-block" />
            </span>
            x
          </span>
        </div>

        {showTagline && (
          <div
            className={`mt-1 flex items-center gap-1 font-semibold tracking-wide ${taglineSizes[size]} ${
              isDark ? 'text-slate-300' : 'text-[#0B1B3D]/80 dark:text-slate-300'
            }`}
          >
            <span>Better Homes</span>
            <span className="w-1 h-1 rounded-full bg-[#EA580C] inline-block" />
            <span>Happier Lives</span>
          </div>
        )}
      </div>
    </div>
  );
}
