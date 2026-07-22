// LEDGER WRITE LAYER
// Commits WAD-scaled values to the blockchain.
// Performs NO computation — only writes canonical state.

import { ethers } from "ethers";

export class LedgerWriter {
  private provider: ethers.Provider;
  private signer: ethers.Signer;
  private contract: ethers.Contract;

  constructor(
    rpcUrl: string,
    privateKey: string,
    contractAddress: string,
    abi: any
  ) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);
    this.contract = new ethers.Contract(contractAddress, abi, this.signer);
  }

  // Commit the active ruleset hash to the ledger
  async setRulesetHash(hash: string): Promise<ethers.TransactionReceipt> {
    const tx = await this.contract.setRulesetHash(hash);
    return await tx.wait();
  }

  // Commit a component score (WAD)
  async setComponentScore(
    user: string,
    factorId: number,
    scoreWad: bigint
  ): Promise<ethers.TransactionReceipt> {
    const tx = await this.contract.setComponentScore(
      user,
      factorId,
      scoreWad.toString()
    );
    return await tx.wait();
  }

  // Commit the composite score (WAD)
  async setCompositeScore(
    user: string,
    scoreWad: bigint
  ): Promise<ethers.TransactionReceipt> {
    const tx = await this.contract.setCompositeScore(
      user,
      scoreWad.toString()
    );
    return await tx.wait();
  }

  // Commit raw credit event parameters (16 WAD-scaled params)
  async setCreditEvent(
    user: string,
    params: bigint[]
  ): Promise<ethers.TransactionReceipt> {
    if (params.length !== 16) {
      throw new Error("Credit event must contain exactly 16 WAD parameters.");
    }

    const tx = await this.contract.setCreditEvent(
      user,
      params.map(x => x.toString())
    );

    return await tx.wait();
  }
}
