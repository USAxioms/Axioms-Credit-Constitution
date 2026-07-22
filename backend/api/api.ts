// BACKEND API ROUTER
// Lightweight HTTP interface for AXIOMS scoring engine.
// Exposes endpoints for:
// - ruleset verification
// - score execution
// - explanation generation
// - raw ledger pulls

import express from "express";
import { LedgerReader } from "../ledger/read";
import { LedgerWriter } from "../ledger/write";
import { ScoreEnvironment } from "../env/runScore";
import { ExplanationGenerator } from "../env/explainScore";

import fs from "fs";
import path from "path";

export function createApi(
  rpcUrl: string,
  contractAddress: string,
  privateKey: string,
  rulesetVersion: string
) {
  const abiPath = path.join("backend", "contract", "abi.json");
  const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));

  const reader = new LedgerReader(rpcUrl, contractAddress, abi);
  const writer = new LedgerWriter(rpcUrl, privateKey, contractAddress, abi);

  const env = new ScoreEnvironment(reader, writer, rulesetVersion);
  const explainer = new ExplanationGenerator(rulesetVersion);

  const app = express();
  app.use(express.json());

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", ruleset: rulesetVersion });
  });

  // Verify ruleset hash
  app.get("/verify", async (_req, res) => {
    try {
      await env.verifyRuleset();
      res.json({ verified: true });
    } catch (err: any) {
      res.status(400).json({ verified: false, error: err.message });
    }
  });

  // Pull raw credit event
  app.get("/event/:user", async (req, res) => {
    try {
      const params = await reader.getCreditEvent(req.params.user);
      res.json({ user: req.params.user, params });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Run scoring
  app.post("/score/:user", async (req, res) => {
    try {
      const { composite, components } = await env.run(req.params.user);
      res.json({ composite, components });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Full explanation
  app.get("/explain/:user", async (req, res) => {
    try {
      const { composite, components } = await env.run(req.params.user);
      const explanation = explainer.explainAll(composite, components);
      res.json({ composite, components, explanation });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  return app;
}
