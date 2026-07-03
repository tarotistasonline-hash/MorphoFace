import React, { useState, useRef, useEffect } from "react";
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Brain, 
  Heart, 
  Zap, 
  User, 
  ChevronRight, 
  BookOpen, 
  Calendar, 
  Clock, 
  Compass, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Eye,
  Settings,
  X,
  Languages,
  Share2,
  Download,
  Copy,
  Check,
  GitCompare,
  ArrowRightLeft,
  Hourglass,
  TrendingUp,
  Volume2,
  VolumeX,
  Music
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { MorphoReport, Landmark } from "./types";
import CameraCapture from "./components/CameraCapture";
import FacialAnalysisGuide from "./components/FacialAnalysisGuide";
import { useLanguage } from "./context/LanguageContext";
import { downloadPDFSummary } from "./utils/pdfGenerator";
import { playHotspotTone, startScanningSound, stopScanningSound, playAgingSliderChangeSound, toggleAmbientMusic, isAmbientMusicPlaying } from "./utils/audioFeedback";
import AnalysisComparer, { ScanOption } from "./components/AnalysisComparer";
import { generateFallbackReport } from "./utils/reportGenerator";
import GuestbookComments from "./components/GuestbookComments";

const resizeImageData = (base64Str: string, maxDim: number): Promise<string> => {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith("data:image")) {
      resolve(base64Str);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
    img.src = base64Str;
  });
};

const shareTranslations = {
  es: {
    shareAnalysis: "Compartir Análisis",
    shareDesc: "Compartir resultados biométricos y morfopsicológicos generando un enlace directo o descargando el informe oficial de Louis Corman en formato PDF.",
    copyLink: "Copiar Enlace Fisiognómico",
    linkCopied: "¡Enlace Copiado al Portapapeles!",
    downloadPdf: "Descargar Reporte Completo en PDF",
    downloading: "Escribiendo PDF...",
    shareTitle: "COMPARTIR ESCANEO FACIAL",
    sharedFromLink: "Reporte cargado vía enlace compartido",
    subjectNameLabel: "Nombre del Sujeto Analizado:",
    defaultSubject: "Sujeto Scan",
  },
  en: {
    shareAnalysis: "Share Analysis",
    shareDesc: "Share biometric and morphopsychological details by generating a dynamic deep link or downloading the official Louis Corman PDF dossier.",
    copyLink: "Copy Deep Link",
    linkCopied: "Link Copied to Clipboard!",
    downloadPdf: "Download Full PDF Report",
    downloading: "Writing PDF...",
    shareTitle: "SHARE FACIAL SCAN",
    sharedFromLink: "Report loaded via shared deep link",
    subjectNameLabel: "Name of Analyzed Subject:",
    defaultSubject: "Scanned Subject",
  },
  fr: {
    shareAnalysis: "Partager l'Analyse",
    shareDesc: "Partagez les détails biométriques et morphopsychologiques en générant un lien direct ou en téléchargeant le dossier PDF officiel de Louis Corman.",
    copyLink: "Copier le Lien Direct",
    linkCopied: "Lien Copié au Presse-papiers !",
    downloadPdf: "Télécharger le PDF complet",
    downloading: "Génération du PDF...",
    shareTitle: "PARTAGER L'ANALYSE FACIALE",
    sharedFromLink: "Rapport chargé via un lien partagé",
    subjectNameLabel: "Nom du Sujet Analysé :",
    defaultSubject: "Sujet Scanné",
  }
};

const agingTranslations = {
  es: {
    title: "Simulador de Envejecimiento AI",
    desc: "Aplica la ley de retracción-dilatación facial de Louis Corman para ver el impacto del tiempo en tus receptores.",
    ageLabel: "Edad Estimada:",
    original: "Original",
    dilatado: "Evolución Dilatada (Flacidez y Ptosis)",
    dilatadoText: "Al ser de estructura Dilatada, tu pilar facial cuenta con un marco carnoso reactivo. Al envejecer, la gravedad desplaza los compartimentos grasos hacia abajo: las mejillas descienden levemente y los surcos nasogenianos se profundizan de forma cóncava. Mantén elasticidad con hidratación tónica.",
    concentrado: "Evolución Concentrada (Líneas de Tensión)",
    concentradoText: "Al ser de estructura Concentrada, tu pilar es óseo y compacto. El tiempo reduce la hidratación tisular sin descolgar grasas. Esto produce arrugas frontales horizontales sumamente definidas, arrugas del ceño y patas de gallo marcadas, pero con un contorno de mandíbula muy definido.",
    mixto: "Evolución Mixta (Retracción y Tono Medio)",
    mixtoText: "Al ser de estructura Mixta, muestras un equilibrio dinámico. El tercio superior (frente) marcará líneas de concentración intelectual rápidas, mientras que el tercio inferior (mandíbula) sufrirá una sutil pérdida de densidad. El enfoque ideal es ejercitar la relajación del ceño.",
    buttonLabel: "Filtro de Edad",
    yearsOffset: "+{y} años"
  },
  en: {
    title: "AI Aging Simulator",
    desc: "Applies Louis Corman's law of facial retraction to map biological aging on your specific receptors.",
    ageLabel: "Estimated Age:",
    original: "Original",
    dilatado: "Expanded Evolution (Sagging & Loss of Tone)",
    dilatadoText: "As an Expanded (Dilatado) profile, you have a resilient, fleshy facial framework. With age, gravity pulls down fatty compartments: cheeks droop slightly and nasolabial folds deepen. Keep tissue supple with firming care.",
    concentrado: "Retracted Evolution (Tension Creases)",
    concentradoText: "As a Retracted (Concentrado) profile, your bone structure is highly compact. Aging proceeds through skin thinning rather than tissue sagging, creating deep, sharp horizontal forehead trenches and crow's feet while maintaining a firm jawline.",
    mixto: "Mixed Evolution (Retraction & Balanced Tone)",
    mixtoText: "As a Mixed profile, you balance both paths. The upper intellectual zone will form early thinking-focus creases (frown lines) while the lower jaw shows gentle sagging. Focus on relaxing facial tension.",
    buttonLabel: "Time Filter",
    yearsOffset: "+{y} years"
  },
  fr: {
    title: "Simulateur de Vieillissement IA",
    desc: "Applique la loi de rétraction-dilatation faciale de Louis Corman pour projeter l'effet du temps sur vos récepteurs.",
    ageLabel: "Âge Estimé :",
    original: "Original",
    dilatado: "Évolution Dilatée (Affaissement & Flaccidité)",
    dilatadoText: "Étant de structure Dilatée, votre visage possède un cadre charnu volumineux. Avec le temps, la gravité déplace les volumes vers le bas, accentuant les plis nasogéniens et le contour des bajoues. Favorisez les soins tonifiants.",
    concentrado: "Évolution Concentrée (Rides de Tension)",
    concentradoText: "Étant de structure Concentrée, votre ossature est fine et dense. Le temps se traduit par l'amincissement de la peau formant des rides d'expression très nettes (rides de lion, plis du front) mais préservant la netteté de la mâchoire.",
    mixto: "Évolution Mixte (Rétraction & Tonus Moyen)",
    mixtoText: "Étant de structure Mixte, vous combinez les deux schémas. Le tiers supérieur montre une rétraction intellectuelle rapide (rides du front), tandis que le contour inférieur s'adoucit légèrement. Un entraînement à la détente faciale est recommandé.",
    buttonLabel: "Filtre Temporel",
    yearsOffset: "+{y} ans"
  }
};

const symmetryTranslations = {
  es: {
    symmetryTitle: "Análisis de Simetría Facial",
    symmetryDesc: "Evaluación biométrica de armonía y correspondencia entre los hemisferios izquierdo (subconsciente/emocional) y derecho (consciente/activo).",
    overallScore: "Índice de Simetría General",
    excellentHarmony: "Excelente Armonía Estructural",
    dynamicAdaptability: "Asimetría Dinámica Adaptativa",
    foreheadSymmetry: "Frente (Zona Intelectual)",
    eyesSymmetry: "Ojos (Zona Emocional - Receptores)",
    cheekbonesSymmetry: "Pómulos (Zona Emocional - Estructura)",
    mouthSymmetry: "Boca (Zona Instintiva)",
    verticalAlignment: "Alineación Vertical",
    lateralSymmetry: "Equilibrio Horizontal",
    highSymmetryText: "Muestras una simetría armónica e integrada. Según la morfopsicología clásica de Louis Corman, esto indica una canalización fluida y madura de las energías mentales y pragmáticas, favoreciendo la estabilidad emocional y un excelente control de la impulsividad.",
    lowSymmetryText: "Presentas una asimetría dinámica y sumamente expresiva. Corman la describe como signo de adaptabilidad e ingenio: una riqueza interior donde coexisten de manera creativa un hemisferio intuitivo y un hemisferio ejecutivo racional."
  },
  en: {
    symmetryTitle: "Facial Symmetry Analysis",
    symmetryDesc: "Biometric evaluation of harmony and correspondence between the left (subconscious/emotional) and right (conscious/active) sides of the face.",
    overallScore: "Overall Symmetry Index",
    excellentHarmony: "Excellent Structural Harmony",
    dynamicAdaptability: "Dynamic Adaptive Asymmetry",
    foreheadSymmetry: "Forehead (Intellectual Zone)",
    eyesSymmetry: "Eyes (Emotional Zone - Receptors)",
    cheekbonesSymmetry: "Cheekbones (Emotional Zone - Structure)",
    mouthSymmetry: "Mouth (Instinctive Zone)",
    verticalAlignment: "Vertical Alignment",
    lateralSymmetry: "Horizontal Balance",
    highSymmetryText: "You showcase a highly harmonious, integrated symmetry. In Corman's classical morphopsychology, this represents a fluid and stable channeling of cognitive and instinctive drives, favoring steady execution and high stress tolerance.",
    lowSymmetryText: "You have a dynamic, highly expressive facial asymmetry. Corman relates this to mental flexibility, resourcefulness, and adaptability—creative friction between intuitive insights and rational objectives."
  },
  fr: {
    symmetryTitle: "Analyse de Symétrie Faciale",
    symmetryDesc: "Évaluation biométrique de l'harmonie entre les côtés gauche (subconscient/émotionnel) et droit (conscient/actif) du visage.",
    overallScore: "Indice de Symétrie Global",
    excellentHarmony: "Excellente Harmonie Structurelle",
    dynamicAdaptability: "Asymétrie Dynamique Adaptative",
    foreheadSymmetry: "Front (Zone Intellectuelle)",
    eyesSymmetry: "Yeux (Zone Émotionnelle - Récepteurs)",
    cheekbonesSymmetry: "Pommettes (Zone Émotionnelle - Cadre)",
    mouthSymmetry: "Bouche (Zone Instinctive)",
    verticalAlignment: "Alignement Vertical",
    lateralSymmetry: "Équilibrement Horizontal",
    highSymmetryText: "Vous affichez une symétrie harmonieuse et intégrée. Selon Louis Corman, cela témoigne d'une canalisation fluide et stable des énergies mentales et instinctives, favorisant l'équilibre affectif et le calme décisionnel.",
    lowSymmetryText: "Vous présentez une asymétrie dynamique et expressive. Corman l'associe à la flexibilité cognitive et à la réactivité : une richesse intérieure où coexistent de manière créative intuition et logique rationnelle."
  }
};

const trendTranslations = {
  es: {
    title: "Insight de Tendencia",
    improving: "Simetría Mejorando",
    stable: "Simetría Estable",
    declining: "Simetría Declinando",
    improvingDesc: "Tu simetría facial muestra progreso a lo largo de las sesiones recientes, indicando mayor armonía y equilibrio muscular.",
    stableDesc: "Tu simetría facial se mantiene estable y consistente entre las últimas sesiones analizadas.",
    decliningDesc: "Se observa una leve desviación asimétrica. Recuerda mantener una postura equilibrada y evitar masticar o apoyarte en un solo lado.",
    initial: "Historial Inicial",
    initialDesc: "Realiza más escaneos faciales para analizar y visualizar tu tendencia de simetría a lo largo del tiempo.",
    slopeLabel: "Pendiente de tendencia:"
  },
  en: {
    title: "Trend Insight",
    improving: "Symmetry Improving",
    stable: "Stable Symmetry",
    declining: "Symmetry Declining",
    improvingDesc: "Your facial symmetry shows consistent progress over recent sessions, indicating enhanced muscle tone balance and structural harmony.",
    stableDesc: "Your facial symmetry remains steady and highly consistent across the analyzed scans.",
    decliningDesc: "A minor asymmetric deviation is detected. Consider practicing balanced posture and chewing evenly on both sides.",
    initial: "Initial Session",
    initialDesc: "Perform more scans over multiple sessions to begin tracking and visualizing your symmetry trends over time.",
    slopeLabel: "Trend slope:"
  },
  fr: {
    title: "Indicateur de Tendance",
    improving: "Symétrie en Amélioration",
    stable: "Symétrie Stable",
    declining: "Symétrie en Baisse",
    improvingDesc: "Votre symétrie faciale s'améliore au fil des séances, révélant un équilibre de tonus et une harmonie accrue.",
    stableDesc: "Votre symétrie faciale reste stable et très cohérente d'un portrait à l'autre.",
    decliningDesc: "Une légère déviation dissymétrique est détectée. Pensez à corriger votre posture et à mâcher de façon homogène.",
    initial: "Session Initiale",
    initialDesc: "Réalisez d'autres analyses faciale pour pouvoir calculer et afficher l'évolution de votre symétrie.",
    slopeLabel: "Pente de tendance :"
  }
};

const exportTranslations = {
  es: {
    title: "ANÁLISIS MORFOPSICOLÓGICO Y BIOMÉTRICO",
    subtitle: "REPORTE OFICIAL DE FISIOGNOMÍA CLÍNICA DE LOUIS CORMAN",
    subject: "Sujeto de Análisis",
    date: "Fecha del Escaneo",
    profile: "PERFIL BIOMÉTRICO DE ARMONÍA",
    shape: "Forma del Rostro",
    type: "Tipo Estructural",
    temp: "Socio-Temperamento",
    zones: "Intensidad de Zonas Estructurales",
    intellectual: "Intelectual (Pensamiento)",
    emotional: "Emocional (Socio-Afectivo)",
    instinctive: "Instintivo (Fuerza Física)",
    strengths: "Fortalezas Clave",
    symmetry: "Índice de Simetría"
  },
  en: {
    title: "MORPHOPSYCHOLOGICAL & BIOMETRIC ANALYSIS",
    subtitle: "OFFICIAL CLINICAL PHYSIOGNOMY REPORT BY LOUIS CORMAN",
    subject: "Subject",
    date: "Scan Date",
    profile: "BIOMETRIC HARMONY PROFILE",
    shape: "Facial Shape",
    type: "Structural Profile",
    temp: "Socio-Temperament",
    zones: "Structural Zones Intensity",
    intellectual: "Intellectual (Thinking)",
    emotional: "Emotional (Socio-Affective)",
    instinctive: "Instinctive (Physical Power)",
    strengths: "Core Strengths",
    symmetry: "Symmetry Index"
  },
  fr: {
    title: "ANALYSE MORPHOPHYSCHOLOGIQUE & BIOMÉTRIQUE",
    subtitle: "RAPPORT OFFICIEL DE PHYSIOGNOMONIE CLINIQUE DE LOUIS CORMAN",
    subject: "Sujet d'Analyse",
    date: "Date de l'Analyse",
    profile: "PROFIL D'HARMONIE BIOMÉTRIQUE",
    shape: "Forme du Visage",
    type: "Type Structurel",
    temp: "Socio-Tempérament",
    zones: "Intensité des Zones Structurelles",
    intellectual: "Intellectuel (Pensée)",
    emotional: "Émotionnel (Socio-Affectif)",
    instinctive: "Instinctif (Force Physique)",
    strengths: "Forces Majeures",
    symmetry: "Indice de Symétrie"
  }
};

