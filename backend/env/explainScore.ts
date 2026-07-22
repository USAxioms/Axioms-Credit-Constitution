// FULL EXPLANATION GENERATOR
// Produces human-readable explanations for:
// - component scores
// - composite score
// - statutory anchors
// - decay curves
// - penalties & bonuses
// Purely descriptive — no scoring logic.

import fs from "fs";
import path from "path";
import { FactorResult } from "../wad/wadTypes";
import { wadToPctString } from "../wad/wadMath";

export class ExplanationGenerator {
  private manifest: any;
  private statutory: any;
  private penalties: any;
  private decay: any;
  private utilization: any;

  constructor(rulesetVersion: string) {
    const base = `backend/ruleset/${rulesetVersion}`;

    this.manifest   = JSON.parse(fs.readFileSync(path.join(base, "manifest.json"), "utf8"));
    this.statutory  = JSON.parse(fs.readFileSync(path.join(base, "statutory.json"), "utf8"));
    this.penalties  = JSON.parse(fs.readFileSync(path.join(base, "penalties_bonuses.json"), "utf8"));
    this.decay      = JSON.parse(fs.readFileSync(path.join(base, "decay.json"), "utf8"));
    this.utilization= JSON.parse(fs.readFileSync(path.join(base, "utilization.json"), "utf8"));
  }

  // Explain a single factor result
  explainFactor(fr: FactorResult): string {
    const statutory = this.statutory.mapping[fr.factorName.toLowerCase().replace(" ", "_")];

    return [
      `=== ${fr.factorName.toUpperCase()} ===`,
      `Score: ${wadToPctString(fr.componentScore)}%`,
      `Max Possible: ${wadToPctString(fr.maxPossible)}%`,
      `Derogatory: ${fr.derogatory ? "Yes" : "No"}`,
      ``,
      `DETAILS:`,
      fr.explanation,
      ``,
      `STATUTORY BASIS:`,
      `- ${statutory.description}`,
      `- Anchored to: ${statutory.statutes.join(", ")}`,
      ``
    ].join("\n");
  }

  // Explain composite score
  explainComposite(composite: bigint): string {
    const w = this.manifest.weights;

    return [
      `=== COMPOSITE SCORE ===`,
      `Final Score: ${wadToPctString(composite)}%`,
      ``,
      `WEIGHTS (basis points):`,
      `- Payment History: ${w.payment_history_bps} bps`,
      `- Utilization:     ${w.utilization_bps} bps`,
      `- History Length:  ${w.history_length_bps} bps`,
      `- Credit Mix:      ${w.credit_mix_bps} bps`,
      ``,
      `NOTES:`,
      `These weights are derived from CFPB methodology (2023) and public FICO disclosures.`,
      ``
    ].join("\n");
  }

  // Explain decay curves (Payment History)
  explainDecay(): string {
    const d = this.decay;

    return [
      `=== DEROGATORY DECAY CURVES ===`,
      `Halflife (months):`,
      `- 120+ severity: ${d.halflife_months["120_plus"]}`,
      `- 90+ severity:  ${d.halflife_months["90_plus"]}`,
      `- 60+ severity:  ${d.halflife_months["60_plus"]}`,
      `- 30+ severity:  ${d.halflife_months["30_plus"]}`,
      ``,
      `FCRA Obsolescence:`,
      `- Months: ${d.fcra_obsolescence.months}`,
      `- Cap Factor (WAD): ${d.fcra_obsolescence.cap_factor_wad}`,
      ``
    ].join("\n");
  }

  // Explain utilization curve
  explainUtilizationCurve(): string {
    const u = this.utilization;

    return [
      `=== UTILIZATION CURVE ===`,
      `Thresholds (WAD):`,
      `- Optimal: ${u.aggregate_curve.optimal_threshold_wad}`,
      `- Good:    ${u.aggregate_curve.good_threshold_wad}`,
      `- Moderate:${u.aggregate_curve.moderate_threshold_wad}`,
      `- High:    ${u.aggregate_curve.high_threshold_wad}`,
      `- Very High:${u.aggregate_curve.very_high_threshold_wad}`,
      ``,
      `Scores (WAD):`,
      `- Optimal: ${u.scores_wad.optimal}`,
      `- Good:    ${u.scores_wad.good}`,
      `- Moderate Base: ${u.scores_wad.moderate_base}`,
      `- High Base:     ${u.scores_wad.high_base}`,
      `- Very High Base:${u.scores_wad.very_high_base}`,
      `- Max Penalty Base:${u.scores_wad.max_penalty_base}`,
      ``
    ].join("\n");
  }

  // Explain penalties & bonuses
  explainPenalties(): string {
    return [
      `=== PENALTIES & BONUSES ===`,
      JSON.stringify(this.penalties, null, 2),
      ``
    ].join("\n");
  }

  // Full explanation bundle
  explainAll(
    composite: bigint,
    components: FactorResult[]
  ): string {
    const out: string[] = [];

    out.push(this.explainComposite(composite));

    for (const c of components) {
      out.push(this.explainFactor(c));
    }

    out.push(this.explainDecay());
    out.push(this.explainUtilizationCurve());
    out.push(this.explainPenalties());

    return out.join("\n");
  }
}
