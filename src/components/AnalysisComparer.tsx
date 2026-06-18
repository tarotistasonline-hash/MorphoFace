import React, { useState, useEffect } from "react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from "recharts";
import { 
  Brain, 
  Heart, 
  Zap, 
  Sparkles, 
  GitCompare, 
  User, 
  ArrowRightLeft, 
  HelpCircle,
  TrendingUp,
  Award
} from "lucide-react";
import { Profile, MorphoReport } from "../types";

const comparerTranslations = {
  es: {
    title: "COMPARADOR GEOMÉTRICO FACIAL",
    subtitle: "Contrasta la dominancia de las tres zonas de Louis Corman y el diseño temperamental de dos sujetos en tiempo real.",
    subjectALabel: "Sujeto / Fisiotipo A",
    subjectBLabel: "Sujeto / Fisiotipo B",
    currentScan: "Mi Escaneo Activo",
    zoneComparison: "Perfil de Intensidad de Zonas",
    intellectualLabel: "Intelectual (Cerebral)",
    emotionalLabel: "Emocional (Socio-Relacional)",
    instinctiveLabel: "Instintivo (Vital-Práctico)",
    shapeLabel: "Estructura Ósea",
    typeLabel: "Adaptabilidad Dinámica",
    tempLabel: "Asociación Temperamental",
    radarTitle: "Envolvente Biométrica de Zonas",
    structuralDiff: "Análisis Diferencial",
    comparisonTitle: "Dinámica Diferencial de Temperamentos",
    strengthDiff: "Fortalezas Diferenciales",
    noData: "Realiza un análisis o selecciona un arquetipo para comenzar a comparar.",
    scoreA: "Sujeto A",
    scoreB: "Sujeto B",
    zoneTitle: "Zonas de Corman",
    valueLabel: "Fuerza",
    conclHeader: "CONCLUSIÓN DE CONTEXTO FISIOGNÓMICO",
    diffIntellectual: "Sujeto A posee mayor enfoque conceptual, abstracción estratégica e imaginación teórica. Sujeto B destaca en un ritmo más pragmático o práctico.",
    diffEmotional: "Sujeto A muestra mayor apertura y adaptabilidad social (empatía receptora). Sujeto B prioriza mayor selectividad defensiva o contención relacional.",
    diffInstinctive: "Sujeto A dispone de una superior reserva de energía física, resistencia material, vigor e instinto realizador. Sujeto B actúa guiado por motivaciones mentales o emocionales primarias.",
    similarIntellectual: "Ambos comparten niveles muy equiparados de intensidad cerebral y procesamiento analítico intelectual.",
    similarEmotional: "Ambas estructuras demuestran una empatía emocional y reciprocidad social muy semejante.",
    similarInstinctive: "Los dos perfiles exhiben igual empuje instintivo, control del territorio y tenacidad material.",
    generalContrast: "El cruce de temperamentos revela dos tipologías morfológicas ricas en complementariedad: uno actúa como el motor de ideas y el otro asegura el anclaje físico y la viabilidad pragmática.",
  },
  en: {
    title: "FACIAL GEOPHYSICAL COMPARER",
    subtitle: "Contrast Louis Corman's three facial zones and temperamental design of two subjects in real-time.",
    subjectALabel: "Subject / Physiotype A",
    subjectBLabel: "Subject / Physiotype B",
    currentScan: "My Active Scan",
    zoneComparison: "Zone Intensity Profile",
    intellectualLabel: "Intellectual (Cerebral)",
    emotionalLabel: "Emotional (Socio-Relational)",
    instinctiveLabel: "Instinctive (Vital-Practical)",
    shapeLabel: "Skeletal Shape",
    typeLabel: "Dynamic Adaptability",
    tempLabel: "Temperament Profile",
    radarTitle: "Zone Biometric Envelope",
    structuralDiff: "Differential Analysis",
    comparisonTitle: "Temperamental Contrast Dynamics",
    strengthDiff: "Differential Strengths",
    noData: "Perform an analysis or select an archetype to start comparing.",
    scoreA: "Subject A",
    scoreB: "Subject B",
    zoneTitle: "Corman Zones",
    valueLabel: "Strength",
    conclHeader: "PHYSIOGNOMIC CONTEXT CONCLUSION",
    diffIntellectual: "Subject A has stronger conceptual focus, strategic abstraction, and theoretical imagination. Subject B operates with a more pragmatic or step-by-step pace.",
    diffEmotional: "Subject A exhibits higher open relational adaptation (empathic receiver). Subject B prioritizes selective filtering or social containment.",
    diffInstinctive: "Subject A possesses superior physical energy reserve, material endurance, and execution drive. Subject B acts based on primary cognitive or emotional targets.",
    similarIntellectual: "Both share very similar levels of cerebral intensity and analytical intellectual processing.",
    similarEmotional: "Both structures display comparable emotional empathy and relation-building dynamics.",
    similarInstinctive: "Both profiles exhibit matching instinctive drive, territorial defense, and practical tenacity.",
    generalContrast: "This temperamental cross reveals two morphological types rich in complementarity: one serves as the vision generator while the other secures ground stability and execution viability.",
  },
  fr: {
    title: "COMPARATEUR GÉOMÉTRIQUE FACIAL",
    subtitle: "Comparez la dominance des trois zones de Louis Corman et le profil de tempérament de deux sujets en temps réel.",
    subjectALabel: "Sujet / Physiotype A",
    subjectBLabel: "Sujet / Physiotype B",
    currentScan: "Mon scan actif",
    zoneComparison: "Profil d'Intensité des Zones",
    intellectualLabel: "Intellectuel (Cérébral)",
    emotionalLabel: "Émotionnel (Socio-Relationnel)",
    instinctiveLabel: "Instinctif (Vital-Pratique)",
    shapeLabel: "Structure Osseuse",
    typeLabel: "Adaptabilité Dynamique",
    tempLabel: "Profil de Tempérament",
    radarTitle: "Enveloppe Biométrique de Zones",
    structuralDiff: "Analyse Différentielle",
    comparisonTitle: "Dynamique des Tempéraments",
    strengthDiff: "Forces Différentielles",
    noData: "Effectuez une analyse ou sélectionnez un archétype pour commencer à comparer.",
    scoreA: "Sujet A",
    scoreB: "Sujet B",
    zoneTitle: "Zones Corman",
    valueLabel: "Force",
    conclHeader: "CONCLUSION DE CONTEXTE MORPHOLOGIQUE",
    diffIntellectual: "Le Sujet A possède une plus grande concentration conceptuelle, une abstraction stratégique et une imagination théorique. Le Sujet B privilégie un rythme plus pragmatique.",
    diffEmotional: "Le Sujet A montre une plus grande ouverture et adaptabilité sociale (empathie réceptrice). Le Sujet B donne la priorité à la sélectivité défensive ou à la réserve.",
    diffInstinctive: "Le Sujet A dispose d'une réserve supérieure d'énergie physique, de résistance matérielle et de réalisation. Le Sujet B agit guidé par des motivations cérébrales ou émotionnelles.",
    similarIntellectual: "Les deux partagent des niveaux très équivalents d'intensité cérébrale et de traitement d'idées.",
    similarEmotional: "Les deux structures démontrent une empathie relationnelle et une réciprocité sociale très similaires.",
    similarInstinctive: "Les deux profils affichent le même dynamisme instinctif, la même défense territoriale et ténacité.",
    generalContrast: "Ce croisement de tempéraments révèle deux typologies morphologiques riches en complémentarité: l'un agit comme moteur d'idées tandis que l'autre garantit l'ancrage concret et la viabilité pratique.",
  }
};

