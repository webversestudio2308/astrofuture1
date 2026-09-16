export type Language = "en" | "hi";

export interface BirthData {
  name: string;
  gender: "male" | "female" | "other";
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  place: string;
  lat: number;
  lon: number;
  timezone: number; // offset in hours, e.g. 5.5 for IST
  focusArea?: string;
}

export interface PlanetPosition {
  name: string;
  sanskritName: string;
  symbol: string;
  sign: string;
  signId: number; // 0 - 11 (Aries to Pisces)
  degree: number; // 0 - 30
  absoluteDegree: number; // 0 - 360
  house: number; // 1 - 12
  nakshatra: string;
  nakshatraLord: string;
  isRetrograde?: boolean;
  dignity?: "Exalted" | "Debilitated" | "Own Sign" | "Moolatrikona" | "Friendly" | "Neutral" | "Enemy";
}

export interface KundaliResult {
  ascendant: {
    sign: string;
    signId: number;
    degree: number;
    nakshatra: string;
  };
  moon: {
    sign: string;
    signId: number;
    degree: number;
  };
  nakshatra: {
    name: string;
    number: number;
    pada: number;
    lord: string;
    deity: string;
    gana: "Deva" | "Manushya" | "Rakshasa";
    yoni: string;
    nadi: "Adi" | "Madhya" | "Antya";
  };
  planets: PlanetPosition[];
  houses: {
    houseNumber: number;
    sign: string;
    signId: number;
    planets: string[];
    significator: string;
  }[];
  dasha: {
    currentMahadasha: string;
    currentAntardasha: string;
    balanceAtBirth: string;
    timeline: { planet: string; startYear: number; endYear: number }[];
  };
  doshas: {
    mangalDosha: boolean;
    mangalDoshaDetails: string;
    sadeSati: {
      active: boolean;
      phase: string;
      description: string;
    };
    kalsarpDosha: boolean;
  };
  gemstoneRecommendation: {
    primary: string;
    sanskritName: string;
    planet: string;
    metal: string;
    finger: string;
    mantra: string;
  };
}

export interface AshtakootScore {
  varna: { points: number; max: 1; desc: string };
  vashya: { points: number; max: 2; desc: string };
  tara: { points: number; max: 3; desc: string };
  yoni: { points: number; max: 4; desc: string };
  grahaMaitri: { points: number; max: 5; desc: string };
  gana: { points: number; max: 6; desc: string };
  bhakoot: { points: number; max: 7; desc: string };
  nadi: { points: number; max: 8; desc: string };
  total: number;
  verdict: string;
  category: "Excellent" | "Very Good" | "Average" | "Requires Remedies" | "Not Recommended";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  requiresPayment?: boolean;
}
