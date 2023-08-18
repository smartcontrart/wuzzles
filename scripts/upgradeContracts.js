// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const addresses = require("./logs/contract-addresses.json");

var fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);

  const chainId = await deployer.getChainId();

  console.log(`Deploying on ${chainId}`);

  const Void2122Corporation = await ethers.getContractFactory(
    "Void2122Corporation"
  );
  const void2122Corporation = await upgrades.upgradeProxy(
    addresses.proxies.corporation,
    Void2122Corporation
  );
  const corporationImplementationAddress =
    await upgrades.erc1967.getImplementationAddress(
      void2122Corporation.address
    );

  console.log(
    `Corporation successfully upgraded: proxy: ${void2122Corporation.address}, implementation: ${corporationImplementationAddress}`
  );

  const Void2122Factory = await ethers.getContractFactory("Void2122Factory");
  const void2122Factory = await upgrades.upgradeProxy(
    addresses.proxies.factory,
    Void2122Factory
  );
  const factoryImplementationAddress =
    await upgrades.erc1967.getImplementationAddress(void2122Factory.address);

  console.log(
    `Factory successfully upgraded: proxy: ${void2122Factory.address}, implementation: ${factoryImplementationAddress}`
  );

  const Void2122Loot = await ethers.getContractFactory("Void2122Loot");
  const void2122Loot = await upgrades.upgradeProxy(
    addresses.proxies.loot,
    Void2122Loot
  );
  const lootImplementationAddress =
    await upgrades.erc1967.getImplementationAddress(void2122Loot.address);
  console.log(
    `Loot successfully upgraded: proxy: ${void2122Loot.address}, implementation: ${lootImplementationAddress}`
  );

  const Void2122Mod = await ethers.getContractFactory("Void2122Mod");
  const void2122Mod = await upgrades.upgradeProxy(
    addresses.proxies.mod,
    Void2122Mod
  );
  const modImplementationAddress =
    await upgrades.erc1967.getImplementationAddress(void2122Mod.address);
  console.log(
    `Mod successfully upgraded: proxy: ${void2122Mod.address}, implementation: ${modImplementationAddress}`
  );

  const Void2122Schematic = await ethers.getContractFactory(
    "Void2122Schematic"
  );
  const void2122Schematic = await upgrades.upgradeProxy(
    addresses.proxies.schematic,
    Void2122Schematic
  );
  const schematicImplementationAddress =
    await upgrades.erc1967.getImplementationAddress(void2122Schematic.address);
  console.log(
    `Schematic successfully upgraded: proxy: ${void2122Schematic.address}, implementation: ${schematicImplementationAddress}`
  );

  const Void2122Unit = await ethers.getContractFactory("Void2122Unit");
  const void2122Unit = await upgrades.upgradeProxy(
    addresses.proxies.mod,
    Void2122Unit
  );
  const unitImplementationAddress =
    await upgrades.erc1967.getImplementationAddress(void2122Unit.address);

  console.log(
    `Unit successfully upgraded: proxy: ${void2122Unit.address}, implementation: ${unitImplementationAddress}`
  );

  await run("verify:verify", {
    address: void2122Corporation.address,
  });
  await run("verify:verify", {
    address: void2122Factory.address,
  });
  await run("verify:verify", {
    address: void2122Loot.address,
  });
  await run("verify:verify", {
    address: void2122Mod.address,
  });
  await run("verify:verify", {
    address: void2122Schematic.address,
  });
  await run("verify:verify", {
    address: void2122Unit.address,
  });

  const logs = {
    contracts: {
      corporation: corporationImplementationAddress,
      factory: factoryImplementationAddress,
      loot: lootImplementationAddress,
      mod: modImplementationAddress,
      schematic: schematicImplementationAddress,
      unit: unitImplementationAddress,
    },
    proxies: {
      corporation: void2122Corporation.address,
      factory: void2122Factory.address,
      loot: void2122Loot.address,
      mod: void2122Mod.address,
      schematic: void2122Schematic.address,
      unit: void2122Unit.address,
    },
  };

  fs.writeFileSync(
    `./logs/contract-addresses_log_${Date.now()}.json`,
    JSON.stringify(logs)
  );
  fs.writeFileSync("./logs/contract-addresses.json", JSON.stringify(logs));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
