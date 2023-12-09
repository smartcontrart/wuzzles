// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
var fs = require("fs");
const contractsData = require("../logs/contractsData.json");
const clientWallet1 = "0xBE5F2A298C15223c257FEcE051996676E081D00f";
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);

  const chainId = await deployer.getChainId();

  console.log(`Deploying on ${chainId}`);

  let tokcunts = await hre.ethers.getContractAt(
    "Tokcunts",
    contractsData[hre.network.name]["Tokcunts"].proxy
  );

  console.log(`Tokcunt contract identified at: ${tokcunts.address}`);

  for (let i = 0; i < 151 - 2 - 38; i++) {
    console.log(`minting Tokcunt ${i}`);
    await tokcunts.mint(clientWallet1);
  }
  if (i % 15 === 0) {
    await delay(12000);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