const calculateOverallSymmetryForReport = (report: MorphoReport | null) => {
  if (!report || !report.landmarks) return 0;
  
  const landmarks = report.landmarks;
  const nose = landmarks.find(l => l.label === "Nose Tip");
  const chin = landmarks.find(l => l.label === "Chin Point");
  
  const midX = (nose && chin) ? (nose.x + chin.x) / 2 : (nose ? nose.x : (chin ? chin.x : 50));
  
  const fhL = landmarks.find(l => l.label === "Forehead Left");
  const fhR = landmarks.find(l => l.label === "Forehead Right");
  const eyeL = landmarks.find(l => l.label === "Left Eye");
  const eyeR = landmarks.find(l => l.label === "Right Eye");
  const cheekL = landmarks.find(l => l.label === "Left Cheekbone");
  const cheekR = landmarks.find(l => l.label === "Right Cheekbone");
  const mouthL = landmarks.find(l => l.label === "Mouth Left");
  const mouthR = landmarks.find(l => l.label === "Mouth Right");
  
  const getPairSymmetry = (L: Landmark | undefined, R: Landmark | undefined) => {
    if (!L || !R) return { overall: 92 };
    const leftDist = Math.abs(midX - L.x);
    const rightDist = Math.abs(R.x - midX);
    const widthDiff = Math.abs(leftDist - rightDist);
    const yDiff = Math.abs(L.y - R.y);
    
    const horizontal = Math.max(50, Math.min(100, 100 - (widthDiff * 6)));
    const vertical = Math.max(50, Math.min(100, 100 - (yDiff * 8)));
    const overall = Math.round((horizontal + vertical) / 2);
    return { overall };
  };
  
  const forehead = getPairSymmetry(fhL, fhR);
  const eyes = getPairSymmetry(eyeL, eyeR);
  const cheekbones = getPairSymmetry(cheekL, cheekR);
  const mouth = getPairSymmetry(mouthL, mouthR);
  
  return Math.round((forehead.overall + eyes.overall + cheekbones.overall + mouth.overall) / 4);
};

