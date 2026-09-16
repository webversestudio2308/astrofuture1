import React from "react";

interface AstroLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const AstroLogo: React.FC<AstroLogoProps> = ({
  className = "",
  size = 46,
  showText = true,
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Futuristic Celestial Intelligence Logo Emblem */}
      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Ambient Cosmic Gold Aura */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/30 via-purple-600/20 to-amber-300/30 blur-md -z-10 animate-pulse-glow" />

        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_10px_rgba(245,158,11,0.35)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Orbital Ring with Celestial Hash Marks */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#afGoldRing)"
            strokeWidth="1.75"
            strokeDasharray="5 3"
            className="animate-[spin_45s_linear_infinite]"
          />

          {/* Gyroscopic Orbital Rings: Ancient Astrolabe meets Quantum Geometry */}
          <ellipse
            cx="50"
            cy="50"
            rx="39"
            ry="19"
            stroke="url(#afCosmicPurple)"
            strokeWidth="1.25"
            transform="rotate(-30 50 50)"
            opacity="0.85"
          />
          <ellipse
            cx="50"
            cy="50"
            rx="39"
            ry="19"
            stroke="url(#afGoldRing)"
            strokeWidth="1.2"
            transform="rotate(60 50 50)"
            opacity="0.75"
          />

          {/* Sacred Vedic Octagram / 8-pointed Cosmic Star */}
          <polygon
            points="50,15 58,42 85,50 58,58 50,85 42,58 15,50 42,42"
            fill="url(#afGoldStarGrad)"
            opacity="0.95"
            className="drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"
          />
          <polygon
            points="50,26 56,44 74,50 56,56 50,74 44,56 26,50 44,44"
            fill="url(#afInnerStarGrad)"
            opacity="0.98"
          />

          {/* Central AI Singularity / Sacred Bindu */}
          <circle cx="50" cy="50" r="4" fill="#fbbf24" className="animate-ping" opacity="0.4" />
          <circle cx="50" cy="50" r="3.5" fill="#f59e0b" />
          <circle cx="50" cy="50" r="1.8" fill="#ffffff" />

          {/* Orbiting Planetary Nodes (Navagraha Nodes) */}
          <circle cx="50" cy="5" r="2.5" fill="#fbbf24" />
          <circle cx="95" cy="50" r="2.5" fill="#c084fc" />
          <circle cx="50" cy="95" r="2.5" fill="#f59e0b" />
          <circle cx="5" cy="50" r="2.5" fill="#38bdf8" />

          {/* Gradients */}
          <defs>
            <linearGradient id="afGoldRing" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f59e0b" />
              <stop offset="0.5" stopColor="#fbbf24" />
              <stop offset="1" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="afCosmicPurple" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#c084fc" />
              <stop offset="0.6" stopColor="#a855f7" />
              <stop offset="1" stopColor="#7e22ce" />
            </linearGradient>
            <linearGradient id="afGoldStarGrad" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fef3c7" />
              <stop offset="0.4" stopColor="#fbbf24" />
              <stop offset="0.8" stopColor="#d97706" />
              <stop offset="1" stopColor="#92400e" />
            </linearGradient>
            <linearGradient id="afInnerStarGrad" x1="26" y1="26" x2="74" y2="74" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#fef08a" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg sm:text-xl font-extrabold tracking-widest bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 bg-clip-text text-transparent drop-shadow-sm">
              ASTROFUTURE
            </span>
            <span className="hidden xs:inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-purple-950/70 text-amber-300 border border-amber-500/30">
              AI 2.0
            </span>
          </div>
          <span className="text-[10px] text-amber-200/60 font-mono tracking-wider -mt-0.5 font-medium">
            ANCIENT WISDOM • AI PRECISION
          </span>
        </div>
      )}
    </div>
  );
};
