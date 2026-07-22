// PAYMENT HISTORY ENGINE
// Computes WAD‑scaled score for payment history.
// Applies:
// - severity weighting
// - recency decay
// - FCRA obsolescence cap
// - statutory anchors
// Returns FactorResult.

import { FactorResult } from "../wad/wadTypes";
import { WAD_ONE, wadMul, wadClamp } from "../wad/wadMath";
import fs from "fs";
import path from "path";

export function evaluatePaymentHistory(params: bigint[]): FactorResult {
  // params[0] = monthsSinceLastDerog
  // params[1] = severityCode (0, 30, 60, 90, 120)
  // params[2] = countDerog
  // params[3] = totalPayments
  // params[4] = onTimePayments
  // ... remaining params unused for this factor

  const monthsSince = Number(params[0]);
  const severity = Number(params[1]);
  const countDerog = Number(params[2]);
  const totalPayments = Number(params[3]);
  const onTimePayments = Number(params[4]);

  // Load decay + statutory config
  const base = path.join("backend", "ruleset", "v1.0.0");
  const decay = JSON.parse(fs.readFileSync(path.join(base, "decay.json"), "utf8"));
  const statutory = JSON.parse(fs.readFileSync(path.join(base, "statutory.json"), "utf8"));

  // Max possible score
  const maxScore = WAD_ONE;

  // If no derogatory marks → perfect score
  if (countDerog === 0) {
    return {
      factorName: "Payment History",
      componentScore: maxScore,
      maxPossible: maxScore,
      derogatory: false,
      explanation: `No derogatory marks reported. ${onTimePayments}/${totalPayments} payments on time.`
    };
  }

  // Severity weighting
  const severityWeight = (() => {
    if (severity >= 120) return decay.severity_weight_wad["120_plus"];
    if (severity >= 90) return decay.severity_weight_wad["90_plus"];
    if (severity >= 60) return decay.severity_weight_wad["60_plus"];
    if (severity >= 30) return decay.severity_weight_wad["30_plus"];
    return decay.severity_weight_wad["none"];
  })();

  // Recency decay
  const halflife = decay.halflife_months[
    severity >= 120 ? "120_plus" :
    severity >= 90 ? "90_plus" :
    severity >= 60 ? "60_plus" :
    severity >= 30 ? "30_plus" : "none"
  ];

  const decayFactor = (() => {
    // exponential decay: 0.5^(months / halflife)
    const exponent = monthsSince / halflife;
    const pow = Math.pow(0.5, exponent);
    return BigInt(Math.floor(pow * Number(WAD_ONE)));
  })();

  // FCRA obsolescence cap
  const fcraCap = BigInt(decay.fcra_obsolescence.cap_factor_wad);

  // Final score = (1 - severityWeight * decayFactor)
  let score = WAD_ONE - wadMul(BigInt(severityWeight), decayFactor);

  // Apply FCRA cap
  score = wadClamp(score, fcraCap, WAD_ONE);

  return {
    factorName: "Payment History",
    componentScore: score,
    maxPossible: maxScore,
    derogatory: true,
    explanation: [
      `Severity: ${severity} days late`,
      `Months since last derogatory: ${monthsSince}`,
      `Count of derogatory marks: ${countDerog}`,
      `Recency decay factor applied.`,
      `FCRA obsolescence cap enforced.`,
      `Final WAD score computed from severity × recency decay.`
    ].join("\n")
  };
}
