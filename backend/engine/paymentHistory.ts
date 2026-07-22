// PAYMENT HISTORY ENGINE (WAD Backend Version)
// Mirrors CRE_PaymentHistory but runs entirely off-chain using WAD arithmetic.
// Pure, deterministic, zero-dependency constitutional math.

import { 
  WAD_ONE, WAD_ZERO,
  wadMul, wadDiv, wadSubSat, wadMin, wadMax, wadToPctString
} from "../wad/wadMath";
import { FactorParams, FactorResult } from "../wad/wadTypes";

export function evaluatePaymentHistory(p: FactorParams): FactorResult {
  const totalPayments     = p[0];
  const onTime            = p[1];
  const late30            = p[2];
  const late60            = p[3];
  const late90            = p[4];
  const late120           = p[5];
  const chargeOffs        = p[6];
  const recentMonths      = p[7];
  const recentSeverity    = p[8];
  const streak            = p[9];
  const oldestLate        = p[10];

  const maxPossible = WAD_ONE;

  // No history → neutral-low score
  if (totalPayments === 0n) {
    return {
      componentScore: 65n * (10n ** 16n),
      maxPossible,
      derogatory: false,
      factorName: "Payment History",
      explanation:
        "PAYMENT HISTORY | No payment history on file. Score: 65%. " +
        "Thin file — not derogatory."
    };
  }

  // Base rate: on-time / total
  const onTimeRate = wadDiv(onTime, totalPayments);

  // Derogatory severity score (WAD-scaled)
  const derogScore =
      wadMul(late30,  1n * (10n ** 18n)) +
      wadMul(late60,  15n * (10n ** 17n)) +
      wadMul(late90,  20n * (10n ** 17n)) +
      wadMul(late120, 25n * (10n ** 17n)) +
      wadMul(chargeOffs, 30n * (10n ** 17n));

  // Time decay (WAD expNeg approximation)
  let halflife: bigint =
      recentSeverity >= 120n ? 60n * WAD_ONE :
      recentSeverity >= 90n  ? 48n * WAD_ONE :
      recentSeverity >= 60n  ? 36n * WAD_ONE :
                               24n * WAD_ONE;

  let decayArg = wadDiv(recentMonths * WAD_ONE, halflife);
  let decayFactor = wadExpNeg(decayArg); // implemented below

  // FCRA obsolescence: older than 84 months → near zero
  if (oldestLate >= 84n) {
    decayFactor = wadMin(decayFactor, 1n * (10n ** 16n));
  }

  const effectiveDerog = wadMul(derogScore, decayFactor);

  // Rehabilitation from streak
  const rehab =
      streak >= 24n ? 15n * (10n ** 16n) :
      streak >= 12n ?  8n * (10n ** 16n) :
      streak >= 6n  ?  3n * (10n ** 16n) :
                       WAD_ZERO;

  // Penalty capped at 60%
  const penaltyCap = 6n * (10n ** 17n);

  const penalty = wadMin(
    wadMin(onTimeRate, penaltyCap),
    wadMul(effectiveDerog, 1n * (10n ** 17n))
  );

  const componentScore = wadMin(
    WAD_ONE,
    wadSubSat(onTimeRate, penalty) + wadMin(rehab, penalty)
  );

  const derogatory = derogScore > 0n && decayFactor > 1n * (10n ** 16n);

  const explanation =
    "PAYMENT HISTORY (35% weight) | " +
    "on_time_rate=" + wadToPctString(onTimeRate) + "% | " +
    "derogatory_events=[30d:" + late30 +
      " 60d:" + late60 +
      " 90d:" + late90 +
      " 120d+:" + late120 +
      " CO:" + chargeOffs + "] | " +
    "decay_factor=" + wadToPctString(decayFactor) + "% | " +
    "streak_rehab=" + wadToPctString(rehab) + "% | " +
    "component_score=" + wadToPctString(componentScore) + "%";

  return {
    componentScore,
    maxPossible,
    derogatory,
    factorName: "Payment History",
    explanation
  };
}

// Minimal WAD expNeg approximation (same structure as Solidity version)
function wadExpNeg(x: bigint): bigint {
  if (x >= 20n * WAD_ONE) return WAD_ZERO;
  if (x === WAD_ZERO) return WAD_ONE;

  let r = x / 8n;
  let result = WAD_ONE;
  let term = WAD_ONE;
  let neg = false;

  const facts = [1n,2n,6n,24n,120n,720n,5040n,40320n];

  for (let k = 0; k < 8; k++) {
    term = wadDiv(term * r, BigInt(facts[k]));
    neg = !neg;
    result = neg ? wadSubSat(result, term) : result + term;
  }

  // repeated squaring
  result = wadMul(result, result);
  result = wadMul(result, result);
  result = wadMul(result, result);

  return result;
}
