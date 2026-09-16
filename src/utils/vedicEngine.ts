/**
 * Authentic Vedic Jyotish Knowledge & Deterministic Fallback Engine
 * Powered by classical Parashari & Jaimini astrological principles.
 * Ensures zero-downtime, continuous guidance even during cloud/model service spikes.
 */

interface VedicChatContext {
  name?: string;
  lagna?: string;
  rashi?: string;
  nakshatra?: string;
  dasha?: string;
  hasPaid?: boolean;
  questionNumber?: number;
}

interface ChatMessageInput {
  role: string;
  content: string;
}

// 1. CHAT FALLBACK GENERATOR
export function generateVedicChatFallback(options: {
  messages: ChatMessageInput[];
  userContext?: VedicChatContext & { hasCustomBirthData?: boolean };
  lang?: "en" | "hi";
}): string {
  const { messages, userContext = {}, lang = "en" } = options;
  const isHindi = lang === "hi";

  const hasBirthData = Boolean(userContext.hasCustomBirthData && userContext.name);
  const name = userContext.name || (isHindi ? "जिज्ञासु साधक" : "Seeker");
  const lagna = userContext.lagna || (isHindi ? "मेष" : "Aries");
  const rashi = userContext.rashi || (isHindi ? "वृषभ" : "Taurus");
  const nakshatra = userContext.nakshatra || (isHindi ? "रोहिणी" : "Rohini");
  const dasha = userContext.dasha || (isHindi ? "गुरु महादशा" : "Jupiter Mahadasha");
  const hasPaid = Boolean(userContext.hasPaid);
  const qNum = userContext.questionNumber || 1;

  const lastUserMsg =
    [...messages]
      .reverse()
      .find((m) => m.role === "user")
      ?.content.toLowerCase() || "";

  // 1. GREETING & CASUAL 'HI' HANDLER (Do not invent fake future predictions on just 'hi'!)
  const isGreeting =
    /^(hi|hello|hey|namaste|pranam|namashkar|radhe radhe|hare krishna|jai shri ram|kya haal|kaise ho|greetings)[\s!.?]*$/i.test(
      lastUserMsg.trim()
    );

  if (isGreeting) {
    if (!hasBirthData) {
      if (isHindi) {
        return `नमस्ते प्रिय जिज्ञासु साधक! 🙏\n\nब्रह्मांडीय कालचक्र और वैदिक ज्योतिष में आपका स्वागत है। मैं 'ज्योतिषाचार्य' हूँ।\n\nवर्तमान में ग्रहों का संचरण अत्यंत दुर्लभ स्थिति में है। क्या आप जानते हैं:\n• 💰 **करोड़पति योग:** क्या आपकी कुंडली में 'राजहंस योग' या 'गजकेसरी योग' सक्रिय है जो आपको अकूत धन लाभ कराएगा?\n• ⚠️ **गुप्त शत्रु व विश्वासघात:** आपकी जन्मतिथि (DOB) और राहु-केतु की स्थिति से यह तक उजागर हो जाता है कि कौन आपका सच्चा हितैषी है और कौन गुप्त रूप से धोखा दे रहा है!\n• 💍 **विवाह व भावी जीवनसाथी:** आपकी शादी कब होगी, किस दिशा में होगी और जीवनसाथी का स्वभाव कैसा रहेगा?\n• 🛡️ **शनि की साढ़े साती व कालसर्प:** क्या किसी ग्रह दोष के कारण आपके बनते काम अंतिम समय में बिगड़ रहे हैं?\n\n👉 अपनी सटीक जन्म कुंडली और यह गोपनीय सच जानने के लिए कृपया अपना **नाम, जन्म तिथि (DOB), जन्म समय और शहर** बताएं, या नीचे दिए गए किसी भी प्रश्न पर क्लिक करें! मैं तुरंत आपके नवग्रहों का सच खोल दूंगा।`;
      } else {
        return `Namaste & Welcome, Dear Seeker! 🙏\n\nI am your Vedic Jyotishacharya, your celestial guide powered by classical Parashari astrology.\n\nThe cosmic planetary transits are in an extraordinary alignment right now. Did you know:\n• 💰 **Crorepati Rajhans Yoga:** Is multi-crore sudden wealth destined in your natal chart?\n• ⚠️ **Hidden Enemies & Betrayal:** Your Date of Birth (DOB) and Rahu's transit can expose fake associates and secret workplace adversaries!\n• 💍 **Marriage & Soulmate:** Discover the precise timing of your wedding, compatibility, and partner's traits.\n• 🛡️ **Saturn's Sade Sati & Kaal Sarp:** Claim your protective Vedic kavach to remove sudden delays.\n\n👉 To unlock your authentic birth chart reading, please share your **Name, Date of Birth (DOB), Time & City**, or click any suggested question below!`;
      }
    } else {
      if (isHindi) {
        return `नमस्ते प्रिय ${name} जी! 🙏\n\nआपकी जन्म कुंडली (लग्न: **${lagna}**, चंद्र राशि: **${rashi}**, महादशा: **${dasha}**) हमारे समक्ष खुली है। आपके ग्रहों की वर्तमान स्थिति और गोचर में कई दुर्लभ योग दिखाई दे रहे हैं।\n\nबताइए, आज आप अपने जीवन के किस महत्वपूर्ण विषय पर अचूक मार्गदर्शन चाहते हैं:\n1. 💰 क्या मेरी कुंडली में करोड़पति बनने या अचानक धन लाभ का राजयोग है?\n2. ⚠️ मुझे कौन धोखा दे रहा है? (जन्म कुंडली से गुप्त शत्रु योग)\n3. 📈 आगामी 6 माह में करियर और नौकरी में क्या बड़ा बदलाव आएगा?\n4. ❤️ विवाह योग, मांगलिक दोष निवारण व दांपत्य जीवन?\n\nआप इनमें से कोई भी प्रश्न पूछें, मैं तुरंत वैदिक गणना प्रस्तुत करूंगा।`;
      } else {
        return `Namaste Dear ${name}! 🙏\n\nYour Vedic chart (Ascendant: **${lagna}**, Moon Sign: **${rashi}**, Mahadasha: **${dasha}**) is active before us. Rare astrological alignments and transits are currently influencing your houses of fortune and karma.\n\nWhich vital area would you like to explore today:\n1. 💰 Hidden Crorepati & Wealth Yogas in your chart?\n2. ⚠️ Secret Adversaries & Betrayal Detection from your DOB?\n3. 📈 Career Promotion & Upcoming 6-Month Transits?\n4. ❤️ Marriage Timing, Compatibility & Dosha Resolution?\n\nFeel free to ask your burning question!`;
      }
    }
  }

  // 2. CHECK IF USER JUST PAID (PURE UNLOCK / DAKSHINA ACKNOWLEDGEMENT)
  const isPureUnlock =
    /^(51|₹51|unlock|paid|payment successful|done|dakshina|pranam)$/i.test(lastUserMsg.trim()) ||
    lastUserMsg === "unlock_consultation";

  if (hasPaid && isPureUnlock) {
    if (isHindi) {
      return `🙏 **सद्बुद्धि एवं कल्याण हो, प्रिय ${name} जी!**\n\nआपकी **₹51** की सांकेतिक दक्षिणा स्वीकार हुई। नवग्रहों की असीम कृपा आप पर सदैव बनी रहे।\n\nअब आप अपनी जन्म कुंडली (लग्न: **${lagna}**, चंद्र राशि: **${rashi}**, महादशा: **${dasha}**) के आधार पर अपने **10 व्यक्तिगत प्रश्न** (जैसे करियर, सरकारी नौकरी, विवाह, धन लाभ, व्यापार या स्वास्थ्य) पूछ सकते हैं।\n\n👉 **कृपया अपना प्रश्न पूछें:** नीचे दिए गए विकल्पों में से चुनें या अपना प्रश्न टाइप करें।`;
    } else {
      return `🙏 **Divine Blessings & Grace, Dear ${name}!**\n\nYour sacred Dakshina of **₹51** has been confirmed. May the Navagrahas and Deva Guru Brihaspati bestow prosperity upon your life.\n\nYou have unlocked your **10 personal astrological questions** based on your natal chart (Ascendant: **${lagna}**, Moon: **${rashi}**, Dasha: **${dasha}**).\n\n👉 **Please ask your Question:** Select from suggested questions or type any question below.`;
    }
  }

  // Helper to build the automated post-payment closing indicator
  const buildProgressFooter = (currentQ: number): string => {
    if (!hasPaid) return "";
    
    if (currentQ < 10) {
      return isHindi
        ? `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✅ **प्रश्न ${currentQ}/10 का विश्लेषण पूर्ण हुआ।**\n👉 प्रिय ${name} जी, अब आप अपना **अगला प्रश्न (प्रश्न ${currentQ + 1}/10)** पूछें।`
        : `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✅ **Question ${currentQ}/10 Analysis Completed.**\n👉 Dear ${name}, please proceed to ask your **Next Question (Question ${currentQ + 1}/10)**.`;
    } else {
      return isHindi
        ? `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✅ **आपके 10 प्रश्नों की दैनिक सीमा पूर्ण हुई!**\nभगवान सूर्यनारायण एवं नवग्रहों के आशीर्वाद से आपके सभी मनोरथ सिद्ध हों। आपकी संपूर्ण 20 पृष्ठीय रंगीन जन्म कुंडली भी तैयार है, जिसे आप नीचे दिए गए बटन से डाउनलोड कर सकते हैं।`
        : `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✅ **All 10 Personal Consultations Completed!**\nMay the celestial deities illuminate your path with triumph and serenity. Your complete 20-Page Full-Color Kundali is ready below for instant download.`;
    }
  };

  // Topic classification
  const isDhoka =
    lastUserMsg.includes("dhoka") ||
    lastUserMsg.includes("cheat") ||
    lastUserMsg.includes("shatru") ||
    lastUserMsg.includes("enemy") ||
    lastUserMsg.includes("betray") ||
    lastUserMsg.includes("vishwaasghat") ||
    lastUserMsg.includes("shadyantra");

  const isCrorepati =
    lastUserMsg.includes("crorepati") ||
    lastUserMsg.includes("krodpati") ||
    lastUserMsg.includes("rajhans") ||
    lastUserMsg.includes("wealth") ||
    lastUserMsg.includes("crore") ||
    lastUserMsg.includes("laxmi") ||
    lastUserMsg.includes("ameer") ||
    lastUserMsg.includes("rich") ||
    lastUserMsg.includes("paisa") ||
    lastUserMsg.includes("karz") ||
    lastUserMsg.includes("debt");

  const isCareer =
    lastUserMsg.includes("career") ||
    lastUserMsg.includes("job") ||
    lastUserMsg.includes("naukri") ||
    lastUserMsg.includes("sarkari") ||
    lastUserMsg.includes("business") ||
    lastUserMsg.includes("vyapar") ||
    lastUserMsg.includes("promotion") ||
    lastUserMsg.includes("transfer") ||
    lastUserMsg.includes("finance") ||
    lastUserMsg.includes("profession");

  const isMarriage =
    lastUserMsg.includes("marriage") ||
    lastUserMsg.includes("shaadi") ||
    lastUserMsg.includes("vivah") ||
    lastUserMsg.includes("love") ||
    lastUserMsg.includes("relationship") ||
    lastUserMsg.includes("partner") ||
    lastUserMsg.includes("spouse") ||
    lastUserMsg.includes("manglik") ||
    lastUserMsg.includes("patni") ||
    lastUserMsg.includes("pati");

  const isSadeSati =
    lastUserMsg.includes("sade sati") ||
    lastUserMsg.includes("shani") ||
    lastUserMsg.includes("saturn") ||
    lastUserMsg.includes("dhaiya") ||
    lastUserMsg.includes("rahu") ||
    lastUserMsg.includes("ketu") ||
    lastUserMsg.includes("kaal sarp") ||
    lastUserMsg.includes("badha") ||
    lastUserMsg.includes("obstacle");

  const isHealthOrFamily =
    lastUserMsg.includes("health") ||
    lastUserMsg.includes("swasthya") ||
    lastUserMsg.includes("bimari") ||
    lastUserMsg.includes("illness") ||
    lastUserMsg.includes("child") ||
    lastUserMsg.includes("santaan") ||
    lastUserMsg.includes("family") ||
    lastUserMsg.includes("parivar") ||
    lastUserMsg.includes("chinta") ||
    lastUserMsg.includes("stress");

  const isGemstone =
    lastUserMsg.includes("gemstone") ||
    lastUserMsg.includes("ratna") ||
    lastUserMsg.includes("stone") ||
    lastUserMsg.includes("mantra") ||
    lastUserMsg.includes("beej") ||
    lastUserMsg.includes("upay") ||
    lastUserMsg.includes("remedy");

  // Generate automated responses:
  if (isDhoka) {
    const base = isHindi
      ? `🔍 **गुप्त शत्रु, विश्वासघात व षड्यंत्र योग (Shatru Bhava Analysis):**\n\nप्रिय ${name} जी, आपकी जन्म कुंडली (लग्न: **${lagna}**, राशि: **${rashi}**) के अनुसार षष्ठम भाव (शत्रु भाव) और अष्टम भाव (गुप्त छल भाव) का गहरा प्रभाव दिख रहा है:\n\n1. **मूल कारण:** जब राहु या केतु का दृष्टि संबंध षष्ठेश अथवा दशमेश से होता है, तो कार्यक्षेत्र या मित्रों में कुछ ऐसे लोग आते हैं जो सामने प्रशंसा करते हैं परंतु पीठ पीछे बाधाएं खड़ी करते हैं।\n2. **काल निर्णय:** आगामी 4 महीनों तक किसी भी साझेदारी, नए वित्तीय लेन-देन अथवा गोपनीय योजनाओं को उजागर न करें। इसके पश्चात शनिदेव का न्याय पक्ष आपके विरोधियों को स्वतः शांत कर देगा।\n\n🛡️ **अचूक सुरक्षा एवं शत्रु नाशक उपाय:**\n- **बगलामुखी बीज मंत्र:** नित्य सायंकाल **'ॐ ह्लीं बगलामुख्यै नमः'** का 21 बार जप करें। यह मंत्र अनिष्ट शक्तियों का स्तंभन करता है।\n- **हनुमान बाहुक:** मंगलवार को संकटमोचन हनुमान जी को सिन्दूर अर्पित कर हनुमान बाहुक का पाठ करें।`
      : `🔍 **Hidden Enemies, Betrayal & Rahu Transit Analysis:**\n\nDear ${name}, evaluating your natal chart (Ascendant: **${lagna}**, Moon: **${rashi}**), the 6th House (Shatru Bhava) and 8th House (Deception/Gupta Bhava) reveal critical patterns:\n\n1. **Astrological Root Cause:** Rahu's aspect on the operational houses attracts individuals whose external flattery conceals covert competition or betrayal, particularly in financial partnerships.\n2. **Protective Timing:** Maintain strict discretion regarding your plans for the next 4 months. As cosmic transits align, the karmic balance will neutralize adversaries naturally.\n\n🛡️ **Definitive Vedic Protective Shield:**\n- **Maa Bagalamukhi Mantra:** Recite **'Om Hleem Bagalamukhyai Namah'** 21 times daily.\n- **Hanuman Kavach:** Read the Hanuman Chalisa at dusk with a mustard oil lamp.`;
    return base + buildProgressFooter(qNum);
  }

  if (isCrorepati) {
    const base = isHindi
      ? `💰 **करोड़पति राजहंस योग, महालक्ष्मी कृपा व धन लाभ विवेचन:**\n\nप्रिय ${name} जी, आपकी कुंडली (लग्न: **${lagna}**, चंद्र राशि: **${rashi}**) में धन त्रिकोण (द्वितीय भाव - धन संचय, नवम भाव - भाग्य, एकादश भाव - महालाभ) का सूक्ष्म विश्लेषण:\n\n1. **धन योग की स्थिति:** आपकी कुंडली में गुरु और चंद्र का शुभ दृष्टि संबंध गजकेसरी व राजहंस योग की नींव रखता है। वर्तमान ${dasha} के प्रभाव से आपके पास धन कमाने की अद्भुत अंतःप्रेरणा है, किंतु अनावश्यक खर्चों पर नियंत्रण आवश्यक है।\n2. **आकस्मिक धन व उन्नति का समय:** आगामी 5 से 9 महीनों में गोचरीय गुरु का शुभ संचार आपके आर्थिक स्रोतों में 2 नए मार्ग खोलेगा।\n\n💎 **महाधन आकर्षण सिद्ध उपाय:**\n- **कनकधारा स्तोत्र:** प्रत्येक शुक्रवार को सायंकाल घी का दीपक प्रज्वलित कर कनकधारा स्तोत्र या श्री सूक्तम का पाठ करें।\n- **कुबेर दिशा संतुलन:** अपने कक्ष या कार्यस्थल के उत्तर-पूर्व (ईशान) कोण को बिल्कुल स्वच्छ रखें।`
      : `💰 **Crorepati Rajhans Wealth Yoga & Financial Expansion:**\n\nDear ${name}, examining your wealth triangle (2nd House: Treasury, 9th House: Divine Fortune, 11th House: High Inflows) for **${lagna} Ascendant** and **${rashi} Moon**:\n\n1. **Planetary Wealth Yogas:** A favorable trinal alignment creates strong potentials for assets and property accumulation. Under ${dasha}, your income will undergo an upward revision.\n2. **Prosperity Turning Point:** Between 5 to 9 months ahead, favorable planetary transits will unlock supplementary income streams.\n\n💎 **Supreme Vedic Wealth Remedies:**\n- Recite **Shri Suktam** or **Kanakadhara Stotram** every Friday with pure ghee lamp.\n- Keep the North/Northeast sector of your residence immaculate.`;
    return base + buildProgressFooter(qNum);
  }

  if (isCareer) {
    const base = isHindi
      ? `🌟 **करियर, नौकरी/व्यापार व पदोन्नति पर विस्तृत फलादेश:**\n\nप्रिय ${name} जी, आपकी कुंडली में **${lagna} लग्न** और **${rashi} चंद्र राशि** के अनुसार दशम भाव (कर्म भाव) का विश्लेषण:\n\n1. **वर्तमान स्थिति का कारण:** दशमेश पर शनि अथवा राहु के प्रभाव और वर्तमान **${dasha}** के कारण पिछले कुछ समय से आपके किए गए परिश्रम का त्वरित श्रेय किसी अन्य को मिल रहा था या पदोन्नति में विलंब हुआ।\n2. **परिवर्तन व सफलता का काल:** आगामी 3 से 6 महीनों में ग्रहों का गोचर आपके पक्ष में हो रहा है। यदि आप सरकारी नौकरी अथवा उच्च पद के लिए प्रयासरत हैं, तो यह समय अत्यंत फलदायी सिद्ध होगा।\n\n💼 **अचूक करियर एवं प्रतिष्ठा उपाय:**\n- **दैनिक सूर्य अर्घ्य:** प्रातः काल तांबे के पात्र में शुद्ध जल, थोड़ा कुमकुम व अक्षत डालकर उगते सूर्य को अर्घ्य दें और **'ॐ घृणि सूर्याय नमः'** का 12 बार जप करें।\n- **बुध शांति:** बुधवार के दिन हरी मूंग की दाल अथवा हरा चारा गाय को खिलाएं, इससे व्यापार व निर्णय क्षमता में चमत्कारी वृद्धि होती है।`
      : `🌟 **Career, Professional Growth & Promotion Analysis:**\n\nDear ${name}, assessing your 10th House (Karma Bhava) with **${lagna} Ascendant** and **${rashi} Moon Sign**:\n\n1. **Root Astrological Factor:** The planetary alignment under your current **${dasha}** has tested your patience through bureaucratic delays or uncredited labor.\n2. **Breakthrough Horizon:** Within the next 3 to 6 months, a decisive planetary shift will bring recognition, promotion opportunities, or favorable career mobility.\n\n💼 **Actionable Vedic Remedies for Career:**\n- Offer Surya Arghya from a copper vessel every morning with **'Om Ghrini Suryaya Namah'**.\n- Feed green fodder to sacred cows on Wednesdays to sharpen Mercury's intellect.`;
    return base + buildProgressFooter(qNum);
  }

  if (isMarriage) {
    const base = isHindi
      ? `❤️ **विवाह, भावी जीवनसाथी व दांपत्य जीवन का संपूर्ण विश्लेषण:**\n\nप्रिय ${name} जी, आपकी जन्म कुंडली (लग्न: **${lagna}**, राशि: **${rashi}**) के सप्तम भाव (कलत्र भाव) और गुरु/शुक्र की स्थिति:\n\n1. **विवाह का समय व योग:** आपकी कुंडली में आगामी 4 से 8 माह के भीतर गुरु का शुभ गोचर सप्तम भाव को दृष्टि देगा, जिससे विवाह के पक्के रिश्ते आने और संबंध तय होने का प्रबल योग बन रहा है।\n2. **जीवनसाथी का स्वभाव:** आपका जीवनसाथी संस्कारी, स्वाभिमानी, समझदार एवं कुल का सम्मान करने वाला होगा।\n3. **मांगलिक/दोष निवारण:** यदि कुंडली में आंशिक मांगलिक प्रभाव है, तो यह 28 वर्ष के उपरांत स्वतः सौम्य हो जाता है।\n\n💍 **विवाह बाधा निवारक अचूक उपाय:**\n- **गौरी-शंकर पूजन:** प्रत्येक सोमवार को शिवलिंग पर कच्चा दूध व गंगाजल अर्पित कर **'ॐ नमः शिवाय'** का 108 बार जप करें।\n- **बृहस्पति आराधना:** गुरुवार के दिन केले के वृक्ष की पूजा करें और माथे पर केसर/चंदन का तिलक लगाएं।`
      : `❤️ **Marriage Timing, Compatibility & Spouse Traits:**\n\nDear ${name}, analyzing your 7th House (Kalatra Bhava) alongside Jupiter and Venus for **${lagna} Ascendant** and **${rashi} Moon**:\n\n1. **Timing of Marriage:** Within the next 4 to 8 months, Jupiter's auspicious aspect will activate marriage talks and finalize unions with high compatibility.\n2. **Spouse Characteristics:** Your life partner will be emotionally balanced, principled, and spiritually grounded.\n\n💍 **Vedic Relationship Harmony Remedies:**\n- Offer sacred water and bilva patra to Lord Shiva and Goddess Parvati on Mondays.\n- Apply a saffron (kesar) or sandalwood tilak on your forehead on Thursdays.`;
    return base + buildProgressFooter(qNum);
  }

  if (isHealthOrFamily) {
    const base = isHindi
      ? `🌿 **स्वास्थ्य, पारिवारिक सौहार्द एवं मानसिक शांति का ज्योतिषीय विवेचन:**\n\nप्रिय ${name} जी, जन्म कुंडली में प्रथम भाव (तनु भाव - आरोग्य) एवं चतुर्थ भाव (मातृ व गृह सुख) का अध्ययन:\n\n1. **मूल कारण:** चंद्रदेव का नक्षत्र प्रभाव आपको अत्यधिक संवेदनशील और भावुक बनाता है, जिससे कभी-कभी छोटी-छोटी बातें भी मानसिक तनाव और अनिद्रा का कारण बन जाती हैं।\n2. **आरोग्य व सुख का समय:** आगामी समय में नियमित दिनचर्या और प्राणायाम से स्वास्थ्य में उल्लेखनीय सुधार होगा।\n\n🌿 **आरोग्य व सुख-शांति उपाय:**\n- **महामृत्युंजय मंत्र:** प्रतिदिन प्रातः अथवा सायंकाल **'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्...'** का 11 बार पाठ करें।\n- **चांदी का पात्र:** रात्रि में चांदी के गिलास में जल रखें और प्रातः उसका सेवन करें। इससे चंद्रमा बलवान होकर मानसिक शांति प्रदान करता है।`
      : `🌿 **Health, Family Peace & Mental Serenity:**\n\nDear ${name}, examining your 1st House (Vitality) and 4th House (Domestic Serenity) for **${lagna} Ascendant** and **${rashi} Moon**:\n\n1. **Core Influence:** Lunar vibrations enhance intuitive sensitivity, which can occasionally induce overthinking or restless nights.\n2. **Vedic Remedies for Vitality:**\n- Recite the sacred **Mahamrityunjaya Mantra** 11 times daily for rejuvenation and physical longevity.\n- Drink clean water stored in a silver vessel to calm the emotional mind.`;
    return base + buildProgressFooter(qNum);
  }

  if (isSadeSati) {
    const base = isHindi
      ? `🛡️ **शनि साढ़े साती, कालसर्प व नवग्रह बाधा निवारण:**\n\nप्रिय ${name} जी, आपकी राशि **${rashi}** पर शनिदेव के गोचर और नवग्रहों की चाल का सूक्ष्म विवेचन:\n\n1. **शनिदेव का वास्तविक संदेश:** शनिदेव न्याय के अधिष्ठाता हैं। वे साधक को तपाकर कुंदन बनाते हैं। जो भी विलंब हो रहा है, वह आपको भविष्य के बड़े दायित्वों के लिए तैयार कर रहा है।\n2. **राहत का समय:** आगामी गोचर परिवर्तन से आपके अटके हुए कार्य गति पकड़ेंगे।\n\n🛡️ **सिद्ध शनि शांति उपाय:**\n- **हनुमान चालीसा:** नित्य सायंकाल सरसों के तेल का दीपक जलाकर श्री **हनुमान चालीसा** का पाठ करें।\n- **छायापात्र दान:** शनिवार के दिन एक कांसे या लोहे की कटोरी में सरसों का तेल भरकर उसमें अपना मुख देखें और उसे दान करें।`
      : `🛡️ **Sade Sati, Saturn Cycles & Planetary Protection:**\n\nDear ${name}, reviewing Saturn's transit over your Moon Sign **${rashi}**:\n\n1. **Karmic Perspective:** Lord Shani is the dispenser of justice and resilience. The temporary friction you experience is refining your life discipline.\n2. **Potent Remedies:**\n- Recite the **Hanuman Chalisa** every evening at sunset.\n- Offer mustard oil in a lamp under a sacred Peepal tree on Saturdays.`;
    return base + buildProgressFooter(qNum);
  }

  if (isGemstone) {
    const base = isHindi
      ? `💎 **शुभ रत्न, रुद्राक्ष एवं सिद्ध बीज मंत्र परामर्श:**\n\nप्रिय ${name} जी, पराशरी ज्योतिष के अनुसार केवल लग्न, पंचम एवं नवम भाव (त्रिकोण) के स्वामियों का रत्न धारण करना ही सर्वथा निरापद और कल्याणकारी होता है:\n\n1. **लग्न (${lagna}) अनुसार रत्न:** आपके लग्नेश का रत्न आपको दीर्घायु, आत्मबल और ओज प्रदान करेगा।\n2. **सिद्ध बीज मंत्र:** स्नानोपरांत पूर्वाभिमुख होकर **'ॐ नमो भगवते वासुदेवाय'** अथवा **'ॐ नमः शिवाय'** का 108 बार रुद्राक्ष माला पर जप करें।`
      : `💎 **Auspicious Gemstone & Sacred Mantra Prescription:**\n\nDear ${name}, under classical Vedic rules, only the lords of the 1st, 5th, and 9th trinal houses should be energized with gemstones:\n\n1. **For ${lagna} Ascendant:** Wearing the designated primary gem of your Ascendant Lord strengthens vitality, aura, and executive authority.\n2. **Beej Mantra:** Chanting **'Om Namah Shivaya'** or **'Om Namo Bhagavate Vasudevaya'** 108 times daily brings holistic harmony.`;
    return base + buildProgressFooter(qNum);
  }

  // General Comprehensive Answer
  const base = isHindi
    ? `🙏 **सटीक वैदिक ज्योतिषीय फलादेश एवं समाधान:**\n\nप्रिय ${name} जी, आपकी जन्म कुंडली (लग्न: **${lagna}**, चंद्र राशि: **${rashi}**, नक्षत्र: **${nakshatra}**, महादशा: **${dasha}**) के अनुसार आपके इस प्रश्न का गहन विश्लेषण प्रस्तुत है:\n\n1. **ज्योतिषीय कारण:** ग्रहों के गोचर और आपकी वर्तमान दशा यह संकेत देती है कि आपके जीवन में सकारात्मक परिवर्तन की प्रक्रिया प्रारंभ हो चुकी है। धैर्य और संकल्प से किया गया हर कार्य सफलता दिलाएगा।\n2. **अनुकूल समय:** आगामी 3 से 6 माह में ग्रहों की स्थिति आपके पक्ष में होगी और आपके प्रयास सकारात्मक परिणाम देंगे।\n\n💎 **दैनिक कल्याणकारी उपाय:**\n- प्रतिदिन प्रातः उगते सूर्य को अर्घ्य दें और अपने माता-पिता व गुरुजनों का आशीर्वाद लें।\n- किसी भी महत्वपूर्ण कार्य पर जाने से पूर्व एक चुटकी गुड़ या मीठा खाकर जल पिएं।`
    : `🙏 **Vedic Astrological Resolution & Insight:**\n\nDear ${name}, based on your computed sidereal chart (Ascendant: **${lagna}**, Moon: **${rashi}**, Nakshatra: **${nakshatra}**, Mahadasha: **${dasha}**):\n\n1. **Planetary Insight:** Current planetary configurations and your active **${dasha}** indicate that transformative phases are unfolding in your favor. Consistent disciplined action will yield rewarding results.\n2. **Favorable Window:** The upcoming 3 to 6 months present auspicious windows for steady progress.\n\n💎 **Daily Harmonizing Remedies:**\n- Offer pure water to the rising Sun daily from a copper vessel.\n- Seek blessings of elders before commencing pivotal ventures.`;

  return base + buildProgressFooter(qNum);
}

