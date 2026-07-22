// CREDIT MIX ENGINE (WAD Backend Version)
// Mirrors CRE_CreditMix but runs entirely off-chain using WAD arithmetic.
// Pure, deterministic, zero-dependency constitutional math.

import {
  WAD_ONE, WAD_ZERO,
  wadMul, wadDiv, wadSubSat, wadMin, wadMax, wadToPctString
} from "../wad/wadMath";

import { FactorParams, FactorResult } from "../wad/wadTypes";

export function evaluateCreditMix(p: FactorParams): FactorResult {
  const hasRevolving   = p[0] === 1n;
  const hasInstallment = p[1] === 1n;
  const hasMortgage    = p[2] === 1n;
  const hasOpen        = p[3] === 1n;

  const revCount       = p[4];
  const instCount      = p[5];
  const totalAccounts  = p[6];

  const maxPossible = WAD_ONE;

  // Type diversity score
  let mixScore = WAD_ZERO;

  if (hasRevolving)   mixScore += 30n * (10n ** 16n);
  if (hasInstallment) mixScore += 30n * (10n ** 16n);
  if (hasMortgage)    mixScore += 25n * (10n ** 16n);
  if (hasOpen)        mixScore += 15n * (10n ** 16n);

  // Depth bonus
  let depthBonus = WAD_ZERO;

  if (revCount >= 3n && instCount >= 2n) {
    depthBonus = 8n * (10n ** 16n);
  } else if (revCount >= 2n || instCount >= 2n) {
    depthBonus = 4n * (10n ** 16n);
  }

  mixScore += depthBonus;

  // Thin file adjustment
  if (totalAccounts < 2n) {
    mixScore = wadMul(mixScore, 5n * (10n ** 17n)); // 50% discount
  }

  const componentScore = wadMin(WAD_ONE, mixScore);

  const explanation =
    "CREDIT MIX (10% weight) | " +
    "types=[revolving:" + Number(hasRevolving) +
      " installment:" + Number(hasInstallment) +
      " mortgage:" + Number(hasMortgage) +
      " open:" + Number(hasOpen) + "] | " +
    "rev_count=" + revCount + " | " +
    "inst_count=" + instCount + " | " +
    "total_accounts=" + totalAccounts + " | " +
    "depth_bonus=+" + wadToPctString(depthBonus) + "% | " +
    "component_score=" + wadToPctString(componentScore) + "%";

  return {
    componentScore,
    maxPossible,
    derogatory: false,
    factorName: "Credit Mix",
    explanation
  };
}
