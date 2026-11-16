import React from 'react';
import {
  FaUtensils,
  FaGlassWater,
  FaSun,
  FaMoon,
  FaBan,
  FaSnowflake,
} from 'react-icons/fa6';
import { MdOutlineFastfood } from 'react-icons/md';

interface PictogramBadgeProps {
  type:
    | 'with_food'
    | 'empty_stomach'
    | 'after_food'
    | 'full_glass'
    | 'morning'
    | 'afternoon'
    | 'evening'
    | 'bedtime'
    | 'no_alcohol'
    | 'keep_cold'
    | 'do_not_crush';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const PictogramBadge: React.FC<PictogramBadgeProps> = ({
  type,
  label,
  size = 'md',
  showLabel = true,
}) => {
  const configs = {
    with_food: {
      icon: <FaUtensils className="text-amber-700" />,
      text: 'Take with food',
      bg: 'bg-amber-50 border-amber-200/80 text-amber-900',
    },
    empty_stomach: {
      icon: <MdOutlineFastfood className="text-rose-700" />,
      text: 'Empty stomach',
      bg: 'bg-rose-50 border-rose-200/80 text-rose-900',
    },
    after_food: {
      icon: <FaUtensils className="text-emerald-700" />,
      text: 'After meals',
      bg: 'bg-emerald-50 border-emerald-200/80 text-emerald-900',
    },
    full_glass: {
      icon: <FaGlassWater className="text-sky-700" />,
      text: 'Full glass of water',
      bg: 'bg-sky-50 border-sky-200/80 text-sky-900',
    },
    morning: {
      icon: <FaSun className="text-amber-600" />,
      text: 'Morning (Breakfast)',
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
    },
    afternoon: {
      icon: <FaSun className="text-orange-600" />,
      text: 'Afternoon (Lunch)',
      bg: 'bg-orange-50 border-orange-200 text-orange-900',
    },
    evening: {
      icon: <FaSun className="text-indigo-600" />,
      text: 'Evening (Dinner)',
      bg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    },
    bedtime: {
      icon: <FaMoon className="text-slate-600" />,
      text: 'Bedtime',
      bg: 'bg-stone-100 border-stone-200 text-stone-800',
    },
    no_alcohol: {
      icon: <FaBan className="text-rose-700" />,
      text: 'Avoid alcohol',
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
    },
    keep_cold: {
      icon: <FaSnowflake className="text-sky-700" />,
      text: 'Refrigerate',
      bg: 'bg-sky-50 border-sky-200 text-sky-900',
    },
    do_not_crush: {
      icon: <FaBan className="text-rose-700" />,
      text: 'Swallow whole',
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
    },
  };

  const item = configs[type] || configs.with_food;
  const displayText = label || item.text;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-lg border shadow-2xs transition-colors ${item.bg} ${sizeClasses[size]}`}
      title={displayText}
    >
      <span className="shrink-0">{item.icon}</span>
      {showLabel && <span className="tracking-tight">{displayText}</span>}
    </span>
  );
};
