const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Void2122Schematic", function () {
  const defaultSchematics = {
    id: 1,
    tokenId: 0,
    name: "test schematics",
    description: "schematics description",
    uri: "schematics uri",
    constructionTime: 10,
    inputs: [1, 2],
    inputAmounts: [1, 1],
    output: 0,
    outputIsUnit: false,
  };

  async function deployVoid2122Schematic() {
    // Contracts are deployed using the first signer/account by default
    const [deployer, player1, player2] = await ethers.getSigners();

    const Void2122Schematic = await ethers.getContractFactory(
      "Void2122Schematic"
    );

    const void2122Schematic = await upgrades.deployProxy(
      Void2122Schematic,
      deployer
    );

    await void2122Schematic.deployed();

    return {
      void2122Schematic,
      deployer,
      player1,
      player2,
    };
  }

  describe("Initialization", function () {
    it("Should have a name", async function () {
      const { void2122Schematic } = await loadFixture(deployVoid2122Schematic);
      expect(await void2122Schematic.name()).to.equal("Void 2122 - Schematics");
    });
  });

  describe("Royalties tests", async function () {
    it("Should have royalties and allow to set them", async function () {
      const { void2122Schematic, deployer, player1 } = await loadFixture(
        deployVoid2122Schematic
      );

      let royaltyInfo = await void2122Schematic
        .connect(deployer)
        .royaltyInfo(100);
      expect(royaltyInfo[0]).to.equal(deployer.address);
      expect(royaltyInfo[1]).to.equal(10);

      await void2122Schematic
        .connect(deployer)
        .setRoyalties(player1.address, 15);

      royaltyInfo = await void2122Schematic.connect(deployer).royaltyInfo(100);
      expect(royaltyInfo[0]).to.equal(player1.address);
      expect(royaltyInfo[1]).to.equal(15);
    });
  });

  describe("Unit tests", async function () {
    const { void2122Schematic, deployer } = await loadFixture(
      deployVoid2122Schematic
    );

    it("Should create a schematic", async function () {
      expect(
        await void2122Schematic
          .connect(deployer)
          .createSchematics(defaultSchematics)
      ).to.emit(void2122Schematic, "SchematicCreated");
    });
  });
});
