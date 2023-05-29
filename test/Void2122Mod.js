const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Void2122Mod", function () {
  const defaultMod = {
    id: 1,
    tokenId: 0,
    name: "test mod",
    description: "mod description",
    uri: "mod uri",
  };

  async function deployVoid2122Mod() {
    // Contracts are deployed using the first signer/account by default
    const [deployer, player1, player2] = await ethers.getSigners();

    const Void2122Mod = await ethers.getContractFactory("Void2122Mod");

    const void2122Mod = await upgrades.deployProxy(Void2122Mod, deployer);

    await void2122Mod.deployed();

    return {
      void2122Mod,
      deployer,
      player1,
      player2,
    };
  }

  describe("Initialization", function () {
    it("Should have a name", async function () {
      const { void2122Mod } = await loadFixture(deployVoid2122Mod);
      expect(await void2122Mod.name()).to.equal("Void 2122 - Mods");
    });

    it("Should have royalties and allow to set them", async function () {
      const { void2122Mod, deployer, player1 } = await loadFixture(
        deployVoid2122Mod
      );

      let royaltyInfo = await void2122Mod.connect(deployer).royaltyInfo(100);
      expect(royaltyInfo[0]).to.equal(deployer.address);
      expect(royaltyInfo[1]).to.equal(10);

      await void2122Mod.connect(deployer).setRoyalties(player1.address, 15);

      royaltyInfo = await void2122Mod.connect(deployer).royaltyInfo(100);
      expect(royaltyInfo[0]).to.equal(player1.address);
      expect(royaltyInfo[1]).to.equal(15);
    });
  });

  describe("Unit tests", async function () {
    const { void2122Mod, deployer } = await loadFixture(deployVoid2122Mod);

    it("Should create a mod", async function () {
      expect(await void2122Mod.connect(deployer).createMod(defaultMod)).to.emit(
        void2122Mod,
        "ModCreated"
      );
    });
  });
});
