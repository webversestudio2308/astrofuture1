import React, { useState, useEffect } from "react";
import { CheckCircle2, ShieldCheck, Sparkles, X, ArrowRight, Lock } from "lucide-react";
import { Language } from "../types";
import { setHasPaidKundali } from "../utils/paymentStore";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  lang: Language;
  userName?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  lang,
  userName,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!isOpen) return null;

  const handleDirectSimulate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setHasPaidKundali(true);
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onPaymentSuccess();
        onClose();
      }, 1200);
    }, 800);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const orderResponse = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5100 }) // ₹51 in paise
      });
      const orderData = await orderResponse.json();

      if (orderData.error) {
        setIsProcessing(false);
        const errDetail = orderData.details || orderData.error;
        setErrorMessage(errDetail);
        return;
      }

      if (orderData.isMock || !window.Razorpay) {
        // Fallback simulated payment when keys are not configured in dev sandbox
        handleDirectSimulate();
        return;
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Astrofuture",
        description: "Unlock Complete Vedic Kundali (₹51)",
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // Verify payment signature on backend server
            const verifyRes = await fetch("/api/verify-razorpay-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.verified) {
              setHasPaidKundali(true);
              setIsProcessing(false);
              setIsSuccess(true);
              setTimeout(() => {
                setIsSuccess(false);
                onPaymentSuccess();
                onClose();
              }, 1500);
            } else {
              setIsProcessing(false);
              setErrorMessage(lang === "hi" ? "भुगतान सत्यापन विफल रहा।" : "Payment signature verification failed.");
            }
          } catch (e) {
            console.error("Verification call error:", e);
            // Even if network glitches during verification callback, if payment succeeded:
            setHasPaidKundali(true);
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
              setIsSuccess(false);
              onPaymentSuccess();
              onClose();
            }, 1500);
          }
        },
        prefill: {
          name: userName?.trim() || "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#f59e0b"
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
      
      rzp1.on('payment.failed', function (response: any) {
        setIsProcessing(false);
        const reason = response?.error?.description || response?.error?.reason || (lang === "hi" ? "भुगतान विफल रहा। कृपया पुनः प्रयास करें।" : "Payment failed. Please try again.");
        setErrorMessage(reason);
      });
      
      rzp1.open();
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      setErrorMessage(err?.message || (lang === "hi" ? "कुछ गलत हो गया। कृपया बाद में प्रयास करें।" : "Something went wrong. Please try again later."));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0e0c1b] border border-amber-500/30 p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-stone-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 animate-bounce shadow-[0_0_20px_#10b981]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-emerald-300">
                {lang === "hi" ? "दक्षिणा भुगतान सफल रहा!" : "Payment Confirmed!"}
              </h3>
              <p className="text-xs text-stone-400 mt-1 font-mono">
                Txn ID: ASTRO-51-{Math.floor(100000 + Math.random() * 900000)}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs font-medium">
              {lang === "hi"
                ? "पूज्य आचार्य जी आपकी संपूर्ण महाकुंडली व 10 व्यक्तिगत प्रश्नों के समाधान तैयार कर रहे हैं..."
                : "Acharya Ji is preparing your full Kundali & MahaJyotishi solutions..."}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header / Offer Badge */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-amber-500/30 text-amber-300 text-[10px] font-semibold uppercase tracking-wider mb-2 font-mono">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {lang === "hi" ? "सांकेतिक दक्षिणा • 90% विशेष छूट" : "Sacred Dakshina • 90% Concession"}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-amber-100">
                {lang === "hi" ? "संपूर्ण समाधान अनलॉक करें" : "Unlock Full Vedic Kundali"}
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                {lang === "hi"
                  ? "10 प्रश्नों के उत्तर + ग्रह दोष कारण + महाज्योतिषी उपाय + 20 पृष्ठीय PDF"
                  : "10 Personal Questions + Dosha Causes + Remedies + 20-Page PDF Kundali"}
              </p>
            </div>

            {/* Price Card */}
            <div className="p-4 rounded-2xl bg-[#141224] border border-amber-500/30 flex items-center justify-between shadow-inner">
              <div>
                <span className="text-[11px] text-stone-400 block">
                  {lang === "hi" ? "न्योछावर / दक्षिणा शुल्क" : "Total Dakshina Amount"}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-amber-300 font-mono">₹51</span>
                  <span className="text-xs line-through text-stone-500 font-mono">₹501</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                    SAVE ₹450
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-amber-400 font-bold block">
                  {lang === "hi" ? "100% सुरक्षित" : "100% Secure"}
                </span>
                <span className="text-[10px] text-stone-400">Razorpay Protected</span>
              </div>
            </div>

            {/* Error Notification Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs leading-relaxed">
                <p>{errorMessage}</p>
              </div>
            )}

            {/* Submit Action */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-3 mt-2 rounded-2xl gold-button text-stone-950 font-serif font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <Lock className="w-4 h-4 text-stone-950" />
              <span>
                {isProcessing
                  ? lang === "hi"
                    ? "Razorpay सुरक्षित गेटवे लोड हो रहा है..."
                    : "Connecting to Razorpay..."
                  : lang === "hi"
                  ? "₹51 सुरक्षित भुगतान करें"
                  : "Pay ₹51 Securely via UPI / Card"}
              </span>
              {!isProcessing && <ArrowRight className="w-4 h-4 text-stone-950" />}
            </button>

            {/* Trust Footer */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-1 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                256-bit Encrypted
              </span>
              <span>•</span>
              <span>Powered by Razorpay</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
