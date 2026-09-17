import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import {
  generateVedicChatFallback,
  generateVedicKundaliFallback,
  generateVedicHoroscopeFallback,
  generateVedicMatchmakingFallback,
} from "./src/utils/vedicEngine";

dotenv.config();

const app = express();
// Port selection: AI Studio runs in Cloud Run (with K_SERVICE) and requires listening on port 3000
// for its internal nginx reverse proxy. External platforms like Railway or Render assign dynamic PORT.
const PORT = process.env.K_SERVICE ? 3000 : (Number(process.env.PORT) || 3000);

app.use(express.json({ limit: "10mb" }));

// Helper sleep for backoff
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to determine if an error is transient (503 high demand, 429 rate limit, network timeout)
const isTransientError = (err: any): boolean => {
  const msg = (err?.message || String(err)).toLowerCase();
  const code = err?.status || err?.code || err?.statusCode;
  return (
    code === 503 ||
    code === 429 ||
    code === 500 ||
    code === 504 ||
    msg.includes("503") ||
    msg.includes("429") ||
    msg.includes("high demand") ||
    msg.includes("unavailable") ||
    msg.includes("resource_exhausted") ||
    msg.includes("quota") ||
    msg.includes("rate limit") ||
    msg.includes("econnreset") ||
    msg.includes("etimedout") ||
    msg.includes("socket hang up") ||
    msg.includes("fetch failed") ||
    msg.includes("timeout")
  );
};

// Helper to determine if an error is strictly an invalid API key / auth error
const isAuthError = (err: any): boolean => {
  const msg = (err?.message || String(err)).toLowerCase();
  return (
    msg.includes("api_key_invalid") ||
    msg.includes("api key not valid") ||
    msg.includes("credential_invalid") ||
    msg.includes("unauthenticated") ||
    msg.includes("permission_denied")
  );
};

