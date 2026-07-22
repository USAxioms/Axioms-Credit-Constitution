// CREDIT UTILIZATION ENGINE (WAD Backend Version)
// Mirrors CRE_Utilization but runs entirely off-chain using WAD arithmetic.
// Pure, deterministic, zero-dependency constitutional math.

import {
  WAD_ONE, WAD_ZERO,
  wadMul, wadDiv, wadSubSat, wadMin, wadMax, wadToPctString
} from "../wad/wadMath";

import { FactorParams, FactorResult } from "../wad/wadTypes";

export function evaluateUtilization(p: FactorParams): FactorResult {
  const totalLimit   = p[0];
  const totalBal     = p[1];
  const revLimit     = p[2];
  const revBal       = p[3];
  const highCardUtil = p[4]; // * 1e4
  const cardsZero    = p[5];
  const totalCards   = p[6];
  const instBal      = p[7];
  const instOrig     = p[8];

  const maxPossible = WAD_ONE;

  // Aggregate utilization
  const aggUtil = totalLimit > 0n
    ? wadDiv(totalBal, totalLimit)
    : WAD_ZERO;

  // Non-linear utilization curve
  let aggScore: bigint;

  if (aggUtil <= 9n * (10n ** 16n)) {
    aggScore = WAD_ONE; // optimal
  } else if (aggUtil <= 29n * (10n ** 16n)) {
    aggScore = 92n * (10n ** 16n); // good
  } else if (aggUtil <= 49n * (10n ** 16n)) {
    const over30 = aggUtil - 30n * (10n ** 16n);
    aggScore = wadSubSat(85n * (10n ** 16n), wadMul(over30, 4n * (10n ** 17n)) / (19n * (10n ** 16n)));
  } else if (aggUtil <= 74n * (10n ** 16n)) {
    const over50 = aggUtil - 50n * (10n ** 16n);
    aggScore = wadSubSat(70n * (10n ** 16n), wadMul(over50, 3n * (10n ** 17n)) / (24n * (10n ** 16n)));
  } else if (aggUtil <= 89n * (10n ** 16n)) {
    const over75 = aggUtil - 75n * (10n ** 16n);
    aggScore = wadSubSat(43n * (10n ** 16n), wadMul(over75, 25n * (10n ** 16n)) / (14n * (10n ** 16n)));
  } else {
    const over90 = aggUtil - 90n * (10n ** 16n);
    aggScore = wadSubSat(20n * (10n ** 16n), wadMul(over90, 18n * (10n ** 16n)) / (10n * (10n ** 16n)));
  }

  // Highest-card utilization penalty
  const highUtilWad = highCardUtil * (10n ** 14n);
  let cardScore = WAD_ONE;

  if (highUtilWad > 9n * (10n ** 16n)) {
    const overThresh = highUtilWad - 9n * (10n ** 16n);
    cardScore = wadSubSat(WAD_ONE, wadMul(overThresh, 5n * (10n ** 17n)) / (91n * (10n ** 16n)));
  }

  // Zero-balance bonus
  let zeroBonus = WAD_ZERO;
  if (totalCards > 0n && cardsZero > 0n) {
    const zeroRate = wadDiv(cardsZero, totalCards);
    zeroBonus = wadMul(zeroRate, 5n * (10n ** 16n)); // up to +5%
  }

  // Revolving score
  const revScore = revLimit > 0n
    ? aggScore
    : WAD_ONE;

  // Installment score
  let instScore = WAD_ONE;
  if (instOrig > 0n && instBal <= instOrig) {
    const paidDown = wadDiv(instOrig - instBal, instOrig);
    instScore = 7n * (10n ** 17n) + wadMul(paidDown, 3n * (10n ** 17n));
  }

  // Weighted composite: 70% revolving, 30% installment
  let rawScore =
    wadMul(revScore, 7n * (10n ** 17n)) +
    wadMul(instScore, 3n * (10n ** 17n));

  // Apply per-card penalty
  rawScore = wadMul(rawScore, cardScore);

  // Apply zero-balance bonus
  const componentScore = wadMin(WAD_ONE, rawScore + zeroBonus);

  const derogatory = aggUtil > 50n * (10n ** 16n);

  const explanation =
    "CREDIT UTILIZATION (30% weight) | " +
    "aggregate_util=" + wadToPctString(aggUtil) + "% | " +
    "revolving_util=" + (revLimit > 0n ? wadToPctString(wadDiv(revBal, revLimit)) : "N/A") + "% | " +
    "highest_card_util=" + wadToPctString(highUtilWad) + "% | " +
    "cards_at_zero=" + cardsZero + "/" + totalCards + " | " +
    "zero_balance_bonus=+" + wadToPctString(zeroBonus) + "% | " +
    "component_score=" + wadToPctString(componentScore) + "%";

  return {
    componentScore,
    maxPossible,
    derogatory,
    factorName: "Credit Utilization",
    explanation
  };
}