export interface ScanOption {
  id: string;
  name: string;
  img: string;
  report: MorphoReport;
}

interface AnalysisComparerProps {
  language: "es" | "en" | "fr";
  scans: ScanOption[];
  customReport: MorphoReport | null;
}

export default function AnalysisComparer({ language, scans, customReport }: AnalysisComparerProps) {
  const t = comparerTranslations[language] || comparerTranslations["es"];

  // Create selectable options list
  // First option is the custom analysis if representing a custom report
  const [selectedAId, setSelectedAId] = useState<string>("custom");
  const [selectedBId, setSelectedBId] = useState<string>(scans[0]?.id || "");

  // Update selection if scans change or custom report is added
  useEffect(() => {
    if (customReport) {
      setSelectedAId("custom");
    }
    if (scans.length > 0 && !selectedBId) {
      setSelectedBId(scans[0].id);
    }
  }, [customReport, scans]);

  // Helper inside to retrieve Subject Details (Name, Image, Report data)
  const getSubjectDetails = (id: string): { name: string; img: string; report: MorphoReport } | null => {
    if (id === "custom") {
      if (!customReport) return null;
      // Look if we have this exact report in scans list to reuse the face image
      const matchedScan = scans.find(s => s.report.faceShape === customReport.faceShape && s.report.overallType === customReport.overallType);
      return {
        name: t.currentScan,
        img: matchedScan ? matchedScan.img : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400",
        report: customReport
      };
    }
    const found = scans.find(s => s.id === id);
    if (found) {
      return {
        name: found.name,
        img: found.img,
        report: found.report
      };
    }
    return null;
  };

  const subjectA = getSubjectDetails(selectedAId) || (customReport ? { name: t.currentScan, img: scans[0]?.img || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400", report: customReport } : (scans[0] ? { name: scans[0].name, img: scans[0].img, report: scans[0].report } : null));
  const subjectB = getSubjectDetails(selectedBId) || (scans[0] ? { name: scans[0].name, img: scans[0].img, report: scans[0].report } : (scans[1] ? { name: scans[1].name, img: scans[1].img, report: scans[1].report } : null));

  if (!subjectA || !subjectB) {
    return (
      <div className="bg-stone-900/30 border border-stone-850 p-6 rounded-2xl text-center space-y-2 text-stone-400">
        <GitCompare className="w-8 h-8 text-stone-650 mx-auto animate-pulse" />
        <p className="text-xs font-mono">{t.noData}</p>
      </div>
    );
  }

  // Map raw scores for recharts radar
  const radarData = [
    {
      subject: t.intellectualLabel,
      A: subjectA.report.zones.intellectual.score,
      B: subjectB.report.zones.intellectual.score,
    },
    {
      subject: t.emotionalLabel,
      A: subjectA.report.zones.emotional.score,
      B: subjectB.report.zones.emotional.score,
    },
    {
      subject: t.instinctiveLabel,
      A: subjectA.report.zones.instinctive.score,
      B: subjectB.report.zones.instinctive.score,
    }
  ];

  // Dynamic contrast narratives generator
  const getDynamicContrast = () => {
    const diffTexts: string[] = [];
    const scoreDiffIntellectual = subjectA.report.zones.intellectual.score - subjectB.report.zones.intellectual.score;
    const scoreDiffEmotional = subjectA.report.zones.emotional.score - subjectB.report.zones.emotional.score;
    const scoreDiffInstinctive = subjectA.report.zones.instinctive.score - subjectB.report.zones.instinctive.score;

    if (Math.abs(scoreDiffIntellectual) > 15) {
      diffTexts.push(scoreDiffIntellectual > 0 ? t.diffIntellectual : t.diffIntellectual.replace("A", "B").replace("B", "A"));
    } else {
      diffTexts.push(t.similarIntellectual);
    }

    if (Math.abs(scoreDiffEmotional) > 15) {
      diffTexts.push(scoreDiffEmotional > 0 ? t.diffEmotional : t.diffEmotional.replace("A", "B").replace("B", "A"));
    } else {
      diffTexts.push(t.similarEmotional);
    }

    if (Math.abs(scoreDiffInstinctive) > 15) {
      diffTexts.push(scoreDiffInstinctive > 0 ? t.diffInstinctive : t.diffInstinctive.replace("A", "B").replace("B", "A"));
    } else {
      diffTexts.push(t.similarInstinctive);
    }

    return diffTexts;
  };

  const contrasts = getDynamicContrast();

  return (
    <div className="bg-stone-900/30 border border-stone-850 rounded-2xl p-4 sm:p-6 space-y-6" id="analysis-comparer-root">
      
      {/* Header section with double-arrows */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-850 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 uppercase font-black tracking-widest inline-block">
              COMPARATOR LAB
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-stone-100 font-sans tracking-tight">
            {t.title}
          </h3>
          <p className="text-xs text-stone-400 font-sans leading-relaxed max-w-xl">
            {t.subtitle}
          </p>
        </div>
        <div className="bg-stone-950/80 p-1 rounded-xl border border-stone-850 flex items-center shrink-0">
          <ArrowRightLeft className="w-4 h-4 text-amber-400 mx-2 animate-pulse" />
        </div>
      </div>

      {/* Selectors grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="comparer-selectors-row">
        
        {/* Selector Subject A */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>{t.subjectALabel}</span>
          </label>
          <select
            value={selectedAId}
            onChange={(e) => setSelectedAId(e.target.value)}
            className="w-full bg-stone-950/80 border border-stone-850 rounded-xl px-3 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer font-sans"
            id="selector-subject-a"
          >
            {customReport && (
              <option value="custom">⭐️ {t.currentScan} ({customReport.faceShape})</option>
            )}
            {scans.map(s => (
              <option key={`a-${s.id}`} value={s.id}>{s.name} ({s.report.faceShape})</option>
            ))}
          </select>
        </div>

        {/* Selector Subject B */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-purple-400 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>{t.subjectBLabel}</span>
          </label>
          <select
            value={selectedBId}
            onChange={(e) => setSelectedBId(e.target.value)}
            className="w-full bg-stone-950/80 border border-stone-850 rounded-xl px-3 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer font-sans"
            id="selector-subject-b"
          >
            {customReport && selectedAId !== "custom" && (
              <option value="custom">⭐️ {t.currentScan} ({customReport.faceShape})</option>
            )}
            {scans.map(s => (
              <option key={`b-${s.id}`} value={s.id}>{s.name} ({s.report.faceShape})</option>
            ))}
          </select>
        </div>

      </div>

      {/* Comparison visual interface: Grid with overlap chart and side-by-side elements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="comparer-content-grid">
        
        {/* Left column (Visual Radar Chart) - span 5 */}
        <div className="lg:col-span-5 bg-stone-950/60 p-4 rounded-2xl border border-stone-850 flex flex-col justify-between space-y-4" id="comparer-radar-card">
          <div className="flex justify-between items-center border-b border-stone-900 pb-2.5">
            <span className="text-[10px] font-mono text-stone-400 font-extrabold uppercase">
              {t.radarTitle}
            </span>
            <span className="text-[9px] font-mono text-stone-500 bg-stone-900 px-2 py-0.5 rounded border border-stone-850">
              Corman Biometrics
            </span>
          </div>

          {/* Overlapping Radar Chart */}
          <div className="h-64 sm:h-72 w-full flex items-center justify-center" id="overlapping-radar-container">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#2c2724" strokeWidth={1} strokeDasharray="3 3" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#a8a29e', fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold' }} 
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[10, 100]} 
                  tick={{ fill: '#57534e', fontSize: 8 }}
                  axisLine={false}
                />
                
                {/* Subject A: Amber theme */}
                <Radar
                  name={subjectA.name.split(" ")[0]}
                  dataKey="A"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                
                {/* Subject B: Purple theme */}
                <Radar
                  name={subjectB.name.split(" ")[0]}
                  dataKey="B"
                  stroke="#a78bfa"
                  fill="#a78bfa"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />

                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1c1917', 
                    borderColor: '#292524',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#e7e5e4',
                    fontFamily: 'monospace'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '10px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[10px] text-stone-500 leading-normal bg-stone-900/40 p-2.5 rounded-lg border border-stone-900 text-center font-mono">
             ⚡️ Overlapping polygons show the structural expansion vs contraction areas.
          </div>
        </div>

        {/* Right column (Metrics & Differential qualitative contrast table) - span 7 */}
        <div className="lg:col-span-7 space-y-4" id="comparer-metrics-col">
          
          {/* Side-by-Side core biometric properties comparison card */}
          <div className="bg-stone-950/40 border border-stone-850 rounded-2xl p-4 sm:p-5 space-y-4" id="side-by-side-quick-metrics">
            
            {/* Visual Header card */}
            <div className="grid grid-cols-3 gap-2 border-b border-stone-900 pb-3 text-center">
              <div className="text-left">
                <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">PROP</span>
              </div>
              <div className="border-l border-stone-900 pl-2">
                <div className="flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="text-[10px] font-bold font-mono text-amber-400 tracking-wide truncate block max-w-[80px]">
                    {subjectA.name.split(" ")[0]}
                  </span>
                </div>
              </div>
              <div className="border-l border-stone-900 pl-2">
                <div className="flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span className="text-[10px] font-bold font-mono text-purple-400 tracking-wide truncate block max-w-[80px]">
                    {subjectB.name.split(" ")[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Shape Attribute Row */}
            <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-stone-900 text-xs text-center">
              <div className="text-left text-stone-400 font-mono text-[10px] uppercase font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-700" />
                <span>{t.shapeLabel}</span>
              </div>
              <div className="font-sans font-bold text-stone-200">
                {subjectA.report.faceShape}
              </div>
              <div className="font-sans font-bold text-stone-200 border-l border-stone-900">
                {subjectB.report.faceShape}
              </div>
            </div>

            {/* Type/Adaptability Row */}
            <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-stone-900 text-xs text-center">
              <div className="text-left text-stone-400 font-mono text-[10px] uppercase font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-700" />
                <span>{t.typeLabel}</span>
              </div>
              <div className="font-sans text-stone-300 text-[11px] leading-tight">
                {subjectA.report.overallType}
              </div>
              <div className="font-sans text-stone-300 text-[11px] leading-tight border-l border-stone-900">
                {subjectB.report.overallType}
              </div>
            </div>

            {/* Temperament profile Row */}
            <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-stone-900 text-xs text-center">
              <div className="text-left text-stone-400 font-mono text-[10px] uppercase font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-700" />
                <span>{t.tempLabel}</span>
              </div>
              <div className="font-mono text-amber-300 text-[11px] font-bold">
                {subjectA.report.temperament}
              </div>
              <div className="font-mono text-purple-300 text-[11px] font-bold border-l border-stone-900">
                {subjectB.report.temperament}
              </div>
            </div>

            {/* Zone Percentages details alignment */}
            <div className="pt-2 space-y-2.5" id="zone-percentage-detail-bars">
              
              {/* Intellectual bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-stone-400">
                  <span className="flex items-center gap-1"><Brain className="w-3.5 h-3.5 text-purple-400" /> {t.intellectualLabel}</span>
                  <span className="space-x-2">
                    <strong className="text-amber-400">{subjectA.report.zones.intellectual.score}%</strong>
                    <span className="text-stone-700">|</span>
                    <strong className="text-purple-400">{subjectB.report.zones.intellectual.score}%</strong>
                  </span>
                </div>
                <div className="h-1.5 bg-stone-950 rounded-full flex overflow-hidden border border-stone-900">
                  <div 
                    style={{ width: `${subjectA.report.zones.intellectual.score}%` }} 
                    className="h-full bg-amber-500 rounded-l-full opacity-60" 
                  />
                  <div 
                    style={{ width: `${subjectB.report.zones.intellectual.score}%` }} 
                    className="h-full bg-purple-500 rounded-r-full opacity-60" 
                  />
                </div>
              </div>

              {/* Emotional bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-stone-400">
                  <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-400" /> {t.emotionalLabel}</span>
                  <span className="space-x-2">
                    <strong className="text-amber-400">{subjectA.report.zones.emotional.score}%</strong>
                    <span className="text-stone-700">|</span>
                    <strong className="text-purple-400">{subjectB.report.zones.emotional.score}%</strong>
                  </span>
                </div>
                <div className="h-1.5 bg-stone-950 rounded-full flex overflow-hidden border border-stone-900">
                  <div 
                    style={{ width: `${subjectA.report.zones.emotional.score}%` }} 
                    className="h-full bg-amber-500 rounded-l-full opacity-60" 
                  />
                  <div 
                    style={{ width: `${subjectB.report.zones.emotional.score}%` }} 
                    className="h-full bg-purple-500 rounded-r-full opacity-60" 
                  />
                </div>
              </div>

              {/* Instinctive bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-stone-400">
                  <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> {t.instinctiveLabel}</span>
                  <span className="space-x-2">
                    <strong className="text-amber-400">{subjectA.report.zones.instinctive.score}%</strong>
                    <span className="text-stone-700">|</span>
                    <strong className="text-purple-400">{subjectB.report.zones.instinctive.score}%</strong>
                  </span>
                </div>
                <div className="h-1.5 bg-stone-950 rounded-full flex overflow-hidden border border-stone-900">
                  <div 
                    style={{ width: `${subjectA.report.zones.instinctive.score}%` }} 
                    className="h-full bg-amber-500 rounded-l-full opacity-60" 
                  />
                  <div 
                    style={{ width: `${subjectB.report.zones.instinctive.score}%` }} 
                    className="h-full bg-purple-500 rounded-r-full opacity-60" 
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Differential Qualitative details list */}
          <div className="bg-stone-900/30 border border-stone-850 rounded-2xl p-4 sm:p-5 space-y-4" id="comparer-qualitative-card">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span>{t.structuralDiff}</span>
            </h4>

            <div className="space-y-3" id="contrasts-narrative-box">
              {contrasts.map((text, idx) => (
                <div key={idx} className="flex gap-2.5 items-start text-xs text-stone-300 leading-relaxed font-sans" id={`contrast-text-line-${idx}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                  <p>{text}</p>
                </div>
              ))}
            </div>

            {/* General integration conclusion */}
            <div className="border-t border-stone-850 pt-4 mt-2" id="comparer-general-conclusion-box">
              <span className="text-[9px] font-mono text-stone-400 font-black block uppercase tracking-wider mb-1.5">
                {t.conclHeader}
              </span>
              <p className="text-xs text-stone-400 leading-relaxed font-sans italic" id="conclusion-summary-text">
                {t.generalContrast}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
