// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

var fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);

  const chainId = await deployer.getChainId();

  console.log(`Deploying on ${chainId}`);

  const Void2122Corporation = await ethers.getContractFactory(
    "Void2122Corporation"
  );
  const void2122Corporation = await upgrades.deployProxy(
    Void2122Corporation,
    deployer
  );
  await void2122Corporation.deployed();

  console.log(`Corporation deployed to ${void2122Corporation.address}`);

  const Void2122Factory = await ethers.getContractFactory("Void2122Factory");
  const void2122Factory = await upgrades.deployProxy(Void2122Factory, deployer);
  await void2122Factory.deployed();

  console.log(`Factory deployed to ${void2122Factory.address}`);

  const Void2122Loot = await ethers.getContractFactory("Void2122Loot");
  const void2122Loot = await upgrades.deployProxy(Void2122Loot, deployer);
  await void2122Loot.deployed();

  console.log(`Loot deployed to ${void2122Loot.address}`);

  const Void2122Mod = await ethers.getContractFactory("Void2122Mod");
  const void2122Mod = await upgrades.deployProxy(Void2122Mod, deployer);
  await void2122Mod.deployed();

  console.log(`Mod deployed to ${void2122Mod.address}`);

  const Void2122Schematic = await ethers.getContractFactory(
    "Void2122Schematic"
  );
  const void2122Schematic = await upgrades.deployProxy(
    Void2122Schematic,
    deployer
  );
  await void2122Schematic.deployed();

  console.log(`Schematic deployed to ${void2122Schematic.address}`);

  const Void2122Unit = await ethers.getContractFactory("Void2122Unit");
  const void2122Unit = await upgrades.deployProxy(Void2122Unit, deployer);
  await void2122Unit.deployed();

  console.log(`Unit deployed to ${void2122Unit.address}`);

  await void2122Factory.setLootAddress(void2122Loot.address);
  console.log(`Loot address set in Factory`);
  await void2122Factory.setModAddress(void2122Mod.address);
  console.log(`Mod address set in Factory`);
  await void2122Factory.setSchematicAddress(void2122Schematic.address);
  console.log(`Schematic address set in Factory`);
  await void2122Factory.setUnitAddress(void2122Unit.address);
  console.log(`Unit address set in Factory`);

  await void2122Mod.toggleAdmin(void2122Factory.address);
  console.log(`Factory added as admin in Mod`);

  await void2122Unit.toggleAdmin(void2122Factory.address);
  console.log(`Factory added as admin in Unit`);

  await void2122Unit.setModAddress(void2122Mod.address);
  console.log(`Mod address set in Unit`);

  await void2122Unit.setCorporationAddress(void2122Corporation.address);
  console.log(`Corporation address set in Unit`);

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
      corporation: Void2122Corporation.address,
      factory: void2122Factory.address,
      loot: void2122Loot.address,
      mod: void2122Mod.address,
      schematic: void2122Schematic.address,
      unit: void2122Unit.address,
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

  fs.writeFileSync("./contract-addresses.json", JSON.stringify(logs));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
