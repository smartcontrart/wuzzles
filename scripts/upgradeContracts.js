// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const contractsData = require("../logs/contractsData.json");

var fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);

  const chainId = await deployer.getChainId();

  console.log(`Deploying on ${chainId}`);

  let tokcunts = await hre.ethers.getContractAt(
    "Tokcunts",
    contractsData[hre.network.name]["Tokcunts"].proxy
  );

  console.log("Upgrading contract...");

  const Tokcunts = await ethers.getContractFactory("Tokcunts");
  tokcunts = await upgrades.upgradeProxy(
    contractsData[hre.network.name]["Tokcunts"].proxy,
    Tokcunts
  );

  const tokcuntsImplementationAddress =
    await upgrades.erc1967.getImplementationAddress(tokcunts.address);
  console.log(
    `Successfully upgraded contract: proxy: ${tokcunts.address}, implementation: ${tokcuntsImplementationAddress}`
  );

  contractsData[hre.network.name]["Tokcunts"] = {
    proxy: tokcunts.address,
    contract: tokcuntsImplementationAddress,
    arguments: "",
  };

  await storeDeploymentInformation();
}

async function storeDeploymentInformation() {
  !fs.existsSync("./logs") ? fs.mkdirSync("./logs") : undefined;
  fs.writeFileSync(
    `./logs/contractData_${Date.now()}.json`,
    JSON.stringify(contractsData)
  );
  fs.writeFileSync(`./logs/contractsData.json`, JSON.stringify(contractsData));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
