const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const ADDRESS_ZERO = "0x1111111100000000000000000000000000000000";
const { ethers, upgrades } = require("hardhat");

describe("Void2122Corporation", function () {
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

    // const TestERC721 = await ethers.getContractFactory("PaperHands");
    // testERC721 = await upgrades.deployProxy(TestERC721, [signer.address]);
    // await testERC721.deployed();

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

  describe("Initialization", function () {
    it("Should have a name", async function () {
      const { void2122Corporation } = await loadFixture(
        deployVoid2122Corporation
      );
      expect(await void2122Corporation.name()).to.equal(
        "Void 2122 - Corporations"
      );
    });
  });

  describe("Unit tests", async function () {
    const { void2122Corporation, deployer } = await loadFixture(
      deployVoid2122Corporation
    );

    it("Should create a corporation", async function () {
      expect(
        await void2122Corporation
          .connect(deployer)
          .createCorporation(defaultCorporation)
      ).to.emit(void2122Corporation, "CorporationCreated");
    });

    it("Should add a member to a corporation", async function () {
      expect(
        await void2122Corporation
          .connect(deployer)
          .addOrRemoveMember(1, player1.address)
      ).to.emit(void2122Corporation, `MemberAdded("${player1}")`);
    });

    it("Should remove a member to a corporation", async function () {
      expect(
        await void2122Corporation
          .connect(deployer)
          .addOrRemoveMember(1, player1.address)
      ).to.emit(void2122Corporation, `MemberRemoved("${player1}")`);
    });

    it("Should disband a corporation", async function () {
      expect(
        await void2122Corporation
          .connect(deployer)
          .disbandCorporation(defaultCorporation)
      ).to.emit(void2122Corporation, "CorporationDisbanded");
    });
  });
});
