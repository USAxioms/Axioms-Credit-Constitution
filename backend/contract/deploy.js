// CONTRACT DEPLOYMENT SCRIPT
// Deploys AXIOMS.sol to any EVM-compatible chain.
// Pure deployment — no scoring logic.

const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(
      [
        "AXIOMS CONTRACT DEPLOY",
        "",
        "Usage:",
        "  node deploy.js <rpc> <privateKey>",
        "",
        "Example:",
        "  node deploy.js http://localhost:8545 0xPRIVATE",
        ""
      ].join("\n")
    );
    return;
  }

  const [rpcUrl, privateKey] = args;

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);

  const solPath = path.join(__dirname, "AXIOMS.sol");
  const source = fs.readFileSync(solPath, "utf8");

  // Compile Solidity
  const solc = require("solc");

  const input = {
    language: "Solidity",
    sources: {
      "AXIOMS.sol": { content: source }
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"]
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  const abi = output.contracts["AXIOMS.sol"]["AXIOMS"].abi;
  const bytecode = output.contracts["AXIOMS.sol"]["AXIOMS"].evm.bytecode.object;

  console.log("Deploying AXIOMS contract...");

  const factory = new ethers.ContractFactory(abi, bytecode, signer);
  const contract = await factory.deploy();

  console.log("Waiting for deployment...");
  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("AXIOMS deployed at:", address);

  // Write ABI to file
  const abiPath = path.join(__dirname, "abi.json");
  fs.writeFileSync(abiPath, JSON.stringify(abi, null, 2));

  console.log("ABI written to:", abiPath);
}

main().catch(err => {
  console.error("DEPLOY ERROR:", err);
});
