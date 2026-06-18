import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define languages
export type Language = "es" | "en" | "fr";

export interface Translations {
  app_title: string;
  app_tagline: string;
  sim_mode: string;
  sim_zones: string;
  pitch_title: string;
  pitch_desc: string;
  start_camera: string;
  upload_photo: string;
  limited_remote: string;
  high_demand_msg: string;
  select_archetype: string;
  high_demand_active: string;
  high_demand_long_desc: string;
  high_demand_title: string;
  high_demand_subtitle: string;
  general_report_title: string;
  face_shape_label: string;
  env_type_label: string;
  temperament_label: string;
  report_summary_desc_prefix: string;
  report_summary_desc_mid: string;
  report_summary_desc_suffix: string;
  report_summary_desc_suffix_2: string;
  tabs_zones: string;
  tabs_features: string;
  tabs_timeline: string;
  zone_intellectual_label: string;
  zone_emotional_label: string;
  zone_instinctive_label: string;
  dominant_decision_label: string;
  dominant_sec_intellectual: string;
  dominant_sec_emotional: string;
  dominant_sec_instinctive: string;
  receiver_eyes_title: string;
  receiver_nose_title: string;
  receiver_mouth_title: string;
  eyes_tag: string;
  nose_tag: string;
  mouth_tag: string;
  receiver_relation_text: string;
  timeline_past_title: string;
  timeline_present_title: string;
  timeline_future_title: string;
  strengths_title: string;
  growth_areas_title: string;
  footer_text_1: string;
  footer_text_2: string;
  footer_copyright: string;
  
  // Landmarks
  landmark_forehead_left: string;
  landmark_forehead_right: string;
  landmark_left_eye: string;
  landmark_right_eye: string;
  landmark_nose_tip: string;
  landmark_left_cheekbone: string;
  landmark_right_cheekbone: string;
  landmark_mouth_left: string;
  landmark_mouth_right: string;
  landmark_chin_point: string;
  landmark_receiver_prefix: string;
  landmark_click_msg: string;

  // Sandbox Simulator translation
  sandbox_header: string;
  sandbox_desc: string;
  sim_intellectual: string;
  sim_emotional: string;
  sim_instinctive: string;
  sim_outcome_title: string;
  sim_outcome_intellectual: string;
  sim_outcome_emotional: string;
  sim_outcome_instinctive: string;

  // Camera Capture translation
  camera_title: string;
  camera_subtitle: string;
  camera_align_msg: string;
  camera_guide_intellectual: string;
  camera_guide_emotional: string;
  camera_guide_instinctive: string;
  camera_capture_btn: string;
  camera_err_msg: string;
  camera_retry_btn: string;
  camera_loading_msg: string;
  pulse_green_dots: string;
}

