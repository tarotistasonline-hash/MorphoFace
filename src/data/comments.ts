export interface CommentEntry {
  id: string;
  name: string;
  structure: string;
  rating: number;
  text: string;
  date: string;
  isCustom?: boolean;
}

export const getInitialComments = (language: "es" | "en" | "fr"): CommentEntry[] => {
  if (language === "fr") {
    return [
      {
        id: "1",
        name: "Marc-Antoine D.",
        structure: "Structure Concentrée",
        rating: 5,
        text: "L'analyse est étonnamment précise ! C'est incroyable de voir comment les lois de Louis Corman sur la rétraction se traduisent directement en traits de personnalité.",
        date: "2026-06-28"
      },
      {
        id: "2",
        name: "Sophie Laurent",
        structure: "Structure Dilatée",
        rating: 5,
        text: "J'ai adoré l'analyse des récepteurs affectifs. Cela m'a aidé à comprendre ma propension naturelle à l'empathie et à la communication.",
        date: "2026-06-25"
      },
      {
        id: "3",
        name: "Jean-Pierre V.",
        structure: "Structure Mixte",
        rating: 4,
        text: "Excellent outil sans publicité ni fioritures inutiles. C'est formidable d'avoir un accès direct à l'analyse morphopsychologique clinique.",
        date: "2026-06-20"
      }
    ];
  } else if (language === "en") {
    return [
      {
        id: "1",
        name: "Eleanor Vance",
        structure: "Concentrated Profile",
        rating: 5,
        text: "Amazingly accurate! Seeing Louis Corman's laws of retraction-expansion mapped in real-time is fascinating. Highly recommend trying the aging simulator too.",
        date: "2026-06-29"
      },
      {
        id: "2",
        name: "David Kim",
        structure: "Expanded Profile",
        rating: 5,
        text: "Very polished interface and profound psychological insights. It's rare to find such high-quality clinical analysis tools online without spammy ads.",
        date: "2026-06-27"
      },
      {
        id: "3",
        name: "Clarissa M.",
        structure: "Mixed Profile",
        rating: 4,
        text: "I'm genuinely impressed by the depth of the PDF report. The layout is beautiful, and the biometrics are spot on.",
        date: "2026-06-24"
      }
    ];
  } else {
    // Default: Spanish
    return [
      {
        id: "1",
        name: "Alejandro Gómez",
        structure: "Estructura Concentrada",
        rating: 5,
        text: "¡La precisión es asombrosa! Es fascinante ver reflejadas las leyes de retracción de Louis Corman directamente en rasgos de personalidad reales.",
        date: "2026-06-30"
      },
      {
        id: "2",
        name: "Valentina Rossi",
        structure: "Estructura Dilatada",
        rating: 5,
        text: "Me encantó el análisis de los receptores afectivos. Me ayudó a comprender mi apertura natural hacia el entorno y cómo canalizar mi energía.",
        date: "2026-06-28"
      },
      {
        id: "3",
        name: "Héctor Silva",
        structure: "Estructura Mixta",
        rating: 4,
        text: "Excelente herramienta para explorar la morfopsicología clínica. El diseño visual es impecable y la ausencia de publicidad molesta se agradece muchísimo.",
        date: "2026-06-25"
      }
    ];
  }
};