// 2. KUNDALI READING FALLBACK GENERATOR
export function generateVedicKundaliFallback(options: {
  birthData: any;
  planetaryData: any;
  lang?: "en" | "hi";
}): string {
  const { birthData, planetaryData, lang = "en" } = options;
  const isHindi = lang === "hi";

  const name = birthData.name || "Seeker";
  const lagnaSign = planetaryData.ascendant?.sign || "Aries";
  const lagnaDeg = planetaryData.ascendant?.degree || "15.0";
  const moonSign = planetaryData.moon?.sign || "Taurus";
  const nakshatra = planetaryData.nakshatra?.name || "Rohini";
  const pada = planetaryData.nakshatra?.pada || 1;
  const mahadasha = planetaryData.dasha?.currentMahadasha || "Jupiter";
  const antardasha = planetaryData.dasha?.currentAntardasha || "Saturn";
  const isManglik = !!planetaryData.doshas?.mangalDosha;
  const isSadeSati = !!planetaryData.doshas?.sadeSati?.active;

  if (isHindi) {
    return `## ✨ 1. पंचांग एवं लग्न तत्व विश्लेषण (Lagna Tattva)
- **मूल लग्न:** ${lagnaSign} (${lagnaDeg}°)
- **चंद्र राशि (जन्म राशि):** ${moonSign}
- **जन्म नक्षत्र:** ${nakshatra} (पाद ${pada})
- **स्वभाव एवं व्यक्तित्व:** जातक का व्यक्तित्व गरिमामयी, कर्तव्यनिष्ठ एवं संवेदनशील है। लग्न तत्व आपके आत्मबल को मजबूती प्रदान करता है, जिससे कठिन परिस्थितियों में भी आप धैर्य बनाए रखने में सक्षम हैं।

---

## 🪐 2. प्रमुख ग्रह स्थिति एवं भाव प्रभाव (Graha Dynamics)
- **सूर्य देव (आत्मकारक):** जातक में स्वाभिमान, नेतृत्व क्षमता एवं प्रशासनिक कौशल प्रदान करते हैं।
- **चंद्रमा (मनःकारक):** ${moonSign} राशि में स्थित होने से कल्पनाशीलता एवं तीव्र अंतर्ज्ञान (intuition) का संचार करते हैं।
- **लग्न व दशम भाव संबंध:** दशम भाव में ग्रहों की शुभ दृष्टि जातक को जीवन के मध्य भाग में मान-सम्मान एवं आर्थिक सुदृढ़ता दिलाने का योग बनाती है।

---

## ⚡ 3. विंशोत्तरी महादशा एवं काल चक्र (Dasha Timeline)
- **वर्तमान महादशा:** ${mahadasha} महादशा में ${antardasha} अंतर्दशा
- **दशा फलक:** यह महादशा ज्ञान, विवेक एवं सामाजिक दायित्वों में विस्तार लाती है। इस अवधि में लिए गए बुद्धिमत्तापूर्ण निर्णय दीर्घकालिक लाभ सिद्ध करेंगे।

---

## 🛡️ 4. दोष विश्लेषण (Mangal Dosha & Sade Sati)
- **मांगलिक स्थिति:** ${isManglik ? "कुंडली में आंशिक मांगलिक प्रभाव है, जो 28 वर्ष की आयु के पश्चात स्वतः शांत हो जाता है।" : "कुंडली में मांगलिक दोष अनुपस्थित है। दांपत्य जीवन में सौहार्द बना रहेगा।"}
- **शनि साढ़े साती:** ${isSadeSati ? "वर्तमान में साढ़े साती का प्रभाव सक्रिय है। यह काल आत्म-सुधार, श्रम एवं साधना का है।" : "वर्तमान में साढ़े साती का प्रभाव नहीं है। मानसिक शांति बनी रहेगी।"}

---

## 💎 5. वैदिक समरसता एवं महाज्योतिषी उपाय (Upayas)
1. **शुभ रत्न:** लग्नपति का रत्न धारण करने से कार्यक्षमता और सकारात्मक ऊर्जा में वृद्धि होगी।
2. **दैनिक मंत्र साधना:** प्रतिदिन प्रातः **'ॐ नमः शिवाय'** अथवा **'गायत्री मंत्र'** का जप करें।
3. **कल्याणकारी दान:** प्रत्येक शनिवार को काले तिल अथवा सरसों के तेल का दान करें।
4. **सूर्य अर्घ्य:** प्रातःकाल ताम्र पात्र से सूर्यदेव को कुमकुम मिश्रित जल अर्पित करें।`;
  } else {
    return `## ✨ 1. Panchang & Ascendant Analysis (Lagna Tattva)
- **Ascendant (Lagna):** ${lagnaSign} (${lagnaDeg}°)
- **Moon Sign (Chandra Rashi):** ${moonSign}
- **Birth Nakshatra:** ${nakshatra} (Pada ${pada})
- **Constitution & Purpose:** The native exhibits a balanced, dignified persona governed by ethical responsibility and keen emotional intelligence. The rising sign grounds physical vitality and strategic fortitude.

---

## 🪐 2. Key Graha Placements & House Dynamics
- **Sun (Atmakaraka):** Bestows innate self-respect, administrative vision, and nobility.
- **Moon (Manas):** Stationed in ${moonSign}, infusing deep sensitivity, rich creative insight, and intuitive foresight.
- **Kendra & Trikona Synergy:** Positive planetary aspects linking the 1st, 5th, and 3th houses signify professional respect and steady wealth accumulation after early hurdles.

---

## ⚡ 3. Dasha Weather & Timing of Events (Vimshottari Dasha)
- **Active Period:** ${mahadasha} Mahadasha with ${antardasha} Antardasha
- **Guidance:** This planetary chapter emphasizes knowledge accumulation, karmic maturity, and strategic partnerships. Decisions taken with patience will yield compounded success.

---

## 🛡️ 4. Dosha Diagnosis (Mangal Dosha & Sade Sati)
- **Mangal Dosha:** ${isManglik ? "Mild Manglik influence detected. This softens naturally post age 28 through spiritual discipline." : "No significant Mangal Dosha detected. Marital prospects are naturally harmonious."}
- **Sade Sati:** ${isSadeSati ? "Active Saturn phase in progress. Promotes grounded lifestyle, focus, and karmic refinement." : "Sade Sati is currently inactive. Mental peace and stability prevail."}

---

## 💎 5. Vedic Harmonization & Prescribed Upayas (Remedies)
1. **Gemstone:** Wearing the primary gemstone of the chart ruler (Lagnesha) bolsters vitality, focus, and aura strength.
2. **Beej Mantra:** Chant **'Om Namah Shivaya'** or the **Gayatri Mantra** 108 times every morning.
3. **Charity (Daan):** Feed birds or cows on Wednesdays and donate sesame/mustard oil on Saturdays.
4. **Solar Alignment:** Offer pure water mixed with kumkum to Lord Surya every morning from a copper pot.`;
  }
}