export const translations: Record<Language, Translations> = {
  es: {
    app_title: "MORPHOFACE",
    app_tagline: "Estudio de Morfopsicología e Inteligencia Fisiognómica",
    sim_mode: "Modo: Simulador",
    sim_zones: "Simular Zonas",
    pitch_title: "¿Qué revela tu arquitectura facial?",
    pitch_desc: "La morfopsicología estudia la relación entre las formas biológicas de tu rostro y tu temperamento conductual. Sube un retrato frontal, usa el escáner de cámara o selecciona perfiles clásicos para calibrar las proporciones intelectuales, emocionales e instintivas con el motor Gemini.",
    start_camera: "Escanear Rostro",
    upload_photo: "Subir Foto",
    limited_remote: "Lectura Remota Limitada",
    high_demand_msg: "Hemos activado el análisis local de respaldo para que puedas disfrutar de la experiencia del perfil seleccionado de forma estable.",
    select_archetype: "O selecciona un arquetipo clásico Corman:",
    high_demand_active: "¡Modo Adaptativo por Alta Demanda Activado!",
    high_demand_long_desc: "El servidor central de IA experimentó una sobrecarga ocasional. Para garantizar una lectura al instante, nuestro motor fisiognómico redundante procesó de forma matemática los puntos biométricos y proporciones faciales de tu retrato.",
    high_demand_title: "¡Modo Adaptativo por Alta Demanda Activado!",
    high_demand_subtitle: "El servidor central de IA experimentó una sobrecarga ocasional. Para garantizar una lectura al instante, nuestro motor fisiognómico redundante procesó de forma matemática los puntos biométricos y de proporción facial de tu retrato.",
    general_report_title: "REPORTE GENERAL DE MORFOPSICOLOGÍA",
    face_shape_label: "Forma del Rostro:",
    env_type_label: "TIPO DE ENTORNO",
    temperament_label: "TEMPERAMENTO",
    report_summary_desc_prefix: "El rostro de ",
    report_summary_desc_mid: " se categoriza en la ley de dilatación-retracción como ",
    report_summary_desc_suffix: ". Su temperamento dominante es ",
    report_summary_desc_suffix_2: ", con una notable armonía ósea y receptiva que influye directamente en su toma de decisiones cotidianas.",
    tabs_zones: "Las 3 Zonas",
    tabs_features: "Los Receptores",
    tabs_timeline: "Línea de Tiempo",
    zone_intellectual_label: "ZONA SUPERIOR (CEREBRAL e IDEAS)",
    zone_emotional_label: "ZONA MEDIA (AFECTIVA y ADAPTABILIDAD)",
    zone_instinctive_label: "ZONA INFERIOR (INSTINTIVA y MATERIAL)",
    dominant_decision_label: "ZONA DE TOMA DE DECISIONES DOMINANTE:",
    dominant_sec_intellectual: "Sector Intelectual / Mental",
    dominant_sec_emotional: "Sector Afectivo / Social",
    dominant_sec_instinctive: "Sector Realizador Instintivo",
    receiver_eyes_title: "Ojos: ",
    receiver_nose_title: "Nariz: ",
    receiver_mouth_title: "Boca y Mandíbula: ",
    eyes_tag: "RECEPTOR COGNITIVO",
    nose_tag: "RECEPTOR DE PROTECCIÓN",
    mouth_tag: "RECEPTOR VITAL",
    receiver_relation_text: "Relación Órgano-Rostro: Los receptores de menor tamaño o más protegidos (tipo Concentrado) concentran la energía con máxima precisión, requiriendo más tiempo para asimilar información relacional. Los de mayor tamaño (tipo Dilatado) absorben inmediatamente las influencias, mostrando adaptabilidad y reacción instantánea.",
    timeline_past_title: "EL PASADO (HERENCIA Y MARCO ÓSEO)",
    timeline_present_title: "EL PRESENTE (TONO MUSCULAR ACTIVO)",
    timeline_future_title: "EL FUTURO (CONSEJO DE EQUILIBRIO)",
    strengths_title: "Fortalezas Derivadas",
    growth_areas_title: "Áreas de Crecimiento",
    footer_text_1: "MORPHOFACE ESTUDIO FISIOGNÓMICO • DESARROLLADO PARA ENTRETENIMIENTO CIENTÍFICO E ILUSTRATIVO",
    footer_text_2: "Basado en la obra de Louis Corman “Morfopsicología del Rostro” (1937) y algoritmos modernos de análisis espectral de rasgos. Tus retratos escaneados se procesan en forma efímera y segura en el servidor de IA.",
    footer_copyright: "Todos los derechos reservados.",
    
    // Landmarks
    landmark_forehead_left: "Frente Izquierda",
    landmark_forehead_right: "Frente Derecha",
    landmark_left_eye: "Ojo Izquierdo",
    landmark_right_eye: "Ojo Derecho",
    landmark_nose_tip: "Punta de la Nariz",
    landmark_left_cheekbone: "Pómulo Izquierdo",
    landmark_right_cheekbone: "Pómulo Derecho",
    landmark_mouth_left: "Comisura Izquierda",
    landmark_mouth_right: "Comisura Derecha",
    landmark_chin_point: "Mentón (Punta del Mentón)",
    landmark_receiver_prefix: "Receptor: ",
    landmark_click_msg: "Interactividad: Haz clic en cualquier nodo relacional brillante para revelar el análisis biológico en este panel.",

    // Sandbox Simulator
    sandbox_header: "SANDBOX DE INTEGRACIÓN DE ZONAS",
    sandbox_desc: "Mueve las barras para simular la dominancia de las tres zonas faciales y ver cómo la morfopsicología valora este tipo de perfiles.",
    sim_intellectual: "Intelectual (Superior)",
    sim_emotional: "Emocional (Media)",
    sim_instinctive: "Instintiva (Inferior)",
    sim_outcome_title: "TENDENCIA DEL TEMPERAMENTO ESTIMADO:",
    sim_outcome_intellectual: "Predilección cerebral con tendencia intelectual reflexiva o melancólica. Persona que acumula ideas, busca modelados lógicos antes de dar el paso físico, y valora mucho el orden estético conceptual.",
    sim_outcome_emotional: "Predilección afectiva relacional con tendencia Sanguínea o empática. El centro de las decisiones radica en los picos emotivos, el bienestar relacional y la aprobación de la comunidad.",
    sim_outcome_instinctive: "Predilección vital instintiva impulsada por fuerzas realizadoras. Alta resistencia para la persistencia de tareas duras y defensa enérgica de su territorio personal.",

    // Camera Capture
    camera_title: "Escaneo Facial en Tiempo Real",
    camera_subtitle: "ALINEA TU ROSTRO AL CENTRO DEL MARCO",
    camera_align_msg: "ALINEA EL ROSTRO AQUÍ",
    camera_guide_intellectual: "ZONA CEREBRAL / INTELECTUAL",
    camera_guide_emotional: "ZONA AFECTIVA / EMOCIONAL",
    camera_guide_instinctive: "ZONA ACTIVA / INSTINTIVA",
    camera_capture_btn: "Capturar y Analizar",
    camera_err_msg: "No se pudo acceder a la cámara. Por favor, verifica los permisos del navegador o asegúrate de que no esté en uso por otra aplicación.",
    camera_retry_btn: "Intentar de nuevo",
    camera_loading_msg: "Iniciando la cámara...",
    pulse_green_dots: "pulse puntos verdes",
  },
  en: {
    app_title: "MORPHOFACE",
    app_tagline: "Morphopsychology & Physiognomic Intelligence Study",
    sim_mode: "Mode: Simulator",
    sim_zones: "Simulate Zones",
    pitch_title: "What does your facial architecture reveal?",
    pitch_desc: "Morphopsychology studies the relationship between the biological shapes of your face and your behavioral temperament. Upload a portrait, use the live camera scanner, or select classic profiles to calibrate intellectual, emotional, and instinctive proportions with the Gemini engine.",
    start_camera: "Scan Face",
    upload_photo: "Upload Photo",
    limited_remote: "Limited Remote Reading",
    high_demand_msg: "We have activated the local backup analysis so that you can enjoy the selected profile experience stably.",
    select_archetype: "Or select a classic Corman archetype:",
    high_demand_active: "Adaptive Mode Activated (High Demand)!",
    high_demand_long_desc: "The central AI server experienced temporary high demand. To guarantee an instant reading, our redundant physiognomic engine mathematically processed the biometric points and facial proportions of your portrait.",
    high_demand_title: "Adaptive Mode Activated (High Demand)!",
    high_demand_subtitle: "The central AI server experienced temporary high demand. To guarantee an instant reading, our redundant physiognomic engine mathematically processed the biometric points and facial proportions of your portrait.",
    general_report_title: "GENERAL MORPHOPSYCHOLOGY REPORT",
    face_shape_label: "Face Shape:",
    env_type_label: "ENVIRONMENT TYPE",
    temperament_label: "TEMPERAMENT",
    report_summary_desc_prefix: "The face of ",
    report_summary_desc_mid: " is categorized under the Corman law of dilation-retraction as ",
    report_summary_desc_suffix: ". Their dominant temperament is ",
    report_summary_desc_suffix_2: ", with a notable osseous and receptive harmony directly influencing daily decision-making.",
    tabs_zones: "The 3 Zones",
    tabs_features: "The Receivers",
    tabs_timeline: "Timeline",
    zone_intellectual_label: "UPPER ZONE (INTELLECT & IDEAS)",
    zone_emotional_label: "MIDDLE ZONE (EMOTION & ADAPTABILITY)",
    zone_instinctive_label: "LOWER ZONE (INSTINCT & MATERIAL)",
    dominant_decision_label: "DOMINANT DECISION-MAKING ZONE:",
    dominant_sec_intellectual: "Intellectual / Mental Sector",
    dominant_sec_emotional: "Emotional / Social Sector",
    dominant_sec_instinctive: "Instinctive Realizer Sector",
    receiver_eyes_title: "Eyes: ",
    receiver_nose_title: "Nose: ",
    receiver_mouth_title: "Mouth and Jaw: ",
    eyes_tag: "COGNITIVE RECEIVER",
    nose_tag: "PROTECTION RECEIVER",
    mouth_tag: "VITAL RECEIVER",
    receiver_relation_text: "Organ-Face Relationship: Smaller or more protected receptors (Concentrated type) focus energy with maximum precision, requiring more time to assimilate relational information. Larger ones (Dilated type) absorb influences immediately, showing adaptability and instant reaction.",
    timeline_past_title: "THE PAST (HERITAGE & OSSEOUS FRAME)",
    timeline_present_title: "THE PRESENT (ACTIVE MUSCULAR TONE)",
    timeline_future_title: "THE FUTURE (HARMONY ADVICE)",
    strengths_title: "Derived Strengths",
    growth_areas_title: "Growth Areas",
    footer_text_1: "MORPHOFACE PHYSIOGNOMIC STUDY • VELOPED FOR SCIENTIFIC AND ILLUSTRATIVE ENTERTAINMENT",
    footer_text_2: "Based on Louis Corman's work 'Morphopsychology of the Face' (1937) and modern spectral analysis algorithms of features. Your scanned portraits are processed temporarily and securely on the AI server.",
    footer_copyright: "All rights reserved.",
    
    // Landmarks
    landmark_forehead_left: "Forehead Left",
    landmark_forehead_right: "Forehead Right",
    landmark_left_eye: "Left Eye",
    landmark_right_eye: "Right Eye",
    landmark_nose_tip: "Nose Tip",
    landmark_left_cheekbone: "Left Cheekbone",
    landmark_right_cheekbone: "Right Cheekbone",
    landmark_mouth_left: "Mouth Left Corner",
    landmark_mouth_right: "Mouth Right Corner",
    landmark_chin_point: "Chin (Chin Point)",
    landmark_receiver_prefix: "Receiver: ",
    landmark_click_msg: "Interactive: Click on any bright relational node to reveal its biological analysis on this panel.",

    // Sandbox Simulator
    sandbox_header: "ZONES INTEGRATION SANDBOX",
    sandbox_desc: "Move the sliders to simulate the dominance of the three facial zones and observe how morphopsychology evaluates these types of profiles.",
    sim_intellectual: "Intellectual (Upper)",
    sim_emotional: "Emotional (Middle)",
    sim_instinctive: "Instinctive (Lower)",
    sim_outcome_title: "ESTIMATED TEMPERAMENT TENDENCY:",
    sim_outcome_intellectual: "Cerebral predilection with reflective intellectual or melancholic tendency. Accumulates ideas, seeks logical constructs before acting physically, and deeply values conceptual aesthetics.",
    sim_outcome_emotional: "Relational affective predilection with Sanguine or empathetic tendency. Decision-making is centered on emotional values, relational well-being, and community support.",
    sim_outcome_instinctive: "Vital instinctive predilection driven by execution forces. High stamina for enduring hard work and energetic security in safeguarding personal territories.",

    // Camera Capture
    camera_title: "Real-Time Facial Scanner",
    camera_subtitle: "ALIGN YOUR FACE WITH THE CENTER FRAME",
    camera_align_msg: "ALIGN FACE HERE",
    camera_guide_intellectual: "CEREBRAL / INTELLECTUAL ZONE",
    camera_guide_emotional: "AFFECTIVE / EMOTIONAL ZONE",
    camera_guide_instinctive: "ACTIVE / INSTINCTIVE ZONE",
    camera_capture_btn: "Capture & Analyze",
    camera_err_msg: "Could not access camera. Please check browser permissions or verify if another application is using it.",
    camera_retry_btn: "Retry Capture",
    camera_loading_msg: "Starting camera...",
    pulse_green_dots: "pulse green dots",
  },
  fr: {
    app_title: "MORPHOFACE",
    app_tagline: "Étude de Morphopsychologie & d'Intelligence Physiognomonique",
    sim_mode: "Mode : Simulateur",
    sim_zones: "Simuler les Zones",
    pitch_title: "Que révèle votre architecture faciale ?",
    pitch_desc: "La morphopsychologie étudie la relation entre les formes biologiques de votre visage et votre tempérament comportemental. Téléchargez un portrait, utilisez le scanner de caméra direct ou sélectionnez des profils classiques pour calibrer les proportions intellectuelles, émotionnelles et instinctives avec le moteur Gemini.",
    start_camera: "Scanner le Visage",
    upload_photo: "Téléverser Photo",
    limited_remote: "Analyse À Distance Limitée",
    high_demand_msg: "Nous avons activé l'analyse locale de sauvegarde afin que vous puissiez profiter sereinement de l'expérience du profil sélectionné.",
    select_archetype: "Ou sélectionnez un archétype classique Corman :",
    high_demand_active: "Mode Adaptatif Activé (Haute Demande) !",
    high_demand_long_desc: "Le serveur d'IA central a connu une forte demande temporaire. Pour garantir une lecture instantanée, notre moteur physiognomonique redondant a traité mathématiquement les points biométriques et les proportions faciales de votre portrait.",
    high_demand_title: "Mode Adaptatif Activé (Haute Demande) !",
    high_demand_subtitle: "Le serveur d'IA central a connu une forte demande temporaire. Pour garantir une lecture instantanée, notre moteur physiognomonique redondant a traité mathématiquement les points biométriques et les proportions faciales de votre portrait.",
    general_report_title: "RAPPORT CRITIQUE DE MORPHOPSYCHOLOGIE",
    face_shape_label: "Forme du Visage :",
    env_type_label: "TYPE D'ENVIRONNEMENT",
    temperament_label: "TEMPÉRAMENT",
    report_summary_desc_prefix: "Le visage de ",
    report_summary_desc_mid: " est classé selon la loi de dilatation-rétraction comme ",
    report_summary_desc_suffix: ". Son tempérament dominant est ",
    report_summary_desc_suffix_2: ", avec une harmonie osseuse et réceptive remarquable qui influence directement ses décisions au quotidien.",
    tabs_zones: "Les 3 Zones",
    tabs_features: "Les Récepteurs",
    tabs_timeline: "Chronologie",
    zone_intellectual_label: "ZONE SUPÉRIEURE (INTELLECT & IDÉES)",
    zone_emotional_label: "ZONE MOYENNE (ÉMOTION & ADAPTABILITÉ)",
    zone_instinctive_label: "ZONE INFÉRIEURE (INSTINCT & MATÉRIEL)",
    dominant_decision_label: "ZONE DE DÉCISION DOMINANTE :",
    dominant_sec_intellectual: "Secteur Intellectuel / Mental",
    dominant_sec_emotional: "Secteur Émotionnel / Social",
    dominant_sec_instinctive: "Secteur Instinctif Réalisateur",
    receiver_eyes_title: "Yeux : ",
    receiver_nose_title: "Nez : ",
    receiver_mouth_title: "Bouche et Mâchoire : ",
    eyes_tag: "RÉCEPTEUR COGNITIF",
    nose_tag: "RÉCEPTEUR DE PROTECTION",
    mouth_tag: "RÉCEPTEUR VITAL",
    receiver_relation_text: "Relation Organe-Visage : Les récepteurs plus petits ou mieux protégés (type Concentré) concentrent l'énergie avec une précision maximale, nécessitant plus de temps pour assimiler l'information relationnelle. Les plus grands (type Dilaté) absorbent immédiatement les influences, montrant de l'adaptabilité et une réaction instantanée.",
    timeline_past_title: "LE PASSÉ (HÉRITAGE & CADRE OSSEUX)",
    timeline_present_title: "LE PRÉSENT (TONUS MUSCULAIRE ACTIF)",
    timeline_future_title: "L'AVENIR (CONSEIL D'HARMONIE)",
    strengths_title: "Forces Dérivées",
    growth_areas_title: "Axes de Croissance",
    footer_text_1: "ÉTUDE PHYSIOGNOMONIQUE MORPHOFACE • CONÇU POUR LE DIVERTISSEMENT SCIENTIFIQUE ET ILLUSTRATIF",
    footer_text_2: "Basé sur l'œuvre de Louis Corman « Morphopsychologie du Visage » (1937) et des algorithmes modernes d'analyse spectrale des traits. Vos portraits scannés sont traités de manière éphémère et sécurisée sur le serveur d'IA.",
    footer_copyright: "Tous droits réservés.",
    
    // Landmarks
    landmark_forehead_left: "Front Gauche",
    landmark_forehead_right: "Front Droit",
    landmark_left_eye: "Œil Gauche",
    landmark_right_eye: "Œil Droit",
    landmark_nose_tip: "Bout du Nez",
    landmark_left_cheekbone: "Pommette Gauche",
    landmark_right_cheekbone: "Pommette Droite",
    landmark_mouth_left: "Commissure Gauche",
    landmark_mouth_right: "Commissure Droite",
    landmark_chin_point: "Menton (Pointe du Menton)",
    landmark_receiver_prefix: "Récepteur : ",
    landmark_click_msg: "Interactif : Cliquez sur n'importe quel nœud relationnel brillant pour révéler son analyse biologique sur ce panneau.",

    // Sandbox Simulator
    sandbox_header: "BAC À SABLE D'INTÉGRATION DES ZONES",
    sandbox_desc: "Déplacez les curseurs pour simuler la dominance des trois zones faciales et observez comment la morphopsychologie évalue ces types de profils.",
    sim_intellectual: "Intellectuel (Supérieur)",
    sim_emotional: "Émotionnel (Moyen)",
    sim_instinctive: "Instinctif (Inférieur)",
    sim_outcome_title: "TENDANCE ESTIMÉE DU TEMPÉRAMENT :",
    sim_outcome_intellectual: "Prédilection cérébrale avec tendance intellectuelle réfléchie ou mélancolique. Accumule les idées, recherche des formes logiques avant d'agir physiquement, et accorde une grande valeur à l'esthétique conceptuelle.",
    sim_outcome_emotional: "Prédilection affective relationnelle avec tendance Sanguine ou empathique. La prise de décision est centrée sur les élans affectifs, le bien-être relationnel et le soutien de la communauté.",
    sim_outcome_instinctive: "Prédilection instinctive vitale portée par des forces réalisatrices. Haute endurance pour l'effort de terrain continu et protection énergique des frontières personnelles.",

    // Camera Capture
    camera_title: "Scanner Facial en Temps Réel",
    camera_subtitle: "ALIGNER LE VISAGE AU CENTRE DE LA SÉLECTION",
    camera_align_msg: "ALIGNER LE VISAGE ICI",
    camera_guide_intellectual: "ZONE CEREBRALE / INTELLECTUELLE",
    camera_guide_emotional: "ZONE AFFECTIVE / EMOTIONNELLE",
    camera_guide_instinctive: "ZONE ACTIVE / INSTINCTIVE",
    camera_capture_btn: "Capturer & Analyser",
    camera_err_msg: "Impossible d'accéder à la caméra. Veuillez vérifier les autorisations du navigateur ou vous assurer qu'elle n'est pas utilisée par une autre application.",
    camera_retry_btn: "Réessayer",
    camera_loading_msg: "Démarrage de la caméra...",
    pulse_green_dots: "pulsation des points verts",
  }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Read saved locale or default to Spanish
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("morphoface-locale");
    return (saved as Language) || "es";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("morphoface-locale", lang);
  };

  const t = (key: keyof Translations): string => {
    return translations[language][key] || translations["es"][key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
