import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Flame, ShieldAlert, Coins, HeartHandshake, Briefcase, Eye } from "lucide-react";
import { Language } from "../types";
import secretEnemyImg from "../assets/images/secret_enemy_shadow_1789494023431.jpg";

interface SloganItem {
  id: string;
  badgeHi: string;
  badgeEn: string;
  badgeIcon: React.ReactNode;
  headlineHi: string;
  headlineEn: string;
  subHi: string;
  subEn: string;
  imageUrl: string;
  imageAlt: string;
  ctaHi: string;
  ctaEn: string;
  defaultPromptHi: string;
  defaultPromptEn: string;
}

const VIRAL_ASTRO_SLOGANS: SloganItem[] = [
  {
    id: "graha-dasha",
    badgeHi: "चेतावनी • ग्रह दशा विश्लेषण",
    badgeEn: "ALERT • PLANETARY DASHA",
    badgeIcon: <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />,
    headlineHi: "ग्रहों की यह दुर्लभ दशा आपकी कुंडली में भी हो सकती है!",
    headlineEn: "This Rare Planetary Dasha Could Be Active in Your Kundali Right Now!",
    subHi: "क्या शनि-राहु का गुप्त गोचर आपके बनते कार्यों व करियर को रोक रहा है? अपनी जन्म तिथि (DOB) से 2 मिनट में अचूक सच जानें।",
    subEn: "Is a hidden Saturn or Rahu dasha blocking your wealth & career? Reveal the celestial truth from your DOB in 2 minutes.",
    imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Planetary Ring & Celestial Dasha Alignment",
    ctaHi: "अपनी ग्रह दशा अभी जांचें",
    ctaEn: "Check My Dasha Now",
    defaultPromptHi: "क्या मेरी कुंडली में कोई अशुभ ग्रह दशा या राहु-शनि का प्रभाव चल रहा है?",
    defaultPromptEn: "Is there any harmful planetary dasha or Saturn-Rahu affliction in my chart?",
  },
  {
    id: "rajhans-crorepati",
    badgeHi: "महाधन योग • करोड़पति रहस्य",
    badgeEn: "WEALTH YOGA • CROREPATI DESTINY",
    badgeIcon: <Coins className="w-3.5 h-3.5 text-yellow-400" />,
    headlineHi: "राजहंस योग व गजकेसरी योग: क्या आपकी कुंडली आपको बनाएगी करोड़पति?",
    headlineEn: "Rajhans & Gajakesari Yoga: Is Multi-Crorepati Wealth Destined in Your Chart?",
    subHi: "दशमेश और नवमेश का अद्भुत संयोग—जानें कब खुलेगा आपकी बंद किस्मत का महाताला और कब होगा अकूत धन लाभ!",
    subEn: "The rare alignment of the 9th & 10th houses—discover when your fortune unlocks and brings sudden wealth!",
    imageUrl: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Gleaming Gold Bars & Wealth Treasury",
    ctaHi: "करोड़पति योग का सच जानें",
    ctaEn: "Reveal Wealth Yogas",
    defaultPromptHi: "क्या मेरी कुंडली में राजहंस योग या करोड़पति बनने का कोई गुप्त धन योग है?",
    defaultPromptEn: "Does my chart have Rajhans Yoga or any sudden wealth yoga?",
  },
  {
    id: "dhoka-dob",
    badgeHi: "सत्य उद्घाटन • गुप्त शत्रु योग",
    badgeEn: "EXPOSURE • SECRET ADVERSARIES",
    badgeIcon: <Eye className="w-3.5 h-3.5 text-red-400" />,
    headlineHi: "आपको कौन धोखा दे रहा है? जन्म तिथि (DOB) और राहु की चाल से तुरंत सच जानें!",
    headlineEn: "Who Is Betraying You? Reveal Hidden Enemies & False Friends From Your DOB!",
    subHi: "षष्ठम और अष्टम भाव के गुप्त शत्रु योग का अचूक वैदिक विश्लेषण। अपनों की छिपी सच्चाई और षड्यंत्र से आज ही सावधान हों।",
    subEn: "Classical 6th & 8th house Jyotish analysis exposing betrayal, fake friends, and hidden workplace adversaries.",
    imageUrl: secretEnemyImg,
    imageAlt: "Mysterious Occult Shadow & Rahu Secret Enemy Revelation",
    ctaHi: "गुप्त शत्रु योग तुरंत देखें",
    ctaEn: "Detect Hidden Enemies",
    defaultPromptHi: "मुझे कौन धोखा दे रहा है? मेरी जन्म तिथि से गुप्त शत्रु योग और राहु का प्रभाव बताएं।",
    defaultPromptEn: "Who is working against me? Reveal hidden enemies from my birth chart.",
  },
  {
    id: "vivah-manglik",
    badgeHi: "दांपत्य सत्य • नाड़ी व मांगलिक",
    badgeEn: "RELATIONSHIP • VIVAH YOGA",
    badgeIcon: <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />,
    headlineHi: "विवाह में अड़चन या जीवनसाथी से अनबन? नाड़ी व मांगलिक दोष का अचूक सच!",
    headlineEn: "Marriage Delays or Relationship Turmoil? The Shocking Truth of Mangal & Nadi Dosha!",
    subHi: "सप्तम भाव का दिव्य रहस्य—जानें आपके भावी जीवनसाथी का स्वभाव, रंग-रूप, दिशा और विवाह का वास्तविक शुभ मुहूर्त!",
    subEn: "Sacred 7th House revelations—discover your partner's nature, compatibility, and the exact timing of happy union.",
    imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Traditional Indian Wedding Rituals & Garland Union",
    ctaHi: "विवाह का समय जानें",
    ctaEn: "Predict Marriage Timing",
    defaultPromptHi: "मेरी शादी कब और किससे होगी? क्या मेरी कुंडली में मांगलिक या नाड़ी दोष है?",
    defaultPromptEn: "When will I get married and to whom? Is there any Mangal or Nadi dosha?",
  },
  {
    id: "naukri-promotion",
    badgeHi: "करियर बदलाव • आगामी 6 माह",
    badgeEn: "CAREER SHIFT • NEXT 6 MONTHS",
    badgeIcon: <Briefcase className="w-3.5 h-3.5 text-amber-300" />,
    headlineHi: "नौकरी में प्रमोशन या अचानक भारी नुकसान? जानें आने वाले 6 महीनों का महाफल!",
    headlineEn: "Sudden Promotion or Financial Crisis? Reveal Your Next 6 Months Transit!",
    subHi: "देवगुरु बृहस्पति व कर्मफलदाता शनि के गोचर से जानें कब बदलेगा आपका भाग्य चक्र और कब मिलेगा मनचाहा पद व प्रतिष्ठा।",
    subEn: "Harness approaching Jupiter & Saturn transits to secure career promotion and prevent costly financial blunders.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Modern Glass Skyscrapers Symbolizing Career Elevation",
    ctaHi: "6 महीने का करियर भविष्यफल",
    ctaEn: "Reveal Next 6 Months",
    defaultPromptHi: "आने वाले 6 महीनों में मेरे करियर, नौकरी व आर्थिक स्थिति में क्या बड़ा बदलाव होगा?",
    defaultPromptEn: "What major changes are coming in my career and finances in the next 6 months?",
  },
  {
    id: "shani-sade-sati",
    badgeHi: "सुरक्षा कवच • साढ़े साती व कालसर्प",
    badgeEn: "DIVINE SHIELD • SADE SATI & DOSHA",
    badgeIcon: <Flame className="w-3.5 h-3.5 text-orange-400" />,
    headlineHi: "शनि की साढ़े साती या कालसर्प दोष का साया? आज ही जानें अपना सुरक्षा कवच!",
    headlineEn: "Facing Saturn's Sade Sati or Kaal Sarp Shadow? Claim Your Divine Protective Shield!",
    subHi: "महर्षि पराशर सम्मत अचूक सिद्ध बीज मंत्र, भाग्यशाली रत्न एवं नवग्रह शांति विधान से पाएं सभी संकटों से तत्काल मुक्ति।",
    subEn: "Classical Parashari Beej Mantras, energizing gemstones, and charity alignments to dissolve all planetary afflictions.",
    imageUrl: "https://images.unsplash.com/photo-1574691250077-03a929faece5?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Sacred Golden Diya Lamp & Temple Sanctum Flame",
    ctaHi: "अपना सुरक्षा कवच जानें",
    ctaEn: "Get Vedic Protection",
    defaultPromptHi: "शनि की साढ़े साती या कालसर्प दोष के प्रभाव से बचने के अचूक वैदिक उपाय क्या हैं?",
    defaultPromptEn: "What are the most effective Vedic remedies for Sade Sati and Kaal Sarp dosha?",
  },
];

