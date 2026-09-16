import React, { useState, useEffect } from "react";
import { Language } from "../types";
import { RASHI_NAMES } from "../utils/vedicCalculations";
import { Sparkles, Moon, Sun, Flame, Wind, Droplets, Mountain, RefreshCw, AlertCircle } from "lucide-react";

interface HoroscopeViewProps {
  lang: Language;
  customKey: string;
  
}

const ZODIAC_ICONS: Record<string, string> = {
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓",
};

export const HoroscopeView: React.FC<HoroscopeViewProps> = ({
  lang,
  customKey,
  
}) => {
  const [selectedRashi, setSelectedRashi] = useState<string>("Aries");
  const [period, setPeriod] = useState<"today" | "tomorrow" | "weekly" | "monthly">("today");
  const [loading, setLoading] = useState(false);
  const [horoscopeText, setHoroscopeText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHoroscope();
  }, [selectedRashi, period, lang]);

  const fetchHoroscope = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (customKey) {
        headers["x-gemini-api-key"] = customKey;
      }

      const res = await fetch("/api/gemini/horoscope", {
        method: "POST",
        headers,
        body: JSON.stringify({
          rashi: selectedRashi,
          period,
          lang,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === "API_KEY_INVALID") {
          setError(
            lang === "hi"
              ? "दैनिक राशिफल सेवा अस्थायी रूप से व्यस्त है। कृपया कुछ क्षणों बाद पुनः प्रयास करें।"
              : "Horoscope service temporarily busy. Please try again shortly."
          );
        } else {
          setError(data.message || "Failed to load horoscope.");
        }
      } else {
        setHoroscopeText(data.horoscope);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to connect to horoscope service.");
    } finally {
      setLoading(false);
    }
  };

  const currentRashiObj = RASHI_NAMES.find((r) => r.en === selectedRashi) || RASHI_NAMES[0];

  const getElementIcon = (elem: string) => {
    switch (elem) {
      case "Fire":
        return <Flame className="w-3.5 h-3.5 text-orange-400" />;
      case "Earth":
        return <Mountain className="w-3.5 h-3.5 text-emerald-400" />;
      case "Air":
        return <Wind className="w-3.5 h-3.5 text-sky-400" />;
      case "Water":
        return <Droplets className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return null;
    }
  };

  const periodLabels: Record<string, { hi: string; en: string }> = {
    today: { hi: "आज (Today)", en: "Today" },
    tomorrow: { hi: "कल (Tomorrow)", en: "Tomorrow" },
    weekly: { hi: "साप्ताहिक (Weekly)", en: "Weekly" },
    monthly: { hi: "मासिक (Monthly)", en: "Monthly" },
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="rounded-3xl bg-[#0e0c1b]/90 border border-amber-500/30 p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2 font-mono">
          <Moon className="w-3.5 h-3.5 text-amber-400" />
          {lang === "hi" ? "दैनिक एवं मासिक चंद्र राशिफल" : "Vedic Moon Sign Forecasts"}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-amber-100">
          {lang === "hi" ? "वैदिक राशिफल (Rashiphal)" : "Vedic Daily & Periodic Horoscope"}
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 mt-1">
          {lang === "hi"
            ? "अपनी जन्म चंद्र राशि चुनें और ग्रहों के दैनिक गोचर का शुभ मार्गदर्शन प्राप्त करें।"
            : "Select your Vedic Moon Sign (Chandra Rashi) to view cosmic planetary transits and guidance."}
        </p>
      </div>

      {/* 12 Rashi Selection Carousel/Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2.5">
        {RASHI_NAMES.map((rashi) => {
          const isSelected = selectedRashi === rashi.en;
          const symbol = ZODIAC_ICONS[rashi.en] || "✨";
          return (
            <button
              key={rashi.en}
              onClick={() => setSelectedRashi(rashi.en as any)}
              className={`
                flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl transition-all border
                ${
                  isSelected
                    ? "bg-amber-500/20 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    : "bg-[#141224] border-white/5 hover:border-amber-500/30 hover:bg-[#1a1730]"
                }
              `}
            >
              <span className={`text-2xl sm:text-3xl mb-1.5 sm:mb-2 ${isSelected ? "opacity-100" : "opacity-60 grayscale"}`}>
                {symbol}
              </span>
              <span className={`text-[10px] sm:text-xs font-semibold text-center leading-tight ${isSelected ? "text-amber-300" : "text-stone-400"}`}>
                {lang === "hi" ? rashi.hi.split(" ")[0] : rashi.en}
              </span>
            </button>
          );
        })}
      </div>

      {/* Horoscope Card */}
      <div className="rounded-3xl bg-[#0e0c1b]/80 border border-white/10 p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
        {/* Header of selected Rashi */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl gold-button text-stone-950 flex items-center justify-center text-3xl font-serif shadow-md">
              {ZODIAC_ICONS[selectedRashi]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-serif text-amber-100">
                  {lang === "hi" ? currentRashiObj.hi : currentRashiObj.en}
                </h3>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-[#1a1730] text-stone-300 border border-white/10">
                  {getElementIcon(currentRashiObj.element)}
                  {currentRashiObj.element}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {lang === "hi" ? "राशि स्वामी: " : "Rashi Lord: "}
                <strong className="text-amber-300 font-bold">{currentRashiObj.lord}</strong>
              </p>
            </div>
          </div>

          {/* Period selector buttons */}
          <div className="flex items-center bg-[#18162d] rounded-xl p-1 border border-white/10 self-start sm:self-auto">
            {(["today", "tomorrow", "weekly", "monthly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`
                  px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap
                  ${
                    period === p
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm"
                      : "text-stone-400 hover:text-amber-100 hover:bg-white/[0.04] border border-transparent"
                  }
                `}
              >
                {lang === "hi" ? periodLabels[p].hi.split(" ")[0] : periodLabels[p].en}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-stone-400">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
            <p className="text-xs font-medium">
              {lang === "hi"
                ? "ग्रह गोचर व चंद्र नक्षत्र का फलादेश तैयार हो रहा है..."
                : "Fetching Vedic transit calculations & horoscope..."}
            </p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="prose prose-invert max-w-none text-sm text-stone-200 leading-relaxed whitespace-pre-wrap">
              {horoscopeText || (lang === "hi" ? "दैनिक राशिफल लोड हो रहा है..." : "Loading horoscope...")}
            </div>

            {/* Daily auspicious metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
              <div className="p-3.5 rounded-xl bg-[#141224] border border-white/10">
                <span className="text-[10px] text-stone-400 font-bold uppercase block font-mono">
                  {lang === "hi" ? "शुभ रंग" : "Lucky Color"}
                </span>
                <span className="text-xs font-bold text-amber-200 mt-1 block">
                  {lang === "hi" ? "केसरिया / पीला" : "Saffron / Gold"}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#141224] border border-white/10">
                <span className="text-[10px] text-stone-400 font-bold uppercase block font-mono">
                  {lang === "hi" ? "शुभ अंक" : "Lucky Number"}
                </span>
                <span className="text-xs font-bold text-amber-200 font-mono mt-1 block">3, 7, 9</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#141224] border border-white/10">
                <span className="text-[10px] text-stone-400 font-bold uppercase block font-mono">
                  {lang === "hi" ? "शुभ समय" : "Auspicious Time"}
                </span>
                <span className="text-xs font-bold text-amber-200 font-mono mt-1 block">09:15 - 11:30 AM</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#141224] border border-white/10">
                <span className="text-[10px] text-stone-400 font-bold uppercase block font-mono">
                  {lang === "hi" ? "शुभ दिशा" : "Favorable Direction"}
                </span>
                <span className="text-xs font-bold text-amber-200 mt-1 block">
                  {lang === "hi" ? "ईशान (North-East)" : "North-East (Ishanya)"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
