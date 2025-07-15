import { ethers } from "hardhat";
import { expect } from "chai";

describe("AttributesExtension", function () {
  let owner: any;
  let user1: any;
  let user2: any;

  let attributesNFT: any;
  let tokenId: any;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const AttributesNFT = await ethers.getContractFactory("SampleAttributesNFT");
    attributesNFT = await AttributesNFT.deploy();
    await attributesNFT.waitForDeployment();

    const mintTx = await attributesNFT.mint();
    const receipt = await mintTx.wait();
    tokenId = receipt.logs[0].args[2];
  });

  describe("Setting Attributes", function () {
    it("should allow setting an attribute for a token", async function () {
      await expect(attributesNFT.setAttribute(tokenId, "test", "test"))
        .to.emit(attributesNFT, "AttributeSet")
        .withArgs(tokenId, "test", "test", owner.address);
    });

    it("should store attribute with correct initial values (createdBy, timestamps, etc)", async function () {
      await attributesNFT.setAttribute(tokenId, "test", "test");
      const attribute = await attributesNFT.getAttribute(tokenId, "test");
      expect(attribute.value).to.equal("test");
      expect(attribute.createdBy).to.equal(owner.address);
      expect(attribute.lastValidator).to.equal(ethers.ZeroAddress);
      expect(attribute.history.length).to.equal(1);
    });

    it("should create initial history entry correctly", async function () {
      const tx=await attributesNFT.setAttribute(tokenId, "test", "test");
      const receipt = await tx.wait();
      const attribute = await attributesNFT.getAttribute(tokenId, "test");
      const blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber))!.timestamp;

      expect(attribute.history.length).to.equal(1);
      expect(attribute.history[0].id).to.equal(0);
      expect(attribute.history[0].oldValue).to.equal("");
      expect(attribute.history[0].newValue).to.equal("test");
      expect(attribute.history[0].updatedBy).to.equal(owner.address);
      expect(attribute.history[0].updatedAt).to.equal(blockTimestamp);
      expect(attribute.history[0].validatedBy).to.equal(ethers.ZeroAddress);
      expect(attribute.history[0].validatedAt).to.equal(0);
    });

    it("should revert when setting attribute with empty key", async function () {
      await expect(attributesNFT.setAttribute(tokenId, "", "test"))
        .to.be.revertedWithCustomError(attributesNFT, "Attributes_InputsCannotBeEmpty");
    });

    it("should revert when setting attribute with empty value", async function () {
      await expect(attributesNFT.setAttribute(tokenId, "test", ""))
        .to.be.revertedWithCustomError(attributesNFT, "Attributes_InputsCannotBeEmpty");
    });

    it("should revert when setting the same key twice (Attributes_KeyAlreadySet)", async function () {
      await attributesNFT.setAttribute(tokenId, "test", "test");
      await expect(attributesNFT.setAttribute(tokenId, "test", "test"))
        .to.be.revertedWithCustomError(attributesNFT, "Attributes_KeyAlreadySet")
        .withArgs(tokenId, "test");
    });
  });

  describe("Getting Attributes", function () {
    let tx: any;
    let receipt: any;

    beforeEach(async function () {
      tx = await attributesNFT.setAttribute(tokenId, "test", "test");
      receipt = await tx.wait();
    });

    it("should return correct attribute data for existing attribute", async function () {
      const attribute = await attributesNFT.getAttribute(tokenId, "test");
      const blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber))!.timestamp;

      expect(attribute.value).to.equal("test");
      expect(attribute.createdBy).to.equal(owner.address);
      expect(attribute.lastValidator).to.equal(ethers.ZeroAddress);
      expect(attribute.lastValidatedAt).to.equal(0);
      expect(attribute.history.length).to.equal(1);
      expect(attribute.history[0].id).to.equal(0);
      expect(attribute.history[0].oldValue).to.equal("");
      expect(attribute.history[0].newValue).to.equal("test");
      expect(attribute.history[0].updatedBy).to.equal(owner.address);
      expect(attribute.history[0].updatedAt).to.equal(blockTimestamp);
      expect(attribute.history[0].validatedBy).to.equal(ethers.ZeroAddress);
      expect(attribute.history[0].validatedAt).to.equal(0);
    });

    it("should revert when getting non-existent attribute (Attributes_InvalidKey)", async function () {
      const invalidKey = "invalid";
      await expect(attributesNFT.getAttribute(tokenId, invalidKey))
        .to.be.revertedWithCustomError(attributesNFT, "Attributes_InvalidKey")
        .withArgs(tokenId, invalidKey);
    });

    it("should return correct history array for attribute", async function () {
      const blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber))!.timestamp;

      const attribute = await attributesNFT.getAttribute(tokenId, "test");
      const historyLength = attribute.history.length;
      const idx = historyLength - 1;

      expect(historyLength).to.equal(1);
      expect(attribute.history[idx].id).to.equal(0);
      expect(attribute.history[idx].oldValue).to.equal("");
      expect(attribute.history[idx].newValue).to.equal("test");
      expect(attribute.history[idx].updatedBy).to.equal(owner.address);
      expect(attribute.history[idx].updatedAt).to.equal(blockTimestamp);
      expect(attribute.history[idx].validatedBy).to.equal(ethers.ZeroAddress);
      expect(attribute.history[idx].validatedAt).to.equal(0);
    });
  });

  describe("Updating Attributes", function () {
    const key = "test";
    const value = "test";

    const newValue = "test2";

    beforeEach(async function () {
      await attributesNFT.setAttribute(tokenId, key, value);
    });

    it("should update an existing attribute value", async function () {
      await expect(attributesNFT.updateAttribute(tokenId, key, newValue))
        .to.emit(attributesNFT, "AttributeUpdated")
        .withArgs(tokenId, key, value, newValue, owner.address);

      const attribute = await attributesNFT.getAttribute(tokenId, key);
      expect(attribute.value).to.equal(newValue);
    });
    it("should store update history correctly", async function () {
      const tx = await attributesNFT.updateAttribute(tokenId, key, newValue);
      const receipt = await tx.wait();
      const attribute = await attributesNFT.getAttribute(tokenId, key);
      const blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber))!.timestamp;

      expect(attribute.history.length).to.equal(2);
      expect(attribute.history[1].id).to.equal(1);
      expect(attribute.history[1].oldValue).to.equal(value);
      expect(attribute.history[1].newValue).to.equal(newValue);
      expect(attribute.history[1].updatedBy).to.equal(owner.address);
      expect(attribute.history[1].updatedAt).to.equal(blockTimestamp);
      expect(attribute.history[1].validatedBy).to.equal(ethers.ZeroAddress);
      expect(attribute.history[1].validatedAt).to.equal(0);
    });
    it("should reset lastValidator on update", async function () {
      const tx1 = await attributesNFT.validateAttribute(tokenId, key);
      const receipt1 = await tx1.wait();
      const validatedAt = (await ethers.provider.getBlock(receipt1.blockNumber))!.timestamp;

      await attributesNFT.updateAttribute(tokenId, key, newValue);

      const attribute = await attributesNFT.getAttribute(tokenId, key);
      expect(attribute.lastValidator).to.equal(ethers.ZeroAddress);
      expect(attribute.lastValidatedAt).to.equal(validatedAt);
    });
    it("should maintain correct update timestamps", async function () {
      const tx = await attributesNFT.updateAttribute(tokenId, key, newValue);
      const receipt = await tx.wait();
      const blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber))!.timestamp;

      const attribute = await attributesNFT.getAttribute(tokenId, key);
      expect(attribute.history[1].updatedAt).to.equal(blockTimestamp);
    });
    it("should revert when updating with empty key", async function () {
      await expect(attributesNFT.updateAttribute(tokenId, "", newValue))
        .to.be.revertedWithCustomError(attributesNFT, "Attributes_InputsCannotBeEmpty");
    });
    it("should revert when updating with empty value", async function () {
      await expect(attributesNFT.updateAttribute(tokenId, key, ""))
        .to.be.revertedWithCustomError(attributesNFT, "Attributes_InputsCannotBeEmpty");
    });
    it("should revert when updating non-existent attribute (Attributes_InvalidKey)", async function () {
      const invalidKey = "invalid";
      await expect(attributesNFT.updateAttribute(tokenId, invalidKey, newValue))
        .to.be.revertedWithCustomError(attributesNFT, "Attributes_InvalidKey")
        .withArgs(tokenId, invalidKey);
    });
  });

  describe("Validating Attributes", function () {
    const key = "test";
    const value = "test";

    beforeEach(async function () {
      await attributesNFT.setAttribute(tokenId, key, value);
    });

    it("should validate an attribute successfully", async function () {
      await expect(attributesNFT.validateAttribute(tokenId, key))
        .to.emit(attributesNFT, "AttributeValidated")
        .withArgs(tokenId, key, owner.address, 0);
    });
    it("should set lastValidator and lastValidatedAt correctly", async function () {
      const tx = await attributesNFT.validateAttribute(tokenId, key);
      const receipt = await tx.wait();
      const blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber))!.timestamp;

      const attribute = await attributesNFT.getAttribute(tokenId, key);
      expect(attribute.lastValidator).to.equal(owner.address);
      expect(attribute.lastValidatedAt).to.equal(blockTimestamp);
    });
    it("should update history entry with validation details", async function () {
      const tx = await attributesNFT.validateAttribute(tokenId, key);
      const receipt = await tx.wait();
      const blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber))!.timestamp;

      const attribute = await attributesNFT.getAttribute(tokenId, key);
      expect(attribute.history[0].validatedBy).to.equal(owner.address);
      expect(attribute.history[0].validatedAt).to.equal(blockTimestamp);
    });
    it("should revert when validating non-existent attribute (Attributes_InvalidKey)", async function () {
      const invalidKey = "invalid";
      await expect(attributesNFT.validateAttribute(tokenId, invalidKey))
        .to.be.revertedWithCustomError(attributesNFT, "Attributes_InvalidKey")
        .withArgs(tokenId, invalidKey);
    });
    it("should revert when validating already validated attribute (Attributes_AlreadyValidated)", async function () {
      await attributesNFT.validateAttribute(tokenId, key);
      await expect(attributesNFT.validateAttribute(tokenId, key))
        .to.be.revertedWithCustomError(attributesNFT, "Attributes_AlreadyValidated")
        .withArgs(tokenId, key);
    });
  });

  describe("History Management", function () {
    const key = "test";
    const value = "initial";

    beforeEach(async function () {
      await attributesNFT.setAttribute(tokenId, key, value);
    });

    it("should maintain correct history order across multiple updates", async function () {
      await attributesNFT.updateAttribute(tokenId, key, "update1");
      await attributesNFT.updateAttribute(tokenId, key, "update2");

      const tx = await attributesNFT.validateAttribute(tokenId, key);
      const receipt = await tx.wait();
      const blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber))!.timestamp;

      await attributesNFT.updateAttribute(tokenId, key, "update3");

      const attribute = await attributesNFT.getAttribute(tokenId, "test");

      expect(attribute.history.length).to.equal(4);
      expect(attribute.history[0].id).to.equal(0);
      expect(attribute.history[0].newValue).to.equal("initial");

      expect(attribute.history[1].id).to.equal(1);
      expect(attribute.history[1].newValue).to.equal("update1");

      expect(attribute.history[2].id).to.equal(2);
      expect(attribute.history[2].newValue).to.equal("update2");
      expect(attribute.history[2].validatedBy).to.equal(owner.address);
      expect(attribute.history[2].validatedAt).to.equal(blockTimestamp);

      expect(attribute.history[3].id).to.equal(3);
      expect(attribute.history[3].newValue).to.equal("update3");
    });

    it("should track different updaters in history", async function () {
      await attributesNFT.connect(user1).updateAttribute(tokenId, key, "update1");
      await attributesNFT.connect(user2).updateAttribute(tokenId, key, "update2");

      const attribute = await attributesNFT.getAttribute(tokenId, "test");

      expect(attribute.history[0].updatedBy).to.equal(owner.address);
      expect(attribute.history[1].updatedBy).to.equal(user1.address);
      expect(attribute.history[2].updatedBy).to.equal(user2.address);
    });
  });
}); 