const calculateTrendSlope = (scores: number[]) => {
  if (scores.length < 2) return 0;
  const n = scores.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  for (let i = 0; i < n; i++) {
    const x = i;
    const y = scores[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }
  return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
};

const exportReportAsPng = (
  report: MorphoReport, 
  imageSrc: string | null, 
  subjectName: string, 
  overallSymmetryVal: number,
  language: "es" | "en" | "fr"
) => {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const t = exportTranslations[language] || exportTranslations["es"];

  const bgGrad = ctx.createLinearGradient(0, 0, 800, 600);
  bgGrad.addColorStop(0, "#0c0a09");
  bgGrad.addColorStop(1, "#1c1917");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 800, 600);

  ctx.strokeStyle = "rgba(245, 158, 11, 0.25)";
  ctx.lineWidth = 1;
  ctx.strokeRect(15, 15, 770, 570);
  ctx.strokeRect(20, 20, 760, 560);

  ctx.fillStyle = "#fafaf9";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText(t.title, 40, 65);

  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 10px monospace";
  ctx.fillText(t.subtitle, 40, 85);

  ctx.fillStyle = "#a8a29e";
  ctx.font = "12px sans-serif";
  ctx.fillText(`${t.subject}: ${subjectName}`, 40, 115);
  ctx.fillText(`${t.date}: ${new Date().toLocaleDateString()}`, 40, 134);

  ctx.strokeStyle = "rgba(120, 113, 108, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 152);
  ctx.lineTo(760, 152);
  ctx.stroke();

  const drawDetails = () => {
    ctx.fillStyle = "#fafaf9";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(t.profile, 40, 185);

    ctx.fillStyle = "#a8a29e";
    ctx.font = "12px sans-serif";
    ctx.fillText(`${t.shape}:`, 40, 215);
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText(report.faceShape, 160, 215);

    ctx.fillStyle = "#a8a29e";
    ctx.font = "12px sans-serif";
    ctx.fillText(`${t.type}:`, 40, 240);
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText(report.overallType, 160, 240);

    ctx.fillStyle = "#a8a29e";
    ctx.font = "12px sans-serif";
    ctx.fillText(`${t.temp}:`, 40, 265);
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText(report.temperament, 160, 265);

    ctx.fillStyle = "#fafaf9";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(t.zones, 40, 310);

    const intellectual = report.zones.intellectual.score;
    const emotional = report.zones.emotional.score;
    const instinctive = report.zones.instinctive.score;

    const drawProgressBar = (label: string, value: number, y: number, color: string) => {
      ctx.fillStyle = "#a8a29e";
      ctx.font = "11px sans-serif";
      ctx.fillText(label, 40, y);

      ctx.fillStyle = "#1c1917";
      ctx.fillRect(190, y - 10, 140, 12);

      ctx.fillStyle = color;
      ctx.fillRect(190, y - 10, (value / 100) * 140, 12);

      ctx.fillStyle = "#fafaf9";
      ctx.font = "bold 11px monospace";
      ctx.fillText(`${value}%`, 345, y);
    };

    drawProgressBar(t.intellectual, intellectual, 335, "#a78bfa");
    drawProgressBar(t.emotional, emotional, 360, "#f43f5e");
    drawProgressBar(t.instinctive, instinctive, 385, "#f59e0b");

    ctx.fillStyle = "#fafaf9";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(t.strengths, 40, 440);

    ctx.fillStyle = "#d6d3d1";
    ctx.font = "11px sans-serif";
    let sy = 465;
    report.strengths.slice(0, 3).forEach((str) => {
      ctx.fillText(`• ${str.substring(0, 52)}${str.length > 52 ? "..." : ""}`, 40, sy);
      sy += 22;
    });

    ctx.fillStyle = "#fafaf9";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(t.symmetry, 540, 430);

    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(600, 500, 45, -Math.PI / 2, (-Math.PI / 2) + (2 * Math.PI * (overallSymmetryVal / 100)));
    ctx.stroke();

    ctx.strokeStyle = "rgba(16, 185, 129, 0.1)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(600, 500, 45, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = "#10b981";
    ctx.font = "bold 24px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${overallSymmetryVal}%`, 600, 508);
    ctx.textAlign = "left";
  };

  if (imageSrc) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const boxX = 450;
      const boxY = 175;
      const boxW = 290;
      const boxH = 215;

      ctx.fillStyle = "#12100e";
      ctx.fillRect(boxX - 5, boxY - 5, boxW + 10, boxH + 10);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX - 5, boxY - 5, boxW + 10, boxH + 10);

      ctx.drawImage(img, boxX, boxY, boxW, boxH);
      drawDetails();
      triggerDownload();
    };
    img.onerror = () => {
      drawDetails();
      triggerDownload();
    };
    img.src = imageSrc;
  } else {
    drawDetails();
    triggerDownload();
  }

  function triggerDownload() {
    try {
      const pUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pUrl;
      a.download = `morphoface_analysis_${subjectName.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to export as image", err);
    }
  }
};

export default function App() {
  const { language, setLanguage, t } = useLanguage();

  // Dynamic Scan History list state - purely in-memory ("No guardar historial")
  const [scansList, setScansList] = useState<ScanOption[]>([]);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Blinking Visitor Counter State
  const [visitorCount, setVisitorCount] = useState<number>(() => {
    const baseVal = 124350;
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("morphoface-visitor-count-v1");
        if (stored) {
          return parseInt(stored, 10);
        }
        // Generate a slightly variation per timestamp so it looks dynamic
        const offset = Math.floor((Date.now() % 86400000) / 10000);
        const finalBase = baseVal + offset;
        sessionStorage.setItem("morphoface-visitor-count-v1", String(finalBase));
        return finalBase;
      } catch (_) {}
    }
    return baseVal;
  });

  // Share States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [shareSubjectName, setShareSubjectName] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [hasLoadedShared, setHasLoadedShared] = useState(false);
  const [shortId, setShortId] = useState<string | null>(null);
  const [isShortening, setIsShortening] = useState(false);
  const [shareLinkType, setShareLinkType] = useState<"branded" | "sandbox">("branded");
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [showMirrorGuide, setShowMirrorGuide] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(isAmbientMusicPlaying());
  const [isFaceViewerHovered, setIsFaceViewerHovered] = useState(false);

  const [customReport, setCustomReport] = useState<MorphoReport | null>(null);
  const [isFallbackActive, setIsFallbackActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [errorLog, setErrorLog] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Load first item from history if we have one and nothing active on mount
  useEffect(() => {
    if (scansList.length > 0 && !customReport && !hasLoadedShared) {
      setCustomReport(scansList[0].report);
      setImageSrc(scansList[0].img);
    }
  }, [scansList]);

  // Make visitor counter tick up in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount((prev) => {
        const next = prev + (Math.random() > 0.45 ? 1 : 0);
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem("morphoface-visitor-count-v1", String(next));
          } catch (_) {}
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Clear any persistent history on startup to satisfy "No guardar historial"
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("morphoface-scans-list-v1");
      } catch (_) {}
    }
  }, []);

  // Handle shared report URL parsing on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const sharedReportParam = params.get("sharedReport");
      
      if (sharedReportParam && !hasLoadedShared) {
        try {
          const decodedStr = decodeURIComponent(escape(atob(sharedReportParam)));
          const decodedReport = JSON.parse(decodedStr);
          if (decodedReport && decodedReport.faceShape) {
            setCustomReport(decodedReport);
            setIsFallbackActive(false);
            setHasLoadedShared(true);
            if (decodedReport.subjectName) {
              setShareSubjectName(decodedReport.subjectName);
            }
          }
        } catch (e) {
          console.error("Failed to decode shared report parameter", e);
        }
      }
    }
  }, [language]);

  // Trigger URL shortening dynamically when sharing modal is open or report changes
  useEffect(() => {
    if (!isShareModalOpen || !customReport) return;

    let active = true;
    const generateShortLink = async () => {
      setIsShortening(true);
      try {
        const currentLocalShare = shareTranslations[language] || shareTranslations["es"];
        const payload = {
          ...customReport,
          subjectName: shareSubjectName || currentLocalShare.defaultSubject
        };
        const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
        
        const response = await fetch("/api/shorten", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ payload: encoded })
        });
        
        const data = await response.json();
        if (active && data && data.success && data.id) {
          setShortId(data.id);
        }
      } catch (err) {
        console.error("Shortening link failed:", err);
      } finally {
        if (active) {
          setIsShortening(false);
        }
      }
    };

    generateShortLink();

    return () => {
      active = false;
    };
  }, [isShareModalOpen, customReport, shareSubjectName, language]);
  
  // Controls
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [agingYears, setAgingYears] = useState(0);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [activeTab, setActiveTab] = useState<"zones" | "features" | "timeline">("zones");
  
  // Interactive Simulator State (for educational play when no image is analyzed)
  const [simulatorMode, setSimulatorMode] = useState(false);
  const [simZones, setSimZones] = useState({
    intellectual: 70,
    emotional: 60,
    instinctive: 50
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync details on change
  useEffect(() => {
    if (!customReport) {
      setImageSrc(null);
      setSelectedLandmark(null);
    }
  }, [customReport]);

  const handleReset = () => {
    setCustomReport(null);
    setImageSrc(null);
    setSelectedLandmark(null);
    setErrorLog(null);
    setAgingYears(0);
    setIsFlipped(false);
  };

  // Convert uploaded file to base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string;
      const optimized = await resizeImageData(result, 1024);
      setImageSrc(optimized);
      analyzePhoto(optimized);
    };
    reader.onerror = () => {
      setErrorLog("No se pudo leer la imagen seleccionada. Inténtalo de nuevo.");
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop mechanics
  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    } else {
      setErrorLog("Sube un archivo de imagen válido (JPEG, PNG).");
    }
  };

  // Live capture result handler
  const handleCameraCapture = async (base64Img: string) => {
    const optimized = await resizeImageData(base64Img, 1024);
    setImageSrc(optimized);
    setIsCameraActive(false);
    analyzePhoto(optimized);
  };

  // Call the server-side proxy
  const analyzePhoto = async (base64Data: string) => {
    setAnalyzing(true);
    startScanningSound();
    setErrorLog(null);
    setCustomReport(null);
    setIsFallbackActive(false);

    try {
      const optimizedBase64 = await resizeImageData(base64Data, 1024);
      const thumbnailBase64 = await resizeImageData(optimizedBase64, 400);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: optimizedBase64, language }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || t("error_digitization") || "La digitalización facial devolvió un estado de error.");
      }

      setCustomReport(data.report);
      if (data.isFallback) {
        setIsFallbackActive(true);
      }
      
      const newScanItem: ScanOption = {
        id: Date.now().toString(),
        name: shareSubjectName || (language === "es" ? `Escaneo #${scansList.length + 1}` : language === "fr" ? `Analyse #${scansList.length + 1}` : `Scan #${scansList.length + 1}`),
        img: thumbnailBase64,
        report: data.report
      };
      const updatedList = [newScanItem, ...scansList].slice(0, 10);
      setScansList(updatedList);

    } catch (err: any) {
      console.error(err);
      setErrorLog(
        err.message || t("error_communication") || "Fallo en la comunicación con el servidor de IA de Louis Corman."
      );
      // Fallback: use current magnificent deterministic generator!
      setTimeout(async () => {
        const optimizedBase64 = await resizeImageData(base64Data, 1024);
        const thumbnailBase64 = await resizeImageData(optimizedBase64, 400);

        const fallbackReport = generateFallbackReport(language, optimizedBase64);
        setCustomReport(fallbackReport);
        setIsFallbackActive(true);

        const newScanItem: ScanOption = {
          id: Date.now().toString(),
          name: shareSubjectName || (language === "es" ? `Escaneo #${scansList.length + 1}` : language === "fr" ? `Analyse #${scansList.length + 1}` : `Scan #${scansList.length + 1}`),
          img: thumbnailBase64,
          report: fallbackReport
        };
        const updatedList = [newScanItem, ...scansList].slice(0, 10);
        setScansList(updatedList);
      }, 800);
    } finally {
      setAnalyzing(false);
      stopScanningSound();
    }
  };

  // Determine current active report
  const activeReport = customReport;

  // Real-time Facial Symmetry Calculator
  const getSymmetryResult = () => {
    if (!activeReport || !activeReport.landmarks) return null;
    
    const landmarks = activeReport.landmarks;
    const nose = landmarks.find(l => l.label === "Nose Tip");
    const chin = landmarks.find(l => l.label === "Chin Point");
    
    // Midline point
    const midX = (nose && chin) ? (nose.x + chin.x) / 2 : (nose ? nose.x : (chin ? chin.x : 50));
    
    const fhL = landmarks.find(l => l.label === "Forehead Left");
    const fhR = landmarks.find(l => l.label === "Forehead Right");
    const eyeL = landmarks.find(l => l.label === "Left Eye");
    const eyeR = landmarks.find(l => l.label === "Right Eye");
    const cheekL = landmarks.find(l => l.label === "Left Cheekbone");
    const cheekR = landmarks.find(l => l.label === "Right Cheekbone");
    const mouthL = landmarks.find(l => l.label === "Mouth Left");
    const mouthR = landmarks.find(l => l.label === "Mouth Right");
    
    const getPairSymmetry = (L: Landmark | undefined, R: Landmark | undefined) => {
      if (!L || !R) return { overall: 92, vertical: 94, horizontal: 90 };
      const leftDist = Math.abs(midX - L.x);
      const rightDist = Math.abs(R.x - midX);
      const widthDiff = Math.abs(leftDist - rightDist);
      const yDiff = Math.abs(L.y - R.y);
      
      const horizontal = Math.max(50, Math.min(100, 100 - (widthDiff * 6)));
      const vertical = Math.max(50, Math.min(100, 100 - (yDiff * 8)));
      const overall = Math.round((horizontal + vertical) / 2);
      return { overall, vertical: Math.round(vertical), horizontal: Math.round(horizontal) };
    };
    
    const forehead = getPairSymmetry(fhL, fhR);
    const eyes = getPairSymmetry(eyeL, eyeR);
    const cheekbones = getPairSymmetry(cheekL, cheekR);
    const mouth = getPairSymmetry(mouthL, mouthR);
    
    const overallSymmetry = Math.round((forehead.overall + eyes.overall + cheekbones.overall + mouth.overall) / 4);
    
    return {
      overallSymmetry,
      details: {
        forehead,
        eyes,
        cheekbones,
        mouth
      },
      midX
    };
  };
  
  const symmetryData = getSymmetryResult();

  const localShare = shareTranslations[language] || shareTranslations["es"];

  const handleCopyLink = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";
    let link = baseUrl;
    
    if (customReport) {
      if (shortId) {
        if (shareLinkType === "branded") {
          link = `https://morphoface.ai/scan/${shortId}`;
        } else {
          link = `${window.location.origin}/scan/${shortId}`;
        }
      } else {
        const payload = {
          ...customReport,
          subjectName: shareSubjectName || localShare.defaultSubject
        };
        try {
          const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
          link = `${baseUrl}?sharedReport=${encoded}`;
        } catch (err) {
          console.error("Failed to generate custom share link", err);
          link = baseUrl;
        }
      }
    }
    
    navigator.clipboard.writeText(link).then(() => {
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    }).catch(err => {
      console.error("Failed to write to clipboard", err);
    });
  };

  const handleDownloadPdf = () => {
    if (!activeReport) return;
    setIsGeneratingPdf(true);
    const subjectName = shareSubjectName || localShare.defaultSubject;
    
    setTimeout(() => {
      try {
        downloadPDFSummary(language, activeReport, subjectName);
      } catch (e) {
        console.error("PDF generation failed", e);
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 500); 
  };

  const handleExportPng = () => {
    if (!activeReport) return;
    const subjectName = shareSubjectName || localShare.defaultSubject;
    const currentSymmetryScore = symmetryData?.overallSymmetry ?? 85;
    exportReportAsPng(activeReport, imageSrc, subjectName, currentSymmetryScore, language);
  };

  const translateLandmarkLabel = (label: string): string => {
    const dict: Record<string, string> = {
      "Forehead Left": t("landmark_forehead_left"),
      "Forehead Right": t("landmark_forehead_right"),
      "Left Eye": t("landmark_left_eye"),
      "Right Eye": t("landmark_right_eye"),
      "Nose Tip": t("landmark_nose_tip"),
      "Left Cheekbone": t("landmark_left_cheekbone"),
      "Right Cheekbone": t("landmark_right_cheekbone"),
      "Mouth Left": t("landmark_mouth_left"),
      "Mouth Right": t("landmark_mouth_right"),
      "Chin Point": t("landmark_chin_point"),
    };
    return dict[label] || label;
  };

  // Get active landmark interpretation depending on what is clicked
  const getLandmarkExplanation = (label: string) => {
    const key = label.toLowerCase();
    
    if (language === "en") {
      if (key.includes("forehead")) {
        return {
          title: "Intellectual Sector (The Forehead)",
          desc: "In Morphopsychology, the forehead and the upper temple area control idea representation, conceptual imagination, and rational capability. A high forehead prioritizes principles and abstract concepts, whereas a sloped forehead indicates practicality and instant intuition.",
          quote: "Louis Corman: 'The bony frame of the forehead determines intrinsic intellectual power.'"
        };
      }
      if (key.includes("eye")) {
        return {
          title: "Eye Receivers (The Eyes)",
          desc: "Eyes are primary cognitive receptors. Large, exposed eyes indicate direct openness and great receptivity to environmental influences. Sunken or protected eyes with toned eyelids show analytical selectivity and caution before committing.",
          quote: "Represents visual filtration and understanding speed."
        };
      }
      if (key.includes("nose") || key.includes("cheekbone")) {
        return {
          title: "Affective Receivers (Nose and Cheekbones)",
          desc: "The middle zone governs emotional life and social interactions. Wide cheekbones serve as relational support. The nose bridge is the emotional defense filter: a pronounced nose acts as a shield, while a short nose facilitates open sharing.",
          quote: "Regulator of empathy, pride, sympathy, and personal defense."
        };
      }
      if (key.includes("mouth") || key.includes("chin") || key.includes("jaw")) {
        return {
          title: "Vital Receivers (Mouth, Jaw, and Chin)",
          desc: "The lower base symbolizes material assimilation, physical execution, earthly instincts, and bodily endurance. A broad jaw indicates execution power. Fleshy lips denote appetite for communication, while thin lips show selective rigor.",
          quote: "Handles material action, physical willpower, and perseverance."
        };
      }
    } else if (language === "fr") {
      if (key.includes("forehead")) {
        return {
          title: "Secteur Intellectuel (Le Front)",
          desc: "En Morphopsychologie, le front et la partie supérieure des tempes contrôlent l'idéation, l'imagination conceptuelle et la capacité rationnelle. Un front haut privilégie les principes et théories de l'esprit, tandis qu'un front incliné penche vers le pragmatisme.",
          quote: "Louis Corman : 'Le cadre osseux du front détermine la puissance intellectuelle intrinsèque.'"
        };
      }
      if (key.includes("eye")) {
        return {
          title: "Récepteurs Oculaires (Les Yeux)",
          desc: "Les yeux sont les récepteurs cognitifs primaires. De grands yeux ouverts indiquent une réceptivité directe aux stimuli. Des yeux enfoncés ou protégés par des paupières toniques révèlent de la prudence analytique.",
          quote: "Représente le filtrage visuel et la vitesse de compréhension."
        };
      }
      if (key.includes("nose") || key.includes("cheekbone")) {
        return {
          title: "Récepteurs Affectifs (Nez et Pommettes)",
          desc: "La zone médiane régit la vie émotionnelle et les relations sociales. Les pommettes larges forment l'appui de l'échange. L'arête du nez est le filtre de défense affectif : un nez long agit comme bouclier, un nez court facilite l'accueil.",
          quote: "Régulateur de l'empathie, de la fierté, de la sympathie et du bouclier personnel."
        };
      }
      if (key.includes("mouth") || key.includes("chin") || key.includes("jaw")) {
        return {
          title: "Récepteurs Vitaux (Bouche, Mâchoire et Menton)",
          desc: "La base inférieure symbolise l'action matérielle, la volonté physique et les instincts. Une mâchoire large indique la puissance d'accomplissement. Des lèvres charnues dénotent l'appétit d'échange, des lèvres fines montrent de la réserve.",
          quote: "Gouverneur de l'action matérielle, de la force physique et de la persévérance."
        };
      }
    } else {
      // default: Spanish
      if (key.includes("forehead")) {
        return {
          title: "Sector Intelectual (La Frente)",
          desc: "En Morfopsicología, la frente y la parte superior de las sienes controlan la ideación, imaginación conceptual y la capacidad racional. Una frente alta prioriza principios y conceptos abstractos, mientras que una frente inclinada inclina a la practicidad e intuición instantánea.",
          quote: "Louis Corman: 'El marco óseo de la frente determina la potencia intelectual intrínseca.'"
        };
      }
      if (key.includes("eye")) {
        return {
          title: "Receptores Oculares (Los Ojos)",
          desc: "Los ojos son receptores cognitivos primarios. Ojos grandes y expuestos indican una apertura directa y gran receptividad a las influencias del entorno. Ojos hundidos o protegidos por párpados tonificados muestran selectividad analítica y cautela antes de comprometerse.",
          quote: "Representa el filtrado visual y la velocidad de comprensión."
        };
      }
      if (key.includes("nose") || key.includes("cheekbone")) {
        return {
          title: "Receptores Afectivos (Nariz y Pómulos)",
          desc: "La zona media rige la vida emocional y las interacciones sociales. Los pómulos anchos asumen el soporte relacional. El tabique de la nariz es el filtro de defensa emocional: una nariz pronunciada actúa como escudo, mientras que una nariz corta facilita el intercambio abierto.",
          quote: "Regulador de la empatía, el orgullo, la simpatía y el escudo personal."
        };
      }
      if (key.includes("mouth") || key.includes("chin") || key.includes("jaw")) {
        return {
          title: "Receptores Vitales (Boca, Mandíbula y Mentón)",
          desc: "La base inferior simboliza la asimilación material, la ejecución física, los instintos terrenales y la resistencia corporal. Una mandíbula ancha indica potencia realizadora. Labios carnosos denotan apetito de comunicación y vulnerabilidad afectiva, labios finos representan rigor selectivo.",
          quote: "Maneja la acción material, la fuerza de voluntad física y la perseverancia."
        };
      }
    }

    return {
      title: label,
      desc: language === "fr" ? "Zone anatomique importante pour l'équilibre morphologique général." : language === "en" ? "Important anatomical zone for general morphological balance." : "Zona anatómica relevante para el equilibrio fisiognómico general y la adaptabilidad ambiental.",
      quote: language === "fr" ? "Étude interactive." : language === "en" ? "Interactive study." : "Estudio interactivo de proporciones."
    };
  };

  // Calculate dominant zone based on report
  const zoneScores = activeReport?.zones;
  const intellectualScore = zoneScores?.intellectual.score ?? 0;
  const emotionalScore = zoneScores?.emotional.score ?? 0;
  const instinctiveScore = zoneScores?.instinctive.score ?? 0;

  let highestZone = "intellectual";
  let maxScore = intellectualScore;
  if (emotionalScore > maxScore) {
    highestZone = "emotional";
    maxScore = emotionalScore;
  }
  if (instinctiveScore > maxScore) {
    highestZone = "instinctive";
  }

  const getZoneColorClass = (zoneName: string) => {
    switch (zoneName) {
      case "intellectual": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "emotional": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      case "instinctive": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      default: return "text-stone-400 bg-stone-500/10 border-stone-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950" id="main-app-root">
      
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" id="bg-glow-1" />
      <div className="absolute top-[40%] right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" id="bg-glow-2" />

      {/* Modern Header navbar */}
      <header className="border-b border-stone-900 bg-stone-950/80 backdrop-blur-md sticky top-0 z-30" id="header-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Sparkles className="w-5 h-5 text-stone-950 animate-pulse" id="header-sparkles-icon" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight font-sans text-stone-50 bg-gradient-to-r from-stone-50 via-amber-200 to-stone-50 bg-clip-text text-transparent" id="app-brand-name">
                MORPHOFACE
              </h1>
              <p className="text-[10px] text-stone-400 font-mono tracking-widest uppercase" id="app-brand-tagline">
                {t("app_tagline")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSimulatorMode(!simulatorMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-300 ${
                simulatorMode 
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                  : "bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700"
              }`}
              id="simulator-btn-toggle"
              title="Toggle Sandbox Simulator"
            >
              <Settings className="w-3.5 h-3.5 animate-spin-slow" />
              <span>{simulatorMode ? t("sim_mode") : t("sim_zones")}</span>
            </button>

            <button
              onClick={() => setIsCompareMode(!isCompareMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-300 ${
                isCompareMode 
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                  : "bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700"
              }`}
              id="compare-btn-toggle"
              title="Toggle Geometrical Comparer"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>{language === "fr" ? "Comparer" : language === "en" ? "Compare" : "Comparar"}</span>
            </button>
            <span className="h-6 w-px bg-stone-800 animate-pulse" />
            <div className="relative group" id="locale-dropdown-wrapper">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "es" | "en" | "fr")}
                className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 hover:border-stone-700 hover:text-amber-400 px-3 py-1.5 rounded-lg text-xs font-mono text-stone-300 font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer transition-all appearance-none pr-8 select-none"
                id="locale-selector"
                title="Select Language"
              >
                <option value="es" className="bg-stone-950 text-stone-200">🇪🇸 Español</option>
                <option value="en" className="bg-stone-950 text-stone-200">🇺🇸 English</option>
                <option value="fr" className="bg-stone-950 text-stone-200">🇫🇷 Français</option>
              </select>
              <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-stone-400 group-hover:text-amber-400 transition-colors">
                <Languages className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Background Soundtrack Controller */}
            <button
              onClick={() => {
                const playing = toggleAmbientMusic();
                setIsMusicPlaying(playing);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-300 ${
                isMusicPlaying
                  ? "bg-amber-500/15 border-amber-400/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)] font-bold"
                  : "bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700"
              }`}
              id="soundtrack-toggle"
              title={language === "fr" ? "Musique douce de fond (ON/OFF)" : language === "en" ? "Soft background music (ON/OFF)" : "Música de fondo relajante (Activar/Desactivar)"}
            >
              {isMusicPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span className="flex items-center gap-1.5">
                    {language === "fr" ? "Musique" : language === "en" ? "Ambient" : "Música"}
                    <span className="flex gap-[1.5px] items-end h-2 w-2.5 overflow-hidden">
                      <span className="w-[1.5px] h-full bg-amber-400 animate-[bounce_0.8s_infinite] origin-bottom" style={{ animationDelay: '0.1s' }} />
                      <span className="w-[1.5px] h-3/4 bg-amber-400 animate-[bounce_0.6s_infinite] origin-bottom" style={{ animationDelay: '0.3s' }} />
                      <span className="w-[1.5px] h-2/4 bg-amber-400 animate-[bounce_0.9s_infinite] origin-bottom" style={{ animationDelay: '0s' }} />
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-stone-500" />
                  <span>{language === "fr" ? "Silencieux" : language === "en" ? "Silent" : "Silencio"}</span>
                </>
              )}
            </button>

            {/* Elegant Support / Donation Button */}
            <a
              href="https://mpago.la/1LHyBwV"
              target="_blank"
              referrerPolicy="no-referrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-300 bg-red-500/10 border-red-500/20 text-red-400 hover:text-red-300 hover:border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.1)] hover:shadow-[0_0_18px_rgba(239,68,68,0.25)] cursor-pointer"
              id="support-site-btn"
              title={language === "fr" ? "Soutenir le site" : language === "en" ? "Support the site" : "Apoyar el mantenimiento del sitio"}
            >
              <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400/20 animate-pulse" />
              <span className="font-bold">{language === "fr" ? "Soutenir" : language === "en" ? "Support" : "Colaboración voluntaria"}</span>
            </a>
          </div>

        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="primary-layout">
        
        {/* Welcome Pitch Board */}
        <div className="bg-gradient-to-r from-stone-900/60 to-stone-950 border border-stone-900 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-xl" id="pitch-banner">
          <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              <span>Louis Corman Model v2.4</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-100" id="pitch-heading">
              {t("pitch_title")}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed" id="pitch-desc">
              {t("pitch_desc")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0 w-full md:w-auto" id="pitch-action-pills">
            <button
              onClick={() => {
                setIsCameraActive(true);
                setCustomReport(null);
                setSelectedLandmark(null);
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-xs tracking-wide cursor-pointer"
              id="start-camera-trigger"
            >
              <Camera className="w-4 h-4 fill-stone-950" />
              {t("start_camera")}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              id="upload-file-trigger"
            >
              <Upload className="w-4 h-4" />
              {t("upload_photo")}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
              id="hidden-file-input"
            />
          </div>
        </div>

        {/* Error notification bar if API fails */}
        {errorLog && (
          <div className="bg-amber-955/20 border border-amber-900/40 p-4 rounded-xl flex items-start gap-3 text-stone-200 text-xs sm:text-sm" id="error-notification-banner">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-stone-100">{t("limited_remote")}</p>
              <p>{errorLog}</p>
              <p className="text-[10px] text-stone-400">{t("high_demand_msg")}</p>
            </div>
            <button 
              onClick={() => setErrorLog(null)} 
              className="ml-auto text-stone-405 hover:text-stone-205 transition-colors p-1"
              id="dismiss-error-btn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Interactive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="interactive-workspace-row">
          
          {/* Left Block (Scanning Desk & Profile Selector) - Occupies 5 span */}
          <section className="lg:col-span-5 space-y-6" id="scanning-desk-section">
            
            {/* Live Camera View Overlay container */}
            {isCameraActive ? (
              <CameraCapture
                onCapture={handleCameraCapture}
                onCancel={() => setIsCameraActive(false)}
              />
            ) : (
              <div 
                className={`relative border-2 rounded-2xl overflow-hidden bg-stone-900/30 backdrop-blur-sm p-4 flex flex-col items-center transition-all duration-300 ${
                  isDragging ? "border-amber-550 bg-stone-900/50" : "border-stone-850"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                id="interactive-image-canvas-card"
              >
                
                 {/* Visual Header in Canvas Card */}
                <div className="w-full flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${customReport ? (isFallbackActive ? "bg-amber-500 animate-pulse" : "bg-emerald-500 animate-ping") : "bg-stone-700 animate-pulse"}`} />
                    <span className="text-[10px] font-mono text-stone-400">
                      {customReport 
                        ? (isFallbackActive ? t("local_metric_active") : t("image_analyzed_gemini")) 
                        : (language === "es" ? "ESCÁNER EN ESPERA" : language === "fr" ? "ATTENTE DE PORTRAIT" : "SCANNER WAITING")}
                    </span>
                  </div>
                  {customReport && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const nextAge = agingYears > 0 ? 0 : 30;
                          setAgingYears(nextAge);
                          playAgingSliderChangeSound(nextAge);
                        }}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md border flex items-center gap-1 cursor-pointer transition-all duration-300 ${
                          agingYears > 0 
                            ? "bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-md shadow-amber-500/10 animate-pulse" 
                            : "bg-stone-900 text-stone-300 border-stone-800 hover:text-amber-400 hover:border-amber-400/30"
                        }`}
                        id="toggle-aging-filter-mode-btn"
                      >
                        <Hourglass className={`w-3 h-3 ${agingYears > 0 ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                        <span>{agingTranslations[language].buttonLabel}</span>
                      </button>
                      <button
                        onClick={handleReset}
                        className="text-[10px] font-mono text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 cursor-pointer"
                        id="reset-to-demo-btn"
                      >
                        {language === "fr" ? "Effacer" : language === "en" ? "Clear" : "Borrar"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub-workspace image viewer with hotspots overlay */}
                <div 
                  className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-950 border border-stone-800 shadow-inner group" 
                  id="face-image-viewer-frame"
                  onMouseEnter={() => setIsFaceViewerHovered(true)}
                  onMouseLeave={() => setIsFaceViewerHovered(false)}
                >
                  {analyzing && (
                    <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 z-20" id="analyzing-blocker">
                      <div className="relative w-16 h-16" id="spinning-loader-graphic">
                        <div className="absolute inset-0 border-4 border-amber-500/10 rounded-full" />
                        <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-sm font-bold text-stone-200">{t("analyzing_title")}</p>
                        <p className="text-[10px] text-stone-400 font-mono">{t("analyzing_subtitle")}</p>
                      </div>
                    </div>
                  )}

                  {/* Render the subject frame */}
                  {imageSrc ? (
                    <div className="relative w-full h-full">
                      {/* Manual Flip Icon Button */}
                      {!analyzing && (
                        <button
                          onClick={() => setIsFlipped(prev => !prev)}
                          className="absolute top-3 right-3 z-30 flex items-center justify-center p-2 rounded-lg bg-stone-950/80 border border-stone-800 text-stone-300 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-300 shadow-lg cursor-pointer group/flip-btn animate-fade-in"
                          id="manual-flip-toggle-btn"
                          title={language === "es" ? "Girar rostro (Asimetría)" : language === "fr" ? "Retourner (Asymétrie)" : "Flip face view"}
                        >
                          <RefreshCw className={`w-3.5 h-3.5 transition-transform duration-500 ${isFlipped ? "rotate-180 text-amber-400 animate-pulse" : "text-stone-400"}`} />
                        </button>
                      )}

                      <div className="absolute inset-0 w-full h-full [perspective:1000px]" id="loaded-subject-img-perspective">
                        <div 
                          className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
                            isFlipped ? "[transform:rotateY(180deg)]" : "group-hover:[transform:rotateY(180deg)]"
                          }`} 
                          id="loaded-subject-img-3d-card"
                        >
                          
                          {/* Front Side: Normal View */}
                          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:translateZ(0px)]" id="loaded-subject-img-front">
                            <img
                              src={imageSrc}
                              alt="Rostro analizado"
                              className={`w-full h-full object-cover select-none transition-all duration-300 ${
                                agingYears === 0 
                                  ? "saturate-100 contrast-100 brightness-100 grayscale-0"
                                  : agingYears === 15
                                    ? "saturate-[85%] contrast-105 brightness-95 grayscale-[10%]"
                                    : agingYears === 30
                                      ? "saturate-[70%] contrast-110 brightness-90 grayscale-[25%]"
                                      : agingYears === 45
                                        ? "saturate-[55%] contrast-115 brightness-85 grayscale-[40%] sepia-[10%]"
                                        : "saturate-[40%] contrast-120 brightness-80 grayscale-[55%] sepia-[20%]"
                              }`}
                              id="loaded-subject-img"
                            />
                            
                            {/* Visual Hint Badge */}
                            <div className="absolute bottom-3 left-3 bg-stone-950/85 backdrop-blur border border-stone-800 text-stone-300 font-mono text-[9px] font-bold px-2 py-1 rounded-md shadow-lg pointer-events-none select-none z-10 flex items-center gap-1.5 transition-all duration-300 group-hover:opacity-0" id="normal-view-indicator-badge">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>{language === "es" ? "Vista Normal" : language === "fr" ? "Vue Normale" : "Normal View"}</span>
                              <span className="text-stone-500 text-[8px] font-sans">
                                {language === "es" ? "(Pasa el cursor)" : language === "fr" ? "(Survoler)" : "(Hover to Flip)"}
                              </span>
                            </div>
                          </div>

                          {/* Back Side: Mirrored View */}
                          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(0px)]" id="loaded-subject-img-back">
                            <img
                              src={imageSrc}
                              alt="Rostro analizado espejado"
                              className={`w-full h-full object-cover select-none scale-x-[-1] transition-all duration-300 ${
                                agingYears === 0 
                                  ? "saturate-100 contrast-100 brightness-100 grayscale-0"
                                  : agingYears === 15
                                    ? "saturate-[85%] contrast-105 brightness-95 grayscale-[10%]"
                                    : agingYears === 30
                                      ? "saturate-[70%] contrast-110 brightness-90 grayscale-[25%]"
                                      : agingYears === 45
                                        ? "saturate-[55%] contrast-115 brightness-85 grayscale-[40%] sepia-[10%]"
                                        : "saturate-[40%] contrast-120 brightness-80 grayscale-[55%] sepia-[20%]"
                              }`}
                              id="loaded-subject-img-mirrored"
                            />
                            
                            {/* Label Indicator for Mirrored View (rotated back so it's readable) */}
                            <div className="absolute bottom-3 right-3 bg-amber-500/90 backdrop-blur border border-amber-600/50 text-stone-950 font-mono text-[10px] font-black px-2 py-1 rounded-md shadow-lg pointer-events-none select-none z-10 [transform:rotateY(180deg)] flex items-center gap-1.5" id="mirrored-view-indicator-badge">
                              <span className="w-1.5 h-1.5 rounded-full bg-stone-950 animate-pulse" />
                              <span>{language === "es" ? "Vista Espejada (Asimetría Natural)" : language === "fr" ? "Vue Miroir (Asymétrie Naturelle)" : "Mirrored View (Natural Asymmetry)"}</span>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* MIRROR IMAGE ALIGNMENT OVERLAY */}
                      {showMirrorGuide && (
                        <div className="absolute inset-0 z-10 pointer-events-none select-none" id="mirror-guide-overlay-wrapper">
                          <div className="absolute inset-0 flex">
                            {/* Left side: normal */}
                            <div className="w-1/2 h-full overflow-hidden relative">
                              <img
                                src={imageSrc}
                                alt="Left Normal"
                                className="absolute top-0 left-0 w-[200%] h-full object-cover max-w-none"
                              />
                            </div>
                            {/* Right side: mirrored copy of the left side */}
                            <div className="w-1/2 h-full overflow-hidden relative scale-x-[-1]">
                              <img
                                src={imageSrc}
                                alt="Left Mirrored"
                                className="absolute top-0 left-0 w-[200%] h-full object-cover max-w-none"
                              />
                            </div>
                          </div>

                          {/* Dotted Centerline alignment indicator */}
                          <div 
                            className="absolute inset-y-0 w-px border-l-2 border-dashed border-amber-500 z-20 shadow-[0_0_8px_rgba(245,158,11,0.6)]" 
                            style={{ left: `${symmetryData?.midX ?? 50}%` }}
                          />
                          <div 
                            className="absolute top-2 -translate-x-1/2 bg-amber-500 text-stone-950 font-mono text-[8px] font-black px-1.5 py-0.5 rounded shadow z-30"
                            style={{ left: `${symmetryData?.midX ?? 50}%` }}
                          >
                            MIDLINE
                          </div>
                        </div>
                      )}

                      {/* SVG BIOMETRIC AGING OVERLAY */}
                      {!analyzing && agingYears > 0 && activeReport?.landmarks && (
                        <svg 
                          viewBox="0 0 100 100" 
                          className="absolute inset-0 w-full h-full pointer-events-none z-10 select-none"
                          id="biometric-aging-svg-overlay"
                        >
                          <defs>
                            <filter id="soft-wrinkle-blur" x="-20%" y="-20%" width="140%" height="140%">
                              <feGaussianBlur stdDeviation="0.4" />
                            </filter>
                          </defs>
                          {(() => {
                            const fhL = activeReport.landmarks.find(l => l.label === "Forehead Left");
                            const fhR = activeReport.landmarks.find(l => l.label === "Forehead Right");
                            const eyeL = activeReport.landmarks.find(l => l.label === "Left Eye");
                            const eyeR = activeReport.landmarks.find(l => l.label === "Right Eye");
                            const nose = activeReport.landmarks.find(l => l.label === "Nose Tip");
                            const cheekL = activeReport.landmarks.find(l => l.label === "Left Cheekbone");
                            const cheekR = activeReport.landmarks.find(l => l.label === "Right Cheekbone");
                            const mouthL = activeReport.landmarks.find(l => l.label === "Mouth Left");
                            const mouthR = activeReport.landmarks.find(l => l.label === "Mouth Right");
                            const chin = activeReport.landmarks.find(l => l.label === "Chin Point");

                            const opacity = (agingYears / 60) * 0.7; // From 0 to 0.70
                            const strokeWidth = (0.35 + (agingYears / 60) * 0.35).toFixed(2);
                            const strokeColor = "#3b2314"; // deep rich brown

                            return (
                              <g filter="url(#soft-wrinkle-blur)" opacity={opacity} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none">
                                {/* 1. Forehead Creases */}
                                {fhL && fhR && (
                                  <>
                                    <path d={`M ${fhL.x} ${fhL.y} Q ${(fhL.x + fhR.x)/2} ${(fhL.y + fhR.y)/2 - 1.5} ${fhR.x} ${fhR.y}`} />
                                    <path d={`M ${fhL.x} ${fhL.y + 4} Q ${(fhL.x + fhR.x)/2} ${(fhL.y + fhR.y)/2 + 2} ${fhR.x} ${fhR.y + 4}`} />
                                    {agingYears >= 45 && (
                                      <path d={`M ${fhL.x + 2} ${fhL.y + 8} Q ${(fhL.x + fhR.x)/2} ${(fhL.y + fhR.y)/2 + 6} ${fhR.x - 2} ${fhR.y + 8}`} />
                                    )}
                                  </>
                                )}

                                {/* 2. Crow's Feet Left Eye */}
                                {eyeL && (
                                  <>
                                    <path d={`M ${eyeL.x - 1} ${eyeL.y} L ${eyeL.x - 5.5} ${eyeL.y - 1}`} />
                                    <path d={`M ${eyeL.x - 1.5} ${eyeL.y + 0.5} L ${eyeL.x - 6.5} ${eyeL.y + 1}`} />
                                    <path d={`M ${eyeL.x - 1} ${eyeL.y + 1} L ${eyeL.x - 5.5} ${eyeL.y + 3}`} />
                                  </>
                                )}

                                {/* 3. Crow's Feet Right Eye */}
                                {eyeR && (
                                  <>
                                    <path d={`M ${eyeR.x + 1} ${eyeR.y} L ${eyeR.x + 5.5} ${eyeR.y - 1}`} />
                                    <path d={`M ${eyeR.x + 1.5} ${eyeR.y + 0.5} L ${eyeR.x + 6.5} ${eyeR.y + 1}`} />
                                    <path d={`M ${eyeR.x + 1} ${eyeR.y + 1} L ${eyeR.x + 5.5} ${eyeR.y + 3}`} />
                                  </>
                                )}

                                {/* 4. Under-Eye Sags */}
                                {eyeL && (
                                  <path d={`M ${eyeL.x - 3} ${eyeL.y + 2.5} Q ${eyeL.x} ${eyeL.y + 4.5} ${eyeL.x + 3} ${eyeL.y + 2.5}`} />
                                )}
                                {eyeR && (
                                  <path d={`M ${eyeR.x - 3} ${eyeR.y + 2.5} Q ${eyeR.x} ${eyeR.y + 4.5} ${eyeR.x + 3} ${eyeR.y + 2.5}`} />
                                )}

                                {/* 5. Nasolabial folds */}
                                {nose && mouthL && mouthR && (
                                  <>
                                    <path d={`M ${nose.x - 2} ${nose.y + 1.5} Q ${(nose.x + mouthL.x)/2 - 1.5} ${(nose.y + mouthL.y)/2} ${mouthL.x - 1.5} ${mouthL.y - 1}`} />
                                    <path d={`M ${nose.x + 2} ${nose.y + 1.5} Q ${(nose.x + mouthR.x)/2 + 1.5} ${(nose.y + mouthR.y)/2} ${mouthR.x + 1.5} ${mouthR.y - 1}`} />
                                  </>
                                )}

                                {/* 6. Marionette Lines */}
                                {mouthL && mouthR && chin && (
                                  <>
                                    <path d={`M ${mouthL.x} ${mouthL.y + 0.5} Q ${mouthL.x - 1.5} ${(mouthL.y + chin.y)/2} ${chin.x - 2.5} ${chin.y - 1.5}`} />
                                    <path d={`M ${mouthR.x} ${mouthR.y + 0.5} Q ${mouthR.x + 1.5} ${(mouthR.y + chin.y)/2} ${chin.x + 2.5} ${chin.y - 1.5}`} />
                                  </>
                                )}

                                {/* 7. Double-chin / Chin crease */}
                                {chin && (
                                  <path d={`M ${chin.x - 5} ${chin.y + 2} Q ${chin.x} ${chin.y + 4.5} ${chin.x + 5} ${chin.y + 2}`} />
                                )}
                              </g>
                            );
                          })()}
                        </svg>
                      )}
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-stone-950 text-stone-500 hover:text-amber-400 transition-all duration-500 p-6 text-center space-y-4 cursor-pointer group" 
                      id="blank-viewer-fallback"
                    >
                      {/* Interactive Biometric Face Alignment Blueprint SVG */}
                      <div className="relative w-48 h-48 flex items-center justify-center" id="standby-biometric-blueprint-container">
                        <div className="absolute -inset-6 bg-amber-500/5 rounded-full blur-2xl animate-pulse duration-[4000ms]" />
                        
                        <svg viewBox="0 0 200 200" className="w-full h-full text-stone-800 group-hover:text-amber-500/25 transition-colors duration-700 relative z-10" id="morphoface-blueprint-svg">
                          {/* Outer sacred geometry / radar grids */}
                          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 5" className="opacity-40 animate-[spin_120s_linear_infinite]" />
                          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" className="opacity-30" />
                          <circle cx="100" cy="100" r="54" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-20" />
                          
                          {/* Sacred geometrical alignment star frame */}
                          <path d="M 100 12 L 188 100 L 100 188 L 12 100 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-15" />
                          <path d="M 38 38 L 162 38 L 162 162 L 38 162 Z" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-10" />

                          {/* Axis guides and face measurements */}
                          <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="0.75" strokeDasharray="2 2" className="animate-pulse" />
                          <line x1="25" y1="88" x2="175" y2="88" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="0.75" />
                          <line x1="38" y1="126" x2="162" y2="126" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="0.5" />

                          {/* Outer Head Silhouette */}
                          <path 
                            d="M 100 32 C 54 32, 44 70, 44 98 C 44 126, 58 158, 100 174 C 142 174, 156 126, 156 98 C 156 70, 146 32, 100 32 Z" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="1.25" 
                            className="group-hover:stroke-amber-500/45 transition-colors duration-700" 
                          />

                          {/* Left and Right Ears */}
                          <path d="M 44 86 C 36 86, 36 110, 44 110" fill="none" stroke="currentColor" strokeWidth="0.75" className="opacity-40" />
                          <path d="M 156 86 C 164 86, 164 110, 156 110" fill="none" stroke="currentColor" strokeWidth="0.75" className="opacity-40" />

                          {/* Eyebrows contour */}
                          <path d="M 60 74 Q 74 67 85 73" fill="none" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="1" />
                          <path d="M 140 74 Q 126 67 115 73" fill="none" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="1" />

                          {/* Eyeball coordinates mapping */}
                          <circle cx="72" cy="88" r="4.5" fill="none" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="0.75" />
                          <circle cx="128" cy="88" r="4.5" fill="none" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="0.75" />
                          <circle cx="72" cy="88" r="1" fill="#f59e0b" className="opacity-80" />
                          <circle cx="128" cy="88" r="1" fill="#f59e0b" className="opacity-80" />

                          {/* Triangular nose zone line mapping */}
                          <path d="M 100 74 L 100 114 Q 100 120 106 118" fill="none" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="1" />

                          {/* Mouth guidelines */}
                          <path d="M 84 138 Q 100 144 116 138" fill="none" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1" />
                          <path d="M 88 138 Q 100 133 112 138" fill="none" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="0.75" />

                          {/* Glowing pulsing laser nodes on primary biometric receiver targets */}
                          <circle cx="100" cy="48" r="3" fill="#f59e0b" className="animate-ping" style={{ animationDuration: '3s' }} />
                          <circle cx="100" cy="48" r="1.5" fill="#f59e0b" />

                          <circle cx="72" cy="88" r="3" fill="#f59e0b" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                          <circle cx="128" cy="88" r="3" fill="#f59e0b" className="animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.4s' }} />

                          <circle cx="100" cy="116" r="3" fill="#f59e0b" className="animate-ping" style={{ animationDuration: '2s', animationDelay: '0.8s' }} />
                          <circle cx="100" cy="116" r="1.5" fill="#f59e0b" />

                          <circle cx="100" cy="162" r="3" fill="#f59e0b" className="animate-ping" style={{ animationDuration: '3.5s', animationDelay: '1.2s' }} />
                          <circle cx="100" cy="162" r="1.5" fill="#f59e0b" />

                          {/* Peripheral alignment pins */}
                          <circle cx="56" cy="112" r="2" fill="rgba(245, 158, 11, 0.5)" />
                          <circle cx="144" cy="112" r="2" fill="rgba(245, 158, 11, 0.5)" />
                        </svg>
                      </div>

                      <div className="space-y-2 relative z-10">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono font-bold text-amber-500 animate-pulse uppercase tracking-widest">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                          {language === "es" ? "ESCÁNER EN ESPERA" : language === "fr" ? "ATTENTE PORTRAIT" : "STANDBY ACTIVE"}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-300 group-hover:text-amber-400 transition-colors">
                            {language === "es" ? "Arrastra tu foto aquí o haz clic para subir" : language === "fr" ? "Glissez votre photo ici ou cliquez pour téléverser" : "Drag your portrait here or click to upload"}
                          </p>
                          <p className="text-[10px] text-stone-600 font-mono">
                            {language === "es" ? "Soporta JPG, PNG • Seguro & Confidencial" : language === "fr" ? "Supporte JPG, PNG • Sûr & Confidentiel" : "Supports JPG, PNG • Secure & Confidential"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LASER SCAN BAR LINE EFFECT WHEN ANALYZING */}
                  {analyzing && (
                    <motion.div
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute left-0 right-0 h-0.5 bg-amber-500 shadow-[0_0_12px_#f59e0b] pointer-events-none z-10"
                      id="analyzing-laser-beam"
                    />
                  )}

                  {/* INTERACTIVE LANDMARK DOTS OVERLAY */}
                  {!analyzing && agingYears === 0 && activeReport?.landmarks && activeReport.landmarks.length > 0 && (
                    <div className="absolute inset-0 pointer-events-auto" id="landmarks-overlay-container">
                      {/* WIREFRAME SVG TRAILING LINE CONNECTIONS */}
                      {(() => {
                        const landmarksList = activeReport.landmarks;
                        const fhL = landmarksList.find(l => l.label === "Forehead Left");
                        const fhR = landmarksList.find(l => l.label === "Forehead Right");
                        const eyeL = landmarksList.find(l => l.label === "Left Eye");
                        const eyeR = landmarksList.find(l => l.label === "Right Eye");
                        const nose = landmarksList.find(l => l.label === "Nose Tip");
                        const cheekL = landmarksList.find(l => l.label === "Left Cheekbone");
                        const cheekR = landmarksList.find(l => l.label === "Right Cheekbone");
                        const mouthL = landmarksList.find(l => l.label === "Mouth Left");
                        const mouthR = landmarksList.find(l => l.label === "Mouth Right");
                        const chin = landmarksList.find(l => l.label === "Chin Point");

                        const connections = [
                          [fhL, fhR],
                          [fhL, eyeL], [fhR, eyeR],
                          [eyeL, eyeR],
                          [eyeL, cheekL], [eyeR, cheekR],
                          [eyeL, nose], [eyeR, nose],
                          [cheekL, nose], [cheekR, nose],
                          [cheekL, mouthL], [cheekR, mouthR],
                          [nose, mouthL], [nose, mouthR],
                          [mouthL, mouthR],
                          [mouthL, chin], [mouthR, chin],
                          [cheekL, chin], [cheekR, chin],
                          [fhL, cheekL], [fhR, cheekR]
                        ];

                        return (
                          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none z-0 select-none">
                            {connections.map(([p1, p2], idx) => {
                              if (!p1 || !p2) return null;
                              return (
                                <motion.line
                                  key={idx}
                                  x1={`${p1.x}%`}
                                  y1={`${p1.y}%`}
                                  x2={`${p2.x}%`}
                                  y2={`${p2.y}%`}
                                  initial={{ pathLength: 0, opacity: 0 }}
                                  animate={{ 
                                    pathLength: isFaceViewerHovered ? 1 : 0, 
                                    opacity: isFaceViewerHovered ? 0.65 : 0 
                                  }}
                                  transition={{ 
                                    duration: 0.9, 
                                    ease: "easeInOut",
                                    delay: isFaceViewerHovered ? idx * 0.03 : 0
                                  }}
                                  stroke="#f59e0b"
                                  strokeWidth="0.8"
                                  strokeDasharray="2 2"
                                  className="drop-shadow-[0_0_2px_rgba(245,158,11,0.5)]"
                                />
                              );
                            })}
                          </svg>
                        );
                      })()}

                      {activeReport.landmarks.map((mark, idx) => {
                        const isSelected = selectedLandmark?.label === mark.label;
                        return (
                          <button
                            key={`${mark.label}-${idx}`}
                            onClick={() => {
                              setSelectedLandmark(mark);
                              playHotspotTone(idx);
                            }}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 group/dot z-10"
                            style={{ left: `${mark.x}%`, top: `${mark.y}%` }}
                            id={`landmark-dot-${idx}`}
                            title={`Receptor: ${translateLandmarkLabel(mark.label)}`}
                          >
                            <motion.span 
                              className={`absolute inset-0 rounded-full opacity-60 ${
                                isSelected ? "bg-amber-400" : "bg-teal-400 group-hover/dot:bg-amber-400"
                              }`}
                              animate={{
                                scale: [1, 2.1, 1],
                                opacity: [0.6, 0.15, 0.6]
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: idx * 0.2
                              }}
                            />
                            <motion.span 
                              className={`relative block w-3.5 h-3.5 rounded-full border-2 border-stone-950 transition-all duration-300 shadow-${
                                isSelected ? "md bg-white scale-125" : "sm bg-teal-400 group-hover/dot:bg-amber-400 group-hover/dot:scale-110"
                              }`}
                              animate={{
                                scale: isSelected ? [1.25, 1.45, 1.25] : [1, 1.15, 1],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: idx * 0.2
                              }}
                            />
                            <span className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-stone-950/90 text-[8px] font-mono text-stone-300 rounded border border-stone-800 opacity-0 group-hover/dot:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none`}>
                              {translateLandmarkLabel(mark.label)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Info block about clicking points or Aging filter info when active */}
                {agingYears > 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full mt-3 bg-stone-900 border border-amber-500/30 rounded-xl p-4 space-y-4 shadow-xl shadow-amber-500/5 relative overflow-hidden"
                    id="aging-controls-dock"
                  >
                    {/* Glowing corner effect for AI vibe */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hourglass className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                        <h4 className="text-xs font-bold font-mono text-amber-400 uppercase tracking-widest">
                          {agingTranslations[language].title}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {agingYears === 0 ? agingTranslations[language].original : agingTranslations[language].yearsOffset.replace("{y}", String(agingYears))}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-400 leading-normal">
                      {agingTranslations[language].desc}
                    </p>

                    {/* RANGE SLIDER */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-stone-500 px-1">
                        <span>{agingTranslations[language].original}</span>
                        <span>+15</span>
                        <span>+30</span>
                        <span>+45</span>
                        <span>+60</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="60"
                        step="15"
                        value={agingYears}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setAgingYears(val);
                          playAgingSliderChangeSound(val);
                        }}
                        className="w-full h-1.5 bg-stone-850 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
                        id="aging-range-slider"
                      />
                    </div>

                    {/* PERSONALIZED AGING DIAGNOSAL REPORT CARD */}
                    {activeReport && (
                      <div className="bg-stone-950/60 border border-stone-850 p-3 rounded-lg space-y-1.5">
                        <div className="flex items-center gap-2 text-stone-200">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <h5 className="text-[11px] font-extrabold uppercase font-mono tracking-wider text-stone-300 text-left">
                            {activeReport.overallType === "Dilatado" 
                              ? agingTranslations[language].dilatado 
                              : activeReport.overallType === "Concentrado"
                                ? agingTranslations[language].concentrado 
                                : agingTranslations[language].mixto}
                          </h5>
                        </div>
                        <p className="text-[10.5px] text-stone-400 leading-relaxed font-sans text-left">
                          {activeReport.overallType === "Dilatado" 
                            ? agingTranslations[language].dilatadoText 
                            : activeReport.overallType === "Concentrado"
                              ? agingTranslations[language].concentradoText 
                              : agingTranslations[language].mixtoText}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="w-full mt-3 flex items-center justify-between text-stone-400 text-[10px] font-mono bg-stone-950/40 p-2.5 border border-stone-850 rounded-lg" id="hotspot-interaction-help">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-400 inline-block animate-pulse" />
                      <span>{t("pulse_green_dots")}</span>
                    </div>
                    <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                  </div>
                )}

              </div>
            )}

            {/* Dynamic Interactive Landmark Card detailed display */}
            <AnimatePresence mode="wait">
              {selectedLandmark && (
                <motion.div
                  key={`detail-${selectedLandmark.label}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-stone-900 border border-stone-800 rounded-xl p-4 overflow-hidden"
                  id="landmark-details-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-amber-400 font-bold tracking-wider uppercase">
                      {t("selected_detail_reading")}
                    </span>
                    <button
                      onClick={() => setSelectedLandmark(null)}
                      className="text-stone-400 hover:text-stone-200 cursor-pointer"
                      id="close-landmark-detail"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  {(() => {
                    const explObj = getLandmarkExplanation(selectedLandmark.label);
                    return (
                      <div className="space-y-2">
                        <h4 className="text-sm font-extrabold text-stone-100 flex items-center gap-2">
                          <Eye className="w-4 h-4 text-amber-500 shrink-0" />
                          {explObj.title} ({translateLandmarkLabel(selectedLandmark.label)})
                        </h4>
                        <p className="text-xs text-stone-300 leading-relaxed">
                          {explObj.desc}
                        </p>
                        <p className="text-[10px] italic text-stone-400 font-mono border-l border-amber-500/20 pl-2">
                          {explObj.quote}
                        </p>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scans History Card Panel */}
            {scansList.length > 0 && (
              <div className="bg-stone-950/50 border border-stone-900 p-4 rounded-2xl space-y-3" id="scans-history-card">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-amber-500/80" />
                    <span>{language === "fr" ? "ANALYSES RECENTES" : language === "en" ? "RECENT SCANS" : "HISTORIAL DE ESCANEOS"}</span>
                  </h3>
                  {showConfirmClear ? (
                    <div className="flex items-center gap-2" id="confirm-clear-panel">
                      <span className="text-[9px] font-mono text-stone-500">{language === "fr" ? "Confirmer?" : language === "en" ? "Clear?" : "¿Seguro?"}</span>
                      <button
                        onClick={() => {
                          setScansList([]);
                          setCustomReport(null);
                          setImageSrc(null);
                          setShowConfirmClear(false);
                        }}
                        className="text-[9px] font-mono text-rose-450 hover:text-rose-400 font-bold"
                        id="btn-confirm-clear"
                      >
                        {language === "fr" ? "[Oui]" : language === "en" ? "[Yes]" : "[Sí]"}
                      </button>
                      <button
                        onClick={() => setShowConfirmClear(false)}
                        className="text-[9px] font-mono text-stone-400 hover:text-stone-300"
                        id="btn-cancel-clear"
                      >
                        {language === "fr" ? "[Non]" : language === "en" ? "[No]" : "[No]"}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowConfirmClear(true)}
                      className="text-[9px] font-mono text-stone-500 hover:text-rose-400 transition-colors"
                      id="btn-trigger-clear-all"
                    >
                      {language === "fr" ? "[Vider]" : language === "en" ? "[Clear]" : "[Borrar todo]"}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3" id="dynamic-scans-list">
                  {scansList.map((s) => {
                    const isCurrent = customReport?.landmarks && customReport.faceShape === s.report.faceShape && imageSrc === s.img;
                    return (
                      <div 
                        key={s.id} 
                        className={`group relative text-left rounded-xl border text-xs transition-all duration-350 flex flex-col gap-1.5 p-2 ${
                          isCurrent 
                            ? "bg-amber-500/10 border-amber-500/40 text-amber-200 font-bold"
                            : "bg-stone-900/60 border-stone-850 text-stone-400 hover:border-stone-800 hover:bg-stone-900/90"
                        }`}
                        id={`picker-scan-${s.id}`}
                      >
                        <button
                          onClick={() => {
                            setCustomReport(s.report);
                            setImageSrc(s.img);
                            setSelectedLandmark(null);
                            setErrorLog(null);
                          }}
                          className="w-full text-left flex flex-col gap-1.5 cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            <img 
                              src={s.img} 
                              alt="" 
                              className="w-5 h-5 rounded-full object-cover border border-stone-800 border-none shrink-0" 
                            />
                            <span className="truncate flex-1 font-mono text-[11px]">{s.name}</span>
                          </div>
                          <span className="text-[10px] text-stone-500 font-normal line-clamp-1">
                            {s.report.faceShape} • {(s.report.overallType || "").split(" ")[0]}
                          </span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newList = scansList.filter(item => item.id !== s.id);
                            setScansList(newList);
                            if (isCurrent) {
                              if (newList.length > 0) {
                                setCustomReport(newList[0].report);
                                setImageSrc(newList[0].img);
                              } else {
                                setCustomReport(null);
                                setImageSrc(null);
                              }
                            }
                          }}
                          className="absolute right-2 top-2 w-4 h-4 rounded-full bg-stone-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center hover:bg-rose-500/10 hover:text-rose-450 text-stone-500 transition-all cursor-pointer"
                          title="Delete Scan"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Educational Dynamic Simulator panel */}
            {simulatorMode && (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-4" id="sandbox-simulator-panel">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Settings className="w-4 h-4 text-amber-500" />
                    <h4 className="text-xs font-bold font-mono tracking-wider text-stone-200">
                      {language === "fr" 
                        ? "SANDBOX D'INTÉGRATION DES ZONES" 
                        : language === "en" 
                          ? "ZONE INTEGRATION SANDBOX" 
                          : "SANDBOX DE INTEGRACIÓN DE ZONAS"}
                    </h4>
                  </div>
                  <button 
                    onClick={() => setSimulatorMode(false)}
                    className="text-stone-500 hover:text-stone-300 cursor-pointer"
                    id="close-sim-mode-btn"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-stone-404 leading-snug">
                  {language === "fr" 
                    ? "Faites glisser les curseurs pour simuler la dominance des trois zones faciales et observer la classification morpho-psychologique." 
                    : language === "en" 
                      ? "Move the bars to simulate the dominance of the three facial zones and observe the morphopsychological classification." 
                      : "Mueve las barras para simular la dominancia de las tres zonas faciales y ver cómo la morfopsicología valora este tipo de perfiles."}
                </p>

                <div className="space-y-3" id="sim-sliders-area">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-purple-300 flex items-center gap-1"><Brain className="w-3 h-3"/> {language === "fr" ? "Intellectuel (Supérieur)" : language === "en" ? "Intellectual (Upper)" : "Intelectual (Superior)"}</span>
                      <span className="font-mono">{simZones.intellectual}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={simZones.intellectual}
                      onChange={(e) => setSimZones({...simZones, intellectual: Number(e.target.value)})}
                      className="w-full accent-purple-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-rose-300 flex items-center gap-1"><Heart className="w-3 h-3"/> {language === "fr" ? "Émotionnel (Moyen)" : language === "en" ? "Emotional (Middle)" : "Emocional (Media)"}</span>
                      <span className="font-mono">{simZones.emotional}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={simZones.emotional}
                      onChange={(e) => setSimZones({...simZones, emotional: Number(e.target.value)})}
                      className="w-full accent-rose-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-amber-300 flex items-center gap-1"><Zap className="w-3 h-3"/> {language === "fr" ? "Instinctif (Inférieur)" : language === "en" ? "Instinctive (Lower)" : "Instintiva (Inferior)"}</span>
                      <span className="font-mono">{simZones.instinctive}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={simZones.instinctive}
                      onChange={(e) => setSimZones({...simZones, instinctive: Number(e.target.value)})}
                      className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Outcome description for simulators */}
                <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-850 text-xs text-stone-300 leading-normal" id="simulator-output-box">
                  <span className="text-[9px] font-mono text-amber-400 font-bold block uppercase mb-1">
                    {language === "fr" ? "ESTIMATION DE LA TENDANCE :" : language === "en" ? "ESTIMATED TEMPERAMENT TENDENCY:" : "TENDENCIA DEL TEMPERAMENTO ESTIMADO:"}
                  </span>
                  {(() => {
                    const { intellectual, emotional, instinctive } = simZones;
                    if (intellectual >= emotional && intellectual >= instinctive) {
                      return language === "fr" 
                        ? "Prédilection cérébrale avec tendance intellectuelle réflexive. Personne qui accumule les idées, recherche des modèles logiques avant de s'engager."
                        : language === "en"
                          ? "Cerebral preference with a reflective, intellectual trend. Accumulates ideas, seeks logical models before taking physical action."
                          : "Predilección cerebral con tendencia intelectual reflexiva o melancólica. Persona que acumula ideas, busca modelados lógicos antes de dar el paso físico, y valora mucho el orden estético conceptual.";
                    }
                    if (emotional >= intellectual && emotional >= instinctive) {
                      return language === "fr"
                        ? "Prédilection affective relationnelle avec tendance empathique. Les décisions reposent sur l'élan affectif et l'échange relationnel."
                        : language === "en"
                          ? "Affective relational preference with an empathetic trend. Primary decision-making is rooted in emotional connections."
                          : "Predilección afectiva relacional con tendencia Sanguínea o empática. El centro de las decisiones radica en los picos emotivos, el bienestar relacional y la aprobación de la comunidad.";
                    }
                    return language === "fr"
                      ? "Prédilection vitale instinctive stimulée par des forces formatrices. Haute endurance pour la persévérance physique."
                      : language === "en"
                        ? "Vital instinctive preference driven by execution forces. High physical endurance and strong defensive traits."
                        : "Predilección vital instintiva impulsada por fuerzas realizadoras. Alta resistencia para la persistencia de tareas duras y defensa enérgica de su territorio personal.";
                  })()}
                </div>
              </div>
            )}

          </section>

          {/* Right Block (Detailed report presentation) - Occupies 7 span */}
          <section className="lg:col-span-7 space-y-6" id="report-view-section">
            
             {hasLoadedShared && (
              <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 text-xs text-stone-300 flex items-center justify-between gap-3 animate-fade-in" id="shared-notification-bar">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <p className="font-sans">
                     {localShare.sharedFromLink}
                  </p>
                </div>
                <button
                  onClick={() => {
                    window.history.pushState({}, document.title, window.location.pathname);
                    setHasLoadedShared(false);
                  }}
                  className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-amber-400 hover:text-amber-300 cursor-pointer pr-1"
                  id="dismiss-shared-bar-btn"
                >
                  [ {language === "fr" ? "Fermer" : language === "en" ? "Dismiss" : "Quitar"} ]
                </button>
              </div>
            )}

             {isFallbackActive && (
              <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 text-xs text-amber-300 flex items-start gap-3" id="fallback-notification-bar">
                <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-200">{t("high_demand_title")}</p>
                  <p className="text-stone-300 leading-relaxed">
                    {t("high_demand_subtitle")}
                  </p>
                </div>
              </div>
            )}
            
            {activeReport ? (
              <div className="space-y-6 animate-fade-in text-left text-stone-200" id="complete-report-container">
                
                {/* 1. Header Card - Complete Report Title & Fast Metadata */}
                <div className="bg-stone-900/40 border border-stone-850 rounded-2xl p-6 space-y-4" id="report-main-identity-card">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-850 pb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 uppercase font-black tracking-widest block w-fit">
                        {t("general_report_title")}
                      </span>
                      <h3 className="text-xl font-bold tracking-tight text-stone-50" id="report-shape-heading">
                        {t("face_shape_label")}: <span className="text-amber-400">{activeReport.faceShape}</span>
                      </h3>
                      {shareSubjectName && (
                        <p className="text-xs text-stone-400 font-mono">
                          {language === "fr" ? "Sujet : " : language === "en" ? "Subject: " : "Sujeto: "}
                          <span className="text-stone-200 font-bold">{shareSubjectName}</span>
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 bg-stone-950/40 p-3 rounded-xl border border-stone-850/40 shrink-0">
                      <div className="text-right">
                        <p className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">{t("environment_type_label")}</p>
                        <p className="text-xs font-bold text-teal-400 font-mono tracking-wide">{activeReport.overallType}</p>
                      </div>
                      <div className="w-px h-8 bg-stone-800" />
                      <div className="text-left">
                        <p className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">{t("temperament_label")}</p>
                        <p className="text-xs font-bold text-amber-300 font-mono tracking-wide">{activeReport.temperament}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Summary Quote by Louis Corman Model */}
                  <div className="bg-stone-950/40 p-4 rounded-xl border border-stone-850 text-xs sm:text-sm text-stone-300 italic leading-relaxed relative" id="report-summary-quote">
                    <div className="absolute left-2.5 top-2.5 text-xs text-amber-500/20 font-serif text-4xl block select-none pointer-events-none">“</div>
                    <p className="relative z-10 pl-4 py-1">
                      {language === "fr" ? (
                        <>Le visage de ce sujet se classe selon la loi de dilatation-rétraction comme <strong className="text-amber-300">{activeReport.overallType}</strong>. Son tempérament dominant est <strong className="text-amber-300">{activeReport.temperament}</strong>, influençant directement ses décisions quotidiennes.</>
                      ) : language === "en" ? (
                        <>The face of this subject is classified under Corman's law of dilation-retraction as <strong className="text-amber-300">{activeReport.overallType}</strong>. Their dominant temperament is <strong className="text-amber-300">{activeReport.temperament}</strong>, directly influencing their daily decisions.</>
                      ) : (
                        <>El rostro de este sujeto se categoriza en la ley de dilatación-retracción como <strong className="text-amber-300">{activeReport.overallType}</strong>. Su temperamento dominante es <strong className="text-amber-300">{activeReport.temperament}</strong>, con una notable armonía ósea y receptiva que influye directamente en su toma de decisiones cotidianas.</>
                      )}
                    </p>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="border-t border-stone-850 pt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4" id="report-share-section-row">
                    <p className="text-[11px] text-stone-400 font-sans leading-relaxed text-left max-w-sm">
                      {localShare.shareDesc}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={handleDownloadPdf}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 hover:bg-stone-850 hover:text-white active:scale-95 transition-all duration-200 text-xs font-bold font-mono tracking-wider cursor-pointer shadow-md select-none"
                        id="direct-pdf-btn"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>

                      <button
                        onClick={handleExportPng}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 hover:bg-stone-850 hover:text-white active:scale-95 transition-all duration-200 text-xs font-bold font-mono tracking-wider cursor-pointer shadow-md select-none"
                        id="direct-png-btn"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                        <span>PNG</span>
                      </button>

                      <button
                        onClick={() => {
                          if (customReport && !shareSubjectName) {
                            setShareSubjectName(localShare.defaultSubject);
                          }
                          setIsShareModalOpen(true);
                        }}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 hover:from-amber-400 hover:to-yellow-300 active:scale-95 transition-all duration-200 text-xs font-bold font-mono tracking-wider cursor-pointer shadow-lg shadow-amber-500/5 select-none shrink-0"
                        id="open-share-modal-btn"
                      >
                        <Share2 className="w-3.5 h-3.5 fill-stone-950" />
                        <span>{localShare.shareAnalysis}</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* 2. Zonas Faciales Section */}
                <div className="bg-stone-900/40 border border-stone-850 rounded-2xl p-6 space-y-6 animate-fade-in" id="complete-report-zones-card">
                  <div className="flex items-center gap-2.5 border-b border-stone-850 pb-3">
                    <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
                    <h3 className="text-sm font-extrabold font-mono uppercase tracking-wider text-stone-200">
                      {t("tabs_zones")}
                    </h3>
                  </div>

                  {/* Zone Progress Bars */}
                    <div className="bg-stone-900/30 border border-stone-850 rounded-2xl p-4 sm:p-6 space-y-4" id="zone-progress-section">
                      
                      {/* Intellectual */}
                      <div className="space-y-2" id="report-zone-intellectual-block">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold flex items-center gap-1.5 text-purple-300 text-[10px] sm:text-xs">
                            <Brain className="w-4 h-4" />
                            <span>{t("zone_intellectual_label")}</span>
                          </span>
                          <span className="font-mono text-stone-300">
                            {zoneScores.intellectual.score}% {language === "fr" ? "de force" : language === "en" ? "strength" : "de fuerza"}
                          </span>
                        </div>
                        <div className="h-2 bg-stone-950 rounded-full overflow-hidden border border-stone-850">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-1000" 
                            style={{ width: `${zoneScores.intellectual.score}%` }}
                          />
                        </div>
                        <p className="text-xs text-stone-300 leading-relaxed pl-5 font-sans">
                          {zoneScores.intellectual.interpretation}
                        </p>
                      </div>

                      <div className="h-px bg-stone-850" />

                      {/* Emotional */}
                      <div className="space-y-2" id="report-zone-emotional-block">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold flex items-center gap-1.5 text-rose-300 text-[10px] sm:text-xs">
                            <Heart className="w-4 h-4" />
                            <span>{t("zone_emotional_label")}</span>
                          </span>
                          <span className="font-mono text-stone-300 font-bold">
                            {zoneScores.emotional.score}% {language === "fr" ? "de force" : language === "en" ? "strength" : "de fuerza"}
                          </span>
                        </div>
                        <div className="h-2 bg-stone-950 rounded-full overflow-hidden border border-stone-850">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-1000" 
                            style={{ width: `${zoneScores.emotional.score}%` }}
                          />
                        </div>
                        <p className="text-xs text-stone-300 leading-relaxed pl-5 font-sans">
                          {zoneScores.emotional.interpretation}
                        </p>
                      </div>

                      <div className="h-px bg-stone-850" />

                      {/* Instinctive */}
                      <div className="space-y-2" id="report-zone-instinctive-block">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold flex items-center gap-1.5 text-amber-300 text-[10px] sm:text-xs">
                            <Zap className="w-4 h-4" />
                            <span>{t("zone_instinctive_label")}</span>
                          </span>
                          <span className="font-mono text-stone-300">
                            {zoneScores.instinctive.score}% {language === "fr" ? "de force" : language === "en" ? "strength" : "de fuerza"}
                          </span>
                        </div>
                        <div className="h-2 bg-stone-950 rounded-full overflow-hidden border border-stone-850">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000" 
                            style={{ width: `${zoneScores.instinctive.score}%` }}
                          />
                        </div>
                        <p className="text-xs text-stone-300 leading-relaxed pl-5 font-sans">
                          {zoneScores.instinctive.interpretation}
                        </p>
                      </div>

                    </div>

                    {/* Dominant Summary Callout */}
                    <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl flex gap-3.5 items-center" id="dominant-zone-badge">
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
                        <Sparkles className="w-5 h-5 animate-spin-slow" />
                      </div>
                      <div>
                        <h4 className="text-[10px] sm:text-xs font-mono text-stone-400 uppercase tracking-wider">
                          {t("dominant_decision_label")}
                        </h4>
                        <p className="text-sm font-extrabold text-stone-200 capitalize">
                          {highestZone === "intellectual" 
                            ? t("dominant_sec_intellectual") 
                            : highestZone === "emotional" 
                              ? t("dominant_sec_emotional") 
                              : t("dominant_sec_instinctive")}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* 3. Receptores Faciales y Simetría Section */}
                  <div className="bg-stone-900/40 border border-stone-850 rounded-2xl p-6 space-y-6 animate-fade-in" id="complete-report-features-card">
                    <div className="flex items-center gap-2.5 border-b border-stone-850 pb-3">
                      <Eye className="w-5 h-5 text-rose-400 animate-pulse" />
                      <h3 className="text-sm font-extrabold font-mono uppercase tracking-wider text-stone-200">
                        {t("tabs_features")}
                      </h3>
                    </div>
                    
                    {/* FACIAL SYMMETRY METERS PANEL */}
                    {symmetryData && (
                      <div className="bg-gradient-to-br from-stone-900/50 to-stone-950/60 border border-stone-850 p-5 rounded-2xl space-y-5" id="symmetry-score-panel">
                        <div className="flex flex-col md:flex-row gap-5 items-center justify-between">
                          <div className="space-y-1.5 flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <GitCompare className="w-4 h-4 text-emerald-400" />
                              <h3 className="text-sm font-extrabold font-mono uppercase tracking-wider text-emerald-300">
                                {symmetryTranslations[language].symmetryTitle}
                              </h3>
                            </div>
                            <p className="text-xs text-stone-400 leading-relaxed font-sans max-w-xl">
                              {symmetryTranslations[language].symmetryDesc}
                            </p>
                          </div>
                          
                          {/* Circle overall meter */}
                          <div className="flex items-center gap-4 bg-stone-950/40 px-4 py-3 border border-stone-850 rounded-xl" id="symmetry-radial-summary">
                            <div className="relative w-14 h-14 flex items-center justify-center">
                              <svg className="absolute w-full h-full transform -rotate-90">
                                <circle
                                  cx="28"
                                  cy="28"
                                  r="24"
                                  className="stroke-stone-850"
                                  strokeWidth="4"
                                  fill="transparent"
                                />
                                <circle
                                  cx="28"
                                  cy="28"
                                  r="24"
                                  className="stroke-emerald-400 transition-all duration-1000"
                                  strokeWidth="4.5"
                                  fill="transparent"
                                  strokeDasharray={`${2 * Math.PI * 24}`}
                                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - symmetryData.overallSymmetry / 100)}`}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <span className="text-base font-black font-mono text-emerald-300">
                                {symmetryData.overallSymmetry}%
                              </span>
                            </div>
                            <div className="text-left space-y-0.5">
                              <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block">
                                {symmetryTranslations[language].overallScore}
                              </span>
                              <span className="text-xs font-extrabold text-stone-200">
                                {symmetryData.overallSymmetry >= 90
                                  ? symmetryTranslations[language].excellentHarmony
                                  : symmetryTranslations[language].dynamicAdaptability}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* RECHARTS HISTORY LINE CHART & TREND CARDS */}
                        {(() => {
                          const chartData = [...scansList]
                            .reverse()
                            .map((scan, idx) => {
                              const overallSym = calculateOverallSymmetryForReport(scan.report);
                              const scanDate = new Date(Number(scan.id));
                              const formattedDate = isNaN(scanDate.getTime()) 
                                ? `S-${idx + 1}` 
                                : scanDate.toLocaleDateString(language === "es" ? "es-ES" : language === "fr" ? "fr-FR" : "en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit"
                                  });
                              return {
                                id: scan.id,
                                name: scan.name || `Scan ${idx + 1}`,
                                dateStr: formattedDate,
                                symmetry: overallSym as number | null,
                              };
                            });

                          interface ChartPoint {
                            id: string | number;
                            name: string;
                            dateStr: string;
                            symmetry: number | null;
                            forecastSymmetry: number | null;
                            isForecast?: boolean;
                          }

                          let finalChartData: ChartPoint[] = chartData.map((d, index) => {
                            return {
                              ...d,
                              forecastSymmetry: index === chartData.length - 1 ? d.symmetry : null
                            };
                          });

                          if (showForecast && chartData.length >= 2) {
                            const n = chartData.length;
                            let sumX = 0;
                            let sumY = 0;
                            let sumXY = 0;
                            let sumXX = 0;
                            for (let i = 0; i < n; i++) {
                              const symmetryVal = chartData[i].symmetry;
                              const yVal = symmetryVal !== null ? symmetryVal : 0;
                              sumX += i;
                              sumY += yVal;
                              sumXY += i * yVal;
                              sumXX += i * i;
                            }
                            const denominator = n * sumXX - sumX * sumX;
                            const slope = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;
                            const intercept = (sumY - slope * sumX) / n;

                            for (let step = 1; step <= 3; step++) {
                              const futureIndex = n - 1 + step;
                              const projectedVal = slope * futureIndex + intercept;
                              const clampedVal = Math.max(50, Math.min(100, Math.round(projectedVal)));
                              
                              finalChartData.push({
                                id: `forecast-${step}`,
                                name: language === "es" ? `Proyección ${step}` : language === "fr" ? `Projection ${step}` : `Projected ${step}`,
                                dateStr: language === "es" ? `Futuro +${step}` : language === "fr" ? `Futur +${step}` : `Future +${step}`,
                                symmetry: null,
                                forecastSymmetry: clampedVal,
                                isForecast: true
                              });
                            }
                          }

                          const CustomDot = (props: any) => {
                            const { cx, cy, index, payload } = props;
                            if (payload && payload.isForecast) return null;
                            return (
                              <motion.circle
                                cx={cx}
                                cy={cy}
                                r={4.5}
                                fill="#10b981"
                                stroke="#0c0a09"
                                strokeWidth={2}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ 
                                  delay: index * 0.15,
                                  duration: 0.3,
                                  type: "spring",
                                  stiffness: 150
                                }}
                              />
                            );
                          };

                          const getTrendInfo = () => {
                            if (scansList.length < 2) {
                              return {
                                status: "initial",
                                slope: 0,
                                title: trendTranslations[language].initial,
                                desc: trendTranslations[language].initialDesc,
                                colorClass: "text-stone-400 border-stone-850 bg-stone-900/10",
                                isAlert: false,
                                dropPercentStr: ""
                              };
                            }

                            const lastThreeScores: number[] = [];
                            const limit = Math.min(3, scansList.length);
                            for (let i = limit - 1; i >= 0; i--) {
                              lastThreeScores.push(calculateOverallSymmetryForReport(scansList[i].report));
                            }

                            const slope = calculateTrendSlope(lastThreeScores);

                            let status = "stable";
                            let title = trendTranslations[language].stable;
                            let desc = trendTranslations[language].stableDesc;
                            let colorClass = "text-blue-300 border-blue-950/20 bg-blue-500/5 hover:border-blue-500/20";

                            if (slope > 0.1) {
                              status = "improving";
                              title = trendTranslations[language].improving;
                              desc = trendTranslations[language].improvingDesc;
                              colorClass = "text-emerald-300 border-emerald-950/20 bg-emerald-500/5 hover:border-emerald-500/20";
                            } else if (slope < -0.1) {
                              status = "declining";
                              title = trendTranslations[language].declining;
                              desc = trendTranslations[language].decliningDesc;
                              colorClass = "text-amber-400 border-amber-955/20 bg-amber-500/5 hover:border-amber-500/20";
                            }

                            const latestScore = calculateOverallSymmetryForReport(scansList[0].report);
                            const prevSessions = scansList.slice(1, 4);
                            let isAlert = false;
                            let dropPercentStr = "";
                            if (prevSessions.length > 0) {
                              const sumPrev = prevSessions.reduce((sum, scan) => sum + calculateOverallSymmetryForReport(scan.report), 0);
                              const avgPrev = sumPrev / prevSessions.length;
                              const diffPercent = ((avgPrev - latestScore) / avgPrev) * 100;
                              if (diffPercent > 10) {
                                isAlert = true;
                                dropPercentStr = diffPercent.toFixed(1);
                              }
                            }

                            return {
                              status,
                              slope,
                              title,
                              desc,
                              colorClass,
                              isAlert,
                              dropPercentStr
                            };
                          };

                          const trendInfo = getTrendInfo();

                          return (
                            <div className="space-y-4" id="symmetry-history-render-block">
                              
                              {/* Recharts LineChart container */}
                              <div className="bg-stone-950/40 p-4 border border-stone-850 rounded-xl space-y-3 text-left" id="symmetry-history-chart-wrapper">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest font-bold">
                                    {language === "fr" ? "ÉVOLUTION DE LA SYMÉTRIE" : language === "en" ? "SYMMETRY EVOLUTION TRACKER" : "HISTORIAL DE SIMETRÍA"}
                                  </span>
                                  <span className="text-[9px] font-mono text-stone-500">
                                    {scansList.length} {scansList.length === 1 ? (language === "es" ? "sesión" : "session") : (language === "es" ? "sesiones" : "sessions")}
                                  </span>
                                </div>
                                
                                <div className="h-44 w-full" id="symmetry-recharts-container">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={finalChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                      <CartesianGrid strokeDasharray="3 3" stroke="#1c1917" vertical={false} />
                                      <XAxis 
                                        dataKey="dateStr" 
                                        stroke="#57534e" 
                                        fontSize={9} 
                                        tickLine={false} 
                                        axisLine={false}
                                        dy={10}
                                        fontFamily="monospace"
                                      />
                                      <YAxis 
                                        domain={[50, 100]} 
                                        stroke="#57534e" 
                                        fontSize={9} 
                                        tickLine={false} 
                                        axisLine={false}
                                        dx={-5}
                                        fontFamily="monospace"
                                      />
                                      <Tooltip
                                        contentStyle={{ 
                                          backgroundColor: "rgba(12, 10, 9, 0.95)", 
                                          borderColor: "#292524", 
                                          borderRadius: "12px",
                                          fontSize: "11px",
                                          color: "#f5f5f4"
                                        }}
                                        labelClassName="font-mono text-[10px] text-stone-400 font-bold"
                                      />
                                      <Line
                                        type="monotone"
                                        dataKey="symmetry"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        connectNulls
                                        dot={<CustomDot />}
                                        activeDot={{ r: 6, fill: "#fbbf24", stroke: "#0c0a09", strokeWidth: 2 }}
                                        isAnimationActive={true}
                                        animationDuration={1200}
                                      />
                                      {showForecast && (
                                        <Line
                                          type="monotone"
                                          dataKey="forecastSymmetry"
                                          stroke="#fbbf24"
                                          strokeWidth={2.5}
                                          strokeDasharray="4 4"
                                          connectNulls
                                          dot={{ r: 3.5, fill: "#fbbf24", stroke: "#0c0a09", strokeWidth: 1.5 }}
                                          activeDot={{ r: 5, fill: "#fbbf24" }}
                                          isAnimationActive={true}
                                          animationDuration={1000}
                                        />
                                      )}
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>

                              {/* Trend Insight Card with interactive animation */}
                              <AnimatePresence mode="wait">
                                <motion.div
                                  key={`trend-${trendInfo.status}-${scansList.length}`}
                                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                                  transition={{ duration: 0.3, ease: "easeOut" }}
                                  whileHover={{ scale: 1.01, translateY: -1, boxShadow: "0 4px 20px -2px rgba(16, 185, 129, 0.05)" }}
                                  className={`p-4 border rounded-xl flex items-start gap-3.5 text-left transition-all duration-300 cursor-default ${trendInfo.colorClass}`}
                                  id="symmetry-trend-card"
                                >
                                  <div className="p-2 rounded-lg bg-stone-900 border border-stone-850 flex items-center justify-center mt-0.5 shrink-0">
                                    {trendInfo.status === "improving" ? (
                                      <span className="text-emerald-400 font-bold text-xs animate-bounce">▲</span>
                                    ) : trendInfo.status === "declining" ? (
                                      <span className="text-amber-400 font-bold text-xs animate-pulse">▼</span>
                                    ) : trendInfo.status === "stable" ? (
                                      <span className="text-blue-400 font-bold text-sm leading-none">&mdash;</span>
                                    ) : (
                                      <span className="text-stone-400 font-bold text-[10px] opacity-60">●</span>
                                    )}
                                  </div>
                                  <div className="space-y-1.5 w-full">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div className="flex items-center gap-2">
                                        <h4 className="text-xs font-extrabold uppercase tracking-wider font-mono">
                                          {trendInfo.title}
                                        </h4>
                                        {trendInfo.status !== "initial" && (
                                          <span className="text-[9px] font-mono text-stone-500">
                                            ({trendInfo.slope > 0 ? "+" : ""}{trendInfo.slope.toFixed(2)})
                                          </span>
                                        )}
                                      </div>
                                      
                                      {trendInfo.isAlert && (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-extrabold tracking-wider bg-rose-500/15 border border-rose-500/35 text-rose-400 animate-pulse font-mono shrink-0" id="symmetry-trend-alert-badge">
                                          ⚠️ {language === "es" ? "ALERTA: DESCENSO DEL" : language === "fr" ? "ALERTE: BAISSE DE" : "ALERT: DROP OF"} {trendInfo.dropPercentStr}%
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-stone-300 leading-normal font-sans">
                                      {trendInfo.desc}
                                    </p>
                                  </div>
                                </motion.div>
                              </AnimatePresence>

                              {/* Visual toggle switch for overlaying mirror guide */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="symmetry-controls-grid">
                                <div className="flex items-center justify-between bg-stone-950/20 p-3 border border-stone-850/60 rounded-xl" id="mirror-guide-toggle-row">
                                  <div className="flex items-center gap-2.5">
                                    <Eye className="w-4 h-4 text-amber-400 shrink-0" />
                                    <div className="text-left w-full">
                                      <span className="text-xs font-extrabold text-stone-200 block">
                                        {language === "fr" ? "GUIDE DE MIROIR" : language === "en" ? "MIRROR GUIDE" : "GUÍA ESPEJO"}
                                      </span>
                                      <span className="text-[10px] text-stone-400 leading-tight block">
                                        {language === "fr" ? "Vérifier l'alignement horizontal" : language === "en" ? "Inspect horizontal symmetry alignment" : "Inspecciona simetría física horizontal"}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <button
                                    onClick={() => setShowMirrorGuide(!showMirrorGuide)}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                      showMirrorGuide ? "bg-amber-500" : "bg-stone-800"
                                    }`}
                                    id="mirror-guide-toggle"
                                    type="button"
                                    title="Toggle Mirror Guide"
                                  >
                                    <span
                                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-stone-950 shadow ring-0 transition duration-200 ease-in-out ${
                                        showMirrorGuide ? "translate-x-5" : "translate-x-0"
                                      }`}
                                    />
                                  </button>
                                </div>

                                <div className="flex items-center justify-between bg-stone-950/20 p-3 border border-stone-850/60 rounded-xl" id="symmetry-forecast-toggle-row">
                                  <div className="flex items-center gap-2.5 font-sans">
                                    <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <div className="text-left w-full">
                                      <span className="text-xs font-extrabold text-stone-200 block">
                                        {language === "fr" ? "PRÉVISION DE TENDANCE" : language === "en" ? "TREND FORECAST" : "PRONÓSTICO DE TENDENCIA"}
                                      </span>
                                      <span className="text-[10px] text-stone-400 leading-tight block">
                                        {language === "fr" ? "Projeter les 3 prochaines séances" : language === "en" ? "Project next 3 sessions" : "Proyecta próximas 3 sesiones"}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <button
                                    onClick={() => setShowForecast(!showForecast)}
                                    disabled={scansList.length < 2}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed ${
                                      showForecast ? "bg-emerald-500" : "bg-stone-800"
                                    }`}
                                    id="symmetry-forecast-toggle"
                                    type="button"
                                    title="Toggle Symmetry Forecast"
                                  >
                                    <span
                                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-stone-950 shadow ring-0 transition duration-200 ease-in-out ${
                                        showForecast ? "translate-x-5" : "translate-x-0"
                                      }`}
                                    />
                                  </button>
                                </div>
                              </div>

                            </div>
                          );
                        })()}

                        {/* Interactive Zone-by-Zone Balance Gauges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" id="symmetry-zones-grid">
                          {[
                            {
                              label: symmetryTranslations[language].foreheadSymmetry,
                              score: symmetryData.details.forehead,
                              color: "from-purple-600 to-purple-400",
                              textStyle: "text-purple-300"
                            },
                            {
                              label: symmetryTranslations[language].eyesSymmetry,
                              score: symmetryData.details.eyes,
                              color: "from-blue-600 to-blue-400",
                              textStyle: "text-blue-300"
                            },
                            {
                              label: symmetryTranslations[language].cheekbonesSymmetry,
                              score: symmetryData.details.cheekbones,
                              color: "from-teal-600 to-teal-400",
                              textStyle: "text-teal-300"
                            },
                            {
                              label: symmetryTranslations[language].mouthSymmetry,
                              score: symmetryData.details.mouth,
                              color: "from-amber-600 to-amber-400",
                              textStyle: "text-amber-300"
                            }
                          ].map((item, index) => (
                            <div key={index} className="bg-stone-950/50 border border-stone-850 p-3 rounded-xl space-y-2">
                              <span className="text-[10px] font-bold text-stone-300 block text-left truncate">{item.label}</span>
                              <div className="flex justify-between items-center text-[11px] font-mono">
                                <span className="text-stone-500">Symmetry</span>
                                <span className={`font-bold ${item.textStyle}`}>{item.score.overall}%</span>
                              </div>
                              <div className="h-1 bg-stone-900 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.score.overall}%` }} />
                              </div>
                              <div className="flex justify-between text-[8.5px] font-mono text-stone-500 pt-0.5">
                                <span>V: {item.score.vertical}%</span>
                                <span>H: {item.score.horizontal}%</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Morphopsychological Symmetry Reading Description */}
                        <div className="bg-stone-950/40 p-3 border border-stone-850 rounded-xl space-y-1 text-left" id="symmetry-interpretation-card">
                          <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block">
                            {language === "fr" ? "LECTURE DE HARMONIE" : language === "en" ? "HARMONY DECODING" : "LECTURA DE ARMONÍA"}
                          </span>
                          <p className="text-xs text-stone-300 leading-relaxed font-sans">
                            {symmetryData.overallSymmetry >= 90
                              ? symmetryTranslations[language].highSymmetryText
                              : symmetryTranslations[language].lowSymmetryText}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="receivers-grid-cards">
                      
                      {/* Eyes Receiver Card */}
                      <div className="bg-stone-900/30 border border-stone-850 p-4 rounded-xl space-y-2.5" id="receiver-eyes-card">
                        <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block">{t("eyes_tag")}</span>
                        <h4 className="text-xs font-bold text-stone-100 flex items-center gap-1.5">
                          <span className="w-1.5 h-2.5 bg-purple-500 rounded-sm" />
                          <span>{t("receiver_eyes_title")}{activeReport.features.eyes.style}</span>
                        </h4>
                        <p className="text-xs text-stone-300 leading-relaxed font-sans">
                          {activeReport.features.eyes.interpretation}
                        </p>
                      </div>

                      {/* Nose Receiver Card */}
                      <div className="bg-stone-900/30 border border-stone-850 p-4 rounded-xl space-y-2.5" id="receiver-nose-card">
                        <span className="text-[9px] font-mono text-rose-400 uppercase tracking-widest block">{t("nose_tag")}</span>
                        <h4 className="text-xs font-bold text-stone-100 flex items-center gap-1.5">
                          <span className="w-1.5 h-2.5 bg-rose-500 rounded-sm" />
                          <span>{t("receiver_nose_title")}{activeReport.features.nose.style}</span>
                        </h4>
                        <p className="text-xs text-stone-300 leading-relaxed font-sans">
                          {activeReport.features.nose.interpretation}
                        </p>
                      </div>

                      {/* Mouth Receiver Card */}
                      <div className="bg-stone-900/30 border border-stone-850 p-4 rounded-xl space-y-2.5" id="receiver-mouth-card">
                        <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest block">{t("mouth_tag")}</span>
                        <h4 className="text-xs font-bold text-stone-100 flex items-center gap-1.5">
                          <span className="w-1.5 h-2.5 bg-amber-500 rounded-sm" />
                          <span>{t("receiver_mouth_title")}{activeReport.features.mouthAndJaw.style}</span>
                        </h4>
                        <p className="text-xs text-stone-300 leading-relaxed font-sans">
                          {activeReport.features.mouthAndJaw.interpretation}
                        </p>
                      </div>

                    </div>

                    <div className="bg-stone-900/40 p-4 border border-stone-850 rounded-xl" id="receivers-law-disclaimer">
                      <p className="text-xs text-stone-400 leading-relaxed font-sans">
                        {t("receiver_relation_text")}
                      </p>
                    </div>

                  </div>

                  {/* 4. Línea Temporal Psicológica Section */}
                  <div className="bg-stone-900/40 border border-stone-850 rounded-2xl p-6 space-y-6 animate-fade-in" id="complete-report-timeline-card">
                    <div className="flex items-center gap-2.5 border-b border-stone-850 pb-3">
                      <Compass className="w-5 h-5 text-emerald-400 animate-spin-slow" />
                      <h3 className="text-sm font-extrabold font-mono uppercase tracking-wider text-stone-200">
                        {t("tabs_timeline")}
                      </h3>
                    </div>

                    <div className="space-y-4 relative before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-px before:bg-stone-800" id="timeline-flow-list">
                      
                      {/* Past item */}
                      <div className="flex gap-4 relative" id="timeline-past-item">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center shrink-0 z-10">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        </div>
                        <div className="bg-stone-900/30 border border-stone-850 p-4 rounded-xl flex-1 space-y-1">
                          <span className="text-[9px] font-mono text-stone-400 font-bold block uppercase tracking-wider">{t("timeline_past_title")}</span>
                          <p className="text-xs text-stone-300 leading-relaxed">
                            {activeReport.pastIns}
                          </p>
                        </div>
                      </div>

                      {/* Present item */}
                      <div className="flex gap-4 relative" id="timeline-present-item">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center shrink-0 z-10">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <div className="bg-stone-900/30 border border-stone-850 p-4 rounded-xl flex-1 space-y-1">
                          <span className="text-[9px] font-mono text-amber-400 font-bold block uppercase tracking-wider animate-pulse">{t("timeline_present_title")}</span>
                          <p className="text-xs text-stone-300 leading-relaxed">
                            {activeReport.presentIns}
                          </p>
                        </div>
                      </div>

                      {/* Future item */}
                      <div className="flex gap-4 relative" id="timeline-future-item">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-stone-950 border border-stone-850 flex items-center justify-center shrink-0 z-10">
                          <Compass className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="bg-stone-900/30 border border-stone-850 p-4 rounded-xl flex-1 space-y-1">
                          <span className="text-[9px] font-mono text-emerald-400 font-bold block uppercase tracking-wider">{t("timeline_future_title")}</span>
                          <p className="text-xs text-stone-300 leading-relaxed">
                            {activeReport.futureIns}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

            {/* Strengths & Growth Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="strengths-weaknesses-container">
              
              {/* Strengths card */}
              <div className="bg-stone-900/30 border border-stone-850 p-4 rounded-2xl space-y-3" id="strengths-card">
                <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-black flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t("strengths_title")}</span>
                </h4>
                <ul className="space-y-2.5" id="strengths-list-ul">
                  {activeReport.strengths.map((str, i) => (
                    <li key={`str-${i}`} className="text-xs text-stone-300 flex items-start gap-2.5 leading-normal">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0 mt-1.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Growth areas card */}
              <div className="bg-stone-900/30 border border-stone-850 p-4 rounded-2xl space-y-3" id="growth-areas-card">
                <h4 className="text-xs font-mono text-amber-400 uppercase tracking-widest font-black flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>{t("growth_areas_title")}</span>
                </h4>
                <ul className="space-y-2.5" id="growth-list-ul">
                  {activeReport.growthAreas.map((gro, i) => (
                    <li key={`gro-${i}`} className="text-xs text-stone-300 flex items-start gap-2.5 leading-normal">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0 mt-1.5" />
                      <span>{gro}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-stone-900/30 border border-stone-850 rounded-2xl p-6 sm:p-8 space-y-6 animate-fade-in" id="welcome-intro-card">
            <div className="space-y-2 border-b border-stone-850 pb-4">
              <span className="text-[9px] font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/15 uppercase font-black tracking-widest inline-block">
                {language === "fr" ? "GUIDE DE L'EXAMEN" : language === "en" ? "BIOPORTRAIT SCANNER" : "GUÍA DEL ESCÁNER MORFOPSICOLÓGICO"}
              </span>
              <h3 className="text-xl font-extrabold text-stone-100 font-sans tracking-tight">
                {language === "fr" 
                  ? "Prêt à Découvrir Votre Structure ?" 
                  : language === "en" 
                    ? "Ready to Reveal Your Profile?" 
                    : "Descubre el temperamento de tu estructura facial"}
              </h3>
              <p className="text-xs text-stone-400 font-sans leading-relaxed">
                {language === "fr"
                  ? "La morphopsychologie de Corman décode les forces internes en analysant l'équilibre des trois étages faciaux. Saisissez ou chargez une photo de face pour tracer votre biome tri-frontal."
                  : language === "en"
                    ? "Corman's morphopsychology decodes internal drives by analyzing the balance of the three facial zones. Capture or upload a front-facing face to generate your biometric report."
                    : "La morfopsicología de Louis Corman analiza las proporciones de las tres zonas faciales para determinar las inclinaciones naturales del temperamento, la toma de decisiones y el flujo vital."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="intro-zones-grid">
              <div className="bg-stone-950/40 border border-stone-850 p-4 rounded-xl space-y-2 text-center">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
                  <Brain className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-stone-200">{language === "fr" ? "Étage Supérieur" : language === "en" ? "Upper Floor" : "Zona Superior"}</h4>
                <p className="text-[10px] text-stone-400 leading-normal font-sans">
                  {language === "fr" ? "Pensée créative, concepts théoriques et raison." : language === "en" ? "Creative thinking, concepts, and abstract logic." : "Frente y sienes. Gobierna el pensamiento, la abstracción y la reflexión."}
                </p>
              </div>

              <div className="bg-stone-950/40 border border-stone-850 p-4 rounded-xl space-y-2 text-center">
                <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-450">
                  <Heart className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-stone-200">{language === "fr" ? "Étage Médian" : language === "en" ? "Middle Floor" : "Zona Media"}</h4>
                <p className="text-[10px] text-stone-400 leading-normal font-sans">
                  {language === "fr" ? "Relations sociales, empathie et adaptabilité." : language === "en" ? "Social relations, empathy, and emotional filters." : "Pómulos y nariz. Rige la empatía, el trato social y el afecto."}
                </p>
              </div>

              <div className="bg-stone-950/40 border border-stone-850 p-4 rounded-xl space-y-2 text-center">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-stone-200">{language === "fr" ? "Étage Inférieur" : language === "en" ? "Lower Floor" : "Zona Inferior"}</h4>
                <p className="text-[10px] text-stone-400 leading-normal font-sans">
                  {language === "fr" ? "Action physique, force vitale et réalisation." : language === "en" ? "Physical action, drive, and materializing projects." : "Mandíbula y boca. Controla la ejecución, resistencia e instintos."}
                </p>
              </div>
            </div>

            <div className="bg-stone-950/60 p-4 rounded-xl border border-stone-850 space-y-2.5">
              <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === "fr" ? "CONSEILS POUR UN ENREGISTREMENT" : language === "en" ? "RULES FOR OPTIMAL RESULTS" : "RECOMENDACIONES DE CAPTURA"}</span>
              </h4>
              <ul className="text-[11px] text-stone-400 space-y-2 font-sans">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>{language === "fr" ? "Éclairage direct homogène" : language === "en" ? "Good homogeneous lighting in front of the face" : "Buena iluminación frontal homogénea"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>{language === "fr" ? "Expresion faciale neutre (sans sourire)" : language === "en" ? "Neutral expression (please withhold smiling for correct metric bias)" : "Expresión facial neutra (por favor desactiva la sonrisa para mayor exactitud)"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>{language === "fr" ? "Régler la hauteur de l'objectif sur l'axe des yeux" : language === "en" ? "Align camera strictly on eye-level axis" : "Alinea la lente exactamente a la altura de tu eje ocular"}</span>
                </li>
              </ul>
            </div>
          </div>
        )}

      </section>

        </div>

        {/* Dynamic side-by-side bioreport comparer panel */}
        <AnimatePresence>
          {isCompareMode && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.98 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="mt-4 overflow-hidden"
              id="analysis-comparer-container"
            >
              <AnalysisComparer 
                language={language}
                scans={scansList}
                customReport={customReport}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Morfopsicología Educational Principles Card */}
        <section className="pt-4" id="guide-principles-section">
          <FacialAnalysisGuide />
        </section>

        {/* Visitor Guestbook & Comments Section (Option 3 - Serverless Webhook) */}
        <section className="mt-12" id="guestbook-comments-section">
          <GuestbookComments language={language} />
        </section>

      </main>

      {/* Aesthetic Site Footer */}
      <footer className="border-t border-stone-900 bg-stone-950 text-stone-500 py-8 text-center text-xs space-y-3 mt-12" id="app-footer">
        <p className="font-mono text-[10px] tracking-wider text-stone-400 px-4">
          {t("footer_text_1")}
        </p>
        <p className="max-w-2xl mx-auto px-4 leading-relaxed">
          {t("footer_text_2")}
        </p>
        
        {/* Blinking/Pulsing Visitor Counter and Support/Sponsorship Row */}
        <div className="pt-2 flex flex-wrap justify-center items-center gap-2.5 max-w-lg mx-auto px-4" id="footer-badges-container">
          {/* Visitor Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-900/40 border border-stone-850/60 rounded-full text-[10px] font-mono tracking-wider text-stone-400 shadow-md transition-all duration-300 hover:border-amber-500/20" id="visitors-counter-badge">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-stone-500 uppercase text-[9px] font-bold">
              {language === "es" ? "VISITAS:" : language === "fr" ? "VISITES:" : "VISITS:"}
            </span>
            <span className="font-extrabold text-amber-400/90 tracking-wider animate-[pulse_1.5s_infinite]">
              {visitorCount.toLocaleString()}
            </span>
            <span className="text-[8px] text-emerald-500 font-extrabold tracking-tighter opacity-80 animate-pulse bg-emerald-950/40 px-1 rounded">
              LIVE
            </span>
          </div>

          {/* Elegant Volunteer Contribution (Mercado Pago) Heart Badge */}
          <a
            href="https://mpago.la/1LHyBwV"
            target="_blank"
            referrerPolicy="no-referrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 hover:border-red-500/40 rounded-full text-[10px] font-mono tracking-wider text-red-400 shadow-md transition-all duration-300 hover:shadow-[0_0_12px_rgba(239,68,68,0.15)] group cursor-pointer"
            id="footer-donate-badge"
            title={language === "es" ? "Colaboración voluntaria para el mantenimiento del sitio" : "Support site maintenance"}
          >
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400/20 group-hover:scale-110 transition-all duration-200 animate-[pulse_2s_infinite]" />
            <span className="font-extrabold uppercase">
              {language === "es" ? "Colaboración Voluntaria" : language === "fr" ? "Soutenir" : "Support Site"}
            </span>
          </a>

          {/* Sponsorships Accepted Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/5 border border-amber-500/15 rounded-full text-[10px] font-mono tracking-wider text-stone-400 shadow-md" id="sponsorship-info-badge">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
            </span>
            <span className="text-stone-500 uppercase text-[9px] font-bold">
              {language === "es" ? "PATROCINIOS:" : language === "fr" ? "SPONSORS:" : "SPONSORSHIPS:"}
            </span>
            <span className="font-semibold text-amber-400/90 text-[9px] uppercase">
              {language === "es" ? "Aceptados" : language === "fr" ? "Acceptés" : "Accepted"}
            </span>
          </div>
        </div>

        <p className="pt-4 text-[10px] text-stone-500">
          &copy; {new Date().getFullYear()} Morphoface. {t("footer_copyright")}
        </p>
      </footer>

      {/* Modern, Eye-Safe Share & Download Modal overlay */}
      <AnimatePresence>
        {isShareModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
            id="share-modal-overlay"
            onClick={() => setIsShareModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 w-full max-w-md space-y-6 shadow-2xl relative"
              id="share-modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button with subtle trigger border */}
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 p-1.5 bg-stone-950/40 border border-stone-850 hover:border-stone-700 rounded-xl transition-all cursor-pointer"
                id="close-share-modal-btn"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2">
                <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 uppercase font-black tracking-widest inline-block">
                  {localShare.shareTitle}
                </span>
                <h3 className="text-lg font-bold tracking-tight text-stone-100 font-sans">
                  {localShare.shareAnalysis}
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed font-sans">
                  {localShare.shareDesc}
                </p>
              </div>

              {customReport && (
                <div className="space-y-2" id="share-subject-name-input-block">
                  <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                    {localShare.subjectNameLabel}
                  </label>
                  <input
                    type="text"
                    value={shareSubjectName}
                    onChange={(e) => setShareSubjectName(e.target.value)}
                    placeholder={localShare.defaultSubject}
                    className="w-full bg-stone-950 border border-stone-850 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors font-sans"
                    id="share-subject-name-input"
                  />
                </div>
              )}

              {/* URL Shortener Branded Link Preview CARD */}
              {customReport && (
                <div className="bg-stone-950/60 border border-stone-850/80 rounded-2xl p-4.5 space-y-3 animate-fade-in" id="share-link-shortener-card">
                  <div className="flex items-center justify-between col-span-2">
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                      {language === "fr" ? "Lien de Partage" : language === "en" ? "Sharing Link" : "Enlace Compartido"}
                    </span>
                    <div className="flex rounded-lg bg-stone-900 border border-stone-800 p-0.5" id="brand-selector-pill-group">
                      <button
                        onClick={() => setShareLinkType("branded")}
                        className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase transition-all duration-150 cursor-pointer ${
                          shareLinkType === "branded" ? "bg-amber-500/15 text-amber-400 border border-amber-500/25" : "text-stone-500 hover:text-stone-300 border border-transparent"
                        }`}
                        id="select-branded-btn"
                      >
                        {language === "fr" ? "Branded" : language === "en" ? "Branded" : "Branded"}
                      </button>
                      <button
                        onClick={() => setShareLinkType("sandbox")}
                        className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase transition-all duration-150 cursor-pointer ${
                          shareLinkType === "sandbox" ? "bg-amber-500/15 text-amber-400 border border-amber-500/25" : "text-stone-500 hover:text-stone-300 border border-transparent"
                        }`}
                        id="select-sandbox-btn"
                      >
                        {language === "fr" ? "Démo" : language === "en" ? "Functional" : "Demostración"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-stone-900/80 border border-stone-850/60 rounded-xl p-3 flex items-center justify-between gap-3 text-stone-200 select-all" id="short-url-display-box">
                    <div className="overflow-x-auto whitespace-nowrap scrollbar-none font-mono text-xs text-amber-400 select-all w-full flex items-center gap-1.5" style={{ scrollbarWidth: "none" }}>
                      <span className="text-stone-500 select-all">https://</span>
                      {isShortening ? (
                        <span className="text-stone-500 animate-pulse">morphoface.ai/scan/...</span>
                      ) : shareLinkType === "branded" ? (
                        <span className="text-amber-400 font-semibold select-all">morphoface.ai/scan/{shortId || "a1B2c3d4"}</span>
                      ) : (
                        <span className="text-amber-400 font-semibold select-all">{typeof window !== "undefined" ? window.location.host : "localhost:3000"}/scan/{shortId || "a1B2c3d4"}</span>
                      )}
                    </div>
                    {isShortening && (
                      <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin shrink-0" />
                    )}
                  </div>
                  
                  <p className="text-[10px] text-stone-500 leading-normal" id="short-url-helper-text">
                    {shareLinkType === "branded" 
                      ? (language === "es" ? "Enlace de alta gama simplificado para redes sociales y bios." : language === "fr" ? "Lien premium simplifié idéal pour les réseaux sociaux et bios." : "Premium simplified link ideal for social networks and bios.")
                      : (language === "es" ? "Enlace funcional que redirige automáticamente para ver el reporte en vivo." : language === "fr" ? "Lien fonctionnel redirigeant pour afficher le rapport en direct." : "Functional redirecting link that loads the live report in this preview env.")
                    }
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2" id="share-action-buttons-wrapper">
                {/* 1. Copy deep link option */}
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-stone-950/55 hover:bg-stone-955 border border-stone-850 hover:border-stone-750 text-stone-200 transition-all cursor-pointer text-xs font-mono font-bold group select-none"
                  id="modal-copy-link-btn"
                >
                  <span className="flex items-center gap-2.5">
                    {isCopying ? <Check className="w-4 h-4 text-emerald-400 animate-pulse" /> : <Copy className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />}
                    <span>{isCopying ? localShare.linkCopied : localShare.copyLink}</span>
                  </span>
                  {!isCopying && <ChevronRight className="w-4 h-4 text-stone-500" />}
                </button>

                {/* 2. Download dynamic Corman standard PDF */}
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-stone-950/55 hover:bg-stone-955 border border-stone-850 hover:border-stone-750 text-stone-200 transition-all cursor-pointer text-xs font-mono font-bold group select-none disabled:opacity-50"
                  id="modal-download-pdf-btn"
                >
                  <span className="flex items-center gap-2.5">
                    {isGeneratingPdf ? (
                      <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 text-amber-500 group-hover:translate-y-0.5 transition-transform" />
                    )}
                    <span>{isGeneratingPdf ? localShare.downloading : localShare.downloadPdf}</span>
                  </span>
                  {!isGeneratingPdf && <ChevronRight className="w-4 h-4 text-stone-500" />}
                </button>

                {/* 3. Export analysis screen as PNG image */}
                <button
                  onClick={handleExportPng}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-stone-950/55 hover:bg-stone-955 border border-stone-850 hover:border-stone-750 text-stone-200 transition-all cursor-pointer text-xs font-mono font-bold group select-none"
                  id="modal-export-png-btn"
                >
                  <span className="flex items-center gap-2.5">
                    <Download className="w-4 h-4 text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
                    <span>{language === "fr" ? "Télécharger l'Analyse (PNG)" : language === "en" ? "Download Analysis (PNG)" : "Descargar Análisis (PNG)"}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-500" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
