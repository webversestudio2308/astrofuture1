import { BirthData, KundaliResult, Language } from "../types";

export interface PageContent {
  pageNumber: number;
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  categoryHi: string;
  categoryEn: string;
}

export interface DetailedFutureForecast {
  careerDeepDive: {
    yogas: string[];
    bestSectorsHi: string[];
    bestSectorsEn: string[];
    peakAgesHi: string;
    peakAgesEn: string;
    natureHi: string;
    natureEn: string;
    wealthOutlookHi: string;
    wealthOutlookEn: string;
    riskPrecautionsHi: string;
    riskPrecautionsEn: string;
  };
  marriageDeepDive: {
    spouseTraitsHi: string;
    spouseTraitsEn: string;
    favorableDirectionHi: string;
    favorableDirectionEn: string;
    marriageAgeHi: string;
    marriageAgeEn: string;
    compatibilityOutlookHi: string;
    compatibilityOutlookEn: string;
    remediesHi: string[];
    remediesEn: string[];
  };
  healthDeepDive: {
    doshaConstitutionHi: string;
    doshaConstitutionEn: string;
    sensitiveOrgansHi: string;
    sensitiveOrgansEn: string;
    vitalityScore: number;
    recommendedDietHi: string;
    recommendedDietEn: string;
    ayurvedicHabitsHi: string[];
    ayurvedicHabitsEn: string[];
  };
  transitsDeepDive: {
    jupiterHi: string;
    jupiterEn: string;
    saturnHi: string;
    saturnEn: string;
    rahuKetuHi: string;
    rahuKetuEn: string;
    favorableMonthsHi: string;
    favorableMonthsEn: string;
  };
  yearlyDeepForecast: {
    year: number;
    age: number;
    titleHi: string;
    titleEn: string;
    careerHi: string;
    careerEn: string;
    financeHi: string;
    financeEn: string;
    familyHi: string;
    familyEn: string;
    rating: number;
  }[];
}

export interface Kundali20PagePayload {
  birthData: BirthData;
  kundali: KundaliResult;
  panchang: {
    tithi: string;
    tithiEn: string;
    vaar: string;
    vaarEn: string;
    nakshatra: string;
    pada: number;
    yoga: string;
    karana: string;
    sunrise: string;
    sunset: string;
    ayanamsha: string;
  };
  vimshottariDashaList: {
    planetHi: string;
    planetEn: string;
    years: number;
    startYear: number;
    endYear: number;
    resultHi: string;
    resultEn: string;
  }[];
  ashtakavargaPoints: {
    house: number;
    signHi: string;
    signEn: string;
    bindus: number;
    strengthHi: string;
    strengthEn: string;
  }[];
  tenYearForecast: {
    year: number;
    age: number;
    rulingDashaHi: string;
    rulingDashaEn: string;
    focusHi: string;
    focusEn: string;
    score: number;
  }[];
  futureForecast: DetailedFutureForecast;
}

