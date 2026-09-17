import React from "react";
import { Sparkles, ShieldCheck, Moon, Compass, HeartHandshake, Gem, MessageSquareQuote, Star, UserPlus, Cloud } from "lucide-react";
import { Language } from "../types";
import { AstroLogo } from "./AstroLogo";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  isApiHealthy: boolean;
  onOpenBirthDetails?: () => void;
  onOpenSync?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  lang,
  onLanguageChange,
  isApiHealthy,
  onOpenBirthDetails,
  onOpenSync,
}) => {
  const tabs = [
    {
      id: "chat",
      label: lang === "hi" ? "आचार्य परामर्श (Acharya Chat)" : "Acharya Consultation",
      icon: MessageSquareQuote,
      isHot: true,
    },
    {
      id: "kundali",
      label: lang === "hi" ? "जन्म कुंडली (Kundali)" : "Birth Chart (Kundali)",
      icon: Compass,
    },
    {
      id: "horoscope",
      label: lang === "hi" ? "दैनिक राशिफल (Horoscope)" : "Daily Horoscope",
      icon: Moon,
    },
    {
      id: "milan",
      label: lang === "hi" ? "कुंडली मिलान (Matchmaking)" : "Kundali Milan",
      icon: HeartHandshake,
    },
    {
      id: "remedies",
      label: lang === "hi" ? "रत्न व उपाय (Remedies)" : "Gemstones & Remedies",
      icon: Gem,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#080811]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main top row */}
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <div
            className="cursor-pointer flex items-center transition-transform hover:scale-[1.01] active:scale-[0.99]"
            onClick={() => onTabChange("chat")}
            title="AstroFuture - Ancient Wisdom"
          >
            <AstroLogo size={46} />
          </div>

          {/* Center Trust Metric */}
          <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#11101D]/80 border border-amber-500/20 text-xs text-amber-100/90 shadow-inner">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold font-mono">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              4.9 / 5
            </span>
            <span className="text-white/20">•</span>
            <span className="font-mono text-purple-200/80 font-medium">12,450+ Kundalis Analyzed</span>
            <span className="text-white/20">•</span>
            <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Certified Vedic Jyotish
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sync / Save Data Trigger */}
            {onOpenSync && (
              <button
                onClick={onOpenSync}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-950/40 border border-purple-500/30 text-purple-200 hover:bg-purple-900/50 hover:border-amber-400/40 hover:scale-[1.02] active:scale-95 transition-all shadow-inner cursor-pointer"
                title={lang === "hi" ? "डेटा सुरक्षित करें या दूसरे फोन में लोड करें" : "Save or restore data on another device"}
              >
                <Cloud className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{lang === "hi" ? "सेव / सिंक" : "Save & Sync"}</span>
              </button>
            )}

            {/* Enter / Edit Birth Details Fast Trigger */}
            {onOpenBirthDetails && (
              <button
                onClick={onOpenBirthDetails}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-200 hover:bg-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all shadow-inner"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">{lang === "hi" ? "विवरण भरें" : "Enter Details"}</span>
              </button>
            )}

            {/* Language switch */}
            <div className="flex items-center rounded-xl bg-[#11101D] border border-white/10 p-0.5">
              <button
                onClick={() => onLanguageChange("hi")}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  lang === "hi"
                    ? "bg-amber-500/20 text-amber-200 shadow-sm border border-amber-500/20"
                    : "text-stone-400 hover:text-stone-300 transparent border border-transparent"
                }`}
              >
                हिं
              </button>
              <button
                onClick={() => onLanguageChange("en")}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all ${
                  lang === "en"
                    ? "bg-amber-500/20 text-amber-200 shadow-sm border border-amber-500/20"
                    : "text-stone-400 hover:text-stone-300 transparent border border-transparent"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Floating futuristic glass tabs */}
        <nav className="flex space-x-1.5 sm:space-x-2 overflow-x-auto pb-2.5 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-t-xl sm:rounded-xl text-xs font-semibold transition-all whitespace-nowrap
                  ${
                    isActive
                      ? "bg-amber-500/10 text-amber-300 shadow-[inset_0_-2px_0_#f59e0b] sm:shadow-[0_0_12px_rgba(245,158,11,0.15)] sm:border sm:border-amber-500/30"
                      : "text-stone-400 hover:text-amber-200 hover:bg-white/[0.03] border border-transparent"
                  }
                `}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-amber-400" : "text-stone-500"
                  }`}
                />
                {tab.label}
                {tab.isHot && !isActive && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                )}
                {tab.isHot && !isActive && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
