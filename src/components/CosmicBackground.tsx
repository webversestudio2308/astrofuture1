import React, { useState, useEffect } from "react";

// Curated high-resolution Vedic astrology, cosmic orbits, and Kundali celestial imagery
const ASTRO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80",
    alt: "Celestial Zodiac & Sacred Astrolabe Wheel",
  },
  {
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80",
    alt: "Deep Planetary Alignment & Cosmic Nebula",
  },
  {
    url: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1920&q=80",
    alt: "Golden Constellation Sky & Vedic Star Map",
  },
  {
    url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=80",
    alt: "Cosmic Spiral Galaxy & Gravitational Orbits",
  },
  {
    url: "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&w=1920&q=80",
    alt: "Sacred Starlight & Mystic Horizon",
  },
  {
    url: "https://images.unsplash.com/photo-1532798369041-b33eb577ef1a?auto=format&fit=crop&w=1920&q=80",
    alt: "Luminous Solar Corona & Planetary Eclipses",
  },
];

export const CosmicBackground: React.FC = () => {
  // Changes every 2 seconds (2000ms) as requested by user
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ASTRO_IMAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* Base Dark Space Void */}
      <div className="absolute inset-0 bg-[#050509]" />

      {/* Layer 1: Rotating Astrology & Kundali Images with Elastic Spring Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {ASTRO_IMAGES.map((img, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={img.url}
              className={`absolute inset-0 transition-all duration-1000 ${
                isActive ? "opacity-30 z-1" : "opacity-0 z-0 pointer-events-none"
              }`}
              style={{
                transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Elastic spring curve
                transform: isActive ? "scale(1.03)" : "scale(0.96)",
              }}
            >
              <img
                src={img.url}
                alt={img.alt}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-center filter saturate-150 contrast-125"
              />
            </div>
          );
        })}
      </div>

      {/* Layer 2: Deep Dark Cosmic Scrim to guarantee pristine readability & luxury contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050509]/85 via-[#080811]/75 to-[#050509]/90" />

      {/* Layer 3: Subtle Nebula Gradients (#0D0B18, deep cosmic violet, gold aura) */}
      <div className="absolute top-[-10%] left-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-purple-900/20 via-indigo-950/15 to-transparent blur-[140px] animate-pulse-glow" />
      <div className="absolute top-1/3 right-[-10%] w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-amber-600/10 via-rose-950/15 to-transparent blur-[150px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-purple-950/25 via-amber-700/10 to-transparent blur-[160px]" />

      {/* Layer 4: Sacred Kundali Diamond Geometry & Orbit Rings (Lightweight SVG) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cosmicGoldLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="orbitRing" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Large Astrological Orbital Arcs */}
        <ellipse
          cx="85%"
          cy="20%"
          rx="420"
          ry="180"
          fill="none"
          stroke="url(#orbitRing)"
          strokeWidth="1"
          strokeDasharray="6 8"
          className="animate-[spin_90s_linear_infinite]"
        />
        <ellipse
          cx="15%"
          cy="75%"
          rx="500"
          ry="240"
          fill="none"
          stroke="url(#orbitRing)"
          strokeWidth="0.8"
          strokeDasharray="4 12"
          className="animate-[spin_120s_linear_infinite_reverse]"
        />

        {/* Sacred Constellation Lines */}
        <g stroke="url(#cosmicGoldLine)" strokeWidth="0.75">
          {/* Constellation Cluster Top Left */}
          <line x1="8%" y1="12%" x2="14%" y2="18%" />
          <line x1="14%" y1="18%" x2="19%" y2="15%" />
          <line x1="19%" y1="15%" x2="25%" y2="22%" />
          <line x1="14%" y1="18%" x2="16%" y2="28%" />

          {/* Constellation Cluster Right */}
          <line x1="78%" y1="35%" x2="84%" y2="42%" />
          <line x1="84%" y1="42%" x2="89%" y2="38%" />
          <line x1="89%" y1="38%" x2="94%" y2="46%" />

          {/* Constellation Center-Bottom */}
          <line x1="38%" y1="80%" x2="45%" y2="85%" />
          <line x1="45%" y1="85%" x2="52%" y2="82%" />
          <line x1="52%" y1="82%" x2="58%" y2="88%" />
        </g>

        {/* Constellation Star Points */}
        <g fill="#fef3c7">
          <circle cx="8%" cy="12%" r="1.5" className="animate-pulse" />
          <circle cx="14%" cy="18%" r="2" fill="#fbbf24" />
          <circle cx="19%" cy="15%" r="1.5" />
          <circle cx="25%" cy="22%" r="2.5" fill="#f59e0b" className="animate-pulse" />
          <circle cx="16%" cy="28%" r="1.5" />

          <circle cx="78%" cy="35%" r="2" fill="#fbbf24" />
          <circle cx="84%" cy="42%" r="1.5" />
          <circle cx="89%" cy="38%" r="2.5" fill="#f59e0b" className="animate-pulse" />
          <circle cx="94%" cy="46%" r="1.5" />

          <circle cx="38%" cy="80%" r="1.5" />
          <circle cx="45%" cy="85%" r="2" fill="#fbbf24" />
          <circle cx="52%" cy="82%" r="1.5" />
          <circle cx="58%" cy="88%" r="2" fill="#f59e0b" className="animate-pulse" />
        </g>

        {/* Scattered Starlight Field */}
        <g fill="#ffffff" opacity="0.6">
          <circle cx="5%" cy="45%" r="1" />
          <circle cx="12%" cy="62%" r="0.8" />
          <circle cx="28%" cy="35%" r="1.2" opacity="0.8" />
          <circle cx="33%" cy="10%" r="0.8" />
          <circle cx="48%" cy="25%" r="1" />
          <circle cx="62%" cy="15%" r="0.8" />
          <circle cx="70%" cy="58%" r="1.2" opacity="0.9" />
          <circle cx="82%" cy="80%" r="0.8" />
          <circle cx="92%" cy="25%" r="1" />
          <circle cx="68%" cy="92%" r="0.8" />
          <circle cx="22%" cy="90%" r="1.2" />
        </g>
      </svg>

      {/* Layer 5: Subtle Radial Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(rgba(245, 158, 11, 0.4) 1px, transparent 1px), radial-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          backgroundPosition: "0 0, 22px 22px",
        }}
      />

      {/* Layer 6: Soft Vignette */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,rgba(5,5,9,0.65)_100%]" />
    </div>
  );
};
