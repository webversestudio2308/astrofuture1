import { jsPDF } from "jspdf";
import { BirthData, KundaliResult } from "../types";

/**
 * Safely sanitizes text for standard jsPDF Helvetica (Latin-1) font.
 * Replaces unicode astronomical symbols, devanagari, emojis, and unprintable chars.
 */
export function sanitizeForPdf(input?: string): string {
  if (!input) return "";

  // Common replacements for celestial symbols & special characters
  let text = input
    .replace(/[☉]/g, "[Sun]")
    .replace(/[☽]/g, "[Moon]")
    .replace(/[♂]/g, "[Mars]")
    .replace(/[☿]/g, "[Mercury]")
    .replace(/[♃]/g, "[Jupiter]")
    .replace(/[♀]/g, "[Venus]")
    .replace(/[♄]/g, "[Saturn]")
    .replace(/[☊]/g, "[Rahu]")
    .replace(/[☋]/g, "[Ketu]")
    .replace(/[✨⭐🌟💫🔮📜🛡️💎💼❤️🧘🍀🪔💍🧠🌿🏡⚡]/g, "*")
    .replace(/[–—]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/…/g, "...")
    .replace(/\s+/g, " ");

  // Strip non-ASCII characters to prevent jsPDF font encoding crash
  text = text.replace(/[^\x20-\x7E\r\n\t]/g, "");

  // Clean empty brackets like () or []
  text = text.replace(/\(\s*\)/g, "").replace(/\[\s*\]/g, "");

  return text.trim();
}

/**
 * Generates a high-resolution, multi-page Vedic Kundali PDF Report.
 * Includes astronomical calculations, planetary positions, Dasha timeline,
 * 3 core problem solutions, and MahaJyotishi upayas.
 */
