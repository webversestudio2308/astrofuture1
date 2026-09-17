import React, { useState, useEffect } from "react";
import { BirthData, KundaliResult, Language } from "../types";
import { calculateVedicKundali } from "../utils/vedicCalculations";
import { KundaliChart } from "./KundaliChart";
import { Full20PageKundaliModal } from "./Full20PageKundaliModal";
import { PaymentModal } from "./PaymentModal";
import { getStoredBirthData, saveStoredBirthData } from "../utils/birthStore";
import { useKundaliPayment } from "../utils/paymentStore";
import { 
  Sparkles, 
  Download, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Compass, 
  ShieldAlert, 
  Gem, 
  ChevronRight, 
  RefreshCw,
  Award,
  AlertCircle,
  Printer,
  FileText,
  CheckCircle2,
  Lock
} from "lucide-react";

interface KundaliViewProps {
  lang: Language;
  customKey: string;
  
}

const DEFAULT_CITIES = [
  { name: "New Delhi, India", lat: 28.6139, lon: 77.209, tz: 5.5 },
  { name: "Mumbai, India", lat: 19.076, lon: 72.8777, tz: 5.5 },
  { name: "Bengaluru, India", lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { name: "Kolkata, India", lat: 22.5726, lon: 88.3639, tz: 5.5 },
  { name: "Varanasi, India", lat: 25.3176, lon: 82.9739, tz: 5.5 },
  { name: "Jaipur, India", lat: 26.9124, lon: 75.7873, tz: 5.5 },
  { name: "Ahmedabad, India", lat: 23.0225, lon: 72.5714, tz: 5.5 },
  { name: "London, UK", lat: 51.5074, lon: -0.1278, tz: 0 },
  { name: "New York, USA", lat: 40.7128, lon: -74.006, tz: -5 },
  { name: "Dubai, UAE", lat: 25.2048, lon: 55.2708, tz: 4 },
];

export const KundaliView: React.FC<KundaliViewProps> = ({
  lang,
  customKey,
  
}) => {
  // Initialize from storage
  const [birthData, setBirthData] = useState<BirthData>(() => getStoredBirthData());
  const [kundali, setKundali] = useState<KundaliResult>(() => calculateVedicKundali(getStoredBirthData()));

  const [loadingAi, setLoadingAi] = useState(false);
  const [aiReading, setAiReading] = useState<string>("");
  const [aiError, setAiError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 20-Page Kundali Modal state & ₹51 payment enforcement
  const [is20PageModalOpen, setIs20PageModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { hasPaid } = useKundaliPayment();

  const handleOpen20PageReport = () => {
    if (!hasPaid) {
      setIsPaymentModalOpen(true);
    } else {
      setIs20PageModalOpen(true);
    }
  };

  // Re-calculate basic chart whenever birthData changes
  useEffect(() => {
    const result = calculateVedicKundali(birthData);
    setKundali(result);
  }, [birthData]);

  const handleCitySelect = (cityName: string) => {
    const city = DEFAULT_CITIES.find((c) => c.name === cityName);
    if (city) {
      const updated = {
        ...birthData,
        place: city.name,
        lat: city.lat,
        lon: city.lon,
        timezone: city.tz,
      };
      setBirthData(updated);
      saveStoredBirthData(updated);
    }
  };

  const handleSaveDetails = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveStoredBirthData(birthData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleGenerateAiReading = async () => {
    setLoadingAi(true);
    setAiError(null);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (customKey) {
        headers["x-gemini-api-key"] = customKey;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          message:
            lang === "hi"
              ? `कृपया मेरी जन्म कुंडली का गहन विश्लेषण करें। मेरा नाम: ${birthData.name}, जन्म तिथि: ${birthData.date}, जन्म समय: ${birthData.time}, जन्म स्थान: ${birthData.place}। लग्न: ${kundali.ascendant.sign}, चंद्र राशि: ${kundali.moon.sign}, नक्षत्र: ${kundali.nakshatra.name}, महादशा: ${kundali.dasha.currentMahadasha}। विशेष प्रश्न: ${birthData.focusArea || "करियर एवं जीवन मार्गदर्शन"}। वैदिक ज्योतिष के आधार पर सटीक विश्लेषण, जीवन के मुख्य अवसर, चुनौतियां तथा अचूक उपाय बताएं।`
              : `Please provide a deep astrological analysis of my birth chart. Name: ${birthData.name}, DOB: ${birthData.date}, TOB: ${birthData.time}, Place: ${birthData.place}. Lagna: ${kundali.ascendant.sign}, Moon: ${kundali.moon.sign}, Nakshatra: ${kundali.nakshatra.name}, Mahadasha: ${kundali.dasha.currentMahadasha}. Focus question: ${birthData.focusArea || "Career & Life Path"} Provide classical Parashari insights, upcoming planetary influences, and high-impact Vedic remedies.`,
          history: [],
          birthData,
          lang,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate AI Kundali reading.");
      }
      setAiReading(data.reply || "");
    } catch (err: any) {
      setAiError(err.message || "Something went wrong while connecting to the astrological model.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner in Dark Cosmic Theme */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0e0c1b]/90 border border-amber-500/30 p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {lang === "hi" ? "प्राचीन पराशरी वैदिक ज्योतिष" : "Authentic Parashari Vedic Astrology"}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-amber-100 tracking-tight leading-tight">
              {lang === "hi" ? "जन्म कुंडली एवं 20-पृष्ठीय महाकुंडली विश्लेषण" : "Vedic Birth Chart & 20-Page MahaKundali Analysis"}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {lang === "hi"
                ? "ग्रह-नक्षत्रों की सटीक खगोलीय स्थिति, लग्न चार्ट, नवमांश, विंशोत्तरी दशा, अष्टकवर्ग, मांगलिक एवं साढ़े साती विश्लेषण के साथ व्यक्तिगत वैदिक परामर्श।"
                : "High-precision astronomical calculations, North & South Indian charts, Navamsha D9, 120-year Vimshottari timeline, and certified PDF report."}
            </p>
          </div>

          {/* Action Trigger for 20-Page Kundali */}
          <div className="shrink-0 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleOpen20PageReport}
              className="px-5 py-3.5 rounded-2xl gold-button text-stone-950 font-serif font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {hasPaid ? <FileText className="w-4 h-4 text-stone-950" /> : <Lock className="w-4 h-4 text-stone-950" />}
              <span>
                {hasPaid
                  ? lang === "hi"
                    ? "20 पृष्ठीय विस्तृत कुंडली PDF"
                    : "Open 20-Page Kundali PDF"
                  : lang === "hi"
                  ? "20 पृष्ठीय कुंडली PDF (₹51 अनलॉक)"
                  : "Unlock 20-Page PDF (₹51)"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Birth Data Form (Left) & Key Highlights (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Birth Details */}
        <div className="lg:col-span-5 rounded-3xl bg-[#0e0c1b]/80 border border-white/10 p-6 shadow-xl space-y-5 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold font-serif text-amber-100">
                {lang === "hi" ? "जातक जन्म विवरण (Birth Dossier)" : "Birth Details Dossier"}
              </h2>
            </div>
            {saveSuccess && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lang === "hi" ? "सहेजा गया!" : "Saved!"}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {/* Name & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  {lang === "hi" ? "जातक का पूरा नाम" : "Full Name"}
                </label>
                <input
                  type="text"
                  value={birthData.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBirthData({ ...birthData, name: val });
                    saveStoredBirthData({ ...birthData, name: val });
                  }}
                  placeholder={lang === "hi" ? "अपना नाम दर्ज करें" : "Enter full name"}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#141224] border border-white/10 text-sm text-white focus:outline-none focus:border-amber-400 placeholder:text-stone-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  {lang === "hi" ? "लिंग" : "Gender"}
                </label>
                <select
                  value={birthData.gender}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setBirthData({ ...birthData, gender: val });
                    saveStoredBirthData({ ...birthData, gender: val });
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#141224] border border-white/10 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="male" className="bg-[#141224] text-white">{lang === "hi" ? "पुरुष (Male)" : "Male"}</option>
                  <option value="female" className="bg-[#141224] text-white">{lang === "hi" ? "महिला (Female)" : "Female"}</option>
                  <option value="other" className="bg-[#141224] text-white">{lang === "hi" ? "अन्य (Other)" : "Other"}</option>
                </select>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {lang === "hi" ? "जन्म तिथि (DOB)" : "Date of Birth"}
                </label>
                <input
                  type="date"
                  value={birthData.date}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBirthData({ ...birthData, date: val });
                    saveStoredBirthData({ ...birthData, date: val });
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#141224] border border-white/10 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {lang === "hi" ? "जन्म समय (TOB)" : "Time of Birth (24h)"}
                </label>
                <input
                  type="time"
                  value={birthData.time}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBirthData({ ...birthData, time: val });
                    saveStoredBirthData({ ...birthData, time: val });
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#141224] border border-white/10 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Birthplace Selection */}
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {lang === "hi" ? "जन्म स्थान / शहर" : "Birthplace / City"}
              </label>
              <select
                value={birthData.place}
                onChange={(e) => handleCitySelect(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141224] border border-white/10 text-sm text-white focus:outline-none focus:border-amber-400 mb-2"
              >
                {DEFAULT_CITIES.map((c) => (
                  <option key={c.name} value={c.name} className="bg-[#141224] text-white">
                    {c.name} (UTC {c.tz >= 0 ? `+${c.tz}` : c.tz})
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-3 gap-2 text-[11px] text-stone-400">
                <input
                  type="number"
                  step="0.01"
                  value={birthData.lat}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setBirthData({ ...birthData, lat: val });
                    saveStoredBirthData({ ...birthData, lat: val });
                  }}
                  placeholder="Latitude"
                  title="Latitude"
                  className="px-2.5 py-1.5 rounded-lg bg-[#141224] border border-white/10 text-stone-200"
                />
                <input
                  type="number"
                  step="0.01"
                  value={birthData.lon}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setBirthData({ ...birthData, lon: val });
                    saveStoredBirthData({ ...birthData, lon: val });
                  }}
                  placeholder="Longitude"
                  title="Longitude"
                  className="px-2.5 py-1.5 rounded-lg bg-[#141224] border border-white/10 text-stone-200"
                />
                <input
                  type="number"
                  step="0.5"
                  value={birthData.timezone}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setBirthData({ ...birthData, timezone: val });
                    saveStoredBirthData({ ...birthData, timezone: val });
                  }}
                  placeholder="Timezone"
                  title="Timezone offset"
                  className="px-2.5 py-1.5 rounded-lg bg-[#141224] border border-white/10 text-stone-200"
                />
              </div>
            </div>

            {/* Focus / Question */}
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                {lang === "hi" ? "मुख्य प्रश्न या जीवन क्षेत्र" : "Specific Focus / Question for Consultation"}
              </label>
              <textarea
                rows={2}
                value={birthData.focusArea}
                onChange={(e) => {
                  const val = e.target.value;
                  setBirthData({ ...birthData, focusArea: val });
                  saveStoredBirthData({ ...birthData, focusArea: val });
                }}
                placeholder="e.g. Career growth, marriage compatibility, health advice..."
                className="w-full px-3 py-2 rounded-xl bg-[#141224] border border-white/10 text-sm text-white focus:outline-none focus:border-amber-400 placeholder:text-stone-500 resize-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGenerateAiReading}
              disabled={loadingAi}
              className="flex-1 px-4 py-3 rounded-xl font-bold font-serif text-sm gold-button text-stone-950 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 text-stone-950 ${loadingAi ? "animate-spin" : ""}`} />
              <span>
                {loadingAi
                  ? lang === "hi"
                    ? "ज्योतिष विश्लेषण हो रहा है..."
                    : "Analyzing Chart..."
                  : lang === "hi"
                  ? "विस्तृत कुंडली परामर्श प्राप्त करें"
                  : "Generate Vedic Reading"}
              </span>
            </button>

            <button
              onClick={handleOpen20PageReport}
              className="px-4 py-3 rounded-xl font-bold font-serif text-sm bg-[#171529] hover:bg-[#221f3a] text-stone-200 border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              title={hasPaid ? "Download 20-page full PDF Report" : "Unlock 20-page full PDF Report (₹51)"}
            >
              {hasPaid ? <Download className="w-4 h-4 text-amber-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
              <span>{hasPaid ? (lang === "hi" ? "20 पृष्ठ PDF" : "20-Pg PDF") : (lang === "hi" ? "20 पृष्ठ (₹51)" : "20-Pg (₹51)")}</span>
            </button>
          </div>
        </div>

        {/* Right Highlights: Key Planetary Pillars */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Ascendant */}
            <div className="rounded-2xl bg-[#0e0c1b]/80 border border-white/10 p-4 shadow-lg backdrop-blur-xl">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block font-mono">
                {lang === "hi" ? "लग्न (Ascendant)" : "Ascendant (Lagna)"}
              </span>
              <p className="text-base font-bold text-amber-200 font-serif mt-1">
                {kundali.ascendant.sign}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">{kundali.ascendant.degree}°</p>
            </div>

            {/* Moon Sign */}
            <div className="rounded-2xl bg-[#0e0c1b]/80 border border-white/10 p-4 shadow-lg backdrop-blur-xl">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block font-mono">
                {lang === "hi" ? "चन्द्र राशि (Moon)" : "Moon Sign (Rashi)"}
              </span>
              <p className="text-base font-bold text-amber-200 font-serif mt-1">
                {kundali.moon.sign}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">{kundali.moon.degree}°</p>
            </div>

            {/* Nakshatra */}
            <div className="rounded-2xl bg-[#0e0c1b]/80 border border-white/10 p-4 shadow-lg backdrop-blur-xl">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block font-mono">
                {lang === "hi" ? "नक्षत्र (Nakshatra)" : "Birth Nakshatra"}
              </span>
              <p className="text-base font-bold text-amber-200 font-serif mt-1 truncate">
                {kundali.nakshatra.name}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                Pada {kundali.nakshatra.pada} • {kundali.nakshatra.lord}
              </p>
            </div>

            {/* Active Dasha */}
            <div className="rounded-2xl bg-[#0e0c1b]/80 border border-white/10 p-4 shadow-lg backdrop-blur-xl">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block font-mono">
                {lang === "hi" ? "वर्तमान दशा (Dasha)" : "Active Mahadasha"}
              </span>
              <p className="text-base font-bold text-amber-200 font-serif mt-1">
                {kundali.dasha.currentMahadasha}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">Sub: {kundali.dasha.currentAntardasha}</p>
            </div>
          </div>

          {/* Visual North/South Indian Chart */}
          <KundaliChart
            kundali={kundali}
            title={lang === "hi" ? "लग्न कुण्डली (Lagna Chart D1)" : "Natal Birth Chart (Lagna D1)"}
            lang={lang}
          />
        </div>
      </div>

      {/* Planetary Positions Table (Graha Spashta) & Dosha Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Planetary Table */}
        <div className="lg:col-span-8 rounded-3xl bg-[#0e0c1b]/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold font-serif text-amber-100">
                {lang === "hi" ? "ग्रह स्थिति एवं भाव (Planetary Placements)" : "Planetary Positions & Dignity (Graha Spashta)"}
              </h3>
            </div>
            <span className="text-xs text-stone-400 font-mono">Lahiri Ayanamsha (Chitra Paksha)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-stone-400 font-bold uppercase text-[11px]">
                  <th className="pb-2.5">{lang === "hi" ? "ग्रह" : "Graha"}</th>
                  <th className="pb-2.5">{lang === "hi" ? "राशि" : "Rashi"}</th>
                  <th className="pb-2.5">{lang === "hi" ? "अंश" : "Degree"}</th>
                  <th className="pb-2.5">{lang === "hi" ? "भाव" : "House"}</th>
                  <th className="pb-2.5">{lang === "hi" ? "नक्षत्र" : "Nakshatra"}</th>
                  <th className="pb-2.5">{lang === "hi" ? "अवस्था" : "Dignity"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {kundali.planets.map((p) => (
                  <tr key={p.name} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 font-bold text-white flex items-center gap-1.5">
                      <span className="text-amber-400 font-normal">{p.symbol}</span>
                      <span>{p.name}</span>
                    </td>
                    <td className="py-2.5 text-stone-300">{p.sign}</td>
                    <td className="py-2.5 text-stone-300 font-mono">{p.degree}°</td>
                    <td className="py-2.5 text-amber-300 font-bold">House {p.house}</td>
                    <td className="py-2.5 text-stone-400">{p.nakshatra}</td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          p.dignity === "Exalted"
                            ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                            : p.dignity === "Own Sign"
                            ? "bg-blue-950/60 text-blue-300 border-blue-500/40"
                            : p.dignity === "Debilitated"
                            ? "bg-rose-950/60 text-rose-300 border-rose-500/40"
                            : "bg-[#171529] text-stone-300 border-white/10"
                        }`}
                      >
                        {p.dignity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dosha & Remedial Quick Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl bg-[#0e0c1b]/80 border border-white/10 p-6 shadow-xl space-y-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-bold font-serif text-amber-100">
                {lang === "hi" ? "प्रमुख दोष एवं निवारण" : "Dosha Diagnostics"}
              </h3>
            </div>

            {/* Manglik */}
            <div className="p-3.5 rounded-2xl bg-[#141224] border border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-200">
                  {lang === "hi" ? "मांगलिक स्थिति" : "Mangal Dosha Status"}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    kundali.doshas.mangalDosha
                      ? "bg-rose-950/60 text-rose-300 border-rose-500/40"
                      : "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                  }`}
                >
                  {kundali.doshas.mangalDosha
                    ? lang === "hi"
                      ? "मंगल प्रभाव (परिहार्य)"
                      : "Active"
                    : lang === "hi"
                    ? "दोष रहित"
                    : "No Dosha"}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                {kundali.doshas.mangalDoshaDetails}
              </p>
            </div>

            {/* Sade Sati */}
            <div className="p-3.5 rounded-2xl bg-[#141224] border border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-200">
                  {lang === "hi" ? "शनि साढ़े साती" : "Saturn Sade Sati"}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    kundali.doshas.sadeSati.active
                      ? "bg-amber-950/60 text-amber-300 border-amber-500/40"
                      : "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                  }`}
                >
                  {kundali.doshas.sadeSati.active
                    ? `${kundali.doshas.sadeSati.phase} Phase`
                    : lang === "hi"
                    ? "वर्तमान में शांत"
                    : "Inactive"}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                {kundali.doshas.sadeSati.description}
              </p>
            </div>

            {/* Gemstone Recommendation */}
            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                <Gem className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === "hi" ? "शुभ रत्न परामर्श" : "Auspicious Gemstone"}</span>
              </div>
              <p className="text-xs font-bold text-amber-100">
                {kundali.gemstoneRecommendation.primary} ({kundali.gemstoneRecommendation.finger})
              </p>
              <p className="text-[11px] text-stone-400">
                Metal: {kundali.gemstoneRecommendation.metal} • Day: {kundali.gemstoneRecommendation.day}
              </p>
            </div>

            <button
              onClick={handleOpen20PageReport}
              className="w-full py-2.5 rounded-xl gold-button text-stone-950 font-serif font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer active:scale-95"
            >
              {hasPaid ? <FileText className="w-4 h-4 text-stone-950" /> : <Lock className="w-4 h-4 text-stone-950" />}
              <span>
                {hasPaid
                  ? lang === "hi"
                    ? "विस्तृत 20 पृष्ठीय कुंडली देखें"
                    : "View Full 20-Page Report"
                  : lang === "hi"
                  ? "20 पृष्ठीय कुंडली अनलॉक करें (₹51)"
                  : "Unlock 20-Page Report (₹51)"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Deep Reading Card if generated */}
      {aiReading && (
        <div className="rounded-3xl bg-[#0e0c1b]/90 border border-amber-500/30 p-6 sm:p-8 shadow-xl space-y-4 backdrop-blur-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold font-serif text-amber-100">
              {lang === "hi" ? "पूज्य ज्योतिषाचार्य • व्यक्तिगत फलकथन व मार्गदर्शन" : "Jyotish Acharya • Personalized Life Reading"}
            </h3>
          </div>
          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-stone-200 leading-relaxed whitespace-pre-wrap">
            {aiReading}
          </div>
        </div>
      )}

      {/* 20-Page Full Certified Kundali Modal */}
      <Full20PageKundaliModal
        isOpen={is20PageModalOpen}
        onClose={() => setIs20PageModalOpen(false)}
        kundali={kundali}
        birthData={birthData}
        initialLang={lang}
      />

      {/* Payment Modal for ₹51 Dakshina */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={() => {
          setIsPaymentModalOpen(false);
          setIs20PageModalOpen(true);
        }}
        lang={lang}
        userName={birthData.name}
      />
    </div>
  );
};
