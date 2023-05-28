const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
// const {
//   defaultCorporation,
//   defaultFactory,
//   defaultLoot,
//   defaultMod,
//   defaultUnit,
// } = require("./helpers.js");

describe("Void2122", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  const defaultCorporation = {
    id: 1,
    tokenId: 0,
    name: "test corporation",
    owner: ADDRESS_ZERO,
    description: "corporation description",
    uri: "corporation uri",
  };

  const defaultFactory = {
    id: 1,
    tokenId: 0,
    name: "test factory",
    description: "factory description",
    uri: "factory uri",
  };

  const defaultLoot = {
    id: 1,
    tokenId: 0,
    name: "test loot",
    description: "loot description",
    uri: "loot uri",
    isBroken: true,
  };

  const defaultMod = {
    id: 1,
    tokenId: 0,
    name: "test mod",
    description: "mod description",
    uri: "mod uri",
  };

  const defaultSchematics = {
    id: 1,
    tokenId: 0,
    name: "test schematics",
    description: "schematics description",
    uri: "schematics uri",
  };

  const defaultUnit = {
    id: 1,
    tokenId: 0,
    name: "test unit",
    level: 1,
    generation: 1,
    corporation: "test corporation",
    model: "test model",
    description: "test description",
    uris: ["uri1", "uri2"],
    values: [1, 1, 1, 1],
    rarity: "Rare",
    modSlots: 2,
    mods: [],
  };

  async function deployVoid2122() {
    // Contracts are deployed using the first signer/account by default
    const [deployer, player1, player2] = await ethers.getSigners();

    const Void2122 = await ethers.getContractFactory("Void2122");
    const void2122 = await Void2122.deploy();

    return { void2122, deployer, player1, player2 };
  }

  describe("Initialization", function () {
    it("Should have a name", async function () {
      const { void2122 } = await loadFixture(deployVoid2122);
      expect(await void2122.name()).to.equal("Void 2122");
    });
  });

  describe("Creations", function () {
    it("Should create a corporation", async function () {
      const { void2122 } = await loadFixture(deployVoid2122);
      expect(await void2122.createCorporation(defaultCorporation)).to.emit(
        void2122,
        "CorporationCreated"
      );
    });

    it("Should create a factory", async function () {
      const { void2122 } = await loadFixture(deployVoid2122);
      expect(await void2122.createFactory(defaultFactory)).to.emit(
        void2122,
        "FactoryCreated"
      );
    });

    it("Should create a loot", async function () {
      const { void2122 } = await loadFixture(deployVoid2122);
      expect(await void2122.createLoot(defaultLoot)).to.emit(
        void2122,
        "LootCreated"
      );
    });

    it("Should create a mod", async function () {
      const { void2122 } = await loadFixture(deployVoid2122);
      expect(await void2122.createMod(defaultMod)).to.emit(
        void2122,
        "ModCreated"
      );
    });

    it("Should create a schematics", async function () {
      const { void2122 } = await loadFixture(deployVoid2122);
      expect(await void2122.createMod(defaultSchematics)).to.emit(
        void2122,
        "SchematicsCreated"
      );
    });

    it("Should create a unit", async function () {
      const { void2122 } = await loadFixture(deployVoid2122);
      expect(await void2122.createUnit(defaultUnit)).to.emit(
        void2122,
        "UnitCreated"
      );
    });
    //   it("Should set the right owner", async function () {
    //     const { lock, owner } = await loadFixture(deployOneYearLockFixture);
    //     expect(await lock.owner()).to.equal(owner.address);
    //   });
    //   it("Should receive and store the funds to lock", async function () {
    //     const { lock, lockedAmount } = await loadFixture(
    //       deployOneYearLockFixture
    //     );
    //     expect(await ethers.provider.getBalance(lock.address)).to.equal(
    //       lockedAmount
    //     );
    //   });
    //   it("Should fail if the unlockTime is not in the future", async function () {
    //     // We don't use the fixture here because we want a different deployment
    //     const latestTime = await time.latest();
    //     const Lock = await ethers.getContractFactory("Lock");
    //     await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
    //       "Unlock time should be in the future"
    //     );
    //   });
    // });
    // describe("Withdrawals", function () {
    //   describe("Validations", function () {
    //     it("Should revert with the right error if called too soon", async function () {
    //       const { lock } = await loadFixture(deployOneYearLockFixture);
    //       await expect(lock.withdraw()).to.be.revertedWith(
    //         "You can't withdraw yet"
    //       );
    //     });
    //     it("Should revert with the right error if called from another account", async function () {
    //       const { lock, unlockTime, otherAccount } = await loadFixture(
    //         deployOneYearLockFixture
    //       );
    //       // We can increase the time in Hardhat Network
    //       await time.increaseTo(unlockTime);
    //       // We use lock.connect() to send a transaction from another account
    //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
    //         "You aren't the owner"
    //       );
    //     });
    //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
    //       const { lock, unlockTime } = await loadFixture(
    //         deployOneYearLockFixture
    //       );
    //       // Transactions are sent using the first signer by default
    //       await time.increaseTo(unlockTime);
    //       await expect(lock.withdraw()).not.to.be.reverted;
    //     });
    //   });
    //   describe("Events", function () {
    //     it("Should emit an event on withdrawals", async function () {
    //       const { lock, unlockTime, lockedAmount } = await loadFixture(
    //         deployOneYearLockFixture
    //       );
    //       await time.increaseTo(unlockTime);
    //       await expect(lock.withdraw())
    //         .to.emit(lock, "Withdrawal")
    //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
    //     });
    // });
    // describe("Transfers", function () {
    //   it("Should transfer the funds to the owner", async function () {
    //     const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
    //       deployOneYearLockFixture
    //     );
    //     await time.increaseTo(unlockTime);
    //     await expect(lock.withdraw()).to.changeEtherBalances(
    //       [owner, lock],
    //       [lockedAmount, -lockedAmount]
    //     );
    //   });
    // });
  });
});
