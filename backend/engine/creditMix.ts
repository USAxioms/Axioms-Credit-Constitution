// CREDIT MIX ENGINE
// Computes WAD‑scaled score for diversity of credit types.
// Applies:
// - mix weighting
// - minimum account type requirements
// - diminishing returns for excessive accounts
// Returns FactorResult.

import { FactorResult } from "../wad/wadTypes";
import { WAD_ONE, wadClamp } from "../wad/wadMath";
import fs from "fs";
import path from "path";

export function evaluateCreditMix(params: bigint[]): FactorResult {
  // params[9]  = countRevolving
  // params[10] = countInstallment
  // params[11] = countMortgage
  // params[12] = countOpen
  // params[13] = totalAccounts

  const revolving = Number(params[9]);
  const installment = Number(params[10]);
  const mortgage = Number(params[11]);
  const open = Number(params
