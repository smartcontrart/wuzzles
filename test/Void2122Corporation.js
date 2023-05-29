const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const ADDRESS_ZERO = "0x1111111100000000000000000000000000000000";
const { ethers, upgrades } = require("hardhat");

describe("Void2122Corporation", async function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  const defaultCorporation = {
    id: 1,
    owner: ADDRESS_ZERO,
    name: "test corporation",
    description: "corporation description",
    image: "corporation image",
    animation: "corporation animation",
    active: false,
  };

  async function deployVoid2122Corporation() {
    // Contracts are deployed using the first signer/account by default
    const [deployer, player1, player2] = await ethers.getSigners();

    const Void2122Corporation = await ethers.getContractFactory(
      "Void2122Corporation"
    );

    const void2122Corporation = await upgrades.deployProxy(
      Void2122Corporation,
      deployer
    );

    await void2122Corporation.deployed();

    return {
      void2122Corporation,
      deployer,
      player1,
      player2,
    };
  }

  describe("Corporations work as expected", async function () {
    it("Should have a name", async function () {
      const { void2122Corporation } = await loadFixture(
        deployVoid2122Corporation
      );
      expect(await void2122Corporation.name()).to.equal(
        "Void 2122 - Corporations"
      );
    });

    it("Should have royalties and allow to set them", async function () {
      const { void2122Corporation, deployer, player1 } = await loadFixture(
        deployVoid2122Corporation
      );

      let royaltyInfo = await void2122Corporation
        .connect(deployer)
        .royaltyInfo(100);
      expect(royaltyInfo[0]).to.equal(deployer.address);
      expect(royaltyInfo[1]).to.equal(10);

      await void2122Corporation
        .connect(deployer)
        .setRoyalties(player1.address, 15);

      royaltyInfo = await void2122Corporation
        .connect(deployer)
        .royaltyInfo(100);
      expect(royaltyInfo[0]).to.equal(player1.address);
      expect(royaltyInfo[1]).to.equal(15);
    });

    it("Should create a corporation, add and remove members and disband a coropration", async function () {
      const { void2122Corporation, deployer, player1 } = await loadFixture(
        deployVoid2122Corporation
      );
      expect(
        await void2122Corporation
          .connect(deployer)
          .createCorporation(defaultCorporation)
      ).to.emit(void2122Corporation, "CorporationCreated");

      expect(
        await void2122Corporation
          .connect(deployer)
          .addOrRemoveMember(1, player1.address)
      )
        .to.emit(void2122Corporation, `MemberAdded`)
        .withArgs(player1);

      expect(
        await void2122Corporation
          .connect(deployer)
          .addOrRemoveMember(1, player1.address)
      )
        .to.emit(void2122Corporation, `MemberRemoved`)
        .withArgs(player1);

      expect(
        await void2122Corporation
          .connect(deployer)
          .disbandCorporation(defaultCorporation)
      ).to.emit(void2122Corporation, "CorporationDisbanded");
    });
  });
});
