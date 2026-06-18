import { MorphoReport, Landmark } from "../types";

// Helper to hash string to a stable number
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

const faceShapes = {
  es: ["Ovalado", "Rectangular", "Redondo", "Triangular", "Trapezoide"],
  en: ["Oval", "Rectangular", "Round", "Triangular", "Trapezoid"],
  fr: ["Ovale", "Rectangulaire", "Rond", "Triangulaire", "Trapézoïdal"]
};

const overallTypes = {
  es: ["Dilatado (Abierto/Receptivo)", "Concentrado (Selectivo/Enfocado)", "Retraído (Filtro Activo)", "Reaccionante (Gran Adaptabilidad)"],
  en: ["Dilated (Open/Receptive)", "Concentrated (Selective/Focused)", "Retracted (Active Filter)", "Reactant (High Adaptability)"],
  fr: ["Dilaté (Ouvert/Réceptif)", "Concentré (Sélectif/Ciblé)", "Rétracté (Filtre Actif)", "Réactif (Forte Adaptabilité)"]
};

const temperaments = {
  es: ["Sanguíneo-Melancólico", "Bilioso-Colérico", "Linfático-Relajado", "Nervioso-Reflexivo", "Colérico-Apasionado"],
  en: ["Sanguine-Melancholic", "Bilious-Choleric", "Lymphatic-Relaxed", "Nervous-Reflective", "Choleric-Passionate"],
  fr: ["Sanguin-Mélancolique", "Bilieux-Colérique", "Lymphatique-Détendu", "Nerveux-Réfléchi", "Colérique-Passionné"]
};

