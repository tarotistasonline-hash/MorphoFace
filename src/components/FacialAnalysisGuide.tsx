import React, { useState } from "react";
import { BookOpen, Sparkles, Brain, Heart, Zap, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage, Language } from "../context/LanguageContext";

interface GuideText {
  title: string;
  subtitle: string;
  intro: string;
  tab_law: string;
  tab_zones: string;
  tab_receivers: string;
  law_dilated_tag: string;
  law_dilated_title: string;
  law_dilated_desc: string;
  law_retracted_tag: string;
  law_retracted_title: string;
  law_retracted_desc: string;
  law_rule_title: string;
  law_rule_desc: string;
  zones_intro: string;
  zone_sup_title: string;
  zone_sup_desc: string;
  zone_mid_title: string;
  zone_mid_desc: string;
  zone_inf_title: string;
  zone_inf_desc: string;
  receivers_intro: string;
  receiver_eyes_label: string;
  receiver_eyes_desc: string;
  receiver_nose_label: string;
  receiver_nose_desc: string;
  receiver_mouth_label: string;
  receiver_mouth_desc: string;
  disclaimer: string;
}

const guideTranslations: Record<Language, GuideText> = {
  es: {
    title: "Principios de Morfopsicología",
    subtitle: "CÓMO CONVERGEN LA FISIOGNOMÍA Y EL TEMPERAMENTO",
    intro: "Desarrollada en 1937 por el psiquiatra francés Louis Corman, la Morfopsicología es el estudio clínico del carácter humano, las aptitudes y las predisposiciones psicológicas a través de las formas estructurales y las proporciones del rostro. Es una exploración científica del equilibrio biológico.",
    tab_law: "1. Dilatación vs Retracción",
    tab_zones: "2. Las Tres Zonas Faciales",
    tab_receivers: "3. Los Receptores Faciales",
    law_dilated_tag: "DILATADO (RECEPTIVO/EXPANSIVO)",
    law_dilated_title: "Rostro Ancho, Nutrido y Receptivo",
    law_dilated_desc: "Cuando el entorno se percibe como seguro o acogedor, la estructura facial tiende a expandirse o dilatarse. Representa una sociabilidad abierta, adaptabilidad sensorial, calidez emocional y resiliencia natural. Las personas dilatadas reaccionan con un interés global frente al medio.",
    law_retracted_tag: "CONCENTRADO (SELECTIVO/RETRAÍDO)",
    law_retracted_title: "Rostro Estrecho, Óseo y Selectivo",
    law_retracted_desc: "Cuando el entorno presenta obstáculos, estímulos hostiles o exceso de demandas, el organismo construye defensas replegando facciones y estrechando receptores. Indica alta selectividad relacional, intenso foco mental, independencia y reserva privada.",
    law_rule_title: "La Regla Dinámica",
    law_rule_desc: "Nadie es completamente estático bajo una sola ley. La estructura ósea (el marco) representa nuestra predisposición hereditaria permanente, mientras que el tono de las carnes y la musculatura facial indican nuestro estado de adaptación activo y actual.",
    zones_intro: "El rostro se divide de forma horizontal en tres grandes zonas de desarrollo, correspondientes a distintos vectores de la vida biológica y mental:",
    zone_sup_title: "ZONA SUPERIOR / CEREBRAL",
    zone_sup_desc: "Desde el Nacimiento del Pelo hasta las Cejas: Representa el territorio intelectual y reflexivo. Una frente amplia apunta a la imaginación creadora e idealismo; sienes modeladas indican aptitud para el análisis profundo.",
    zone_mid_title: "ZONA MEDIA / AFECTIVA",
    zone_mid_desc: "Desde las Cejas hasta la Base de la Nariz: Representa la esfera afectiva y relacional. Dominada por los ojos, la nariz y los pómulos. Refleja cómo filtramos los afectos, la empatía y nuestras defensas emocionales.",
    zone_inf_title: "ZONA INFERIOR / ACTIVA",
    zone_inf_desc: "Desde la Base de la Nariz hasta el Mentón: Representa la esfera instintiva, motora y material. Dominada por la boca, la mandíbula y el mentón. Controla la resistencia física, la realización práctica, la asimilación y el instinto de preservación.",
    receivers_intro: "Los Receptores son las ventanas sensoriales (ojos, nariz, boca) por donde ingresa la información del mundo exterior. Su nivel de solidez, apertura o protección define nuestra estrategia de filtro:",
    receiver_eyes_label: "OJOS (Cerebral):",
    receiver_eyes_desc: "Muestran cómo captamos la información visual e intelectual. Ojos amplios absorben datos al instante; ojos protegidos o hundidos analizan con cautela antes de asimilar.",
    receiver_nose_label: "NARIZ (Afectivo):",
    receiver_nose_desc: "Regula los intercambios con los demás. Un tabique alto y protegido preserva el ámbito afectivo frente al dolor; fosas nasales abiertas y anchas asimilan las influencias de forma espontánea.",
    receiver_mouth_label: "BOCA (Sensorial):",
    receiver_mouth_desc: "Mide la vitalidad física, el apetito material y el intercambio directo con el medio. Labios carnosos denotan generosidad y disfrute; labios finos simbolizan rigurosidad y contención.",
    disclaimer: "Morfoface es un portal de divulgación humanística y bienestar basado en conceptos tradicionales de morfopsicología. Utiliza estas lecturas de forma recreativa y constructiva para el autoconocimiento.",
  },
  en: {
    title: "Principles of Morphopsychology",
    subtitle: "HOW PHYSIOGNOMY AND TEMPERAMENT CONVERGE",
    intro: "Developed in 1937 by French psychiatrist Louis Corman, Morphopsychology is the clinical study of human character, aptitudes, and psychological predispositions through the structural shapes and proportions of the face. It is a scientific exploration of biological balance.",
    tab_law: "1. Dilatation vs Retraction",
    tab_zones: "2. The Three Facial Zones",
    tab_receivers: "3. The Facial Receivers",
    law_dilated_tag: "DILATED (RECEPTIVE/EXPANSIVE)",
    law_dilated_title: "Wide, Nourished and Receptive Face",
    law_dilated_desc: "When the environment is perceived as safe or welcoming, the facial structure tends to expand or dilate. This represents open sociability, sensory adaptability, emotional warmth, and natural resilience. Dilated individuals react with a global interest toward their surroundings.",
    law_retracted_tag: "RETRACTED (SELECTIVE/FOCUSED)",
    law_retracted_title: "Narrow, Bony and Selective Face",
    law_retracted_desc: "When the environment presents obstacles, hostile stimuli, or excessive demands, the organism builds defenses by pulling back features and narrowing receptors. This indicates high relational selectivity, intense mental focus, independence, and a private reserve.",
    law_rule_title: "The Dynamic Rule",
    law_rule_desc: "Nobody is completely static under a single law. The skeletal structure (the frame) represents our permanent hereditary predisposition, while facial muscle tone and flesh indicate our active, current state of adaptation.",
    zones_intro: "The face is divided horizontally into three main zones of development, corresponding to different vectors of biological and mental life:",
    zone_sup_title: "UPPER / CEREBRAL ZONE",
    zone_sup_desc: "From Hairline to Eyebrows: Represents the intellectual and reflective territory. A wide forehead points to space for creative imagination and idealism; modeled temples indicate aptitude for deep analysis.",
    zone_mid_title: "MIDDLE / AFFECTIVE ZONE",
    zone_mid_desc: "From Eyebrows to the Base of the Nose: Represents the affective and relational sphere. Dominated by eyes, nose, and cheekbones. Reflects how we filter warmth, empathy, and emotional defenses.",
    zone_inf_title: "LOWER / ACTIVE ZONE",
    zone_inf_desc: "From the Base of the Nose to the Chin: Represents the instinctive, motor, and material sphere. Dominated by the mouth, jaw, and chin. Controls physical endurance, practical execution, assimilation, and self-preservation instinct.",
    receivers_intro: "The Receivers are the sensory windows (eyes, nose, mouth) through which information from the outside world enters. Their strength, openness, or level of protection defines our filtering strategy:",
    receiver_eyes_label: "EYES (Cerebral):",
    receiver_eyes_desc: "Show how we absorb visual and intellectual information. Wide eyes absorb data instantly; protected or deep-set eyes analyze cautiously before assimilating.",
    receiver_nose_label: "NOSE (Affective):",
    receiver_nose_desc: "Regulates emotional exchanges with others. A high and protected nose bridge shelters affection from harm; open and wide nostrils assimilate influences spontaneously.",
    receiver_mouth_label: "MOUTH (Sensorial):",
    receiver_mouth_desc: "Measures physical vitality, material appetite, and direct exchange with the environment. Fleshy lips denote generosity and enjoyment; fine lips symbolize rigor and containment.",
    disclaimer: "Morphoface is an educational discovery portal based on traditional concepts of morphopsychology. Please use these readings in a recreational and constructive way for self-understanding.",
  },
  fr: {
    title: "Principes de Morphopsychologie",
    subtitle: "CONVERGENCE DE LA PHYSIOGNOMONIE ET DU TEMPÉRAMENT",
    intro: "Développée en 1937 por le psychiatre français Louis Corman, la Morphopsychologie est l'étude clinique du caractère humain, des aptitudes et des prédispositions psychologiques à travers la structure et les proportions du visage. C'est une exploration de l'équilibre biologique.",
    tab_law: "1. Dilatation vs Rétraction",
    tab_zones: "2. Les Trois Zones Faciales",
    tab_receivers: "3. Les Récepteurs Faciaux",
    law_dilated_tag: "DILATÉ (RÉCEPTIF/EXPANSIF)",
    law_dilated_title: "Visage Large, Nourri et Réceptif",
    law_dilated_desc: "Quand l'environnement est perçu comme sûr ou accueillant, la structure faciale a tendance à s'élargir ou se dilater. Cela représente une sociabilité ouverte, une adaptabilité sensorielle, de la chaleur émotionnelle et une résilience naturelle. Les personnes dilatées réagissent avec intérêt.",
    law_retracted_tag: "RÉTRACTÉ (SÉLECTIF/REPLIÉ)",
    law_retracted_title: "Visage Étroit, Osseux et Sélectif",
    law_retracted_desc: "Quand l'environnement présente des obstacles, des stimuli hostiles ou trop d'exigences, l'organisme bâtit des défenses en resserrant les récepteurs. Cela indique une haute sélectivité relationnelle, une attention mentale intense et une indépendance.",
    law_rule_title: "La Règle Dynamique",
    law_rule_desc: "Personne n'est figé sous une seule loi absolue. La structure osseuse (le cadre) représente notre prédisposition héréditaire permanente, tandis que le tonus de la peau et de la musculature indique l'état d'adaptation actif.",
    zones_intro: "Le visage se divise horizontalement en trois grandes zones de développement, correspondant aux différents axes de la vie biologique et mentale :",
    zone_sup_title: "ZONE SUPÉRIEURE / CÉRÉBRALE",
    zone_sup_desc: "De la Naissance des Cheveux aux Sourcils: Représente le territoire intellectuel et réflexif. Un front large évoque l'imagination créatrice et l'idéalisme ; des tempes sculptées indiquent une capacité d'analyse profonde.",
    zone_mid_title: "ZONE MEDIANE / AFFECTIVE",
    zone_mid_desc: "Des Sourcils à la Base du Nez: Représente la sphère affective et relationnelle. Dominée par les yeux, le nez et les pommettes, elle reflète notre gestion des sentiments, notre empathie et nos barrières affectives.",
    zone_inf_title: "ZONE INFÉRIEURE / ACTIVE",
    zone_inf_desc: "De la Base du Nez au Menton: Représente la sphère instinctive, motrice et matérielle. Dominée par la bouche et la mâchoire, elle gouverne la résistance physique, l'exécution concrète, la conservation et l'assimilation.",
    receivers_intro: "Les Récepteurs sont les fenêtres sensorielles (yeux, nez, bouche) par lesquelles entrent les informations du monde extérieur. Leur niveau de protection définit la stratégie de filtration :",
    receiver_eyes_label: "YEUX (Cérébral) :",
    receiver_eyes_desc: "Montrent comment nous captons l'environnement visuel et intellectuel. De grands yeux absorbent les données à l'instant; des yeux enfoncés analysent prudemment avant d'assimiler.",
    receiver_nose_label: "NEZ (Affectif) :",
    receiver_nose_desc: "Gouverne nos échanges affectifs avec autrui. Une arête haute protège l'affectivité contre les chocs; des narines larges et ouvertes captent spontanément les influences extérieures.",
    receiver_mouth_label: "BOUCHE (Sensorial) :",
    receiver_mouth_desc: "Mesure la vitalité physique, l'appétit matériel et le contact avec la matière. Des lèvres charnues dénotent la générosité et le plaisir ; des lèvres fines symbolisent le contrôle et la rigueur.",
    disclaimer: "Morphoface est un portail de vulgarisation humaniste et de bien-être fondé sur les préceptes traditionnels de la morphopsychologie. Utilisez ces lectures pour vous divertir et parfaire votre connaissance de soi.",
  }
};

