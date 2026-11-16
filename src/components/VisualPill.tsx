import React from 'react';

interface VisualPillProps {
  color?: string;
  shape?: 'round' | 'capsule' | 'oval' | 'square';
  form?: 'tablet' | 'capsule' | 'liquid' | 'inhaler' | 'injection' | 'drops';
  imprint?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const VisualPill: React.FC<VisualPillProps> = ({
  color = '#e2e8f0',
  shape = 'oval',
  form = 'tablet',
  imprint = '',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-13 h-13',
    lg: 'w-18 h-18',
    xl: 'w-24 h-24',
  };

  // Inhaler render
  if (form === 'inhaler') {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl bg-stone-100 border border-stone-200/90 p-2 shadow-2xs ${sizeMap[size]} ${className}`}
        title="Inhaler Device"
        aria-label="Inhaler device"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
          <rect x="35" y="10" width="30" height="50" rx="8" fill="#15803d" />
          <rect x="25" y="55" width="50" height="35" rx="6" fill="#166534" />
          <path d="M 25 70 L 10 75 L 10 85 L 25 85 Z" fill="#15803d" />
          <circle cx="50" cy="30" r="4" fill="#ffffff" opacity="0.8" />
        </svg>
      </div>
    );
  }

  // Liquid render
  if (form === 'liquid' || form === 'drops') {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl bg-stone-100 border border-stone-200/90 p-2 shadow-2xs ${sizeMap[size]} ${className}`}
        title="Liquid Medication"
        aria-label="Liquid bottle"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
          <rect x="40" y="15" width="20" height="15" rx="3" fill="#cbd5e1" />
          <rect x="30" y="30" width="40" height="60" rx="10" fill="#0284c7" />
          <rect x="34" y="50" width="32" height="25" rx="4" fill="#ffffff" opacity="0.9" />
          <line x1="38" y1="58" x2="62" y2="58" stroke="#0369a1" strokeWidth="2" />
          <line x1="38" y1="65" x2="56" y2="65" stroke="#0369a1" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  // Capsule render
  if (shape === 'capsule' || form === 'capsule') {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl bg-stone-100 border border-stone-200/90 p-1.5 shadow-2xs ${sizeMap[size]} ${className}`}
        title={`Capsule, color: ${color}`}
        aria-label={`Capsule with color ${color}`}
      >
        <div
          className="relative w-11/12 h-6/12 rounded-full overflow-hidden shadow-xs border border-stone-300/60 transform rotate-[-30deg] flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          {/* Two-tone cap */}
          <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-black/15 border-r border-white/40" />
          {imprint && (
            <span className="relative z-10 text-[9px] font-bold text-stone-800 bg-white/80 px-1 rounded shadow-2xs uppercase">
              {imprint}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Round tablet
  if (shape === 'round') {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl bg-stone-100 border border-stone-200/90 p-1.5 shadow-2xs ${sizeMap[size]} ${className}`}
        title={`Round tablet, color: ${color}`}
        aria-label={`Round tablet with color ${color}`}
      >
        <div
          className="relative w-10/12 h-10/12 rounded-full border border-stone-300/80 shadow-xs flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          {/* Score line */}
          <div className="absolute inset-y-1.5 w-[1.5px] bg-stone-900/15" />
          {imprint && (
            <span className="relative z-10 text-[10px] font-bold text-stone-800 bg-white/85 px-1 py-0.5 rounded shadow-2xs uppercase">
              {imprint}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Oval tablet (default)
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-stone-100 border border-stone-200/90 p-1.5 shadow-2xs ${sizeMap[size]} ${className}`}
      title={`Oval tablet, color: ${color}`}
      aria-label={`Oval tablet with color ${color}`}
    >
      <div
        className="relative w-11/12 h-7/12 rounded-full border border-stone-300/80 shadow-xs flex items-center justify-center transform rotate-[-20deg]"
        style={{ backgroundColor: color }}
      >
        {/* Score line */}
        <div className="absolute inset-y-1 w-[1.5px] bg-stone-900/15" />
        {imprint && (
          <span className="relative z-10 text-[10px] font-bold text-stone-800 bg-white/85 px-1.5 py-0.5 rounded shadow-2xs uppercase">
            {imprint}
          </span>
        )}
      </div>
    </div>
  );
};
