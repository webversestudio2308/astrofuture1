import React, { useState, useRef } from "react";
import { BirthData, KundaliResult, Language } from "../types";
import {
  X,
  Printer,
  Download,
  Sparkles,
  Compass,
  FileText,
  ShieldCheck,
  Award,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Gem,
  AlertTriangle,
  Flame,
  Globe,
  Lock,
} from "lucide-react";
import { buildKundali20PageData } from "../utils/kundali20PageData";
import { DiamondKundaliSvg } from "./DiamondKundaliSvg";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";
import { useKundaliPayment } from "../utils/paymentStore";
import { PaymentModal } from "./PaymentModal";

interface Full20PageKundaliModalProps {
  isOpen: boolean;
  onClose: () => void;
  kundali: KundaliResult;
  birthData: BirthData;
  initialLang?: Language;
}

export const Full20PageKundaliModal: React.FC<Full20PageKundaliModalProps> = ({
  isOpen,
  onClose,
  kundali,
  birthData,
  initialLang = "hi",
}) => {
  // Modal has its own explicit language selector as requested by user
  const [docLang, setDocLang] = useState<Language>(initialLang);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfProgress, setPdfProgress] = useState<number>(0);
  const [currentRenderingPage, setCurrentRenderingPage] = useState<number>(1);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);

  const { hasPaid } = useKundaliPayment();
  const printContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const data = buildKundali20PageData(birthData, kundali);
  const isHi = docLang === "hi";

  // Handle high-resolution 20-page PDF generation via html2canvas & jsPDF with fast rendering
  const handleDownload20PagePdf = async () => {
    if (!hasPaid) {
      setIsPaymentModalOpen(true);
      return;
    }

    if (!printContainerRef.current) return;
    setIsGeneratingPdf(true);
    setPdfProgress(0);

    try {
      const pageElements = printContainerRef.current.querySelectorAll(".kundali-a4-page");
      if (!pageElements.length) {
        window.print();
        setIsGeneratingPdf(false);
        return;
      }

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const total = pageElements.length;

      for (let i = 0; i < total; i++) {
        setCurrentRenderingPage(i + 1);
        setPdfProgress(Math.round(((i + 1) / total) * 100));

        const elem = pageElements[i] as HTMLElement;
        const canvas = await html2canvas(elem, {
          scale: 1.25,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: 794,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.88);
        if (i > 0) {
          doc.addPage("a4", "portrait");
        }
        doc.addImage(imgData, "JPEG", 0, 0, 210, 297);
      }

      const safeName = birthData.name ? birthData.name.trim().replace(/\s+/g, "_") : "Janam";
      const fileName = `${safeName}_Kundali_20_Pages_${docLang.toUpperCase()}.pdf`;

      // Safe download with anchor blob trigger to prevent iframe restrictions
      try {
        const pdfBlob = doc.output("blob");
        const blobUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      } catch {
        doc.save(fileName);
      }
    } catch (err) {
      console.error("PDF generation encountered issue, invoking browser print fallback", err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    if (!hasPaid) {
      setIsPaymentModalOpen(true);
      return;
    }
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#0e0c1b] border border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-4 sm:p-6 md:p-8 text-stone-200 max-h-[94vh] flex flex-col">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 shadow-md">
              <Compass className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-extrabold text-base sm:text-lg text-amber-100">
                  {isHi ? "श्री बृहत् वैदिक महाकुंडली (20 पृष्ठ)" : "Brihat Vedic MahaKundali (20 Pages)"}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  20 PAGES
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {birthData.name || (isHi ? "साधक" : "Seeker")} • {birthData.date} • {birthData.place}
              </p>
            </div>
          </div>

          {/* Language Toggle & Download Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Language Selector: Hindi / English */}
            <div className="flex items-center rounded-xl bg-[#141224] border border-white/10 p-1">
              <button
                onClick={() => setDocLang("hi")}
                className={`px-3 py-1 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                  isHi
                    ? "bg-amber-500 text-stone-950 shadow-xs"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                हिन्दी (Hindi)
              </button>
              <button
                onClick={() => setDocLang("en")}
                className={`px-3 py-1 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                  !isHi
                    ? "bg-amber-500 text-stone-950 shadow-xs"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                English
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-[#171529] border border-white/10 text-stone-300 font-semibold text-xs hover:bg-[#201d36] transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
              title={
                !hasPaid
                  ? isHi
                    ? "20 पृष्ठ प्रिंट हेतु ₹51 दक्षिणा आवश्यक"
                    : "Sacred ₹51 Dakshina required to print"
                  : isHi
                  ? "प्रिंट अथवा तुरंत PDF सेव करें"
                  : "Print or Instant Save as PDF"
              }
            >
              {hasPaid ? <Printer className="w-3.5 h-3.5 text-amber-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
              <span className="hidden sm:inline">{isHi ? "प्रिंट / सेव PDF" : "Print / PDF"}</span>
            </button>

            {/* Download 20-Page PDF Button */}
            <button
              onClick={handleDownload20PagePdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 rounded-xl gold-button text-stone-950 font-serif font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {hasPaid ? <Download className="w-4 h-4 text-stone-950" /> : <Lock className="w-4 h-4 text-stone-950" />}
              <span>
                {!hasPaid
                  ? isHi
                    ? "₹51 भुगतान करें (PDF डाउनलोड)"
                    : "Pay ₹51 to Download PDF"
                  : isGeneratingPdf
                  ? isHi
                    ? `तैयार हो रहा है (${pdfProgress}%)...`
                    : `Generating (${pdfProgress}%)...`
                  : isHi
                  ? "डाउनलोड 20-पृष्ठीय रंगीन PDF"
                  : "Download 20-Page PDF"}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar when generating PDF */}
        {isGeneratingPdf && (
          <div className="py-2.5 px-4 bg-amber-50 border-b border-amber-200 rounded-xl my-2 flex items-center justify-between text-xs text-amber-900">
            <span className="font-semibold">
              {isHi
                ? `पृष्ठ ${currentRenderingPage} / 20 उच्च-गुणवत्ता A4 रेंडर हो रहा है...`
                : `Rendering Page ${currentRenderingPage} of 20 high-res A4...`}
            </span>
            <span className="font-mono font-bold">{pdfProgress}%</span>
          </div>
        )}

        {/* Direct Download & Overview Header Banner */}
        <div className="py-3 px-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0 my-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 text-stone-950 flex items-center justify-center font-bold font-serif text-sm shadow-sm">
              20
            </div>
            <div>
              <p className="font-serif font-bold text-amber-100 text-sm sm:text-base flex items-center gap-2">
                <span>{isHi ? "सम्पूर्ण 20-पृष्ठीय रंगीन वैदिक महाकुंडली" : "Complete 20-Page Color Vedic MahaKundali"}</span>
                {!hasPaid && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-950/80 border border-rose-500/40 text-rose-300 font-mono flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    {isHi ? "लॉक है (₹51 दक्षिणा)" : "Locked (₹51)"}
                  </span>
                )}
              </p>
              <p className="text-stone-400 text-xs">
                {!hasPaid
                  ? isHi
                    ? "आपकी संपूर्ण 20 पृष्ठीय जन्म कुंडली, दशा व उपाय तैयार हैं। पूर्ण PDF डाउनलोड करने के लिए ₹51 दक्षिणा पूर्ण करें।"
                    : "Your full 20-page Janam Kundali is calculated. Complete ₹51 sacred Dakshina to download full PDF and unlock all pages."
                  : isHi
                  ? "सभी 20 पृष्ठ नीचे सम्मिलित हैं। नीचे दिए गए बटन से सीधे पूरी PDF डाउनलोड करें।"
                  : "All 20 comprehensive pages are sequenced below. Download the complete PDF report directly."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownload20PagePdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2.5 rounded-xl gold-button text-stone-950 font-serif font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {hasPaid ? <Download className="w-4 h-4 text-stone-950" /> : <Lock className="w-4 h-4 text-stone-950" />}
              <span>
                {!hasPaid
                  ? isHi
                    ? "₹51 भुगतान करें एवं 20 पृष्ठ अनलॉक करें"
                    : "Pay ₹51 & Unlock 20 Pages"
                  : isGeneratingPdf
                  ? isHi
                    ? `PDF तैयार हो रही है (${pdfProgress}%)...`
                    : `Generating PDF (${pdfProgress}%)...`
                  : isHi
                  ? "सीधे सम्पूर्ण PDF डाउनलोड करें"
                  : "Download Complete 20-Page PDF"}
              </span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl bg-[#171529] border border-white/10 text-stone-300 font-semibold text-xs hover:bg-[#201d36] transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {hasPaid ? <Printer className="w-3.5 h-3.5 text-amber-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isHi ? "प्रिंट / सेव PDF" : "Print / PDF"}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* ALL 20 PAGES WRAPPER (Styled for A4 Print & Canvas Rendering) */}
          <div ref={printContainerRef} className="space-y-8 flex flex-col items-center">
            {/* Render each of the 20 pages */}
            {Array.from({ length: 20 }).map((_, idx) => {
              const pageNumber = idx + 1;
              const isLocked = pageNumber > 2 && !hasPaid;

              return (
                <div
                  key={pageNumber}
                  id={`page-${pageNumber}`}
                  className="kundali-a4-page w-full max-w-[794px] min-h-[1050px] bg-white border border-stone-300 rounded-2xl shadow-md p-8 flex flex-col justify-between print:border-none print:shadow-none print:rounded-none print:m-0 print:p-8"
                  style={{ pageBreakAfter: "always" }}
                >
                  {/* Outer Golden Vedic Border */}
                  <div className="h-full flex flex-col justify-between border-2 border-amber-600/60 rounded-xl p-6 relative">
                    {/* Corner Sacred Symbols */}
                    <span className="absolute -top-3 -left-2 text-xs font-serif font-bold text-amber-700 bg-white px-1">卐</span>
                    <span className="absolute -top-3 -right-2 text-xs font-serif font-bold text-amber-700 bg-white px-1">ॐ</span>
                    <span className="absolute -bottom-3 -left-2 text-xs font-serif font-bold text-amber-700 bg-white px-1">ॐ</span>
                    <span className="absolute -bottom-3 -right-2 text-xs font-serif font-bold text-amber-700 bg-white px-1">卐</span>

                    {/* Top Page Header */}
                    <div className="text-center pb-4 border-b border-stone-200">
                      <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 uppercase tracking-wider mb-1">
                        <span>ASTROFUTURE VEDIC SANCTUARY</span>
                        <span>{isHi ? "श्री बृहत् पराशर महाकुंडली" : "Brihat Parashari MahaKundali"}</span>
                        <span>PAGE {pageNumber} OF 20</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-stone-900 tracking-wide">
                        {getPageTitle(pageNumber, isHi)}
                      </h2>
                      <p className="text-xs text-amber-900 font-serif font-semibold mt-0.5">
                        {getPageSubtitle(pageNumber, isHi)}
                      </p>
                    </div>

                    {/* Page Content Body */}
                    <div className="flex-1 py-4 text-stone-800 text-xs sm:text-sm flex flex-col">
                      {isLocked ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 my-auto bg-stone-50/90 rounded-2xl border-2 border-dashed border-amber-300">
                          <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center shadow-md">
                            <Lock className="w-7 h-7 text-amber-800" />
                          </div>
                          <div className="space-y-1.5 max-w-md">
                            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                              {isHi ? `पृष्ठ संख्या ${pageNumber} • सुरक्षित व गोपनीय` : `Page ${pageNumber} • Sacred Confidential`}
                            </span>
                            <h4 className="text-lg font-serif font-bold text-stone-900">
                              {getPageTitle(pageNumber, isHi)}
                            </h4>
                            <p className="text-xs text-stone-600 leading-relaxed">
                              {isHi
                                ? "यह संपूर्ण वैदिक अध्याय (विंशोत्तरी दशा, अष्टकवर्ग, साढ़े साती, कालसर्प-मांगलिक दोष, रत्न परामर्श व 10-वर्षीय भविष्यफल) ₹51 दक्षिणा के उपरांत अनलॉक होगा।"
                                : "This complete chapter (Vimshottari Dasha, Sade Sati, planetary remedies, and 10-year life horizon) unlocks upon completing sacred ₹51 Dakshina."}
                            </p>
                          </div>
                          <button
                            onClick={() => setIsPaymentModalOpen(true)}
                            className="px-5 py-2.5 rounded-xl gold-button text-stone-950 font-serif font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                          >
                            <Lock className="w-3.5 h-3.5 text-stone-950" />
                            <span>{isHi ? "₹51 भुगतान करें एवं 20 पृष्ठ अनलॉक करें" : "Pay ₹51 & Unlock All 20 Pages"}</span>
                          </button>
                        </div>
                      ) : (
                        renderPageContent(pageNumber, data, isHi)
                      )}
                    </div>

                    {/* Bottom Page Footer */}
                    <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-[10px] text-stone-500">
                      <span>
                        {birthData.name || (isHi ? "साधक" : "Seeker")} • {birthData.date} • {kundali.ascendant.sign} Lagna
                      </span>
                      <span className="font-serif italic text-amber-800">
                        {isHi ? "॥ शुभम भवतु • कल्याणमस्तु ॥" : "May Cosmic Grace Illumine Thy Path"}
                      </span>
                      <span className="font-mono font-bold text-stone-700">Page {pageNumber} / 20</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Embedded Payment Modal */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={() => {
            setIsPaymentModalOpen(false);
          }}
          lang={docLang}
        />
      </div>
    </div>
  );
};

// Helper: Page Titles
function getPageTitle(pageNum: number, isHi: boolean): string {
  const titlesHi = [
    "मंगलाचरण एवं जातक जन्म विवरण",
    "लग्न कुंडली चक्र (D-1 Rashi Chart)",
    "नवमांश कुंडली चक्र (D-9 Navamsha Chart)",
    "चंद्र कुंडली एवं भाव चलित चक्र",
    "निरयण स्पष्ट ग्रह स्थिति सारणी",
    "द्वादश भाव विस्तृत विचार एवं दृष्टि संबंध",
    "सर्वाष्टकवर्ग चक्र एवं सामर्थ्य सारणी",
    "विंशोत्तरी महादशा संपूर्ण कालक्रम (120 वर्ष)",
    "वर्तमान महादशा एवं अंतर्दशा सूक्ष्म फल",
    "प्रत्यंतर्दशा एवं प्रमुख ग्रह गोचर प्रभाव",
    "शनि साढ़े साती एवं ढैया संपूर्ण विवेचन",
    "मांगलिक दोष एवं कुज परिहार विचार",
    "कालसर्प दोष एवं पितृ दोष विश्लेषण",
    "आजीविका, कर्मक्षेत्र एवं धन योग",
    "प्रेम, विवाह, जीवनसाथी एवं दांपत्य सुख",
    "स्वास्थ्य, त्रिदोष प्रकृति एवं दीर्घायु विचार",
    "अनुकूल शुभ रत्न एवं प्राण-प्रतिष्ठा धारण विधि",
    "अनुकूल रुद्राक्ष, यंत्र एवं नवग्रह बीज मंत्र",
    "लाल किताब एवं पारंपरिक अचूक उपाय",
    "आगामी 5-10 वर्षों का भविष्यफल एवं आचार्य आशीर्वाद",
  ];

  const titlesEn = [
    "Sacred Invocations & Native Birth Dossier",
    "Lagna Kundali Chart (D-1 Rashi Matrix)",
    "Navamsha Kundali Chart (D-9 Dharma & Marriage)",
    "Chandra Kundali & Bhava Chalit Chart",
    "Sidereal Planetary Positions & Ephemeris Table",
    "12 Bhavas Detailed Analysis & Planetary Aspects",
    "Sarvashtakavarga Matrix & House Strength",
    "Vimshottari Mahadasha Timeline (120 Years)",
    "Current Mahadasha & Antardasha In-Depth Analysis",
    "Pratyantardasha & Major Planetary Transits",
    "Saturn Sade Sati & Dhaiya Comprehensive Study",
    "Manglik Dosha & Kuja Cancellation Analysis",
    "Kaal Sarp Dosha & Pitra Dosha Diagnostics",
    "Career, Profession, 10th House & Wealth Yogas",
    "Love, Marriage, Spouse & Marital Harmony",
    "Health, Constitution, Vitality & Longevity",
    "Auspicious Gemstone Recommendation & Rituals",
    "Auspicious Rudraksha, Sacred Yantras & Mantras",
    "Lal Kitab Remedies & Traditional Daily Upayas",
    "5-10 Year Roadmap & Astrological Blessings",
  ];

  return isHi ? titlesHi[pageNum - 1] || "" : titlesEn[pageNum - 1] || "";
}

// Helper: Page Subtitles
function getPageSubtitle(pageNum: number, isHi: boolean): string {
  const subtitlesHi = [
    "श्री गणेशाय नमः • महामृत्युंजय मंत्र • जन्म पंचांग • लाहिरी अयनांश",
    "प्रथम भाव (तनु) • आत्मकारक ग्रह • व्यक्तित्व, स्वभाव व शारीरिक गठन",
    "भाग्य भाव • आध्यात्मिक बल • जीवनसाथी का स्वभाव व धर्म अनुकूलता",
    "मन की स्थिति • मानसिक शांति • भाव संधि एवं ग्रहों का चलित प्रभाव",
    "सूर्य से केतु तक 9 ग्रह + लग्न: अंश, कला, नक्षत्र, चरण, वक्री/मार्गी स्थिति",
    "केंद्र (1, 4, 7, 10) • त्रिकोण (1, 5, 9) • उपचय व त्रिक भावों का गणित",
    "12 भावों के अष्टकवर्ग बिंदु • बलवान एवं संवेदनशील भावों की पहचान",
    "जन्म समय से 120 वर्ष तक का संपूर्ण विंशोत्तरी दशा चक्र एवं महादशा स्वामी",
    "वर्तमान दशा स्वामी का शुभ-अशुभ प्रभाव • आजीविका व पारिवारिक स्थिति",
    "बृहस्पति, शनि व राहु-केतु का गोचरीय प्रभाव • अनुकूल एवं संवेदनशील मास",
    "प्रथम, द्वितीय व तृतीय चरण की स्थिति • प्रभाव, शांति विधान व समय सारणी",
    "1, 4, 7, 8, 12 भावों में मंगल की स्थिति • दोष परिहार एवं विवाह समय",
    "12 प्रकार के कालसर्प योग • राहु-केतु अक्ष • शांति एवं निवारण विधि",
    "दशमेश व एकादशेश की स्थिति • राज योग, धन योग, गजकेसरी योग विचार",
    "सप्तमेश व शुक्र/गुरु की स्थिति • विवाह का संभावित समय व दिशा",
    "षष्ठेश व अष्टमेश की स्थिति • वात-पित्त-कफ संतुलन व आरोग्यता नियम",
    "भाग्य रत्न • जीवन रत्न • अनुकूल धातु, उंगली, दिन व प्राण-प्रतिष्ठा मंत्र",
    "अनुकूल मुखी रुद्राक्ष • नवग्रह वैदिक बीज मंत्र जप संख्या व दिशा",
    "अचूक दान सामग्री • शुभ रंग, वार, दिशा, अंक व दैनिक पुण्य कर्म",
    "वर्षवार प्रमुख ग्रह चाल, अवसर, आध्यात्मिक संकल्प एवं आचार्य का आशीर्वाद",
  ];

  const subtitlesEn = [
    "Shree Ganeshaya Namah • Mahamrityunjaya Mantra • Birth Panchang",
    "Ascendant (1st House) • Body Constitution, Nature & Core Soul Path",
    "D-9 Navamsha • Spiritual Merit, Spousal Resonance & Fortunes",
    "Moon Sign Dynamics • Mental Equilibrium • Bhava Chalit Shifts",
    "9 Planets + Ascendant: Degree, Nakshatra, Pada, Retrograde & Dignity",
    "Kendra (1,4,7,10) • Trikona (1,5,9) • Upachaya & Dusthana Analysis",
    "Sarvashtakavarga 1-12 House Bindus & Karmic Strength Indicators",
    "120-Year Vimshottari Timeline with Exact Planetary Spans",
    "Active Mahadasha-Antardasha Results on Career & Relationships",
    "Pratyantardasha & Major Transits of Jupiter, Saturn & Rahu-Ketu",
    "Rising, Peak & Setting Phases of Saturn • Astrological Remedies",
    "Mars Placements in Houses 1, 4, 7, 8, 12 • Cancellation Rules",
    "12 Varieties of Kaal Sarp Yoga • Pitra Dosha Diagnostic & Rituals",
    "10th & 11th House Matrix • Raja Yogas, Lakshmi Yoga & Milestones",
    "7th House & Venus/Jupiter Harmony • Spouse Attributes & Timing",
    "6th & 8th House Dynamics • Dosha Balance, Immunity & Vitality",
    "Bhagya Ratna • Life Ratna • Metal, Finger, Day & Activation Mantra",
    "Auspicious Mukhi Rudraksha • Beej Mantras & Yantra Installation",
    "Lal Kitab Classical Upayas • Auspicious Colors, Days & Charities",
    "Year-by-Year Planetary Milestones, Spiritual Resolutions & Blessings",
  ];

  return isHi ? subtitlesHi[pageNum - 1] || "" : subtitlesEn[pageNum - 1] || "";
}

// Helper: Render individual page content
function renderPageContent(pageNum: number, data: any, isHi: boolean) {
  const { birthData, kundali, panchang, vimshottariDashaList, ashtakavargaPoints, tenYearForecast, futureForecast } = data;
  const ff = futureForecast || {};
  const career = ff.careerDeepDive || {};
  const marriage = ff.marriageDeepDive || {};
  const health = ff.healthDeepDive || {};
  const transits = ff.transitsDeepDive || {};
  const yearlyList = ff.yearlyDeepForecast || tenYearForecast || [];

  switch (pageNum) {
    // PAGE 1: COVER & INVOCATION
    case 1:
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-center space-y-1">
            <span className="text-base font-serif font-bold text-amber-900 block">
              ॥ ॐ गं गणपतये नमः ॥
            </span>
            <p className="text-xs font-serif text-stone-700 italic">
              "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
              <span className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                {isHi ? "जातक विवरण (Native Dossier)" : "Native Dossier"}
              </span>
              <div className="space-y-1 font-medium">
                <div>{isHi ? "नाम:" : "Name:"} <span className="font-bold text-stone-900">{birthData.name || "Seeker"}</span></div>
                <div>{isHi ? "जन्म तिथि:" : "Birth Date:"} <span className="text-stone-800">{birthData.date}</span></div>
                <div>{isHi ? "जन्म समय:" : "Birth Time:"} <span className="text-stone-800">{birthData.time}</span></div>
                <div>{isHi ? "जन्म स्थान:" : "Birth Place:"} <span className="text-stone-800">{birthData.place}</span></div>
                <div>{isHi ? "अक्षांश/देशांतर:" : "Coordinates:"} <span className="text-stone-600">{birthData.lat.toFixed(2)}° N, {birthData.lon.toFixed(2)}° E</span></div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
              <span className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                {isHi ? "जन्म पंचांग (Birth Panchang)" : "Birth Panchang"}
              </span>
              <div className="space-y-1 font-medium">
                <div>{isHi ? "वार:" : "Day (Vaar):"} <span className="text-stone-800">{isHi ? panchang.vaar : panchang.vaarEn}</span></div>
                <div>{isHi ? "तिथि:" : "Tithi:"} <span className="text-stone-800">{isHi ? panchang.tithi : panchang.tithiEn}</span></div>
                <div>{isHi ? "नक्षत्र:" : "Nakshatra:"} <span className="text-stone-800">{panchang.nakshatra} (Pada {panchang.pada})</span></div>
                <div>{isHi ? "योग/करण:" : "Yoga/Karana:"} <span className="text-stone-800">{panchang.yoga} / {panchang.karana}</span></div>
                <div>{isHi ? "अयनांश:" : "Ayanamsha:"} <span className="text-amber-800 font-bold">{panchang.ayanamsha}</span></div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40">
            <span className="text-[11px] font-bold text-amber-900 block mb-1">
              {isHi ? "वैदिक जन्म लग्न एवं राशि चक्र सारांश:" : "Vedic Birth Summary:"}
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-white rounded-lg border border-amber-200">
                <span className="text-[10px] text-stone-500 block">{isHi ? "लग्न (Ascendant)" : "Ascendant"}</span>
                <span className="font-bold text-amber-800">{kundali.ascendant.sign} ({kundali.ascendant.degree}°)</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-amber-200">
                <span className="text-[10px] text-stone-500 block">{isHi ? "चंद्र राशि (Moon Sign)" : "Moon Sign"}</span>
                <span className="font-bold text-amber-800">{kundali.moon.sign} ({kundali.moon.degree}°)</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-amber-200">
                <span className="text-[10px] text-stone-500 block">{isHi ? "वर्तमान महादशा" : "Current Dasha"}</span>
                <span className="font-bold text-amber-800">{kundali.dasha.currentMahadasha}</span>
              </div>
            </div>
          </div>

          {/* Professional Vedic Advisory Box at Beginning of PDF */}
          <div className="p-3 rounded-xl border border-stone-300 bg-stone-100/90 text-[10px] sm:text-[11px] text-stone-700 space-y-1">
            <span className="font-bold text-stone-900 block flex items-center gap-1">
              ⚖️ {isHi ? "महत्वपूर्ण वैधानिक एवं ज्योतिषीय परामर्श सूचना (Advisory Note):" : "Important Vedic Advisory & Guidance Note:"}
            </span>
            <p className="leading-relaxed">
              {isHi
                ? "यह 20 पृष्ठीय जन्म कुंडली एवं विस्तृत फलादेश पारंपरिक वैदिक पराशरी सिद्धांतों, लाहिरी अयनांश एवं परिष्कृत डिजिटल ग्रह गणनाओं पर आधारित है। ज्योतिष विद्या मानव जीवन का संभावित मार्ग व आध्यात्मिक दृष्टिकोण प्रस्तुत करती है, यह भविष्य का अंतिम या अटल दावा नहीं है और न ही किसी प्रकार की पूर्ण गारंटी प्रदान करती है। जातक अपने विवेक, कर्म (पुरुषार्थ) एवं स्वतंत्र इच्छाशक्ति के आधार पर ही जीवन के महत्वपूर्ण निर्णय लें।"
                : "This 20-Page Janam Kundali and astrological forecast is formulated upon classical Parashari principles, Lahiri Ayanamsha, and precise digital planetary algorithms. Astrology offers spiritual perspective and cosmic probabilities; it does not claim absolute certainty nor offer any explicit guarantees. Seekers are advised to exercise free will, practical discretion, and personal agency in all vital decisions."}
            </p>
          </div>
        </div>
      );

    // PAGE 2: LAGNA CHART (D1)
    case 2:
      return (
        <div className="space-y-4 flex flex-col items-center">
          <DiamondKundaliSvg kundali={kundali} chartType="lagna" lang={isHi ? "hi" : "en"} size={320} theme="light" />
          <div className="w-full p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 block text-xs">
              {isHi ? "प्रथम भाव (लग्न) का शास्त्रीय विवेचन:" : "1st House (Lagna) Classical Analysis:"}
            </span>
            <p className="text-xs text-stone-700 leading-relaxed">
              {isHi
                ? `जातक का जन्म ${kundali.ascendant.sign} लग्न में हुआ है। लग्न भाव जातक के शरीर, स्वभाव, आत्मबल एवं समग्र जीवन दिशा का द्योतक है। ${kundali.ascendant.sign} लग्न जातक को स्वाभाविक तेज, न्यायप्रियता एवं नेतृत्व क्षमता प्रदान करता है। नक्षत्र ${kundali.nakshatra.name} के स्वामी ग्रह का प्रभाव जातक की विचार शैली पर स्पष्ट परिलक्षित होता है। जातक में जन्मजात स्वाभिमान, दृढ़ संकल्प तथा कठिन परिस्थितियों से उबरने की असाधारण क्षमता है।`
                : `The native is born in ${kundali.ascendant.sign} Ascendant (Lagna). The 1st house governs physical vitality, core temperament, longevity, and foundational identity. With ${kundali.nakshatra.name} Nakshatra, the native possesses strong analytical instinct, enduring courage, and persistent willpower to triumph over obstacles.`}
            </p>
          </div>
        </div>
      );

    // PAGE 3: NAVAMSHA CHART (D9)
    case 3:
      return (
        <div className="space-y-4 flex flex-col items-center">
          <DiamondKundaliSvg kundali={kundali} chartType="navamsha" lang={isHi ? "hi" : "en"} size={320} theme="light" />
          <div className="w-full p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 block text-xs">
              {isHi ? "नवमांश (D-9) धर्म एवं दांपत्य विश्लेषण:" : "D-9 Navamsha Dharma & Spousal Analysis:"}
            </span>
            <p className="text-xs text-stone-700 leading-relaxed">
              {isHi
                ? "वैदिक ज्योतिष में नवमांश कुंडली को 'भाग्य कुंडली' तथा 'दांपत्य कुंडली' माना जाता है। लग्न कुंडली के ग्रहों का वास्तविक बल नवमांश में उनकी स्थिति से निर्धारित होता है। नवमांश में वर्गोत्तम ग्रहों की स्थिति जातक को जीवन के उत्तरार्ध में उच्च मान-सम्मान एवं आत्मिक संतुष्टि प्रदान करती है। विवाह उपरांत भाग्य में गुणात्मक वृद्धि तथा आध्यात्मिक चेतना का जागरण नवमांश के शुभ प्रभावों द्वारा सुनिश्चित होता है।"
                : "In Parashari astrology, D-9 Navamsha reveals the hidden fruition of dharma, marriage compatibility, and inner potential. Planetary dignities strengthened in Navamsha bestow late-blooming stability, career resurgence, and lifelong marital grace."}
            </p>
          </div>
        </div>
      );

    // PAGE 4: CHANDRA & CHALIT CHART
    case 4:
      return (
        <div className="space-y-4 flex flex-col items-center">
          <DiamondKundaliSvg kundali={kundali} chartType="moon" lang={isHi ? "hi" : "en"} size={320} theme="light" />
          <div className="w-full p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 block text-xs">
              {isHi ? "चंद्र कुंडली एवं भाव चलित प्रभाव:" : "Moon Chart & Bhava Chalit Impacts:"}
            </span>
            <p className="text-xs text-stone-700 leading-relaxed">
              {isHi
                ? `चंद्र राशि ${kundali.moon.sign} मन, संवेदनशीलता एवं मानसिक शांति की प्रतिनिधि है। चलित भाव में ग्रहों के अंश संधि पर स्थित होने पर उनके कार्यक्षेत्र में सूक्ष्म परिवर्तन आते हैं। चंद्र बल प्रबल होने से जातक विषम परिस्थितियों में भी मानसिक संतुलन बनाए रखने में सफल होता है। चंद्र-लग्न से शुभ ग्रहों का गोचर मानसिक उल्लास और सामाजिक सम्मान की वृद्धि कराता है।`
                : `Moon in ${kundali.moon.sign} governs emotional intelligence, mental resilience, and public intuition. Bhava Chalit calculations fine-tune the exact house boundaries, confirming strong inner composure and high emotional quotient under stress.`}
            </p>
          </div>
        </div>
      );

    // PAGE 5: COMPLETE GRAHA SPASHTA TABLE
    case 5:
      return (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-[11px] text-left">
              <thead className="bg-amber-100/60 font-serif font-bold text-stone-900 border-b border-stone-200">
                <tr>
                  <th className="p-2">{isHi ? "ग्रह" : "Planet"}</th>
                  <th className="p-2">{isHi ? "राशि" : "Sign"}</th>
                  <th className="p-2">{isHi ? "अंश" : "Degree"}</th>
                  <th className="p-2">{isHi ? "नक्षत्र" : "Nakshatra"}</th>
                  <th className="p-2">{isHi ? "भाव" : "House"}</th>
                  <th className="p-2">{isHi ? "अवस्था" : "Dignity"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {kundali.planets.map((p: any) => (
                  <tr key={p.name} className="hover:bg-stone-50">
                    <td className="p-2 font-bold text-rose-900">{isHi ? p.sanskritName : p.name}</td>
                    <td className="p-2">{p.sign}</td>
                    <td className="p-2 font-mono">{p.degree.toFixed(2)}°</td>
                    <td className="p-2">{p.nakshatra} ({p.nakshatraLord})</td>
                    <td className="p-2 font-bold">{p.house}</td>
                    <td className="p-2">{p.dignity || (isHi ? "मित्र" : "Friendly")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    // PAGE 6: 12 BHAVAS & DRISHTI (ALL 12 HOUSES COMPREHENSIVE)
    case 6:
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {kundali.houses.map((h: any) => (
              <div key={h.houseNumber} className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900">
                    {isHi ? `भाव ${h.houseNumber}` : `House ${h.houseNumber}`} ({h.sign})
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono">
                    {h.houseNumber === 1 || h.houseNumber === 4 || h.houseNumber === 7 || h.houseNumber === 10
                      ? (isHi ? "केंद्र" : "Kendra")
                      : h.houseNumber === 5 || h.houseNumber === 9
                      ? (isHi ? "त्रिकोण" : "Trikona")
                      : h.houseNumber === 6 || h.houseNumber === 8 || h.houseNumber === 12
                      ? (isHi ? "त्रिक" : "Trika")
                      : (isHi ? "उपचय" : "Upachaya")}
                  </span>
                </div>
                <span className="text-[11px] text-stone-600 block">
                  {isHi ? "कारक:" : "Significator:"} {h.significator}
                </span>
                <span className="text-[10px] text-stone-500 block">
                  {h.planets.length ? (isHi ? `स्थित ग्रह: ${h.planets.join(", ")}` : `Planets: ${h.planets.join(", ")}`) : (isHi ? "रिक्त भाव (शुभ दृष्टि संचरण)" : "Empty (Aspects applied)")}
                </span>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-stone-700">
            <span className="font-bold text-amber-950 block mb-0.5">
              {isHi ? "भाव विश्लेषण निष्कर्ष:" : "Bhava Synthesis Key:"}
            </span>
            <p className="text-[11px] leading-relaxed">
              {isHi
                ? "केंद्र भाव (1, 4, 7, 10) जीवन के मूल आधार हैं तथा त्रिकोण भाव (1, 5, 9) ईश्वरीय कृपा व पूर्वजन्म के पुण्यों के प्रतीक हैं। आपकी कुंडली में केंद्र व त्रिकोण का सामंजस्य जीवन को स्थिरता एवं मान-प्रतिष्ठा प्रदान करता है।"
                : "Kendra houses provide life's pillars, while Trikona houses signify past-life merits and divine fortune. Strong alignment creates lifelong resilience and high status."}
            </p>
          </div>
        </div>
      );

    // PAGE 7: ASHTAKAVARGA
    case 7:
      return (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-100/60 font-serif font-bold text-stone-900 border-b border-stone-200">
                <tr>
                  <th className="p-2">{isHi ? "भाव" : "House"}</th>
                  <th className="p-2">{isHi ? "राशि" : "Sign"}</th>
                  <th className="p-2">{isHi ? "सर्वाष्टक बिंदु" : "Bindus"}</th>
                  <th className="p-2">{isHi ? "सामर्थ्य श्रेणी" : "Strength"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {ashtakavargaPoints.map((pt: any) => (
                  <tr key={pt.house}>
                    <td className="p-2 font-bold">{isHi ? `भाव ${pt.house}` : `House ${pt.house}`}</td>
                    <td className="p-2">{isHi ? pt.signHi : pt.signEn}</td>
                    <td className="p-2 font-mono font-bold text-rose-900">{pt.bindus} / 56</td>
                    <td className="p-2 text-stone-700">{isHi ? pt.strengthHi : pt.strengthEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    // PAGE 8: VIMSHOTTARI TIMELINE
    case 8:
      return (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-100/60 font-serif font-bold text-stone-900 border-b border-stone-200">
                <tr>
                  <th className="p-2">{isHi ? "महादशा स्वामी" : "Mahadasha"}</th>
                  <th className="p-2">{isHi ? "अवधि (वर्ष)" : "Duration"}</th>
                  <th className="p-2">{isHi ? "प्रारंभ - समापन" : "Timeline"}</th>
                  <th className="p-2">{isHi ? "मुख्य फल" : "Key Influence"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {vimshottariDashaList.map((d: any) => (
                  <tr key={d.planetEn}>
                    <td className="p-2 font-bold text-amber-900">{isHi ? d.planetHi : d.planetEn}</td>
                    <td className="p-2 font-mono">{d.years} yrs</td>
                    <td className="p-2 font-mono">{d.startYear} - {d.endYear}</td>
                    <td className="p-2 text-stone-600 text-[11px]">{isHi ? d.resultHi : d.resultEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    // PAGE 9: CURRENT DASHA & ANTARDASHA (DEEPLY ENRICHED)
    case 9:
      return (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
            <span className="font-serif font-bold text-sm text-amber-950 block">
              {isHi ? "वर्तमान में संचालित महादशा एवं अंतर्दशा का विस्तृत विवेचन:" : "Active Planetary Dasha Phase Detailed Analysis:"}
            </span>
            <div className="flex gap-4 text-xs font-semibold">
              <span>{isHi ? "महादशा स्वामी:" : "Mahadasha Lord:"} <strong className="text-rose-900 text-sm">{kundali.dasha.currentMahadasha}</strong></span>
              <span>{isHi ? "अंतर्दशा स्वामी:" : "Antardasha Lord:"} <strong className="text-amber-800 text-sm">{kundali.dasha.currentAntardasha}</strong></span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed pt-1">
              {isHi
                ? `वर्तमान समय में जातक ${kundali.dasha.currentMahadasha} की महादशा में ${kundali.dasha.currentAntardasha} की अंतर्दशा से गुजर रहा है। यह कालखंड जीवन के अत्यंत निर्णायक मोड़ों में से एक है। इस अवधि में जातक के कर्म एवं निर्णय आने वाले 10 वर्षों की दिशा तय करेंगे।`
                : `Currently navigating ${kundali.dasha.currentMahadasha} Mahadasha with ${kundali.dasha.currentAntardasha} Antardasha. This is a defining strategic turning point whose actions chart the trajectory for the coming decade.`}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-amber-950 block mb-1">
                {isHi ? "1. करियर व आजीविका" : "1. Career Horizon"}
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {isHi
                  ? "उच्चाधिकारियों से तालमेल बनाए रखें। नई परियोजनाओं में जिम्मेदारी बढ़ेगी। पदोन्नति व अधिकारों के विस्तार का समय है।"
                  : "Leadership expands across high-visibility projects. Promotion and managerial empowerment are strongly indicated."}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-amber-950 block mb-1">
                {isHi ? "2. धन व संचित कोष" : "2. Wealth & Cashflows"}
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {isHi
                  ? "नियमित आय के अतिरिक्त अप्रत्याशित स्रोतों से धन का आगमन। दीर्घकालिक संपत्ति व स्वर्ण में निवेश फलदायी रहेगा।"
                  : "Robust regular inflows supplemented by windfalls. Long-term property or bullion investments yield security."}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-amber-950 block mb-1">
                {isHi ? "3. पारिवारिक शांति" : "3. Domestic Bliss"}
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {isHi
                  ? "पारिवारिक मांगलिक कार्यों की रूपरेखा बनेगी। जीवनसाथी का पूर्ण सहयोग प्राप्त होगा। अहंकार से बचने की सलाह है।"
                  : "Auspicious family milestones materialize. Deep support from spouse; patience prevents minor discords."}
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950">
            <span className="font-bold block mb-0.5">
              {isHi ? "दशा अनुकूलता हेतु विशेष वैदिक परामर्श:" : "Special Remedial Guidance for Active Dasha:"}
            </span>
            <p className="text-[11px] leading-relaxed">
              {isHi
                ? `प्रतिदिन प्रातः सूर्य देव को तांबे के पात्र से कुमकुम व अक्षत युक्त जल अर्पित करें तथा दशा स्वामी ${kundali.dasha.currentMahadasha} के बीज मंत्र का 108 बार जप करें। इससे नकारात्मक बाधाएं समाप्त होकर शुभ फल प्राप्त होंगे।`
                : `Offer morning water to Surya with red vermilion in a copper pot, and chant 108 times the Beej Mantra of Mahadasha lord ${kundali.dasha.currentMahadasha} to neutralize obstacles.`}
            </p>
          </div>
        </div>
      );

    // PAGE 10: PRATYANTARDASHA & TRANSIT (DEEPLY ENRICHED)
    case 10:
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
            <span className="font-serif font-bold text-sm text-amber-950 block mb-1">
              {isHi ? "त्रिमूर्ति गोचर प्रभाव: गुरु, शनि एवं राहु-केतु" : "Major Planetary Transits: Jupiter, Saturn & Rahu-Ketu"}
            </span>
            <p className="text-stone-700 leading-relaxed text-[11px]">
              {isHi
                ? "गोचर (Transit) वर्तमान काल में आकाश में ग्रहों की गति का आपकी जन्म कुंडली पर पड़ने वाला वास्तविक प्रभाव है। यह आपके दैनिक जीवन, आर्थिक निर्णयों एवं मानसिक स्थिति को सीधे संचालित करता है।"
                : "Planetary transits represent the real-time celestial movements interacting with your natal horoscope, triggering immediate events, psychological clarity, and financial windfalls."}
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-amber-900 block mb-0.5">
                {isHi ? "• देवगुरु बृहस्पति गोचर (ज्ञान, धन व संतति):" : "• Jupiter Transit (Wisdom, Wealth & Progeny):"}
              </span>
              <p className="text-[11px] text-stone-700 leading-relaxed">
                {isHi ? transits.jupiterHi : transits.jupiterEn}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-900 block mb-0.5">
                {isHi ? "• कर्मफलदाता शनि देव गोचर (कर्म, श्रम व स्थायित्व):" : "• Saturn Transit (Discipline, Karma & Durability):"}
              </span>
              <p className="text-[11px] text-stone-700 leading-relaxed">
                {isHi ? transits.saturnHi : transits.saturnEn}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-900 block mb-0.5">
                {isHi ? "• राहु-केतु अक्षीय गोचर (परिवर्तन व अनुसंधान):" : "• Rahu-Ketu Nodal Axis Transit:"}
              </span>
              <p className="text-[11px] text-stone-700 leading-relaxed">
                {isHi ? transits.rahuKetuHi : transits.rahuKetuEn}
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
            <span className="font-bold">{isHi ? "वर्ष के सर्वाधिक शुभ व फलदायी माह:" : "Most Auspicious Months of Year:"}</span>
            <span className="font-serif font-bold text-emerald-800">{isHi ? transits.favorableMonthsHi : transits.favorableMonthsEn}</span>
          </div>
        </div>
      );

    // PAGE 11: SHANI SADE SATI (DEEPLY ENRICHED)
    case 11:
      return (
        <div className="space-y-3">
          <div className={`p-3.5 rounded-xl border ${kundali.doshas.sadeSati.active ? "bg-amber-50 border-amber-300" : "bg-emerald-50 border-emerald-300"} space-y-1.5`}>
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-stone-900">
                {isHi ? "शनि साढ़े साती एवं ढैय्या की वर्तमान स्थिति" : "Saturn Sade Sati & Dhaiya Status"}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${kundali.doshas.sadeSati.active ? "bg-amber-200 text-amber-900" : "bg-emerald-200 text-emerald-900"}`}>
                {kundali.doshas.sadeSati.active ? (isHi ? `सक्रिय चरण: ${kundali.doshas.sadeSati.phase}` : `Active: ${kundali.doshas.sadeSati.phase}`) : (isHi ? "साढ़े साती मुक्त" : "Sade Sati Inactive")}
              </span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {isHi
                ? kundali.doshas.sadeSati.description
                : "Detailed examination of Saturn's 7.5-year transit relative to natal Moon sign."}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
            <span className="font-bold text-stone-900 block">
              {isHi ? "साढ़े साती / शनि प्रभाव का वास्तविक जीवन में फल:" : "Saturn Sade Sati Real-Life Manifestation:"}
            </span>
            <p className="text-[11px] text-stone-700 leading-relaxed">
              {isHi
                ? "शनि देव न्याय के अधिष्ठाता हैं। साढ़े साती मनुष्य को अहंभाव, व्यर्थ के आडंबर तथा असत्य से मुक्त कर परिपक्व बनाती है। इस अवधि में किए गए कड़े परिश्रम का फल स्थायी एवं पीढ़ियों तक चलने वाला होता है। व्यापारिक संविदाओं एवं कागजी लेन-देन में पूर्ण पारदर्शिता रखें।"
                : "Saturn is the divine arbiter of justice. Sade Sati dissolves superficial ego and grounds the native in authentic integrity. Hard-earned milestones achieved under Saturn remain imperishable."}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-1">
            <span className="font-bold text-amber-950 block">
              {isHi ? "शनि कृपा प्राप्ति हेतु 4 अचूक शास्त्रीय उपाय:" : "4 Classical Saturn Remedies:"}
            </span>
            <div className="text-[11px] text-stone-700 space-y-1">
              <div>{isHi ? "1. प्रत्येक शनिवार सूर्यास्त के उपरांत पीपल के वृक्ष के नीचे सरसों के तेल का चौमुखा दीपक जलाएं।" : "1. Light a 4-wick mustard oil lamp under a peepal tree after sunset on Saturdays."}</div>
              <div>{isHi ? "2. मध्यमा उंगली (Middle Finger) में काले घोड़े की नाल अथवा नाव की कील का अभिमंत्रित छल्ला धारण करें।" : "2. Wear an energized iron ring made from black horseshoe on the middle finger."}</div>
              <div>{isHi ? "3. नित्य 'दशरथकृत शनि स्तोत्र' का पाठ करें अथवा 'ॐ शं शनैश्चराय नमः' का 108 बार जप करें।" : "3. Recite Dasharatha Shani Stotram daily or chant 'Om Sham Shanaishcharaya Namah' 108 times."}</div>
              <div>{isHi ? "4. श्रमिकों, सफाईकर्मियों अथवा दिव्यांग जनों को भोजन या काले तिल/कंबल का आदरपूर्वक दान करें।" : "4. Respectfully serve or donate meals, black sesame, or blankets to laborers and the needy."}</div>
            </div>
          </div>
        </div>
      );

    // PAGE 12: MANGLIK DOSHA (DEEPLY ENRICHED)
    case 12:
      return (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-stone-900">
                {isHi ? "मांगलिक दोष (कुज दोष) एवं दोष परिहार विवेचन" : "Manglik Dosha (Kuja Dosha) & Cancellation Analysis"}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${kundali.doshas.mangalDosha ? "bg-amber-200 text-amber-900" : "bg-emerald-200 text-emerald-900"}`}>
                {kundali.doshas.mangalDosha ? (isHi ? "आंशिक मांगलिक प्रभाव" : "Mild Manglik Aspect") : (isHi ? "दोष मुक्त (Non-Manglik)" : "Non-Manglik")}
              </span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {isHi ? kundali.doshas.mangalDoshaDetails : "Parashari criteria: 1st, 4th, 7th, 8th, 12th house check with classical cancellation principles."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">
                {isHi ? "दोष परिहार (Cancellation) नियम:" : "Cancellation Factors:"}
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {isHi
                  ? "यदि गुरु की दृष्टि मंगल पर हो, अथवा मंगल स्वराशि (मेष/वृश्चिक) या उच्च (मकर) में हो तो मांगलिक दोष स्वतः प्रभावहीन हो जाता है।"
                  : "Jupiter's aspect on Mars or Mars in its own/exalted sign neutralizes classical Manglik afflictions."}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">
                {isHi ? "विवाह सामंजस्य परामर्श:" : "Marital Matching Advice:"}
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {isHi
                  ? "कुंडली मिलान में गुण मिलान के साथ-साथ सप्तमेश व शुक्र/गुरु की स्थिति का परीक्षण अवश्य कराएं। 28 वर्ष के उपरांत मंगल का प्रभाव शांत हो जाता है।"
                  : "Verify 7th lord and Venus alongside Guna Milan. Mars intensity naturally matures after age 28."}
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950">
            <span className="font-bold block mb-0.5">
              {isHi ? "मंगल शांति हेतु वैदिक अनुष्ठान:" : "Mangal Harmonization Rituals:"}
            </span>
            <p className="text-[11px] leading-relaxed">
              {isHi
                ? "प्रति मंगलवार हनुमान जी को सिंदूर व चमेली का तेल अर्पित करें तथा सुंदरकांड का पाठ करें। लाल मसूर की दाल अथवा तांबे के बर्तन का दान अत्यंत फलदायी है।"
                : "Offer vermilion to Hanuman on Tuesdays and recite Sundarkand. Donating red lentils or copper vessels harmonizes Martian energy."}
            </p>
          </div>
        </div>
      );

    // PAGE 13: KAAL SARP & PITRA DOSHA (DEEPLY ENRICHED)
    case 13:
      return (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <span className="font-serif font-bold text-sm text-stone-900 block">
              {isHi ? "कालसर्प एवं पितृ दोष शास्त्रीय परीक्षण:" : "Kaal Sarp & Pitra Dosha Classical Diagnostics:"}
            </span>
            <p className="text-xs text-stone-700 leading-relaxed">
              {isHi
                ? "कुंडली में राहु एवं केतु के मध्य सभी ग्रहों की स्थिति का सूक्ष्म विश्लेषण किया गया। आपकी कुंडली में कोई दुर्दम्य कालसर्प दोष नहीं है। नवम भाव पर देवगुरु की शुभ दृष्टि होने के कारण कुल देवताओं एवं पितरों की असीम कृपा आपके ऊपर बनी हुई है।"
                : "Thorough verification of Rahu-Ketu axis confirms no malignant Kaal Sarp formation. 9th house Jupiter aspects confirm strong ancestral blessings and divine protection."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200">
              <span className="font-bold text-amber-950 block mb-1">
                {isHi ? "पितृ कृपा एवं आशीर्वाद के लक्षण:" : "Signs of Ancestral Grace:"}
              </span>
              <p className="text-[11px] text-stone-700 leading-relaxed">
                {isHi
                  ? "अंतिम क्षणों में कार्य बन जाना, बड़े संकटों से बाल-बाल बचना तथा परिवार में संस्कारित परंपराओं का प्रवाह पितृ कृपा का प्रत्यक्ष प्रमाण है।"
                  : "Last-minute resolution of crises and preservation of cultural heritage confirm active ancestral grace."}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">
                {isHi ? "आध्यात्मिक ऊर्जा संवर्धन:" : "Spiritual Elevation:"}
              </span>
              <p className="text-[11px] text-stone-700 leading-relaxed">
                {isHi
                  ? "राहु की छाया से मुक्त रहने के लिए सदैव सत्य बोलें, अपवित्र अन्न का त्याग करें तथा नित्य पक्षियों को जल व दाना दें।"
                  : "Maintain strict truthfulness, avoid impure food, and feed water/grains to birds to dispel Rahu shadows."}
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-300 text-xs space-y-1">
            <span className="font-bold text-stone-900 block">
              {isHi ? "पितृ तृप्ति एवं कुल सौभाग्य अनुष्ठान:" : "Sacred Rituals for Ancestral Bliss:"}
            </span>
            <div className="text-[11px] text-stone-700 space-y-0.5">
              <div>{isHi ? "• प्रत्येक अमावस्या को गौमाता को हरा चारा अथवा गुड़ व रोटी खिलाएं।" : "• Feed green fodder or jaggery bread to cows on every Amavasya."}</div>
              <div>{isHi ? "• दक्षिण दिशा की ओर मुख करके पितरों के निमित्त एक लोटा जल अर्पित करें।" : "• Offer water facing South in remembrance of ancestors."}</div>
              <div>{isHi ? "• वर्ष में एक बार गया, काशी अथवा हरिद्वार में पितृ तर्पण संपन्न करें।" : "• Perform ancestral tarpana at Gaya, Kashi or Haridwar once a year."}</div>
            </div>
          </div>
        </div>
      );

    // PAGE 14: CAREER, WEALTH & RAJ YOGAS (HIGH-VALUE PAID CONTENT)
    case 14:
      return (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-300 space-y-1.5">
            <span className="font-serif font-bold text-sm text-amber-950 block">
              {isHi ? "कुंडली में सक्रिय महा-राजयोग एवं धन संपदा योग:" : "Prominent Raj Yogas & Wealth Yogas in Natal Chart:"}
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold text-amber-900">
              {(career.yogas || []).map((y: string, idx: number) => (
                <div key={idx} className="p-1.5 rounded-lg bg-white/80 border border-amber-200">
                  ✓ {y}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
            <span className="font-bold text-stone-900 block">
              {isHi ? "सर्वश्रेष्ठ अनुकूल आजीविका क्षेत्र (Best Career Sectors):" : "Optimal Career Fields for Maximum Wealth:"}
            </span>
            <div className="text-[11px] text-stone-700 space-y-1">
              {(isHi ? career.bestSectorsHi : career.bestSectorsEn || []).map((s: string, idx: number) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-amber-900 block mb-0.5">
                {isHi ? "स्वर्ण कालखंड (Peak Earning Ages):" : "Peak Wealth Accumulation Horizon:"}
              </span>
              <p className="text-[11px] text-stone-700 font-medium">
                {isHi ? career.peakAgesHi : career.peakAgesEn}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-amber-900 block mb-0.5">
                {isHi ? "नौकरी बनाम स्वतंत्र व्यापार:" : "Employment vs Business Outlook:"}
              </span>
              <p className="text-[11px] text-stone-700 leading-relaxed">
                {isHi ? career.natureHi : career.natureEn}
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-stone-700">
            <span className="font-bold text-amber-950 block mb-0.5">
              {isHi ? "अचल संपत्ति एवं वित्तीय सुरक्षा:" : "Real Estate & Asset Creation:"}
            </span>
            <p className="text-[11px] leading-relaxed">
              {isHi ? career.wealthOutlookHi : career.wealthOutlookEn}
            </p>
          </div>
        </div>
      );

    // PAGE 15: MARRIAGE & SPOUSE (HIGH-VALUE PAID CONTENT)
    case 15:
      return (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1.5">
            <span className="font-serif font-bold text-sm text-rose-950 block">
              {isHi ? "सप्तम भाव (दांपत्य): भावी जीवनसाथी का स्वरूप व व्यक्तित्व" : "7th House: Future Spouse Persona & Background"}
            </span>
            <p className="text-xs text-stone-800 leading-relaxed">
              {isHi ? marriage.spouseTraitsHi : marriage.spouseTraitsEn}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-900 block mb-0.5">
                {isHi ? "अनुकूल विवाह दिशा (Direction):" : "Favorable Marriage Direction:"}
              </span>
              <p className="text-[11px] text-stone-700 font-medium">
                {isHi ? marriage.favorableDirectionHi : marriage.favorableDirectionEn}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-900 block mb-0.5">
                {isHi ? "विवाह का सर्वाधिक शुभ वर्ष/आयु:" : "Most Auspicious Marriage Age Window:"}
              </span>
              <p className="text-[11px] text-stone-700 font-medium">
                {isHi ? marriage.marriageAgeHi : marriage.marriageAgeEn}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
            <span className="font-bold text-stone-900 block">
              {isHi ? "दांपत्य सुख एवं आपसी सामंजस्य का दृष्टिकोण:" : "Marital Longevity & Mutual Harmony:"}
            </span>
            <p className="text-[11px] text-stone-700 leading-relaxed">
              {isHi ? marriage.compatibilityOutlookHi : marriage.compatibilityOutlookEn}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-xs space-y-1">
            <span className="font-bold text-rose-950 block">
              {isHi ? "दांपत्य मधुरता एवं शीघ्र विवाह हेतु 3 विशेष उपाय:" : "3 Remedies for Marital Harmony & Alliance:"}
            </span>
            <div className="text-[11px] text-stone-700 space-y-0.5">
              {(isHi ? marriage.remediesHi : marriage.remediesEn || []).map((r: string, idx: number) => (
                <div key={idx}>• {r}</div>
              ))}
            </div>
          </div>
        </div>
      );

    // PAGE 16: HEALTH & LONGEVITY (HIGH-VALUE PAID CONTENT)
    case 16:
      return (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-stone-900">
                {isHi ? "षष्ठ भाव (आरोग्य) एवं त्रिदोष शारीरिक प्रकृति" : "6th House (Health) & Ayurvedic Constitution"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 font-mono">
                {isHi ? `प्राण बल: ${health.vitalityScore || 89}/100` : `Vitality: ${health.vitalityScore || 89}/100`}
              </span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {isHi
                ? `आपकी शारीरिक संरचना ${health.doshaConstitutionHi || "वात-पित्त प्रधान"} है। लग्न एवं सूर्य की स्थिति आपको दीर्घायु तथा रोगों से स्वतः लड़ने की तीव्र प्रतिरोधक क्षमता (Immunity) प्रदान करती है।`
                : `Constitutional profile: ${health.doshaConstitutionEn || "Pitta-Vata Dual"}. Strong Ascendant and Surya vitality confer longevity and high natural immunity.`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200">
              <span className="font-bold text-amber-950 block mb-0.5">
                {isHi ? "संवेदनशील शारीरिक अंग (Precautions):" : "Sensitive Anatomical Organs:"}
              </span>
              <p className="text-[11px] text-stone-700">
                {isHi ? health.sensitiveOrgansHi : health.sensitiveOrgansEn}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-900 block mb-0.5">
                {isHi ? "आयुर्वेदिक आहार परामर्श:" : "Recommended Ayurvedic Diet:"}
              </span>
              <p className="text-[11px] text-stone-700">
                {isHi ? health.recommendedDietHi : health.recommendedDietEn}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1">
            <span className="font-bold text-emerald-950 block">
              {isHi ? "दीर्घायु एवं तेजस्विता हेतु 3 नित्य क्रियाएं:" : "3 Daily Ayurvedic Longevity Habits:"}
            </span>
            <div className="text-[11px] text-stone-700 space-y-0.5">
              {(isHi ? health.ayurvedicHabitsHi : health.ayurvedicHabitsEn || []).map((h: string, idx: number) => (
                <div key={idx}>• {h}</div>
              ))}
            </div>
          </div>
        </div>
      );

    // PAGE 17: GEMSTONE RECOMMENDATION
    case 17:
      return (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 space-y-3">
            <div className="flex items-center gap-2">
              <Gem className="w-5 h-5 text-amber-700" />
              <span className="font-serif font-bold text-sm text-amber-950">
                {isHi ? "अनुकूल भाग्य रत्न परामर्श एवं धारण विधि:" : "Auspicious Gemstone Guide & Consecration:"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>{isHi ? "प्राथमिक रत्न:" : "Primary Gem:"} <strong className="text-rose-900 text-sm">{kundali.gemstoneRecommendation.primary}</strong></div>
              <div>{isHi ? "स्वामी ग्रह:" : "Ruling Planet:"} <strong>{kundali.gemstoneRecommendation.planet}</strong></div>
              <div>{isHi ? "अनुकूल धातु:" : "Metal:"} <strong>{kundali.gemstoneRecommendation.metal}</strong></div>
              <div>{isHi ? "उंगली:" : "Finger:"} <strong>{kundali.gemstoneRecommendation.finger}</strong></div>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-amber-200 text-xs">
              <span className="font-bold text-stone-700 block mb-0.5">{isHi ? "प्राण-प्रतिष्ठा सिद्ध मंत्र:" : "Consecration Siddha Mantra:"}</span>
              <span className="font-serif font-bold text-amber-900">{kundali.gemstoneRecommendation.mantra}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-xs space-y-1">
            <span className="font-bold text-rose-950 block">
              {isHi ? "अति-महत्वपूर्ण: प्रतिकूल रत्न निषेध चेतावनी" : "Strict Incompatible Gemstone Warning"}
            </span>
            <p className="text-[11px] text-stone-700 leading-relaxed">
              {isHi
                ? "बिना पूर्ण कुंडली परीक्षण के नीलम, पन्ना अथवा माणिक्य कभी एक साथ धारण न करें। शत्रु ग्रहों के रत्न एक साथ पहनने से शारीरिक कष्ट व मानसिक तनाव उत्पन्न हो सकता है।"
                : "Never wear conflicting gemstones like Blue Sapphire and Ruby together without expert guidance to avoid severe energetic friction."}
            </p>
          </div>
        </div>
      );

    // PAGE 18: RUDRAKSHA & MANTRAS
    case 18:
      return (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <span className="font-serif font-bold text-sm text-stone-900 block">
              {isHi ? "अनुकूल रुद्राक्ष एवं नवग्रह सिद्ध बीज मंत्र:" : "Sacred Rudraksha & Vedic Siddha Beej Mantras:"}
            </span>
            <div className="text-xs space-y-1.5 text-stone-700">
              <div>{isHi ? "• अनुकूल रुद्राक्ष: 5 मुखी (गुरु कृपा) एवं 7 मुखी (महालक्ष्मी कृपा) रुद्राक्ष का पंचामृत से अभिषेक कर धारण करें।" : "• Auspicious Rudraksha: 5-Mukhi (Jupiter) & 7-Mukhi (Mahalakshmi) energized with Panchamrit."}</div>
              <div>{isHi ? "• नित्य गायत्री मंत्र अथवा महामृत्युंजय मंत्र का 108 बार तुलसी अथवा रुद्राक्ष माला से जप करें।" : "• Daily 108 chants of Gayatri or Mahamrityunjaya Mantra on Tulsi or Rudraksha rosary."}</div>
              <div>{isHi ? "• प्रातः सूर्य अर्घ्य: तांबे के पात्र में जल, अक्षत व लाल चंदन मिलाकर सूर्य देव को अर्घ्य दें।" : "• Early morning Surya Arghya in copper vessel with red sandalwood."}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-1.5">
            <span className="font-bold text-amber-950 block">
              {isHi ? "गृह सुख-शांति हेतु यंत्र स्थापना परामर्श:" : "Sacred Yantra Installation Guide:"}
            </span>
            <p className="text-[11px] text-stone-700 leading-relaxed">
              {isHi
                ? "घर अथवा कार्यस्थल के ईशान कोण (North-East) में भोजपत्र पर अंकित 'श्री संपूर्ण महालक्ष्मी यंत्र' अथवा 'कुबेर यंत्र' की स्थापना करें। नित्य धूप-दीप दिखाने से धन-धान्य की निरंतर वृद्धि होती है।"
                : "Install a consecrated Shree Sampoorna Mahalakshmi Yantra or Kuber Yantra in the North-East direction to anchor continuous prosperity."}
            </p>
          </div>
        </div>
      );

    // PAGE 19: LAL KITAB UPAYAS
    case 19:
      return (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
            <span className="font-serif font-bold text-sm text-stone-900 block">
              {isHi ? "लाल किताब एवं पारंपरिक अचूक उपाय (Karmic Remedies):" : "Lal Kitab & Classical Karmic Remedies:"}
            </span>
            <div className="text-xs space-y-1.5 text-stone-700 leading-relaxed">
              <div>{isHi ? "1. पक्षियों को प्रतिदिन सात प्रकार का अनाज (सप्तधान्य) खुले स्थान पर डालें।" : "1. Feed multi-grain (Sapta-dhanya) mixture to wild birds daily."}</div>
              <div>{isHi ? "2. माता-पिता, गुरुजनों एवं बुजुर्गों के चरण स्पर्श कर नित्य उनका आशीर्वाद प्राप्त करें।" : "2. Seek heartfelt blessings of parents and elders every morning."}</div>
              <div>{isHi ? "3. शनिवार को एक कटोरी सरसों के तेल में अपना मुख देखकर (छाया पात्र) दान करें।" : "3. Donate mustard oil after looking at your reflection (Chhaya Daan) on Saturdays."}</div>
              <div>{isHi ? "4. घर के ईशान कोण (North-East) को सदैव स्वच्छ, जल से सिंचित व सुगंधित रखें।" : "4. Keep the North-East corner of home spotlessly clean, moist, and fragrant."}</div>
              <div>{isHi ? "5. किसी भी महत्वपूर्ण कार्य अथवा यात्रा पर निकलने से पूर्व गुड़ व जल ग्रहण करके निकलें।" : "5. Partake a bite of jaggery and water before embarking on key ventures."}</div>
              <div>{isHi ? "6. चांदी का एक ठोस चौकोर टुकड़ा सदैव अपने बटुए या तिजोरी में सुरक्षित रखें।" : "6. Keep a solid square piece of pure silver in your wallet or financial vault."}</div>
            </div>
          </div>
        </div>
      );

    // PAGE 20: 10-YEAR COMPREHENSIVE YEAR-BY-YEAR LIFE HORIZON & CLOSING ASHIRWAD (EXCEPTIONAL HIGH VALUE)
    case 20:
      return (
        <div className="space-y-3">
          <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
            <span className="font-serif font-bold text-xs sm:text-sm text-amber-950">
              {isHi ? "आगामी 10 वर्षों का विस्तृत वर्षवार भविष्यफल (2026 - 2035)" : "Comprehensive 10-Year Year-by-Year Life Horizon (2026 - 2035)"}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
              10 YEARS
            </span>
          </div>

          <div className="space-y-2">
            {yearlyList.slice(0, 5).map((f: any) => (
              <div key={f.year} className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-xs text-rose-900">{f.year}</span>
                    <span className="text-[10px] font-mono text-stone-500">({isHi ? `आयु: ${f.age} वर्ष` : `Age: ${f.age} yr`})</span>
                    <span className="font-serif font-bold text-[11px] text-amber-950 truncate max-w-[200px] sm:max-w-xs">
                      {isHi ? f.titleHi : f.titleEn}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 shrink-0">
                    {f.rating || 88}% {isHi ? "सफलता" : "Success"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] pt-1">
                  <div className="p-1 rounded bg-white border border-stone-200">
                    <span className="font-bold text-stone-800 block">{isHi ? "💼 करियर:" : "💼 Career:"}</span>
                    <span className="text-stone-600 line-clamp-2">{isHi ? f.careerHi : f.careerEn}</span>
                  </div>
                  <div className="p-1 rounded bg-white border border-stone-200">
                    <span className="font-bold text-stone-800 block">{isHi ? "💰 वित्त:" : "💰 Finance:"}</span>
                    <span className="text-stone-600 line-clamp-2">{isHi ? f.financeHi : f.financeEn}</span>
                  </div>
                  <div className="p-1 rounded bg-white border border-stone-200">
                    <span className="font-bold text-stone-800 block">{isHi ? "🏡 परिवार:" : "🏡 Family:"}</span>
                    <span className="text-stone-600 line-clamp-2">{isHi ? f.familyHi : f.familyEn}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border border-amber-300 text-center space-y-1">
            <span className="font-serif font-bold text-xs text-amber-950 block">
              {isHi ? "॥ ज्योतिषाचार्य AI पावन आशीर्वचन एवं मंगल कामनाएं ॥" : "॥ Jyotish Acharya AI Divine Benediction & Ashirwad ॥"}
            </span>
            <p className="text-[11px] font-serif text-stone-800 italic leading-relaxed">
              {isHi
                ? "हे जातक! नवग्रह मंडल, भगवान सूर्यनारायण एवं देवगुरु बृहस्पति आपकी जीवन यात्रा को ज्ञान, विपुल धन-संपदा, उत्तम आरोग्य, सुयश तथा अखंड सुख-शांति से परिपूर्ण करें। आपके समस्त धर्म सम्मत संकल्प सिद्ध हों। शुभम भवतु!"
                : "O Seeker! May the Navagraha Mandala, Bhagavan Surya Narayana, and Devguru Jupiter illuminate your life with divine wisdom, boundless wealth, robust vitality, and everlasting peace. Shubham Bhavatu!"}
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
}
