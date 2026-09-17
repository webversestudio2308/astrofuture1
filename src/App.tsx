import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { KundaliView } from "./components/KundaliView";
import { HoroscopeView } from "./components/HoroscopeView";
import { MatchmakingView } from "./components/MatchmakingView";
import { RemediesView } from "./components/RemediesView";
import { AstrologerChat } from "./components/AstrologerChat";
import { ReviewsSection } from "./components/ReviewsSection";
import { CosmicBackground } from "./components/CosmicBackground";
import { AstroLogo } from "./components/AstroLogo";
import { JyotishiSlogans } from "./components/JyotishiSlogans";
import { LegalModal, LegalPageType } from "./components/LegalModals";
import { Language } from "./types";
import { Sparkles, Shield, Compass, Heart, Star, Users, CheckCircle2, Lock, ArrowUpRight } from "lucide-react";
import { loadSessionFromServer } from "./utils/syncStore";

export default function App() {
  // Application starts directly with Acharya AI Chat!
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [legalModalType, setLegalModalType] = useState<LegalPageType>(null);
  // Default to Hindi (100% Hindi on launch, as explicitly instructed by user)
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem("astro_app_lang") as Language) || "hi";
  });
  const [customKey, setCustomKey] = useState<string>(() => {
    return localStorage.getItem("astro_gemini_custom_key") || "";
  });
  const [isApiHealthy, setIsApiHealthy] = useState<boolean>(true);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("astro_app_lang", newLang);
  };

  useEffect(() => {
    checkApiStatus();
  }, [customKey]);

  // Ensure page always opens cleanly at the top on initial load and tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [activeTab]);

  // Handle direct links for Razorpay compliance reviews and ?sync=... auto-restoration
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname.toLowerCase().replace(/^\//, "");
      const hash = window.location.hash.toLowerCase().replace(/^#/, "");
      const params = new URLSearchParams(window.location.search);
      const page = params.get("page")?.toLowerCase() || "";

      // Auto-restore session if ?sync=CODE is in URL (e.g. shared from another device)
      const syncCode = params.get("sync");
      if (syncCode) {
        loadSessionFromServer(syncCode).then((res) => {
          if (res.success) {
            // Clean URL query param without full page reload
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
        });
      }

      const target = path || hash || page;
      if (target === "terms" || target === "terms-and-conditions") {
        setLegalModalType("terms");
      } else if (target === "privacy" || target === "privacy-policy") {
        setLegalModalType("privacy");
      } else if (target === "refund" || target === "cancellation" || target === "refund-policy") {
        setLegalModalType("refund");
      } else if (target === "contact" || target === "contact-us") {
        setLegalModalType("contact");
      }
    };

    handleUrlRouting();
    window.addEventListener("hashchange", handleUrlRouting);
    return () => window.removeEventListener("hashchange", handleUrlRouting);
  }, []);

  const checkApiStatus = async () => {
    try {
      const headers: Record<string, string> = {};
      if (customKey) {
        headers["x-gemini-api-key"] = customKey;
      }
      const res = await fetch("/api/check-key", { method: "POST", headers });
      const data = await res.json();
      setIsApiHealthy(Boolean(data.valid));
    } catch {
      setIsApiHealthy(false);
    }
  };

  const handleUpdateCustomKey = (key: string) => {
    setCustomKey(key);
    if (key) {
      localStorage.setItem("astro_gemini_custom_key", key);
    } else {
      localStorage.removeItem("astro_gemini_custom_key");
    }
    checkApiStatus();
  };

  return (
    <div className="min-h-screen bg-[#050509] text-[#e2e0ee] selection:bg-amber-500/30 selection:text-amber-200 relative overflow-x-hidden font-sans">
      {/* Dynamic 5-Layer Cosmic Background: Space, Nebula, Stars, Geometry & Glow */}
      <CosmicBackground />

      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        lang={lang}
        onLanguageChange={handleLanguageChange}
        isApiHealthy={isApiHealthy}
        onOpenSync={() => window.dispatchEvent(new CustomEvent("astro_open_sync_modal"))}
      />

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* PRIMARY VIEW: Direct Acharya AI Chat Landing Page */}
        {activeTab === "chat" && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            {/* Vedic Astrology Slogans Ticker */}
            <JyotishiSlogans lang={lang} />

            {/* Acharya AI Direct Chat Component (with ₹51 upsell, 3 life answers, and in-chat Kundali + 20-Page PDF) */}
            <AstrologerChat
              lang={lang}
              customKey={customKey}
            />

            {/* Trustworthy Social Proof & Reviews Section: 12,000+ Kundalis, 4.9/5 Rating */}
            <ReviewsSection lang={lang} />

            {/* Quick Explore Secondary Features Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0e0c1b]/80 border border-white/10 shadow-lg space-y-4 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                    {lang === "hi" ? "अतिरिक्त शास्त्रीय वैदिक उपकरण" : "Explore Classical Vedic Tools"}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-amber-100 mt-1">
                    {lang === "hi"
                      ? "विस्तृत जन्म कुंडली, दैनिक राशिफल एवं कुंडली मिलान"
                      : "Birth Chart Calculator, Daily Horoscopes & Kundali Milan"}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 max-w-xl">
                    {lang === "hi"
                      ? "36 गुण अष्टकूट मिलान, दैनिक गोचर राशिफल एवं शास्त्रीय रत्न परामर्श।"
                      : "Classical 36-Guna Ashtakoot marriage matching, planetary transits, and gemstone guide."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setActiveTab("kundali")}
                    className="px-4 py-2.5 rounded-xl bg-[#141224] border border-white/10 text-xs font-semibold text-stone-300 hover:border-amber-400/50 hover:text-amber-200 hover:bg-[#1a1730] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === "hi" ? "जन्म कुंडली चक्र" : "Kundali Chart"}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("milan")}
                    className="px-4 py-2.5 rounded-xl bg-[#141224] border border-white/10 text-xs font-semibold text-stone-300 hover:border-rose-400/50 hover:text-rose-200 hover:bg-[#1a1730] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>{lang === "hi" ? "कुंडली मिलान" : "Matchmaking"}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("horoscope")}
                    className="px-4 py-2.5 rounded-xl bg-[#141224] border border-white/10 text-xs font-semibold text-stone-300 hover:border-amber-400/50 hover:text-amber-200 hover:bg-[#1a1730] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === "hi" ? "दैनिक राशिफल" : "Horoscope"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECONDARY VIEW 1: Classical Birth Chart (Kundali) */}
        {activeTab === "kundali" && (
          <KundaliView
            lang={lang}
            customKey={customKey}
          />
        )}

        {/* SECONDARY VIEW 2: Daily Horoscope */}
        {activeTab === "horoscope" && (
          <HoroscopeView
            lang={lang}
            customKey={customKey}
          />
        )}

        {/* SECONDARY VIEW 3: Kundali Milan (Matchmaking) */}
        {activeTab === "milan" && (
          <MatchmakingView
            lang={lang}
            customKey={customKey}
          />
        )}

        {/* SECONDARY VIEW 4: Remedies & Gemstones */}
        {activeTab === "remedies" && (
          <RemediesView lang={lang} />
        )}
      </main>

      {/* Global Futuristic Dark Glass Footer */}
      <footer className="mt-16 border-t border-white/10 bg-[#080811]/90 backdrop-blur-xl py-10 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <AstroLogo size={36} />

            <div className="flex flex-wrap items-center justify-center gap-4 text-stone-300 text-xs font-medium">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-white">4.9 / 5</span> Rating
              </span>
              <span className="text-white/20">•</span>
              <span className="font-semibold text-white">12,450+</span> Kundalis Generated
              <span className="text-white/20">•</span>
              <span>Lahiri Ayanamsha</span>
              <span className="text-white/20">•</span>
              <span>Vimshottari Dasha</span>
            </div>
          </div>

          {/* Professional Advisory / Legal Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-[#110f1e]/80 border border-amber-500/20 text-stone-300 text-xs space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1.5 font-serif font-bold text-amber-300 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === "hi" ? "⚠️ महत्वपूर्ण वैधानिक परामर्श एवं सूचना (Legal Advisory & Astrological Disclaimer)" : "⚠️ Professional Astrological Advisory & Disclaimer"}</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              {lang === "hi"
                ? "यह जन्म कुंडली विश्लेषण एवं ज्योतिषीय संवाद प्राचीन वैदिक पराशरी सिद्धांतों तथा उन्नत कम्प्यूटरीकृत एल्गोरिदम (Computerized Algorithms) पर आधारित है। यह सेवा केवल आत्म-चिंतन, आध्यात्मिक प्रेरणा एवं धार्मिक मार्गदर्शन हेतु है। भविष्य के किसी भी परिणाम, घटना अथवा फलादेश की कोई औपचारिक या विधिक गारंटी (No Guarantee) नहीं है। महत्वपूर्ण चिकित्सा, कानूनी, वित्तीय या व्यक्तिगत निर्णयों में अपने स्वविवेक व अधिकृत विशेषज्ञों का परामर्श अवश्य लें।"
                : "This Janam Kundali analysis and consultation are based on classical Vedic Parashari mathematics and computational algorithms. Offered purely for spiritual reflection and personal guidance. No warranty or guarantee of any kind is made regarding future events or predictions. Users should exercise independent judgment and consult licensed professionals for critical legal, medical, or financial matters."}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
            <p className="text-center md:text-left leading-relaxed max-w-2xl">
              {lang === "hi"
                ? "ASTROFUTURE: पराशरी वैदिक ज्योतिष, निरयण स्पष्ट ग्रह गणना, लाहिरी अयनांश एवं प्रमाणित भारतीय पंचांग सिद्धांतों द्वारा संचालित। केवल आध्यात्मिक ज्ञान एवं व्यक्तिगत मार्गदर्शन हेतु।"
                : "ASTROFUTURE: Powered by Nirayana Sidereal longitudes, Lahiri Ayanamsha, 36 Guna Ashtakoot matching, and Authentic Classical Vedic Jyotish. For spiritual self-reflection and guidance."}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 md:gap-4 text-stone-400 font-medium text-[10px] md:text-[11px]">
              <button
                onClick={() => setLegalModalType("terms")}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Terms & Conditions
              </button>
              <span className="text-white/20">•</span>
              <button
                onClick={() => setLegalModalType("privacy")}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span className="text-white/20">•</span>
              <button
                onClick={() => setLegalModalType("refund")}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Refund Policy
              </button>
              <span className="text-white/20">•</span>
              <button
                onClick={() => setLegalModalType("contact")}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </footer>
      
      <LegalModal 
        type={legalModalType} 
        onClose={() => setLegalModalType(null)} 
        lang={lang} 
      />
    </div>
  );
}
