// UTILIZATION ENGINE
// Computes WAD‑scaled score for credit utilization.
// Applies:
// - aggregate utilization curve
// - threshold scoring
// - penalty ramps
// Returns FactorResult.

import { FactorResult } from "../wad/wadTypes";
import { WAD_ONE, wadClamp } from "../wad/wadMath";
import fs from "fs";
import path from "path";

export function evaluateUtilization(params: bigint[]): FactorResult {
  // params[5] = totalCreditLimitWad
  // params[6] = totalBalanceWad

  const totalLimit = params[5];
  const totalBalance = params[6];

  // Load utilization curve config
  const base = path.join("backend", "ruleset", "v1.0.0");
  const util = JSON.parse(fs.readFileSync(path.join(base, "utilization.json"), "utf8"));

  const maxScore = WAD_ONE;

  // If no credit limit → treat as neutral (not penalized)
  if (totalLimit === 0n) {
    return {
      factorName: "Utilization",
      componentScore: maxScore,
      maxPossible: maxScore,
      derogatory: false,
      explanation: "No revolving credit limit detected; utilization treated as optimal."
    };
  }

  // utilization = balance / limit (WAD)
  const utilization = totalBalance * WAD_ONE / totalLimit;

  // Determine score bucket
  let score: bigint;
  let bucket: string;

  if (utilization <= BigInt(util.aggregate_curve.optimal_threshold_wad)) {
    score = BigInt(util.scores_wad.optimal);
    bucket = "Optimal";
  } else if (utilization <= BigInt(util.aggregate_curve.good_threshold_wad)) {
    score = BigInt(util.scores_wad.good);
    bucket = "Good";
  } else if (utilization <= BigInt(util.aggregate_curve.moderate_threshold_wad)) {
    score = BigInt(util.scores_wad.moderate_base);
    bucket = "Moderate";
  } else if (utilization <= BigInt(util.aggregate_curve.high_threshold_wad)) {
    score = BigInt(util.scores_wad.high_base);
    bucket = "High";
  } else if (utilization <= BigInt(util.aggregate_curve.very_high_threshold_wad)) {
    score = BigInt(util.scores_wad.very_high_base);
    bucket = "Very High";
  } else {
    score = BigInt(util.scores_wad.max_penalty_base);
    bucket = "Max Penalty";
  }

  // Clamp score to valid WAD range
  score = wadClamp(score, 0n, maxScore);

  return {
    factorName: "Utilization",
    componentScore: score,
    maxPossible: maxScore,
    derogatory: bucket !== "Optimal" && bucket !== "Good",
    explanation: [
      `Total Limit (WAD): ${totalLimit}`,
      `Total Balance (WAD): ${totalBalance}`,
      `Utilization (WAD): ${utilization}`,
      `Bucket: ${bucket}`,
      `Score derived from utilization curve thresholds.`
    ].join("\n")
  };
}
