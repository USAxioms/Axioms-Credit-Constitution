// ENVIRONMENT CLI
// Command-line interface for AXIOMS scoring engine.
// Allows operators to:
// - verify ruleset
// - pull credit events
// - run scoring
// - commit results
// - print explanations

import { LedgerReader } from "../ledger/read";
import { LedgerWriter } from "../ledger/write";
import { ScoreEnvironment } from "./runScore";
import { ExplanationGenerator } from "./explainScore";

import fs from "fs";
import path from "path";

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 4) {
    console.log(
      [
        "AXIOMS SCORING CLI",
        "",
        "Usage:",
        "  node cli.js <rpc> <contract> <privateKey> <user> [rulesetVersion]",
        "",
        "Example:",
        "  node cli.js http://localhost:8545 0xABC... 0xPRIVATE user123 v1.0.0",
        ""
      ].join("\n")
    );
    return;
  }

  const [rpc, contract, privateKey, user, version = "v1.0.0"] = args;

  // Load ABI
  const abiPath = path.join("backend", "contract", "abi.json");
  const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));

  // Initialize ledger interfaces
  const reader = new LedgerReader(rpc, contract, abi);
  const writer = new LedgerWriter(rpc, privateKey, contract, abi);

  // Initialize environment
  const env = new ScoreEnvironment(reader, writer, version);

  // Run scoring
  console.log("Running AXIOMS scoring pipeline...");
  const { composite, components } = await env.run(user);

  // Generate explanation
  const explainer = new ExplanationGenerator(version);
  const explanation = explainer.explainAll(composite, components);

  console.log("\n=== FINAL EXPLANATION ===\n");
  console.log(explanation);
}

main().catch(err => {
  console.error("CLI ERROR:", err);
});
