// SCORING ORCHESTRATOR
// Runs all factor engines, aggregates results, computes composite score,
// and writes results to the AXIOMS smart contract.

import { AxiomsContract } from "../contract/contract";
import { FactorResult } from "../wad/wadTypes";
import { WAD_ONE, wadMul } from "../wad/wadMath";

import { evaluatePaymentHistory } from "./paymentHistory";
import { evaluateUtilization } from "./utilization";
import { evaluateHistoryLength } from "./historyLength";
import { evaluateCreditMix } from "./creditMix";
import { evaluatePenalty } from "./penalty";

export interface ScoreReport {
  compositeScore: bigint;
  factors: FactorResult[];
}

export async function runScore(
  params: bigint[],
  userAddress: string,
  axioms: AxiomsContract
): Promise<ScoreReport> {

  // Run all factor engines
  const paymentHistory = evaluatePaymentHistory(params);
  const utilization = evaluateUtilization(params);
  const historyLength = evaluateHistoryLength(params);
  const creditMix = evaluateCreditMix(params);
  const penalty = evaluatePenalty(params);

  const factors = [
    paymentHistory,
    utilization,
    historyLength,
    creditMix,
    penalty
  ];

  // Weighted composite score
  // (weights are stored in the ruleset manifest)
  const weights = {
    paymentHistory: 0.35,
    utilization: 0.30,
    historyLength: 0.15,
    creditMix: 0.10,
    penalty: 0.10
  };

  const composite =
    wadMul(paymentHistory.componentScore, pctToWad(weights.paymentHistory * 100n)) +
    wadMul(utilization.componentScore, pctToWad(weights.utilization * 100n)) +
    wadMul(historyLength.componentScore, pctToWad(weights.historyLength * 100n)) +
    wadMul(creditMix.componentScore, pctToWad(weights.creditMix * 100n)) +
    wadMul(penalty.componentScore, pctToWad(weights.penalty * 100n));

  // Clamp composite to WAD range
  const compositeScore = composite > WAD_ONE ? WAD_ONE : composite;

  // Write composite + component scores to contract
  await axioms.setCompositeScore(userAddress, compositeScore);

  for (let i = 0; i < factors.length; i++) {
    await axioms.setComponentScore(userAddress, i, factors[i].componentScore);
  }

  // Write raw credit event params
  await axioms.setCreditEvent(userAddress, params);

  return {
    compositeScore,
    factors
  };
}

// Helper: convert percent to WAD
function pctToWad(pct: number): bigint {
  return BigInt(Math.round((pct / 100) * Number(WAD_ONE)));
}
