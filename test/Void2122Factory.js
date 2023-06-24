const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Void2122Factory", function () {
  const defaultFactory = {
    id: 1,
    tokenId: 0,
    name: "test factory",
    description: "factory description",
    uri: "factory uri",
  };

  const defaultSchematics = {
    id: 1,
    name: "test schematics",
    description: "schematics description",
    uri: "schematics uri",
    constructionTime: 10,
    inputs: [1, 2],
    inputAmounts: [1, 1],
    output: 0,
    outputIsUnit: false,
  };

  async function deployVoid2122Factory() {
    // Contracts are deployed using the first signer/account by default
    const [deployer, player1, player2] = await ethers.getSigners();

    const Void2122Factory = await ethers.getContractFactory("Void2122Factory");

    const void2122Factory = await upgrades.deployProxy(
      Void2122Factory,
      deployer
    );

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

    await void2122Factory.deployed();

    return {
      void2122Factory,
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
      const { void2122Factory } = await loadFixture(deployVoid2122Factory);
      expect(await void2122Factory.name()).to.equal("Void 2122 - Factories");
    });
  });

  describe("Royalties tests", async function () {
    it("Should have royalties and allow to set them", async function () {
      const {
        void2122Factory,
        void2122Loot,
        void2122Mod,
        void2122Schematic,
        void2122Unit,
        deployer,
        player1,
      } = await loadFixture(deployVoid2122Factory);

      let royaltyInfo = await void2122Factory
        .connect(deployer)
        .royaltyInfo(100);
      expect(royaltyInfo[0]).to.equal(deployer.address);
      expect(royaltyInfo[1]).to.equal(10);

      await void2122Factory.connect(deployer).setRoyalties(player1.address, 15);

      royaltyInfo = await void2122Factory.connect(deployer).royaltyInfo(100);
      expect(royaltyInfo[0]).to.equal(player1.address);
      expect(royaltyInfo[1]).to.equal(15);
    });
  });

  describe("Administrative tasks", function () {
    it("Should set the loot address", async function () {
      const {
        void2122Factory,
        void2122Loot,
        void2122Mod,
        void2122Schematic,
        void2122Unit,
      } = await loadFixture(deployVoid2122Factory);
      await void2122Factory.setLootAddress(void2122Loot.address);
    });

    it("Should set the mod address", async function () {
      const {
        void2122Factory,
        void2122Loot,
        void2122Mod,
        void2122Schematic,
        void2122Unit,
      } = await loadFixture(deployVoid2122Factory);
      await void2122Factory.setModAddress(void2122Mod.address);
    });

    it("Should set the schematic address", async function () {
      const {
        void2122Factory,
        void2122Loot,
        void2122Mod,
        void2122Schematic,
        void2122Unit,
      } = await loadFixture(deployVoid2122Factory);
      await void2122Factory.setSchematicAddress(void2122Schematic.address);
    });

    it("Should set the unit address", async function () {
      const {
        void2122Factory,
        void2122Loot,
        void2122Mod,
        void2122Schematic,
        void2122Unit,
      } = await loadFixture(deployVoid2122Factory);
      await void2122Factory.setUnitAddress(void2122Unit.address);
    });
  });

  describe("Unit tests", async function () {
    it("Should create a factory", async function () {
      const {
        void2122Factory,
        void2122Loot,
        void2122Mod,
        void2122Schematic,
        void2122Unit,
        deployer,
      } = await loadFixture(deployVoid2122Factory);
      expect(
        await void2122Factory.connect(deployer).createFactory(defaultFactory)
      ).to.emit(void2122Factory, "FactoryCreated");
    });

    it("should craft", async function () {
      const {
        void2122Factory,
        void2122Loot,
        void2122Mod,
        void2122Schematic,
        void2122Unit,
        deployer,
      } = await loadFixture(deployVoid2122Factory);

      await void2122Factory.connect(deployer).createFactory(defaultFactory);

      expect(
        await void2122Schematic
          .connect(deployer)
          .createSchematics(defaultSchematics)
      ).to.emit(void2122Schematic, "SchematicCreated");

      // expect(await void2122Factory.connect(deployer).craft(1, 1)).to.emit(
      //   void2122Factory,
      //   "CraftInitiated"
      // );
    });
  });
});
