import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  inverted?: boolean;
  withTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({
  className = '',
  inverted = false,
  withTagline = true,
  size = 'md',
}: LogoProps) {
  const textColor = inverted ? 'text-white' : 'text-brand-navy';
  const taglineColor = inverted ? 'text-slate-400' : 'text-slate-500';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Bespoke Geometric Mechanical Truck Motif */}
      <div
        className={`${iconSizes[size]} bg-brand-navy flex items-center justify-center rounded-lg shadow-sm border border-slate-700/30 group-hover:bg-brand-navy-light transition-all`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5/6 h-5/6"
        >
          {/* Heavy Commercial Truck Silhouette with Technical Grid */}
          <path
            d="M4 8C4 6.89543 4.89543 6 6 6H19V20H4V8Z"
            fill="#F28C28"
          />
          <path
            d="M19 11H24.5C25.3284 11 26.0827 11.5126 26.3944 12.2856L28 16V20H19V11Z"
            fill="#FFFFFF"
            fillOpacity="0.9"
          />
          <circle cx="8" cy="22" r="3" fill="#F28C28" />
          <circle cx="8" cy="22" r="1.5" fill="#142B46" />
          <circle cx="23" cy="22" r="3" fill="#F28C28" />
          <circle cx="23" cy="22" r="1.5" fill="#142B46" />
          {/* Mechanical Precision Tooth / Caliper Accent */}
          <path
            d="M11 10H16M11 13H16M11 16H16"
            stroke="#142B46"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span
          className={`font-black tracking-tight ${textSizes[size]} ${textColor} flex items-center`}
        >
          TRUCK<span className="text-brand-orange">ORA</span>
        </span>
        {withTagline && (
          <span
            className={`text-[9.5px] uppercase font-bold tracking-wider ${taglineColor} mt-0.5`}
          >
            Truck Parts. Trusted Supply.
          </span>
        )}
      </div>
    </Link>
  );
}
