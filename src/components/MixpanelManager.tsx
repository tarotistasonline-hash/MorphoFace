import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import mixpanel from "mixpanel-browser";
import { 
  BarChart2, 
  HelpCircle, 
  Check, 
  ExternalLink, 
  Code, 
  Sparkles, 
  X, 
  ShieldCheck, 
  Sliders,
  Eye,
  EyeOff,
  Activity,
  Terminal,
  Zap,
  RefreshCw
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

// Local storage keys
const MIXPANEL_TOKEN_KEY = "morphoface-mixpanel-token";
const MIXPANEL_ENABLED_KEY = "morphoface-mixpanel-enabled";
const MIXPANEL_ADMIN_LOCKED_KEY = "morphoface-mixpanel-admin-locked";

// Session events for live debugger (reactive via custom events)
export interface TrackedEvent {
  id: string;
  name: string;
  properties: Record<string, any>;
  timestamp: Date;
}

// Global memory cache of tracked events in this browser session
const sessionEventsCache: TrackedEvent[] = [];

// Track an event safely and emit a custom event to notify panels
export function trackMixpanelEvent(eventName: string, properties: Record<string, any> = {}) {
  const timestamp = new Date();
  const eventId = Math.random().toString(36).substring(2, 9);
  
  // Add metadata
  const fullProperties = {
    ...properties,
    url: typeof window !== "undefined" ? window.location.href : "",
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
    screenResolution: typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}` : "",
    time: timestamp.toISOString()
  };

  // Add to session cache
  sessionEventsCache.unshift({
    id: eventId,
    name: eventName,
    properties: fullProperties,
    timestamp
  });

  // Keep cache reasonable
  if (sessionEventsCache.length > 20) {
    sessionEventsCache.pop();
  }

  // 1. Log to Mixpanel if initialized
  try {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem(MIXPANEL_TOKEN_KEY) || (import.meta as any).env?.VITE_MIXPANEL_TOKEN || "";
      const isEnabled = localStorage.getItem(MIXPANEL_ENABLED_KEY) !== "false";

      if (savedToken && isEnabled) {
        // Initialize if not already done (Mixpanel SDK handles multiple init calls safely or we handle it)
        // We use a custom init check
        mixpanel.track(eventName, fullProperties);
        console.log(`[Mixpanel Tracked] "${eventName}"`, fullProperties);
      } else {
        console.log(`[Mixpanel Simulation] "${eventName}" (No active token)`, fullProperties);
      }
    }
  } catch (err) {
    console.warn("Mixpanel tracking error (likely blocked by AdBlocker):", err);
  }

  // 2. Dispatch custom event for the UI to update in real time
  if (typeof window !== "undefined") {
    const customEvent = new CustomEvent("morphoface-mixpanel-track", {
      detail: { eventName, properties: fullProperties, id: eventId, timestamp }
    });
    window.dispatchEvent(customEvent);
  }
}

// React custom hook to subscribe to Mixpanel events and manage configuration
export function useMixpanel() {
  const [token, setToken] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const envToken = (import.meta as any).env?.VITE_MIXPANEL_TOKEN || "";
      const savedToken = localStorage.getItem(MIXPANEL_TOKEN_KEY) || envToken;
      const savedEnabled = localStorage.getItem(MIXPANEL_ENABLED_KEY) !== "false";

      setToken(savedToken);
      setIsEnabled(savedEnabled && !!savedToken);

      if (savedToken && savedEnabled) {
        try {
          mixpanel.init(savedToken, {
            debug: (import.meta as any).env?.DEV || false,
            track_pageview: false,
            persistence: "localStorage",
            ignore_dnt: true // helpful for test beds
          });
        } catch (err) {
          console.warn("Mixpanel initialization skipped or failed:", err);
        }
      }
    }
  }, []);

  return { token, isEnabled, setToken, setIsEnabled };
}

// Translations specific to Mixpanel Panel
const mixpanelTranslations = {
  es: {
    title: "Métricas Gratuitas de Mixpanel",
    subtitle: "Analíticas profesionales en tiempo real para optimizar tu sitio de morfopsicología.",
    guideTitle: "Configurar Cuenta de Mixpanel Gratis",
    guideDesc: "Mixpanel te permite ver de dónde vienen tus visitas, qué reportes generan y qué botones usan en tiempo real de forma 100% gratuita hasta con 20 millones de eventos mensuales.",
    tokenLabel: "Token del Proyecto Mixpanel:",
    tokenPlaceholder: "Pega tu Token de Mixpanel (32 caracteres)",
    step1: "Crea una cuenta gratuita en Mixpanel.com",
    step2: "Entra a Configuración de tu Proyecto (icono de engranaje arriba a la derecha).",
    step3: "Copia el Token del Proyecto (un código alfanumérico de 32 caracteres) y pégalo arriba.",
    step4: "¡Listo! El sistema comenzará a medir automáticamente los escaneos, descargas y clicks.",
    testBtn: "Probar Conexión",
    testSuccess: "¡Evento de prueba enviado! Revisa tu panel en vivo de Mixpanel.",
    saveBtn: "Guardar y Aplicar",
    activeStatus: "Métricas Activas",
    inactiveStatus: "Métricas Inactivas",
    liveDebugger: "Depurador de Eventos en Vivo",
    noEvents: "No se han registrado eventos en esta sesión todavía. ¡Realiza una acción para ver el depurador!",
    eventProperties: "Propiedades",
    localUnlockTip: "Haz click en el candado para editar la configuración de administración.",
    pastedAlert: "Token configurado exitosamente.",
    autoDetect: "Token detectado de las variables de entorno."
  },
  en: {
    title: "Free Mixpanel Analytics",
    subtitle: "Professional real-time analytics to optimize your morphopsychology studio.",
    guideTitle: "Setup Free Mixpanel Account",
    guideDesc: "Mixpanel lets you track where your visitors come from, what reports they generate, and what features they use in real time for 100% free up to 20 million events per month.",
    tokenLabel: "Mixpanel Project Token:",
    tokenPlaceholder: "Paste your Mixpanel Token (32-character string)",
    step1: "Create a free account at Mixpanel.com",
    step2: "Go to your Project Settings (gear icon in the top right corner).",
    step3: "Copy the Project Token (a 32-character alphanumeric code) and paste it above.",
    step4: "Done! The system will immediately track scans, downloads, and user interactions.",
    testBtn: "Test Connection",
    testSuccess: "Test event dispatched! Check your Mixpanel live dashboard.",
    saveBtn: "Save & Apply",
    activeStatus: "Metrics Active",
    inactiveStatus: "Metrics Inactive",
    liveDebugger: "Live Session Event Debugger",
    noEvents: "No events recorded in this session yet. Perform an action to see the debugger in motion!",
    eventProperties: "Properties",
    localUnlockTip: "Click the lock icon to modify the administrator settings.",
    pastedAlert: "Token configured successfully.",
    autoDetect: "Token detected from environment variables."
  },
  fr: {
    title: "Statistiques Gratuites Mixpanel",
    subtitle: "Analyses professionnelles en temps réel pour optimiser votre studio de morphopsychologie.",
    guideTitle: "Configurer un Compte Mixpanel Gratuit",
    guideDesc: "Mixpanel vous permet de voir d'où viennent vos visiteurs, quels rapports ils génèrent et quels boutons ils utilisent, 100% gratuitement jusqu'à 20 millions d'événements par mois.",
    tokenLabel: "Token de Projet Mixpanel :",
    tokenPlaceholder: "Collez votre Token Mixpanel (32 caractères)",
    step1: "Créez un compte gratuit sur Mixpanel.com",
    step2: "Allez dans les Paramètres du projet (icône d'engrenage en haut à droite).",
    step3: "Copiez le Project Token (un code alphanumérique de 32 caractères) et collez-le ci-dessus.",
    step4: "C'est prêt ! Le système mesurera automatiquement les scans, téléchargements et clics.",
    testBtn: "Tester la Connexion",
    testSuccess: "Événement test envoyé ! Vérifiez votre tableau de bord en direct sur Mixpanel.",
    saveBtn: "Enregistrer & Appliquer",
    activeStatus: "Analyses Actives",
    inactiveStatus: "Analyses Inactives",
    liveDebugger: "Débogueur d'Événements en Direct",
    noEvents: "Aucun événement enregistré pour l'instant. Effectuez une action pour voir le débogueur !",
    eventProperties: "Propriétés",
    localUnlockTip: "Cliquez sur le cadenas pour modifier les paramètres de l'administrateur.",
    pastedAlert: "Token configuré avec succès.",
    autoDetect: "Token détecté depuis les variables d'environnement."
  }
};

export default function MixpanelConfigPanel() {
  const { language } = useLanguage();
  const t = mixpanelTranslations[language as "es" | "en" | "fr"] || mixpanelTranslations.es;

  const { token, isEnabled, setToken, setIsEnabled } = useMixpanel();
  const [inputToken, setInputToken] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [isAdminLocked, setIsAdminLocked] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  // Local list of events in debugger
  const [recentEvents, setRecentEvents] = useState<TrackedEvent[]>([]);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      setInputToken(token);
    }
    if (typeof window !== "undefined") {
      const savedLocked = localStorage.getItem(MIXPANEL_ADMIN_LOCKED_KEY) === "true";
      setIsAdminLocked(savedLocked);
    }
    // Load initial events from global cache
    setRecentEvents([...sessionEventsCache]);
  }, [token]);

  // Listen to tracked events to refresh the debugger live
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleNewTrack = () => {
      setRecentEvents([...sessionEventsCache]);
    };

    window.addEventListener("morphoface-mixpanel-track", handleNewTrack);
    return () => {
      window.removeEventListener("morphoface-mixpanel-track", handleNewTrack);
    };
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorState(null);
    const cleanToken = inputToken.trim();

    if (!cleanToken) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(MIXPANEL_TOKEN_KEY);
        localStorage.setItem(MIXPANEL_ENABLED_KEY, "false");
        setToken("");
        setIsEnabled(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
      return;
    }

    // Mixpanel token is typically a 32 character hex string
    if (cleanToken.length < 16) {
      setErrorState(
        language === "es" 
          ? "El token ingresado parece demasiado corto. Generalmente tiene 32 caracteres." 
          : "The token you entered seems too short. It's usually 32 characters long."
      );
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(MIXPANEL_TOKEN_KEY, cleanToken);
      localStorage.setItem(MIXPANEL_ENABLED_KEY, "true");
      
      setToken(cleanToken);
      setIsEnabled(true);
      setSaveSuccess(true);

      // Re-initialize Mixpanel SDK
      try {
        mixpanel.init(cleanToken, {
          debug: process.env.NODE_ENV !== "production",
          track_pageview: false,
          persistence: "localStorage",
          ignore_dnt: true
        });
      } catch (err) {
        console.warn("Failed to re-initialize Mixpanel SDK:", err);
      }

      // Send initial track
      trackMixpanelEvent("Mixpanel Connected", { status: "initialized_by_user" });

      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleToggleActive = () => {
    const nextState = !isEnabled;
    if (typeof window !== "undefined") {
      localStorage.setItem(MIXPANEL_ENABLED_KEY, String(nextState));
      setIsEnabled(nextState);
      if (nextState && token) {
        trackMixpanelEvent("Analytics Enabled", { status: "re-activated" });
      }
    }
  };

  const handleLockToggle = () => {
    const nextLocked = !isAdminLocked;
    setIsAdminLocked(nextLocked);
    if (typeof window !== "undefined") {
      localStorage.setItem(MIXPANEL_ADMIN_LOCKED_KEY, String(nextLocked));
    }
  };

  const handleTestEvent = () => {
    if (!token) return;
    setTestSuccess(true);
    trackMixpanelEvent("Test Connection Clicked", { 
      message: "Hello Mixpanel!", 
      testTime: new Date().toLocaleTimeString(),
      sampleMetricValue: 100
    });
    setTimeout(() => setTestSuccess(false), 4000);
  };

  return (
    <div 
      className="bg-stone-900/40 border border-stone-850/60 rounded-3xl p-6 sm:p-8 max-w-5xl mx-auto shadow-lg space-y-6"
      id="mixpanel-manager-card"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-850/60 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <BarChart2 className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-bold font-sans tracking-tight text-stone-100 uppercase">
              {t.title}
            </h3>
            {(import.meta as any).env?.VITE_MIXPANEL_TOKEN && (
              <span className="text-[9px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase" title={t.autoDetect}>
                ENV Active
              </span>
            )}
          </div>
          <p className="text-xs text-stone-400 font-sans leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Lock/Unlock Switch to Protect Settings */}
        <div className="flex items-center gap-3 bg-stone-950/60 border border-stone-850 rounded-xl px-3.5 py-2" id="mixpanel-lock-pill">
          <button
            onClick={handleLockToggle}
            className={`cursor-pointer p-1.5 rounded-lg border transition-all ${
              isAdminLocked 
                ? "bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200" 
                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
            }`}
            title={t.localUnlockTip}
          >
            {isAdminLocked ? <ShieldCheck className="w-3.5 h-3.5" /> : <Sliders className="w-3.5 h-3.5" />}
          </button>
          
          <button
            onClick={() => setShowPanel(!showPanel)}
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-300 hover:text-amber-400 transition-colors cursor-pointer"
            id="mixpanel-toggle-panel-btn"
          >
            {showPanel 
              ? (language === "es" ? "Ocultar Ajustes" : language === "fr" ? "Masquer" : "Hide Settings") 
              : (language === "es" ? "Administrar Mixpanel" : language === "fr" ? "Gérer Mixpanel" : "Manage Mixpanel")
            }
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden space-y-6"
            id="mixpanel-panel-drawer"
          >
            {/* Split Screen Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Side */}
              <div className="lg:col-span-5 bg-stone-950/40 border border-stone-850/80 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Configuración</span>
                  </h4>
                  {token && (
                    <button
                      onClick={handleToggleActive}
                      disabled={isAdminLocked}
                      className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-tighter border transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        isEnabled 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                          : "bg-red-500/10 border-red-500/20 text-red-400"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                      <span>{isEnabled ? t.activeStatus : t.inactiveStatus}</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                      {t.tokenLabel}
                    </label>
                    <input
                      type="text"
                      value={inputToken}
                      onChange={(e) => {
                        if (!isAdminLocked) {
                          setInputToken(e.target.value);
                          if (errorState) setErrorState(null);
                        }
                      }}
                      placeholder={t.tokenPlaceholder}
                      disabled={isAdminLocked}
                      className={`w-full px-4 py-3 rounded-xl bg-stone-950 border text-xs text-stone-100 placeholder-stone-700 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all ${
                        isAdminLocked ? "opacity-55 cursor-not-allowed border-stone-900" : errorState ? "border-red-500/40" : "border-stone-800"
                      }`}
                    />
                  </div>

                  {errorState && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-[11px] text-red-400 font-sans rounded-xl leading-relaxed">
                      ⚠️ {errorState}
                    </div>
                  )}

                  {isAdminLocked && (
                    <div className="p-3 bg-stone-900/30 border border-stone-850 text-[10px] text-stone-500 font-sans rounded-xl leading-normal flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-stone-600 shrink-0" />
                      <span>{language === "es" ? "Ajustes bloqueados para evitar cambios accidentales de tus visitas. Haz click en el candado arriba para editarlos." : "Settings locked. Click the shield icon in the top right corner to edit your token details."}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isAdminLocked}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold font-sans tracking-wide transition-all uppercase cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover:shadow-amber-500/10 duration-200"
                    >
                      {saveSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-stone-950" />
                          <span>Listo</span>
                        </>
                      ) : (
                        <span>{t.saveBtn}</span>
                      )}
                    </button>

                    {token && (
                      <button
                        type="button"
                        onClick={handleTestEvent}
                        className="px-3.5 py-2.5 rounded-xl border border-stone-850 hover:border-stone-750 bg-stone-950 text-stone-300 hover:text-amber-400 text-xs font-bold tracking-wide transition-all uppercase cursor-pointer flex items-center justify-center gap-1.5 duration-200"
                        title="Send test event to Mixpanel live dashboard"
                      >
                        {testSuccess ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span>{t.testBtn}</span>
                      </button>
                    )}
                  </div>
                </form>

                {testSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-sans rounded-xl leading-normal"
                  >
                    🚀 {t.testSuccess}
                  </motion.div>
                )}

                {/* Helpful quick guide trigger */}
                <button
                  onClick={() => setShowGuide(!showGuide)}
                  className="w-full text-left flex items-center justify-between p-3.5 rounded-xl bg-stone-900/30 border border-stone-850/60 text-[11px] text-stone-400 hover:text-stone-200 transition-colors cursor-pointer font-sans"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-500/60" />
                    <strong className="text-stone-300 font-semibold">{t.guideTitle}</strong>
                  </span>
                  <span>{showGuide ? "▲" : "▼"}</span>
                </button>

                <AnimatePresence>
                  {showGuide && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-stone-950/80 border border-stone-850 rounded-xl text-[11px] text-stone-400 font-sans leading-relaxed space-y-2.5 overflow-hidden"
                    >
                      <p className="text-stone-300 font-medium">
                        {t.guideDesc}
                      </p>
                      <ol className="list-decimal pl-4 space-y-1.5 text-stone-400">
                        <li>{t.step1}</li>
                        <li>{t.step2}</li>
                        <li>{t.step3}</li>
                        <li>{t.step4}</li>
                      </ol>
                      <div className="pt-1.5 border-t border-stone-900 flex justify-end">
                        <a
                          href="https://mixpanel.com"
                          target="_blank"
                          referrerPolicy="no-referrer"
                          className="text-[10px] font-mono text-amber-400 hover:text-amber-300 underline underline-offset-4 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Visitar Mixpanel</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Debugger Side */}
              <div className="lg:col-span-7 bg-stone-950/40 border border-stone-850/80 p-5 rounded-2xl space-y-4 flex flex-col h-[350px] lg:h-[420px]" id="mixpanel-debugger-panel">
                <div className="flex items-center justify-between border-b border-stone-850/60 pb-3 shrink-0">
                  <h4 className="text-xs font-mono font-bold text-stone-300 uppercase tracking-widest flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amber-500/70" />
                    <span>{t.liveDebugger}</span>
                  </h4>
                  <span className="text-[9px] font-mono text-stone-500 bg-stone-900/60 px-2 py-0.5 rounded border border-stone-850/80 font-bold">
                    {recentEvents.length} {language === "es" ? "eventos" : "events"}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
                  {recentEvents.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2.5">
                      <Activity className="w-8 h-8 text-stone-700 animate-pulse" />
                      <p className="text-[11px] text-stone-500 max-w-sm leading-normal font-sans">
                        {t.noEvents}
                      </p>
                    </div>
                  ) : (
                    recentEvents.map((ev) => (
                      <div 
                        key={ev.id}
                        className="bg-stone-900/40 border border-stone-850 hover:border-stone-800 rounded-xl p-3 text-xs transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping shrink-0" />
                            <strong className="text-stone-200 font-mono text-[11px] break-all">{ev.name}</strong>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] text-stone-500 font-mono whitespace-nowrap">
                              {new Date(ev.timestamp).toLocaleTimeString()}
                            </span>
                            <button
                              onClick={() => setExpandedEventId(expandedEventId === ev.id ? null : ev.id)}
                              className="text-[9px] font-mono text-amber-500/80 hover:text-amber-400 cursor-pointer px-1.5 py-0.5 bg-stone-950 border border-stone-850 hover:border-stone-750 rounded"
                            >
                              {expandedEventId === ev.id ? "Hide" : "Show JSON"}
                            </button>
                          </div>
                        </div>

                        {expandedEventId === ev.id && (
                          <motion.pre
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-[10px] font-mono bg-stone-950 p-2.5 rounded-lg text-stone-400 border border-stone-850 overflow-x-auto leading-normal whitespace-pre-wrap max-h-40"
                          >
                            {JSON.stringify(ev.properties, null, 2)}
                          </motion.pre>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-stone-850/40 shrink-0 flex items-center justify-between text-[9px] font-mono text-stone-500">
                  <span>⏱️ Real-time updates active</span>
                  <span>Morphoface Telemetry Hub</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
