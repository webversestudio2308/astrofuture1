import { BirthData, KundaliResult, PlanetPosition, AshtakootScore } from "../types";

export const RASHI_NAMES = [
  { en: "Aries", hi: "मेष (Mesha)", element: "Fire", lord: "Mars" },
  { en: "Taurus", hi: "वृषभ (Vrishabha)", element: "Earth", lord: "Venus" },
  { en: "Gemini", hi: "मिथुन (Mithuna)", element: "Air", lord: "Mercury" },
  { en: "Cancer", hi: "कर्क (Karka)", element: "Water", lord: "Moon" },
  { en: "Leo", hi: "सिंह (Simha)", element: "Fire", lord: "Sun" },
  { en: "Virgo", hi: "कन्या (Kanya)", element: "Earth", lord: "Mercury" },
  { en: "Libra", hi: "तुला (Tula)", element: "Air", lord: "Venus" },
  { en: "Scorpio", hi: "वृश्चिक (Vrischika)", element: "Water", lord: "Mars" },
  { en: "Sagittarius", hi: "धनु (Dhanu)", element: "Fire", lord: "Jupiter" },
  { en: "Capricorn", hi: "मकर (Makara)", element: "Earth", lord: "Saturn" },
  { en: "Aquarius", hi: "कुंभ (Kumbha)", element: "Air", lord: "Saturn" },
  { en: "Pisces", hi: "मीन (Meena)", element: "Water", lord: "Jupiter" },
];

export const NAKSHATRAS = [
  { name: "Ashwini", lord: "Ketu", deity: "Ashwini Kumaras", gana: "Deva" as const, yoni: "Horse", nadi: "Adi" as const },
  { name: "Bharani", lord: "Venus", deity: "Yama", gana: "Manushya" as const, yoni: "Elephant", nadi: "Madhya" as const },
  { name: "Krittika", lord: "Sun", deity: "Agni", gana: "Rakshasa" as const, yoni: "Sheep", nadi: "Antya" as const },
  { name: "Rohini", lord: "Moon", deity: "Brahma", gana: "Manushya" as const, yoni: "Serpent", nadi: "Antya" as const },
  { name: "Mrigashira", lord: "Mars", deity: "Soma", gana: "Deva" as const, yoni: "Serpent", nadi: "Madhya" as const },
  { name: "Ardra", lord: "Rahu", deity: "Rudra", gana: "Manushya" as const, yoni: "Dog", nadi: "Adi" as const },
  { name: "Punarvasu", lord: "Jupiter", deity: "Aditi", gana: "Deva" as const, yoni: "Cat", nadi: "Adi" as const },
  { name: "Pushya", lord: "Saturn", deity: "Brihaspati", gana: "Deva" as const, yoni: "Sheep", nadi: "Madhya" as const },
  { name: "Ashlesha", lord: "Mercury", deity: "Nagas", gana: "Rakshasa" as const, yoni: "Cat", nadi: "Antya" as const },
  { name: "Magha", lord: "Ketu", deity: "Pitris", gana: "Rakshasa" as const, yoni: "Rat", nadi: "Antya" as const },
  { name: "Purva Phalguni", lord: "Venus", deity: "Bhaga", gana: "Manushya" as const, yoni: "Rat", nadi: "Madhya" as const },
  { name: "Uttara Phalguni", lord: "Sun", deity: "Aryaman", gana: "Manushya" as const, yoni: "Cow", nadi: "Adi" as const },
  { name: "Hasta", lord: "Moon", deity: "Savitr", gana: "Deva" as const, yoni: "Buffalo", nadi: "Adi" as const },
  { name: "Chitra", lord: "Mars", deity: "Tvashtar", gana: "Rakshasa" as const, yoni: "Tiger", nadi: "Madhya" as const },
  { name: "Swati", lord: "Rahu", deity: "Vayu", gana: "Deva" as const, yoni: "Buffalo", nadi: "Antya" as const },
  { name: "Vishakha", lord: "Jupiter", deity: "Indra-Agni", gana: "Rakshasa" as const, yoni: "Tiger", nadi: "Antya" as const },
  { name: "Anuradha", lord: "Saturn", deity: "Mitra", gana: "Deva" as const, yoni: "Deer", nadi: "Madhya" as const },
  { name: "Jyeshtha", lord: "Mercury", deity: "Indra", gana: "Rakshasa" as const, yoni: "Deer", nadi: "Adi" as const },
  { name: "Mula", lord: "Ketu", deity: "Nirriti", gana: "Rakshasa" as const, yoni: "Dog", nadi: "Adi" as const },
  { name: "Purva Ashadha", lord: "Venus", deity: "Apah", gana: "Manushya" as const, yoni: "Monkey", nadi: "Madhya" as const },
  { name: "Uttara Ashadha", lord: "Sun", deity: "Vishvadevas", gana: "Manushya" as const, yoni: "Mongoose", nadi: "Antya" as const },
  { name: "Shravana", lord: "Moon", deity: "Vishnu", gana: "Deva" as const, yoni: "Monkey", nadi: "Antya" as const },
  { name: "Dhanishta", lord: "Mars", deity: "Vasus", gana: "Rakshasa" as const, yoni: "Lion", nadi: "Madhya" as const },
  { name: "Shatabhisha", lord: "Rahu", deity: "Varuna", gana: "Rakshasa" as const, yoni: "Horse", nadi: "Adi" as const },
  { name: "Purva Bhadrapada", lord: "Jupiter", deity: "Aja Ekapada", gana: "Manushya" as const, yoni: "Lion", nadi: "Adi" as const },
  { name: "Uttara Bhadrapada", lord: "Saturn", deity: "Ahirbudhnya", gana: "Manushya" as const, yoni: "Cow", nadi: "Madhya" as const },
  { name: "Revati", lord: "Mercury", deity: "Pushan", gana: "Deva" as const, yoni: "Elephant", nadi: "Antya" as const },
];

