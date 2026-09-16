import { BirthData } from "../types";

const STORAGE_KEY = "astro_user_birth_data";

export const getStoredBirthData = (): BirthData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load birth data from storage", e);
  }

  // Default clean state - DO NOT hardcode "Aarav Sharma"!
  return {
    name: "",
    gender: "male",
    date: "1998-08-15",
    time: "08:30",
    place: "New Delhi, India",
    lat: 28.6139,
    lon: 77.209,
    timezone: 5.5,
    focusArea: "Career, Finance, Marriage & Planetary Guidance",
  };
};

export const saveStoredBirthData = (data: BirthData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save birth data to storage", e);
  }
};
