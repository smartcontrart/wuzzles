const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Void2122Loot", function () {
  const defaultLoot = {
    id: 1,
    tokenId: 0,
    name: "test loot",
    description: "loot description",
    uri: "loot uri",
    isBroken: true,
  };

  async function deployVoid2122Loot() {
    // Contracts are deployed using the first signer/account by default
    const [deployer, player1, player2] = await ethers.getSigners();

    const Void2122Loot = await ethers.getContractFactory("Void2122Loot");
    const void2122Loot = await upgrades.deployProxy(Void2122Loot, deployer);

    const Void2122Mod = await ethers.getContractFactory("Void2122Mod");
    const void2122Mod = await upgrades.deployProxy(Void2122Mod, deployer);

    const Void2122Schematic = await ethers.getContractFactory(
      "Void2122Schematic"
    );
    const void2122Schematic = await upgrades.deployProxy(
      Void2122Schematic,
      deployer
    );

    const Void2122Unit = await ethers.getContractFactory("Void2122Unit");
    const void2122Unit = await upgrades.deployProxy(Void2122Unit, deployer);

    await void2122Loot.deployed();

    return {
      void2122Loot,
      void2122Mod,
      void2122Schematic,
      void2122Unit,
      deployer,
      player1,
      player2,
    };
  }

  describe("Initialization", function () {
    it("Should have a name", async function () {
      const { void2122Loot } = await loadFixture(deployVoid2122Loot);
      expect(await void2122Loot.name()).to.equal("Void 2122 - Loots");
    });
  });

  describe("Royalties tests", async function () {
    it("Should have royalties and allow to set them", async function () {
      const {
        void2122Loot,
        void2122Mod,
        void2122Schematic,
        void2122Unit,
        deployer,
        player1,
      } = await loadFixture(deployVoid2122Loot);

      let royaltyInfo = await void2122Loot.connect(deployer).royaltyInfo(100);
      expect(royaltyInfo[0]).to.equal(deployer.address);
      expect(royaltyInfo[1]).to.equal(10);

      await void2122Loot.connect(deployer).setRoyalties(player1.address, 15);

      royaltyInfo = await void2122Loot.connect(deployer).royaltyInfo(100);
      expect(royaltyInfo[0]).to.equal(player1.address);
      expect(royaltyInfo[1]).to.equal(15);
    });
  });

  describe("Unit tests", async function () {
    const { void2122Loot, deployer } = await loadFixture(deployVoid2122Loot);

    it("Should create a loot", async function () {
      expect(
        await void2122Loot.connect(deployer).createLootn(defaultLoot)
      ).to.emit(void2122Loot, "LootCreated");
    });
  });
});