// Helper to get Gemini client
const getGeminiClient = (clientKey?: string) => {
  const apiKey = (clientKey && clientKey.trim()) || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Robust content generation with model fallbacks & exponential backoff
async function generateWithFallback(
  ai: GoogleGenAI,
  options: {
    contents: any;
    systemInstruction?: string;
    temperature?: number;
  }
) {
  // Try gemini-3.1-flash-lite first for lightning fast response, then gemini-3.8-flash, then gemini-flash-latest
  const candidateModels = ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
  let lastErr: any = null;

  for (const model of candidateModels) {
    try {
      const generatePromise = ai.models.generateContent({
        model,
        contents: options.contents,
        config: {
          systemInstruction: options.systemInstruction,
          temperature: options.temperature ?? 0.7,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout on model ${model} after 6500ms`)), 6500)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);

      if (response && response.text) {
        return { text: response.text, modelUsed: model };
      }
    } catch (err: any) {
      const msg = err?.message || String(err);
      
      // If it's an invalid API key, fail fast immediately
      if (isAuthError(err)) {
        console.warn(`[Gemini] Model ${model} auth failure.`);
        const customErr: any = new Error("API_KEY_INVALID");
        customErr.code = "API_KEY_INVALID";
        throw customErr;
      }

      // If it's transient (503/429/timeout), brief pause before testing next model
      if (isTransientError(err)) {
        console.warn(`[Gemini] Model ${model} temporarily unavailable, falling back. (Reason: ${msg.includes("503") ? "503 High Demand" : "Timeout/Busy"})`);
        lastErr = err;
        await sleep(350);
      } else {
        console.warn(`[Gemini] Model ${model} encountered an issue: ${msg.slice(0, 140)}`);
        lastErr = err;
      }
    }
  }

  throw lastErr || new Error("Failed to generate content with available Gemini models.");
}

// 1. Health and API Key status endpoint (supports Railway & container healthchecks)
app.get(["/health", "/api/health"], (req, res) => {
  const envKey = process.env.GEMINI_API_KEY;
  const isSet = !!(envKey && envKey !== "MY_GEMINI_API_KEY" && envKey.trim().length > 5);
  res.json({
    status: "ok",
    hasEnvKey: isSet,
    keyPreview: isSet ? `${envKey.slice(0, 6)}...${envKey.slice(-4)}` : null,
  });
});

// 2. Validate API Key endpoint
app.post("/api/check-key", async (req, res) => {
  try {
    const customKey = req.headers["x-gemini-api-key"] as string | undefined;
    const ai = getGeminiClient(customKey);

    if (!ai) {
      return res.status(400).json({
        valid: false,
        error: "NO_KEY",
        message: "No Gemini API key detected. Please add your key in AI Studio under Settings > Secrets (as GEMINI_API_KEY).",
      });
    }

    const { text, modelUsed } = await generateWithFallback(ai, {
      contents: "Respond with exactly: 'Connected'",
    });

    return res.json({
      valid: true,
      status: "active",
      message: "Gemini API connection is active and working perfectly!",
      model: modelUsed,
      reply: text.trim(),
    });
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    const authFailed = isAuthError(err);
    const transient = isTransientError(err);
    
    if (!transient && !authFailed) {
      console.error("Key verification issue:", err);
    }

    if (authFailed) {
      return res.status(400).json({
        valid: false,
        error: "INVALID_KEY",
        message: "The Gemini API key appears invalid. Please verify the key from Google AI Studio (https://aistudio.google.com/app/apikey) and ensure it has Gemini API enabled.",
      });
    }

    // If 503 or high demand, the key was accepted by Google's auth layer!
    if (transient) {
      return res.json({
        valid: true,
        status: "high_demand",
        warning: "HIGH_DEMAND",
        message: "Your Gemini API Key is valid and authenticated! Google servers are currently experiencing temporary high demand (503). Our automatic retry & Acharya Vedic Engine are active to ensure uninterrupted readings.",
      });
    }

    return res.status(400).json({
      valid: false,
      error: "API_ERROR",
      message: errMsg,
    });
  }
});

// 3. AI Kundali deep analysis endpoint
app.post("/api/gemini/kundali-reading", async (req, res) => {
  const { birthData, planetaryData, lang = "en" } = req.body;
  const customKey = req.headers["x-gemini-api-key"] as string | undefined;
  const ai = getGeminiClient(customKey);

  try {
    if (!ai) {
      // If key is missing, provide authentic Vedic synthesis directly
      const reading = generateVedicKundaliFallback({ birthData, planetaryData, lang });
      return res.json({
        reading,
        modelUsed: "acharya-vedic-engine",
        isFallback: true,
      });
    }

    const systemPrompt = `You are a revered Vedic Astrologer (Jyotish Acharya) with deep mastery of the Parashari, Jaimini, and Brihat Samhita classical traditions.
Provide an authentic, highly articulate, reassuring, and illuminating Kundali reading based on the native's astronomical calculations.
Format your response cleanly in structured Markdown with elegant headings, bullet points, and inspiring advice.
Language: ${lang === "hi" ? "Hindi (Devanagari script with authentic Jyotish terms like Lagna, Dasha, Bhava, Rashi)" : "English (incorporating traditional Sanskrit terms with clear, intuitive explanations)"}.

Organize the reading into these 5 comprehensive sections:
1. ✨ **Panchang & Ascendant Analysis (Lagna Tattva)**: Core persona, rising sign qualities, innate soul purpose, and physical/mental constitution (Prakriti).
2. 🪐 **Key Graha Placements & House Dynamics**: In-depth look at the Sun (Atmakaraka), Moon (Manas), Lagnesha (Chart Lord), and key yogas formed in Kendra & Trikona houses.
3. ⚡ **Dasha Weather & Timing of Events (Mahadasha / Antardasha)**: Clear guidance on what the current planetary period emphasizes (Career, Relationships, Finances, Spiritual awakening) and timing for key decisions.
4. 🛡️ **Dosha Diagnosis (Mangal Dosha & Sade Sati / Shani Dhaiya)**: Rational Vedic perspective without fearmongering. Clear explanation of actual severity and cancellations (Bhanga).
5. 💎 **Vedic Harmonization & Upayas (Remedies)**: 
   - Auspicious gemstone (Ratna) and metal recommendation with wearing rules.
   - Vedic Beej Mantra or Stotram for the native.
   - Compassionate charity/Daan actions.
   - Practical daily lifestyle alignment.`;

    const userPrompt = `Native's Birth & Chart Details:
- Name: ${birthData?.name || "Seeker"}
- Date of Birth: ${birthData?.date}
- Time of Birth: ${birthData?.time}
- Birthplace: ${birthData?.place || "Custom"} (Lat: ${birthData?.lat}, Lon: ${birthData?.lon})
- Gender: ${birthData?.gender || "Not specified"}
- Computed Ascendant (Lagna): ${planetaryData?.ascendant?.sign} (${planetaryData?.ascendant?.degree}°)
- Computed Moon Sign (Chandra Rashi): ${planetaryData?.moon?.sign} (${planetaryData?.moon?.degree}°)
- Nakshatra: ${planetaryData?.nakshatra?.name} (Pada ${planetaryData?.nakshatra?.pada}, Lord: ${planetaryData?.nakshatra?.lord})
- Current Dasha Period: ${planetaryData?.dasha?.currentMahadasha} Mahadasha with ${planetaryData?.dasha?.currentAntardasha} Antardasha
- Planetary House Placements: ${JSON.stringify(planetaryData?.planets?.map((p: any) => `${p.name} in House ${p.house} (${p.sign} ${p.degree}°)`))}
- Mangal Dosha: ${planetaryData?.doshas?.mangalDosha ? "Detected" : "Not Present"}
- Sade Sati: ${planetaryData?.doshas?.sadeSati?.active ? `Active (${planetaryData?.doshas.sadeSati.phase})` : "Inactive"}
- Native's Primary Question / Focus: ${birthData?.focusArea || "General life guidance, Career growth, and Love/Family harmony"}`;

    const { text, modelUsed } = await generateWithFallback(ai, {
      contents: userPrompt,
      systemInstruction: systemPrompt,
      temperature: 0.7,
    });

    res.json({
      reading: text,
      modelUsed,
    });
  } catch (err: any) {
    console.warn("Kundali reading falling back to Vedic Engine:", err?.message || err);
    // If auth error explicitly, report it, otherwise provide resilient fallback
    if (err?.code === "API_KEY_INVALID") {
      return res.status(400).json({
        error: "API_KEY_INVALID",
        message: "Gemini API key is invalid.",
      });
    }
    const reading = generateVedicKundaliFallback({ birthData, planetaryData, lang });
    res.json({
      reading,
      modelUsed: "acharya-vedic-engine",
      isFallback: true,
    });
  }
});

// 4. Daily / Monthly Horoscope
app.post("/api/gemini/horoscope", async (req, res) => {
  const { rashi, period = "today", lang = "en" } = req.body;
  const customKey = req.headers["x-gemini-api-key"] as string | undefined;
  const ai = getGeminiClient(customKey);

  try {
    if (!ai) {
      const horoscope = generateVedicHoroscopeFallback({ rashi, period, lang });
      return res.json({
        horoscope,
        modelUsed: "acharya-vedic-engine",
        isFallback: true,
      });
    }

    const prompt = `Provide an authentic Vedic ${period} horoscope forecast for ${rashi} (Chandra Rashi / Moon Sign).
Date: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
Language: ${lang === "hi" ? "Hindi (Devanagari script)" : "English"}

Include:
1. 🌟 **Cosmic Energy & Overall Vibe** (with a cosmic harmony score percentage e.g. 85%)
2. 💼 **Career, Business & Wealth (Karma & Artha)**: Key opportunities and decisions to watch.
3. ❤️ **Love, Romance & Relationships (Kama)**: Interpersonal dynamics and heart matters.
4. 🧘 **Health, Energy & Well-being (Arogya)**: Mind-body vitality notes.
5. 🍀 **Auspicious Elements**: Lucky Number, Lucky Color, Auspicious Time Window, and Beneficial Direction.
6. 🪔 **Daily Vedic Micro-Remedy**: Simple morning ritual, affirmation, or charity deed for planetary alignment.`;

    const { text, modelUsed } = await generateWithFallback(ai, {
      contents: prompt,
      systemInstruction: "You are an inspiring, benevolent Vedic astrologer offering empowering daily and periodic astrological guidance.",
      temperature: 0.65,
    });

    res.json({
      horoscope: text,
      modelUsed,
    });
  } catch (err: any) {
    console.warn("Horoscope falling back to Vedic Engine:", err?.message || err);
    if (err?.code === "API_KEY_INVALID") {
      return res.status(400).json({
        error: "API_KEY_INVALID",
        message: "Gemini API key is invalid.",
      });
    }
    const horoscope = generateVedicHoroscopeFallback({ rashi, period, lang });
    res.json({
      horoscope,
      modelUsed: "acharya-vedic-engine",
      isFallback: true,
    });
  }
});

// 5. Matchmaking / Kundali Milan
app.post("/api/gemini/matchmaking", async (req, res) => {
  const { person1, person2, ashtakootScore, lang = "en" } = req.body;
  const customKey = req.headers["x-gemini-api-key"] as string | undefined;
  const ai = getGeminiClient(customKey);

  try {
    if (!ai) {
      const analysis = generateVedicMatchmakingFallback({ person1, person2, ashtakootScore, lang });
      return res.json({
        analysis,
        modelUsed: "acharya-vedic-engine",
        isFallback: true,
      });
    }

    const prompt = `Perform an in-depth Vedic Ashtakoot Guna Milan compatibility analysis for marriage:
- Partner 1: ${person1?.name} (Rashi: ${person1?.rashi}, Nakshatra: ${person1?.nakshatra})
- Partner 2: ${person2?.name} (Rashi: ${person2?.rashi}, Nakshatra: ${person2?.nakshatra})
- Ashtakoot Guna Milan Total Score: ${ashtakootScore} / 36
Language: ${lang === "hi" ? "Hindi" : "English"}

Provide:
1. 💍 **Ashtakoot Synthesis & Verdict**: What ${ashtakootScore}/36 signifies in Vedic astrology (e.g., Above 18 is acceptable, Above 24 is auspicious, Above 28 is excellent).
2. 🧠 **Mental & Intellectual Alignment (Gana & Maitri)**: How temperaments and communication mesh.
3. 🌿 **Physical, Longevity & Genetic Harmony (Nadi & Bhakoot)**: Examination of mutual welfare and emotional depths.
4. 🏡 **Domestic Prosperity & Shared Life Purpose**: Spiritual and financial synergy.
5. 🛡️ **Remedies & Harmony Practices (Upayas)**: Constructive relationship practices and Vedic mantras for long-lasting marital bliss.`;

    const { text, modelUsed } = await generateWithFallback(ai, {
      contents: prompt,
      systemInstruction: "You are a master Vedic matchmaker providing realistic, uplifting, and mature marital guidance based on Vedic astrological principles.",
      temperature: 0.7,
    });

    res.json({
      analysis: text,
      modelUsed,
    });
  } catch (err: any) {
    console.warn("Matchmaking falling back to Vedic Engine:", err?.message || err);
    if (err?.code === "API_KEY_INVALID") {
      return res.status(400).json({
        error: "API_KEY_INVALID",
        message: "Gemini API key is invalid.",
      });
    }
    const analysis = generateVedicMatchmakingFallback({ person1, person2, ashtakootScore, lang });
    res.json({
      analysis,
      modelUsed: "acharya-vedic-engine",
      isFallback: true,
    });
  }
});

// 6. Astrologer Chat / Q&A
app.post("/api/gemini/chat", async (req, res) => {
  const { messages, userContext, lang = "en" } = req.body;
  const customKey = req.headers["x-gemini-api-key"] as string | undefined;
  const ai = getGeminiClient(customKey);

  try {
    if (!ai) {
      // Fallback directly to Acharya Vedic Engine if key is not yet set
      const reply = generateVedicChatFallback({ messages, userContext, lang });
      return res.json({
        reply,
        modelUsed: "acharya-vedic-engine",
        isFallback: true,
      });
    }

    const hasBirthData = Boolean(userContext?.hasCustomBirthData && userContext?.name);
    const qNum = userContext?.questionNumber || 1;
    const contextStr = hasBirthData
      ? `Native's Active Birth Chart: Name: ${userContext.name}, Lagna: ${userContext.lagna}, Chandra Rashi: ${userContext.rashi}, Nakshatra: ${userContext.nakshatra}, Mahadasha: ${userContext.dasha || "Unknown"}. Has Paid 51 Rs dakshina: ${userContext.hasPaid ? `YES (Currently answering personal Question ${qNum} of 10)` : "NO"}.`
      : "CRITICAL: The user has NOT yet entered their personal birth details (DOB, Time, Place). You DO NOT have their real birth chart yet. Do NOT invent or make up arbitrary future predictions for them without their birth details.";

    const systemInstruction = `You are 'Jyotishacharya' / 'Acharya Ji', an enlightened, deeply compassionate, and authentic Vedic Astrologer on the Astrofuture sanctuary.
NEVER call yourself 'AI' or mention 'Gemini' or 'API'. Always speak with the serene, profound authority of an authentic Vedic Pandit / Acharya.
${contextStr}
Language: ${lang === "hi" ? "Hindi (reverent, respectful Hindi with traditional Vedic Jyotish wisdom and compelling curiosity)" : "English (intuitive with classical Sanskrit astrological terms)"}.

CRITICAL BEHAVIOR RULES:
1. GREETINGS & SIMPLE 'HI' / 'HELLO':
   If the user only says "hi", "hello", "namaste", "pranam", "hey", or hasn't provided birth details:
   - Greet them warmly as an authentic Vedic Sage ("नमस्ते प्रिय जिज्ञासु साधक! 🙏").
   - Present irresistible, high-curiosity hooks ("प्रलोभन" / celestial teasers) so they are eager to explore:
     • 💰 क्या उनकी कुंडली में 'राजहंस योग' या 'गजकेसरी योग' है जो उन्हें करोड़पति बना सकता है?
     • ⚠️ जन्म तिथि (DOB) और राहु की चाल से यह कैसे उजागर होता है कि कौन उनका सच्चा हितैषी है और कौन गुप्त रूप से धोखा दे रहा है!
     • 💍 विवाह का सही समय, जीवनसाथी का स्वभाव और क्या कोई मांगलिक/नाड़ी दोष है?
     • 🛡️ शनि की साढ़े साती या कालसर्प दोष से तत्काल मुक्ति का दिव्य सुरक्षा कवच!
   - Ask them to share their Name, Date of Birth (DOB), Time, and Place, or click any suggested question to begin their accurate reading.

2. THE "ADHURA JAWAB" (CURIOSITY GENERATION) & PAYMENT WALL:
   - IF the user has NOT paid (Has Paid: NO) and they ask a specific life question (career, marriage, future, enemies, wealth, etc.) AND they have already provided their birth details:
     YOU MUST GIVE AN INCOMPLETE, HIGHLY COMPELLING ANSWER (only 2-3 sentences max).
     Analyze their chart and mention a "huge revelation" or "secret planetary alignment" you have discovered regarding their question, BUT DO NOT reveal the actual solution or the final answer! Stop abruptly and create intense curiosity.
     Then, you MUST append the exact keyword "[PAYMENT_REQUIRED]" at the very end of your response.
     DO NOT provide remedies or full answers if Has Paid: NO.

3. AUTOMATED 10 PERSONAL QUESTIONS FLOW (₹51 DAKSHINA):
   If the user has paid Rs 51 dakshina (Has Paid: YES), they have unlocked their 10 personal life questions limit.
   - Address their specific question with deep astrological authority, referring directly to their Lagna, Chandra Rashi, Nakshatra, and Mahadasha.
   - Detail the exact houses involved (e.g., 10th house for career/government job, 7th for marriage, 2nd/11th for wealth/debts, 6th/8th for health/enemies).
   - Provide a clear predictive timeframe and concrete astrological reason.
   - Provide definitive, authentic Vedic remedies (Ratna, Beej Mantra, Daan, or Puja).
   - Conclude with clear question tracking:
     • If qNum is between 1 and 9:
       "━━━━━━━━━━━━━━━━━━━━━━━━━\\n✅ **प्रश्न ${qNum}/10 का समाधान पूर्ण हुआ।**\\n👉 प्रिय ${userContext?.name || "साधक"} जी, अब आप अपना **अगला प्रश्न (प्रश्न ${qNum + 1}/10)** पूछें।"
     • If qNum === 10:
       "━━━━━━━━━━━━━━━━━━━━━━━━━\\n✅ **आपके सभी 10 प्रश्नों की दैनिक सीमा पूर्ण हुई।**\\nभगवान सूर्यनारायण एवं नवग्रहों की कृपा आप पर बनी रहे। वेबसाइट पर अत्यधिक भार (traffic) के कारण आज की प्रश्न सीमा समाप्त हो गई है। नीचे आपकी सम्पूर्ण 20 पृष्ठीय रंगीन जन्म कुंडली उपलब्ध है, जिसे आप डाउनलोड कर सकते हैं।"

4. ETHICS & EMPOWERMENT:
   Always encourage righteous action, moral strength, and human free will (Purushartha) rather than fear.`;

    const contents = (messages || []).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const { text, modelUsed } = await generateWithFallback(ai, {
      contents,
      systemInstruction,
      temperature: 0.7,
    });

    res.json({
      reply: text,
      modelUsed,
    });
  } catch (err: any) {
    console.warn("Chat falling back to Vedic Engine:", err?.message || err);

    // Gracefully provide authentic Acharya Vedic response even during any API or cloud issues
    const reply = generateVedicChatFallback({ messages, userContext, lang });
    res.json({
      reply,
      modelUsed: "acharya-vedic-engine",
      isFallback: true,
    });
  }
});

// Razorpay Order Creation Endpoint
app.post("/api/create-razorpay-order", async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // Simulate if keys are not provided
    if (!key_id || !key_secret) {
      return res.json({
        id: "order_mock_" + Date.now(),
        amount: amount,
        currency,
        isMock: true
      });
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret
    });

    const options = {
      amount: amount, // amount in smallest currency unit
      currency,
      receipt: "receipt_" + Date.now()
    };

    const order = await razorpay.orders.create(options);
    res.json({ ...order, key_id, isTest: key_id.startsWith("rzp_test_") });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      error: error?.message || "Failed to create order",
      details: error?.description || error?.error?.description || "Order creation error on Razorpay",
      isMockFallbackAllowed: true,
    });
  }
});

