const {
  time,
  mine,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers, upgrades, waffle } = require("hardhat");
const hre = require("hardhat");

const MINT_PRICE = "0.009";

describe("Wuzzles", function () {
  async function deployWuzzles() {
    const [deployer, collector, anyone] = await ethers.getSigners();

    const Wuzzles = await hre.ethers.getContractFactory("Wuzzles");
    const wuzzles = await Wuzzles.deploy("unrevealedURI");
    await wuzzles.deployed();

    return {
      wuzzles,
      deployer,
      collector,
      anyone,
    };
  }

  describe("Wuzzles Unit", function () {
    it("Should have a name", async function () {
      const { wuzzles } = await loadFixture(deployWuzzles);
      expect(await wuzzles.name()).to.equal("Wuzzles");
    });

    it("Should have a symbol", async function () {
      const { wuzzles } = await loadFixture(deployWuzzles);
      expect(await wuzzles.symbol()).to.equal("WZL");
    });

    it("Should allow to toggle an admin", async function () {
      const { wuzzles, deployer, collector } = await loadFixture(deployWuzzles);
      await wuzzles.toggleAdmin(collector.address);
      expect(await wuzzles._isAdmin(collector.address)).to.equal(true);
    });

    it("Should be able to mint", async function () {
      const { wuzzles, collector } = await loadFixture(deployWuzzles);
      await wuzzles.mint(collector.address);
      expect(await wuzzles.balanceOf(collector.address)).to.equal(1);
    });

    it("Should prevent to mint more than the max supply", async function () {
      const { wuzzles, collector } = await loadFixture(deployWuzzles);
      for (let i = 0; i < 900; i++) {
        await wuzzles.mint(collector.address);
      }
      await expect(wuzzles.mint(collector.address)).to.be.revertedWith(
        "Max supply reached"
      );
    });

    it("Should prevent anyone from minting", async function () {
      const { wuzzles, collector, anyone } = await loadFixture(deployWuzzles);
      await expect(
        wuzzles.connect(anyone).mint(collector.address)
      ).to.be.revertedWith("Only admins can perfom this action");
    });

    it("Should have a URI", async function () {
      const { wuzzles, collector } = await loadFixture(deployWuzzles);
      await wuzzles.mint(collector.address);
      expect(await wuzzles.tokenURI(1)).to.equal(
        'data:application/json;utf8,{"name":"Wuzzle #1", "description":"a brand for everyone. no limits. no restrictions. available in all shapes, sizes, and colors. (cc0)", "image":"unrevealedURI"}'
      );
    });

    it("Should allow an admin to reveal", async function () {
      const { wuzzles, collector } = await loadFixture(deployWuzzles);
      await wuzzles.mint(collector.address);
      await wuzzles.reveal("RevealedURI/");
      expect(await wuzzles.tokenURI(1)).to.equal(
        'data:application/json;utf8,{"name":"Wuzzle #1", "description":"a brand for everyone. no limits. no restrictions. available in all shapes, sizes, and colors. (cc0)", "image":"RevealedURI/1.svg"}'
      );
    });

    it("Should prevent anyone from revealing", async function () {
      const { wuzzles, collector, anyone } = await loadFixture(deployWuzzles);
      await wuzzles.mint(collector.address);
      await expect(
        wuzzles.connect(anyone).reveal("RevealedURI/")
      ).to.be.revertedWith("Only admins can perfom this action");
    });

    it("Should allow an admin to set a new URI", async function () {
      const { wuzzles, collector } = await loadFixture(deployWuzzles);
      await wuzzles.mint(collector.address);
      await wuzzles.reveal("RevealedURI/");
      await wuzzles.setURI("newURI/");
      expect(await wuzzles.tokenURI(1)).to.equal(
        'data:application/json;utf8,{"name":"Wuzzle #1", "description":"a brand for everyone. no limits. no restrictions. available in all shapes, sizes, and colors. (cc0)", "image":"newURI/1.svg"}'
      );
    });
  });
});

