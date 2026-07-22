// CREDIT HISTORY LENGTH ENGINE (WAD Backend Version)
// Mirrors CRE_HistoryLength but runs entirely off-chain using WAD arithmetic.
// Pure, deterministic, zero-dependency constitutional math.

import {
  WAD_ONE, WAD_ZERO,
  wadMul, wadDiv, wadSubSat, wadMin, wadMax, wadToPctString
} from "../wad/wadMath";

import { FactorParams, FactorResult } from "../wad/wadTypes";

export function evaluateHistoryLength(p: FactorParams): FactorResult {
  const oldestMonths   = p[0];
  const newestMonths   = p[1];
  const avgAge_1e2     = p[2]; // average age * 100
  const totalAccounts  = p[3];
  const oldestClosed   = p[4];

  const maxPossible = WAD_ONE;

  // Oldest account score (plateau at 84 months)
  const bestOldest = oldestMonths > oldestClosed ? oldestMonths : oldestClosed;

  const oldestScore =
    bestOldest >= 84n
      ? WAD_ONE
      : wadDiv(bestOldest, 84n);

  // Average age score (plateau at 84 months)
  const avgMonths = avgAge_1e2 / 100n;

  const avgScore =
    avgMonths >= 84n
      ? WAD_ONE
      : wadDiv(avgMonths, 84n);

  // Newest account penalty
  let newPenalty = WAD_ZERO;

  if (newestMonths < 6n) {
    newPenalty = 1n * (10n ** 17n); // 10%
  } else if (newestMonths < 12n) {
    newPenalty = 5n * (10n ** 16n); // 5%
  }

  // Thin file penalty
  let thinPenalty = WAD_ZERO;

  if (totalAccounts === 0n) {
    thinPenalty = 4n * (10n ** 17n); // -40%
  } else if (totalAccounts < 3n) {
    thinPenalty = 2n * (10n ** 17n); // -20%
  }

  // Composite weighting:
  // 40% oldest, 50% average, 10% newest
  const newestScore =
    newestMonths >= 24n
      ? WAD_ONE
      : wadDiv(newestMonths, 24n);

  let raw =
    wadMul(oldestScore, 4n * (10n ** 17n)) +
    wadMul(avgScore,    5n * (10n ** 17n)) +
    wadMul(newestScore, 1n * (10n ** 17n));

  // Apply penalties
  raw = wadSubSat(raw, newPenalty);
  raw = wadSubSat(raw, thinPenalty);

  const componentScore = wadMin(WAD_ONE, raw);

  const explanation =
    "HISTORY LENGTH (15% weight) | " +
    "oldest_account=" + bestOldest + "mo | " +
    "average_age=" + avgMonths + "mo | " +
    "newest_account=" + newestMonths + "mo | " +
    "total_accounts=" + totalAccounts + " | " +
    "thin_file_penalty=-" + wadToPctString(thinPenalty) + "% | " +
    "new_account_penalty=-" + wadToPctString(newPenalty) + "% | " +
    "component_score=" + wadToPctString(componentScore) + "%";

  return {
    componentScore,
    maxPossible,
    derogatory: false,
    factorName: "Credit History Length",
    explanation
  };
}
