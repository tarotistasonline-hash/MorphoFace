import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  DollarSign, 
  HelpCircle, 
  Check, 
  ExternalLink, 
  Code, 
  Sparkles, 
  X, 
  ShieldCheck, 
  Sliders,
  Eye,
  EyeOff
} from "lucide-react";

// Local storage keys
const ADSENSE_PUB_ID_KEY = "morphoface-adsense-pub-id";
const ADSENSE_ENABLED_KEY = "morphoface-adsense-enabled";
const ADSENSE_ADMIN_LOCKED_KEY = "morphoface-adsense-admin-locked";

interface AdSenseConfig {
  publisherId: string;
  isEnabled: boolean;
  headerSlotId: string;
  footerSlotId: string;
  sidebarSlotId: string;
}

export function useAdSense() {
  const [pubId, setPubId] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedId = localStorage.getItem(ADSENSE_PUB_ID_KEY) || "";
      const savedEnabled = localStorage.getItem(ADSENSE_ENABLED_KEY) !== "false"; // Default true if ID is set
      setPubId(savedId);
      setIsEnabled(savedEnabled && !!savedId);
    }
  }, []);

  // Dynamically load AdSense script in head when config changes
  useEffect(() => {
    if (typeof window === "undefined" || !pubId || !isEnabled) {
      // Remove any existing script if disabled
      const oldScript = document.getElementById("adsense-global-script");
      if (oldScript) oldScript.remove();
      return;
    }

    // Clean up old script if any
    const oldScript = document.getElementById("adsense-global-script");
    if (oldScript) oldScript.remove();

    // Create new script tag for Google AdSense
    const script = document.createElement("script");
    script.id = "adsense-global-script";
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    return () => {
      const cleanupScript = document.getElementById("adsense-global-script");
      if (cleanupScript) cleanupScript.remove();
    };
  }, [pubId, isEnabled]);

  return { pubId, isEnabled, setPubId, setIsEnabled };
}

// ---------------------------------------------------------
// Component for rendering actual Ad Units inside the pages
// ---------------------------------------------------------
interface AdBannerProps {
  slotId?: string; // Optional manual slot ID
  type?: "horizontal" | "rectangle" | "vertical";
  className?: string;
}

