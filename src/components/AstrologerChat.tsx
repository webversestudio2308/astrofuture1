import React, { useState, useRef, useEffect } from "react";
import { Language, ChatMessage, BirthData, KundaliResult } from "../types";
import {
  Send,
  Sparkles,
  User,
  AlertCircle,
  Lock,
  Unlock,
  CreditCard,
  Download,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Compass,
  FileText,
  Radio,
  Zap,
  Cloud,
} from "lucide-react";
import { calculateVedicKundali } from "../utils/vedicCalculations";
import { ChatKundaliWidget } from "./ChatKundaliWidget";
import { PaymentModal } from "./PaymentModal";
import { Full20PageKundaliModal } from "./Full20PageKundaliModal";
import { getStoredBirthData, saveStoredBirthData } from "../utils/birthStore";
import { useKundaliPayment } from "../utils/paymentStore";
import { BirthDetailsModal } from "./BirthDetailsModal";
import { AIPanditAvatar, AIPanditState, AI_PANDIT_AVATAR } from "./AIPanditAvatar";
import { SyncModal } from "./SyncModal";
import {
  getStoredChatMessages,
  saveStoredChatMessages,
  SESSION_RESTORED_EVENT,
} from "../utils/syncStore";

interface AstrologerChatProps {
  lang: Language;
  customKey: string;
  
  onOpenBirthDetailsModal?: () => void;
}

const SAMPLE_QUESTIONS = [
  {
    icon: "💰",
    en: "Does my chart have the secret Crorepati Rajhans Yoga?",
    hi: "🔥 क्या मेरी कुंडली में करोड़पति बनने का गुप्त राजयोग है?",
  },
  {
    icon: "⚠️",
    en: "Who is betraying me? (Hidden Enemy Yoga from DOB)",
    hi: "⚠️ मुझे कौन धोखा दे रहा है? (जन्म तारीख से गुप्त शत्रु योग)",
  },
  {
    icon: "📈",
    en: "When will I get sudden career promotion & income surge?",
    hi: "📈 मुझे करियर में पदोन्नति और अकूत धन लाभ कब मिलेगा?",
  },
  {
    icon: "❤️",
    en: "When will I get married and to whom? (Mangal Dosha truth)",
    hi: "❤️ मेरी शादी कब और किसके साथ होगी? (मांगलिक/नाड़ी सच)",
  },
  {
    icon: "🛡️",
    en: "What is the supreme Vedic shield against Sade Sati & Kaal Sarp?",
    hi: "🛡️ शनि की साढ़े साती या कालसर्प दोष से बचने का सुरक्षा कवच क्या है?",
  },
  {
    icon: "💎",
    en: "Which miraculous gemstone and Beej Mantra suit my chart?",
    hi: "💎 मेरे लिए कौन सा चमत्कारी रत्न और सिद्ध बीज मंत्र भाग्य खोलेगा?",
  },
];

