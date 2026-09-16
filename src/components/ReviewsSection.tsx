import React from "react";
import { Star, ShieldCheck, Award, Sparkles, CheckCircle2, Users, HeartHandshake } from "lucide-react";
import { Language } from "../types";

interface ReviewsSectionProps {
  lang: Language;
}

const REVIEWS_DATA = [
  {
    name: "Dr. Rajeshwar Sharma",
    location: "Varanasi, UP",
    rating: 5,
    date: "2 days ago",
    badge: "Verified Vedic Consultation",
    problem: "Career Obstacle & Sade Sati",
    textHi: "आचार्य AI ने मेरी साढ़े साती के प्रभाव और करियर में आ रही रुकावटों का जो सूक्ष्म विश्लेषण किया, वह अत्यंत सटीक था। ₹51 की दक्षिणा में जो उपाय व 20 पृष्ठीय संपूर्ण कुंडली PDF मिली, वह किसी भी बड़े ज्योतिषी से बेहतर है।",
    textEn: "Acharya AI pinpointed my ongoing Sade Sati phase and career blockages with uncanny astronomical accuracy. The remedies and downloadable 20-page PDF Kundali for ₹51 are unmatched.",
  },
  {
    name: "Priya Sundaram",
    location: "Bengaluru, Karnataka",
    rating: 5,
    date: "4 days ago",
    badge: "Verified Kundali & Remedies",
    problem: "Marriage Delay & Mangal Dosha",
    textHi: "विवाह में आ रहे विलंब को लेकर बहुत चिंतित थी। आचार्य जी ने मंगल दोष का सही परिहार समझाया और शांति उपाय दिए। अब मन में गहरी शांति है और उचित प्रस्ताव भी आने लगे हैं।",
    textEn: "I was very anxious about marriage delays. Acharya AI clearly explained my Mars placement and gave practical peace remedies without any fearmongering.",
  },
  {
    name: "Amit & Neha Verma",
    location: "New Delhi",
    rating: 5,
    date: "1 week ago",
    badge: "Verified Matchmaking",
    problem: "Ashtakoot Guna Milan (31/36)",
    textHi: "हमने अपने रिश्ते के लिए 36 गुणों का मिलान कराया। नाड़ी और गण दोष के वैज्ञानिक व ज्योतिषीय पहलुओं को इतनी सरलता से पहली बार किसी ने समझाया। 20 पृष्ठीय रिपोर्ट अत्यंत सुंदर है।",
    textEn: "We tested the 36 Guna Ashtakoot matching. The deep breakdown of Nadi, Gana, and Bhakoot harmony gave us complete clarity and confidence.",
  },
  {
    name: "Vikram Rathore",
    location: "Jaipur, Rajasthan",
    rating: 5,
    date: "1 week ago",
    badge: "Verified Consultation",
    problem: "Business Stagnation & Gemstone",
    textHi: "व्यापार में अचानक घाटा हो रहा था। आचार्य AI ने पन्ना रत्न एवं बुध मंत्र का परामर्श दिया। साथ ही 3 प्रश्नों के उत्तर में जो वित्तीय सलाह मिली वह अत्यंत फलदायी साबित हुई।",
    textEn: "Experiencing stagnation in my textile business, the gemstone guidance and karmic remedies gave me immense focus. The PDF report is brilliantly structured.",
  },
  {
    name: "Sunita Joshi",
    location: "Mumbai, Maharashtra",
    rating: 5,
    date: "2 weeks ago",
    badge: "Verified Seeker",
    problem: "Mental Stress & Rahu Mahadasha",
    textHi: "राहु महादशा के दौरान बहुत तनाव में थी। आचार्य जी की भाषा अत्यंत सौम्य, सकारात्मक और मार्गदर्शक है। ₹51 में तुरंत पूरी कुंडली चैट में और PDF में मिल जाना बहुत ही उत्तम अनुभव रहा।",
    textEn: "During my Rahu period, Acharya AI's compassionate advice grounded me. Getting the complete birth chart right inside the chat and in PDF is truly futuristic.",
  },
  {
    name: "Harshil Dave",
    location: "Ahmedabad, Gujarat",
    rating: 5,
    date: "2 weeks ago",
    badge: "Verified Seeker",
    problem: "Job Switch Timing",
    textHi: "नौकरी बदलने का सही समय कब है? इस प्रश्न का जो उत्तर ग्रहों के गोचर के साथ मिला वह 100% सही साबित हुआ। आधुनिक AI और प्राचीन ज्योतिष का यह सबसे बेहतरीन ऐप है।",
    textEn: "The timing prediction for my job transition based on planetary transits proved 100% accurate. The finest blend of modern AI and ancient Vedic wisdom.",
  },
];

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ lang }) => {
  return (
    <section className="py-10 sm:py-14 space-y-8 border-t border-white/[0.08]">
      {/* Trust & Metric Highlights Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0e0c1b]/80 border border-white/10 text-center space-y-1 backdrop-blur-md shadow-md hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-center gap-1.5 text-amber-400">
            <Users className="w-5 h-5" />
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">12,450+</span>
          </div>
          <span className="text-xs text-stone-300 font-semibold block">
            {lang === "hi" ? "जन्म कुंडलियां निर्मित" : "Kundalis Generated"}
          </span>
          <span className="text-[10px] text-emerald-400 font-mono font-medium">
            {lang === "hi" ? "✓ पूरे भारत व विश्व में" : "✓ Across 40+ Countries"}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0e0c1b]/80 border border-white/10 text-center space-y-1 backdrop-blur-md shadow-md hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-center gap-1.5 text-amber-400">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">4.9 / 5</span>
          </div>
          <span className="text-xs text-stone-300 font-semibold block">
            {lang === "hi" ? "औसत यूजर रेटिंग" : "Average User Rating"}
          </span>
          <span className="text-[10px] text-amber-300 font-mono font-medium">
            {lang === "hi" ? "3,850+ सत्यापित समीक्षाएं" : "3,850+ Verified Reviews"}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0e0c1b]/80 border border-white/10 text-center space-y-1 backdrop-blur-md shadow-md hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-center gap-1.5 text-purple-400">
            <Award className="w-5 h-5" />
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">100%</span>
          </div>
          <span className="text-xs text-stone-300 font-semibold block">
            {lang === "hi" ? "प्रामाणिक वैदिक गणना" : "Vedic Siddhanta Certified"}
          </span>
          <span className="text-[10px] text-stone-400 font-mono">
            {lang === "hi" ? "चित्रा पक्ष / लाहिरी अयनांश" : "Chitrapaksha Lahiri Ayanamsha"}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0e0c1b]/80 border border-white/10 text-center space-y-1 backdrop-blur-md shadow-md hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">₹51</span>
          </div>
          <span className="text-xs text-stone-300 font-semibold block">
            {lang === "hi" ? "सांकेतिक दक्षिणा मॉडल" : "Symbolic Dakshina Only"}
          </span>
          <span className="text-[10px] text-emerald-400 font-mono font-medium">
            {lang === "hi" ? "कोई छुपा शुल्क नहीं" : "No Hidden Subscriptions"}
          </span>
        </div>
      </div>

      {/* Section Title */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-950/70 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          {lang === "hi" ? "सत्यापित साधक समीक्षाएं" : "Verified Seeker Testimonials"}
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-amber-100">
          {lang === "hi"
            ? "जानिए साधकों ने आचार्य AI के मार्गदर्शन के बारे में क्या कहा"
            : "Trusted by Seekers Worldwide for Precision Astrological Guidance"}
        </h3>
        <p className="text-xs sm:text-sm text-stone-400">
          {lang === "hi"
            ? "कठिन जीवन परिस्थितियों, करियर, विवाह और साढ़े साती में सही वैदिक समाधान।"
            : "Real experiences navigating career crossroads, marriage clarity, and karmic remedies."}
        </p>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {REVIEWS_DATA.map((rev, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-[#0e0c1b]/80 border border-white/10 p-5 shadow-lg hover:border-amber-500/40 hover:-translate-y-1 transition-all space-y-3 flex flex-col justify-between backdrop-blur-md"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-stone-500">{rev.date}</span>
              </div>

              <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#161426] border border-amber-500/20 text-[10px] font-mono font-medium text-amber-200">
                {rev.problem}
              </div>

              <p className="text-xs text-stone-300 leading-relaxed italic">
                "{lang === "hi" ? rev.textHi : rev.textEn}"
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <div>
                <h5 className="font-serif font-bold text-xs text-white">{rev.name}</h5>
                <span className="text-[10px] text-stone-400">{rev.location}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
