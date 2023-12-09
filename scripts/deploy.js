// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
var fs = require("fs");
const contractsData = require("../logs/contractsData.json");

// Clock Still Image: https://arweave.net/KiXrq9lwIe9Ql-gwWwnoHCSSc_JGyOc8guGE5yVGTlc/0.jpg
// Broken Clock Still Image: https://arweave.net/ngGdza9zgpCqEZMnrsbFIgbDZvcMVfaNyDRSB6u-hZs
// Unique Still Image: https://arweave.net/KiXrq9lwIe9Ql-gwWwnoHCSSc_JGyOc8guGE5yVGTlc/0.jpg
// Unique: https://arweave.net/ZI4UmLdWFdiMocrjfPcBEJRVzLdu4QnvJhhURwMtNLY

const clock = "https://arweave.net/-iNIWNsWRLHhpufr-3tHzvZbsE3l78pt9eK42MRDQbI";
const brokenClock =
  " https://arweave.net/6HuqHbnIESs8CYMTb2fBDH2xW52v1i-g8nK0D_G8g48";
const OneOne =
  "https://tir6cevy7j3rrlj2x4kfgfakoutplllnklxfvufmsmr6jo3k5s5q.arweave.net/miPhErj6dxitOr8UUxQKdSb1rW1S7lrQrJMj5Ltq7Ls";
const frames =
  "https://arweave.net/KiXrq9lwIe9Ql-gwWwnoHCSSc_JGyOc8guGE5yVGTlc/";

const numberOfFrames = 25;

const images = [
  "https://arweave.net/KiXrq9lwIe9Ql-gwWwnoHCSSc_JGyOc8guGE5yVGTlc/0.jpg",
  "https://arweave.net/ngGdza9zgpCqEZMnrsbFIgbDZvcMVfaNyDRSB6u-hZs",
  "https://arweave.net/KiXrq9lwIe9Ql-gwWwnoHCSSc_JGyOc8guGE5yVGTlc/0.jpg",
];
// Animation: [
//   "https://arweave.net/ZI4UmLdWFdiMocrjfPcBEJRVzLdu4QnvJhhURwMtNLY",
//   "https://arweave.net/6HuqHbnIESs8CYMTb2fBDH2xW52v1i-g8nK0D_G8g48",
//   "https://arweave.net/-iNIWNsWRLHhpufr-3tHzvZbsE3l78pt9eK42MRDQbI",
// ];

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);

  const chainId = await deployer.getChainId();

  console.log(`Deploying on ${chainId}`);

  console.log("Deploying Killing Time...");
  const kt = await hre.ethers.deployContract("KillingTime");
  await kt.deployed();
  console.log(`KT deployed to ${kt.address}`);

  console.log("Setting the URI");
  await kt.setURIs(images, [clock, brokenClock, OneOne]);

  console.log("Setting the frames");
  await kt.setFrames(numberOfFrames, frames);

  console.log("Deploying Minting contract...");
  const ktMint = await ethers.deployContract("KillingTimeMint", [kt.address]);
  console.log(`KTMint deployed to ${ktMint.address}`);

  console.log("Adding Mint contract as KT admin...");
  await kt.toggleAdmin(ktMint.address);

  if (!contractsData[hre.network.name]) {
    contractsData[hre.network.name] = { KT: {}, KTMint: {} };
  }
  contractsData[hre.network.name]["KT"] = {
    contract: kt.address,
    arguments: "",
  };
  contractsData[hre.network.name]["KTMint"] = {
    contract: ktMint.address,
    arguments: [kt.address],
  };

  await storeDeploymentInformation();

  console.log(contractsData);
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
