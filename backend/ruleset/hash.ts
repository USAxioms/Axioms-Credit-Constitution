// RULESET HASH GENERATOR
// Computes the constitutional hash for any ruleset version.
// Ledger stores ONLY this hash — not the ruleset itself.

import { createHash } from "crypto";
import fs from "fs";

export function computeRulesetHash(versionPath: string): string {
  const files = [
    "manifest.json",
    "decay.json",
    "utilization.json",
    "penalties_bonuses.json",
    "statutory.json"
  ];

  const hash = createHash("sha256");

  for (const file of files) {
    const fullPath = `${versionPath}/${file}`;
    const data = fs.readFileSync(fullPath);
    hash.update(data);
  }

  return hash.digest("hex");
}

// Example:
// const h = computeRulesetHash("backend/ruleset/v1.0.0");
// console.log("Ruleset Hash:", h);