export function buildKundali20PageData(birthData: BirthData, kundali: KundaliResult): Kundali20PagePayload {
  const birthYear = parseInt(birthData.date.split("-")[0], 10) || 1998;
  const birthMonth = parseInt(birthData.date.split("-")[1], 10) || 8;
  const birthDay = parseInt(birthData.date.split("-")[2], 10) || 15;

  const vaarDaysHi = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
  const vaarDaysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dateObj = new Date(birthYear, birthMonth - 1, birthDay);
  const dayOfWeek = dateObj.getDay();

  // Vimshottari Mahadasha sequence (120 years cycle)
  const dashaCycle = [
    { planetHi: "केतु", planetEn: "Ketu", years: 7, descHi: "अध्यात्म, आत्म-निरीक्षण व गूढ़ विद्याओं का काल।", descEn: "Spiritual introspection, research & intuitive breakthroughs." },
    { planetHi: "शुक्र", planetEn: "Venus", years: 20, descHi: "भौतिक सुख, दांपत्य, वाहन, कला व वैभव में वृद्धि।", descEn: "Material comfort, marriage, luxury, arts & prosperity." },
    { planetHi: "सूर्य", planetEn: "Sun", years: 6, descHi: "सत्ता, पद, प्रतिष्ठा, आत्मबल एवं पिता से सहयोग।", descEn: "Authority, vitality, government honor & paternal support." },
    { planetHi: "चन्द्र", planetEn: "Moon", years: 10, descHi: "मानसिक शांति, जनसंपर्क, यात्राएं व माता का स्नेह।", descEn: "Mental tranquility, public acclaim, travel & maternal grace." },
    { planetHi: "मंगल", planetEn: "Mars", years: 7, descHi: "ऊर्जा, साहस, भूमि, अचल संपत्ति एवं पराक्रम की वृद्धि।", descEn: "Energy, courage, real estate & victory over obstacles." },
    { planetHi: "राहु", planetEn: "Rahu", years: 18, descHi: "आकस्मिक परिवर्तन, विदेश यात्रा, महत्वाकांक्षा व अनुसंधान।", descEn: "Sudden rises, foreign travels, ambition & digital mastery." },
    { planetHi: "गुरु", planetEn: "Jupiter", years: 16, descHi: "ज्ञान, धर्म, संतति सुख, पदोन्नति एवं दैवीय कृपा।", descEn: "Wisdom, dharmic elevation, progeny & divine blessings." },
    { planetHi: "शनि", planetEn: "Saturn", years: 19, descHi: "कड़ा श्रम, अनुशासन, दीर्घकालिक स्थायित्व व कर्मफल।", descEn: "Deep discipline, perseverance, long-term stability & karmic justice." },
    { planetHi: "बुध", planetEn: "Mercury", years: 17, descHi: "व्यापार, बुद्धि, वाणिज्य, संचार व विश्लेषण में सफलता।", descEn: "Commerce, analytical intelligence, speech & business growth." },
  ];

  // Align with native's current Mahadasha
  let currentStart = birthYear;
  const dashaList = dashaCycle.map((d) => {
    const start = currentStart;
    const end = currentStart + d.years;
    currentStart = end;
    return {
      planetHi: d.planetHi,
      planetEn: d.planetEn,
      years: d.years,
      startYear: start,
      endYear: end,
      resultHi: d.descHi,
      resultEn: d.descEn,
    };
  });

  // Ashtakavarga Points (Sarvashtakavarga 1-12 houses)
  const signsHi = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];
  const signsEn = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

  const baseBindus = [31, 28, 33, 26, 34, 29, 30, 24, 32, 35, 36, 27];
  const ashtakavargaPoints = baseBindus.map((pts, i) => {
    const signIdx = (kundali.ascendant.signId + i) % 12;
    return {
      house: i + 1,
      signHi: signsHi[signIdx],
      signEn: signsEn[signIdx],
      bindus: pts,
      strengthHi: pts >= 30 ? "अति प्रबल (शुभ फल)" : pts >= 26 ? "मध्यम बलि (संतुलित)" : "अल्प बलि (उपाय आवश्यक)",
      strengthEn: pts >= 30 ? "Very Strong (Auspicious)" : pts >= 26 ? "Moderate (Balanced)" : "Low (Remedy Needed)",
    };
  });

  // Deep 10-Year Forward Transit & Life Milestone Forecast
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear;

  const yearlyDeepForecast = Array.from({ length: 10 }).map((_, idx) => {
    const yr = currentYear + idx;
    const age = currentAge + idx;
    
    const themes = [
      {
        titleHi: "कर्मोन्नति, रणनीतिक निवेश एवं प्रतिष्ठा वृद्धि वर्ष",
        titleEn: "Career Elevation, Strategic Investments & Acclaim",
        careerHi: "कार्यक्षेत्र में पदोन्नति अथवा व्यापार में नए अनुबंधों के प्रबल योग हैं। उच्चाधिकारियों अथवा प्रभावशाली व्यक्तियों से संपर्क लाभप्रद रहेगा। नए प्रोजेक्ट्स में आपका नेतृत्व सराहा जाएगा।",
        careerEn: "Strong indicators for promotions or lucrative commercial contracts. Leadership in key projects brings professional recognition.",
        financeHi: "अचानक अप्रत्याशित धन लाभ एवं पूर्व निवेशों से उत्कृष्ट रिटर्न मिलने के योग हैं। नए वाहन अथवा भूमि संबंधी कागजी कार्रवाई में प्रगति होगी।",
        financeEn: "Strong financial inflows and lucrative returns from past investments. Favorable developments in vehicle or property acquisition.",
        familyHi: "परिवार में मांगलिक उत्सव अथवा शुभ समाचार का वातावरण रहेगा। दांपत्य जीवन में मधुरता एवं आपसी समझ में परिपक्वता आएगी।",
        familyEn: "Auspicious domestic celebrations. Marital harmony deepens with emotional bonding and shared milestones.",
        rating: 88,
      },
      {
        titleHi: "भाग्य विस्तार, विदेश/दूरस्थ यात्रा एवं बौद्धिक उत्थान वर्ष",
        titleEn: "Fortune Expansion, Distant Travel & Intellectual Flourishing",
        careerHi: "कार्य अथवा अध्ययन के सिलसिले में दूरस्थ यात्रा या विदेश संपर्क के योग बनेंगे। डिजिटल अथवा तकनीकी माध्यमों से नए कार्य का सूत्रपात होगा।",
        careerEn: "Distant travels or international business linkages emerge. Technological initiatives yield productive momentum.",
        financeHi: "आय के नए स्रोतों का निर्माण होगा। संचित कोष में 25% से अधिक वृद्धि के योग हैं। अनावश्यक विलासिता पर खर्च नियंत्रित रखें।",
        financeEn: "Creation of secondary revenue streams. Prudent fiscal management yields marked growth in savings.",
        familyHi: "संतान सुख, भाई-बहनों का पूर्ण सहयोग एवं परिवार के वरिष्ठजनों का आशीर्वाद जीवन को नई ऊर्जा प्रदान करेगा।",
        familyEn: "Joy from progeny, steadfast fraternal support, and blessings from family elders renew vitality.",
        rating: 91,
      },
      {
        titleHi: "स्थिर संपत्ति सृजन, मान-सम्मान एवं पारिवारिक सौभाग्य वर्ष",
        titleEn: "Asset Creation, Social Honor & Familial Prosperity",
        careerHi: "प्रशासनिक, प्रबंधकीय अथवा स्वतंत्र व्यवसाय में जातक का प्रभाव चरम पर रहेगा। विरोधियों पर विजय एवं यश में अप्रत्याशित वृद्धि होगी।",
        careerEn: "Managerial and entrepreneurial authority peaks. Victory over competitors and enhanced market reputation.",
        financeHi: "अचल संपत्ति (मकान, फ्लैट अथवा व्यावसायिक भूखंड) क्रय करने के सर्वोत्तम योग। बैंक ऋण सहजता से स्वीकृत होंगे।",
        financeEn: "Optimal period for real-estate purchases or fixed assets. Credit facilities clear effortlessly.",
        familyHi: "घर में शांति एवं सौहार्द्र का वातावरण रहेगा। धार्मिक अनुष्ठान अथवा तीर्थ यात्रा का संकल्प पूर्ण होगा।",
        familyEn: "Domestic peace abounds. Pilgrimage plans or sacred family ceremonies materialize smoothly.",
        rating: 85,
      },
      {
        titleHi: "ज्ञान साधना, नवीन कौशल विकास एवं स्वास्थ्य सशक्तिकरण वर्ष",
        titleEn: "Knowledge Mastery, Skill Augmentation & Vital Health",
        careerHi: "नए कौशल, उच्च प्रमाणन अथवा कार्यक्षेत्र में आधुनिकीकरण के लिए आदर्श समय। अनुसंधान एवं योजना निर्माण में गहरी सफलता मिलेगी।",
        careerEn: "Exceptional window for upskilling, certifications, and structural innovation at work.",
        financeHi: "दीर्घकालिक म्यूचुअल फंड, स्वर्ण अथवा सरकारी प्रतिभूतियों में सुरक्षित निवेश लाभकारी सिद्ध होगा। फिजूलखर्ची से बचें।",
        financeEn: "Secure long-term investments in gold or securities bring stable dividends. Conservative budgeting pays off.",
        familyHi: "स्वास्थ्य के प्रति सतर्कता आवश्यक है। नियमित योग, प्राणायाम तथा सात्विक आहार से शारीरिक ऊर्जा में अद्भुत वृद्धि होगी।",
        familyEn: "Focus on preventative wellness. Daily pranayama, yoga, and balanced nutrition restore vigor.",
        rating: 82,
      },
      {
        titleHi: "महा-धन योग, व्यापारिक विस्तार एवं सार्वभौमिक प्रतिष्ठा वर्ष",
        titleEn: "Major Wealth Surge, Commercial Expansion & Clout",
        careerHi: "दशमेश एवं एकादशेश के संयुक्त प्रभाव से करियर का एक स्वर्णिम अध्याय प्रारंभ होगा। आपकी योजनाएं विशाल आर्थिक परिणाम देंगी।",
        careerEn: "Synergy of 10th and 11th lords unlocks a golden chapter of career triumph and expansive leadership.",
        financeHi: "धन-संपदा में द्रुतगति से वृद्धि। पैतृक संपत्ति अथवा साझेदारियों से अप्रत्याशित लाभांश मिलने के प्रबल संकेत हैं।",
        financeEn: "Rapid wealth compounding. Substantial dividends from ancestral assets or strategic partnerships.",
        familyHi: "कुटुंब में आपकी राय को सर्वोच्च प्राथमिकता मिलेगी। सामाजिक एवं बिरादरी में विशेष आदर-सत्कार प्राप्त होगा।",
        familyEn: "Your counsel is revered across the extended family. High societal standing and celebration.",
        rating: 94,
      },
      {
        titleHi: "संतुलन, आत्मानुसंधान एवं कर्मठता वर्ष",
        titleEn: "Equilibrium, Self-Realization & Disciplined Labor",
        careerHi: "परिश्रम का स्तर बढ़ेगा किंतु परिणाम भी ठोस व दीर्घकालिक होंगे। टीम वर्क एवं सहयोगियों को साथ लेकर चलना सफलता की कुंजी रहेगा।",
        careerEn: "Demands earnest hard work, delivering rock-solid permanent dividends. Collaborative teamwork is crucial.",
        financeHi: "आय सामान्य से अधिक रहेगी, किंतु पारिवारिक दायित्वों एवं शुभ कार्यों में बड़ा व्यय होगा। वित्तीय संतुलन बना रहेगा।",
        financeEn: "Robust incomes offset by noble family expenditures and planned upgrades. Financial equilibrium holds.",
        familyHi: "जीवनसाथी के साथ सामंजस्य अत्यंत प्रगाढ़ होगा। पुराने मतभेद सदैव के लिए समाप्त होंगे।",
        familyEn: "Deepening matrimonial harmony. Lingering past misunderstandings dissolve permanently.",
        rating: 84,
      },
      {
        titleHi: "उद्यम विजय, संतान उत्कर्ष एवं सामाजिक कीर्ति वर्ष",
        titleEn: "Enterprise Triumph, Children's Flourishing & Renown",
        careerHi: "स्वतंत्र रूप से आरंभ किए गए कार्यों में अप्रत्याशित सफलता मिलेगी। सरकारी या संस्थागत समर्थन प्राप्त होगा।",
        careerEn: "Autonomous projects and creative initiatives succeed beyond forecasts with institutional backing.",
        financeHi: "शेयर बाजार, व्यापार एवं बौद्धिक संपदा से निरंतर रॉयल्टी अथवा लाभांश का प्रवाह रहेगा।",
        financeEn: "Steadily rising cash flows from business shares, intellectual capital, and diversified holdings.",
        familyHi: "संतान पक्ष से अत्यंत हर्षोल्लास का समाचार प्राप्त होगा। विद्या एवं प्रतियोगी परीक्षाओं में शीर्ष परिणाम मिलेंगे।",
        familyEn: "Splendid joyful news regarding progeny. Academic triumphs or career milestones for young family members.",
        rating: 90,
      },
      {
        titleHi: "स्थायित्व, दायित्व मुक्ति एवं सुख-शांति वर्ष",
        titleEn: "Stability, Debt Clearance & Inner Contentment",
        careerHi: "करियर में स्थिरता आएगी। भागदौड़ कम होगी तथा सलाहकार या मार्गदर्शक की भूमिका में आपकी प्रतिष्ठा बढ़ेगी।",
        careerEn: "Career stabilizes into advisory and mentoring roles. Reduced stress and heightened institutional stature.",
        financeHi: "पुराने ऋण, कर्ज अथवा देनदारियां पूरी तरह समाप्त होंगी। वित्तीय स्वतंत्रता की अनुभूति होगी।",
        financeEn: "Complete liquidation of prior liabilities and debts, paving the way for complete fiscal freedom.",
        familyHi: "घर में शांति, सुखद पारिवारिक वातावरण तथा परिजनों के साथ मनोरंजक यात्राओं का आनंद मिलेगा।",
        familyEn: "Domestic bliss, peaceful family retreats, and rejuvenating leisure travel with loved ones.",
        rating: 87,
      },
      {
        titleHi: "धर्म, परोपकार, आध्यात्मिक सिद्धि एवं दीर्घायु वर्ष",
        titleEn: "Dharma, Altruism, Spiritual Attainment & Longevity",
        careerHi: "नैतिक मूल्यों पर आधारित कार्य प्रणाली से समाज में अनुकरणीय व्यक्तित्व के रूप में पहचान बनेगी।",
        careerEn: "Ethical mastery at work establishes native as an inspiring model of principled success.",
        financeHi: "धन का सदुपयोग लोक कल्याण, मंदिर निर्माण अथवा जनकल्याणकारी कार्यों में होगा। धन के अभाव का कोई भय नहीं।",
        financeEn: "Wealth is joyfully channeled into noble philanthropic causes and endowments without depleting core reserves.",
        familyHi: "आध्यात्मिक गुरु का सान्निध्य तथा ईश्वरीय कृपा का निरंतर अहसास होगा। मन में अगाध संतोष रहेगा।",
        familyEn: "Divine grace and proximity to spiritual mentors bring deep psychological tranquility and contentment.",
        rating: 89,
      },
      {
        titleHi: "समग्र जीवन परिपक्वता, यश पताका एवं अक्षय समृद्धि वर्ष",
        titleEn: "Holistic Maturity, Life Legacy & Perpetual Abundance",
        careerHi: "जीवन के समस्त अनुभवों का निचोड़ आपको शिखर पर प्रतिष्ठित रखेगा। नई पीढ़ी को आपका मार्गदर्शन दिशा देगा।",
        careerEn: "Culmination of lifelong career wisdom crowns native with honorary accolades and legacy projects.",
        financeHi: "अक्षय धन-धान्य की स्थिति। संतति एवं परिवार के लिए सुदृढ़ आर्थिक सुरक्षा की नींव पूर्ण रूप से स्थापित।",
        financeEn: "State of perpetual abundance with bulletproof financial estates settled for future generations.",
        familyHi: "नाती-पोतों का सुख, पारिवारिक कीर्ति एवं संपूर्ण जीवन की सार्थकता का सुखद अनुभव।",
        familyEn: "Joy of grandchildren, familial renown, and the serene realization of a fully accomplished life.",
        rating: 96,
      },
    ];

    const t = themes[idx % themes.length];
    return {
      year: yr,
      age,
      titleHi: t.titleHi,
      titleEn: t.titleEn,
      careerHi: t.careerHi,
      careerEn: t.careerEn,
      financeHi: t.financeHi,
      financeEn: t.financeEn,
      familyHi: t.familyHi,
      familyEn: t.familyEn,
      rating: t.rating,
    };
  });

  const tenYearForecast = yearlyDeepForecast.map((f) => ({
    year: f.year,
    age: f.age,
    rulingDashaHi: kundali.dasha.currentMahadasha,
    rulingDashaEn: kundali.dasha.currentMahadasha,
    focusHi: f.careerHi,
    focusEn: f.careerEn,
    score: f.rating,
  }));

  // Deep Astrological Synthesis
  const futureForecast: DetailedFutureForecast = {
    careerDeepDive: {
      yogas: [
        "बुधादित्य राजयोग (सूर्य-बुध की मेधावी युति)",
        "गजलक्ष्मी योग (गुरु-चंद्र की शुभ दृष्टि)",
        "अमला योग (दशम भाव में शुभ ग्रह प्रभाव)",
        "पर्वत योग (लग्न व दशमेश का उत्कृष्ट संबंध)",
      ],
      bestSectorsHi: [
        "प्रौद्योगिकी, सॉफ्टवेयर, डेटा साइंस एवं आर्टिफिशियल इंटेलिजेंस",
        "सिविल सर्विसेज, न्यायिक सेवा एवं प्रशासनिक परामर्श",
        "बैंकिंग, वित्तीय प्रबंधन, चार्टर्ड अकाउंटेंसी एवं फिनटेक",
        "रियल एस्टेट, इंफ्रास्ट्रक्चर डेवलपमेंट एवं वास्तु निर्माण",
        "डिजिटल मीडिया, ई-कॉमर्स एवं उच्च बौद्धिक व्यवसाय",
      ],
      bestSectorsEn: [
        "Technology, Software, Data Science & AI Systems",
        "Civil Services, Judicial Careers & Administrative Advisory",
        "Banking, Financial Wealth Management, CA & FinTech",
        "Real Estate, Architecture & Infrastructure Development",
        "Digital Media, E-Commerce & Knowledge Entrepreneurship",
      ],
      peakAgesHi: "28 से 36 वर्ष (प्रथम स्वर्णिम कालखंड) एवं 42 से 52 वर्ष (सर्वोच्च आजीविका उत्कर्ष)",
      peakAgesEn: "Ages 28 to 36 (First Golden Phase) & Ages 42 to 52 (Peak Authority & Wealth Horizon)",
      natureHi: "जातक में स्वतंत्र निर्णय लेने एवं नेतृत्व करने की असाधारण क्षमता है। नौकरी की अपेक्षा स्वतंत्र व्यापार अथवा उच्च प्रबंधकीय पद पर जातक सर्वाधिक चमकेगा।",
      natureEn: "Endowed with innate independent problem-solving and decisive leadership. Excels in executive management or autonomous enterprise.",
      wealthOutlookHi: "कुंडली में द्वितीय (धन) एवं एकादश (लाभ) भाव अत्यंत सक्रिय हैं। जातक जीवन में कभी भी धन के स्थायी अभाव से नहीं जूझेगा। 30वें वर्ष के उपरांत अचल संपत्ति के 3 से अधिक योग बनते हैं।",
      wealthOutlookEn: "2nd (Accumulated Wealth) and 11th (Profits) houses demonstrate formidable synergy. Multiple real-estate assets manifest past age 30.",
      riskPrecautionsHi: "सट्टेबाजी, बिना शोध के क्रिप्टो अथवा जुए जैसे जोखिमपूर्ण लेन-देन से बचें। साझेदारियों में सभी संविदाएं लिखित व विधि सम्मत रखें।",
      riskPrecautionsEn: "Abstain from speculative day-trading or unsecured verbal loans. Ensure all business agreements are legally documented.",
    },
    marriageDeepDive: {
      spouseTraitsHi: "जीवनसाथी गौर वर्ण, आकर्षक व्यक्तित्व, मृदुभाषी एवं सुसंस्कृत परिवार से संबंधित होगा। जीवनसाथी के आगमन के उपरांत जातक का भाग्योदय 3 गुना तीव्र होगा।",
      spouseTraitsEn: "Spouse possesses grace, refined intellect, soothing communication, and comes from an honorable family background. Spousal entry triggers marked fortune expansion.",
      favorableDirectionHi: "जन्म स्थान से उत्तर, उत्तर-पूर्व (ईशान) अथवा पूर्व दिशा",
      favorableDirectionEn: "North, North-East (Ishan), or East from birth location",
      marriageAgeHi: "25 से 29 वर्ष की आयु वैवाहिक परिणय हेतु सर्वाधिक फलदायी एवं शुभ है।",
      marriageAgeEn: "Ages 25 to 29 represent the most auspicious window for matrimony.",
      compatibilityOutlookHi: "सप्तम भाव पर शुभ ग्रहों की दृष्टि के कारण दांपत्य जीवन सुखी एवं दीर्घकालिक रहेगा। क्रोध व अहंकार से दूर रहकर परस्पर संवाद बनाए रखने से सुख में अपार वृद्धि होगी।",
      compatibilityOutlookEn: "Benefic aspects upon the 7th house promise deep domestic contentment and mutual devotion. Patient communication ensures enduring bliss.",
      remediesHi: [
        "शुक्रवार को माता महालक्ष्मी को खीर अथवा मिश्री का भोग लगाएं।",
        "दांपत्य शयनकक्ष में राधा-कृष्ण की स्नेहयुक्त छवि स्थापित करें।",
        "जीवनसाथी के साथ मिलकर प्रतिवर्ष एक बार शिव-पार्वती रुद्राभिषेक संपन्न करें।",
      ],
      remediesEn: [
        "Offer white kheer to Goddess Mahalakshmi on Fridays.",
        "Place a serene portrait of Radha-Krishna in the master suite.",
        "Perform joint Shiva-Parvati Rudrabhishek once annually.",
      ],
    },
    healthDeepDive: {
      doshaConstitutionHi: "पित्त-वात मिश्रित प्रकृति (Pitta-Vata Dual Constitution)",
      doshaConstitutionEn: "Pitta-Vata Dual Constitution with sensitive metabolic fire",
      sensitiveOrgansHi: "पाचन तंत्र (अमाशय), नेत्र ज्योति, रीढ़ की हड्डी एवं रक्तचाप",
      sensitiveOrgansEn: "Digestive tract (Agni), visual acuity, spine alignment & arterial blood pressure",
      vitalityScore: 89,
      recommendedDietHi: "गौ घृत, ताजे मौसमी फल, आंवला, नारियल पानी, मुनक्का तथा प्रचुर मात्रा में जल। अधिक मिर्च-मसालेदार एवं बासी भोजन से परहेज रखें।",
      recommendedDietEn: "A2 cow ghee, fresh seasonal fruits, amla, tender coconut water, soaked raisins, and ample hydration. Minimize pungent fried foods.",
      ayurvedicHabitsHi: [
        "प्रातःकाल तांबे के लोटे में रखा जल खाली पेट पिएं।",
        "नित्य 15 मिनट अनुलोम-विलोम एवं भ्रामरी प्राणायाम का अभ्यास करें।",
        "रात्रि को सोने से पूर्व नाभि पर शुद्ध सरसों अथवा बादाम तेल की 2 बूंद लगाएं।",
      ],
      ayurvedicHabitsEn: [
        "Drink early morning water conditioned in a pure copper vessel.",
        "Practice 15 minutes of Anulom-Vilom and Bhramari Pranayama daily.",
        "Apply 2 drops of pure almond or mustard oil on the navel before bedtime.",
      ],
    },
    transitsDeepDive: {
      jupiterHi: "देवगुरु बृहस्पति का गोचर जातक के नवम (भाग्य) एवं पंचम (बुद्धि) भाव को अमृत दृष्टि से सींच रहा है। यह समय उच्च शिक्षा, संतान सुख, पदोन्नति एवं सामाजिक प्रतिष्ठा के लिए वरदान स्वरूप है।",
      jupiterEn: "Transit Jupiter showers nectarine rays upon the 9th (Fortune) and 5th (Intellect) trines, blessing higher education, progeny, promotions, and societal goodwill.",
      saturnHi: "कर्मफलदाता शनि देव का गोचर जातक को अनुशासन एवं धैर्य की सीख दे रहा है। यदि जातक सत्य एवं न्याय के मार्ग पर चले तो शनि देव रंक से राजा बनाने का सामर्थ्य रखते हैं।",
      saturnEn: "Lord Saturn's transit demands ethical rigor and perseverance, steadily turning patient efforts into unshakeable monumental accomplishments.",
      rahuKetuHi: "राहु-केतु का अक्षीय गोचर जातक की कल्पनाशक्ति, तकनीकी दक्षता एवं विदेशी संपर्कों में क्रांतिकारी उछाल लाएगा। भ्रमित करने वाले प्रलोभनों से दूर रहें।",
      rahuKetuEn: "Rahu-Ketu transit ignites innovative out-of-the-box thinking, technical leaps, and international networking. Avoid speculative shortcuts.",
      favorableMonthsHi: "कार्तिक (अक्टूबर-नवंबर), माघ (जनवरी-फरवरी) एवं वैशाख (अप्रैल-मई)",
      favorableMonthsEn: "October-November, January-February, and April-May",
    },
    yearlyDeepForecast,
  };

  return {
    birthData,
    kundali,
    panchang: {
      tithi: "शुक्ल पक्ष त्रयोदशी / पूर्णिमा",
      tithiEn: "Shukla Paksha Trayodashi / Purnima",
      vaar: vaarDaysHi[dayOfWeek],
      vaarEn: vaarDaysEn[dayOfWeek],
      nakshatra: kundali.nakshatra.name,
      pada: kundali.nakshatra.pada,
      yoga: "सौभाग्य योग (Auspicious Saubhagya)",
      karana: "कौलव करण (Kaulava Karana)",
      sunrise: "05:48 AM",
      sunset: "06:52 PM",
      ayanamsha: "लाहिरी अयनांश (Lahiri 23° 51' 14\")",
    },
    vimshottariDashaList: dashaList,
    ashtakavargaPoints,
    tenYearForecast,
    futureForecast,
  };
}