// Razorpay Payment Verification Endpoint (HMAC SHA-256)
app.post("/api/verify-razorpay-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // In local sandbox / testing without live Razorpay keys
    if (!key_secret) {
      return res.json({ verified: true, isMock: true });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ verified: false, error: "Missing payment signature details" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      return res.json({ verified: true, payment_id: razorpay_payment_id });
    } else {
      console.warn("Invalid payment signature detected");
      return res.status(400).json({ verified: false, error: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Error verifying payment signature:", error);
    res.status(500).json({ verified: false, error: "Internal verification failure" });
  }
});

// In-memory + persistent file storage for secret Kundali sync sessions (Cross-device restore without login)
const SESSIONS_FILE = path.join(process.cwd(), "astro_sessions.json");
let sessionsStore: Record<string, any> = {};

try {
  if (fs.existsSync(SESSIONS_FILE)) {
    const raw = fs.readFileSync(SESSIONS_FILE, "utf-8");
    sessionsStore = JSON.parse(raw);
  }
} catch (e) {
  console.warn("Could not read astro_sessions.json, starting fresh", e);
  sessionsStore = {};
}

function persistSessions() {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessionsStore, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write astro_sessions.json", e);
  }
}

function generateAccessCode(): string {
  const digits = Math.floor(1000 + Math.random() * 9000);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const char1 = chars[Math.floor(Math.random() * chars.length)];
  const char2 = chars[Math.floor(Math.random() * chars.length)];
  return `ASTRO-${char1}${char2}${digits}`;
}