export default function FacialAnalysisGuide() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"law" | "zones" | "receivers">("law");
  const gt = guideTranslations[language] || guideTranslations["es"];

  return (
    <div className="bg-stone-90 w-full border border-stone-800 rounded-2xl bg-stone-950/40 backdrop-blur-md p-6 md:p-8" id="facial-analysis-guide-container">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
          <BookOpen className="w-5 h-5" id="guide-book-icon" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-stone-100 font-sans tracking-tight" id="guide-title">
            {gt.title}
          </h3>
          <p className="text-xs text-stone-400 font-mono select-none" id="guide-subtitle">
            {gt.subtitle}
          </p>
        </div>
      </div>

      <p className="text-sm text-stone-300 leading-relaxed mb-6" id="guide-intro">
        {gt.intro}
      </p>

      {/* Tabs navigation */}
      <div className="flex border-b border-stone-800 gap-2 mb-6 overflow-x-auto pb-1" id="guide-tabs">
        <button
          onClick={() => setActiveTab("law")}
          className={`px-4 py-2 text-xs font-mono rounded-t-lg border-b-2 transition-all duration-300 whitespace-nowrap ${
            activeTab === "law"
              ? "border-amber-400 text-amber-300 bg-stone-900/50 font-bold"
              : "border-transparent text-stone-400 hover:text-stone-200"
          }`}
          id="tab-law-trigger"
        >
          {gt.tab_law}
        </button>
        <button
          onClick={() => setActiveTab("zones")}
          className={`px-4 py-2 text-xs font-mono rounded-t-lg border-b-2 transition-all duration-300 whitespace-nowrap ${
            activeTab === "zones"
              ? "border-amber-400 text-amber-300 bg-stone-900/50 font-bold"
              : "border-transparent text-stone-400 hover:text-stone-200"
          }`}
          id="tab-zones-trigger"
        >
          {gt.tab_zones}
        </button>
        <button
          onClick={() => setActiveTab("receivers")}
          className={`px-4 py-2 text-xs font-mono rounded-t-lg border-b-2 transition-all duration-300 whitespace-nowrap ${
            activeTab === "receivers"
              ? "border-amber-400 text-amber-300 bg-stone-900/50 font-bold"
              : "border-transparent text-stone-400 hover:text-stone-200"
          }`}
          id="tab-receivers-trigger"
        >
          {gt.tab_receivers}
        </button>
      </div>

      {/* Tab contents */}
      <div className="min-h-[220px]" id="guide-tab-content-wrapper">
        <AnimatePresence mode="wait">
          {activeTab === "law" && (
            <motion.div
              key="law-tab-content"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
              id="law-tab-content"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stone-900/40 p-4 border border-stone-850 rounded-xl space-y-2">
                  <span className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {gt.law_dilated_tag}
                  </span>
                  <h4 className="text-sm font-semibold text-stone-100">{gt.law_dilated_title}</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {gt.law_dilated_desc}
                  </p>
                </div>

                <div className="bg-stone-900/40 p-4 border border-stone-850 rounded-xl space-y-2">
                  <span className="inline-block text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                    {gt.law_retracted_tag}
                  </span>
                  <h4 className="text-sm font-semibold text-stone-100">{gt.law_retracted_title}</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {gt.law_retracted_desc}
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 bg-amber-955/20 p-3.5 border border-amber-900/30 rounded-xl text-stone-300">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" id="guide-sparkles-icon" />
                <p className="text-xs leading-normal">
                  <strong>{gt.law_rule_title}:</strong> {gt.law_rule_desc}
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "zones" && (
            <motion.div
              key="zones-tab-content"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
              id="zones-tab-content"
            >
              <p className="text-xs text-stone-400" id="zones-intro-txt">
                {gt.zones_intro}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-stone-900/30 border border-stone-850 p-4 rounded-xl space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <h5 className="text-xs font-mono text-purple-300 font-bold">{gt.zone_sup_title}</h5>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {gt.zone_sup_desc}
                  </p>
                </div>

                <div className="bg-stone-900/30 border border-stone-850 p-4 rounded-xl space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <h5 className="text-xs font-mono text-rose-300 font-bold">{gt.zone_mid_title}</h5>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {gt.zone_mid_desc}
                  </p>
                </div>

                <div className="bg-stone-900/30 border border-stone-850 p-4 rounded-xl space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-400" />
                    <h5 className="text-xs font-mono text-orange-300 font-bold">{gt.zone_inf_title}</h5>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {gt.zone_inf_desc}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "receivers" && (
            <motion.div
              key="receivers-tab-content"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
              id="receivers-tab-content"
            >
              <p className="text-xs text-stone-300 leading-relaxed" id="receivers-explanation">
                {gt.receivers_intro}
              </p>

              <div className="space-y-3" id="receivers-list">
                <div className="flex gap-3 text-xs text-stone-300" id="receiver-eyes-item">
                  <span className="font-mono text-amber-400 w-28 shrink-0 font-bold">{gt.receiver_eyes_label}</span>
                  <span>{gt.receiver_eyes_desc}</span>
                </div>
                <div className="flex gap-3 text-xs text-stone-300" id="receiver-nose-item">
                  <span className="font-mono text-amber-400 w-28 shrink-0 font-bold">{gt.receiver_nose_label}</span>
                  <span>{gt.receiver_nose_desc}</span>
                </div>
                <div className="flex gap-3 text-xs text-stone-300" id="receiver-mouth-item">
                  <span className="font-mono text-amber-400 w-28 shrink-0 font-bold">{gt.receiver_mouth_label}</span>
                  <span>{gt.receiver_mouth_desc}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 pt-5 border-t border-stone-855 flex items-center gap-2 text-[11px] text-stone-400" id="disclaimer-block">
        <Info className="w-3.5 h-3.5 text-stone-500 shrink-0" />
        <span>{gt.disclaimer}</span>
      </div>
    </div>
  );
}