export const DASHA_LORDS = [
  { name: "Ketu", years: 7 },
  { name: "Venus", years: 20 },
  { name: "Sun", years: 6 },
  { name: "Moon", years: 10 },
  { name: "Mars", years: 7 },
  { name: "Rahu", years: 18 },
  { name: "Jupiter", years: 16 },
  { name: "Saturn", years: 19 },
  { name: "Mercury", years: 17 },
];

// Calculate Julian Day number
function getJulianDay(year: number, month: number, day: number, hourDecimal: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5 + hourDecimal / 24.0;
}

// Calculate Lahiri Ayanamsha (Chitra Paksha) for a given Julian Day
function getLahiriAyanamsha(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0; // Centuries since J2000.0
  // Standard approximation: 23°51'11" at J2000 plus precession ~50.29" per year
  const ayanamsha = 23.858 + (50.29 / 3600.0) * (T * 100.0);
  return ayanamsha;
}

// Normalize angle to [0, 360)
function normDeg(d: number): number {
  d = d % 360;
  return d < 0 ? d + 360 : d;
}

export function calculateVedicKundali(data: BirthData): KundaliResult {
  const [yearStr, monthStr, dayStr] = data.date.split("-");
  const [hourStr, minStr] = data.time.split(":");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minStr, 10);

  // Time in UTC decimal hours
  const localDecimalHours = hour + minute / 60.0;
  const utcDecimalHours = localDecimalHours - data.timezone;
  const jd = getJulianDay(year, month, day, utcDecimalHours);
  const ayanamsha = getLahiriAyanamsha(jd);

  // Days since J2000.0
  const d = jd - 2451545.0;

  // Mean Solar Tropical Longitude
  const sunMeanTrop = normDeg(280.460 + 0.9856474 * d);
  const sunAnomaly = normDeg(357.528 + 0.9856003 * d) * (Math.PI / 180.0);
  const sunTrop = normDeg(sunMeanTrop + 1.915 * Math.sin(sunAnomaly) + 0.020 * Math.sin(2 * sunAnomaly));
  const sunSidereal = normDeg(sunTrop - ayanamsha);

  // Mean Lunar Tropical Longitude
  const moonMeanTrop = normDeg(218.316 + 13.176396 * d);
  const moonAnomaly = normDeg(134.963 + 13.064993 * d) * (Math.PI / 180.0);
  const moonTrop = normDeg(moonMeanTrop + 6.289 * Math.sin(moonAnomaly));
  const moonSidereal = normDeg(moonTrop - ayanamsha);

  // Mars sidereal
  const marsMeanTrop = normDeg(355.43 + 0.524033 * d);
  const marsSidereal = normDeg(marsMeanTrop - ayanamsha);

  // Mercury sidereal
  const mercMeanTrop = normDeg(sunTrop + 18.0 * Math.sin((d * 4.09) * (Math.PI / 180.0)));
  const mercSidereal = normDeg(mercMeanTrop - ayanamsha);

  // Jupiter sidereal
  const jupMeanTrop = normDeg(34.35 + 0.083091 * d);
  const jupSidereal = normDeg(jupMeanTrop - ayanamsha);

  // Venus sidereal
  const venMeanTrop = normDeg(sunTrop + 22.0 * Math.sin((d * 1.62) * (Math.PI / 180.0)));
  const venSidereal = normDeg(venMeanTrop - ayanamsha);

  // Saturn sidereal
  const satMeanTrop = normDeg(50.08 + 0.033459 * d);
  const satSidereal = normDeg(satMeanTrop - ayanamsha);

  // Rahu (Mean North Lunar Node - retrograde ~19.34 days per degree)
  const rahuMeanTrop = normDeg(125.04 - 0.05295 * d);
  const rahuSidereal = normDeg(rahuMeanTrop - ayanamsha);
  const ketuSidereal = normDeg(rahuSidereal + 180);

  // Calculate Greenwich Sidereal Time (GST) and Local Sidereal Time (LST)
  const T = d / 36525.0;
  const gmst = normDeg(280.46061837 + 360.98564736629 * d + 0.000387933 * T * T);
  const lst = normDeg(gmst + data.lon);

  // Ascendant (Lagna) approximate calculation
  const obl = 23.439 * (Math.PI / 180.0);
  const latRad = data.lat * (Math.PI / 180.0);
  const lstRad = lst * (Math.PI / 180.0);
  const y = -Math.cos(lstRad);
  const x = Math.sin(lstRad) * Math.cos(obl) + Math.tan(latRad) * Math.sin(obl);
  let lagnaTrop = Math.atan2(y, x) * (180.0 / Math.PI);
  lagnaTrop = normDeg(lagnaTrop + 90);
  const lagnaSidereal = normDeg(lagnaTrop - ayanamsha);

  const lagnaSignId = Math.floor(lagnaSidereal / 30);
  const lagnaDeg = parseFloat((lagnaSidereal % 30).toFixed(2));

  // Nakshatra calculation from Moon
  const nakshatraIndex = Math.floor((moonSidereal / 360.0) * 27);
  const nakshatraData = NAKSHATRAS[nakshatraIndex % 27];
  const nakshatraSpan = 360.0 / 27.0; // 13° 20' = 13.3333°
  const posInNakshatra = moonSidereal - (nakshatraIndex * nakshatraSpan);
  const pada = Math.min(4, Math.floor((posInNakshatra / nakshatraSpan) * 4) + 1);

  // Helper for planet position
  const createPlanet = (name: string, sanskrit: string, sym: string, deg: number): PlanetPosition => {
    const sId = Math.floor(deg / 30);
    const inSignDeg = parseFloat((deg % 30).toFixed(2));
    const house = ((sId - lagnaSignId + 12) % 12) + 1;
    const nIndex = Math.floor((deg / 360.0) * 27);
    const nName = NAKSHATRAS[nIndex % 27].name;
    const nLord = NAKSHATRAS[nIndex % 27].lord;

    // Dignity heuristic
    let dignity: PlanetPosition["dignity"] = "Neutral";
    if (name === "Sun" && sId === 0) dignity = "Exalted"; // Aries
    else if (name === "Sun" && sId === 6) dignity = "Debilitated"; // Libra
    else if (name === "Moon" && sId === 1) dignity = "Exalted"; // Taurus
    else if (name === "Moon" && sId === 7) dignity = "Debilitated"; // Scorpio
    else if (name === "Mars" && sId === 9) dignity = "Exalted"; // Capricorn
    else if (name === "Mars" && sId === 3) dignity = "Debilitated"; // Cancer
    else if (name === "Jupiter" && sId === 3) dignity = "Exalted"; // Cancer
    else if (name === "Jupiter" && sId === 9) dignity = "Debilitated"; // Capricorn
    else if (name === "Saturn" && sId === 6) dignity = "Exalted"; // Libra
    else if (name === "Saturn" && sId === 0) dignity = "Debilitated"; // Aries
    else if (RASHI_NAMES[sId].lord === name) dignity = "Own Sign";

    return {
      name,
      sanskritName: sanskrit,
      symbol: sym,
      sign: RASHI_NAMES[sId].en,
      signId: sId,
      degree: inSignDeg,
      absoluteDegree: parseFloat(deg.toFixed(2)),
      house,
      nakshatra: nName,
      nakshatraLord: nLord,
      dignity,
    };
  };

  const planets: PlanetPosition[] = [
    createPlanet("Sun", "Surya (सूर्य)", "☉", sunSidereal),
    createPlanet("Moon", "Chandra (चन्द्र)", "☽", moonSidereal),
    createPlanet("Mars", "Mangala (मंगल)", "♂", marsSidereal),
    createPlanet("Mercury", "Budha (बुध)", "☿", mercSidereal),
    createPlanet("Jupiter", "Guru (बृहस्पति)", "♃", jupSidereal),
    createPlanet("Venus", "Shukra (शुक्र)", "♀", venSidereal),
    createPlanet("Saturn", "Shani (शनि)", "♄", satSidereal),
    createPlanet("Rahu", "Rahu (राहु)", "☊", rahuSidereal),
    createPlanet("Ketu", "Ketu (केतु)", "☋", ketuSidereal),
  ];

  // Houses setup
  const houses = Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1;
    const signId = (lagnaSignId + i) % 12;
    const planetsInHouse = planets.filter((p) => p.house === houseNum).map((p) => p.name);
    return {
      houseNumber: houseNum,
      sign: RASHI_NAMES[signId].en,
      signId,
      planets: planetsInHouse,
      significator: ["Sun (Soul)", "Jupiter (Wealth)", "Mars (Courage)", "Moon (Mother)", "Jupiter (Intellect)", "Mars (Enemies)", "Venus (Partnership)", "Saturn (Longevity)", "Jupiter (Dharma)", "Mercury (Career)", "Jupiter (Gains)", "Saturn (Moksha)"][i],
    };
  });

  // Mangal Dosha check: Mars in 1, 2, 4, 7, 8, 12 from Lagna or Moon
  const marsHouseFromLagna = planets.find((p) => p.name === "Mars")?.house || 1;
  const moonHouse = planets.find((p) => p.name === "Moon")?.house || 1;
  const marsHouseFromMoon = ((planets.find((p) => p.name === "Mars")?.signId! - planets.find((p) => p.name === "Moon")?.signId! + 12) % 12) + 1;

  const manglikHouses = [1, 2, 4, 7, 8, 12];
  const isManglik = manglikHouses.includes(marsHouseFromLagna) || manglikHouses.includes(marsHouseFromMoon);
  let mangalDoshaDetails = "No Mangal Dosha detected in key houses.";
  if (isManglik) {
    mangalDoshaDetails = `Mars placed in House ${marsHouseFromLagna} from Ascendant (${marsHouseFromMoon} from Moon). Moderate influence on relationship pace; beneficial for leadership and ambition.`;
  }

  // Sade Sati check: Saturn in 12th, 1st, or 2nd house from Moon
  const moonSignId = Math.floor(moonSidereal / 30);
  const saturnSignId = Math.floor(satSidereal / 30);
  const diffFromMoon = (saturnSignId - moonSignId + 12) % 12;

  let sadeSatiActive = false;
  let sadeSatiPhase = "None";
  let sadeSatiDesc = "Saturn is currently in a neutral transit relative to your Natal Moon.";

  if (diffFromMoon === 11) {
    sadeSatiActive = true;
    sadeSatiPhase = "Rising (First Phase - 12th from Moon)";
    sadeSatiDesc = "Saturn influences finances and inner reflection. Time for conscious budgeting and mental resilience.";
  } else if (diffFromMoon === 0) {
    sadeSatiActive = true;
    sadeSatiPhase = "Peak (Core Phase - Over Natal Moon)";
    sadeSatiDesc = "Saturn transits directly over natal Moon. Great karmic transformation, discipline, and emotional maturation.";
  } else if (diffFromMoon === 1) {
    sadeSatiActive = true;
    sadeSatiPhase = "Setting (Final Phase - 2nd from Moon)";
    sadeSatiDesc = "Saturn in the final leg of Sade Sati. Family stabilization, career harvest, and reward for hard effort.";
  }

  // Vimshottari Dasha calculation
  const nakshatraLord = nakshatraData.lord;
  const lordIndex = DASHA_LORDS.findIndex((d) => d.name === nakshatraLord);
  const totalYears = DASHA_LORDS[lordIndex].years;
  const fractionElapsed = posInNakshatra / nakshatraSpan;
  const balanceYears = totalYears * (1 - fractionElapsed);

  let currentYear = year + (balanceYears < 1 ? 1 : Math.floor(balanceYears));
  const dashaTimeline: { planet: string; startYear: number; endYear: number }[] = [];
  let runner = year;

  // First balance dasha
  dashaTimeline.push({
    planet: nakshatraLord,
    startYear: year,
    endYear: Math.round(year + balanceYears),
  });
  runner = Math.round(year + balanceYears);

  // Next dashas
  for (let i = 1; i <= 8; i++) {
    const nextLord = DASHA_LORDS[(lordIndex + i) % 9];
    dashaTimeline.push({
      planet: nextLord.name,
      startYear: runner,
      endYear: runner + nextLord.years,
    });
    runner += nextLord.years;
  }

  // Find current Mahadasha based on current calendar year
  const nowYear = new Date().getFullYear();
  const activeDasha = dashaTimeline.find((d) => nowYear >= d.startYear && nowYear <= d.endYear) || dashaTimeline[0];

  // Gemstone recommendation based on Lagnesh
  const gemTable: Record<string, { primary: string; sanskritName: string; planet: string; metal: string; finger: string; mantra: string }> = {
    Aries: { primary: "Red Coral", sanskritName: "Moonga (मूंगा)", planet: "Mars", metal: "Copper/Gold", finger: "Ring Finger", mantra: "Om Kram Kreem Kroum Sah Bhaumaya Namah" },
    Taurus: { primary: "Diamond / White Zircon", sanskritName: "Heera (हीरा)", planet: "Venus", metal: "Silver/Platinum", finger: "Middle/Little Finger", mantra: "Om Dram Dreem Droum Sah Shukraya Namah" },
    Gemini: { primary: "Emerald", sanskritName: "Panna (पन्ना)", planet: "Mercury", metal: "Bronze/Gold", finger: "Little Finger", mantra: "Om Bram Breem Broum Sah Budhaya Namah" },
    Cancer: { primary: "Natural Pearl", sanskritName: "Moti (मोती)", planet: "Moon", metal: "Silver", finger: "Little Finger", mantra: "Om Shram Shreem Shroum Sah Chandraya Namah" },
    Leo: { primary: "Ruby", sanskritName: "Manikya (माणिक्य)", planet: "Sun", metal: "Gold/Copper", finger: "Ring Finger", mantra: "Om Hram Hreem Hroum Sah Suryaya Namah" },
    Virgo: { primary: "Emerald", sanskritName: "Panna (पन्ना)", planet: "Mercury", metal: "Gold/Silver", finger: "Little Finger", mantra: "Om Bram Breem Broum Sah Budhaya Namah" },
    Libra: { primary: "White Sapphire / Diamond", sanskritName: "Heera / Pukhraj", planet: "Venus", metal: "Silver/White Gold", finger: "Middle Finger", mantra: "Om Dram Dreem Droum Sah Shukraya Namah" },
    Scorpio: { primary: "Red Coral", sanskritName: "Moonga (मूंगा)", planet: "Mars", metal: "Copper/Gold", finger: "Ring Finger", mantra: "Om Kram Kreem Kroum Sah Bhaumaya Namah" },
    Sagittarius: { primary: "Yellow Sapphire", sanskritName: "Pukhraj (पुखराज)", planet: "Jupiter", metal: "Gold/Brass", finger: "Index Finger", mantra: "Om Gram Greem Groum Sah Gurave Namah" },
    Capricorn: { primary: "Blue Sapphire / Amethyst", sanskritName: "Neelam (नीलम)", planet: "Saturn", metal: "Silver/Panchdhatu", finger: "Middle Finger", mantra: "Om Pram Preem Proum Sah Shanaischaraya Namah" },
    Aquarius: { primary: "Blue Sapphire / Iolite", sanskritName: "Neelam (नीलम)", planet: "Saturn", metal: "Silver/Iron", finger: "Middle Finger", mantra: "Om Sham Shanaishcharaye Namah" },
    Pisces: { primary: "Yellow Sapphire", sanskritName: "Pukhraj (पुखराज)", planet: "Jupiter", metal: "Gold", finger: "Index Finger", mantra: "Om Gram Greem Groum Sah Gurave Namah" },
  };

  const lagnaSignName = RASHI_NAMES[lagnaSignId].en;
  const gemstone = gemTable[lagnaSignName] || gemTable["Aries"];

  return {
    ascendant: {
      sign: lagnaSignName,
      signId: lagnaSignId,
      degree: lagnaDeg,
      nakshatra: NAKSHATRAS[Math.floor((lagnaSidereal / 360.0) * 27) % 27].name,
    },
    moon: {
      sign: RASHI_NAMES[moonSignId].en,
      signId: moonSignId,
      degree: parseFloat((moonSidereal % 30).toFixed(2)),
    },
    nakshatra: {
      name: nakshatraData.name,
      number: nakshatraIndex + 1,
      pada,
      lord: nakshatraData.lord,
      deity: nakshatraData.deity,
      gana: nakshatraData.gana,
      yoni: nakshatraData.yoni,
      nadi: nakshatraData.nadi,
    },
    planets,
    houses,
    dasha: {
      currentMahadasha: activeDasha.planet,
      currentAntardasha: nakshatraLord,
      balanceAtBirth: `${balanceYears.toFixed(1)} Years of ${nakshatraLord}`,
      timeline: dashaTimeline,
    },
    doshas: {
      mangalDosha: isManglik,
      mangalDoshaDetails,
      sadeSati: {
        active: sadeSatiActive,
        phase: sadeSatiPhase,
        description: sadeSatiDesc,
      },
      kalsarpDosha: Math.abs(rahuSidereal - ketuSidereal) === 180,
    },
    gemstoneRecommendation: gemstone,
  };
}

