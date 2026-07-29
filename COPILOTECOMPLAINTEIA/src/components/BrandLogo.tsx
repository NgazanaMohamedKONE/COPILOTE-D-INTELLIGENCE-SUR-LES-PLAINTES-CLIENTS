import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  lightText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  lightText = false,
}) => {
  // Sizing definitions
  const iconSizes = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  // Scope Radar Emblem SVG matching the user's exact uploaded logo
  const RadarEmblem = (
    <svg
      viewBox="0 0 100 100"
      className={`${iconSizes[size]} shrink-0 select-none overflow-visible`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Scope Reticle / Target Grid */}
      <circle cx="50" cy="50" r="46" stroke="#0020A6" strokeWidth="4.5" fill="none" />
      <circle cx="50" cy="50" r="36" stroke="#0020A6" strokeWidth="2.5" fill="none" />
      <circle cx="50" cy="50" r="26" stroke="#0020A6" strokeWidth="1.8" fill="none" />
      <circle cx="50" cy="50" r="16" stroke="#0020A6" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />

      {/* Scope Crosshair Axis */}
      <line x1="50" y1="4" x2="50" y2="96" stroke="#0020A6" strokeWidth="3" strokeLinecap="round" />
      <line x1="4" y1="50" x2="96" y2="50" stroke="#0020A6" strokeWidth="3" strokeLinecap="round" />
      <line x1="18" y1="18" x2="82" y2="82" stroke="#0020A6" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="82" y1="18" x2="18" y2="82" stroke="#0020A6" strokeWidth="1" strokeDasharray="2 2" />

      {/* Orange Radar Data Points / Anomalies on right side */}
      <line x1="68" y1="28" x2="78" y2="36" stroke="#FF5500" strokeWidth="1.5" />
      <line x1="78" y1="36" x2="84" y2="52" stroke="#FF5500" strokeWidth="1.5" />
      <circle cx="68" cy="28" r="3.5" fill="#FF5500" />
      <circle cx="78" cy="36" r="4" fill="#FF5500" />
      <circle cx="84" cy="52" r="3" fill="#FF5500" />
      <circle cx="74" cy="68" r="3.5" fill="#FF5500" />

      {/* Center Speech Bubble with Exclamation Mark */}
      <g filter="drop-shadow(0px 2px 4px rgba(0,32,166,0.15))">
        {/* Speech Bubble path */}
        <path
          d="M 28 26 H 72 C 77 26, 81 30, 81 35 V 57 C 81 62, 77 66, 72 66 H 42 L 28 78 V 66 C 24 66, 20 62, 20 57 V 35 C 20 30, 24 26, 28 26 Z"
          fill="#FFFFFF"
          stroke="#0020A6"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {/* Exclamation Mark - Bar */}
        <path
          d="M 50 34 V 50"
          stroke="#FF5500"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Exclamation Mark - Dot */}
        <circle cx="50" cy="58" r="3.2" fill="#FF5500" />
      </g>
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{RadarEmblem}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {RadarEmblem}

      {variant === 'full' && (
        <div className="flex items-baseline tracking-tight font-sans">
          <span
            className={`font-extrabold ${textSizes[size]} ${
              lightText ? 'text-white' : 'text-[#0020A6] dark:text-blue-400'
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Complaintscope
          </span>
          <span
            className={`font-black ${textSizes[size]} text-[#FF5500] ml-1`}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );
};
