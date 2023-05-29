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

  async function deployVoid2122Factory() {
    // Contracts are deployed using the first signer/account by default
    const [deployer, player1, player2] = await ethers.getSigners();

    const Void2122Factory = await ethers.getContractFactory("Void2122Factory");

    const void2122Factory = await upgrades.deployProxy(
      Void2122Factory,
      deployer
    );

    await void2122Factory.deployed();

    return {
      void2122Factory,
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

    it("Should have royalties and allow to set them", async function () {
      const { void2122Factory, deployer, player1 } = await loadFixture(
        deployVoid2122Factory
      );

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

  describe("Unit tests", async function () {
    const { void2122Factory, deployer } = await loadFixture(
      deployVoid2122Factory
    );

    it("Should create a factory", async function () {
      expect(
        await void2122Factory.connect(deployer).createFactory(defaultFactory)
      ).to.emit(void2122Factory, "FactoryCreated");
    });
  });
});
