// WAD Types & Shared Interfaces
// Constitutional backend primitives for R³ Engine

export const WAD_ONE = 10n ** 18n;
export const WAD_ZERO = 0n;

// Component score output structure (mirrors ICREChild.evaluate)
export interface FactorResult {
  componentScore: bigint;   // WAD 0–1e18
  maxPossible: bigint;      // always 1e18
  derogatory: boolean;      // true if factor is negative
  factorName: string;       // human-readable name
  explanation: string;      // full explanation string
}

// 16-parameter input array for each factor engine
export type FactorParams = [
  bigint, bigint, bigint, bigint,
  bigint, bigint, bigint, bigint,
  bigint, bigint, bigint, bigint,
  bigint, bigint, bigint, bigint
];
