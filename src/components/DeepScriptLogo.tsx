import React from 'react';

interface DeepScriptLogoProps {
  size?: number;
}

export const DeepScriptLogo: React.FC<DeepScriptLogoProps> = ({ size = 32 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        {/* Tri-Gradient Loop for the interlocking vortex blades */}
        <linearGradient id="vortexGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--gta-pink)" />
          <stop offset="100%" stopColor="var(--gta-orange)" />
        </linearGradient>

        <linearGradient id="vortexGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--gta-orange)" />
          <stop offset="100%" stopColor="var(--gta-cyan)" />
        </linearGradient>

        <linearGradient id="vortexGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--gta-cyan)" />
          <stop offset="100%" stopColor="var(--gta-pink)" />
        </linearGradient>
        
        {/* Soft Radial Ambient Nebula Glow */}
        <radialGradient id="nebulaGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--logo-nebula)" stopOpacity="var(--logo-nebula-op)" />
          <stop offset="60%" stopColor="var(--gta-purple)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        {/* Neon Glow filters */}
        <filter id="glowFuchsia" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="glowCyan" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background Cosmic Nebula */}
      <circle cx="50" cy="50" r="45" fill="url(#nebulaGlow)" />

      {/* Interlocking Tri-Swoosh Vortex */}
      <g>
        {/* Swoosh 1 (Top-Right Sweep) */}
        <path 
          d="M 50 12 C 71 12, 88 29, 88 50 C 88 66, 75 80, 60 85 C 55 87, 52 83, 54 78 C 65 70, 72 61, 72 50 C 72 38, 62 28, 50 28 C 45 28, 41 31, 41 31 C 39 31, 42 18, 50 12 Z" 
          fill="url(#vortexGrad1)"
          stroke="var(--panel-bg-solid)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        
        {/* Swoosh 2 (Bottom Sweep - Rotated 120deg) */}
        <path 
          d="M 50 12 C 71 12, 88 29, 88 50 C 88 66, 75 80, 60 85 C 55 87, 52 83, 54 78 C 65 70, 72 61, 72 50 C 72 38, 62 28, 50 28 C 45 28, 41 31, 41 31 C 39 31, 42 18, 50 12 Z" 
          fill="url(#vortexGrad2)"
          stroke="var(--panel-bg-solid)"
          strokeWidth="1.8"
          strokeLinejoin="round"
          transform="rotate(120 50 50)"
        />

        {/* Swoosh 3 (Top-Left Sweep - Rotated 240deg) */}
        <path 
          d="M 50 12 C 71 12, 88 29, 88 50 C 88 66, 75 80, 60 85 C 55 87, 52 83, 54 78 C 65 70, 72 61, 72 50 C 72 38, 62 28, 50 28 C 45 28, 41 31, 41 31 C 39 31, 42 18, 50 12 Z" 
          fill="url(#vortexGrad3)"
          stroke="var(--panel-bg-solid)"
          strokeWidth="1.8"
          strokeLinejoin="round"
          transform="rotate(240 50 50)"
        />
      </g>

      {/* Central Stylized 'G' Lettermark */}
      <g>
        {/* Glow behind the 'G' */}
        <path 
          d="M 59 42 C 56 39, 53 38, 50 38 C 43 38, 38 43, 38 50 C 38 57, 43 62, 50 62 C 56 62, 60 58, 61 52 L 61 50 L 50 50" 
          fill="none" 
          stroke="var(--logo-star)" 
          strokeWidth="3.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          filter="url(#glowCyan)"
          opacity="0.5"
        />
        {/* Crisp foreground 'G' */}
        <path 
          d="M 59 42 C 56 39, 53 38, 50 38 C 43 38, 38 43, 38 50 C 38 57, 43 62, 50 62 C 56 62, 60 58, 61 52 L 61 50 L 50 50" 
          fill="none" 
          stroke="var(--logo-star)" 
          strokeWidth="3.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </g>

      {/* Glowing AI Sparkle Crown at the top-right opening of the 'G' */}
      <path 
        d="M 62 31 C 62 35, 60 38, 55 38 C 60 38, 62 41, 62 45 C 62 41, 64 38, 69 38 C 64 38, 62 35, 62 31 Z" 
        fill="var(--gta-cyan)" 
        filter="url(#glowCyan)" 
      />

      {/* Hot core glowing neural nexus dot at the center (end of the 'G' bar) */}
      <circle cx="50" cy="50" r="2.8" fill="var(--gta-cyan)" />
      <circle cx="50" cy="50" r="1.2" fill="var(--logo-core)" />
    </svg>
  );
};




