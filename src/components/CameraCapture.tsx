import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, X, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
  onCancel: () => void;
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const { language, t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Start the physical camera
  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const constraints = {
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setError(t("camera_err_msg"));
    } finally {
      setIsLoading(false);
    }
  };

  // Capture current frames
  const capturePhoto = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      // Crop or resize to a clean square
      const size = Math.min(video.videoWidth, video.videoHeight) || 480;
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw centered square
        const sx = (video.videoWidth - size) / 2;
        const sy = (video.videoHeight - size) / 2;

        ctx.drawImage(
          video,
          sx,
          sy,
          size,
          size,
          0,
          0,
          size,
          size
        );

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        onCapture(dataUrl);
      }
    } catch (err) {
      console.error("Failed to capture image", err);
      setError(language === "fr" ? "Impossible de geler l'image. Veuillez réessayer." : language === "en" ? "Failed to freeze image. Please try again." : "No se pudo congelar la imagen. Inténtalo de nuevo.");
    }
  };

  // Stop current tracks safely
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col items-center bg-stone-900 border border-stone-800 rounded-2xl p-6 relative w-full overflow-hidden" id="camera-capture-box">
      <button
        type="button"
        onClick={onCancel}
        className="absolute top-4 right-4 p-2 bg-stone-850 hover:bg-stone-800 text-stone-404 hover:text-stone-200 rounded-full transition-colors z-10"
        id="camera-cancel-btn"
        aria-label={language === "fr" ? "Fermer la caméra" : language === "en" ? "Close camera" : "Cerrar cámara"}
      >
        <X className="w-5 h-5" />
      </button>

      <div className="text-center mb-4">
        <h4 className="text-lg font-semibold text-stone-100 font-sans tracking-tight" id="camera-title">
          {t("camera_title")}
        </h4>
        <p className="text-xs text-stone-400 font-mono" id="camera-subtitle">
          {t("camera_subtitle")}
        </p>
      </div>

      <div className="relative w-full max-w-[360px] aspect-square rounded-xl bg-stone-950 overflow-hidden border-2 border-stone-800 mb-6 flex items-center justify-center" id="camera-video-container">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 z-10 bg-stone-950" id="camera-loading-overlay">
            <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
            <span className="text-xs text-stone-400 font-mono">{t("camera_loading_msg")}</span>
          </div>
        )}

        {error ? (
          <div className="p-6 text-center space-y-4 z-10" id="camera-error-overlay">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto opacity-80" />
            <p className="text-xs text-stone-300 leading-relaxed" id="camera-error-txt">
              {error}
            </p>
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-semibold rounded-lg text-xs font-mono transition-colors flex items-center gap-2 mx-auto"
              id="camera-retry-btn"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {t("camera_retry_btn")}
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]" /* Mirror mode for natural capture */
            id="camera-video-feed"
          />
        )}

        {isActive && !error && (
          <>
            {/* Calibration lines */}
            <div className="absolute inset-[24px] border border-dashed border-amber-500/20 pointer-events-none" id="camera-calibration-crop" />
            <div className="absolute inset-0 border-[24px] border-stone-950/60 pointer-events-none" id="camera-crop-shadow" />
            <div className="absolute inset-[24px] border-2 border-dashed border-amber-500/40 rounded-full pointer-events-none flex items-center justify-center animate-pulse" id="camera-oval-guide">
              <div className="text-[10px] text-amber-400/80 font-mono bg-stone-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/20 translate-y-24 whitespace-nowrap">
                {t("camera_align_msg")}
              </div>
            </div>

            {/* Horizontal zone division guides */}
            <div className="absolute left-[24px] right-[24px] top-1/3 border-t border-amber-500/20 pointer-events-none" id="upper-guide-line">
              <span className="absolute left-2 -top-4 text-[8px] text-amber-400/50 font-mono whitespace-nowrap">{t("camera_guide_intellectual")}</span>
            </div>
            <div className="absolute left-[24px] right-[24px] top-2/3 border-t border-amber-500/20 pointer-events-none" id="lower-guide-line">
              <span className="absolute left-2 -top-4 text-[8px] text-amber-400/50 font-mono whitespace-nowrap">{t("camera_guide_emotional")}</span>
              <span className="absolute left-2 top-1 text-[8px] text-amber-400/50 font-mono whitespace-nowrap">{t("camera_guide_instinctive")}</span>
            </div>

            {/* Animated Laser Scan line */}
            <motion.div
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute left-[24px] right-[24px] h-[2px] bg-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.5)] pointer-events-none z-10"
              id="laser-scanner"
            />
          </>
        )}
      </div>

      {isActive && !error && (
        <div className="flex gap-4 w-full justify-center" id="camera-actions-wrap">
          <button
            onClick={capturePhoto}
            className="flex items-center gap-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-6 py-3 rounded-full transition-all duration-300 shadow-[0_4px_20px_rgba(245,158,11,0.25)] hover:shadow-[0_4px_24px_rgba(245,158,11,0.4)] transform hover:-translate-y-0.5 text-sm font-sans"
            id="camera-capture-trigger"
          >
            <Camera className="w-4 h-4 fill-stone-950" />
            {t("camera_capture_btn")}
          </button>
        </div>
      )}
    </div>
  );
}
