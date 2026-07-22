// PENALTY ENGINE
// Computes WAD‑scaled penalty score for severe derogatory events.
// Applies:
// - bankruptcy weighting
// - foreclosure weighting
// - charge-off weighting
// - public record severity
// - recency decay
// Returns FactorResult.

import { FactorResult } from "../wad/wadTypes";
import { WAD_ONE, wadMul, wadClamp } from "../wad/wadMath";
import fs from "fs";
import path from "path";

export function evaluatePenalty(params: bigint[]): FactorResult {
  // params[14] = monthsSinceSevereDerog
  // params[15] = severeDerogCode
  //
  // severeDerogCode mapping (example):
  // 0 = none
  // 1 = bankruptcy
  // 2 = foreclosure
  // 3 = charge-off
  // 4 = public record (judgment, lien)

  const monthsSince = Number(params[14]);
  const code = Number(params[15]);

  const base = path.join("backend", "ruleset", "v1.0.0");
  const pen = JSON.parse(fs.readFileSync(path.join(base, "penalty.json"), "utf8"));

  const maxScore = WAD_ONE;

  // No severe derogatory → perfect score
  if (code === 0) {
    return {
      factorName: "Penalty",
      componentScore: maxScore,
      maxPossible: maxScore,
      derogatory: false,
      explanation: "No severe derogatory events detected."
    };
  }

  // Severity weight
  const severityWeight = (() => {
    switch (code) {
      case 1: return BigInt(pen.weights_wad.bankruptcy);
      case 2: return BigInt(pen.weights_wad.foreclosure);
      case 3: return BigInt(pen.weights_wad.chargeoff);
      case 4: return BigInt(pen.weights_wad.public_record);
      default: return BigInt(pen.weights_wad.unknown);
    }
  })();

  // Recency decay
  const halflife = pen.halflife_months[code] ?? pen.halflife_months.default;

  const decayFactor = (() => {
    const exponent = monthsSince / halflife;
    const pow = Math.pow(0.5, exponent);
    return BigInt(Math.floor(pow * Number(WAD_ONE)));
  })();

  // Final penalty score = 1 - (severityWeight × decayFactor)
  let score = WAD_ONE - wadMul(severityWeight, decayFactor);

  // Clamp score
  score = wadClamp(score, 0n, maxScore);

  return {
    factorName: "Penalty",
    componentScore: score,
    maxPossible: maxScore,
    derogatory: true,
    explanation: [
      `Severe derogatory code: ${code}`,
      `Months since event: ${monthsSince}`,
      `Severity weight (WAD): ${severityWeight}`,
      `Recency decay factor (WAD): ${decayFactor}`,
      `Final penalty score derived from severity × recency decay.`
    ].join("\n")
  };
}
