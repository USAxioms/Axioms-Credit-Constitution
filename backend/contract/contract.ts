// AXIOMS CONTRACT WRAPPER
// Provides typed methods for interacting with the AXIOMS smart contract.

import { ethers } from "ethers";

export class AxiomsContract {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(rpcUrl: string, contractAddress: string, privateKey?: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    if (!privateKey) {
      throw new Error("A private key is required to sign AXIOMS transactions.");
    }

    this.signer = new ethers.Wallet(privateKey, this.provider);

    const abi = [
      "function setCompositeScore(address user, uint256 score) external",
      "function setComponentScore(address user, uint256 index, uint256 score) external",
      "function setCreditEvent(address user, uint256[] calldata params) external"
    ];

    this.contract = new ethers.Contract(contractAddress, abi, this.signer);
  }

  async setCompositeScore(user: string, score: bigint): Promise<void> {
    const tx = await this.contract.setCompositeScore(user, score);
    await tx.wait();
  }

  async setComponentScore(user: string, index: number, score: bigint): Promise<void> {
    const tx = await this.contract.setComponentScore(user, index, score);
    await tx.wait();
  }

  async setCreditEvent(user: string, params: bigint[]): Promise<void> {
    const tx = await this.contract.setCreditEvent(user, params);
    await tx.wait();
  }
}