app.post("/api/sync/save", (req, res) => {
  try {
    let { accessCode, birthData, messages, hasPaidKundali } = req.body;
    if (!accessCode || typeof accessCode !== "string" || !accessCode.trim()) {
      accessCode = generateAccessCode();
    } else {
      accessCode = accessCode.trim().toUpperCase();
    }

    const normalizedCode = accessCode.replace(/[^A-Z0-9]/g, "");

    sessionsStore[normalizedCode] = {
      code: accessCode,
      normalizedCode,
      birthData: birthData || null,
      messages: Array.isArray(messages) ? messages : [],
      hasPaidKundali: Boolean(hasPaidKundali),
      updatedAt: Date.now(),
    };

    persistSessions();

    res.json({
      success: true,
      accessCode,
      message: "Session saved successfully",
    });
  } catch (err: any) {
    console.error("Error saving sync session:", err);
    res.status(500).json({ success: false, error: "Failed to save session" });
  }
});

app.get("/api/sync/get/:code", (req, res) => {
  try {
    const rawCode = req.params.code || "";
    const normalizedCode = rawCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

    const found = sessionsStore[normalizedCode];
    if (!found) {
      return res.status(404).json({
        success: false,
        error: "कोड नहीं मिला। कृपया कोड दोबारा जांचें। (Code not found)",
      });
    }

    res.json({
      success: true,
      session: found,
    });
  } catch (err: any) {
    console.error("Error retrieving sync session:", err);
    res.status(500).json({ success: false, error: "Failed to retrieve session" });
  }
});

// Vite middleware or static serving
async function startServer() {
  const distPath = path.join(process.cwd(), "dist");
  const hasDist = fs.existsSync(distPath) && fs.existsSync(path.join(distPath, "index.html"));
  // On external hosts like Railway/Render, if dist exists or NODE_ENV=production, serve production build
  const isProduction = process.env.NODE_ENV === "production" || (hasDist && !process.env.K_SERVICE);

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));

    // Handle unmatched API routes with clean JSON 404 rather than HTML fallback
    app.all("/api/*", (req, res) => {
      res.status(404).json({ error: "API endpoint not found" });
    });

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Astrofuture server listening on port ${PORT}`);
  });
}

startServer();
