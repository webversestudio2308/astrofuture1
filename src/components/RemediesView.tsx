import React, { useState } from "react";
import { Language } from "../types";
import { Gem, Sparkles, Shield, Compass, Heart, Feather, BookOpen, CheckCircle2 } from "lucide-react";

interface RemediesViewProps {
  lang: Language;
}

const NAVAGRAHA_GEMS = [
  {
    planet: "Sun (Surya)",
    stone: "Ruby",
    hindi: "माणिक्य (Manikya)",
    color: "Deep Crimson Red",
    metal: "Gold or Copper",
    finger: "Ring Finger (Right Hand)",
    day: "Sunday sunrise",
    mantra: "Om Hram Hreem Hroum Sah Suryaya Namah (ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः)",
    benefits: "Boosts confidence, vital health, leadership, executive success, and father's blessings.",
    benefitsHi: "आत्मविश्वास, उत्तम स्वास्थ्य, नेतृत्व क्षमता, प्रशासनिक सफलता और पिता का आशीर्वाद प्रदान करता है।",
  },
  {
    planet: "Moon (Chandra)",
    stone: "Natural Pearl",
    hindi: "सच्चा मोती (Moti)",
    color: "Shimmering Milky White",
    metal: "Pure Silver",
    finger: "Little Finger (Right Hand)",
    day: "Monday evening",
    mantra: "Om Shram Shreem Shroum Sah Chandraya Namah (ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः)",
    benefits: "Calms emotional volatility, anxiety, brings mental peace, intuition, and mother's love.",
    benefitsHi: "मानसिक अशांति व चिंता दूर करता है, चित्त को शांत करता है और माता का स्नेह बढ़ाता है।",
  },
  {
    planet: "Mars (Mangala)",
    stone: "Red Coral",
    hindi: "मूंगा (Moonga)",
    color: "Opaque Vermillion",
    metal: "Copper or Gold",
    finger: "Ring Finger",
    day: "Tuesday morning",
    mantra: "Om Kram Kreem Kroum Sah Bhaumaya Namah (ॐ क्रां क्रीं क्रौं सः भौमाय नमः)",
    benefits: "Dispels lethargy, strengthens vitality, courage, real estate endeavors, and mitigates Kuja Dosha.",
    benefitsHi: "आलस्य दूर करता है, अदम्य साहस, पराक्रम, भूमि लाभ देता है और मांगलिक प्रभाव को संतुलित करता है।",
  },
  {
    planet: "Mercury (Budha)",
    stone: "Emerald",
    hindi: "पन्ना (Panna)",
    color: "Vibrant Lush Green",
    metal: "Gold or Bronze",
    finger: "Little Finger",
    day: "Wednesday morning",
    mantra: "Om Bram Breem Broum Sah Budhaya Namah (ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः)",
    benefits: "Sharpens intellect, memory, public speaking, trading, and business acumen.",
    benefitsHi: "कुशाग्र बुद्धि, व्यापारिक निपुणता, स्मरण शक्ति और संवाद कला में अभूतपूर्व वृद्धि करता है।",
  },
  {
    planet: "Jupiter (Guru)",
    stone: "Yellow Sapphire",
    hindi: "पुखराज (Pukhraj)",
    color: "Luminous Golden Yellow",
    metal: "Pure Yellow Gold or Brass",
    finger: "Index Finger",
    day: "Thursday morning",
    mantra: "Om Gram Greem Groum Sah Gurave Namah (ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः)",
    benefits: "Enhances wisdom, spiritual growth, financial wealth, marital happiness, and progeny.",
    benefitsHi: "ज्ञान, आध्यात्मिक उन्नति, अकूत धन संपदा, वैवाहिक सौख्य और संतान सुख में वृद्धि करता है।",
  },
  {
    planet: "Venus (Shukra)",
    stone: "Diamond / White Zircon",
    hindi: "हीरा / ओपल (Heera / Opal)",
    color: "Clear Brilliant White",
    metal: "Platinum or Silver",
    finger: "Middle or Little Finger",
    day: "Friday sunrise",
    mantra: "Om Dram Dreem Droum Sah Shukraya Namah (ॐ द्रां द्रीं द्रौं सः शुक्राय नमः)",
    benefits: "Attracts luxury, artistic creativity, romantic harmony, charisma, and aesthetic joy.",
    benefitsHi: "ऐश्वर्य, कला, प्रेम संबंध, आकर्षण एवं भौतिक सुख-सुविधाओं में वृद्धि करता है।",
  },
  {
    planet: "Saturn (Shani)",
    stone: "Blue Sapphire / Amethyst",
    hindi: "नीलम (Neelam)",
    color: "Deep Royal Velvet Blue",
    metal: "Silver or Panchdhatu",
    finger: "Middle Finger",
    day: "Saturday dusk",
    mantra: "Om Pram Preem Proum Sah Shanaischaraya Namah (ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः)",
    benefits: "Instills laser discipline, perseverance, protects against untimely setbacks, and rewards hard karma.",
    benefitsHi: "दृढ़ अनुशासन, धैर्य, न्याय, अकस्मात विपत्तियों से रक्षा और कर्मठता का शुभ फल देता है।",
  },
  {
    planet: "Rahu",
    stone: "Hessonite Garnet",
    hindi: "गोमेद (Gomed)",
    color: "Honey-Amber Smoke",
    metal: "Silver or Alloy",
    finger: "Middle Finger",
    day: "Saturday night",
    mantra: "Om Bhram Bhreem Bhroum Sah Rahave Namah (ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः)",
    benefits: "Clears mental illusions, prevents sudden losses, and stabilizes ambition in technology & foreign ventures.",
    benefitsHi: "भ्रम व मानसिक भय दूर करता है, अचानक हानि से बचाता है और विदेशी कार्यों में सफलता देता है।",
  },
  {
    planet: "Ketu",
    stone: "Cat's Eye Chrysoberyl",
    hindi: "लहसुनिया (Lehsunia)",
    color: "Greenish-Yellow Silky Ray",
    metal: "Silver or Gold",
    finger: "Little or Middle Finger",
    day: "Tuesday or Thursday midnight",
    mantra: "Om Stram Streem Stroum Sah Ketave Namah (ॐ स्रां स्रीं स्रौं सः केतवे नमः)",
    benefits: "Awakens spiritual enlightenment, deep intuition, breaks negative ancestral karmic bonds.",
    benefitsHi: "अध्यात्म, मोक्ष, गूढ़ अंतर्ज्ञान और पूर्व जन्मों के ऋणों से मुक्ति दिलाने में सहायक है।",
  },
];

