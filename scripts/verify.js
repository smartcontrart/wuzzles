// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const addresses = require("../logs/contract-addresses.json");

var fs = require("fs");

async function main() {
  await run("verify:verify", {
    address: addresses.contracts.corporation,
  });
  await run("verify:verify", {
    address: addresses.proxies.corporation,
  });
  await run("verify:verify", {
    address: addresses.contracts.factory,
  });
  await run("verify:verify", {
    address: addresses.proxies.factory,
  });
  await run("verify:verify", {
    address: addresses.contracts.loot,
  });
  await run("verify:verify", {
    address: addresses.proxies.loot,
  });
  await run("verify:verify", {
    address: addresses.contracts.mod,
  });
  await run("verify:verify", {
    address: addresses.proxies.mod,
  });
  await run("verify:verify", {
    address: addresses.contracts.schematic,
  });
  await run("verify:verify", {
    address: addresses.proxies.schematic,
  });
  await run("verify:verify", {
    address: addresses.contracts.unit,
  });
  await run("verify:verify", {
    address: addresses.proxies.unit,
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
