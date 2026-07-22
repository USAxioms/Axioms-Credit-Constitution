// ENVIRONMENT RUNTIME
// The unified execution environment for AXIOMS scoring.
// Loads ruleset → verifies hash → pulls credit event → runs engines → commits results.
// Pure constitutional execution: deterministic, WAD-driven, versioned.

import fs from "fs";
import path from "path";

import { computeRulesetHash } from "../ruleset/hash";
import { LedgerReader } from "../ledger/read";
import { LedgerWriter } from "../ledger/write";

import { evaluatePaymentHistory } from "../engine/paymentHistory";
import { evaluateUtilization } from "../engine/utilization";
import { evaluateHistoryLength } from "../engine/historyLength";
import { evaluateCreditMix } from "../engine/creditMix";

import { FactorResult } from "../wad/wadTypes";
import { WAD_ONE, wadMul } from "../wad/wadMath";

export class ScoreEnvironment {
  private reader: LedgerReader;
  private writer: LedgerWriter;
  private rulesetPath: string;
  private manifest: any;

  constructor(
    reader: LedgerReader,
    writer: LedgerWriter,
    rulesetVersion: string
  ) {
    this.reader = reader;
    this.writer = writer;
    this.rulesetPath = `backend/ruleset/${rulesetVersion}`;

    const manifestFile = path.join(this.rulesetPath, "manifest.json");
    this.manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  }

  // Verify ruleset hash matches ledger
  async verifyRuleset(): Promise<void> {
    const onChainHash = await this.reader.getRulesetHash();
    const localHash = computeRulesetHash(this.rulesetPath);

    if (onChainHash !== localHash) {
      throw new Error(
        `Ruleset hash mismatch.\nOn-chain: ${onChainHash}\nLocal:    ${localHash}`
      );
    }
  }

  // Execute full scoring pipeline
  async run(user: string): Promise<{
    composite: bigint;
    components: FactorResult[];
  }> {
    // 1. Verify constitutional ruleset
    await this.verifyRuleset();

    // 2. Pull credit event parameters (16 WAD values)
    const params = await this.reader.getCreditEvent(user);

    // 3. Run factor engines
    const ph = evaluatePaymentHistory(params);
    const ut = evaluateUtilization(params);
    const hl = evaluateHistoryLength(params);
    const cm = evaluateCreditMix(params);

    const components = [ph, ut, hl, cm];

    // 4. Weighted composite score
    const w = this.manifest.weights;

    const composite =
      wadMul(ph.componentScore, BigInt(w.payment_history_bps)) +
      wadMul(ut.componentScore, BigInt(w.utilization_bps)) +
      wadMul(hl.componentScore, BigInt(w.history_length_bps)) +
      wadMul(cm.componentScore, BigInt(w.credit_mix_bps));

    // Normalize from basis points (10000)
    const finalScore = composite / 10000n;

    // 5. Commit component scores
    await this.writer.setComponentScore(user, 0, ph.componentScore);
    await this.writer.setComponentScore(user, 1, ut.componentScore);
    await this.writer.setComponentScore(user, 2, hl.componentScore);
    await this.writer.setComponentScore(user, 3, cm.componentScore);

    // 6. Commit composite score
    await this.writer.setCompositeScore(user, finalScore);

    return {
      composite: finalScore,
      components
    };
  }
}
