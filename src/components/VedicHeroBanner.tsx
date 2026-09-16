import React, { useState, useEffect } from "react";
import { Sparkles, Compass, Star, ChevronLeft, ChevronRight, BookOpen, Quote } from "lucide-react";
import { Language } from "../types";

interface VedicHeroBannerProps {
  lang: Language;
  onOpenBirthDetails?: () => void;
  hasBirthDetails?: boolean;
}

// Curated high-resolution Vedic astrology & celestial imagery
const ASTRO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&w=1600&q=80",
    title: "खगोलीय कालचक्र (Cosmic Celestial Sphere)",
    desc: "Ancient Vedic Astrolabe & Astronomical Longitudes",
  },
  {
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
    title: "पवित्र नवग्रह मंडल (Sacred Navagraha Mandala)",
    desc: "Golden Vedic Geometry & Planetary Harmony",
  },
  {
    url: "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&w=1600&q=80",
    title: "प्राचीन तालपत्र जन्मपत्री (Ancient Horoscope Manuscript)",
    desc: "Parashari Jyotish Principles & Palm-Leaf Wisdom",
  },
  {
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80",
    title: "नक्षत्र मंडल एवं राशि चक्र (Zodiac & Nakshatras)",
    desc: "Sidereal Constellations & Nirayana Alignment",
  },
  {
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80",
    title: "यज्ञ, दीप एवं नवग्रह शांति (Sacred Flame & Rituals)",
    desc: "Karmic Remedies & Spiritual Auspiciousness",
  },
];

// Authentic Classical Jyotish Shlokas & Slogans
const VEDIC_SLOGANS = [
  {
    sanskrit: "ज्योतिषां सूर्यमादित्यं तारकाणां महौजसम्।",
    meaningHi: "ग्रहों में सूर्य प्रत्यक्ष देवता हैं, जो संपूर्ण ब्रह्मांड के भाग्य और प्रकाश के मूल स्रोत हैं।",
    meaningEn: "The Sun is the primal light of the cosmos, illuminating every soul's karmic path.",
    source: "ऋग्वेद / सूर्य सिद्धांत",
  },
  {
    sanskrit: "ग्रह राज्यं प्रयच्छन्ति ग्रह राज्यं हरन्ति च। ग्रहैर्व्याप्तमिदं सर्वं त्रैलोक्यं सचराचरम्॥",
    meaningHi: "ग्रह ही साम्राज्य और समृद्धि प्रदान करते हैं और वही धैर्य की परीक्षा लेते हैं। समस्त त्रैलोक्य ग्रह सत्ता से संव्याप्त है।",
    meaningEn: "Planets bestow fortunes and guide trials; the entire cosmos operates under celestial harmony.",
    source: "बृहत् पराशर होरा शास्त्र",
  },
  {
    sanskrit: "यत्पिण्डे तद्ब्रह्माण्डे, यद्ब्रह्माण्डे तत्पिण्डे।",
    meaningHi: "जो इस मानव शरीर और अंतरात्मा में है, वही सम्पूर्ण ब्रह्मांड में विद्यमान है।",
    meaningEn: "As within the human soul (Microcosm), so within the vast Cosmic Universe (Macrocosm).",
    source: "यजुर्वेद उपनिषद्",
  },
  {
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
    meaningHi: "कर्म (पुरुषार्थ) पर तुम्हारा अधिकार है; ग्रहों की अनुकूलता कर्म को सिद्धि प्रदान करती है।",
    meaningEn: "Thy right is to right action alone; planetary grace aligns with virtuous human endeavor.",
    source: "श्रीमद्भगवद्गीता",
  },
  {
    sanskrit: "सर्वमंगल मांगल्ये शिवे सर्वार्थ साधिके। शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥",
    meaningHi: "समस्त मंगलों की प्रदाता, सर्वार्थ सिद्ध करने वाली पराशक्ति का पावन स्मरण।",
    meaningEn: "Salutations to the auspicious divine energy that fulfills righteous desires and grants peace.",
    source: "दुर्गा सप्तशती",
  },
];

