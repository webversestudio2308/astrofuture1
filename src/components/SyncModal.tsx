import React, { useState, useEffect } from "react";
import {
  X,
  Copy,
  Check,
  Share2,
  Download,
  Cloud,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Smartphone,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import { Language, BirthData, ChatMessage } from "../types";
import {
  saveSessionToServer,
  loadSessionFromServer,
  getStoredSyncCode,
} from "../utils/syncStore";

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  birthData: BirthData;
  messages: ChatMessage[];
  hasPaid: boolean;
  onSessionLoaded?: () => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  lang,
  birthData,
  messages,
  hasPaid,
  onSessionLoaded,
}) => {
  const [activeTab, setActiveTab] = useState<"save" | "restore">("save");
  const [accessCode, setAccessCode] = useState<string>(() => getStoredSyncCode());
  const [inputCode, setInputCode] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAccessCode(getStoredSyncCode());
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentOrigin =
    typeof window !== "undefined" ? window.location.origin : "";
  const syncLink = accessCode ? `${currentOrigin}/?sync=${accessCode}` : "";

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await saveSessionToServer({
      birthData,
      messages,
      hasPaidKundali: hasPaid,
      existingCode: accessCode || undefined,
    });

    setIsSaving(false);
    if (res.success && res.accessCode) {
      setAccessCode(res.accessCode);
      setSuccessMsg(
        lang === "hi"
          ? "डेटा सुरक्षित कर लिया गया है! यह कोड या लिंक अपने पास सहेज लें।"
          : "Data safely synchronized! Save your code or link below."
      );
    } else {
      setErrorMsg(res.error || (lang === "hi" ? "डेटा सेव करने में समस्या आई।" : "Failed to save data."));
    }
  };

  const handleRestore = async () => {
    if (!inputCode.trim()) {
      setErrorMsg(lang === "hi" ? "कृपया अपना गुप्त कोड दर्ज करें।" : "Please enter your access code.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await loadSessionFromServer(inputCode.trim());
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(
        lang === "hi"
          ? "🎉 कुंडली, पंडित जी की चैट और स्थिति सफलतापूर्वक रीस्टोर हो गई!"
          : "🎉 Kundali, chat history and payment successfully restored!"
      );
      if (onSessionLoaded) {
        onSessionLoaded();
      }
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setErrorMsg(res.error || (lang === "hi" ? "कोड अमान्य है या डेटा नहीं मिला।" : "Invalid code or session not found."));
    }
  };

  const copyToClipboard = (text: string, type: "code" | "link") => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === "code") {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    }
  };

  const shareOnWhatsApp = () => {
    if (!accessCode) return;
    const shareText =
      lang === "hi"
        ? `मेरी Astrofuture वैदिक कुंडली व पंडित जी चैट का गुप्त सिंक लिंक:\n${syncLink}\n(कोड: ${accessCode})`
        : `My Astrofuture Vedic Kundali & Pandit Ji chat sync link:\n${syncLink}\n(Access Code: ${accessCode})`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0e0c1b] border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-amber-200">
              {lang === "hi" ? "बिना लॉगिन डेटा सुरक्षित व सिंक करें" : "Save & Sync Data (No Login Required)"}
            </h3>
            <p className="text-xs text-stone-400">
              {lang === "hi"
                ? "किसी भी अन्य फोन, टैबलेट या लैपटॉप में तुरंत अपना डेटा लोड करें"
                : "Restore your Kundali, Pandit Ji chat & payment on any device"}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex rounded-xl bg-[#141224] border border-white/10 p-1 mb-5">
          <button
            onClick={() => {
              setActiveTab("save");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-serif font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "save"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === "hi" ? "डेटा सुरक्षित करें (Save)" : "Save & Share"}</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("restore");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-serif font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "restore"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{lang === "hi" ? "दूसरे फोन में लोड करें (Restore)" : "Restore via Code"}</span>
          </button>
        </div>

        {/* Tab 1: Save Content */}
        {activeTab === "save" && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#141224]/80 border border-white/10 text-xs space-y-1.5 font-mono text-stone-300">
              <div className="flex justify-between">
                <span className="text-stone-500">{lang === "hi" ? "जातक का नाम:" : "Seeker Name:"}</span>
                <span className="text-amber-300 font-bold">{birthData.name || (lang === "hi" ? "विवरण दर्ज नहीं" : "Not entered")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{lang === "hi" ? "चैट वार्तालाप:" : "Chat Messages:"}</span>
                <span className="text-stone-200">{messages.length} {lang === "hi" ? "संदेश" : "messages"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{lang === "hi" ? "₹51 महाकुंडली स्थिति:" : "₹51 Kundali Status:"}</span>
                <span className={hasPaid ? "text-emerald-400 font-bold" : "text-stone-400"}>
                  {hasPaid ? (lang === "hi" ? "✓ अनलॉक्ड (Paid)" : "✓ Unlocked (Paid)") : (lang === "hi" ? "लॉक्ड (Free Mode)" : "Locked")}
                </span>
              </div>
            </div>

            {/* Action to Save / Update */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-3 rounded-2xl gold-button text-stone-950 font-serif font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>
                {isSaving
                  ? lang === "hi" ? "सुरक्षित किया जा रहा है..." : "Synchronizing..."
                  : accessCode
                  ? lang === "hi" ? "डेटा अपडेट करें व नया कोड देखें" : "Update Saved Session"
                  : lang === "hi" ? "डेटा सुरक्षित करें व गुप्त कोड प्राप्त करें" : "Save Data & Get Secret Code"}
              </span>
            </button>

            {/* Display Code and Links if available */}
            {accessCode && (
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-center space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-amber-400 font-mono font-semibold">
                    {lang === "hi" ? "आपका गुप्त सिंक कोड (Secret Access Code)" : "Your Secret Access Code"}
                  </div>
                  <div className="text-xl sm:text-2xl font-mono font-extrabold text-white tracking-widest flex items-center justify-center gap-2">
                    <span>{accessCode}</span>
                    <button
                      onClick={() => copyToClipboard(accessCode, "code")}
                      className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs transition-colors cursor-pointer"
                      title="Copy Code"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(syncLink, "link")}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? (lang === "hi" ? "लिंक कॉपी हो गया!" : "Link Copied!") : (lang === "hi" ? "1-क्लिक लिंक कॉपी करें" : "Copy 1-Click Link")}</span>
                  </button>
                  <button
                    onClick={shareOnWhatsApp}
                    className="py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                </div>

                <p className="text-[11px] text-stone-400 text-center leading-relaxed">
                  {lang === "hi"
                    ? "💡 इस लिंक या कोड को किसी भी अन्य फोन या ब्राउज़र में खोलें, आपका पूरा डेटा और ₹51 की पेमेंट तुरंत उपलब्ध हो जाएगी।"
                    : "💡 Open this link or enter the code on any other phone or browser to restore your chat and Kundali instantly."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Restore Content */}
        {activeTab === "restore" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-stone-300">
                {lang === "hi" ? "अपना गुप्त सिंक कोड दर्ज करें:" : "Enter Your Secret Access Code:"}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="उदा. ASTRO-AB1234"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#141224] border border-white/15 text-white font-mono uppercase tracking-wider text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <button
              onClick={handleRestore}
              disabled={isLoading || !inputCode.trim()}
              className="w-full py-3 rounded-2xl gold-button text-stone-950 font-serif font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              <span>
                {isLoading
                  ? lang === "hi" ? "डेटा लोड हो रहा है..." : "Loading Data..."
                  : lang === "hi" ? "डेटा रीस्टोर करें (Restore Now)" : "Restore Data Now"}
              </span>
            </button>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-stone-400 text-xs leading-relaxed space-y-1">
              <div className="font-semibold text-stone-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === "hi" ? "रीस्टोर होने पर क्या मिलेगा?" : "What gets restored?"}</span>
              </div>
              <ul className="list-disc list-inside text-[11px] space-y-0.5 text-stone-400">
                <li>{lang === "hi" ? "आपके जन्म का संपूर्ण विवरण व महाकुंडली" : "Full birth chart and calculated planetary positions"}</li>
                <li>{lang === "hi" ? "आचार्य पंडित जी से पूर्व में की गई सभी बातचीत" : "Complete conversation history with Acharya"}</li>
                <li>{lang === "hi" ? "₹51 की दक्षिणा / 20-पेज महाकुंडली की अनलॉक्ड स्थिति" : "Unlocked ₹51 payment status for full 20-page PDF"}</li>
              </ul>
            </div>
          </div>
        )}

        {/* Notifications */}
        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs text-center">
            {successMsg}
          </div>
        )}
      </div>
    </div>
  );
};
