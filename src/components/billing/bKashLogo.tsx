import React from 'react';

interface BKashLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const BKashLogo: React.FC<BKashLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`inline-flex items-center gap-2 font-bold select-none ${className}`}>
      {/* bKash Origami Bird Emblem in official #E2136E Pink */}
      <div
        className={`${iconSizes[size]} rounded-lg bg-[#E2136E] flex items-center justify-center text-white shadow-xs shrink-0`}
        style={{ backgroundColor: '#E2136E' }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4/5 h-4/5 transform -rotate-12"
          aria-hidden="true"
        >
          {/* Stylized origami bird path */}
          <path d="M2.5 12.5L9 4.5l4 6.5-6.5 4.5L2.5 12.5zm19-8l-8.5 7.5 4.5 3 6-8.5-2-2zm-7.5 11l-3 4-2-3 5-1zm3.5-2l-3 5.5 6-3.5-3-2z" />
        </svg>
      </div>

      {showText && (
        <span
          className={`font-black tracking-tight text-[#E2136E] ${textSizes[size]}`}
          style={{ color: '#E2136E' }}
        >
          bKash
        </span>
      )}
    </div>
  );
};
