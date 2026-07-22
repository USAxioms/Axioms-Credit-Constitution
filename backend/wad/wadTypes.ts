// WAD TYPES
// Shared type definitions for AXIOMS scoring engine.

export interface FactorResult {
  factorName: string;          // Human-readable name (e.g., "Payment History")
  componentScore: bigint;      // WAD score for this factor
  maxPossible: bigint;         // Maximum WAD score possible
  derogatory: boolean;         // Whether this factor detected derogatory behavior
  explanation: string;         // Human-readable explanation
}
