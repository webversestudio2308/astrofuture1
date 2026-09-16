import React, { useState } from "react";
import { X, Send, Mail, MapPin, ShieldAlert, FileText, Lock } from "lucide-react";
import { Language } from "../types";

export type LegalPageType = "terms" | "privacy" | "refund" | "contact" | null;

interface LegalModalProps {
  type: LegalPageType;
  onClose: () => void;
  lang: Language;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose, lang }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  if (!type) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:astrofuturesupport@gmail.com?subject=Astrofuture Feedback&body=Name: ${encodeURIComponent(name)}%0AMessage:%0A${encodeURIComponent(message)}`;
    window.location.href = mailto;
    onClose();
  };

  const renderContent = () => {
    switch (type) {
      case "contact":
        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex items-center gap-3 text-stone-300">
                <div className="p-2.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                  <Mail className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold font-mono">
                    {lang === "hi" ? "ईमेल करें" : "Email Us"}
                  </div>
                  <div className="text-sm">astrofuturesupport@gmail.com</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-stone-300">
                <div className="p-2.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                  <MapPin className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold font-mono">
                    {lang === "hi" ? "कार्यालय" : "Office"}
                  </div>
                  <div className="text-sm">Astrofuture, Varanasi, 221001, India</div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-400">Name / नाम</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} type="text" className="w-full px-4 py-2.5 bg-[#090812] border border-white/10 rounded-xl text-sm focus:border-amber-400 focus:outline-none text-white" placeholder={lang === "hi" ? "अपना पूरा नाम दर्ज करें" : "Enter your full name"} />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-400">Message / संदेश (Feedback/Query)</label>
                <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full px-4 py-2.5 bg-[#090812] border border-white/10 rounded-xl text-sm focus:border-amber-400 focus:outline-none text-white resize-none" placeholder={lang === "hi" ? "हम आपकी कैसे मदद कर सकते हैं?" : "How can we help you?"} />
              </div>
              <button type="submit" className="w-full py-3.5 rounded-xl gold-button text-stone-950 font-bold font-serif shadow-lg flex items-center justify-center gap-2 mt-2">
                <Send className="w-4 h-4" />
                <span>{lang === "hi" ? "ईमेल के माध्यम से संदेश भेजें" : "Send Feedback via Email"}</span>
              </button>
            </form>
          </div>
        );
      
      case "refund":
        return (
          <div className="space-y-4 text-sm text-stone-300 leading-relaxed">
             <div className="p-4 bg-red-950/30 border border-red-500/20 rounded-xl mb-6">
                <h4 className="text-red-400 font-bold font-serif mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" /> {lang === "hi" ? "सख्त नो रिफंड पॉलिसी" : "Strict No Refund Policy"}
                </h4>
                <p className="text-xs text-red-200/80">
                  {lang === "hi" 
                    ? "हमारी ज्योतिषीय सेवाओं और महाकुंडली पीडीएफ की डिजिटल और तुरंत जनरेट होने वाली प्रकृति के कारण, सभी बिक्री अंतिम हैं। हम किसी भी परिस्थिति में धनवापसी (रिफंड) प्रदान नहीं करते हैं।" 
                    : "Due to the digital and instantly generated nature of our astrological services and MahaKundali PDFs, all sales are final. We do not provide refunds under any circumstances."}
                </p>
             </div>
             
             <h3 className="font-bold text-amber-300 text-base">
               {lang === "hi" ? "धनवापसी और रद्दीकरण नीति" : "Refund and Cancellation Policy"}
             </h3>
             {lang === "hi" ? (
               <>
                 <p>Astrofuture पर, हम प्रीमियम डिजिटल ज्योतिषीय रिपोर्ट (कुंडली पीडीएफ) और ऑनलाइन चैट-आधारित आध्यात्मिक परामर्श प्रदान करते हैं जो तुरंत उत्पन्न होते हैं।</p>
                 <p><strong>1. कोई रिफंड नहीं:</strong> हमारी सख्त "नो रिफंड" नीति है। एक बार भुगतान (₹51 दक्षिणा सहित) सफलतापूर्वक संसाधित हो जाने के बाद, डिजिटल रिपोर्ट तक पहुंच तुरंत प्रदान की जाती है। चूंकि इन डिजिटल संपत्तियों को वापस नहीं किया जा सकता है, इसलिए हम रिफंड, क्रेडिट या एक्सचेंज की पेशकश नहीं करते हैं।</p>
                 <p><strong>2. रद्दीकरण:</strong> चूंकि हमारी सेवा भुगतान पूरा होने के तुरंत बाद रीयल-टाइम में वितरित की जाती है, इसलिए रद्दीकरण लागू नहीं होते हैं।</p>
                 <p><strong>3. तकनीकी समस्या:</strong> यदि आपको भुगतान के दौरान नेटवर्क विफलता का सामना करना पड़ता है और आपके खाते से पैसे कट जाते हैं, तो कृपया 24-48 घंटे प्रतीक्षा करें। यदि एक्सेस अनलॉक नहीं होती है, तो "हमसे संपर्क करें" पृष्ठ के माध्यम से संपर्क करें, हम मैन्युअल रूप से सेवा प्रदान करेंगे। कोई रिफंड नहीं दिया जाएगा।</p>
               </>
             ) : (
               <>
                 <p>At Astrofuture, we provide premium digital astrological reports (Kundali PDFs) and online chat-based spiritual consultations generated instantly utilizing computational algorithms.</p>
                 <p><strong>1. No Refunds:</strong> We maintain a strict "No Refund" policy. Once a payment (including the ₹51 Dakshina or any other amount) is successfully processed, the digital report and premium consultation access are provided instantly. Because these digital assets cannot be returned, we do not offer refunds, credits, or exchanges under any circumstances.</p>
                 <p><strong>2. Cancellations:</strong> Since our service is delivered in real-time immediately after the payment is completed, cancellations are not applicable. Please ensure you are ready to proceed before confirming your payment.</p>
                 <p><strong>3. Technical Glitches:</strong> If you face a network failure during payment but your account is debited, please wait 24-48 hours. If the report/access is not unlocked, contact us via the "Contact Us" page, and we will manually verify the payment and provide your digital access. No refunds will be given, but service fulfillment is guaranteed for successful payments.</p>
               </>
             )}
          </div>
        );

      case "terms":
        return (
          <div className="space-y-4 text-sm text-stone-300 leading-relaxed">
             <h3 className="font-bold text-amber-300 text-base">
               {lang === "hi" ? "नियम एवं शर्तें" : "Terms and Conditions"}
             </h3>
             {lang === "hi" ? (
               <>
                 <p>Astrofuture में आपका स्वागत है। हमारी वेबसाइट, प्लेटफॉर्म या सेवाओं तक पहुँचने और उनका उपयोग करने से, आप निम्नलिखित नियमों और शर्तों का पालन करने के लिए सहमत होते हैं।</p>
                 <p><strong>1. सेवा की प्रकृति:</strong> Astrofuture कम्प्यूटेशनल वैदिक ज्योतिष रिपोर्ट और एआई-सहायता प्राप्त आध्यात्मिक परामर्श प्रदान करता है। ये सख्ती से मनोरंजन, आत्म-चिंतन और आध्यात्मिक मार्गदर्शन के लिए हैं।</p>
                 <p><strong>2. कोई पेशेवर सलाह नहीं:</strong> प्रदान की गई अंतर्दृष्टि, भविष्यवाणियां और उपाय चिकित्सा, कानूनी, वित्तीय या मनोवैज्ञानिक सलाह नहीं हैं। गंभीर मामलों के लिए योग्य पेशेवर से सलाह लें।</p>
                 <p><strong>3. उपयोगकर्ता की जिम्मेदारी:</strong> हमारी सेवाओं का उपयोग करने के लिए आपकी आयु 18 वर्ष होनी चाहिए। आपके द्वारा प्रदान किए गए जन्म विवरण की सटीकता के लिए आप स्वयं जिम्मेदार हैं।</p>
                 <p><strong>4. बौद्धिक संपदा:</strong> उत्पन्न की गई सभी सामग्री, डिज़ाइन, एल्गोरिदम और पीडीएफ Astrofuture की बौद्धिक संपदा हैं।</p>
               </>
             ) : (
               <>
                 <p>Welcome to Astrofuture. By accessing and using our website, platform, or services, you agree to comply with the following Terms and Conditions.</p>
                 <p><strong>1. Service Nature:</strong> Astrofuture provides computational Vedic astrology reports and AI-assisted spiritual consultations. These are strictly for entertainment, personal reflection, and spiritual guidance.</p>
                 <p><strong>2. No Professional Advice:</strong> The insights, predictions, and remedies provided do not constitute medical, legal, financial, or psychological advice. Always consult a qualified professional for severe matters.</p>
                 <p><strong>3. User Responsibility:</strong> You must be at least 18 years old to use our premium services. You are responsible for the accuracy of the birth details (Name, DOB, Time, Place) you provide.</p>
                 <p><strong>4. Intellectual Property:</strong> All content, designs, algorithms, and PDFs generated are the intellectual property of Astrofuture.</p>
               </>
             )}
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-4 text-sm text-stone-300 leading-relaxed">
             <h3 className="font-bold text-amber-300 text-base">
               {lang === "hi" ? "गोपनीयता नीति" : "Privacy Policy"}
             </h3>
             {lang === "hi" ? (
               <>
                 <p>Astrofuture पर आपकी गोपनीयता हमारे लिए अत्यंत महत्वपूर्ण है।</p>
                 <p><strong>1. डेटा संग्रह:</strong> हम आपकी ज्योतिषीय चार्ट (कुंडली) उत्पन्न करने के उद्देश्य से ही आपका नाम, जन्म तिथि, जन्म का समय और जन्म स्थान एकत्र करते हैं।</p>
                 <p><strong>2. डेटा उपयोग:</strong> आपके जन्म विवरण का उपयोग वास्तविक समय में ग्रहों की स्थिति की गणना करने के लिए किया जाता है। हम आपका व्यक्तिगत डेटा तीसरे पक्ष को नहीं बेचते हैं।</p>
                 <p><strong>3. भुगतान जानकारी:</strong> हम आपके क्रेडिट/डेबिट कार्ड का विवरण संग्रहीत नहीं करते हैं। सभी लेनदेन Razorpay द्वारा 256-बिट एन्क्रिप्शन का उपयोग करके सुरक्षित रूप से संसाधित किए जाते हैं।</p>
                 <p><strong>4. स्थानीय संग्रहण:</strong> आपके अनुभव को बेहतर बनाने के लिए, हम आपके ब्राउज़र के स्थानीय संग्रहण में आपके चैट सत्र और जन्म प्राथमिकताओं को संग्रहीत कर सकते हैं।</p>
               </>
             ) : (
               <>
                 <p>Your privacy is critically important to us at Astrofuture.</p>
                 <p><strong>1. Data Collection:</strong> We collect your name, date of birth, time of birth, and place of birth solely for the purpose of generating your astrological chart (Kundali).</p>
                 <p><strong>2. Data Usage:</strong> Your birth details are used in real-time to compute planetary positions. We do not sell your personal data to third parties.</p>
                 <p><strong>3. Payment Information:</strong> We do not store your credit/debit card details. All transactions are securely processed by Razorpay using 256-bit encryption.</p>
                 <p><strong>4. Local Storage:</strong> To enhance your experience, we may store your chat session and birth preferences in your browser's local storage.</p>
               </>
             )}
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (type) {
      case "contact": return lang === "hi" ? "संपर्क करें (Contact Us & Feedback)" : "Contact Us & Feedback";
      case "refund": return lang === "hi" ? "धनवापसी और रद्दीकरण नीति" : "Refund & Cancellation Policy";
      case "terms": return lang === "hi" ? "नियम एवं शर्तें" : "Terms & Conditions";
      case "privacy": return lang === "hi" ? "गोपनीयता नीति" : "Privacy Policy";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "contact": return <Mail className="w-5 h-5 text-amber-400" />;
      case "refund": return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case "terms": return <FileText className="w-5 h-5 text-amber-400" />;
      case "privacy": return <Lock className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#05040a]/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-[#110f1e] border border-white/10 rounded-3xl w-full max-w-lg relative z-10 flex flex-col max-h-[85vh] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#161328]">
          <div className="flex items-center gap-3">
            {getIcon()}
            <h2 className="text-lg font-bold font-serif text-amber-100">{getTitle()}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