export const AstrologerChat: React.FC<AstrologerChatProps> = ({
  lang,
  customKey,
  
}) => {
  // Load birth data from storage
  const [birthData, setBirthData] = useState<BirthData>(() => getStoredBirthData());
  const [isBirthModalOpen, setIsBirthModalOpen] = useState<boolean>(false);

  // Computed Kundali
  const [kundali, setKundali] = useState<KundaliResult>(() =>
    calculateVedicKundali(getStoredBirthData())
  );

  // Dynamic welcome message or restored chat history
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = getStoredChatMessages();
    if (savedMessages && savedMessages.length > 0) {
      return savedMessages;
    }
    const stored = getStoredBirthData();
    const hasName = Boolean(stored.name && stored.name.trim());
    return [
      {
        id: "welcome-1",
        role: "assistant",
        content:
          lang === "hi"
            ? hasName
              ? `नमस्ते ${stored.name} जी! 🙏 मैं 'आचार्य' हूँ—वैदिक पराशरी ज्योतिष और ब्रह्मांडीय ग्रह गणनाओं से युक्त आपका आध्यात्मिक मार्गदर्शक।\n\nआपकी जन्म कुंडली (${kundali.ascendant.sign} लग्न, ${kundali.moon.sign} चंद्र राशि) हमारे समक्ष खुली है। आपके ग्रहों की वर्तमान स्थिति और महादशा में कई दुर्लभ संकेत दिखाई दे रहे हैं... बताइए, आज आप अपने किस महत्वपूर्ण विषय (करोड़पति राजयोग, गुप्त शत्रु निवारण, करियर में बड़ा बदलाव, या विवाह योग) पर मार्गदर्शन चाहते हैं?`
              : "नमस्ते प्रिय जिज्ञासु साधक! 🙏 मैं 'आचार्य' हूँ—वैदिक पराशरी ज्योतिष का दिव्य ज्ञानकोष।\n\n✨ **वर्तमान में शनि, राहु व गुरु का अत्यंत दुर्लभ संचरण सक्रिय है!** क्या आप जानते हैं:\n• 💰 **करोड़पति राजयोग:** क्या आपकी कुंडली में 'राजहंस योग' या 'गजकेसरी योग' सक्रिय है?\n• ⚠️ **गुप्त शत्रु व धोखा योग:** आपकी जन्मतिथि (DOB) और राहु की चाल से यह तक उजागर हो जाता है कि कौन आपका सच्चा हितैषी है और कौन गुप्त रूप से धोखा दे रहा है!\n• 💍 **विवाह व भावी जीवनसाथी:** आपकी शादी कब होगी, किस दिशा में होगी और जीवनसाथी का स्वभाव कैसा रहेगा?\n\n👉 अपनी सटीक वैदिक जन्म कुंडली व फलादेश जानने हेतु अपना **जन्म विवरण (नाम, जन्म तिथि, समय व स्थान)** दर्ज करें, या नीचे दिए गए किसी भी प्रश्न पर क्लिक करें!"
            : hasName
            ? `Namaste ${stored.name}! 🙏 I am 'Acharya', your Vedic astrological guide.\n\nAccording to your natal chart (${kundali.ascendant.sign} Ascendant, ${kundali.moon.sign} Moon sign), rare transits and yogas are currently active. What vital life question (Wealth & Rajhans Yoga, Career Leap, Marriage Timing, or Navagraha Shield) shall we explore today?`
            : "Namaste & Welcome, Dear Seeker! 🙏 I am 'Acharya', your celestial Vedic guide.\n\n✨ **Extraordinary planetary transits are active right now!** Did you know:\n• 💰 **Crorepati Rajhans Yoga:** Is multi-crore sudden wealth destined in your natal chart?\n• ⚠️ **Secret Adversaries & Betrayal:** Your Date of Birth (DOB) and Rahu's placement can expose hidden enemies and false friends!\n• 💍 **Marriage & Soulmate:** Discover the precise timing of your wedding and partner compatibility.\n\n👉 To unlock your authentic birth chart reading, please enter your birth details above or select any suggested question below!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Turn tracking and payment state
  const [userTurnsCount, setUserTurnsCount] = useState<number>(0);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const { hasPaid, markAsPaid } = useKundaliPayment();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [is20PageModalOpen, setIs20PageModalOpen] = useState<boolean>(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Save chat messages to local storage whenever updated
  useEffect(() => {
    if (messages.length > 0) {
      saveStoredChatMessages(messages);
    }
  }, [messages]);

  // Ensure window stays at top on initial mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  // Listen for session restore and header sync triggers
  useEffect(() => {
    const handleSessionRestored = (e: any) => {
      const session = e?.detail?.session;
      if (session) {
        if (session.birthData) {
          setBirthData(session.birthData);
          setKundali(calculateVedicKundali(session.birthData));
        }
        if (session.messages && Array.isArray(session.messages)) {
          setMessages(session.messages);
        }
      }
    };
    const handleOpenSync = () => {
      setIsSyncModalOpen(true);
    };
    const handleOpenBirth = () => {
      setIsBirthModalOpen(true);
    };
    window.addEventListener(SESSION_RESTORED_EVENT, handleSessionRestored);
    window.addEventListener("astro_open_sync_modal", handleOpenSync);
    window.addEventListener("astro_open_birth_modal", handleOpenBirth);
    return () => {
      window.removeEventListener(SESSION_RESTORED_EVENT, handleSessionRestored);
      window.removeEventListener("astro_open_sync_modal", handleOpenSync);
      window.removeEventListener("astro_open_birth_modal", handleOpenBirth);
    };
  }, []);

  // Only scroll inside the chat container when user has interacted or AI is generating
  useEffect(() => {
    if (messages.length > 1 || loading) {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages, loading]);

  // Sync initial welcome message when language toggles if no other chat has occurred
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === "welcome-1") {
      const stored = getStoredBirthData();
      const hasName = Boolean(stored.name && stored.name.trim());
      setMessages([
        {
          id: "welcome-1",
          role: "assistant",
          content:
            lang === "hi"
              ? hasName
                ? `नमस्ते ${stored.name} जी! 🙏 मैं 'आचार्य' हूँ—वैदिक पराशरी ज्योतिष और ब्रह्मांडीय ग्रह गणनाओं से युक्त आपका आध्यात्मिक मार्गदर्शक।\n\nआपकी जन्म कुंडली (${kundali.ascendant.sign} लग्न, ${kundali.moon.sign} चंद्र राशि) हमारे समक्ष खुली है। आपके ग्रहों की वर्तमान स्थिति और महादशा में कई दुर्लभ संकेत दिखाई दे रहे हैं... बताइए, आज आप अपने किस महत्वपूर्ण विषय (करोड़पति राजयोग, गुप्त शत्रु निवारण, करियर में बड़ा बदलाव, या विवाह योग) पर मार्गदर्शन चाहते हैं?`
                : "नमस्ते प्रिय जिज्ञासु साधक! 🙏 मैं 'आचार्य' हूँ—वैदिक पराशरी ज्योतिष का दिव्य ज्ञानकोष।\n\n✨ **वर्तमान में शनि, राहु व गुरु का अत्यंत दुर्लभ संचरण सक्रिय है!** क्या आप जानते हैं:\n• 💰 **करोड़पति राजयोग:** क्या आपकी कुंडली में 'राजहंस योग' या 'गजकेसरी योग' सक्रिय है?\n• ⚠️ **गुप्त शत्रु व धोखा योग:** आपकी जन्मतिथि (DOB) और राहु की चाल से यह तक उजागर हो जाता है कि कौन आपका सच्चा हितैषी है और कौन गुप्त रूप से धोखा दे रहा है!\n• 💍 **विवाह व भावी जीवनसाथी:** आपकी शादी कब होगी, किस दिशा में होगी और जीवनसाथी का स्वभाव कैसा रहेगा?\n\n👉 अपनी सटीक वैदिक जन्म कुंडली व फलादेश जानने हेतु अपना **जन्म विवरण (नाम, जन्म तिथि, समय व स्थान)** दर्ज करें, या नीचे दिए गए किसी भी प्रश्न पर क्लिक करें!"
              : hasName
              ? `Namaste ${stored.name}! 🙏 I am 'Acharya', your Vedic astrological guide.\n\nAccording to your natal chart (${kundali.ascendant.sign} Ascendant, ${kundali.moon.sign} Moon sign), rare transits and yogas are currently active. What vital life question (Wealth & Rajhans Yoga, Career Leap, Marriage Timing, or Navagraha Shield) shall we explore today?`
              : "Namaste & Welcome, Dear Seeker! 🙏 I am 'Acharya', your celestial Vedic guide.\n\n✨ **Extraordinary planetary transits are active right now!** Did you know:\n• 💰 **Crorepati Rajhans Yoga:** Is multi-crore sudden wealth destined in your natal chart?\n• ⚠️ **Secret Adversaries & Betrayal:** Your Date of Birth (DOB) and Rahu's placement can expose hidden enemies and false friends!\n• 💍 **Marriage & Soulmate:** Discover the precise timing of your wedding and partner compatibility.\n\n👉 To unlock your authentic birth chart reading, please enter your birth details above or select any suggested question below!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, [lang]);

  // Global event listener for viral slogan CTA prompt triggers
  useEffect(() => {
    const handleSelectPrompt = (e: any) => {
      const prompt = e.detail?.prompt;
      if (prompt) {
        // Scroll inner chat smoothly
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
        handleSend(prompt);
      }
    };
    window.addEventListener("astro_select_prompt", handleSelectPrompt);
    return () => window.removeEventListener("astro_select_prompt", handleSelectPrompt);
  }, [hasPaid, userTurnsCount, birthData, kundali, customKey, lang, messages, loading]);

  // Recalculate Kundali when birth data updates
  const handleUpdateBirthData = (updated: BirthData) => {
    setBirthData(updated);
    saveStoredBirthData(updated);
    const newKundali = calculateVedicKundali(updated);
    setKundali(newKundali);

    const updateMsg: ChatMessage = {
      id: `birth-updated-${Date.now()}`,
      role: "assistant",
      content:
        lang === "hi"
          ? `🙏 धन्यवाद **${updated.name || "साधक"}** जी! आपका प्रामाणिक जन्म विवरण सहेज लिया गया है।\n\n✨ **लग्न**: ${newKundali.ascendant.sign} (${newKundali.ascendant.degree}°)\n🌙 **चंद्र राशि**: ${newKundali.moon.sign}\n⭐ **नक्षत्र**: ${newKundali.nakshatra.name} (चरण ${newKundali.nakshatra.pada})\n🪐 **वर्तमान महादशा**: ${newKundali.dasha.currentMahadasha}\n\n${hasPaid ? "✅ आपकी 20-पृष्ठीय महाकुंडली अब आपके नाम से पूर्णतः तैयार है! आप ऊपर '20 पृष्ठीय महाकुंडली' बटन से इसे देख व डाउनलोड कर सकते हैं।" : "अब आप अपनी कुंडली अथवा जीवन के किसी भी क्षेत्र के संबंध में प्रश्न पूछ सकते हैं।"}`
          : `🙏 Thank you **${updated.name || "Seeker"}**! Your birth dossier has been updated.\n\n✨ **Ascendant (Lagna)**: ${newKundali.ascendant.sign} (${newKundali.ascendant.degree}°)\n🌙 **Moon Sign**: ${newKundali.moon.sign}\n⭐ **Nakshatra**: ${newKundali.nakshatra.name} (Pada ${newKundali.nakshatra.pada})\n🪐 **Current Dasha**: ${newKundali.dasha.currentMahadasha}\n\n${hasPaid ? "✅ Your 20-Page MahaKundali is now ready under your authentic name! Click '20-Page Kundali' above to view & download." : "You may now ask any astrological question based on your verified chart."}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, updateMsg]);

    // If paid and name is filled, open 20-page modal
    if (hasPaid && updated.name && updated.name.trim()) {
      setTimeout(() => {
        setIs20PageModalOpen(true);
      }, 700);
    }
  };

  // Trigger ₹51 Upsell proposal if 4 or 5 turns reached
  const checkAndInjectUpsell = (currentTurns: number) => {
    if (!hasPaid && currentTurns >= 4) {
      const upsellMsg: ChatMessage = {
        id: `upsell-${Date.now()}`,
        role: "assistant",
        content:
          lang === "hi"
            ? "✨ **विशेष वैदिक परामर्श एवं 20-पृष्ठीय महाकुंडली आमंत्रण**:\n\nप्रिय साधक, आपके ग्रहों के अध्ययन से ज्ञात होता है कि आपकी बाधाओं के स्थायी निवारण हेतु विस्तृत महाकुंडली व विशेष उपायों की आवश्यकता है।\n\nकेवल **₹51 (सांकेतिक दक्षिणा)** में अनलॉक करें:\n1️⃣ **10 मुख्य प्रश्नों / बाधाओं का अचूक समाधान व कारण**\n2️⃣ **महाज्योतिषी सिद्ध उपाय (रत्न, सिद्ध बीज मंत्र, दान नियम)**\n3️⃣ **चैट में ही संपूर्ण वैदिक जन्म कुंडली चक्र (लग्न व नवमांश)**\n4️⃣ **20 पृष्ठीय विस्तृत रंगीन PDF जन्म कुंडली डाउनलोड (हिंदी अथवा अंग्रेजी)**"
            : "✨ **Sacred Vedic Consultation & 20-Page MahaKundali Offer**:\n\nDear Seeker, to deeply diagnose your planetary obstacles and provide definitive solutions, your complete birth matrix is required.\n\nUnlock everything for a symbolic Dakshina of **₹51** only:\n1️⃣ **Clear Solutions to 10 Personal Questions & Root Causes**\n2️⃣ **MahaJyotishi Remedies (Auspicious Gemstone, Beej Mantra & Charity Rules)**\n3️⃣ **Complete Vedic Janam Kundali right inside this chat**\n4️⃣ **20-Page High-Resolution Color PDF Kundali Download (Hindi or English)**",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, upsellMsg]);
    }
  };

  const handleSend = async (textToSend?: string, isHiddenRetry: boolean = false) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const newTurnCount = userTurnsCount + 1;
    if (!isHiddenRetry) {
      setUserTurnsCount(newTurnCount);
      const userMsg: ChatMessage = {
        id: String(Date.now()),
        role: "user",
        content: query,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, userMsg]);
    }

    // If user has provided birth data, they are asking a question
    const hasCustomBirthData = Boolean(birthData.name && birthData.name.trim());
    if (hasCustomBirthData && !isHiddenRetry && hasPaid) {
      setQuestionNumber(prev => prev + 1);
    }

    setInput("");
    setLoading(true);
    setError(null);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (customKey) {
        headers["x-gemini-api-key"] = customKey;
      }

      // If hidden retry, construct messages properly without duplicating
      let currentMessagesForApi = [...messages];
      if (!isHiddenRetry) {
        currentMessagesForApi.push({
          id: String(Date.now()),
          role: "user",
          content: query,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
      } else {
        // Find the last user message to append the hidden query override if needed
        // Actually, if it's hidden retry, we can just push a virtual user message for the API
        currentMessagesForApi.push({
          id: String(Date.now()),
          role: "user",
          content: query,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
      }

      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          messages: currentMessagesForApi.map((m) => ({ role: m.role, content: m.content })),
          userContext: {
            name: birthData.name || "",
            hasCustomBirthData,
            lagna: `${kundali.ascendant.sign} (${kundali.ascendant.degree}°)`,
            rashi: `${kundali.moon.sign} (${kundali.moon.degree}°)`,
            nakshatra: `${kundali.nakshatra.name} (Pada ${kundali.nakshatra.pada})`,
            dasha: `${kundali.dasha.currentMahadasha} Mahadasha`,
            hasPaid,
            questionNumber: hasPaid ? questionNumber : 1,
          },
          lang,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "API_KEY_INVALID") {
          setError(
            lang === "hi"
              ? "सेवा अस्थायी रूप से अनुपलब्ध है। कृपया बाद में प्रयास करें।"
              : "Service unavailable. Please try again later."
          );
        } else {
          setError(data.message || "Failed to receive Jyotishacharya response.");
        }
      } else {
        let replyText = data.reply;
        let requiresPayment = false;
        
        if (replyText.includes("[PAYMENT_REQUIRED]")) {
          requiresPayment = true;
          replyText = replyText.replace("[PAYMENT_REQUIRED]", "").trim();
        }

        const botMsg: ChatMessage = {
          id: String(Date.now() + 1),
          role: "assistant",
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          requiresPayment,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to reach astrological chat service.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    markAsPaid();

    const hasRealName = Boolean(birthData.name && birthData.name.trim());
    if (!hasRealName) {
      // If user paid ₹51 without entering their name/birth details, open birth modal immediately
      setIsBirthModalOpen(true);
    }

    const paidSuccessMsg: ChatMessage = {
      id: `paid-${Date.now()}`,
      role: "assistant",
      content:
        lang === "hi"
          ? hasRealName
            ? `🙏 **सद्बुद्धि एवं कल्याण हो ${birthData.name} जी!**\n\nआपकी **₹51** की सांकेतिक दक्षिणा स्वीकार हुई। नवग्रहों की कृपा से मैं अब आपके पहले प्रश्न का संपूर्ण विश्लेषण व 20-पृष्ठीय महाकुंडली प्रस्तुत कर रहा हूँ...`
            : "🙏 **सद्बुद्धि एवं कल्याण हो!**\n\nआपकी **₹51** की सांकेतिक दक्षिणा सफलतापूर्वक स्वीकार हो गई है!\n\n⚠️ **आवश्यक कदम**: आपकी प्रामाणिक 20-पृष्ठीय रंगीन महाकुंडली आपके नाम से तैयार करने के लिए कृपया सामने खुले फॉर्म में अपना **सही नाम, जन्म तिथि, समय व जन्म स्थान** दर्ज करें ताकि कुंडली में 'Seeker' या अमान्य नाम न आए।"
          : hasRealName
          ? `🙏 **Divine Blessings & Prosperity, ${birthData.name}!**\n\nYour sacred Dakshina of **₹51** has been confirmed. Powered by the cosmic Navagrahas, I am now retrieving your complete solution...`
          : "🙏 **Divine Blessings & Prosperity!**\n\nYour sacred Dakshina of **₹51** has been confirmed successfully!\n\n⚠️ **Important Step**: To generate your certified 20-page color MahaKundali under your real name, please fill your authentic Name and birth details in the form on screen.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => {
      // Find the last user question to re-trigger it
      const lastUserQuestion = [...prev].reverse().find(m => m.role === "user")?.content;
      
      // Auto-trigger the API in the background after setting state only if name is known
      if (lastUserQuestion && hasRealName) {
        setTimeout(() => {
          handleSend(lastUserQuestion + " (Payment confirmed! Please give the full detailed solution, remedies, and astrological reasons now.)", true);
        }, 500);
      }
      
      return [...prev, paidSuccessMsg];
    });
  };

  // Determine avatar current state
  const avatarState: AIPanditState = loading ? "thinking" : "idle";

  return (
    <div className="space-y-6 pb-16">
      {/* Top Acharya Header Card: Ultra-Premium Futuristic Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0e0c1b]/80 border border-amber-500/20 p-5 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        {/* Subtle Cosmic Background Light Accents */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Prominent Acharya Circular Avatar & Assistant Header */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            {/* The Famous Acharya Circular Avatar */}
            <div className="relative shrink-0">
              <AIPanditAvatar
                size="lg"
                state={avatarState}
                showRing={true}
                showStatusDot={true}
                lang={lang}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-200 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {lang === "hi" ? "आचार्य • मुख्य ज्योतिषाचार्य" : "Acharya • Chief Astrologer"}
                </span>

                {/* Acharya Online / Thinking Status Indicator */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#11101D] border border-white/10 text-xs font-mono">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      loading
                        ? "bg-amber-400 animate-ping"
                        : "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                    }`}
                  />
                  <span className={loading ? "text-amber-300 font-semibold" : "text-emerald-300"}>
                    {loading
                      ? lang === "hi"
                        ? "● ACHARYA THINKING"
                        : "● ACHARYA THINKING"
                      : lang === "hi"
                      ? "● ACHARYA ONLINE"
                      : "● ACHARYA ONLINE"}
                  </span>
                </span>

                {/* Unlock badge */}
                {hasPaid ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-semibold">
                    <Unlock className="w-3 h-3 text-amber-400" />
                    <span>₹51 Unlocked</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-semibold cursor-pointer transition-colors active:scale-95"
                  >
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>₹51 Unlock Full Kundali</span>
                  </button>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-amber-100 tracking-wide">
                {lang === "hi" ? (
                  <>ज्योतिषाचार्य से सीधा ब्रह्मांडीय मार्गदर्शन</>
                ) : (
                  <>Direct Consultation with Acharya</>
                )}
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
                {lang === "hi"
                  ? "प्राचीन पराशरी वैदिक ज्योतिष × आधुनिक कृत्रिम बुद्धिमत्ता। अपने करियर, विवाह, धन एवं ग्रह दशाओं पर सीधे प्रश्न पूछें।"
                  : "Ancient Parashari Vedic Astrology × Advanced Artificial Intelligence. Direct real-time guidance on career, marriage, finances & dashas."}
              </p>
            </div>
          </div>

          {/* Right: Current Native (User Birth Details) Glass Card */}
          <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
            <div className="p-3.5 rounded-2xl bg-[#141224]/90 border border-amber-500/20 text-xs text-stone-300 space-y-1 min-w-[220px] shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400/80 uppercase font-mono tracking-wider">
                  {lang === "hi" ? "जातक विवरण" : "Native Dossier"}
                </span>
                <button
                  onClick={() => setIsBirthModalOpen(true)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                >
                  {birthData.name ? (lang === "hi" ? "बदलें" : "Edit") : (lang === "hi" ? "दर्ज करें" : "Enter")}
                </button>
              </div>

              <div className="font-bold text-white truncate text-sm flex items-center gap-1.5">
                {birthData.name ? (
                  <>
                    <span className="text-amber-300">✨</span>
                    <span>{birthData.name}</span>
                  </>
                ) : (
                  <span className="text-amber-400/90 italic flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{lang === "hi" ? "जन्म विवरण दर्ज नहीं है" : "Details not entered"}</span>
                  </span>
                )}
              </div>

              <div className="text-[11px] text-stone-400 truncate font-mono">
                {birthData.date} • {birthData.time} • {birthData.place}
              </div>
            </div>

            <button
              onClick={() => setIsBirthModalOpen(true)}
              className="px-3.5 py-3 rounded-2xl bg-gradient-to-r from-amber-600/20 to-purple-600/20 hover:from-amber-600/30 hover:to-purple-600/30 border border-amber-500/40 text-amber-200 font-serif font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              title={lang === "hi" ? "जन्म विवरण दर्ज करें" : "Enter birth details"}
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>{lang === "hi" ? "जन्म विवरण" : "Birth Data"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Persuasive Acharya Hook Banner ("प्रलोभन" - Irresistible Curiosity Bait) */}
      <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-amber-950/50 via-purple-950/40 to-amber-950/50 border-2 border-amber-500/40 shadow-[0_8px_30px_rgba(245,158,11,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center text-stone-950 shrink-0 font-black text-lg shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse">
            ⚡
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                {lang === "hi" ? "🔥 आचार्य गुप्त चेतावनी व महावरदान" : "🔥 ACHARYA PROPHETIC REVELATION"}
              </span>
              <span className="text-xs text-amber-200/90 font-mono font-medium">
                {lang === "hi" ? "• 98.4% जातकों ने तुरंत पाया उत्तर" : "• 98.4% Seekers Found Immediate Clarity"}
              </span>
            </div>
            <p className="text-xs sm:text-sm md:text-base font-serif font-bold text-white mt-1.5 leading-snug">
              {lang === "hi"
                ? "आपकी कुंडली में छुपा है आपके जीवन का सबसे बड़ा मोड़! क्या आपकी जन्म तारीख में 'राजहंस करोड़पति योग' सक्रिय है या 'गुप्त शत्रु योग'?"
                : "A massive turning point is approaching in your natal chart! Is multi-crore Rajhans wealth active or a secret adversary test?"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-center shrink-0">
          <button
            onClick={() => handleSend(lang === "hi" ? "क्या मेरी कुंडली में राजहंस योग या करोड़पति बनने का कोई गुप्त धन योग है?" : "Does my chart have Rajhans Yoga or sudden wealth yoga?")}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl gold-button text-stone-950 font-serif font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>{lang === "hi" ? "💰 करोड़पति योग का सच" : "💰 Check Wealth Yoga"}</span>
          </button>
          <button
            onClick={() => handleSend(lang === "hi" ? "मुझे कौन धोखा दे रहा है? मेरी जन्म तिथि से गुप्त शत्रु योग और राहु का प्रभाव बताएं।" : "Who is working against me? Reveal hidden enemies from my birth chart.")}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-white font-serif font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 border border-purple-400/50 flex items-center justify-center gap-1.5"
          >
            <span>{lang === "hi" ? "⚠️ गुप्त शत्रु योग जानें" : "⚠️ Detect Enemies"}</span>
          </button>
        </div>
      </div>

      {/* Main Chat Conversation Container: Futuristic Cosmic Terminal */}
      <div className="rounded-3xl bg-[#0c0a18]/90 border border-white/10 shadow-[0_16px_50px_rgba(0,0,0,0.7)] flex flex-col h-[calc(100dvh-160px)] sm:h-[660px] overflow-hidden backdrop-blur-xl relative">
        {/* Subtle Background Constellation Lines inside chat container */}
        <div className="absolute inset-0 pointer-events-none opacity-20 -z-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="10%" y1="20%" x2="40%" y2="50%" stroke="#d97706" strokeWidth="0.5" strokeDasharray="3 6" />
            <line x1="40%" y1="50%" x2="80%" y2="30%" stroke="#a855f7" strokeWidth="0.5" strokeDasharray="3 6" />
            <line x1="40%" y1="50%" x2="60%" y2="85%" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="3 6" />
            <circle cx="10%" cy="20%" r="2" fill="#fbbf24" opacity="0.6" />
            <circle cx="40%" cy="50%" r="2.5" fill="#a855f7" opacity="0.6" />
            <circle cx="80%" cy="30%" r="2" fill="#fbbf24" opacity="0.6" />
            <circle cx="60%" cy="85%" r="2" fill="#38bdf8" opacity="0.6" />
          </svg>
        </div>

        {/* Chat Status Header */}
        <div className="relative z-10 px-5 py-3.5 border-b border-white/10 bg-[#110f22]/80 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-2.5">
            <AIPanditAvatar size="xs" state={avatarState} showRing={false} />
            <span className="font-semibold text-amber-200 tracking-wide font-serif">
              Acharya Neural Core
            </span>
            <span className="text-white/20">•</span>
            <span className="text-stone-400 font-mono text-[11px]">
              {lang === "hi" ? `संवाद चक्र: ${userTurnsCount}` : `Consultation Turns: ${userTurnsCount}`}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct button to open 20-page Kundali */}
            <button
              onClick={() => {
                if (!hasPaid) {
                  setIsPaymentModalOpen(true);
                } else if (!birthData.name || !birthData.name.trim()) {
                  setIsBirthModalOpen(true);
                } else {
                  setIs20PageModalOpen(true);
                }
              }}
              className="text-xs font-serif font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:border-amber-400/40 transition-all active:scale-95"
            >
              {hasPaid ? <FileText className="w-3.5 h-3.5 text-amber-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
              <span>
                {hasPaid
                  ? lang === "hi"
                    ? "20 पृष्ठीय महाकुंडली"
                    : "20-Page Kundali"
                  : lang === "hi"
                  ? "20 पृष्ठीय कुंडली (₹51)"
                  : "Unlock 20-Pg (₹51)"}
              </span>
            </button>

            {/* Cross-device Save & Sync Trigger */}
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="text-xs font-serif font-semibold text-purple-200 hover:text-amber-200 flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-lg bg-purple-950/50 border border-purple-500/30 hover:border-amber-400/40 transition-all active:scale-95"
              title={lang === "hi" ? "बिना लॉगिन डेटा सुरक्षित करें या दूसरे फोन में लोड करें" : "Save data or sync to other phone without login"}
            >
              <Cloud className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{lang === "hi" ? "डेटा सिंक" : "Save & Sync"}</span>
            </button>

            {hasPaid && (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lang === "hi" ? "₹51 स्वीकृत" : "₹51 Unlocked"}
              </span>
            )}
          </div>
        </div>

        {/* Message Stream */}
        <div ref={chatContainerRef} className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 pb-24 sm:pb-6 space-y-5 bg-gradient-to-b from-[#090812]/50 via-transparent to-[#090812]/80">
          {/* Missing Name Notification Card: Explaining to user why birth details are needed */}
          {!birthData.name && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_4px_20px_rgba(245,158,11,0.1)] animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5 text-amber-300">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-amber-200">
                    {lang === "hi" ? "सटीक जन्म कुंडली हेतु अपना विवरण दर्ज करें" : "Enter Birth Details for Exact Vedic Precision"}
                  </h4>
                  <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                    {lang === "hi"
                      ? "बिना जन्म विवरण के सामान्य उत्तर मिलेंगे। सटीक लग्न, राशि व दशा गणना हेतु अपना नाम, जन्म समय व स्थान दर्ज करें।"
                      : "Without birth details, general calculations apply. Enter your exact birth time & place for personalized Vedic analysis."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBirthModalOpen(true)}
                className="px-4 py-2 rounded-xl gold-button text-stone-950 font-serif font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer active:scale-95"
              >
                {lang === "hi" ? "✏️ जन्म विवरण दर्ज करें" : "✏️ Enter Birth Details"}
              </button>
            </div>
          )}

          {/* Messages Render */}
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                {/* Acharya Avatar on EVERY Assistant Message */}
                {!isUser && (
                  <div className="shrink-0 mt-1">
                    <AIPanditAvatar
                      size="sm"
                      state="idle"
                      showRing={true}
                    />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed transition-all shadow-md ${
                    isUser
                      ? "bg-gradient-to-br from-[#1d1b33] to-[#252242] border border-amber-400/25 text-white rounded-tr-none shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                      : "bg-[#131124]/90 border border-white/10 text-[#eae7f5] rounded-tl-none shadow-[0_6px_24px_rgba(0,0,0,0.5)] backdrop-blur-md"
                  }`}
                >
                  {/* Assistant name header on AI messages */}
                  {!isUser && (
                    <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/[0.08]">
                      <span className="text-[11px] font-serif font-bold text-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        {lang === "hi" ? "आचार्य" : "Acharya"}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  )}

                  {/* Message body */}
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.content}
                    {msg.requiresPayment && !hasPaid && (
                      <div className="mt-2 text-white/10 blur-[4px] select-none pointer-events-none">
                        लंबे समय से आपके जीवन में जो बाधाएं आ रही हैं, उनका मुख्य कारण दशम भाव और सप्तम भाव में राहु और शनि का एक विशेष युति संबंध है। इस रहस्यमयी गोचर के प्रभाव से आपके कार्यों में अंतिम समय पर रुकावट आती है और...
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="text-[10px] mt-2 font-mono flex items-center gap-1 justify-end text-amber-300/60">
                      <span>{msg.timestamp}</span>
                    </div>
                  )}

                  {/* Prominent ₹51 Upsell Action Card inside chat */}
                  {(msg.requiresPayment || msg.id.startsWith("upsell-")) && !hasPaid && (
                    <div className="mt-4 pt-4 border-t border-amber-500/30 flex flex-col items-center gap-3 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#131124] to-transparent pointer-events-none -mt-16 h-16" />
                      <p className="text-amber-300/90 font-serif text-sm font-medium text-center z-10">
                        {lang === "hi" ? "🔒 आगे का विस्तृत समाधान एवं अचूक उपाय पढ़ने के लिए अनलॉक करें:" : "🔒 Unlock to read the complete detailed solution and precise remedies:"}
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="w-full px-5 py-3 rounded-xl gold-button text-stone-950 font-serif font-bold text-sm shadow-[0_0_24px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 z-10"
                      >
                        <CreditCard className="w-5 h-5 text-stone-950" />
                        <span>{lang === "hi" ? "केवल ₹51 में संपूर्ण समाधान अनलॉक करें" : "Unlock Full Solution for just ₹51"}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-stone-800 to-stone-700 border border-amber-400/30 text-amber-200 flex items-center justify-center shrink-0 shadow-md mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* If user has paid, render full in-chat Kundali Widget */}
          {hasPaid && (
            <ChatKundaliWidget
              kundali={kundali}
              birthData={birthData}
              lang={lang}
              onOpenPrintModal={() => setIs20PageModalOpen(true)}
            />
          )}

          {/* HIGH-CONVERTING ₹51 PAYWALL CTA BUTTON (Trigger Logic) */}
          {!hasPaid && userTurnsCount >= 3 && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-900/40 via-purple-900/40 to-amber-900/40 border border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)] flex flex-col items-center justify-center text-center animate-fade-in space-y-4 relative overflow-hidden mt-6 mb-4">
              <div className="absolute inset-0 bg-amber-500/5 animate-pulse pointer-events-none" />
              <Sparkles className="w-8 h-8 text-amber-400 absolute top-4 left-4 opacity-30 pointer-events-none" />
              <Sparkles className="w-8 h-8 text-purple-400 absolute bottom-4 right-4 opacity-30 pointer-events-none" />
              
              <h3 className="text-[13px] sm:text-[15px] font-bold text-amber-100 font-serif leading-relaxed relative z-10 max-w-lg">
                {lang === "hi" 
                  ? "केवल ₹51 में पाएँ अपनी 20-पेज की विस्तृत महाकुंडली PDF (20 साल का भविष्य + सटीक उपाय)" 
                  : "Get Your Detailed 20-Page MahaKundali PDF for just ₹51 (20 Years Prediction + Remedies)"}
              </h3>
              
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="px-6 py-3 rounded-xl gold-button text-stone-950 font-serif font-black text-sm sm:text-base shadow-[0_0_24px_rgba(245,158,11,0.5)] transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 relative z-10"
              >
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{lang === "hi" ? "₹51 में Unlock करें" : "Unlock for ₹51"}</span>
              </button>
            </div>
          )}

          {/* AI Thinking Experience with Avatar & Animated Glowing Dots */}
          {loading && (
            <div className="flex gap-3 items-start animate-fade-in">
              <div className="shrink-0 mt-1">
                <AIPanditAvatar
                  size="sm"
                  state="thinking"
                  showRing={true}
                />
              </div>

              <div className="p-3.5 rounded-2xl rounded-tl-none bg-[#141226]/90 border border-amber-500/30 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.15)] flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-serif font-bold text-amber-300">
                    {lang === "hi" ? "आचार्य विचार कर रहे हैं..." : "Acharya is thinking..."}
                  </span>
                  {/* Three Sequential Glowing Dots ● ● ● */}
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 dot-bounce-1" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 dot-bounce-2" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 dot-bounce-3" />
                  </div>
                </div>
                <span className="text-[11px] text-stone-400">
                  {lang === "hi"
                    ? "ग्रह चाल, गोचर व वैदिक श्लोकों का गूढ़ विश्लेषण जारी है..."
                    : "Analyzing planetary transits, degrees, and classical Vedic sutras..."}
                </span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                className="px-2.5 py-1 rounded-lg bg-rose-800/60 hover:bg-rose-700 text-white font-semibold text-xs cursor-pointer active:scale-95"
              >
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Sample Prompt Questions */}
        <div className="relative z-10 px-4 py-2.5 border-t border-white/[0.08] bg-[#0d0b1a]/95 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[10px] font-bold text-amber-400 uppercase font-mono tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {lang === "hi" ? "ज्वलंत प्रश्न:" : "Popular Hooks:"}
          </span>
          {SAMPLE_QUESTIONS.map((q, idx) => {
            const text = lang === "hi" ? q.hi : q.en;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(text)}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl bg-[#171529]/90 hover:bg-[#221f3d] border border-amber-400/25 hover:border-amber-400 text-[11px] font-medium text-stone-200 hover:text-amber-200 whitespace-nowrap transition-all cursor-pointer shrink-0 disabled:opacity-50 active:scale-95 shadow-xs flex items-center gap-1.5"
              >
                <span>{q.icon}</span>
                <span>{text}</span>
              </button>
            );
          })}
        </div>

        {/* Futuristic Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="fixed bottom-0 left-0 w-full z-50 p-3 backdrop-blur-md bg-[#090714]/90 border-t border-[#FFD700]/20 flex items-center gap-2.5 sm:relative sm:bottom-auto sm:left-auto sm:w-auto sm:z-10 sm:p-4 sm:border-white/10 sm:bg-[#0b0918]"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder={
                lang === "hi"
                  ? "आचार्य जी से अपनी बाधा, करियर, विवाह या ग्रह दशा पर प्रश्न पूछें..."
                  : "Ask Acharya regarding career, marriage timing, Sade Sati..."
              }
              className="w-full px-4 py-3 rounded-2xl bg-[#141224] border border-white/15 text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-xs sm:text-sm font-medium transition-all shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-2xl gold-button text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          >
            <span>{lang === "hi" ? "पूछें" : "Send"}</span>
            <Send className="w-4 h-4 text-stone-950" />
          </button>
        </form>
      </div>

      {/* Payment Modal for ₹51 */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        lang={lang}
      />

      {/* 20-Page Full Certified Kundali Modal */}
      <Full20PageKundaliModal
        isOpen={is20PageModalOpen}
        onClose={() => setIs20PageModalOpen(false)}
        kundali={kundali}
        birthData={birthData}
        initialLang={lang}
      />

      {/* Birth Details Input / Edit Modal */}
      <BirthDetailsModal
        isOpen={isBirthModalOpen}
        onClose={() => setIsBirthModalOpen(false)}
        birthData={birthData}
        onSave={handleUpdateBirthData}
        lang={lang}
      />

      {/* Cross-Device Save & Restore Sync Modal */}
      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        lang={lang}
        birthData={birthData}
        messages={messages}
        hasPaid={hasPaid}
      />
    </div>
  );
};