// Ashtakoot Guna Milan (36 Gunas)
export function calculateGunaMilan(
  groomNakshatraIdx: number,
  groomMoonSignIdx: number,
  brideNakshatraIdx: number,
  brideMoonSignIdx: number
): AshtakootScore {
  const gNak = NAKSHATRAS[groomNakshatraIdx % 27];
  const bNak = NAKSHATRAS[brideNakshatraIdx % 27];

  // 1. Varna (1 point)
  const varnaRank = (sign: number) => {
    if ([3, 7, 11].includes(sign)) return 4; // Brahmin (Water)
    if ([0, 4, 8].includes(sign)) return 3; // Kshatriya (Fire)
    if ([1, 5, 9].includes(sign)) return 2; // Vaishya (Earth)
    return 1; // Shudra (Air)
  };
  const gVarna = varnaRank(groomMoonSignIdx);
  const bVarna = varnaRank(brideMoonSignIdx);
  const varnaPts = gVarna >= bVarna ? 1 : 0;

  // 2. Vashya (2 points)
  let vashyaPts = 1;
  if (groomMoonSignIdx === brideMoonSignIdx) vashyaPts = 2;
  else if ([0, 4, 8].includes(groomMoonSignIdx) && [0, 4, 8].includes(brideMoonSignIdx)) vashyaPts = 2;
  else if (Math.abs(groomMoonSignIdx - brideMoonSignIdx) === 6) vashyaPts = 0.5;

  // 3. Tara (3 points)
  const taraVal1 = ((brideNakshatraIdx - groomNakshatraIdx + 27) % 9) + 1;
  const taraVal2 = ((groomNakshatraIdx - brideNakshatraIdx + 27) % 9) + 1;
  const isAuspicious = (v: number) => [2, 4, 6, 8, 9].includes(v);
  let taraPts = 0;
  if (isAuspicious(taraVal1) && isAuspicious(taraVal2)) taraPts = 3;
  else if (isAuspicious(taraVal1) || isAuspicious(taraVal2)) taraPts = 1.5;

  // 4. Yoni (4 points)
  let yoniPts = 2;
  if (gNak.yoni === bNak.yoni) yoniPts = 4;
  else if (
    (gNak.yoni === "Horse" && bNak.yoni === "Buffalo") ||
    (gNak.yoni === "Cat" && bNak.yoni === "Rat") ||
    (gNak.yoni === "Serpent" && bNak.yoni === "Mongoose") ||
    (gNak.yoni === "Dog" && bNak.yoni === "Deer")
  ) {
    yoniPts = 0; // Enemy Yonis
  } else {
    yoniPts = 3; // Friendly / Neutral
  }

  // 5. Graha Maitri (5 points)
  const gLord = RASHI_NAMES[groomMoonSignIdx].lord;
  const bLord = RASHI_NAMES[brideMoonSignIdx].lord;
  let maitriPts = 3;
  if (gLord === bLord) maitriPts = 5;
  else if ((gLord === "Sun" && bLord === "Moon") || (gLord === "Jupiter" && bLord === "Sun")) maitriPts = 5;
  else if ((gLord === "Saturn" && bLord === "Sun") || (gLord === "Mars" && bLord === "Mercury")) maitriPts = 0.5;

  // 6. Gana (6 points)
  let ganaPts = 0;
  if (gNak.gana === bNak.gana) ganaPts = 6;
  else if ((gNak.gana === "Deva" && bNak.gana === "Manushya") || (gNak.gana === "Manushya" && bNak.gana === "Deva")) ganaPts = 5;
  else if (gNak.gana === "Rakshasa" && bNak.gana === "Rakshasa") ganaPts = 6;
  else ganaPts = 1;

  // 7. Bhakoot (7 points)
  const dist = ((brideMoonSignIdx - groomMoonSignIdx + 12) % 12) + 1;
  let bhakootPts = 7;
  // 2/12, 6/8, 9/5 doshas
  if ([2, 12, 6, 8].includes(dist)) {
    bhakootPts = 0;
  }

  // 8. Nadi (8 points) - most critical
  let nadiPts = 0;
  if (gNak.nadi !== bNak.nadi) {
    nadiPts = 8;
  } else {
    nadiPts = 0; // Same Nadi Dosha
  }

  const total = parseFloat((varnaPts + vashyaPts + taraPts + yoniPts + maitriPts + ganaPts + bhakootPts + nadiPts).toFixed(1));

  let category: AshtakootScore["category"] = "Average";
  let verdict = "Moderate compatibility with potential for mutual growth.";
  if (total >= 28) {
    category = "Excellent";
    verdict = "Exceptional astrological alignment. Highly auspicious for lifelong prosperity, spiritual resonance, and happiness.";
  } else if (total >= 21) {
    category = "Very Good";
    verdict = "Very auspicious match. Harmonious emotional and intellectual connection with strong foundation.";
  } else if (total >= 18) {
    category = "Average";
    verdict = "Acceptable match by classical standards (18+ points threshold met). Simple remedies recommended for harmony.";
  } else {
    category = "Requires Remedies";
    verdict = "Score below traditional 18-point threshold. Astrological harmonization, mutual patience, and Nadi/Bhakoot remedies advised.";
  }

  return {
    varna: { points: varnaPts, max: 1, desc: "Spiritual & Ego harmony" },
    vashya: { points: vashyaPts, max: 2, desc: "Mutual attraction & influence" },
    tara: { points: taraPts, max: 3, desc: "Destiny, health & longevity" },
    yoni: { points: yoniPts, max: 4, desc: "Intimacy & physical compatibility" },
    grahaMaitri: { points: maitriPts, max: 5, desc: "Psychological friendship" },
    gana: { points: ganaPts, max: 6, desc: "Temperament & nature" },
    bhakoot: { points: bhakootPts, max: 7, desc: "Family welfare & prosperity" },
    nadi: { points: nadiPts, max: 8, desc: "Genetic health & nervous system" },
    total,
    verdict,
    category,
  };
}
