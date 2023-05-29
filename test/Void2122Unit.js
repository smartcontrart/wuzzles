const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Void2122Unit", function () {
  const defaultUnit = {
    id: 1,
    tokenId: 0,
    name: "test unit",
    level: 1,
    generation: 1,
    corporation: 1,
    model: "test model",
    description: "test description",
    uris: ["uri1", "uri2"],
    values: [1, 1, 1, 1],
    rarity: "Rare",
    modSlots: 2,
    mods: [],
  };

  async function deployVoid2122Unit() {
    // Contracts are deployed using the first signer/account by default
    const [deployer, player1, player2] = await ethers.getSigners();

    const Void2122Unit = await ethers.getContractFactory("Void2122Unit");

    const void2122Unit = await upgrades.deployProxy(Void2122Unit, deployer);

    await void2122Unit.deployed();

    return {
      void2122Unit,
      deployer,
      player1,
      player2,
    };
  }

  describe("Initialization", function () {
    it("Should have a name", async function () {
      const { void2122Unit } = await loadFixture(deployVoid2122Unit);
      expect(await void2122Unit.name()).to.equal("Void 2122 - Units");
    });

    it("Should have royalties and allow to set them", async function () {
      const { void2122Unit, deployer, player1 } = await loadFixture(
        deployVoid2122Unit
      );

      let royaltyInfo = await void2122Unit.connect(deployer).royaltyInfo(100);
      expect(royaltyInfo[0]).to.equal(deployer.address);
      expect(royaltyInfo[1]).to.equal(10);

      await void2122Unit.connect(deployer).setRoyalties(player1.address, 15);

      royaltyInfo = await void2122Unit.connect(deployer).royaltyInfo(100);
      expect(royaltyInfo[0]).to.equal(player1.address);
      expect(royaltyInfo[1]).to.equal(15);
    });
  });

  describe("Unit tests", async function () {
    const { void2122Unit, deployer } = await loadFixture(void2122Unit);

    it("Should create a unit", async function () {
      expect(
        await void2122Unit.connect(deployer).createUnit(defaultUnit)
      ).to.emit(void2122Unit, "UnitCreated");
    });
  });
});
