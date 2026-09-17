import React, { useState } from "react";
import { KundaliResult, BirthData, Language } from "../types";
import { Download, Printer, Sparkles, Shield, Compass, HeartHandshake, Briefcase, Heart, Activity, Gem, CheckCircle2, FileText } from "lucide-react";
import { Full20PageKundaliModal } from "./Full20PageKundaliModal";
import { DiamondKundaliSvg } from "./DiamondKundaliSvg";

interface ChatKundaliWidgetProps {
  kundali: KundaliResult;
  birthData: BirthData;
  lang: Language;
  onOpenPrintModal?: () => void;
}

export const ChatKundaliWidget: React.FC<ChatKundaliWidgetProps> = ({
  kundali,
  birthData,
  lang,
}) => {
  const [isFull20ModalOpen, setIsFull20ModalOpen] = useState(false);

  return (
    <div className="w-full my-4 rounded-3xl bg-[#0e0c1b]/95 border border-amber-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)] p-5 sm:p-7 text-stone-200 space-y-6 backdrop-blur-xl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl gold-button text-stone-950 flex items-center justify-center font-bold shadow-md">
            <Sparkles className="w-5 h-5 text-stone-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-serif font-bold text-base sm:text-lg text-amber-100">
                {lang === "hi" ? "संपूर्ण वैदिक जन्म कुंडली व महाज्योतिषी समाधान" : "Full Vedic Janam Kundali & Remedies"}
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase bg-emerald-950/70 text-emerald-300 border border-emerald-500/40">
                {lang === "hi" ? "अनलॉकड (₹51)" : "UNLOCKED (₹51)"}
              </span>
            </div>
            <p className="text-xs text-stone-400">
              {birthData.name || (lang === "hi" ? "साधक" : "Seeker")} • {birthData.date} • {birthData.place || "Custom"}
            </p>
          </div>
        </div>

        {/* Action Buttons: 20-Page PDF Download & Print */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFull20ModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl gold-button text-stone-950 font-serif font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4 text-stone-950" />
            <span>{lang === "hi" ? "20 पृष्ठीय PDF कुंडली" : "20-Page PDF Kundali"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFull20ModalOpen(true)}
            title={lang === "hi" ? "प्रिंट एवं पूर्ण कुंडली दृश्य" : "Print & Complete Kundali View"}
            className="p-2 rounded-xl bg-[#171529] border border-white/10 text-stone-300 hover:text-white hover:bg-[#201d36] transition-all cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Interactive Visual North Indian Diamond Chart in Chat */}
      <div className="p-4 rounded-2xl bg-[#141224]/80 border border-white/10 flex flex-col md:flex-row items-center justify-around gap-6 shadow-inner">
        <div className="flex flex-col items-center">
          <span className="text-xs font-serif font-bold text-amber-300 mb-1">
            {lang === "hi" ? "लग्न कुंडली चक्र (D-1 Rashi Chart)" : "Lagna Kundali (D-1 Rashi Chart)"}
          </span>
          <DiamondKundaliSvg kundali={kundali} chartType="lagna" lang={lang} size={280} />
        </div>

        <div className="space-y-2.5 max-w-md text-xs sm:text-sm">
          <div className="p-3.5 rounded-xl bg-[#1b1830] border border-amber-500/20">
            <span className="text-[10px] font-bold text-amber-400 uppercase font-mono tracking-wider block">
              {lang === "hi" ? "लग्न एवं राशि गणना:" : "Core Coordinates:"}
            </span>
            <div className="grid grid-cols-2 gap-2 mt-1.5 text-xs text-stone-300">
              <div>{lang === "hi" ? "लग्न:" : "Lagna:"} <strong className="text-amber-200">{kundali.ascendant.sign} ({kundali.ascendant.degree}°)</strong></div>
              <div>{lang === "hi" ? "चंद्र राशि:" : "Moon:"} <strong className="text-amber-200">{kundali.moon.sign} ({kundali.moon.degree}°)</strong></div>
              <div>{lang === "hi" ? "नक्षत्र:" : "Nakshatra:"} <strong className="text-white">{kundali.nakshatra.name} (Pada {kundali.nakshatra.pada})</strong></div>
              <div>{lang === "hi" ? "महादशा:" : "Dasha:"} <strong className="text-amber-300">{kundali.dasha.currentMahadasha}</strong></div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1b1830] border border-amber-500/20">
            <span className="text-[10px] font-bold text-amber-400 uppercase font-mono tracking-wider block">
              {lang === "hi" ? "दोष एवं ग्रह शांति स्थिति:" : "Dosha Status:"}
            </span>
            <div className="flex flex-wrap gap-2 mt-1.5">
              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                kundali.doshas.mangalDosha
                  ? "bg-amber-950/60 text-amber-300 border-amber-500/40"
                  : "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
              }`}>
                {kundali.doshas.mangalDosha ? (lang === "hi" ? "मंगल प्रभाव (परिहार्य)" : "Mangal Active") : (lang === "hi" ? "मांगलिक दोष रहित" : "Non-Manglik")}
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                kundali.doshas.sadeSati.active
                  ? "bg-amber-950/60 text-amber-300 border-amber-500/40"
                  : "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
              }`}>
                {kundali.doshas.sadeSati.active ? (lang === "hi" ? `साढ़े साती (${kundali.doshas.sadeSati.phase})` : `Sade Sati (${kundali.doshas.sadeSati.phase})`) : (lang === "hi" ? "साढ़े साती मुक्त" : "Sade Sati Free")}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsFull20ModalOpen(true)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600/20 to-purple-600/20 hover:from-amber-600/30 hover:to-purple-600/30 border border-amber-500/40 text-amber-200 font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>{lang === "hi" ? "संपूर्ण 20 पृष्ठ कुंडली विस्तार से देखें" : "View Complete 20 Pages in Detail"}</span>
          </button>
        </div>
      </div>

      {/* 3 Core Life Answers & Obstacle Remedies */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h5 className="font-serif font-bold text-base text-amber-100">
            {lang === "hi" ? "3 मुख्य प्रश्नों / बाधाओं का समाधान एवं महाज्योतिषी उपाय" : "3 Core Obstacle Diagnoses & MahaJyotishi Upayas"}
          </h5>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Answer 1: Career & Wealth */}
          <div className="p-4 rounded-2xl bg-[#141224]/90 border border-amber-500/20 space-y-2 shadow-md">
            <div className="flex items-center gap-2 text-amber-300">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span className="font-serif font-bold text-sm">
                {lang === "hi" ? "1. आजीविका, करियर व आर्थिक उन्नति" : "1. Career, Job & Wealth"}
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              {lang === "hi"
                ? `दशमेश एवं वर्तमान ${kundali.dasha.currentMahadasha} महादशा के कारण कार्यक्षेत्र में स्थायित्व व नए अवसर बनेंगे। तकनीकी, वाणिज्यिक अथवा प्रबंधन क्षेत्र में निवेश सर्वाधिक फलदायी रहेगा।`
                : `10th house alignments and ${kundali.dasha.currentMahadasha} Mahadasha favor leadership, stable income streams, and analytical decision-making.`}
            </p>
          </div>

          {/* Answer 2: Love & Marriage */}
          <div className="p-4 rounded-2xl bg-[#141224]/90 border border-rose-500/20 space-y-2 shadow-md">
            <div className="flex items-center gap-2 text-rose-300">
              <Heart className="w-4 h-4 text-rose-400" />
              <span className="font-serif font-bold text-sm">
                {lang === "hi" ? "2. विवाह का समय एवं दांपत्य सामंजस्य" : "2. Marriage Timing & Spouse"}
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              {lang === "hi"
                ? "सप्तम भाव में शुभ दृष्टि वैवाहिक विलंब को दूर करने का संकेत देती है। जीवनसाथी संस्कारी, सहयोगी एवं परिवार का आदर करने वाला होगा। शुक्रवार को सफेद वस्तुओं का दान दांपत्य में मिठास लाएगा।"
                : "7th house aspects indicate clearing delays. Spouse will be intellectually supportive and values-driven. White offerings on Friday harmonize Venus."}
            </p>
          </div>

          {/* Answer 3: Health & Peace */}
          <div className="p-4 rounded-2xl bg-[#141224]/90 border border-emerald-500/20 space-y-2 shadow-md">
            <div className="flex items-center gap-2 text-emerald-300">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="font-serif font-bold text-sm">
                {lang === "hi" ? "3. स्वास्थ्य, मानसिक शांति व दोष निवारण" : "3. Health & Mental Harmony"}
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              {lang === "hi"
                ? `अनुकूल रत्न: ${kundali.gemstoneRecommendation.primary} (${kundali.gemstoneRecommendation.finger} में ${kundali.gemstoneRecommendation.metal} में धारण करें)। महामृत्युंजय मंत्र अथवा गायत्री मंत्र का नित्य जप समस्त विघ्नों का शमन करेगा।`
                : `Recommended Gemstone: ${kundali.gemstoneRecommendation.primary} in ${kundali.gemstoneRecommendation.metal}. Daily chants of Mahamrityunjaya Mantra provide vital inner tranquility.`}
            </p>
          </div>
        </div>

        {/* Subtle connector indicating live consultation continues right below */}
        <div className="pt-3 flex items-center justify-center gap-2 text-xs font-serif font-medium text-amber-300/90 border-t border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>
            {lang === "hi"
              ? "👇 आचार्य जी द्वारा आपके प्रश्नों का लाइव समाधान व बातचीत नीचे प्रस्तुत है:"
              : "👇 Live consultation and detailed replies from Acharya continue below:"}
          </span>
        </div>
      </div>

      {/* Modal instance for full 20 pages */}
      <Full20PageKundaliModal
        isOpen={isFull20ModalOpen}
        onClose={() => setIsFull20ModalOpen(false)}
        kundali={kundali}
        birthData={birthData}
        initialLang={lang}
      />
    </div>
  );
};