export const RemediesView: React.FC<RemediesViewProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<"gems" | "mantras" | "rituals">("gems");

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="rounded-3xl bg-[#0e0c1b]/90 border border-amber-500/30 p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2 font-mono">
          <Gem className="w-3.5 h-3.5 text-amber-400" />
          {lang === "hi" ? "शास्त्रीय वैदिक रत्न एवं महाज्योतिषी उपाय" : "Vedic Gemology & Astrological Remedies"}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-amber-100">
          {lang === "hi" ? "नवग्रह रत्न, सिद्ध बीज मंत्र व दान विधान" : "Navagraha Gemstones, Beej Mantras & Karmic Upayas"}
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 mt-1">
          {lang === "hi"
            ? "ग्रह दोष शमन, मानसिक शांति एवं भाग्य वृद्धि हेतु महर्षि पराशर एवं लाल किताब सम्मत अचूक उपाय।"
            : "Authentic Parashari remedial science covering gemstones, energized Beej Mantras, charity rules, and yantras."}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        {[
          { id: "gems", label: lang === "hi" ? "नवग्रह रत्न (Gemstones)" : "Navagraha Gemstones", icon: Gem },
          { id: "mantras", label: lang === "hi" ? "सिद्ध बीज मंत्र (Mantras)" : "Sacred Mantras", icon: Feather },
          { id: "rituals", label: lang === "hi" ? "दोष शांति दान (Charity Rules)" : "Remedial Charity", icon: Heart },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                isActive
                  ? "gold-button text-stone-950 font-bold shadow-md"
                  : "bg-[#131124]/90 border border-white/10 text-stone-300 hover:text-white hover:border-amber-500/30"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Gemstones Grid */}
      {activeTab === "gems" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {NAVAGRAHA_GEMS.map((g) => (
            <div
              key={g.planet}
              className="rounded-3xl bg-[#0e0c1b]/80 border border-white/10 p-5 shadow-xl hover:border-amber-500/40 transition-all space-y-3 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide block font-mono">
                    {g.planet}
                  </span>
                  <h3 className="text-base font-bold font-serif text-amber-100 mt-0.5">
                    {lang === "hi" ? g.hindi : `${g.stone} (${g.hindi})`}
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-950/40 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold">
                  💎
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-stone-300">
                <div className="flex justify-between">
                  <span className="text-stone-400">{lang === "hi" ? "धातु:" : "Metal:"}</span>
                  <span className="font-semibold text-amber-200">{g.metal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">{lang === "hi" ? "उंगली:" : "Finger:"}</span>
                  <span className="font-semibold text-amber-200">{g.finger}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">{lang === "hi" ? "शुभ वार:" : "Day:"}</span>
                  <span className="font-semibold text-amber-200">{g.day}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#141224] border border-white/10 text-[11px] font-mono text-stone-300">
                {g.mantra}
              </div>

              <p className="text-xs text-stone-300 leading-relaxed italic pt-1">
                {lang === "hi" ? g.benefitsHi : g.benefits}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Mantras Section */}
      {activeTab === "mantras" && (
        <div className="rounded-3xl bg-[#0e0c1b]/80 border border-white/10 p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
          <h3 className="text-lg font-bold font-serif text-amber-100">
            {lang === "hi" ? "दैनिक जप हेतु महाशक्तिशाली वैदिक मंत्र" : "Empowered Vedic Chants for Daily Sadhana"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#141224] border border-white/10 space-y-2">
              <span className="text-xs font-bold text-amber-300 block">
                {lang === "hi" ? "1. महामृत्युंजय मंत्र (समस्त भय व रोग निवारण)" : "1. Maha Mrityunjaya Mantra"}
              </span>
              <p className="text-xs font-mono text-stone-200">
                ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥
              </p>
              <p className="text-[11px] text-stone-400">
                {lang === "hi"
                  ? "नित्य 108 बार रुद्राक्ष माला पर जप करने से अकाल मृत्यु का भय और असाध्य रोग शांत होते हैं।"
                  : "Chanted 108 times daily for health, vitality, and overcoming insurmountable life hurdles."}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141224] border border-white/10 space-y-2">
              <span className="text-xs font-bold text-amber-300 block">
                {lang === "hi" ? "2. गायत्री मंत्र (बुद्धि व आत्मबल संवर्धन)" : "2. Gayatri Mantra"}
              </span>
              <p className="text-xs font-mono text-stone-200">
                ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥
              </p>
              <p className="text-[11px] text-stone-400">
                {lang === "hi"
                  ? "प्रातः सूर्योदय के समय जप करने से कुशाग्र बुद्धि, एकाग्रता और तेज की प्राप्ति होती है।"
                  : "Chanted at dawn to awaken higher intellect, solar illumination, and purity of intent."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rituals & Charity Section */}
      {activeTab === "rituals" && (
        <div className="rounded-3xl bg-[#0e0c1b]/80 border border-white/10 p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
          <h3 className="text-lg font-bold font-serif text-amber-100">
            {lang === "hi" ? "ग्रह शांति हेतु शास्त्रीय दान नियम" : "Vedic Charity & Karmic Mitigation Rules"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#141224] border border-white/10 space-y-1.5">
              <span className="font-bold text-amber-200 text-xs">शनि साढ़े साती शांति</span>
              <p className="text-xs text-stone-400">
                शनिवार को तिल का तेल, काले तिल अथवा उड़द की दाल का दान करें। पीपल के वृक्ष के नीचे सरसों के तेल का दीपक प्रज्वलित करें।
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#141224] border border-white/10 space-y-1.5">
              <span className="font-bold text-amber-200 text-xs">मंगल दोष शांति</span>
              <p className="text-xs text-stone-400">
                मंगलवार को गुड़, लाल मसूर और तांबे के बर्तन का दान करें। हनुमान चालीसा का नियमित पाठ मंगल के उग्र प्रभाव को शांत करता है।
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#141224] border border-white/10 space-y-1.5">
              <span className="font-bold text-amber-200 text-xs">राहु-केतु शांति</span>
              <p className="text-xs text-stone-400">
                पक्षियों को सात प्रकार के अनाज (सप्तधान्य) डालें। आवारा श्वानों (कुत्तों) को मीठी रोटी खिलाने से केतु का अमंगल दूर होता है।
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
