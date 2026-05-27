import React from 'react';

interface RtbLogoProps {
  className?: string;
  layout?: 'vertical' | 'horizontal' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function RtbLogo({ className = '', layout = 'vertical', size = 'md' }: RtbLogoProps) {
  // Size variables
  const sizeClasses = {
    sm: 'w-16 h-12',
    md: 'w-32 h-24',
    lg: 'w-48 h-36',
    xl: 'w-64 h-48',
  };

  // SVG representation of the brand icon
  const brandIcon = (
    <svg
      viewBox="0 0 200 150"
      className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,56,130,0.15)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Sky blue to deep vibrant teal gradient for right page */}
        <linearGradient id="rtbRightPageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ccd6" />
          <stop offset="100%" stopColor="#00739c" />
        </linearGradient>
        {/* Soft gray shadow gradient */}
        <linearGradient id="rtbCoverRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00a0b5" />
          <stop offset="100%" stopColor="#005d7a" />
        </linearGradient>
      </defs>

      {/* Outer book cover / outline depth */}
      {/* Left side cover - dark blue */}
      <path
        d="M 25 45 C 25 45, 25 118, 25 118 C 25 119, 26 120, 27 120 L 33 122 L 33 50 Z"
        fill="#002d6a"
      />
      {/* Right side cover - vibrant dark teal */}
      <path
        d="M 175 45 C 175 45, 175 118, 175 118 C 175 119, 174 120, 173 120 L 167 122 L 167 50 Z"
        fill="url(#rtbCoverRightGrad)"
      />

      {/* Pages layers depth effect - subtle extra white page swoops beneath */}
      <path
        d="M 33 124 C 54 114, 84 114, 100 130 C 85 119, 55 119, 34 127 Z"
        fill="#e2e8f0"
      />
      <path
        d="M 167 124 C 146 114, 116 114, 100 130 C 115 119, 145 119, 166 127 Z"
        fill="#cbd5e1"
      />

      {/* Left Main Page: Royal Dark Blue */}
      <path
        d="M 100 122 C 85 106, 52 106, 31 115 C 31 115, 30 115, 30 114 L 30 46 C 52 35, 84 35, 100 46 Z"
        fill="#003882"
      />

      {/* Right Main Page: Turquoise Gradient */}
      <path
        d="M 100 122 C 115 106, 148 106, 169 115 C 169 115, 170 115, 170 114 L 170 46 C 148 35, 116 35, 100 46 Z"
        fill="url(#rtbRightPageGrad)"
      />

      {/* Connection Links (Technology Nodes) */}
      {/* Anchor line rising from surface */}
      <path
        d="M 122 96 L 122 76"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      {/* Primary connector line */}
      <path
        d="M 122 76 L 144 54"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      {/* Secondary connector line */}
      <path
        d="M 144 54 L 144 26"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />

      {/* Technology Node Squares */}
      {/* Square 1: White accent (bottom left) */}
      <rect
        x="116.5"
        y="70.5"
        width="11"
        height="11"
        rx="2"
        fill="#ffffff"
        stroke="#00739c"
        strokeWidth="1.5"
      />
      {/* Square 2: Blue accent (middle) */}
      <rect
        x="138.5"
        y="48.5"
        width="11"
        height="11"
        rx="2"
        fill="#003882"
        stroke="#ffffff"
        strokeWidth="1.5"
      />
      {/* Square 3: Cyan/White border accent (top) */}
      <rect
        x="138.5"
        y="20.5"
        width="11"
        height="11"
        rx="2"
        fill="#00ccd6"
        stroke="#ffffff"
        strokeWidth="1.5"
      />
    </svg>
  );

  if (layout === 'icon') {
    return (
      <div className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}>
        {brandIcon}
      </div>
    );
  }

  if (layout === 'horizontal') {
    return (
      <div className={`flex items-center gap-4 text-left ${className}`}>
        {/* Left Hand: Gorgeous Brand Icon */}
        <div className="w-16 h-12 md:w-20 md:h-16 flex-shrink-0">
          {brandIcon}
        </div>
        
        {/* Right Hand: Text Blocks */}
        <div>
          <h4 className="text-2xl md:text-3xl font-black text-[#003882] tracking-tighter leading-none m-0">
            RTB
          </h4>
          <p className="text-slate-600 font-bold text-xs uppercase tracking-wider leading-tight">
            Recursos Digitales
          </p>
          <div className="h-[2px] w-12 bg-gradient-to-r from-[#003882] to-[#00ccd6] mt-1" />
          <p className="text-[#00a896] italic text-[8.5px] font-bold tracking-tight mt-0.5">
            Recursos para aprender, crear y resolver.
          </p>
        </div>
      </div>
    );
  }

  // DEFAULT layouts: vertical (clean stacked representation matching physical business logo)
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {/* The physical icon */}
      <div className="w-32 h-24 md:w-40 md:h-30 lg:w-48 lg:h-36 mb-1">
        {brandIcon}
      </div>

      {/* Brand primary text typography */}
      <h3 className="text-4xl md:text-5xl font-black text-[#003882] tracking-tight m-0 leading-none">
        RTB
      </h3>

      {/* Brand secondary text */}
      <p className="text-slate-600 font-extrabold text-sm md:text-base uppercase tracking-widest mt-1 mb-2">
        Recursos Digitales
      </p>

      {/* Decorative gradient horizontal bar divider */}
      <div className="w-48 md:w-60 h-[2px] bg-gradient-to-r from-transparent via-[#003882] to-transparent my-1 md:my-2" />

      {/* Slogan */}
      <p className="text-[#00a29a] italic text-xs md:text-sm font-semibold tracking-wide">
        Recursos para aprender, crear y resolver.
      </p>
    </div>
  );
}