export function AdSenseBanner({ slotId, type = "horizontal", className = "" }: AdBannerProps) {
  const { pubId, isEnabled } = useAdSense();
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    if (isEnabled && pubId) {
      try {
        // Trigger AdSense push
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.warn("AdSense push warning (expected if script is blocked or still loading):", err);
      }
    }
  }, [isEnabled, pubId, slotId]);

  if (!isEnabled || !pubId) {
    // Show an elegant, subtle spacer or simulated banner for the administrator/visitor during setup
    return (
      <div 
        className={`w-full bg-stone-950/20 border border-stone-900 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all ${
          type === "horizontal" ? "min-h-[90px]" : "min-h-[250px] max-w-[300px] mx-auto"
        } ${className}`}
        id="adsense-placeholder-banner"
      >
        <div className="flex items-center gap-1.5 text-stone-600 text-[10px] font-mono tracking-wider uppercase">
          <DollarSign className="w-3.5 h-3.5 text-amber-500/20" />
          <span>Espacio de Publicidad</span>
        </div>
        <p className="text-[10px] text-stone-500 max-w-md mt-1 font-sans">
          Aquí aparecerán tus anuncios de Google AdSense una vez que configures tu ID de Editor abajo.
        </p>
      </div>
    );
  }

  // Active AdSense ad block
  return (
    <div className={`overflow-hidden my-4 mx-auto w-full text-center ${className}`} id="adsense-active-banner-container">
      <ins 
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={pubId}
        data-ad-slot={slotId || "default"}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

// ---------------------------------------------------------
// Beautiful configuration card with Step-by-Step guides
// ---------------------------------------------------------
export default function AdSenseConfigPanel() {
  const { pubId, isEnabled, setPubId, setIsEnabled } = useAdSense();
  const [inputPubId, setInputPubId] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [isAdminLocked, setIsAdminLocked] = useState(true); // Hide/protect by default so normal visitors don't mess with it
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (pubId) {
      setInputPubId(pubId);
    }
    if (typeof window !== "undefined") {
      const savedLocked = localStorage.getItem(ADSENSE_ADMIN_LOCKED_KEY) !== "false";
      setIsAdminLocked(savedLocked);
    }
  }, [pubId]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorState(null);
    let cleanId = inputPubId.trim();

    if (!cleanId) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(ADSENSE_PUB_ID_KEY);
        localStorage.setItem(ADSENSE_ENABLED_KEY, "false");
        setPubId("");
        setIsEnabled(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
      return;
    }

    // 1. If they pasted a whole script tag, let's extract the client ID
    const clientMatch = cleanId.match(/ca-pub-\d+/i) || cleanId.match(/pub-\d+/i);
    if (clientMatch) {
      cleanId = clientMatch[0].toLowerCase();
    } else {
      // 2. If they just pasted raw numbers, prefix them
      const numbersOnly = cleanId.replace(/\D/g, "");
      if (numbersOnly.length >= 10) {
        cleanId = "pub-" + numbersOnly;
      }
    }

    // 3. Automatically add the "ca-" prefix if it starts with "pub-"
    if (cleanId.startsWith("pub-")) {
      cleanId = "ca-" + cleanId;
    }

    // 4. Validate final format
    if (!/^ca-pub-\d+$/.test(cleanId)) {
      setErrorState(
        "No pudimos reconocer un ID de AdSense válido. Asegúrate de ingresar tu número de editor (ej: pub-1234567890123456) o solo los 16 números."
      );
      return;
    }

    // Show corrected ID in the input box so they see it worked!
    setInputPubId(cleanId);

    if (typeof window !== "undefined") {
      localStorage.setItem(ADSENSE_PUB_ID_KEY, cleanId);
      localStorage.setItem(ADSENSE_ENABLED_KEY, "true");
      
      setPubId(cleanId);
      setIsEnabled(true);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleToggleActive = () => {
    const nextState = !isEnabled;
    if (typeof window !== "undefined") {
      localStorage.setItem(ADSENSE_ENABLED_KEY, String(nextState));
      setIsEnabled(nextState);
    }
  };

  const handleLockToggle = () => {
    const nextLocked = !isAdminLocked;
    setIsAdminLocked(nextLocked);
    if (typeof window !== "undefined") {
      localStorage.setItem(ADSENSE_ADMIN_LOCKED_KEY, String(nextLocked));
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4" id="adsense-config-root">
      
      {/* Small floating button or discreet gear link at the very bottom */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-850 border border-stone-800 rounded-full text-[11px] font-mono text-stone-400 hover:text-amber-400 transition-all cursor-pointer shadow-md"
          id="adsense-toggle-button"
        >
          <DollarSign className={`w-3.5 h-3.5 ${isEnabled ? "text-amber-400" : "text-stone-500"}`} />
          <span>{showPanel ? "Ocultar Ajustes de Anuncios" : "⚙️ Configurar Publicidad (AdSense)"}</span>
          {isEnabled && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          )}
        </button>

        {showPanel && (
          <button
            onClick={handleLockToggle}
            className="flex items-center gap-1 px-3 py-2 rounded-full border border-stone-800 bg-stone-950/60 text-[10px] font-mono text-stone-500 hover:text-stone-300 transition-all cursor-pointer"
            title={isAdminLocked ? "Panel visible solo en tu navegador" : "Panel visible para cualquiera"}
          >
            {isAdminLocked ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Eye className="w-3.5 h-3.5 text-amber-500" />}
            <span>{isAdminLocked ? "Bloqueado para Dueño" : "Abierto al Público"}</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="mt-4 bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
            id="adsense-config-card"
          >
            
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-800 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-stone-100">
                    Monetización con Google AdSense (Fácil)
                  </h3>
                </div>
                <p className="text-[11px] text-stone-400 leading-normal max-w-2xl font-sans">
                  No necesitas editar código de programación. Simplemente pega tu ID de Editor y activa los anuncios. Google se encargará del resto de manera inteligente.
                </p>
              </div>

              <button 
                onClick={() => setShowPanel(false)}
                className="p-1 text-stone-500 hover:text-stone-300 rounded-lg bg-stone-950/40 border border-stone-800 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Config Form and Status */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Form Side */}
              <div className="md:col-span-6 space-y-4">
                <form onSubmit={handleSave} className="space-y-4">
                  
                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono text-stone-300 uppercase tracking-wider">
                      Tu ID de Editor (Publisher ID)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={inputPubId}
                        onChange={(e) => {
                          setInputPubId(e.target.value);
                          if (errorState) setErrorState(null);
                        }}
                        placeholder="Ej: pub-1234567890123456 o solo los números"
                        className={`w-full px-4 py-3 rounded-xl bg-stone-950 border text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-stone-700 font-mono transition-all ${
                          errorState ? "border-red-500/50" : "border-stone-800"
                        }`}
                      />
                    </div>
                    {errorState ? (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] text-red-400 font-sans leading-normal bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg"
                      >
                        ⚠️ {errorState}
                      </motion.p>
                    ) : (
                      <p className="text-[10px] text-stone-500 leading-normal font-sans">
                        ¡No te preocupes! Puedes escribirlo empezando con <code className="text-amber-500 font-mono">pub-</code> o pegar directamente los números. El sistema lo corregirá automáticamente para ti.
                      </p>
                    )}
                  </div>

                  {/* Save button and status toggle */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/5 cursor-pointer flex items-center gap-1.5"
                    >
                      {saveSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-stone-950" />
                          <span>¡Guardado Correctamente!</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5 text-stone-950" />
                          <span>Guardar y Aplicar</span>
                        </>
                      )}
                    </button>

                    {pubId && (
                      <button
                        type="button"
                        onClick={handleToggleActive}
                        className={`px-4 py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                          isEnabled 
                            ? "bg-emerald-500/10 hover:bg-emerald-500/15 border-emerald-500/20 text-emerald-400" 
                            : "bg-red-500/10 hover:bg-red-500/15 border-red-500/20 text-red-400"
                        }`}
                      >
                        {isEnabled ? "🟢 Anuncios Activos" : "🔴 Anuncios Pausados"}
                      </button>
                    )}
                  </div>

                </form>

                {/* Quick Info Box */}
                <div className="p-3.5 bg-stone-950/50 border border-stone-850/60 rounded-xl space-y-2 text-stone-400 text-[11px] font-sans">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>¿Cómo funciona esto?</span>
                  </div>
                  <p className="leading-relaxed">
                    Al guardar tu ID, el sitio web cargará el script de Google automáticamente. Si tienes activados los <strong>"Anuncios Automáticos" (Auto Ads)</strong> en tu panel de Google AdSense, Google analizará el sitio de manera inteligente e insertará anuncios en los bordes, cabeceras, o entre secciones sin que tengas que programar nada más.
                  </p>
                </div>
              </div>

              {/* Step by Step Guide Side */}
              <div className="md:col-span-6 bg-stone-950/30 border border-stone-850/60 p-5 rounded-2xl space-y-3.5 text-stone-300">
                <h4 className="text-xs font-mono font-bold text-stone-200 flex items-center gap-1.5 uppercase tracking-wide">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Guía: ¿Cómo conseguir mi código?</span>
                </h4>

                <ol className="space-y-3 text-[11px] list-decimal list-inside font-sans text-stone-400 leading-relaxed">
                  <li>
                    <strong className="text-stone-200">Regístrate en Google AdSense:</strong> Ve a{" "}
                    <a 
                      href="https://www.google.com/adsense" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-amber-400 hover:underline inline-flex items-center gap-0.5"
                    >
                      adsense.google.com <ExternalLink className="w-3 h-3 inline" />
                    </a>{" "}
                    e inicia sesión con tu cuenta de Google.
                  </li>
                  <li>
                    <strong className="text-stone-200">Encuentra tu ID de Editor:</strong> En el menú izquierdo de tu panel de AdSense, entra a <span className="text-amber-400 font-mono">Cuenta &gt; Información de la cuenta</span>. Ahí verás un código que dice <strong className="text-amber-300 font-mono">ID de editor</strong> (ej. <span className="font-mono text-stone-500">pub-1234567890123456</span>).
                  </li>
                  <li>
                    <strong className="text-stone-200">Pégalo arriba:</strong> Copia ese código (por ejemplo, tal cual empieza con <code className="text-amber-300 font-mono">pub-</code> o simplemente los números), pégalo en el recuadro de la izquierda y haz clic en <em className="text-stone-200 not-italic">"Guardar y Aplicar"</em>. El sistema le agregará <code className="text-emerald-400 font-mono">ca-</code> al inicio automáticamente para que sea un código válido de script.
                  </li>
                  <li>
                    <strong className="text-stone-200">¡Muy Importante! Activa "Anuncios Automáticos":</strong> En tu panel de AdSense, ve a <strong className="text-stone-200">Anuncios &gt; Por sitio</strong>, busca tu dominio y haz clic en editar. Asegúrate de activar la casilla de <strong className="text-amber-300">Anuncios Automáticos</strong> para que Google empiece a mostrarlos automáticamente.
                  </li>
                </ol>

                <div className="pt-2 border-t border-stone-850 flex items-center gap-2 text-[9px] text-stone-500 font-mono leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-stone-600 shrink-0" />
                  <span>Nota: Este ajuste se guarda localmente. Solo tú puedes cambiarlo desde tu navegador. Los visitantes normales verán los anuncios de manera transparente.</span>
                </div>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
