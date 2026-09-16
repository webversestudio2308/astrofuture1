import React, { useState, useEffect } from "react";
import { BirthData, Language } from "../types";
import { X, Calendar, Clock, MapPin, User, Sparkles, Compass, CheckCircle2 } from "lucide-react";
import { saveStoredBirthData } from "../utils/birthStore";

interface BirthDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  birthData: BirthData;
  onSave: (data: BirthData) => void;
  lang: Language;
}

const POPULAR_CITIES = [
  { name: "नई दिल्ली (New Delhi)", lat: 28.6139, lon: 77.209, tz: 5.5 },
  { name: "मुंबई (Mumbai)", lat: 19.076, lon: 72.8777, tz: 5.5 },
  { name: "वाराणसी (Varanasi)", lat: 25.3176, lon: 82.9739, tz: 5.5 },
  { name: "बेंगलुरु (Bengaluru)", lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { name: "कोलकाता (Kolkata)", lat: 22.5726, lon: 88.3639, tz: 5.5 },
  { name: "जयपुर (Jaipur)", lat: 26.9124, lon: 75.7873, tz: 5.5 },
  { name: "लखनऊ (Lucknow)", lat: 26.8467, lon: 80.9462, tz: 5.5 },
  { name: "अहमदाबाद (Ahmedabad)", lat: 23.0225, lon: 72.5714, tz: 5.5 },
  { name: "London, UK", lat: 51.5074, lon: -0.1278, tz: 0 },
  { name: "New York, USA", lat: 40.7128, lon: -74.006, tz: -5 },
  { name: "Dubai, UAE", lat: 25.2048, lon: 55.2708, tz: 4 },
];

export const BirthDetailsModal: React.FC<BirthDetailsModalProps> = ({
  isOpen,
  onClose,
  birthData,
  onSave,
  lang,
}) => {
  const [formData, setFormData] = useState<BirthData>(birthData);

  useEffect(() => {
    setFormData(birthData);
  }, [birthData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredBirthData(formData);
    onSave(formData);
    onClose();
  };

  const handleCitySelect = (city: typeof POPULAR_CITIES[0]) => {
    setFormData((prev) => ({
      ...prev,
      place: city.name,
      lat: city.lat,
      lon: city.lon,
      timezone: city.tz,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0e0c1b] border border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-6 sm:p-8 text-stone-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl gold-button flex items-center justify-center text-stone-950 shadow-md">
              <Compass className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-amber-100">
                {lang === "hi" ? "जन्म विवरण प्रपत्र (Birth Details)" : "Vedic Birth Details Form"}
              </h3>
              <p className="text-xs text-stone-400">
                {lang === "hi"
                  ? "सटीक जन्म कुंडली, लग्न व ग्रह दशा गणना हेतु आवश्यक"
                  : "Required for high-precision Nirayana sidereal calculation"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs sm:text-sm">
          {/* Name & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-medium text-stone-300 mb-1">
                {lang === "hi" ? "पूरा नाम (Full Name) *" : "Full Name *"}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder={lang === "hi" ? "उदा. राहुल वर्मा" : "e.g. Rahul Verma"}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/15 bg-[#141224] focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-white placeholder:text-stone-500 transition-all font-medium text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-stone-300 mb-1">
                {lang === "hi" ? "लिंग (Gender)" : "Gender"}
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-xl border border-white/15 bg-[#141224] focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-white transition-all font-medium text-sm"
              >
                <option value="male" className="bg-[#141224] text-white">{lang === "hi" ? "पुरुष (Male)" : "Male"}</option>
                <option value="female" className="bg-[#141224] text-white">{lang === "hi" ? "स्त्री (Female)" : "Female"}</option>
                <option value="other" className="bg-[#141224] text-white">{lang === "hi" ? "अन्य (Other)" : "Other"}</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-medium text-stone-300 mb-1">
                {lang === "hi" ? "जन्म तिथि (Date of Birth) *" : "Date of Birth *"}
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/15 bg-[#141224] focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-white transition-all font-medium text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-stone-300 mb-1">
                {lang === "hi" ? "जन्म समय (Time of Birth) *" : "Time of Birth *"}
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/15 bg-[#141224] focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-white transition-all font-medium text-sm"
                />
              </div>
            </div>
          </div>

          {/* Birth Place */}
          <div>
            <label className="block font-medium text-stone-300 mb-1">
              {lang === "hi" ? "जन्म स्थान (Birth Place) *" : "Birth Place *"}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder={lang === "hi" ? "उदा. नई दिल्ली, भारत" : "e.g. New Delhi, India"}
                value={formData.place}
                onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/15 bg-[#141224] focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-white placeholder:text-stone-500 transition-all font-medium text-sm"
              />
            </div>
          </div>

          {/* Quick City Selection */}
          <div>
            <span className="text-[11px] font-semibold text-stone-400 block mb-1.5">
              {lang === "hi" ? "प्रमुख नगरों में से चुनें:" : "Or select popular city:"}
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 rounded-xl bg-[#141224] border border-white/10">
              {POPULAR_CITIES.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => handleCitySelect(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    formData.place.includes(c.name.split(" ")[0])
                      ? "bg-amber-500 text-stone-950 font-bold shadow-sm"
                      : "bg-[#1c1933] text-stone-300 hover:bg-[#252145] border border-white/10"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Focus Area */}
          <div>
            <label className="block font-medium text-stone-300 mb-1">
              {lang === "hi" ? "मुख्य जिज्ञासा / प्रश्न क्षेत्र (Focus Area)" : "Primary Focus Area"}
            </label>
            <input
              type="text"
              placeholder={
                lang === "hi"
                  ? "उदा. करियर, विवाह का समय, आर्थिक उन्नति, स्वास्थ्य"
                  : "e.g. Career growth, marriage timing, financial stability"
              }
              value={formData.focusArea || ""}
              onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#141224] focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-white placeholder:text-stone-500 transition-all font-medium text-sm"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-stone-300 hover:bg-white/5 font-medium text-xs sm:text-sm cursor-pointer transition-colors"
            >
              {lang === "hi" ? "रद्द करें" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl gold-button text-stone-950 font-serif font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-stone-950" />
              <span>{lang === "hi" ? "जन्म विवरण सहेजें एवं कुंडली बनाएं" : "Save & Generate Kundali"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
