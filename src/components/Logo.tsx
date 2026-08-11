import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 32, showText = true }) => {
  return (
    <div className={`flex items-center gap-2.5 cursor-pointer ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        {/* Upper-left Plum Purple Arc */}
        <path
          d="M 50 15 A 35 35 0 0 1 85 50 L 72 50 A 22 22 0 0 0 50 28 L 50 15 Z"
          fill="#8E4585"
        />
        <path
          d="M 50 15 A 35 35 0 0 0 15 50 L 28 50 A 22 22 0 0 1 50 28 L 50 15 Z"
          fill="#8E4585"
        />
        {/* Lower-right Dusty Pink Arc */}
        <path
          d="M 50 85 A 35 35 0 0 0 85 50 L 72 50 A 22 22 0 0 1 50 72 L 50 85 Z"
          fill="#DCA1A1"
        />
        <path
          d="M 50 85 A 35 35 0 0 1 15 50 L 28 50 A 22 22 0 0 0 50 72 L 50 85 Z"
          fill="#DCA1A1"
        />
      </svg>
      {showText && (
        <span className="font-sans text-2xl font-bold tracking-tight text-[#722d6c] glow-effect">
          Cycloone
        </span>
      )}
    </div>
  );
};
