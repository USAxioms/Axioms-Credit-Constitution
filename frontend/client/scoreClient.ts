// SCORE CLIENT
// Frontend-facing wrapper for calling the backend scoring engine.
// Sends credit event params, receives composite + factor scores,
// and formats them for UI consumption.

import type { ScoreReport } from "../../backend/engine/runScore";
import { runScore } from "../../backend/engine/runScore";
import { Environment } from "../../backend/environment/environment";

export class ScoreClient {
  private env: Environment;

  constructor(configPath: string) {
    this.env = new Environment(configPath);
  }

  async computeScore(userAddress: string, params: bigint[]): Promise<ScoreReport> {
    // Run backend scoring pipeline
    const report = await runScore(params, userAddress, this.env.axioms);

    // Format for frontend
    return {
      compositeScore: report.compositeScore,
      factors: report.factors.map(f => ({
        factorName: f.factorName,
        componentScore: f.componentScore,
        maxPossible: f.maxPossible,
        derogatory: f.derogatory,
        explanation: f.explanation
      }))
    };
  }
}
