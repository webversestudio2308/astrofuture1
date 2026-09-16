import React from "react";
import { KundaliResult, BirthData, Language } from "../types";
import { X, Printer, Download, Sparkles } from "lucide-react";
import { generateKundaliPDF } from "../utils/pdfGenerator";

interface PrintKundaliModalProps {
  isOpen: boolean;
  onClose: () => void;
  kundali: KundaliResult;
  birthData: BirthData;
  lang: Language;
}

export const PrintKundaliModal: React.FC<PrintKundaliModalProps> = ({
  isOpen,
  onClose,
  kundali,
  birthData,
  lang,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl p-6 sm:p-8 text-slate-100 max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-lg text-amber-300">
              {lang === "hi" ? "संपूर्ण जन्म कुंडली प्रिंट व प्रमाण पत्र दृश्य" : "Certified Vedic Kundali Certificate"}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === "hi" ? "प्रिंट करें" : "Print View"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6 text-xs sm:text-sm text-slate-300 print:text-black print:bg-white">
          {/* Certificate Header Banner */}
          <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-950 to-indigo-950/40 border border-amber-500/30">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-mono">
              ASTROFUTURE VEDIC JYOTISH REPORT
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 mt-1">
              श्री वैदिक जन्म कुंडली
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              लाहिरी अयनांश • निरयण स्पष्ट ग्रह गणना • पराशरी पद्धति
            </p>
          </div>

          {/* Native Details Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-[10px] text-slate-500 block">नाम / Name</span>
              <span className="font-bold text-slate-200">{birthData.name || "Seeker"}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">जन्म तिथि / Date</span>
              <span className="font-bold text-slate-200">{birthData.date}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">जन्म समय / Time</span>
              <span className="font-bold text-slate-200">{birthData.time}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">जन्म स्थान / Place</span>
              <span className="font-bold text-slate-200">{birthData.place || "Custom"}</span>
            </div>
          </div>

          {/* Core Coordinates Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">लग्न / Ascendant</span>
              <span className="font-bold text-amber-300 font-serif">{kundali.ascendant.sign} ({kundali.ascendant.degree}°)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">चंद्र राशि / Moon Sign</span>
              <span className="font-bold text-amber-300 font-serif">{kundali.moon.sign} ({kundali.moon.degree}°)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">नक्षत्र / Nakshatra</span>
              <span className="font-bold text-slate-200">{kundali.nakshatra.name} (Pada {kundali.nakshatra.pada})</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">वर्तमान महादशा</span>
              <span className="font-bold text-amber-400 font-mono">{kundali.dasha.currentMahadasha} Mahadasha</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">मंगल दोष</span>
              <span className="font-bold text-slate-200">{kundali.doshas.mangalDosha ? "Detected" : "None"}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">साढ़े साती</span>
              <span className="font-bold text-slate-200">{kundali.doshas.sadeSati.active ? kundali.doshas.sadeSati.phase : "Inactive"}</span>
            </div>
          </div>

          {/* Planetary Table */}
          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-mono text-[10px]">
                <tr>
                  <th className="p-2.5">ग्रह / Planet</th>
                  <th className="p-2.5">राशि / Sign</th>
                  <th className="p-2.5">अंश / Degree</th>
                  <th className="p-2.5">भाव / House</th>
                  <th className="p-2.5">नक्षत्र व स्वामी</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {kundali.planets.map((p) => (
                  <tr key={p.name}>
                    <td className="p-2.5 font-bold text-slate-200">{p.name} {p.sanskritName}</td>
                    <td className="p-2.5">{p.sign}</td>
                    <td className="p-2.5 font-mono text-slate-400">{p.degree}°</td>
                    <td className="p-2.5 font-mono text-amber-400 font-bold">House {p.house}</td>
                    <td className="p-2.5 text-slate-400">{p.nakshatra} ({p.nakshatraLord})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Gemstone and Upaya Box */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <h4 className="font-serif font-bold text-amber-300 text-sm">
              💎 मुख्य वैदिक रत्न एवं महामंत्र परामर्श
            </h4>
            <p className="text-xs text-slate-300">
              <strong>शुभ रत्न:</strong> {kundali.gemstoneRecommendation.primary} ({kundali.gemstoneRecommendation.sanskritName}) • <strong>धातु:</strong> {kundali.gemstoneRecommendation.metal} • <strong>अंगुली:</strong> {kundali.gemstoneRecommendation.finger}
            </p>
            <p className="text-xs text-amber-400 font-mono">
              <strong>दैनिक बीज मंत्र:</strong> "{kundali.gemstoneRecommendation.mantra}"
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3 shrink-0">
          <button
            onClick={() => generateKundaliPDF(birthData, kundali)}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download A4 PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
