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

    await void2122Loot.deployed();

    return {
      void2122Loot,
      void2122Mod,
      void2122Schematic,
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

  describe("Administrative tasks", function () {
    it("Should set the mod address", async function () {
      const { void2122Loot, void2122Mod, void2122Schematic } =
        await loadFixture(deployVoid2122Loot);
      console.log(void2122Mod.address);
      await void2122Loot.setModAddress(void2122Mod.address);
    });

    it("Should set the schematic address", async function () {
      const { void2122Loot, void2122Mod, void2122Schematic } =
        await loadFixture(deployVoid2122Loot);
      await void2122Loot.setSchematicAddress(void2122Schematic.address);
    });
  });

  describe("Royalties tests", async function () {
    it("Should have royalties and allow to set them", async function () {
      const { void2122Loot, deployer, player1 } = await loadFixture(
        deployVoid2122Loot
      );

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
