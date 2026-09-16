import React, { useState } from "react";
import { Language, AshtakootScore } from "../types";
import { RASHI_NAMES, NAKSHATRAS, calculateGunaMilan } from "../utils/vedicCalculations";
import { HeartHandshake, Sparkles, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

interface MatchmakingViewProps {
  lang: Language;
  customKey: string;
  
}

export const MatchmakingView: React.FC<MatchmakingViewProps> = ({
  lang,
  customKey,
  
}) => {
  const [person1, setPerson1] = useState({
    name: lang === "hi" ? "वर (वर पक्ष)" : "Groom",
    rashiIdx: 1, // Taurus
    nakshatraIdx: 3, // Rohini
  });

  const [person2, setPerson2] = useState({
    name: lang === "hi" ? "वधू (कन्या पक्ष)" : "Bride",
    rashiIdx: 3, // Cancer
    nakshatraIdx: 7, // Pushya
  });

  const [score, setScore] = useState<AshtakootScore>(() =>
    calculateGunaMilan(person1.nakshatraIdx, person1.rashiIdx, person2.nakshatraIdx, person2.rashiIdx)
  );

  const [loadingAi, setLoadingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleRecalculate = () => {
    const s = calculateGunaMilan(person1.nakshatraIdx, person1.rashiIdx, person2.nakshatraIdx, person2.rashiIdx);
    setScore(s);
    setAiAnalysis("");
  };

  const handleAiAnalysis = async () => {
    setLoadingAi(true);
    setError(null);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (customKey) {
        headers["x-gemini-api-key"] = customKey;
      }

      const res = await fetch("/api/gemini/matchmaking", {
        method: "POST",
        headers,
        body: JSON.stringify({
          person1: {
            name: person1.name,
            rashi: RASHI_NAMES[person1.rashiIdx].en,
            nakshatra: NAKSHATRAS[person1.nakshatraIdx].name,
          },
          person2: {
            name: person2.name,
            rashi: RASHI_NAMES[person2.rashiIdx].en,
            nakshatra: NAKSHATRAS[person2.nakshatraIdx].name,
          },
          ashtakootScore: score.total,
          lang,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === "API_KEY_INVALID") {
          setError(
            lang === "hi"
              ? "सिस्टम अस्थायी रूप से व्यस्त है। कृपया पुनः प्रयास करें।"
              : "Astrological service temporarily busy. Please try again."
          );
        } else {
          setError(data.message || "Failed to analyze compatibility.");
        }
      } else {
        setAiAnalysis(data.analysis);
      }
    } catch (err: any) {
      setError(err?.message || "Network error while connecting to matchmaking AI.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#0e0c1b]/90 border border-amber-500/30 p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2 font-mono">
          <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
          {lang === "hi" ? "अष्टकूट गुण मिलान (36 गुण)" : "Vedic Ashtakoot Guna Milan (36 Points)"}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-amber-100">
          {lang === "hi" ? "वैदिक विवाह कुंडली मिलान" : "Vedic Matrimonial Compatibility"}
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 mt-1">
          {lang === "hi"
            ? "वर्ण, वश्य, तारा, योनि, ग्रह मैत्री, गण, भकूट एवं नाड़ी दोष का शास्त्रीय विश्लेषण व AI परामर्श।"
            : "Complete 36-point Guna Milan covering Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot & Nadi."}
        </p>
      </div>

      {/* Input Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Person 1 / Boy */}
        <div className="rounded-3xl bg-[#0e0c1b]/80 border border-white/10 p-6 shadow-xl space-y-4 backdrop-blur-xl">
          <h3 className="text-base font-bold font-serif text-amber-100 pb-2 border-b border-white/10 flex items-center gap-2">
            <span>👦</span>
            <span>{lang === "hi" ? "वर पक्ष विवरण" : "Boy / Groom Details"}</span>
          </h3>

          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1">
              {lang === "hi" ? "नाम" : "Name"}
            </label>
            <input
              type="text"
              value={person1.name}
              onChange={(e) => setPerson1({ ...person1, name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#141224] border border-white/10 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1">
              {lang === "hi" ? "चंद्र राशि" : "Moon Sign (Rashi)"}
            </label>
            <select
              value={person1.rashiIdx}
              onChange={(e) => {
                setPerson1({ ...person1, rashiIdx: parseInt(e.target.value) });
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-[#141224] border border-white/10 text-sm text-white focus:outline-none focus:border-amber-400"
            >
              {RASHI_NAMES.map((r, idx) => (
                <option key={r.en} value={idx} className="bg-[#141224] text-white">
                  {lang === "hi" ? r.hi : r.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1">
              {lang === "hi" ? "जन्म नक्षत्र" : "Birth Nakshatra"}
            </label>
            <select
              value={person1.nakshatraIdx}
              onChange={(e) => {
                setPerson1({ ...person1, nakshatraIdx: parseInt(e.target.value) });
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-[#141224] border border-white/10 text-sm text-white focus:outline-none focus:border-amber-400"
            >
              {NAKSHATRAS.map((n, idx) => (
                <option key={n.name} value={idx} className="bg-[#141224] text-white">
                  {idx + 1}. {n.name} ({n.lord})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Person 2 / Girl */}
        <div className="rounded-3xl bg-[#0e0c1b]/80 border border-white/10 p-6 shadow-xl space-y-4 backdrop-blur-xl">
          <h3 className="text-base font-bold font-serif text-amber-100 pb-2 border-b border-white/10 flex items-center gap-2">
            <span>👧</span>
            <span>{lang === "hi" ? "वधू पक्ष विवरण" : "Girl / Bride Details"}</span>
          </h3>

          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1">
              {lang === "hi" ? "नाम" : "Name"}
            </label>
            <input
              type="text"
              value={person2.name}
              onChange={(e) => setPerson2({ ...person2, name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#141224] border border-white/10 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1">
              {lang === "hi" ? "चंद्र राशि" : "Moon Sign (Rashi)"}
            </label>
            <select
              value={person2.rashiIdx}
              onChange={(e) => {
                setPerson2({ ...person2, rashiIdx: parseInt(e.target.value) });
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-[#141224] border border-white/10 text-sm text-white focus:outline-none focus:border-amber-400"
            >
              {RASHI_NAMES.map((r, idx) => (
                <option key={r.en} value={idx} className="bg-[#141224] text-white">
                  {lang === "hi" ? r.hi : r.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1">
              {lang === "hi" ? "जन्म नक्षत्र" : "Birth Nakshatra"}
            </label>
            <select
              value={person2.nakshatraIdx}
              onChange={(e) => {
                setPerson2({ ...person2, nakshatraIdx: parseInt(e.target.value) });
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-[#141224] border border-white/10 text-sm text-white focus:outline-none focus:border-amber-400"
            >
              {NAKSHATRAS.map((n, idx) => (
                <option key={n.name} value={idx} className="bg-[#141224] text-white">
                  {idx + 1}. {n.name} ({n.lord})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Recalculate Button */}
      <div className="flex justify-center">
        <button
          onClick={handleRecalculate}
          className="px-6 py-3 rounded-2xl bg-[#1a1730] hover:bg-[#252144] text-amber-200 border border-amber-500/30 font-serif font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-4 h-4 text-amber-400" />
          <span>{lang === "hi" ? "गुण मिलान पुनः गणना करें" : "Recalculate Guna Milan"}</span>
        </button>
      </div>

      {/* Results Card */}
      <div className="rounded-3xl bg-[#0e0c1b]/80 border border-white/10 p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
        {/* Score Top Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#141224] border border-white/10">
          <div>
            <span className="text-xs text-amber-300 font-bold block font-mono">
              {lang === "hi" ? "कुल प्राप्त गुण स्कोर" : "Total Matchmaking Score"}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold font-mono text-amber-100">
                {score.total}
              </span>
              <span className="text-base text-stone-400 font-mono">/ 36</span>
            </div>
          </div>

          <div className="sm:text-right">
            <span
              className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold border ${
                score.total >= 28
                  ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                  : score.total >= 18
                  ? "bg-blue-950/60 text-blue-300 border-blue-500/40"
                  : "bg-rose-950/60 text-rose-300 border-rose-500/40"
              }`}
            >
              {score.total >= 28
                ? lang === "hi"
                  ? "अति उत्तम संबंध (Highly Auspicious)"
                  : "Excellent Match (28-36)"
                : score.total >= 18
                ? lang === "hi"
                  ? "मध्यम शुभ संबंध (Good Match)"
                  : "Average / Acceptable (18-27)"
                : lang === "hi"
                ? "दोष परिहार आवश्यक (Remedies Advised)"
                : "Inauspicious / Remedial Required (<18)"}
            </span>
            <p className="text-xs text-stone-400 mt-1">
              {lang === "hi" ? "न्यूनतम 18 गुण विवाह हेतु आवश्यक माने जाते हैं।" : "Minimum 18 points required for traditional consent."}
            </p>
          </div>
        </div>

        {/* 8 Koot Breakdown Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 text-stone-400 font-bold uppercase text-[11px]">
                <th className="pb-2.5">Koot</th>
                <th className="pb-2.5">Area of Harmony</th>
                <th className="pb-2.5">Max</th>
                <th className="pb-2.5">Obtained</th>
                <th className="pb-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: "Varna (वर्ण)", area: "Spiritual / Work Compatibility", max: 1, val: score.varna },
                { name: "Vashya (वश्य)", area: "Mutual Attraction & Influence", max: 2, val: score.vashya },
                { name: "Tara (तारा)", area: "Destiny, Health & Longevity", max: 3, val: score.tara },
                { name: "Yoni (योनि)", area: "Physical & Biological Harmony", max: 4, val: score.yoni },
                { name: "Maitri (ग्रह मैत्री)", area: "Mental & Intellectual Friendship", max: 5, val: score.maitri },
                { name: "Gana (गण)", area: "Temperament & Behavioral Sync", max: 6, val: score.gana },
                { name: "Bhakoot (भकूट)", area: "Family Prosperity & Love", max: 7, val: score.bhakoot },
                { name: "Nadi (नाड़ी)", area: "Genetic Health & Progeny", max: 8, val: score.nadi },
              ].map((k) => (
                <tr key={k.name} className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 font-bold text-amber-100">{k.name}</td>
                  <td className="py-2.5 text-stone-300">{k.area}</td>
                  <td className="py-2.5 text-stone-400 font-mono">{k.max}</td>
                  <td className="py-2.5 font-mono font-bold text-amber-300">{k.val}</td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        k.val === k.max
                          ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                          : k.val > 0
                          ? "bg-blue-950/60 text-blue-300 border-blue-500/40"
                          : "bg-rose-950/60 text-rose-300 border-rose-500/40"
                      }`}
                    >
                      {k.val === k.max ? "Perfect" : k.val > 0 ? "Partial" : "Dosha"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Deep Analysis Button */}
        <div className="pt-2">
          <button
            onClick={handleAiAnalysis}
            disabled={loadingAi}
            className="w-full py-3.5 rounded-2xl gold-button text-stone-950 font-serif font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 text-stone-950 ${loadingAi ? "animate-spin" : ""}`} />
            <span>
              {loadingAi
                ? lang === "hi"
                  ? "पूज्य ज्योतिषाचार्य मिलान विश्लेषण कर रहे हैं..."
                  : "Analyzing Matrimonial Harmony..."
                : lang === "hi"
                ? "पूज्य ज्योतिषाचार्य से विस्तृत विवाह फलादेश व दोष निवारण जानें"
                : "Get Deep Vedic Compatibility & Dosha Remedy Reading"}
            </span>
          </button>
        </div>

        {/* Reading Output */}
        {aiAnalysis && (
          <div className="p-5 rounded-2xl bg-[#141224] border border-white/10 text-xs sm:text-sm text-stone-200 leading-relaxed space-y-2 whitespace-pre-wrap">
            <h4 className="font-bold font-serif text-amber-100 text-base">
              {lang === "hi" ? "पूज्य ज्योतिषाचार्य मिलान परामर्श" : "Vedic Matrimonial Synthesis"}
            </h4>
            <p>{aiAnalysis}</p>
          </div>
        )}
      </div>
    </div>
  );
};
