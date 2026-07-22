// CONTRACT INTERFACE WRAPPER
// Strongly-typed wrapper around AXIOMS.sol for use inside the backend.
// Provides ergonomic methods for reading/writing WAD values.

import { ethers } from "ethers";
import fs from "fs";
import path from "path";

export class AxiomsContract {
  private provider: ethers.Provider;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract;

  constructor(
    rpcUrl: string,
    contractAddress: string,
    signerPrivateKey?: string
  ) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    const abiPath = path.join("backend", "contract", "abi.json");
    const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));

    if (signerPrivateKey) {
      this.signer = new ethers.Wallet(signerPrivateKey, this.provider);
      this.contract = new ethers.Contract(contractAddress, abi, this.signer);
    } else {
      this.contract = new ethers.Contract(contractAddress, abi, this.provider);
    }
  }

  /* ------------------------------------------------------------ */
  /*                         RULESET HASH                         */
  /* ------------------------------------------------------------ */

  async getRulesetHash(): Promise<string> {
    return await this.contract.rulesetHash();
  }

  async setRulesetHash(hash: string): Promise<ethers.TransactionReceipt> {
    if (!this.signer) throw new Error("Signer required for write operations");
    const tx = await this.contract.setRulesetHash(hash);
    return await tx.wait();
  }

  /* ------------------------------------------------------------ */
  /*                       COMPOSITE SCORE                        */
  /* ------------------------------------------------------------ */

  async getCompositeScore(user: string): Promise<bigint> {
    const score = await this.contract.getCompositeScore(user);
    return BigInt(score.toString());
  }

  async setCompositeScore(
    user: string,
    scoreWad: bigint
  ): Promise<ethers.TransactionReceipt> {
    if (!this.signer) throw new Error("Signer required for write operations");
    const tx = await this.contract.setCompositeScore(user, scoreWad.toString());
    return await tx.wait();
  }

  /* ------------------------------------------------------------ */
  /*                       COMPONENT SCORES                       */
  /* ------------------------------------------------------------ */

  async getComponentScore(user: string, factorId: number): Promise<bigint> {
    const score = await this.contract.getComponentScore(user, factorId);
    return BigInt(score.toString());
  }

  async setComponentScore(
    user: string,
    factorId: number,
    scoreWad: bigint
  ): Promise<ethers.TransactionReceipt> {
    if (!this.signer) throw new Error("Signer required for write operations");
    const tx = await this.contract.setComponentScore(
      user,
      factorId,
      scoreWad.toString()
    );
    return await tx.wait();
  }

  /* ------------------------------------------------------------ */
  /*                     CREDIT EVENT STORAGE                     */
  /* ------------------------------------------------------------ */

  async getCreditEvent(user: string): Promise<bigint[]> {
    const params = await this.contract.getCreditEvent(user);
    return params.map((x: any) => BigInt(x.toString()));
  }

  async setCreditEvent(
    user: string,
    params: bigint[]
  ): Promise<ethers.TransactionReceipt> {
    if (!this.signer) throw new Error("Signer required for write operations");
    if (params.length !== 16) {
      throw new Error("Credit event must contain exactly 16 WAD parameters");
    }

    const tx = await this.contract.setCreditEvent(
      user,
      params.map(x => x.toString())
    );

    return await tx.wait();
  }
}
