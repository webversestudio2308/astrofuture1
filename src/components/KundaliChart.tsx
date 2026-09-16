import React, { useState } from "react";
import { KundaliResult } from "../types";

interface KundaliChartProps {
  kundali: KundaliResult;
  title?: string;
  lang?: "en" | "hi";
}

export const KundaliChart: React.FC<KundaliChartProps> = ({
  kundali,
  title = "Lagna Chart (D1)",
  lang = "en",
}) => {
  const [chartType, setChartType] = useState<"north" | "south">("north");

  // Map planets by house (1-12)
  const housePlanets: Record<number, string[]> = {};
  const houseSigns: Record<number, number> = {};

  for (let i = 1; i <= 12; i++) {
    housePlanets[i] = [];
    houseSigns[i] = ((kundali.ascendant.signId + i - 1) % 12) + 1; // 1-indexed sign number
  }

  kundali.planets.forEach((p) => {
    const symbolAbbr: Record<string, string> = {
      Sun: lang === "hi" ? "सूर्य" : "Su",
      Moon: lang === "hi" ? "चन्द्र" : "Mo",
      Mars: lang === "hi" ? "मंगल" : "Ma",
      Mercury: lang === "hi" ? "बुध" : "Me",
      Jupiter: lang === "hi" ? "गुरु" : "Ju",
      Venus: lang === "hi" ? "शुक्र" : "Ve",
      Saturn: lang === "hi" ? "शनि" : "Sa",
      Rahu: lang === "hi" ? "राहु" : "Ra",
      Ketu: lang === "hi" ? "केतु" : "Ke",
    };
    const code = symbolAbbr[p.name] || p.name.slice(0, 2);
    if (housePlanets[p.house]) {
      housePlanets[p.house].push(`${code} ${Math.floor(p.degree)}°`);
    }
  });

  return (
    <div className="rounded-2xl bg-[#131124]/90 border border-white/10 p-5 shadow-lg backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold">✨</span>
          <h3 className="text-base font-semibold font-serif text-amber-100">{title}</h3>
        </div>

        {/* Toggle North / South Indian style */}
        <div className="flex items-center bg-[#1b1830] rounded-xl p-1 border border-white/10">
          <button
            onClick={() => setChartType("north")}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
              chartType === "north"
                ? "gold-button text-stone-950 font-bold shadow-sm"
                : "text-stone-400 hover:text-white"
            }`}
          >
            {lang === "hi" ? "उत्तर भारतीय" : "North Indian"}
          </button>
          <button
            onClick={() => setChartType("south")}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
              chartType === "south"
                ? "gold-button text-stone-950 font-bold shadow-sm"
                : "text-stone-400 hover:text-white"
            }`}
          >
            {lang === "hi" ? "दक्षिण भारतीय" : "South Indian"}
          </button>
        </div>
      </div>

      {/* Visual Chart Canvas / SVG */}
      <div className="flex justify-center items-center py-2">
        {chartType === "north" ? (
          // North Indian Diamond Chart (360x360 SVG)
          <div className="relative w-full max-w-[360px] aspect-square">
            <svg viewBox="0 0 360 360" className="w-full h-full drop-shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              {/* Outer Square */}
              <rect x="10" y="10" width="340" height="340" fill="#0d0b1a" stroke="#d97706" strokeWidth="2" rx="8" />

              {/* Diagonal lines crossing center */}
              <line x1="10" y1="10" x2="350" y2="350" stroke="#f59e0b" strokeWidth="1.2" opacity="0.4" />
              <line x1="350" y1="10" x2="10" y2="350" stroke="#f59e0b" strokeWidth="1.2" opacity="0.4" />

              {/* Diamond connecting midpoints */}
              <polygon points="180,10 350,180 180,350 10,180" fill="none" stroke="#d97706" strokeWidth="1.8" />

              {/* House 1 (Top Center Diamond) */}
              <g className="house-1">
                <text x="180" y="55" fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">
                  {houseSigns[1]}
                </text>
                <text x="180" y="35" fill="#c084fc" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {lang === "hi" ? "लग्न (1)" : "Lagna (I)"}
                </text>
                {housePlanets[1].map((p, idx) => (
                  <text key={idx} x="180" y={75 + idx * 14} fill="#fef3c7" fontSize="11" fontWeight="600" textAnchor="middle">
                    {p}
                  </text>
                ))}
              </g>

              {/* House 2 (Top Left Triangle) */}
              <g className="house-2">
                <text x="100" y="50" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">
                  {houseSigns[2]}
                </text>
                {housePlanets[2].map((p, idx) => (
                  <text key={idx} x="100" y={72 + idx * 14} fill="#fef3c7" fontSize="10" fontWeight="600" textAnchor="middle">
                    {p}
                  </text>
                ))}
              </g>

              {/* House 3 (Left Top Triangle) */}
              <g className="house-3">
                <text x="50" y="100" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">
                  {houseSigns[3]}
                </text>
                {housePlanets[3].map((p, idx) => (
                  <text key={idx} x="50" y={122 + idx * 14} fill="#fef3c7" fontSize="10" fontWeight="600" textAnchor="middle">
                    {p}
                  </text>
                ))}
              </g>

              {/* House 4 (Left Center Diamond) */}
              <g className="house-4">
                <text x="100" y="185" fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">
                  {houseSigns[4]}
                </text>
                <text x="65" y="185" fill="#c084fc" fontSize="10" fontWeight="bold" textAnchor="middle">
                  IV
                </text>
                {housePlanets[4].map((p, idx) => (
                  <text key={idx} x="100" y={205 + idx * 14} fill="#fef3c7" fontSize="11" fontWeight="600" textAnchor="middle">
                    {p}
                  </text>
                ))}
              </g>

              {/* House 5 (Left Bottom Triangle) */}
              <g className="house-5">
                <text x="50" y="270" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">
                  {houseSigns[5]}
                </text>
                {housePlanets[5].map((p, idx) => (
                  <text key={idx} x="50" y={292 + idx * 14} fill="#fef3c7" fontSize="10" fontWeight="600" textAnchor="middle">
                    {p}
                  </text>
                ))}
              </g>

              {/* House 6 (Bottom Left Triangle) */}
              <g className="house-6">
                <text x="100" y="320" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">
                  {houseSigns[6]}
                </text>
                {housePlanets[6].map((p, idx) => (
                  <text key={idx} x="100" y={298 - idx * 14} fill="#fef3c7" fontSize="10" fontWeight="600" textAnchor="middle">
                    {p}
                  </text>
                ))}
              </g>

              {/* House 7 (Bottom Center Diamond) */}
              <g className="house-7">
                <text x="180" y="315" fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">
                  {houseSigns[7]}
                </text>
                <text x="180" y="335" fill="#c084fc" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {lang === "hi" ? "सप्तम (VII)" : "VII (Jaya)"}
                </text>
                {housePlanets[7].map((p, idx) => (
                  <text key={idx} x="180" y={285 - idx * 14} fill="#fef3c7" fontSize="11" fontWeight="600" textAnchor="middle">
                    {p}
                  </text>
                ))}
              </g>

              {/* House 8 (Bottom Right Triangle) */}
              <g className="house-8">
                <text x="260" y="320" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">
                  {houseSigns[8]}
                </text>
                {housePlanets[8].map((p, idx) => (
                  <text key={idx} x="260" y={298 - idx * 14} fill="#fef3c7" fontSize="10" fontWeight="600" textAnchor="middle">
                    {p}
                  </text>
                ))}
              </g>

              {/* House 9 (Right Bottom Triangle) */}
              <g className="house-9">
                <text x="310" y="270" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">
                  {houseSigns[9]}
                </text>
                {housePlanets[9].map((p, idx) => (
                  <text key={idx} x="310" y={292 + idx * 14} fill="#fef3c7" fontSize="10" fontWeight="600" textAnchor="middle">
                    {p}
                  </text>
                ))}
              </g>

              {/* House 10 (Right Center Diamond) */}
              <g className="house-10">
                <text x="260" y="185" fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">
                  {houseSigns[10]}
                </text>
                <text x="295" y="185" fill="#c084fc" fontSize="10" fontWeight="bold" textAnchor="middle">
                  X (Karma)
                </text>
                {housePlanets[10].map((p, idx) => (
                  <text key={idx} x="260" y={205 + idx * 14} fill="#fef3c7" fontSize="11" fontWeight="600" textAnchor="middle">
                    {p}
                  </text>
                ))}
              </g>

              {/* House 11 (Right Top Triangle) */}
              <g className="house-11">
                <text x="310" y="100" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">
                  {houseSigns[11]}
                </text>
                {housePlanets[11].map((p, idx) => (
                  <text key={idx} x="310" y={122 + idx * 14} fill="#fef3c7" fontSize="10" fontWeight="600" textAnchor="middle">
                    {p}
                  </text>
                ))}
              </g>

              {/* House 12 (Top Right Triangle) */}
              <g className="house-12">
                <text x="260" y="50" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">
                  {houseSigns[12]}
                </text>
                {housePlanets[12].map((p, idx) => (
                  <text key={idx} x="260" y={72 + idx * 14} fill="#fef3c7" fontSize="10" fontWeight="600" textAnchor="middle">
                    {p}
                  </text>
                ))}
              </g>
            </svg>
          </div>
        ) : (
          // South Indian 4x4 Grid
          <div className="w-full max-w-[340px] aspect-square grid grid-cols-4 grid-rows-4 gap-1.5 p-2 bg-[#0d0b1a] rounded-xl border border-amber-500/30">
            {[
              { id: 12, name: "Pisces" },
              { id: 1, name: "Aries" },
              { id: 2, name: "Taurus" },
              { id: 3, name: "Gemini" },
              { id: 11, name: "Aquarius" },
              { id: 0, name: "center" },
              { id: 0, name: "center" },
              { id: 4, name: "Cancer" },
              { id: 10, name: "Capricorn" },
              { id: 0, name: "center" },
              { id: 0, name: "center" },
              { id: 5, name: "Leo" },
              { id: 9, name: "Sagittarius" },
              { id: 8, name: "Scorpio" },
              { id: 7, name: "Libra" },
              { id: 6, name: "Virgo" },
            ].map((cell, idx) => {
              if (cell.id === 0) {
                if (idx === 5) {
                  return (
                    <div
                      key={idx}
                      className="col-span-2 row-span-2 bg-[#17152a] border border-amber-500/30 rounded-lg flex flex-col items-center justify-center p-2 text-center"
                    >
                      <span className="text-xs font-serif font-bold text-amber-300">
                        {lang === "hi" ? "दक्षिण भारतीय" : "South Indian"}
                      </span>
                      <span className="text-[10px] text-stone-400">Fixed Zodiac Grid</span>
                    </div>
                  );
                }
                return null;
              }

              // Find house with this sign
              let cellHouse = 0;
              for (let h = 1; h <= 12; h++) {
                if (houseSigns[h] === cell.id) {
                  cellHouse = h;
                  break;
                }
              }

              const isLagna = cellHouse === 1;

              return (
                <div
                  key={idx}
                  className={`p-1.5 rounded-md border text-[10px] flex flex-col justify-between overflow-hidden ${
                    isLagna
                      ? "bg-amber-950/60 border-amber-500/60 font-bold"
                      : "bg-[#141224] border-white/10"
                  }`}
                >
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="font-mono text-amber-300">{cell.name.slice(0, 2)}</span>
                    {cellHouse > 0 && <span className="text-stone-400">H{cellHouse}</span>}
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-0.5">
                    {cellHouse > 0 &&
                      housePlanets[cellHouse].map((p, pIdx) => (
                        <span key={pIdx} className="text-[9px] text-stone-200 font-semibold truncate">
                          {p}
                        </span>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400 font-mono">
        <span>{lang === "hi" ? "1, 4, 7, 10: केन्द्र भाव" : "1, 4, 7, 10: Kendra (Angles)"}</span>
        <span>{lang === "hi" ? "1, 5, 9: त्रिकोण भाव" : "1, 5, 9: Trikona (Trines)"}</span>
      </div>
    </div>
  );
};
