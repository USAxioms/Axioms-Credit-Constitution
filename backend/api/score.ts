// SCORE API ENDPOINT
// Exposes a POST /score route that accepts credit event params,
// runs the scoring engine, and returns composite + factor scores.

import express from "express";
import { ScoreClient } from "../../frontend/client/scoreClient";

const router = express.Router();

// Initialize score client with environment config
const scoreClient = new ScoreClient("backend/environment/config.json");

router.post("/score", async (req, res) => {
  try {
    const { userAddress, params } = req.body;

    if (!userAddress || !params) {
      return res.status(400).json({
        error: "Missing required fields: userAddress, params"
      });
    }

    // Convert params to bigint[]
    const bigintParams = params.map((p: string | number) => BigInt(p));

    // Compute score
    const report = await scoreClient.computeScore(userAddress, bigintParams);

    return res.json({
      compositeScore: report.compositeScore.toString(),
      factors: report.factors.map(f => ({
        factorName: f.factorName,
        componentScore: f.componentScore.toString(),
        maxPossible: f.maxPossible.toString(),
        derogatory: f.derogatory,
        explanation: f.explanation
      }))
    });

  } catch (err: any) {
    console.error("Score API error:", err);
    return res.status(500).json({
      error: "Internal scoring error",
      details: err.message
    });
  }
});

export default router;