export const VedicHeroBanner: React.FC<VedicHeroBannerProps> = ({
  lang,
  onOpenBirthDetails,
  hasBirthDetails,
}) => {
  // Image index rotates every 2 seconds (2000ms)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    // 2-second interval for background image change
    const imgInterval = setInterval(() => {
      setIsZooming(true);
      setCurrentImageIndex((prev) => (prev + 1) % ASTRO_IMAGES.length);
      setTimeout(() => setIsZooming(false), 800);
    }, 2000);

    // 5-second interval for slogan change
    const sloganInterval = setInterval(() => {
      setCurrentSloganIndex((prev) => (prev + 1) % VEDIC_SLOGANS.length);
    }, 5000);

    return () => {
      clearInterval(imgInterval);
      clearInterval(sloganInterval);
    };
  }, []);

  const activeSlogan = VEDIC_SLOGANS[currentSloganIndex];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-amber-200/80 shadow-[0_4px_24px_-4px_rgba(180,83,9,0.12)] bg-gradient-to-b from-[#fffefc] to-[#fbf8f2] mb-6">
      {/* Background Image Carousel with Elastic Zoom/Spring Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
        {ASTRO_IMAGES.map((img, idx) => {
          const isActive = idx === currentImageIndex;
          return (
            <div
              key={img.url}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isActive ? "opacity-35" : "opacity-0"
              }`}
            >
              <img
                src={img.url}
                alt={img.title}
                className={`w-full h-full object-cover object-center transform transition-transform duration-[2000ms] ${
                  isActive
                    ? isZooming
                      ? "scale-110"
                      : "scale-105"
                    : "scale-100"
                }`}
                style={{
                  transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Elastic spring curve
                  willChange: "transform, opacity",
                }}
              />
            </div>
          );
        })}

        {/* Elegant Light Theme Multi-Tone Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fffefc]/95 via-[#fbf8f2]/90 to-[#fffefc]/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fbf8f2] via-transparent to-[#fffefc]/60" />

        {/* Subtle Sacred Geometry Mandala Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
          style={{
            backgroundImage: `radial-gradient(#b45309 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-5 sm:px-8 py-6 sm:py-8 flex flex-col gap-5">
        {/* Top Sacred Shloka & Slogan Bar */}
        <div className="p-4 rounded-2xl bg-white/90 border border-amber-200/70 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100/80 border border-amber-300 flex items-center justify-center shrink-0 mt-0.5 text-amber-800">
                <Quote className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 font-bold block">
                  {lang === "hi" ? "॥ महर्षि पराशर वैदिक सूत्र ॥" : "॥ Sacred Vedic Astrology Canon ॥"} • {activeSlogan.source}
                </span>
                <p className="text-base sm:text-lg font-serif font-bold text-stone-900 mt-0.5 tracking-wide">
                  {activeSlogan.sanskrit}
                </p>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                  {lang === "hi" ? activeSlogan.meaningHi : activeSlogan.meaningEn}
                </p>
              </div>
            </div>

            {/* Slogan Dots & Image Indicator */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <div className="flex gap-1">
                {VEDIC_SLOGANS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSloganIndex(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === currentSloganIndex
                        ? "w-6 bg-amber-600"
                        : "w-1.5 bg-stone-300 hover:bg-stone-400"
                    }`}
                    title={`Shloka ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Core Hero Message & Action Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-900 border border-rose-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-700" />
                {lang === "hi" ? "वैदिक ज्योतिष परामर्श" : "Vedic Jyotish Consultation"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                {lang === "hi" ? "लाहिरी अयनांश • निरयण गणना" : "Lahiri Ayanamsha • Nirayana Precision"}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-stone-100 text-stone-700 border border-stone-200">
                2s Elastic Dynamic View
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-extrabold text-stone-900 tracking-tight leading-snug">
              {lang === "hi" ? (
                <>
                  प्रत्यक्ष ज्योतिषाचार्य संवाद एवं <span className="text-rose-800">20 पृष्ठीय विस्तृत महाकुंडली</span>
                </>
              ) : (
                <>
                  Direct Jyotish Acharya Guidance & <span className="text-rose-800">20-Page Complete MahaKundali</span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {lang === "hi"
                ? "ग्रह चाल, विंशोत्तरी महादशा, साढ़े साती, मांगलिक दोष एवं अष्टकवर्ग का शास्त्रीय सूक्ष्म अध्ययन। सीधे पूज्य आचार्य जी से प्रश्न पूछें या अपनी संपूर्ण रंगीन जन्म कुंडली प्राप्त करें।"
                : "Deep planetary mathematics, Vimshottari Dasha, Sade Sati, Manglik dosha, and Ashtakavarga. Consult Acharya Ji directly or download your certified 20-page Janam Kundali."}
            </p>
          </div>

          {/* Call to Action Button */}
          {onOpenBirthDetails && (
            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onOpenBirthDetails}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-800 via-rose-800 to-amber-800 hover:from-red-900 hover:to-amber-900 text-white font-serif font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-400/40"
              >
                <Compass className="w-4 h-4 text-amber-300" />
                <span>
                  {hasBirthDetails
                    ? lang === "hi"
                      ? "जन्म विवरण बदलें / अपडेट करें"
                      : "Edit Birth Details"
                    : lang === "hi"
                    ? "✨ जन्म विवरण दर्ज करें"
                    : "✨ Enter Birth Details"}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* 2-Second Rotating Image Meta Pill */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-200/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-stone-700">
              {ASTRO_IMAGES[currentImageIndex].title}
            </span>
            <span className="hidden sm:inline text-stone-400">•</span>
            <span className="hidden sm:inline text-stone-500">
              {ASTRO_IMAGES[currentImageIndex].desc}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-800">
            <span>{currentImageIndex + 1} / {ASTRO_IMAGES.length}</span>
            <span className="text-stone-300">|</span>
            <span>2.0s</span>
          </div>
        </div>
      </div>
    </div>
  );
};
