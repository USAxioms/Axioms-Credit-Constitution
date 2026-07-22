// ENVIRONMENT RULESET VERIFIER
// Ensures the active ruleset hash on-chain matches the local constitutional ruleset.
// This module is called BEFORE any scoring occurs.

import { computeRulesetHash } from "../ruleset/hash";
import { LedgerReader } from "../ledger/read";

export class RulesetVerifier {
  private reader: LedgerReader;
  private rulesetPath: string;

  constructor(reader: LedgerReader, rulesetVersion: string) {
    this.reader = reader;
    this.rulesetPath = `backend/ruleset/${rulesetVersion}`;
  }

  // Throws if mismatch
  async verify(): Promise<void> {
    const onChainHash = await this.reader.getRulesetHash();
    const localHash = computeRulesetHash(this.rulesetPath);

    if (onChainHash !== localHash) {
      throw new Error(
        [
          "RULESET VERIFICATION FAILED",
          `On-chain hash: ${onChainHash}`,
          `Local hash:    ${localHash}`,
          "The environment cannot proceed until the constitutional ruleset is synchronized."
        ].join("\n")
      );
    }
  }

  // Returns true/false without throwing
  async check(): Promise<boolean> {
    const onChainHash = await this.reader.getRulesetHash();
    const localHash = computeRulesetHash(this.rulesetPath);
    return onChainHash === localHash;
  }
}
