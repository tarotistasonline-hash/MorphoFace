import LZString from "lz-string";
import { MorphoReport } from "../types";

const LANDMARK_LABELS = [
  "Forehead Left",
  "Forehead Right",
  "Left Eye",
  "Right Eye",
  "Nose Tip",
  "Left Cheekbone",
  "Right Cheekbone",
  "Mouth Left",
  "Mouth Right",
  "Chin Point"
];

const labelToIndex = (label: string): number => {
  const idx = LANDMARK_LABELS.indexOf(label);
  return idx !== -1 ? idx : 9;
};

const indexToLabel = (idx: number): string => {
  return LANDMARK_LABELS[idx] || LANDMARK_LABELS[LANDMARK_LABELS.length - 1];
};

export interface CompactReport {
  fs: string;
  ot: string;
  tp: string;
  zo: {
    in: { sc: number; it: string };
    em: { sc: number; it: string };
    is: { sc: number; it: string };
  };
  fe: {
    ey: { sy: string; it: string };
    no: { sy: string; it: string };
    mj: { sy: string; it: string };
  };
  lm: { lb: number; x: number; y: number }[];
  st: string[];
  ga: string[];
  pa: string;
  pr: string;
  fu: string;
  sn?: string;
}

/**
 * Compresses a MorphoReport and optional subjectName into a short, URL-safe string.
 */
export function compressReport(report: MorphoReport, subjectName?: string): string {
  const compact: CompactReport = {
    fs: report.faceShape,
    ot: report.overallType,
    tp: report.temperament,
    zo: {
      in: { sc: report.zones.intellectual.score, it: report.zones.intellectual.interpretation },
      em: { sc: report.zones.emotional.score, it: report.zones.emotional.interpretation },
      is: { sc: report.zones.instinctive.score, it: report.zones.instinctive.interpretation },
    },
    fe: {
      ey: { sy: report.features.eyes.style, it: report.features.eyes.interpretation },
      no: { sy: report.features.nose.style, it: report.features.nose.interpretation },
      mj: { sy: report.features.mouthAndJaw.style, it: report.features.mouthAndJaw.interpretation },
    },
    lm: report.landmarks.map(l => ({
      lb: labelToIndex(l.label),
      x: l.x,
      y: l.y
    })),
    st: report.strengths,
    ga: report.growthAreas,
    pa: report.pastIns,
    pr: report.presentIns,
    fu: report.futureIns,
    sn: subjectName
  };

  const jsonStr = JSON.stringify(compact);
  return LZString.compressToEncodedURIComponent(jsonStr);
}

/**
 * Decompresses a share string. Supports both the new LZString compressed format
 * and legacy base64-encoded full JSON payloads.
 */
export function decompressReport(compressedStr: string): { report: MorphoReport; subjectName?: string } | null {
  try {
    // Try decompressing using LZString first
    const jsonStr = LZString.decompressFromEncodedURIComponent(compressedStr);
    if (!jsonStr) {
      return decompressLegacyReport(compressedStr);
    }

    const compact = JSON.parse(jsonStr) as CompactReport;
    
    // Check if it matches the expected compact schema
    if (!compact.fs || !compact.zo) {
      return decompressLegacyReport(compressedStr);
    }

    const report: MorphoReport = {
      faceShape: compact.fs,
      overallType: compact.ot,
      temperament: compact.tp,
      zones: {
        intellectual: { score: compact.zo.in.sc, interpretation: compact.zo.in.it },
        emotional: { score: compact.zo.em.sc, interpretation: compact.zo.em.it },
        instinctive: { score: compact.zo.is.sc, interpretation: compact.zo.is.it }
      },
      features: {
        eyes: { style: compact.fe.ey.sy, interpretation: compact.fe.ey.it },
        nose: { style: compact.fe.no.sy, interpretation: compact.fe.no.it },
        mouthAndJaw: { style: compact.fe.mj.sy, interpretation: compact.fe.mj.it }
      },
      landmarks: compact.lm.map(l => ({
        label: indexToLabel(l.lb),
        x: l.x,
        y: l.y
      })),
      strengths: compact.st,
      growthAreas: compact.ga,
      pastIns: compact.pa,
      presentIns: compact.pr,
      futureIns: compact.fu
    };

    return {
      report,
      subjectName: compact.sn
    };
  } catch (error) {
    console.warn("Compressed decompression failed, trying legacy fallback...", error);
    return decompressLegacyReport(compressedStr);
  }
}

function decompressLegacyReport(base64Str: string): { report: MorphoReport; subjectName?: string } | null {
  try {
    const decodedStr = decodeURIComponent(escape(atob(base64Str)));
    const report = JSON.parse(decodedStr);
    if (report && report.faceShape) {
      return {
        report,
        subjectName: report.subjectName
      };
    }
  } catch (e) {
    console.error("Legacy decompression also failed", e);
  }
  return null;
}