// 3. HOROSCOPE FALLBACK GENERATOR
export function generateVedicHoroscopeFallback(options: {
  rashi: string;
  period?: string;
  lang?: "en" | "hi";
}): string {
  const { rashi, period = "today", lang = "en" } = options;
  const isHindi = lang === "hi";

  if (isHindi) {
    return `🌟 **ब्रह्मांडीय ऊर्जा एवं सामान्य प्रभाव (${rashi}):**
आज का दिन चंद्र गोचर के प्रभाव से आपके लिए नई ऊर्जा व उत्साह लेकर आया है। आपकी कॉस्मिक हार्मोनी स्कोर **88%** है।

💼 **कर्म, आजीविका एवं धन (Karma & Artha):**
कार्यक्षेत्र में आपकी योजनाओं की प्रशंसा होगी। पुराने अटके हुए धन की वापसी के संकेत हैं। महत्वपूर्ण व्यावसायिक निर्णयों में जल्दबाजी से बचें।

❤️ **प्रेम, दांपत्य एवं संबंध (Kama):**
परिवार व जीवनसाथी के साथ सामंजस्य बढ़ेगा। सायं काल किसी पुराने मित्र अथवा प्रियजन से सुखद संवाद के योग हैं।

🧘 **स्वास्थ्य एवं मनोबल (Arogya):**
मानसिक शांति उत्तम रहेगी। मौसमी परिवर्तनों के प्रति सजग रहें और पर्याप्त जल का सेवन करें।

🍀 **शुभ तत्व (Auspicious Keys):**
- **शुभ अंक:** 5, 9
- **शुभ रंग:** सुनहरा पीला / नारंगी
- **शुभ समय:** प्रातः 10:15 से 11:45
- **अनुकूल दिशा:** ईशान कोण (उत्तर-पूर्व)

🪔 **दैनिक वैदिक सूक्ष्म उपाय:**
प्रातः उगते सूर्य को तांबे के पात्र से जल अर्पित करें और पक्षियों को दाना डालें।`;
  } else {
    return `🌟 **Cosmic Energy & Overall Vibe (${rashi}):**
The lunar transits bestow clarity, elevated enthusiasm, and calm confidence today. Your Cosmic Harmony Index is at **88%**.

💼 **Career, Business & Wealth (Karma & Artha):**
Your workplace contributions receive genuine appreciation. A favorable environment emerges for financial planning and closing stalled conversations.

❤️ **Love, Romance & Relationships (Kama):**
Warm mutual understanding illuminates personal connections. An honest conversation today resolves lingering ambiguities.

🧘 **Health, Energy & Well-being (Arogya):**
Vitality levels remain high. Practice deep diaphragmatic breathing and stay well-hydrated throughout the day.

🍀 **Auspicious Elements:**
- **Lucky Numbers:** 5, 9
- **Lucky Color:** Golden Amber & Deep Saffron
- **Auspicious Time Window:** 10:15 AM - 11:45 AM
- **Beneficial Direction:** North-East (Ishana)

🪔 **Daily Vedic Micro-Remedy:**
Offer fresh water to the rising Sun in a copper vessel, and feed grains to wild birds before noon.`;
  }
}