interface JyotishiSlogansProps {
  lang: Language;
  onSelectPrompt?: (prompt: string) => void;
}

export const JyotishiSlogans: React.FC<JyotishiSlogansProps> = ({ lang, onSelectPrompt }) => {
  // Changes every 4 seconds (4000ms) with related images as strictly requested by user
  const [index, setIndex] = useState(0);
  const isHi = lang === "hi";

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % VIRAL_ASTRO_SLOGANS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = VIRAL_ASTRO_SLOGANS[index];

  const handleCtaClick = () => {
    const promptToSend = isHi ? current.defaultPromptHi : current.defaultPromptEn;
    if (onSelectPrompt) {
      onSelectPrompt(promptToSend);
    } else {
      // Dispatch global custom event for smooth chat input filling
      window.dispatchEvent(
        new CustomEvent("astro_select_prompt", { detail: { prompt: promptToSend } })
      );
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#120f26]/95 via-[#181335]/95 to-[#0e0c1f]/95 border-2 border-amber-500/40 p-4 sm:p-6 md:p-8 shadow-[0_16px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition-all duration-700">
      {/* Dynamic Background Radial Glow */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Side: Massive Hero Headline, High-Converting Subtext, and CTA */}
        <div className="flex-1 space-y-3 sm:space-y-4 text-center lg:text-left">
          {/* Slogan Live Badge with Icon */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase shadow-xs">
            {current.badgeIcon}
            <span>{isHi ? current.badgeHi : current.badgeEn}</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>

          {/* Hero Slogan: Big Impactful Size as on high-converting landing pages */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[44px] font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-400 leading-[1.2] transition-all duration-500 drop-shadow-md">
            "{isHi ? current.headlineHi : current.headlineEn}"
          </h2>

          {/* Subtitle / Description Hook */}
          <p className="text-xs sm:text-sm md:text-base text-stone-300 leading-relaxed max-w-3xl font-sans transition-all duration-500">
            {isHi ? current.subHi : current.subEn}
          </p>

          {/* Quick CTA and 2-Second Slogan Switcher Indicators */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
            <button
              onClick={handleCtaClick}
              className="px-5 py-2.5 rounded-xl gold-button text-stone-950 font-serif font-bold text-xs sm:text-sm shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>{isHi ? current.ctaHi : current.ctaEn}</span>
              <ArrowRight className="w-4 h-4 text-stone-950" />
            </button>

            {/* Micro 4-Second Indicator Pills */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/40 border border-white/10">
              <span className="text-[10px] font-mono font-semibold text-amber-400/80 mr-1 hidden sm:inline">
                {isHi ? "4 सेकंड में अपडेट" : "Every 4s"}
              </span>
              {VIRAL_ASTRO_SLOGANS.map((slogan, i) => (
                <button
                  key={slogan.id}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === index
                      ? "w-6 bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_10px_#f59e0b]"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Slogan ${i + 1}`}
                  title={isHi ? slogan.headlineHi : slogan.headlineEn}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Related Image with Cosmic Golden Frame & Elastic Transition */}
        <div className="relative shrink-0 w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[300px] xl:max-w-[340px] aspect-[4/3] rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-[0_10px_35px_rgba(0,0,0,0.8)] group">
          <img
            key={current.imageUrl}
            src={current.imageUrl}
            alt={current.imageAlt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Subtle Golden Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3.5">
            <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {isHi ? "वैदिक ग्रह चक्र" : "Vedic Astro Matrix"}
            </span>
            <p className="text-xs font-serif font-bold text-white line-clamp-1">
              {isHi ? current.badgeHi : current.badgeEn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
