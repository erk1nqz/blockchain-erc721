// Import the necessary libraries
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CryptoCoffee Contract", function () {
  let CryptoCoffee, cryptoCoffee, owner, addr1, addr2;

  beforeEach(async function () {
    // Deploy the contract before each test
    CryptoCoffee = await ethers.getContractFactory("CryptoCoffee");
    [owner, addr1, addr2] = await ethers.getSigners();
    cryptoCoffee = await CryptoCoffee.deploy(owner.address);
    await cryptoCoffee.waitForDeployment();
  });

  describe("Minting", function () {
    it("Should mint a new CryptoCat by the owner", async function () {
      await cryptoCoffee.mint(addr1.address, 1, "ipfs://example");
      expect(await cryptoCoffee.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should fail to mint a new CryptoCat by a non-owner", async function () {
      await expect(cryptoCoffee.connect(addr1).mint(addr2.address, 2, "ipfs://example2"))
      .to.be.revertedWithCustomError(cryptoCoffee, "OwnableUnauthorizedAccount");
    });
  });

  describe("Transferring", function () {
    beforeEach(async function () {
      await cryptoCoffee.mint(addr1.address, 1, "ipfs://example");
    });

    it("Should safely transfer a CryptoCat from one address to another by the owner", async function () {
      await cryptoCoffee.connect(addr1)["safeTransferFrom(address,address,uint256)"]
      (addr1.address, addr2.address, 1, ethers.randomBytes(0));
      expect(await cryptoCoffee.ownerOf(1)).to.equal(addr2.address);
    });

    it("Should fail to transfer a CryptoCat by a non-owner", async function () {
      await expect(cryptoCoffee["safeTransferFrom(address,address,uint256)"]
      (addr1.address, addr2.address, 1, ethers.randomBytes(0))).to.be.revertedWith("Caller is not owner nor approved");
    });

    it("Should prevent transferring a CryptoCat to the zero address", async function () {
      await cryptoCoffee.mint(addr1.address, 3, "ipfs://example");
      await expect(cryptoCoffee.connect(addr1)["safeTransferFrom(address,address,uint256)"]
      (addr1.address, "0x0000000000000000000000000000000000000000", 3, ethers.randomBytes(0)))
      .to.be.revertedWithCustomError(cryptoCoffee, "ERC721InvalidReceiver");
    });
    
    
  });

  describe("Approvals", function () {
    beforeEach(async function () {
      await cryptoCoffee.mint(addr1.address, 1, "ipfs://example");
    });

    it("Should set an approval for a CryptoCat", async function () {
      await cryptoCoffee.connect(addr1).approve(addr2.address, 1);
      expect(await cryptoCoffee.getApproved(1)).to.equal(addr2.address);
    });

    it("Should set an operator for all tokens of an owner", async function () {
      await cryptoCoffee.connect(addr1).setApprovalForAll(addr2.address, true);
      expect(await cryptoCoffee.isApprovedForAll(addr1.address, addr2.address)).to.be.true;
    });
  });

  describe("Token URI", function () {
    it("Should return the correct token URI for a minted CryptoCat", async function () {
      const uri = "ipfs://example";
      await cryptoCoffee.mint(addr1.address, 1, uri);
      expect(await cryptoCoffee.tokenURI(1)).to.equal(uri);
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      await cryptoCoffee.mint(addr1.address, 1, "ipfs://example");
    });

    it("Should burn a CryptoCat and ensure it no longer exists", async function () {
      await cryptoCoffee.connect(addr1).approve(owner.address, 1);
      await cryptoCoffee.burn(1);
      await expect(cryptoCoffee.ownerOf(1)).to.be.revertedWithCustomError(cryptoCoffee, "ERC721NonexistentToken");
    });
  });
});