const {
  time,
  mine,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers, upgrades, waffle } = require("hardhat");
const hre = require("hardhat");

describe("Killing Time", function () {
  async function deployKillingTomeAndMint() {
    // Contracts are deployed using the first signer/account by default
    const [deployer, user1, user2] = await ethers.getSigners();

    const KillingTime = await hre.ethers.getContractFactory("KillingTime");
    const KillingTimeMint = await hre.ethers.getContractFactory(
      "KillingTimeMint"
    );

    const killingTime = await KillingTime.deploy();
    await killingTime.deployed();

    const killingTimeMint = await KillingTimeMint.deploy(killingTime.address);
    await killingTimeMint.deployed();

    return {
      killingTime,
      killingTimeMint,
      deployer,
      user1,
      user2,
    };
  }

  describe("Initialization", function () {
    it("Should have a name", async function () {
      const { killingTime, killingTimeMint, deployer, user1, user2 } =
        await loadFixture(deployKillingTomeAndMint);
      expect(await killingTime.name()).to.equal("Killing Time");
    });
  });
});
