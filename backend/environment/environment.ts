// ENVIRONMENT LOADER
// Initializes the AXIOMS contract wrapper, loads configuration,
// and exposes a ready-to-use scoring environment.

import { AxiomsContract } from "../contract/contract";
import fs from "fs";
import path from "path";

export interface EnvironmentConfig {
  rpcUrl: string;
  contractAddress: string;
  privateKey?: string;
  rulesetVersion: string;
}

export class Environment {
  public axioms: AxiomsContract;
  public rulesetVersion: string;
  public config: EnvironmentConfig;

  constructor(configPath: string) {
    this.config = this.loadConfig(configPath);

    this.axioms = new AxiomsContract(
      this.config.rpcUrl,
      this.config.contractAddress,
      this.config.privateKey
    );

    this.rulesetVersion = this.config.rulesetVersion;
  }

  private loadConfig(configPath: string): EnvironmentConfig {
    const fullPath = path.resolve(configPath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`Environment config not found at: ${fullPath}`);
    }

    const raw = fs.readFileSync(fullPath, "utf8");
    const parsed = JSON.parse(raw);

    return {
      rpcUrl: parsed.rpcUrl,
      contractAddress: parsed.contractAddress,
      privateKey: parsed.privateKey,
      rulesetVersion: parsed.rulesetVersion
    };
  }

  // Load ruleset manifest
  loadRulesetManifest(): any {
    const manifestPath = path.join(
      "backend",
      "ruleset",
      this.rulesetVersion,
      "manifest.json"
    );

    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Ruleset manifest not found: ${manifestPath}`);
    }

    return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  }
}
