import { jsPDF } from "jspdf";
import { MorphoReport } from "../types";

const pdfTranslations = {
  es: {
    title: "INFORME FISIOGNÓMICO PERSONALIZADO",
    subtitle: "Análisis Fisiognómico Científico e Interpretativo",
    subject: "Sujeto / Perfil:",
    date: "Fecha de Análisis:",
    shape: "Forma Facial dominante:",
    overall: "Tipo de Entorno (Corman):",
    temperament: "Temperamento dominante:",
    zonesTitle: "1. BALANCES DE PROPORCIÓN FACIAL (ZONAS DE CORMAN)",
    intellectual: "Zona Superior (Intelectual / Mente)",
    emotional: "Zona Media (Emocional / Social)",
    instinctive: "Zona Inferior (Instintiva / Realización)",
    strengthText: "Fuerza:",
    receiversTitle: "2. ANÁLISIS DE RECEPTORES BIOMÉTRICOS Y ÓRGANOS",
    eyes: "Receptor Cognitivo (Ojos)",
    nose: "Receptor de Protección (Nariz)",
    mouth: "Receptor Vital (Boca y Mandíbula)",
    timelineTitle: "3. HORIZONTE TEMPORAL EN MORFOPSICOLOGÍA",
    past: "El Pasado (Estructura y Marco Óseo)",
    present: "El Presente (Tono Muscular Activo)",
    future: "El Futuro (Consejos y Plan de Equilibrio)",
    strengths: "4. FORTALEZAS Y COMPETENCIAS INHERENTES",
    growth: "5. ÁREAS DE ENFOQUE Y DESARROLLO PERSONAL",
    disclaimer: "Este dossier especial se basa en las directrices clásicas de la obra de Louis Corman (1937), 'Morfopsicología del Rostro'. Se ha compilado para divulgación educativa, autoconocimiento reflexivo y entretenimiento científico."
  },
  en: {
    title: "PERSONALIZED PHYSIOGNOMIC REPORT",
    subtitle: "Scientific Architecture and Facial Symmetry Analysis",
    subject: "Subject / Profile:",
    date: "Analysis Date:",
    shape: "Dominant Face Shape:",
    overall: "Environment Type (Corman):",
    temperament: "Dominant Temperament:",
    zonesTitle: "1. FACIAL ZONE PROPORTIONS (CORMAN ZONES)",
    intellectual: "Upper Zone (Intellectual / Head)",
    emotional: "Middle Zone (Emotional / Social)",
    instinctive: "Lower Zone (Instinctive / Execution)",
    strengthText: "Strength:",
    receiversTitle: "2. BIOMETRIC RECEIVER & SENSORY SITES ANALYSIS",
    eyes: "Cognitive Receiver (Eyes)",
    nose: "Protective Receiver (Nose)",
    mouth: "Vital Receiver (Mouth & Jaw)",
    timelineTitle: "3. TEMPORAL HORIZON AND TIMELINE TRANSIT",
    past: "The Past (Inherent Bone Carriage)",
    present: "The Present (Active Face Tone)",
    future: "The Future (Advisory & Balance Action)",
    strengths: "4. INHERENT HIGHLIGHTED STRENGTHS",
    growth: "5. TARGET PERFORMANCE & GROWTH SECTORS",
    disclaimer: "This special dossier is compiled in reference to the classical foundations of Morphopsychology (Dr. Louis Corman, 1937). It is provided for personal reflection, character development, and illustrative inquiry."
  },
  fr: {
    title: "DOSSIER PHYSIOGNOMIQUE PERSONNALISÉ",
    subtitle: "Analyse Scientifique de l'Architecture et Symétrie Faciale",
    subject: "Sujet / Profil :",
    date: "Date d'Analyse :",
    shape: "Forme Faciale dominante :",
    overall: "Type d'Environnement (Corman) :",
    temperament: "Tempérament dominant :",
    zonesTitle: "1. PROPORTIONS DES ZONES FACIALES (ZONES CORMAN)",
    intellectual: "Zone Supérieure (Intellectuelle / Idées)",
    emotional: "Zone Médiane (Émotionnelle / Sociale)",
    instinctive: "Zone Inférieure (Instinctive / Action)",
    strengthText: "Force :",
    receiversTitle: "2. ANALYSE DES RÉCEPTEURS BIOMÉTRIQUES SENSORELS",
    eyes: "Récepteur Cognitif (Yeux)",
    nose: "Récepteur de Protection (Nez)",
    mouth: "Récepteur Vital (Bouche & Mâchoire)",
    timelineTitle: "3. ORIENTATION TEMPORELLE ET HISTORIQUE",
    past: "Le Passé (Cadre Osseux Constitutionnel)",
    present: "Le Présent (Tonus Actif des Tissus)",
    future: "Le Futur (Conseils d'Équilibre Personnel)",
    strengths: "4. FORCES NATURELLES ET COMPÉTENCES SPÉCIFIQUES",
    growth: "5. AXES D'ÉVOLUTION ET DE PROGRÈS INDIVIDUEL",
    disclaimer: "Ce dossier spécial est fondé sur les lois de la Morphopsychologie classique (Dr. Louis Corman, 1937). Destiné à l'information, la réflexion personnelle et au divertissement illustratif."
  }
};

