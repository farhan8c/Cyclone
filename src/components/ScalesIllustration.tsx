import React from 'react';

export const ScalesIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[380px] md:min-h-[460px] flex items-center justify-center">
      {/* Soft background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#8E4585]/10 via-[#DCA1A1]/15 to-transparent rounded-2xl blur-xl" />

      {/* Styled 3D scales visualization box matching Image 5 */}
      <div className="relative w-full h-full bg-white/80 backdrop-blur-md rounded-2xl border border-[#d4c1cd]/30 shadow-[0_10px_30px_rgba(74,74,74,0.06)] p-6 flex flex-col items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 500 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto max-h-[360px] drop-shadow-sm"
        >
          {/* Base Platform */}
          <polygon
            points="100,340 400,340 430,370 70,370"
            fill="#f5f3f3"
            stroke="#d4c1cd"
            strokeWidth="1.5"
          />
          <polygon points="70,370 430,370 430,375 70,375" fill="#8E4585" opacity="0.3" />

          {/* Central Pillar */}
          <rect x="242" y="100" width="16" height="240" rx="4" fill="#82737d" opacity="0.8" />
          <path d="M 230 100 L 270 100 L 250 80 Z" fill="#722d6c" />

          {/* Balance Beam */}
          <rect x="110" y="118" width="280" height="12" rx="6" fill="#8E4585" />
          <circle cx="250" cy="124" r="14" fill="#722d6c" stroke="#ffffff" strokeWidth="2" />

          {/* Left Scale Strings & Pan (Claimant) */}
          <line x1="130" y1="128" x2="90" y2="230" stroke="#82737d" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="130" y1="128" x2="170" y2="230" stroke="#82737d" strokeWidth="1.5" strokeDasharray="3 3" />
          <ellipse cx="130" cy="235" rx="55" ry="12" fill="#efeded" stroke="#d4c1cd" strokeWidth="1.5" />
          <path d="M 75 235 Q 130 265 185 235 Z" fill="#DCA1A1" opacity="0.25" stroke="#DCA1A1" strokeWidth="1.5" />

          {/* Left Pan Label Badge */}
          <rect x="100" y="200" width="60" height="20" rx="4" fill="#ffffff" stroke="#d4c1cd" />
          <text x="130" y="213" textAnchor="middle" fill="#50434c" fontSize="10" fontFamily="Inter" fontWeight="600">
            CLAIMANT
          </text>

          {/* Right Scale Strings & Pan (Respondent) */}
          <line x1="370" y1="128" x2="330" y2="230" stroke="#82737d" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="370" y1="128" x2="410" y2="230" stroke="#82737d" strokeWidth="1.5" strokeDasharray="3 3" />
          <ellipse cx="370" cy="235" rx="55" ry="12" fill="#efeded" stroke="#d4c1cd" strokeWidth="1.5" />
          <path d="M 315 235 Q 370 265 425 235 Z" fill="#8E4585" opacity="0.2" stroke="#8E4585" strokeWidth="1.5" />

          {/* Right Pan Label Badge */}
          <rect x="335" y="200" width="70" height="20" rx="4" fill="#ffffff" stroke="#d4c1cd" />
          <text x="370" y="213" textAnchor="middle" fill="#50434c" fontSize="10" fontFamily="Inter" fontWeight="600">
            RESPONDENT
          </text>

          {/* Floating On-Chain Tokens / Escrow Symbols */}
          <circle cx="130" cy="180" r="16" fill="#8E4585" opacity="0.9" />
          <text x="130" y="184" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="Inter" fontWeight="bold">
            USDC
          </text>

          <circle cx="370" cy="180" r="16" fill="#722d6c" opacity="0.8" />
          <text x="370" y="184" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="Inter" fontWeight="bold">
            EURC
          </text>
        </svg>

        <div className="absolute bottom-4 right-4 text-[10px] text-[#82737d] font-mono tracking-widest uppercase">
          Cyclone Protocol · Arc Testnet
        </div>
      </div>
    </div>
  );
};
