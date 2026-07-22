// LEDGER READ LAYER
// Pulls WAD-scaled values and score records from the blockchain.
// This layer performs NO computation — it only retrieves canonical state.

import { ethers } from "ethers";

export class LedgerReader {
  private provider: ethers.Provider;
  private contract: ethers.Contract;

  constructor(rpcUrl: string, contractAddress: string, abi: any) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.contract = new ethers.Contract(contractAddress, abi, this.provider);
  }

  // Pull the active ruleset hash stored on-chain
  async getRulesetHash(): Promise<string> {
    return await this.contract.rulesetHash();
  }

  // Pull the composite score (WAD)
  async getCompositeScore(user: string): Promise<bigint> {
    const score = await this.contract.getCompositeScore(user);
    return BigInt(score.toString());
  }

  // Pull a component score (WAD)
  async getComponentScore(user: string, factorId: number): Promise<bigint> {
    const score = await this.contract.getComponentScore(user, factorId);
    return BigInt(score.toString());
  }

  // Pull raw credit event parameters (16 WAD-scaled params)
  async getCreditEvent(user: string): Promise<bigint[]> {
    const params = await this.contract.getCreditEvent(user);
    return params.map((x: any) => BigInt(x.toString()));
  }

  // Pull storage proof (for off-chain verification)
  async getStorageProof(slot: string): Promise<any> {
    return await this.provider.send("eth_getProof", [
      this.contract.target,
      [slot],
      "latest"
    ]);
  }
}