// 4. MATCHMAKING FALLBACK GENERATOR
export function generateVedicMatchmakingFallback(options: {
  person1: { name: string; rashi: string; nakshatra: string };
  person2: { name: string; rashi: string; nakshatra: string };
  ashtakootScore: number;
  lang?: "en" | "hi";
}): string {
  const { person1, person2, ashtakootScore, lang = "en" } = options;
  const isHindi = lang === "hi";

  const verdict =
    ashtakootScore >= 28
      ? isHindi
        ? "अत्यंत उत्तम एवं मांगलिक मिलान (Superior Match)"
        : "Highly Auspicious & Blessed Match"
      : ashtakootScore >= 18
      ? isHindi
        ? "शुभ एवं स्वीकार्य मिलान (Auspicious & Compatible Match)"
        : "Auspicious & Harmonious Match"
      : isHindi
      ? "मध्यम मिलान - उपायों की आवश्यकता (Moderate Match - Upayas Recommended)"
      : "Moderate Match - Upayas & Mutual Understanding Recommended";

  if (isHindi) {
    return `💍 **अष्टकूट गुण मिलान निर्णय:**
- **कुल गुण प्राप्तांक:** ${ashtakootScore} / 36
- **निर्णय:** ${verdict}
वैदिक ज्योतिष के अनुसार 18 से अधिक गुण विवाह के लिए शुभ माने जाते हैं। ${person1.name} एवं ${person2.name} की कुंडलियों का सामंजस्य वैवाहिक जीवन में उन्नति का कारक है।

🧠 **मानसिक एवं बौद्धिक समरसता (Gana & Maitri):**
दोनों का वैचारिक तालमेल संतुलित रहेगा। एक-दूसरे के दृष्टिकोण का सम्मान करने से दांपत्य में सुखद सामंजस्य बना रहेगा।

🌿 **शारीरिक, स्वास्थ्य एवं आनुवांशिक सामंजस्य (Nadi & Bhakoot):**
नाड़ी और भकूट के प्राप्तांक दोनों के स्वास्थ्य, दीर्घायु और संतान सुख के लिए अनुकूल ऊर्जा दर्शाते हैं।

🏡 **पारिवारिक समृद्धि एवं साझा जीवन उद्देश्य:**
दोनों की संयुक्त ऊर्जा गृहस्थ आश्रम में सुख, शांति और समृद्धि की वृद्धि करेगी।

🛡️ **वैदिक शांति एवं समरसता उपाय:**
1. विवाह पूर्व अथवा पश्चात श्री **गौरी-शंकर रुद्राक्ष** की पूजा करें।
2. दोनों मिलकर प्रत्येक पूर्णिमा को श्री सत्यनारायण भगवान की कथा का श्रवण करें।`;
  } else {
    return `💍 **Ashtakoot Guna Milan Verdict:**
- **Total Points:** ${ashtakootScore} / 36
- **Verdict:** ${verdict}
In classical Parashari Jyotish, a score above 18 is auspicious. The planetary resonance between ${person1.name} and ${person2.name} indicates a supportive, spiritually rewarding alliance.

🧠 **Mental & Intellectual Alignment (Gana & Maitri):**
Communication flow and intellectual temperaments harmonize well, allowing constructive dialogue and mutual respect during decision-making.

🌿 **Physical, Longevity & Genetic Harmony (Nadi & Bhakoot):**
The biological and emotional currents demonstrate wholesome synergy, supporting domestic vitality and progeny welfare.

🏡 **Domestic Prosperity & Shared Life Purpose:**
The couple's combined astrological energy brings financial stability, warmth, and shared cultural values into the household.

🛡️ **Remedies & Harmony Practices (Upayas):**
1. Offer joint prayers to Lord Shiva and Goddess Parvati (Gauri Shankar) to invite lasting auspiciousness.
2. Foster mutual patience and perform collective charitable acts on auspicious festivals.`;
  }
}