describe("WuzzlesMint Unit", function () {
  async function deployWuzzlesMint() {
    // Contracts are deployed using the first signer/account by default
    const [deployer, collector, anyone] = await ethers.getSigners();

    const Wuzzles = await hre.ethers.getContractFactory("Wuzzles");
    const wuzzles = await Wuzzles.deploy("unrevealedURI");
    await wuzzles.deployed();

    const WuzzlesMint = await hre.ethers.getContractFactory("WuzzlesMint");
    const wuzzlesMint = await WuzzlesMint.deploy(wuzzles.address);
    await wuzzlesMint.deployed();

    const signatures = {};
    const approvedList = [collector.address, anyone.address];
    for (i = 0; i < approvedList.length; i++) {
      const message = ethers.utils.solidityKeccak256(
        ["address", "address", "bool"],
        [approvedList[i], wuzzles.address, false]
      );
      let signedMessage = await deployer.signMessage(
        ethers.utils.arrayify(message)
      );
      const { v, r, s } = ethers.utils.splitSignature(signedMessage);
      signatures[approvedList[i]] = {
        v: v,
        r: r,
        s: s,
      };
    }

    return {
      wuzzles,
      wuzzlesMint,
      deployer,
      collector,
      anyone,
      signatures,
    };
  }

  describe("MuzzlesMint Unit", function () {
    it("Should have the wuzzles address", async function () {
      const { wuzzles, wuzzlesMint, collector } = await loadFixture(
        deployWuzzlesMint
      );
      expect(await wuzzlesMint._wuzzlesAddress()).to.equal(wuzzles.address);
    });

    it("Should prevent anyone to set the recipient", async function () {
      const { wuzzles, wuzzlesMint, collector, anyone } = await loadFixture(
        deployWuzzlesMint
      );
      await expect(wuzzlesMint.connect(anyone).setRecipient(collector.address))
        .to.be.reverted;
    });

    it("Should allow to mint on the private sale", async function () {
      const { wuzzles, wuzzlesMint, collector, signatures } = await loadFixture(
        deployWuzzlesMint
      );
      const signature = signatures[collector.address];
      await wuzzles.toggleAdmin(wuzzlesMint.address);
      await wuzzlesMint.togglePrivateMintStatus();
      await wuzzlesMint
        .connect(collector)
        .privateMint(signature.v, signature.r, signature.s, {
          value: ethers.utils.parseEther(MINT_PRICE),
        });
      expect(await wuzzles.balanceOf(collector.address)).to.equal(1);
    });

    it("Should prevent to private mint when closed", async function () {
      const { wuzzles, wuzzlesMint, collector, signatures } = await loadFixture(
        deployWuzzlesMint
      );
      const signature = signatures[collector.address];
      await wuzzles.toggleAdmin(wuzzlesMint.address);
      await expect(
        wuzzlesMint
          .connect(collector)
          .privateMint(signature.v, signature.r, signature.s, {
            value: ethers.utils.parseEther(MINT_PRICE),
          })
      ).to.be.revertedWith("Private Mint closed");
    });

    it("Should prevent to public mint when closed", async function () {
      const { wuzzles, wuzzlesMint, collector } = await loadFixture(
        deployWuzzlesMint
      );
      await wuzzles.toggleAdmin(wuzzlesMint.address);
      await expect(
        wuzzlesMint.connect(collector).publicMint({
          value: ethers.utils.parseEther(MINT_PRICE),
        })
      ).to.be.revertedWith("Public Mint closed");
    });

    it("Should prevent to mint when not enough funds are sent ", async function () {
      const { wuzzles, wuzzlesMint, collector, signatures } = await loadFixture(
        deployWuzzlesMint
      );
      const signature = signatures[collector.address];
      await wuzzles.toggleAdmin(wuzzlesMint.address);
      await wuzzlesMint.togglePrivateMintStatus();
      await expect(
        wuzzlesMint
          .connect(collector)
          .privateMint(signature.v, signature.r, signature.s, {
            value: ethers.utils.parseEther("0"),
          })
      ).to.be.revertedWith("Not enough funds");
    });

    it("Should allow to mint on the public sale", async function () {
      const { wuzzles, wuzzlesMint, collector, signatures } = await loadFixture(
        deployWuzzlesMint
      );
      const signature = signatures[collector.address];
      await wuzzles.toggleAdmin(wuzzlesMint.address);
      await wuzzlesMint.togglePublicMintStatus();
      await wuzzlesMint.connect(collector).publicMint({
        value: ethers.utils.parseEther(MINT_PRICE),
      });
      expect(await wuzzles.balanceOf(collector.address)).to.equal(1);
    });

    it("Should prevent to mint more than one NFT per wallet", async function () {
      const { wuzzles, wuzzlesMint, collector, signatures } = await loadFixture(
        deployWuzzlesMint
      );
      const signature = signatures[collector.address];
      await wuzzles.toggleAdmin(wuzzlesMint.address);
      await wuzzlesMint.togglePublicMintStatus();
      await wuzzlesMint.connect(collector).publicMint({
        value: ethers.utils.parseEther(MINT_PRICE),
      });
      await expect(
        wuzzlesMint.connect(collector).publicMint({
          value: ethers.utils.parseEther(MINT_PRICE),
        })
      ).to.be.revertedWith("Only one NFT per wallet");
    });
  });
});
