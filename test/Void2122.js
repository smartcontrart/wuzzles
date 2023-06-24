const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

describe("Void2122", function () {
  const defaultCorporation = {
    id: 1,
    owner: ADDRESS_ZERO,
    name: "test corporation",
    description: "corporation description",
    image: "corporation image",
    animation: "corporation animation",
    active: false,
  };

  const defaultFactory = {
    id: 1,
    name: "test factory",
    description: "factory description",
    animation: "factory animation",
    uri: "factory uri",
  };

  const defaultLoot = {
    id: 1,
    name: "test loot",
    description: "loot description",
    animation: "loot animation",
    uri: "loot uri",
    isBroken: true,
  };

  const defaultMod = {
    id: 1,
    name: "test mod",
    description: "mod description",
    animation: "mod animation",
    uri: "mod uri",
  };

  const defaultSchematic = {
    id: 1,
    name: "test schematic",
    description: "schematic description",
    animation: "schematic animation",
    uri: "schematics uri",
    constructionTime: 1,
    inputs: [1, 2],
    inputAmounts: [1, 1],
    output: 1,
    outputIsUnit: false,
  };

  const defaultUnit = {
    id: 1,
    name: "test unit",
    level: 1,
    generation: 1,
    corporation: 1,
    model: "test model",
    description: "unit description",
    animation: "unit animation",
    uris: ["uri1", "uri2"],
    values: [1, 1, 1, 1],
    rarity: "Rare",
    modSlots: 2,
    mods: [],
  };

  async function deployVoid2122Environment() {
    // Contracts are deployed using the first signer/account by default
    const [deployer, player1, player2] = await ethers.getSigners();

    const Void2122Corporation = await ethers.getContractFactory(
      "Void2122Corporation"
    );

    const void2122Corporation = await upgrades.deployProxy(
      Void2122Corporation,
      deployer
    );

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

    await void2122Corporation.deployed();
    await void2122Factory.deployed();
    await void2122Loot.deployed();
    await void2122Mod.deployed();
    await void2122Schematic.deployed();
    await void2122Unit.deployed();

    return {
      void2122Corporation,
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

  async function deployVoid2122EnvironmentWithContractsConfigured() {
    // Contracts are deployed using the first signer/account by default
    const [deployer, player1, player2] = await ethers.getSigners();

    const Void2122Corporation = await ethers.getContractFactory(
      "Void2122Corporation"
    );

    const void2122Corporation = await upgrades.deployProxy(
      Void2122Corporation,
      deployer
    );

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

    await void2122Corporation.deployed();
    await void2122Factory.deployed();
    await void2122Loot.deployed();
    await void2122Mod.deployed();
    await void2122Schematic.deployed();
    await void2122Unit.deployed();

    await void2122Factory.setLootAddress(void2122Loot.address);
    await void2122Factory.setModAddress(void2122Mod.address);
    await void2122Factory.setSchematicAddress(void2122Schematic.address);
    await void2122Factory.setUnitAddress(void2122Unit.address);

    await void2122Mod.toggleAdmin(void2122Factory.address);
    await void2122Unit.toggleAdmin(void2122Factory.address);
    await void2122Unit.setModAddress(void2122Mod.address);

    return {
      void2122Corporation,
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
    it("Should have names", async function () {
      const {
        void2122Corporation,
        void2122Factory,
        void2122Loot,
        void2122Mod,
        void2122Schematic,
        void2122Unit,
        deployer,
        player1,
        player2,
      } = await loadFixture(deployVoid2122Environment);
      expect(await void2122Corporation.name()).to.equal(
        "Void 2122 - Corporations"
      );
      expect(await void2122Factory.name()).to.equal("Void 2122 - Factories");
      expect(await void2122Loot.name()).to.equal("Void 2122 - Loots");
      expect(await void2122Mod.name()).to.equal("Void 2122 - Mods");
      expect(await void2122Schematic.name()).to.equal("Void 2122 - Schematics");
      expect(await void2122Unit.name()).to.equal("Void 2122 - Units");
    });
  });

  describe("Royalties tests", async function () {
    it("Should have royalties and allow to set them", async function () {
      const {
        void2122Corporation,
        void2122Factory,
        void2122Loot,
        void2122Mod,
        void2122Schematic,
        void2122Unit,
        deployer,
        player1,
        player2,
      } = await loadFixture(deployVoid2122Environment);

      let royaltyInfoCorporation = await void2122Corporation
        .connect(deployer)
        .royaltyInfo(100);
      expect(royaltyInfoCorporation[0]).to.equal(deployer.address);
      expect(royaltyInfoCorporation[1]).to.equal(10);

      await void2122Corporation
        .connect(deployer)
        .setRoyalties(player1.address, 15);

      royaltyInfoCorporation = await void2122Corporation
        .connect(deployer)
        .royaltyInfo(100);
      expect(royaltyInfoCorporation[0]).to.equal(player1.address);
      expect(royaltyInfoCorporation[1]).to.equal(15);

      let royaltyInfoFactory = await void2122Factory
        .connect(deployer)
        .royaltyInfo(100);
      expect(royaltyInfoFactory[0]).to.equal(deployer.address);
      expect(royaltyInfoFactory[1]).to.equal(10);

      await void2122Factory.connect(deployer).setRoyalties(player1.address, 15);

      royaltyInfoFactory = await void2122Factory
        .connect(deployer)
        .royaltyInfo(100);
      expect(royaltyInfoFactory[0]).to.equal(player1.address);
      expect(royaltyInfoFactory[1]).to.equal(15);

      let royaltyInfoLoot = await void2122Loot
        .connect(deployer)
        .royaltyInfo(100);
      expect(royaltyInfoLoot[0]).to.equal(deployer.address);
      expect(royaltyInfoLoot[1]).to.equal(10);

      await void2122Loot.connect(deployer).setRoyalties(player1.address, 15);

      royaltyInfoLoot = await void2122Loot.connect(deployer).royaltyInfo(100);
      expect(royaltyInfoLoot[0]).to.equal(player1.address);
      expect(royaltyInfoLoot[1]).to.equal(15);

      let royaltyInfoMod = await void2122Mod.connect(deployer).royaltyInfo(100);
      expect(royaltyInfoMod[0]).to.equal(deployer.address);
      expect(royaltyInfoMod[1]).to.equal(10);

      await void2122Mod.connect(deployer).setRoyalties(player1.address, 15);

      royaltyInfoMod = await void2122Mod.connect(deployer).royaltyInfo(100);
      expect(royaltyInfoMod[0]).to.equal(player1.address);
      expect(royaltyInfoMod[1]).to.equal(15);

      let royaltyInfoSchematic = await void2122Schematic
        .connect(deployer)
        .royaltyInfo(100);
      expect(royaltyInfoSchematic[0]).to.equal(deployer.address);
      expect(royaltyInfoSchematic[1]).to.equal(10);

      await void2122Schematic
        .connect(deployer)
        .setRoyalties(player1.address, 15);

      royaltyInfoSchematic = await void2122Schematic
        .connect(deployer)
        .royaltyInfo(100);
      expect(royaltyInfoSchematic[0]).to.equal(player1.address);
      expect(royaltyInfoSchematic[1]).to.equal(15);

      let royaltyInfoUnit = await void2122Unit
        .connect(deployer)
        .royaltyInfo(100);
      expect(royaltyInfoUnit[0]).to.equal(deployer.address);
      expect(royaltyInfoUnit[1]).to.equal(10);

      await void2122Unit.connect(deployer).setRoyalties(player1.address, 15);

      royaltyInfoUnit = await void2122Unit.connect(deployer).royaltyInfo(100);
      expect(royaltyInfoUnit[0]).to.equal(player1.address);
      expect(royaltyInfoUnit[1]).to.equal(15);
    });
  });

  describe("Corporation tests", function () {
    it("Should create a corporation, add and remove members and disband a coropration", async function () {
      const {
        void2122Corporation,
        void2122Factory,
        void2122Loot,
        void2122Mod,
        void2122Schematic,
        void2122Unit,
        deployer,
        player1,
        player2,
      } = await loadFixture(deployVoid2122Environment);

      await expect(
        void2122Corporation
          .connect(deployer)
          .createCorporation(defaultCorporation)
      ).to.emit(void2122Corporation, "CorporationCreated");

      await expect(
        void2122Corporation
          .connect(deployer)
          .addOrRemoveMember(1, player1.address)
      )
        .to.emit(void2122Corporation, `MemberAdded`)
        .withArgs(player1.address);

      await expect(
        void2122Corporation
          .connect(deployer)
          .addOrRemoveMember(1, player1.address)
      )
        .to.emit(void2122Corporation, `MemberRemoved`)
        .withArgs(player1.address);

      await expect(
        void2122Corporation
          .connect(deployer)
          .disbandCorporation(defaultCorporation)
      ).to.emit(void2122Corporation, "CorporationDisbanded");
    });
  });

  describe("Factory tests", function () {
    it("create a factory", async function () {
      const {
        void2122Corporation,
        void2122Factory,
        void2122Loot,
        void2122Mod,
        void2122Schematic,
        void2122Unit,
        deployer,
        player1,
        player2,
      } = await loadFixture(deployVoid2122Environment);

      await expect(
        void2122Factory.connect(deployer).createFactory(defaultFactory)
      ).to.emit(void2122Factory, "FactoryCreated");
    });

    it("Should set contract addresses", async function () {
      const {
        void2122Corporation,
        void2122Factory,
        void2122Loot,
        void2122Mod,
        void2122Schematic,
        void2122Unit,
        deployer,
        player1,
        player2,
      } = await loadFixture(deployVoid2122Environment);
      await void2122Factory.setLootAddress(void2122Loot.address);
      expect(await void2122Factory.lootAddress()).to.equal(
        void2122Loot.address
      );

      await void2122Factory.setModAddress(void2122Mod.address);
      expect(await void2122Factory.modAddress()).to.equal(void2122Mod.address);

      await void2122Factory.setSchematicAddress(void2122Schematic.address);
      expect(await void2122Factory.schematicAddress()).to.equal(
        void2122Schematic.address
      );

      await void2122Factory.setUnitAddress(void2122Unit.address);
      expect(await void2122Factory.unitAddress()).to.equal(
        void2122Unit.address
      );
    });

    it("Should create a factory able to craft a reward and claim it", async function () {
      const {
        void2122Corporation,
        void2122Factory,
        void2122Loot,
        void2122Mod,
        void2122Schematic,
        void2122Unit,
        deployer,
        player1,
        player2,
      } = await loadFixture(deployVoid2122EnvironmentWithContractsConfigured);

      await expect(
        void2122Factory.connect(deployer).createFactory(defaultFactory)
      ).to.emit(void2122Factory, "FactoryCreated");

      await expect(
        void2122Schematic.connect(deployer).createSchematic(defaultSchematic)
      ).to.emit(void2122Schematic, "SchematicCreated");

      await void2122Factory.connect(deployer).mint(player1.address, 1);
      await void2122Schematic.connect(deployer).mint(player1.address, 1, 1);
      await void2122Loot.connect(deployer).mint(player1.address, 1, 1);
      await void2122Loot.connect(deployer).mint(player1.address, 2, 1);

      await expect(void2122Factory.connect(player1).craft(1, 1)).to.emit(
        void2122Factory,
        "CraftInitiated"
      );

      await expect(void2122Factory.connect(player1).claimCraft(1)).to.emit(
        void2122Factory,
        "CraftClaimed"
      );
    });
  });

  describe("Loot tests", function () {
    it("Should create a loot", async function () {
      const {
        void2122Corporation,
        void2122Factory,
        void2122Loot,
        void2122Mod,
        void2122Schematic,
        void2122Unit,
        deployer,
        player1,
        player2,
      } = await loadFixture(deployVoid2122Environment);

      await expect(
        void2122Loot.connect(deployer).createLoot(defaultLoot)
      ).to.emit(void2122Loot, "LootCreated");
    });
  });

  describe("Mod tests", function () {
    it("Should create a mod", async function () {
      const {
        void2122Corporation,
        void2122Factory,
        void2122Loot,
        void2122Mod,
        void2122Schematic,
        void2122Unit,
        deployer,
        player1,
        player2,
      } = await loadFixture(deployVoid2122Environment);

      await expect(void2122Mod.connect(deployer).createMod(defaultMod)).to.emit(
        void2122Mod,
        "ModCreated"
      );
    });
  });

  describe("Schematic tests", function () {
    it("Should create a schematic", async function () {
      const {
        void2122Corporation,
        void2122Factory,
        void2122Loot,
        void2122Mod,
        void2122Schematic,
        void2122Unit,
        deployer,
        player1,
        player2,
      } = await loadFixture(deployVoid2122Environment);

      await expect(
        void2122Schematic.connect(deployer).createSchematic(defaultSchematic)
      ).to.emit(void2122Schematic, "SchematicCreated");
    });
  });

  describe("Unit tests", function () {
    it("Should create a unit", async function () {
      const {
        void2122Corporation,
        void2122Factory,
        void2122Loot,
        void2122Mod,
        void2122Schematic,
        void2122Unit,
        deployer,
        player1,
        player2,
      } = await loadFixture(deployVoid2122EnvironmentWithContractsConfigured);

      await expect(
        void2122Unit.connect(deployer).createUnit(defaultUnit)
      ).to.emit(void2122Unit, "UnitCreated");

      // Can't add mod without one
      await expect(
        void2122Unit.connect(player1).addMod(1, 1)
      ).to.be.revertedWithCustomError(void2122Unit, "ModBalanceInsufficient");

      await void2122Mod.connect(deployer).createMod(defaultMod);
      await void2122Mod.connect(deployer).mint(player1.address, 1, 1);

      await void2122Unit.connect(deployer).createUnit(defaultUnit);
      await void2122Unit.connect(deployer).mint(player1.address, 1);

      // Can add mod with one
      await expect(void2122Unit.connect(player1).addMod(1, 1))
        .to.emit(void2122Unit, "ModAdded")
        .withArgs(1, 1);

      // Can't add twice the same mod
      await expect(
        void2122Unit.connect(player1).addMod(1, 1)
      ).to.be.revertedWithCustomError(void2122Unit, "ModBalanceInsufficient");

      await void2122Mod.connect(deployer).mint(player1.address, 1, 1);

      // Can add two times a mod if you have enough
      await expect(void2122Unit.connect(player1).addMod(1, 1))
        .to.emit(void2122Unit, "ModAdded")
        .withArgs(1, 1);

      await void2122Mod.connect(deployer).mint(player1.address, 1, 1);

      //Can't add more mods than available slots
      await expect(
        void2122Unit.connect(player1).addMod(1, 1)
      ).to.be.revertedWithCustomError(void2122Unit, "NoModSpaceAvailable");

      // Can replace a mod
      await expect(void2122Unit.connect(player1).replaceMod(1, 1, 0))
        .to.emit(void2122Unit, "ModAdded")
        .withArgs(1, 1);

      // Can't replace a mod outside of bounds
      await expect(void2122Unit.connect(player1).replaceMod(1, 1, 2))
        .to.be.revertedWithCustomError(void2122Unit, "ModPositionInvalid")
        .withArgs(2);
    });
  });
});
