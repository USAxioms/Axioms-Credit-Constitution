// HISTORY LENGTH ENGINE
// Computes WAD‑scaled score for length of credit history.
// Applies:
// - age curve
// - minimum age thresholds
// - diminishing returns
// Returns FactorResult.

import { FactorResult } from "../wad/wadTypes";
import { WAD_ONE, wadClamp, wadMul } from "../wad/wadMath";
import fs from "fs";
import path from "path";

export function evaluateHistoryLength(params: bigint[]): FactorResult {
  // params[7] = monthsSinceFirstAccount
  // params[8] = averageAccountAgeMonths

  const monthsSinceFirst = Number(params[7]);
  const avgAgeMonths = Number(params[8]);

  const base = path.join("backend", "ruleset", "v1.0.0");
  const hist = JSON.parse(fs.readFileSync(path.join(base, "history_length.json"), "utf8"));

  const maxScore = WAD_ONE;

  // Convert months to years (WAD)
  const yearsSinceFirst = BigInt(Math.floor(monthsSinceFirst / 12)) * WAD_ONE;
  const avgAgeYears = BigInt(Math.floor(avgAgeMonths / 12)) * WAD_ONE;

  // Minimum age threshold
  const minAgeWad = BigInt(hist.minimum_age_years_wad);

  if (yearsSinceFirst < minAgeWad) {
    return {
      factorName: "History Length",
      componentScore: BigInt(hist.scores_wad.too_new),
      maxPossible: maxScore,
      derogatory: true,
      explanation: `Credit history is too new: ${monthsSinceFirst} months since first account.`
    };
  }

  // Age curve: diminishing returns
  const curve = hist.age_curve_wad;

  let score: bigint;

  if (yearsSinceFirst >= BigInt(curve.excellent_threshold_wad)) {
    score = BigInt(hist.scores_wad.excellent);
  } else if (yearsSinceFirst >= BigInt(curve.good_threshold_wad)) {
    score = BigInt(hist.scores_wad.good);
  } else if (yearsSinceFirst >= BigInt(curve.fair_threshold_wad)) {
    score = BigInt(hist.scores_wad.fair);
  } else {
    score = BigInt(hist.scores_wad.poor);
  }

  // Clamp score
  score = wadClamp(score, 0n, maxScore);

  return {
    factorName: "History Length",
    componentScore: score,
    maxPossible: maxScore,
    derogatory: score < maxScore,
    explanation: [
      `Months since first account: ${monthsSinceFirst}`,
      `Average account age (months): ${avgAgeMonths}`,
      `Years since first account (WAD): ${yearsSinceFirst}`,
      `Score derived from age curve thresholds.`
    ].join("\n")
  };
}