export function generateKundaliPDF(
  birthData: BirthData,
  kundali: KundaliResult,
  aiReading?: string,
  extraSolutions?: {
    career?: string;
    relationship?: string;
    health?: string;
    remedies?: string;
  }
): { success: boolean; error?: string } {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm

    // ==========================================
    // PAGE 1: JANAM KUNDALI & PLANETARY MATRIX
    // ==========================================

    // Top Dark Cosmic Header
    doc.setFillColor(10, 14, 26); // #0a0e1a
    doc.rect(0, 0, pageWidth, 42, "F");

    // Gold Top Border Line
    doc.setFillColor(245, 158, 11);
    doc.rect(0, 0, pageWidth, 2.5, "F");

    // Title & Branding
    doc.setTextColor(245, 158, 11); // Gold
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("ASTROFUTURE", pageWidth / 2, 16, { align: "center" });

    doc.setTextColor(203, 213, 225); // Slate-300
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      "CERTIFIED VEDIC JANAM KUNDALI & AI JYOTISH ACHARYA DOSHA NIDAN",
      pageWidth / 2,
      24,
      { align: "center" }
    );

    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text(
      "Nirayana Sidereal Longitudes * Lahiri Ayanamsha * Vimshottari Mahadasha Matrix",
      pageWidth / 2,
      31,
      { align: "center" }
    );

    // Gold separator rule
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.6);
    doc.line(18, 36, pageWidth - 18, 36);

    let y = 48;

    // Native Information Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(15, y, pageWidth - 30, 28, 3, 3, "FD");

    const cleanName = sanitizeForPdf(birthData.name) || "Valued Seeker";
    const cleanPlace = sanitizeForPdf(birthData.place) || "Global";

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Native Name: ${cleanName}`, 20, y + 7);

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text(`Date of Birth: ${birthData.date || "N/A"}`, 20, y + 14);
    doc.text(`Time of Birth: ${birthData.time || "N/A"}`, 20, y + 21);

    doc.text(`Birth Place: ${cleanPlace}`, 110, y + 14);
    doc.text(`Coordinates: Lat ${birthData.lat.toFixed(2)}, Lon ${birthData.lon.toFixed(2)}`, 110, y + 21);

    y += 34;

    // Astrological Key Coordinates (Panchang Grid)
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Panchang & Ascendant Foundations (Lagna Tattva)", 15, y);
    y += 4;

    const colW = (pageWidth - 30) / 3;
    const panchangItems = [
      { label: "Ascendant (Lagna)", val: `${kundali.ascendant.sign} (${kundali.ascendant.degree} deg)` },
      { label: "Moon Sign (Rashi)", val: `${kundali.moon.sign} (${kundali.moon.degree} deg)` },
      { label: "Nakshatra & Pada", val: `${kundali.nakshatra.name} (Pada ${kundali.nakshatra.pada})` },
      { label: "Nakshatra Lord", val: kundali.nakshatra.lord },
      { label: "Current Mahadasha", val: `${kundali.dasha.currentMahadasha} Mahadasha` },
      { label: "Mangal Dosha", val: kundali.doshas.mangalDosha ? "Detected (Active)" : "None (Clear)" },
    ];

    panchangItems.forEach((item, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const curX = 15 + col * colW;
      const curY = y + row * 14;

      doc.setFillColor(241, 245, 249);
      doc.roundedRect(curX, curY, colW - 3, 12, 2, 2, "F");

      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(sanitizeForPdf(item.label), curX + 3.5, curY + 4);

      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.text(sanitizeForPdf(item.val), curX + 3.5, curY + 9);
    });

    y += 34;

    // Planetary Coordinates Table (Navagraha Spashta)
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Planetary Degrees & House Placements (Graha Spashta)", 15, y);
    y += 4;

    // Table Header
    doc.setFillColor(15, 23, 42);
    doc.rect(15, y, pageWidth - 30, 6.5, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");

    doc.text("Graha (Planet)", 18, y + 4.5);
    doc.text("Sign (Rashi)", 62, y + 4.5);
    doc.text("Degree", 95, y + 4.5);
    doc.text("House (Bhava)", 125, y + 4.5);
    doc.text("Nakshatra & Lord", 155, y + 4.5);
    y += 6.5;

    // Table Rows
    kundali.planets.forEach((p, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 255 : 248, 250, 252);
      doc.rect(15, y, pageWidth - 30, 5.5, "F");

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");

      const cleanPlanetName = sanitizeForPdf(p.name);
      const cleanSign = sanitizeForPdf(p.sign);
      const cleanNak = sanitizeForPdf(`${p.nakshatra} (${p.nakshatraLord})`);

      doc.text(cleanPlanetName, 18, y + 4);
      doc.text(cleanSign, 62, y + 4);
      doc.text(`${p.degree.toFixed(2)} deg`, 95, y + 4);
      doc.text(`House ${p.house}`, 125, y + 4);
      doc.text(cleanNak, 155, y + 4);

      y += 5.5;
    });

    y += 8;

    // Primary MahaJyotishi Upaya & Gemstone Banner
    doc.setFillColor(254, 243, 199); // Amber-100
    doc.setDrawColor(245, 158, 11);
    doc.roundedRect(15, y, pageWidth - 30, 22, 2.5, 2.5, "FD");

    doc.setTextColor(146, 64, 14); // Amber-900
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.text("MahaJyotishi Harmonization & Primary Gemstone Recommendation", 19, y + 5.5);

    const gemName = sanitizeForPdf(kundali.gemstoneRecommendation.primary);
    const gemMetal = sanitizeForPdf(kundali.gemstoneRecommendation.metal);
    const gemFinger = sanitizeForPdf(kundali.gemstoneRecommendation.finger);
    const gemMantra = sanitizeForPdf(kundali.gemstoneRecommendation.mantra);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(`Auspicious Gemstone: ${gemName} | Metal: ${gemMetal} | Finger: ${gemFinger}`, 19, y + 11.5);
    doc.text(`Empowering Beej Mantra: "${gemMantra}"`, 19, y + 17);

    // Footer on Page 1
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "Astrofuture AI Vedic Platform - Generated with Lahiri Ayanamsha Precision - Page 1 of 2",
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );

    // ==========================================
    // PAGE 2: 3 CORE LIFE OBSTACLES & REMEDIES
    // ==========================================
    doc.addPage();

    // Page 2 Header
    doc.setFillColor(10, 14, 26);
    doc.rect(0, 0, pageWidth, 28, "F");

    doc.setFillColor(245, 158, 11);
    doc.rect(0, 0, pageWidth, 2, "F");

    doc.setTextColor(245, 158, 11);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("ASTROFUTURE - 3 CORE LIFE OBSTACLES & MAHAJYOTISHI SOLUTIONS", pageWidth / 2, 13, {
      align: "center",
    });

    doc.setTextColor(203, 213, 225);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Personalized Karmic Cause & Actionable Solutions for ${cleanName}`,
      pageWidth / 2,
      20,
      { align: "center" }
    );

    let p2Y = 36;

    // 3 Life Problems & Solutions Matrix
    const solutionsList = [
      {
        title: "1. Career, Financial Growth & Obstacle Clearance (Karma & Artha)",
        cause: "Influence of 10th House Lord & Current Mahadasha transit.",
        solution:
          extraSolutions?.career ||
          "Strengthen Lagnesha and Saturn placement through mindful karma. Avoid impulsive financial shifts during Antardasha transitions. Auspicious days for professional deals: Thursdays and Saturdays.",
      },
      {
        title: "2. Relationships, Marriage & Emotional Harmony (Kama & Bandhu)",
        cause: kundali.doshas.mangalDosha
          ? "Moderate Mars energy in relationship angle; requires balancing fiery temperament."
          : "Venus & 7th House lord harmony period.",
        solution:
          extraSolutions?.relationship ||
          "Foster open, calm communication. Light a ghee lamp on Tuesday/Friday evenings. Practicing patience during full moon cycles will align emotional frequencies with your partner.",
      },
      {
        title: "3. Mind, Physical Vitality & Planetary Dosha Protection (Arogya & Shanti)",
        cause: kundali.doshas.sadeSati.active
          ? `Saturn Sade Sati active (${kundali.doshas.sadeSati.phase}); requires discipline and grounded living.`
          : "Favorable planetary shield with occasional Rahu/Ketu subtle stress.",
        solution:
          extraSolutions?.health ||
          "Recite Hanuman Chalisa or Maha Mrityunjaya Mantra in the morning. Engage in acts of anonymous charity (Daan) like feeding birds on Saturdays to dissolve subtle karmic debts.",
      },
    ];

    solutionsList.forEach((sol) => {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, p2Y, pageWidth - 30, 32, 2.5, 2.5, "FD");

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(sanitizeForPdf(sol.title), 20, p2Y + 6.5);

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(180, 83, 9); // Amber-700
      doc.text("Planetary Root Cause: ", 20, p2Y + 12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(sanitizeForPdf(sol.cause), 52, p2Y + 12);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text("MahaJyotishi Remedy: ", 20, p2Y + 17);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const splitSol = doc.splitTextToSize(sanitizeForPdf(sol.solution), pageWidth - 42);
      doc.text(splitSol, 20, p2Y + 22);

      p2Y += 37;
    });

    p2Y += 2;

    // AI Reading / Acharya In-Depth Commentary
    if (aiReading) {
      doc.setFontSize(10.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Acharya AI Personalized Astrological Reading", 15, p2Y);
      p2Y += 5;

      const cleanAi = sanitizeForPdf(
        aiReading
          .replace(/###/g, "")
          .replace(/##/g, "")
          .replace(/\*\*/g, "")
      );

      const readingLines = doc.splitTextToSize(cleanAi, pageWidth - 30);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);

      for (let i = 0; i < readingLines.length; i++) {
        if (p2Y > pageHeight - 16) {
          doc.addPage();
          p2Y = 22;
        }
        doc.text(readingLines[i], 15, p2Y);
        p2Y += 4;
      }
    }

    // Page 2 Footer
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "Astrofuture AI Vedic Platform - May the Divine Navagrahas Bless Your Journey - Page 2",
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );

    // Save with clean sanitized filename
    const filename = `${cleanName.replace(/[^a-zA-Z0-9]/g, "_")}_Vedic_Kundali.pdf`;
    doc.save(filename);

    return { success: true };
  } catch (err: any) {
    console.error("PDF Generation error:", err);
    return { success: false, error: err?.message || "PDF generation encountered an error." };
  }
}
