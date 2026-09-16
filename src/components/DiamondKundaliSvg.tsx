import React from "react";
import { KundaliResult, Language } from "../types";

interface DiamondKundaliSvgProps {
  kundali: KundaliResult;
  chartType?: "lagna" | "navamsha" | "moon" | "chalit";
  lang?: Language;
  size?: number;
  theme?: "dark" | "light";
}

export const DiamondKundaliSvg: React.FC<DiamondKundaliSvgProps> = ({
  kundali,
  chartType = "lagna",
  lang = "hi",
  size = 320,
  theme = "dark",
}) => {
  // Signs & Planet symbols in Hindi / English
  const planetsHi: Record<string, string> = {
    Sun: "सूर्य",
    Moon: "चन्द्र",
    Mars: "मंगल",
    Mercury: "बुध",
    Jupiter: "गुरु",
    Venus: "शुक्र",
    Saturn: "शनि",
    Rahu: "राहु",
    Ketu: "केतु",
  };

  const housePlanets: Record<number, string[]> = {};
  const houseSigns: Record<number, number> = {};

  const baseSignId =
    chartType === "moon"
      ? kundali.moon.signId
      : chartType === "navamsha"
      ? (kundali.ascendant.signId + 8) % 12
      : kundali.ascendant.signId;

  for (let i = 1; i <= 12; i++) {
    housePlanets[i] = [];
    houseSigns[i] = ((baseSignId + i - 1) % 12) + 1;
  }

  kundali.planets.forEach((p) => {
    let targetHouse = p.house;
    if (chartType === "moon") {
      targetHouse = ((p.house - kundali.moon.signId + 12) % 12) || 12;
    } else if (chartType === "navamsha") {
      targetHouse = ((p.house + 4) % 12) || 12;
    }
    const name = lang === "hi" ? planetsHi[p.name] || p.name : p.name.slice(0, 2);
    const deg = Math.floor(p.degree);
    if (housePlanets[targetHouse]) {
      housePlanets[targetHouse].push(`${name} ${deg}°`);
    }
  });

  const isDark = theme === "dark";
  const bgColor = isDark ? "#0d0b1a" : "#fdfcf9";
  const strokeColor = isDark ? "#d97706" : "#b45309";
  const subStrokeColor = isDark ? "rgba(245, 158, 11, 0.45)" : "#b45309";
  const signTextColor = isDark ? "#fbbf24" : "#b91c1c";
  const labelTextColor = isDark ? "#c084fc" : "#78350f";
  const planetTextColor = isDark ? "#fef3c7" : "#881337";

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <svg
        viewBox="0 0 340 340"
        style={{ width: size, height: size }}
        className={isDark ? "drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "drop-shadow-sm"}
      >
        {/* Outer Square */}
        <rect
          x="10"
          y="10"
          width="320"
          height="320"
          fill={bgColor}
          stroke={strokeColor}
          strokeWidth="2"
          rx="6"
        />

        {/* Diagonal lines from corners */}
        <line x1="10" y1="10" x2="330" y2="330" stroke={subStrokeColor} strokeWidth="1.2" />
        <line x1="330" y1="10" x2="10" y2="330" stroke={subStrokeColor} strokeWidth="1.2" />

        {/* Diamond connecting midpoints (170,10 / 330,170 / 170,330 / 10,170) */}
        <polygon
          points="170,10 330,170 170,330 10,170"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.6"
        />

        {/* House 1 (Top Center Diamond) */}
        <text x="170" y="48" fill={signTextColor} fontSize="13" fontWeight="bold" textAnchor="middle">
          {houseSigns[1]}
        </text>
        <text x="170" y="30" fill={labelTextColor} fontSize="9" fontWeight="600" textAnchor="middle">
          {lang === "hi" ? "लग्न (1)" : "Lagna (1)"}
        </text>
        {housePlanets[1].slice(0, 3).map((p, idx) => (
          <text key={idx} x="170" y={70 + idx * 14} fill={planetTextColor} fontSize="10" fontWeight="bold" textAnchor="middle">
            {p}
          </text>
        ))}

        {/* House 2 (Top Left Triangle) */}
        <text x="95" y="48" fill={signTextColor} fontSize="11" fontWeight="bold" textAnchor="middle">
          {houseSigns[2]}
        </text>
        {housePlanets[2].slice(0, 2).map((p, idx) => (
          <text key={idx} x="90" y={70 + idx * 13} fill={planetTextColor} fontSize="9" fontWeight="bold" textAnchor="middle">
            {p}
          </text>
        ))}

        {/* House 3 (Left Top Triangle) */}
        <text x="45" y="95" fill={signTextColor} fontSize="11" fontWeight="bold" textAnchor="middle">
          {houseSigns[3]}
        </text>
        {housePlanets[3].slice(0, 2).map((p, idx) => (
          <text key={idx} x="45" y={115 + idx * 13} fill={planetTextColor} fontSize="9" fontWeight="bold" textAnchor="middle">
            {p}
          </text>
        ))}

        {/* House 4 (Left Middle Diamond) */}
        <text x="50" y="170" fill={signTextColor} fontSize="13" fontWeight="bold" textAnchor="middle">
          {houseSigns[4]}
        </text>
        <text x="35" y="152" fill={labelTextColor} fontSize="8.5" fontWeight="600" textAnchor="middle">
          {lang === "hi" ? "सुख (4)" : "IV"}
        </text>
        {housePlanets[4].slice(0, 3).map((p, idx) => (
          <text key={idx} x="90" y={165 + idx * 14} fill={planetTextColor} fontSize="10" fontWeight="bold" textAnchor="middle">
            {p}
          </text>
        ))}

        {/* House 5 (Left Bottom Triangle) */}
        <text x="45" y="245" fill={signTextColor} fontSize="11" fontWeight="bold" textAnchor="middle">
          {houseSigns[5]}
        </text>
        {housePlanets[5].slice(0, 2).map((p, idx) => (
          <text key={idx} x="45" y={265 + idx * 13} fill={planetTextColor} fontSize="9" fontWeight="bold" textAnchor="middle">
            {p}
          </text>
        ))}

        {/* House 6 (Bottom Left Triangle) */}
        <text x="95" y="295" fill={signTextColor} fontSize="11" fontWeight="bold" textAnchor="middle">
          {houseSigns[6]}
        </text>
        {housePlanets[6].slice(0, 2).map((p, idx) => (
          <text key={idx} x="90" y={270 - idx * 13} fill={planetTextColor} fontSize="9" fontWeight="bold" textAnchor="middle">
            {p}
          </text>
        ))}

        {/* House 7 (Bottom Center Diamond) */}
        <text x="170" y="295" fill={signTextColor} fontSize="13" fontWeight="bold" textAnchor="middle">
          {houseSigns[7]}
        </text>
        <text x="170" y="315" fill={labelTextColor} fontSize="8.5" fontWeight="600" textAnchor="middle">
          {lang === "hi" ? "जाया (7)" : "VII"}
        </text>
        {housePlanets[7].slice(0, 3).map((p, idx) => (
          <text key={idx} x="170" y={270 - idx * 14} fill={planetTextColor} fontSize="10" fontWeight="bold" textAnchor="middle">
            {p}
          </text>
        ))}

        {/* House 8 (Bottom Right Triangle) */}
        <text x="245" y="295" fill={signTextColor} fontSize="11" fontWeight="bold" textAnchor="middle">
          {houseSigns[8]}
        </text>
        {housePlanets[8].slice(0, 2).map((p, idx) => (
          <text key={idx} x="245" y={270 - idx * 13} fill={planetTextColor} fontSize="9" fontWeight="bold" textAnchor="middle">
            {p}
          </text>
        ))}

        {/* House 9 (Right Bottom Triangle) */}
        <text x="295" y="245" fill={signTextColor} fontSize="11" fontWeight="bold" textAnchor="middle">
          {houseSigns[9]}
        </text>
        {housePlanets[9].slice(0, 2).map((p, idx) => (
          <text key={idx} x="290" y={265 + idx * 13} fill={planetTextColor} fontSize="9" fontWeight="bold" textAnchor="middle">
            {p}
          </text>
        ))}

        {/* House 10 (Right Middle Diamond) */}
        <text x="290" y="170" fill={signTextColor} fontSize="13" fontWeight="bold" textAnchor="middle">
          {houseSigns[10]}
        </text>
        <text x="305" y="152" fill={labelTextColor} fontSize="8.5" fontWeight="600" textAnchor="middle">
          {lang === "hi" ? "कर्म (10)" : "X"}
        </text>
        {housePlanets[10].slice(0, 3).map((p, idx) => (
          <text key={idx} x="250" y={165 + idx * 14} fill={planetTextColor} fontSize="10" fontWeight="bold" textAnchor="middle">
            {p}
          </text>
        ))}

        {/* House 11 (Right Top Triangle) */}
        <text x="295" y="95" fill={signTextColor} fontSize="11" fontWeight="bold" textAnchor="middle">
          {houseSigns[11]}
        </text>
        {housePlanets[11].slice(0, 2).map((p, idx) => (
          <text key={idx} x="290" y={115 + idx * 13} fill={planetTextColor} fontSize="9" fontWeight="bold" textAnchor="middle">
            {p}
          </text>
        ))}

        {/* House 12 (Top Right Triangle) */}
        <text x="245" y="48" fill={signTextColor} fontSize="11" fontWeight="bold" textAnchor="middle">
          {houseSigns[12]}
        </text>
        {housePlanets[12].slice(0, 2).map((p, idx) => (
          <text key={idx} x="245" y={70 + idx * 13} fill={planetTextColor} fontSize="9" fontWeight="bold" textAnchor="middle">
            {p}
          </text>
        ))}
      </svg>
    </div>
  );
};