export function generateFallbackReport(language: "es" | "en" | "fr", imageSrc?: string): MorphoReport {
  const lang = language || "es";
  const seed = imageSrc ? hashString(imageSrc.slice(-1000)) : Math.floor(Math.random() * 10000);
  
  // Choose stable attributes based on image content seed
  const shapes = faceShapes[lang] || faceShapes["es"];
  const types = overallTypes[lang] || overallTypes["es"];
  const temps = temperaments[lang] || temperaments["es"];

  const faceShape = shapes[seed % shapes.length];
  const overallType = types[(seed + 1) % types.length];
  const temperament = temps[(seed + 2) % temps.length];

  // Base scores
  const intellectualScore = 50 + (seed % 41); // 50 to 90
  const emotionalScore = 45 + ((seed >> 2) % 46); // 45 to 90
  const instinctiveScore = 40 + ((seed >> 4) % 46); // 40 to 85

  // Qualitative interpretations
  const interpretations = {
    es: {
      intellectual: `El sector superior de la frente indica una intensidad conceptual del ${intellectualScore}%. Aborda las ideas con rigor ${intellectualScore > 75 ? "estratégico, abstracción profunda y asimilación pacífica de planes" : "práctico, intuición inmediata y lógica orientada a la acción rápida"}.`,
      emotional: `Su zona media emocional alcanza un ${emotionalScore}%. Denota una comunicación de tipo ${emotionalScore > 70 ? "receptiva y empática con gran adaptabilidad interpersonal" : "estable y selectiva, priorizando un círculo de confianza y filtros de defensa activos"}.`,
      instinctive: `La zona inferior (mandíbula y boca) registra un ${instinctiveScore}%. Esto sugiere un ${instinctiveScore > 70 ? "sólido empuje físico, resistencia pragmática y gran capacidad realizadora libre de fatigas" : "enfoque guiado por la asimilación mental o selectividad en el uso de la energía biológica"}.`,
      eyes: {
        style: "Ojos de apertura receptiva y simetría equilibrada",
        interpretation: "Actúan como receptores directos con gran velocidad de comprensión del entorno. Muestran agilidad para capturar y clasificar estímulos visuales complejos."
      },
      nose: {
        style: "Nasal recto con proyección estabilizada",
        interpretation: "El tabique representa la defensa afectiva. Ofrece un equilibrio perfecto en el dar y recibir emocional, actuando como escudo sutil pero impenetrable contra el estrés relacional."
      },
      mouthAndJaw: {
        style: "Labios tónicos y línea mandibular delineada",
        interpretation: "Simboliza la canalización material de las necesidades físicas. El tono muscular sugiere una notable perseverancia y control sobre los apetitos básicos."
      },
      past: "Herencia ósea resistente, que establece un marco constitucional estable contra el desgaste exterior.",
      present: "Tono muscular activo y dinámico, reflejando disposición inmediata y receptiva al estímulo.",
      future: "Busque equilibrar la asimilación intelectual con mayor actividad física y control de ritmos biológicos.",
      strengths: ["Liderazgo conceptual intuitivo", "Alta adaptabilidad contextual", "Pensamiento estructurado y rigura analítica"],
      growthAreas: ["Tendencia a la sobre-reflexión mental", "Necesidad de pausas orgánicas de recuperación"]
    },
    en: {
      intellectual: `The upper sector of the forehead indicates a conceptual intensity of ${intellectualScore}%. Processes thoughts with ${intellectualScore > 75 ? "strategic abstraction, high visualization, and careful deliberation" : "practical focus, immediate intuition, and rapid action-oriented logic"}.`,
      emotional: `The middle emotional zone registers ${emotionalScore}%. This demonstrates a ${emotionalScore > 70 ? "highly open, receptive, and empathetic communication template" : "stable and highly selective social filter, prioritizing trusted groups and defense shields"}.`,
      instinctive: `The lower physical base shows ${instinctiveScore}%. This reveals a ${instinctiveScore > 70 ? "robust execution powerhouse, physically resilient and materializing designs with great endurance" : "selective utilization of energy, favoring mental goals over mechanical tasks"}.`,
      eyes: {
        style: "Receptive wide-set gaze with balanced symmetry",
        interpretation: "Acts as quick cognitive portals. Absorbs external patterns rapidly and structures environmental cues with keen spatial intelligence."
      },
      nose: {
        style: "Straight profile with clean projection",
        interpretation: "Constitutes the core emotional shield. Moderates the flow of affect, displaying protective checks to prevent over-involvement in toxic circles."
      },
      mouthAndJaw: {
        style: "Toned lips and cleanly defined jaw angles",
        interpretation: "Embodies practical assimilation and task execution. Muscle tone suggests admirable determination when executing manual or concrete plans."
      },
      past: "Robust bone lineage providing a dense defense structure against environmental depletion over the years.",
      present: "Active muscle response showing quick physiological adaptation and ready stance.",
      future: "Cultivate rhythmic somatic pauses to prevent cerebral burnout and elevate kinetic grounding.",
      strengths: ["Intelligent conceptual mapping", "Aesthetic and analytical balance", "High relational intelligence"],
      growthAreas: ["Risk of intellectual overcomplication", "Should practice grounding routines"]
    },
    fr: {
      intellectual: `La zone supérieure du front affiche une intensité conceptuelle de ${intellectualScore}%. Traite les idées avec une ${intellectualScore > 75 ? "abstraction stratégique et une imagination fluide" : "logique pragmatique et un sens aigu du concret"}.`,
      emotional: `Le secteur moyen émotionnel affiche une valeur de ${emotionalScore}%. Ceci révèle une nature ${emotionalScore > 70 ? "chaleureuse, empathique et ouverte à l'échange" : "sélective et protectrice, gardant ses distances de sécurité"}.`,
      instinctive: `La base instinctive (mâchoire et bouche) présente une force de ${instinctiveScore}%. Suggère un ${instinctiveScore > 70 ? "fort potentiel réalisateur et une excellente vitalité matérielle" : "contrôle mental des appétits physiologiques de base"}.`,
      eyes: {
        style: "Yeux ouverts de nature réceptive",
        interpretation: "Récepteurs visuels agiles et réactifs. Captent instantanément les signaux non verbaux de l'environnement."
      },
      nose: {
        style: "Ligne nasale droite et asymétrie naturelle",
        interpretation: "Filtre affectif stabilisé. Régule l'empathie avec beaucoup de tact tout en maintenant une frontière saine de protection."
      },
      mouthAndJaw: {
        style: "Lèvres toniques et mâchoire dessinée",
        interpretation: "Indique une volonté motrice solide et une capacité de résister aux pressions matérielles."
      },
      past: "Cadre osseux de protection stable issu d'une hérédité physique robuste.",
      present: "Tonus musculaire sain, reflétant une grande réactivité nerveuse aux stimulants extérieurs.",
      future: "Équilibrez la fatigue mentale par de saines habitudes d'exercice aérobique en plein air.",
      strengths: ["Grande adaptabilité comportementale", "Vision d'ensemble stratégique", "Excellente gestion relationnelle"],
      growthAreas: ["Tension cérébrale passagère", "Besoin d'ancre tactile pratique de repos"]
    }
  };

  const selectedText = interpretations[lang] || interpretations["es"];

  // Coordinates with subtle custom offset depending on image content hash
  const deltaX = (seed % 5) - 2; // -2 to 2
  const deltaY = ((seed >> 2) % 5) - 2;

  const landmarks: Landmark[] = [
    { label: "Forehead Left", x: 42 + deltaX, y: 18 + deltaY },
    { label: "Forehead Right", x: 58 + deltaX, y: 18 + deltaY },
    { label: "Left Eye", x: 41 + deltaX, y: 38 + deltaY },
    { label: "Right Eye", x: 59 + deltaX, y: 38 + deltaY },
    { label: "Nose Tip", x: 50 + deltaX, y: 52 + deltaY },
    { label: "Left Cheekbone", x: 34 + deltaX, y: 54 + deltaY },
    { label: "Right Cheekbone", x: 66 + deltaX, y: 54 + deltaY },
    { label: "Mouth Left", x: 44 + deltaX, y: 70 + deltaY },
    { label: "Mouth Right", x: 56 + deltaX, y: 70 + deltaY },
    { label: "Chin Point", x: 50 + deltaX, y: 83 + deltaY }
  ];

  return {
    faceShape,
    overallType,
    temperament,
    zones: {
      intellectual: {
        score: intellectualScore,
        interpretation: selectedText.intellectual
      },
      emotional: {
        score: emotionalScore,
        interpretation: selectedText.emotional
      },
      instinctive: {
        score: instinctiveScore,
        interpretation: selectedText.instinctive
      }
    },
    features: {
      eyes: selectedText.eyes,
      nose: selectedText.nose,
      mouthAndJaw: selectedText.mouthAndJaw
    },
    landmarks,
    pastIns: selectedText.past,
    presentIns: selectedText.present,
    futureIns: selectedText.future,
    strengths: selectedText.strengths,
    growthAreas: selectedText.growthAreas
  };
}