export function downloadPDFSummary(
  language: "es" | "en" | "fr",
  report: MorphoReport,
  subjectName: string
) {
  const doc = new jsPDF("p", "mm", "a4");
  const local = pdfTranslations[language] || pdfTranslations["es"];
  
  let y = 32;
  const pageHeight = 277;
  const margin = 20;
  const contentWidth = 170;

  function drawPageFramework(pageNum: number, totalPagesPlaceholder: string = "") {
    // Elegant container border
    doc.setDrawColor(217, 119, 6); // Amber 600
    doc.setLineWidth(0.6);
    doc.rect(10, 10, 190, 277);

    // Subtle inner double line
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.25);
    doc.rect(11.5, 11.5, 187, 274);
    
    // Top header decoration
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(115, 115, 115); // Neutral 500
    doc.text("MORPHOFACE ESTUDIO FISIOGNÓMICO • LOUIS CORMAN BIOMETRICS v2.4", 15, 16);
    
    // Separator line
    doc.setDrawColor(217, 119, 6); // Accent Gold
    doc.line(15, 18, 195, 18);

    // Footer
    doc.line(15, 276, 195, 276);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(120, 113, 108);
    doc.text(local.disclaimer, 15, 281, { maxWidth: 145 });
    
    // Page number
    doc.setFont("helvetica", "bold");
    doc.text(`Page ${pageNum}`, 180, 281);
  }

  function checkPageBreak(neededHeight: number) {
    if (y + neededHeight > pageHeight - 12) {
      doc.addPage();
      currentPage++;
      drawPageFramework(currentPage);
      y = 30; // Reset Y coordinate on new page
    }
  }

  let currentPage = 1;
  drawPageFramework(currentPage);

  // Logo / Title Header block
  doc.setFillColor(28, 25, 23); // Dark background block (Stone 900)
  doc.rect(15, 22, 180, 15, "F");

  // Title text over black header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(245, 158, 11); // Amber 500
  doc.text(local.title, 20, 29);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(245, 245, 244); // Stone 100
  doc.text(local.subtitle, 20, 33);
  y = 44;

  // Metadata block (Sujeto, Fecha, more info)
  doc.setFillColor(250, 250, 249); // Stone 50 background
  doc.rect(15, y, 180, 20, "F");
  
  // Outer divider boundary
  doc.setDrawColor(231, 229, 228); // Stone 200
  doc.rect(15, y, 180, 20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(41, 37, 36); // Stone 800
  doc.text(local.subject, 20, y + 6);
  doc.setFont("helvetica", "normal");
  doc.text(subjectName, 55, y + 6);

  doc.setFont("helvetica", "bold");
  doc.text(local.date, 20, y + 14);
  doc.setFont("helvetica", "normal");
  doc.text(new Date().toLocaleDateString(language === "en" ? "en-US" : language === "fr" ? "fr-FR" : "es-ES"), 55, y + 14);

  doc.setFont("helvetica", "bold");
  doc.text(local.shape, 110, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 83, 9); // Amber 700 text accent
  doc.text(report.faceShape, 145, y + 6);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(41, 37, 36);
  doc.text(local.overall, 110, y + 14);
  doc.setFont("helvetica", "normal");
  doc.text(report.overallType, 145, y + 14);

  y += 26;

  // Introduction paragraph
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(24, 24, 27); // Zinc 900
  doc.text(local.temperament + " " + report.temperament, 15, y);
  y += 4;
  
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(68, 64, 60); // Stone 600
  
  // Format introductory paragraph
  const introTxt = language === "fr" 
    ? `L'analyse d'architecture de ${subjectName} révèle une signature morphologique singulière. Le profil est classé selon les lois Corman comme ${report.overallType} et doté d'une dominante comportementale ${report.temperament}.`
    : language === "en"
      ? `The biometric assessment of ${subjectName} highlights a particular morphological signature. The system profiles this face as ${report.overallType}, showing a dominant temperament oriented toward ${report.temperament}.`
      : `El análisis estructural de ${subjectName} muestra una configuración singular. Su rostro clasifica en la escala de Louis Corman como ${report.overallType}, con una predisposición conductual predominantemente ${report.temperament}, la cual rige sus dinámicas sociales, afectivas y de respuesta ejecutiva.`;

  const introLines = doc.splitTextToSize(introTxt, contentWidth);
  introLines.forEach((l: string) => {
    doc.text(l, 15, y);
    y += 4;
  });
  y += 4;

  // 1. ZONES SECTION
  checkPageBreak(45);
  doc.setFillColor(245, 158, 11, 0.1); // Amber 500 opacity
  doc.rect(15, y - 4, 180, 5.5, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9); // Dark Amber
  doc.text(local.zonesTitle, 18, y);
  y += 6.5;

  const zones = [
    { label: local.intellectual, score: report.zones.intellectual.score, text: report.zones.intellectual.interpretation, color: [124, 58, 237] },
    { label: local.emotional, score: report.zones.emotional.score, text: report.zones.emotional.interpretation, color: [225, 29, 72] },
    { label: local.instinctive, score: report.zones.instinctive.score, text: report.zones.instinctive.interpretation, color: [217, 119, 6] }
  ];

  zones.forEach((z) => {
    checkPageBreak(25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(24, 24, 27);
    doc.text(z.label, 15, y);
    
    // Draw Progress Bar
    doc.setFillColor(240, 240, 240);
    doc.rect(120, y - 3, 50, 3, "F");
    doc.setFillColor(z.color[0], z.color[1], z.color[2]);
    doc.rect(120, y - 3, 50 * (z.score / 100), 3, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(`${z.score}%`, 173, y - 0.5);

    y += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(87, 83, 78); // Stone 600
    const zoneLines = doc.splitTextToSize(z.text, contentWidth);
    zoneLines.forEach((l: string) => {
      doc.text(l, 15, y);
      y += 3.8;
    });
    y += 3;
  });

  // 2. RECEIVERS
  checkPageBreak(40);
  doc.setFillColor(245, 158, 11, 0.1);
  doc.rect(15, y - 4, 180, 5.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text(local.receiversTitle, 18, y);
  y += 6.5;

  const receivers = [
    { label: local.eyes, style: report.features.eyes.style, text: report.features.eyes.interpretation },
    { label: local.nose, style: report.features.nose.style, text: report.features.nose.interpretation },
    { label: local.mouth, style: report.features.mouthAndJaw.style, text: report.features.mouthAndJaw.interpretation }
  ];

  receivers.forEach((r) => {
    checkPageBreak(22);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(24, 24, 27);
    doc.text(`${r.label}: `, 15, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(217, 119, 6);
    doc.text(r.style, doc.getTextWidth(`${r.label}: `) + 17, y);

    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(87, 83, 78);
    const recLines = doc.splitTextToSize(r.text, contentWidth);
    recLines.forEach((l: string) => {
      doc.text(l, 15, y);
      y += 3.7;
    });
    y += 2.5;
  });

  // 3. TIMELINE
  checkPageBreak(40);
  doc.setFillColor(245, 158, 11, 0.1);
  doc.rect(15, y - 4, 180, 5.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text(local.timelineTitle, 18, y);
  y += 6.5;

  const times = [
    { label: local.past, text: report.pastIns },
    { label: local.present, text: report.presentIns },
    { label: local.future, text: report.futureIns }
  ];

  times.forEach((t) => {
    checkPageBreak(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(24, 24, 27);
    doc.text(t.label, 15, y);
    
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(87, 83, 78);
    const timeLines = doc.splitTextToSize(t.text, contentWidth);
    timeLines.forEach((l: string) => {
      doc.text(l, 15, y);
      y += 3.7;
    });
    y += 2.5;
  });

  // 4 & 5. STRENGTHS AND GROWTH AREAS
  checkPageBreak(40);
  doc.setFillColor(245, 158, 11, 0.1);
  doc.rect(15, y - 4, 180, 5.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text(local.strengths, 18, y);
  y += 6.5;

  report.strengths.forEach((str) => {
    checkPageBreak(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(16, 185, 129); // Green check mark
    doc.text("v ", 15, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(68, 64, 60);
    
    const strLines = doc.splitTextToSize(str, contentWidth - 4);
    strLines.forEach((l: string, idx: number) => {
      doc.text(l, 18, y);
      y += 3.7;
    });
    y += 1;
  });
  y += 2;

  checkPageBreak(40);
  doc.setFillColor(245, 158, 11, 0.1);
  doc.rect(15, y - 4, 180, 5.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text(local.growth, 18, y);
  y += 6.5;

  report.growthAreas.forEach((gro) => {
    checkPageBreak(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(245, 158, 11); // Amber accent arrow
    doc.text("> ", 15, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(68, 64, 60);
    
    const groLines = doc.splitTextToSize(gro, contentWidth - 4);
    groLines.forEach((l: string, idx: number) => {
      doc.text(l, 18, y);
      y += 3.7;
    });
    y += 1;
  });

  // Stamp / Final Seal of scientific analysis
  checkPageBreak(30);
  y += 6;
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.4);
  doc.line(135, y, 185, y);
  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(41, 37, 36);
  doc.text("L. CORMAN NEURAL CORE", 140, y);
  
  // Download pdf triggering
  const safeName = subjectName.toLowerCase().replace(/\s+/g, "_");
  doc.save(`morphoface_analysis_${safeName}.pdf`);
}
