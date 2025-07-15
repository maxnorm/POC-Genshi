const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("DocumentExtension", function () {
  let documentsNFT;
  let owner;
  let user1;
  let user2;
  let tokenId;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const DocumentsNFT = await ethers.getContractFactory("SampleDocumentsNFT");
    documentsNFT = await DocumentsNFT.deploy();
    await documentsNFT.waitForDeployment();

    const mintTx = await documentsNFT.mint();
    const receipt = await mintTx.wait();
    tokenId = receipt.logs[0].args[2];
  });
  
  describe("Setting Documents", function () {
    const docId = 1;
    const name = "test name";
    const description = "test description";
    const uri = "https://test.com";
    const hash = "0x1234567890";
    const mimeType = "application/pdf";

    it("should allow setting a document for a token", async function () {
      await expect(documentsNFT.setDocument(tokenId, name, description, uri, hash, mimeType))
        .to.emit(documentsNFT, "DocumentSet")
        .withArgs(tokenId, docId, name, uri);
    });

    it("should increment document counter correctly", async function () {
      const tx = await documentsNFT.setDocument(tokenId, name, description, uri, hash, mimeType);
      const receipt = await tx.wait();
      const blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;

      const document = await documentsNFT.getDocument(tokenId, docId);
      expect(document.id).to.equal(docId);
    });

    it("should store document with correct initial values", async function () {
      const tx = await documentsNFT.setDocument(tokenId, name, description, uri, hash, mimeType);
      const receipt = await tx.wait();
      const blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;

      const document = await documentsNFT.getDocument(tokenId, docId);

      expect(document.name).to.equal(name);
      expect(document.description).to.equal(description);
      expect(document.uri).to.equal(uri);
      expect(document.hash).to.equal(hash);
      expect(document.mimeType).to.equal(mimeType);
      expect(document.lastValidator).to.equal(ethers.ZeroAddress);
      expect(document.lastValidatedAt).to.equal(0);
      expect(document.createdBy).to.equal(owner.address);
      expect(document.createdAt).to.equal(blockTimestamp);
    });

    it("should create initial history entry correctly", async function () {
      const tx = await documentsNFT.setDocument(tokenId, name, description, uri, hash, mimeType);
      const receipt = await tx.wait();
      const blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;

      const document = await documentsNFT.getDocument(tokenId, docId);
      const historyLength = document.history.length;
      const idx = historyLength - 1;
      expect(historyLength).to.equal(1);
      expect(document.history[idx].id).to.equal(0);
      expect(document.history[idx].oldUri).to.equal("");
      expect(document.history[idx].newUri).to.equal(uri);
      expect(document.history[idx].newHash).to.equal(hash);
      expect(document.history[idx].newMimeType).to.equal(mimeType);
      expect(document.history[idx].validatedBy).to.equal(ethers.ZeroAddress);
      expect(document.history[idx].validatedAt).to.equal(0);
    });
    
    it("should revert when setting document with empty name", async function () {
      await expect(documentsNFT.setDocument(tokenId, "", description, uri, hash, mimeType))
        .to.be.revertedWithCustomError(documentsNFT, "Documents_InputsCannotBeEmpty");
    });
    it("should revert when setting document with empty description", async function () {
      await expect(documentsNFT.setDocument(tokenId, name, "", uri, hash, mimeType))
        .to.be.revertedWithCustomError(documentsNFT, "Documents_InputsCannotBeEmpty");
    });
    it("should revert when setting document with empty uri", async function () {
      await expect(documentsNFT.setDocument(tokenId, name, description, "", hash, mimeType))
        .to.be.revertedWithCustomError(documentsNFT, "Documents_InputsCannotBeEmpty");
    });
    it("should revert when setting document with empty hash", async function () {
      await expect(documentsNFT.setDocument(tokenId, name, description, uri, "", mimeType))
        .to.be.revertedWithCustomError(documentsNFT, "Documents_InputsCannotBeEmpty");
    });
    it("should revert when setting document with empty mimeType", async function () {
      await expect(documentsNFT.setDocument(tokenId, name, description, uri, hash, ""))
        .to.be.revertedWithCustomError(documentsNFT, "Documents_InputsCannotBeEmpty");
    });
  });

  describe("Getting Documents", function () {
    const docId = 1;
    const name = "test name";
    const description = "test description";
    const uri = "https://test.com";
    const hash = "0x1234567890";
    const mimeType = "application/pdf";
    let blockTimestamp;


    beforeEach(async function () {
      const tx = await documentsNFT.setDocument(tokenId, name, description, uri, hash, mimeType);
      const receipt = await tx.wait();
      blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;
    });

    it("should return correct document data for existing document", async function () {
      const document = await documentsNFT.getDocument(tokenId, docId);
      expect(document.name).to.equal(name);
      expect(document.description).to.equal(description);
      expect(document.uri).to.equal(uri);
      expect(document.hash).to.equal(hash);
      expect(document.mimeType).to.equal(mimeType);
      expect(document.lastValidator).to.equal(ethers.ZeroAddress);
      expect(document.lastValidatedAt).to.equal(0);
      expect(document.createdBy).to.equal(owner.address);
      expect(document.createdAt).to.equal(blockTimestamp);
    });
    it("should revert when getting non-existent document (InvalidDocument)", async function () {
      const invalidDocId = 100;
      await expect(documentsNFT.getDocument(tokenId, invalidDocId))
        .to.be.revertedWithCustomError(documentsNFT, "InvalidDocument")
        .withArgs(tokenId, invalidDocId);
    });
  });

  describe("Updating Documents", function () {
    const docId = 1;
    const name = "test name";
    const description = "test description";
    const uri = "https://test.com";
    const hash = "0x1234567890";
    const mimeType = "application/pdf";
    let blockTimestamp;

    const newName = "new name";
    const newDescription = "new description";
    const newUri = "https://new.com";
    const newHash = "0x1234567891";
    const newMimeType = "application/pdf";
    let newBlockTimestamp;

    beforeEach(async function () {
      const tx = await documentsNFT.setDocument(tokenId, name, description, uri, hash, mimeType);
      const receipt = await tx.wait();
      blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;
    });

    it("should update an existing document", async function () {
      const historyLength = (await documentsNFT.getDocument(tokenId, docId)).history.length;
      const expectedHistoryLength = historyLength + 1;
      await expect(documentsNFT.updateDocument(
        tokenId,
        docId,
        newName,
        newDescription,
        newUri,
        newHash,
        newMimeType
      ))
        .to.emit(documentsNFT, "DocumentUpdated")
        .withArgs(tokenId, docId, newName, newUri, expectedHistoryLength);
    });

    it("should store update with correct values", async function () {
      const tx = await documentsNFT.updateDocument(tokenId, docId, newName, newDescription, newUri, newHash, newMimeType);
      const receipt = await tx.wait();
      newBlockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;

      const document = await documentsNFT.getDocument(tokenId, docId);
      const historyLength = document.history.length;
      const idx = historyLength - 1;
      expect(document.history[idx].id).to.equal(1);
      expect(document.history[idx].oldUri).to.equal(uri);
      expect(document.history[idx].newUri).to.equal(newUri);
      expect(document.history[idx].newHash).to.equal(newHash);
      expect(document.history[idx].newMimeType).to.equal(newMimeType);
      expect(document.history[idx].validatedBy).to.equal(ethers.ZeroAddress);
      expect(document.history[idx].validatedAt).to.equal(0);
      expect(document.history[idx].updatedBy).to.equal(owner.address);
      expect(document.history[idx].updatedAt).to.equal(newBlockTimestamp);
    });

    it("should reset validation status after update", async function () {
      const tx = await documentsNFT.updateDocument(tokenId, docId, newName, newDescription, newUri, newHash, newMimeType);
      const receipt = await tx.wait();
      newBlockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;

      const document = await documentsNFT.getDocument(tokenId, docId);
      expect(document.lastValidator).to.equal(ethers.ZeroAddress);
      expect(document.lastValidatedAt).to.equal(0);
    });
    
    it("should revert when updating non-existent document", async function () {
      const invalidDocId = 100;
      await expect(documentsNFT.updateDocument(tokenId, invalidDocId, newName, newDescription, newUri, newHash, newMimeType))
        .to.be.revertedWithCustomError(documentsNFT, "InvalidDocument")
        .withArgs(tokenId, invalidDocId);
    });
    
    it("should revert when updating with empty name", async function () {
      await expect(documentsNFT.updateDocument(tokenId, docId, "", newDescription, newUri, newHash, newMimeType))
        .to.be.revertedWithCustomError(documentsNFT, "Documents_InputsCannotBeEmpty");
    });
    it("should revert when updating with empty description", async function () {
      await expect(documentsNFT.updateDocument(tokenId, docId, newName, "", newUri, newHash, newMimeType))
        .to.be.revertedWithCustomError(documentsNFT, "Documents_InputsCannotBeEmpty");
    });
    it("should revert when updating with empty uri", async function () {
      await expect(documentsNFT.updateDocument(tokenId, docId, newName, newDescription, "", newHash, newMimeType))
        .to.be.revertedWithCustomError(documentsNFT, "Documents_InputsCannotBeEmpty");
    });
    it("should revert when updating with empty hash", async function () {
      await expect(documentsNFT.updateDocument(tokenId, docId, newName, newDescription, newUri, "", newMimeType))
        .to.be.revertedWithCustomError(documentsNFT, "Documents_InputsCannotBeEmpty");
    });
    it("should revert when updating with empty mimeType", async function () {
      await expect(documentsNFT.updateDocument(tokenId, docId, newName, newDescription, newUri, hash, ""))
        .to.be.revertedWithCustomError(documentsNFT, "Documents_InputsCannotBeEmpty");
    });
  });

  describe("Validating Documents", function () {
    const docId = 1;
    const name = "test name";
    const description = "test description";
    const uri = "https://test.com";
    const hash = "0x1234567890";
    const mimeType = "application/pdf";
    let blockTimestamp;

    beforeEach(async function () {
      const tx = await documentsNFT.setDocument(tokenId, name, description, uri, hash, mimeType);
      const receipt = await tx.wait();
      blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;
    });

    it("should validate a document successfully", async function () {
      expect(await documentsNFT.validateDocument(tokenId, docId))
        .to.emit(documentsNFT, "DocumentValidated")
        .withArgs(tokenId, docId, owner.address, blockTimestamp);
    });
    it("should set lastValidator and lastValidatedAt correctly", async function () {
      const tx = await documentsNFT.validateDocument(tokenId, docId);
      const receipt = await tx.wait();
      newBlockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;

      const document = await documentsNFT.getDocument(tokenId, docId);
      expect(document.lastValidator).to.equal(owner.address);
      expect(document.lastValidatedAt).to.equal(newBlockTimestamp);
    });
    it("should update history entry with validation details", async function () {
      const tx = await documentsNFT.validateDocument(tokenId, docId);
      const receipt = await tx.wait();
      newBlockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;

      const document = await documentsNFT.getDocument(tokenId, docId);
      const historyLength = document.history.length;
      const idx = historyLength - 1;
      expect(document.history[idx].validatedBy).to.equal(owner.address);
      expect(document.history[idx].validatedAt).to.equal(newBlockTimestamp);
    });
    
    it("should revert when validating non-existent document", async function () {
      const invalidDocId = 100;
      await expect(documentsNFT.validateDocument(tokenId, invalidDocId))
        .to.be.revertedWithCustomError(documentsNFT, "InvalidDocument")
        .withArgs(tokenId, invalidDocId);
    });
    it("should revert when validating already validated document", async function () {
      await documentsNFT.validateDocument(tokenId, docId);
      await expect(documentsNFT.validateDocument(tokenId, docId))
        .to.be.revertedWithCustomError(documentsNFT, "Document_AlreadyValidated")
        .withArgs(tokenId, docId);
    });
  });

  describe("History Management", function () {
    const docId = 1;
    const name = "test name";
    const description = "test description";
    const uri = "https://test.com";
    const hash = "0x1234567890";
    const mimeType = "application/pdf";
    let blockTimestamp;

    const newName = "new name";
    const newDescription = "new description";
    const newUri = "https://new.com";
    const newHash = "0x1234567891";
    const newMimeType = "application/pdf";
    let newBlockTimestamp;

    const newName2 = "new name 2";
    const newDescription2 = "new description 2";
    const newUri2 = "https://new2.com";
    const newHash2 = "0x1234567892";
    const newMimeType2 = "application/pdf";
    let newBlockTimestamp2;

    beforeEach(async function () {
      const tx = await documentsNFT.setDocument(tokenId, name, description, uri, hash, mimeType);
      const receipt = await tx.wait();
      blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;
    });

    it("should maintain correct history order across multiple updates", async function () {
      const tx = await documentsNFT.updateDocument(tokenId, docId, newName, newDescription, newUri, newHash, newMimeType);
      const receipt = await tx.wait();
      newBlockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;

      const tx2 = await documentsNFT.updateDocument(tokenId, docId, newName2, newDescription2, newUri2, newHash2, newMimeType2);
      const receipt2 = await tx2.wait();
      newBlockTimestamp2 = (await ethers.provider.getBlock(receipt2.blockNumber)).timestamp;

      const document = await documentsNFT.getDocument(tokenId, docId);

      expect(document.history[0].id).to.equal(0);
      expect(document.history[0].newUri).to.equal(uri);
      expect(document.history[0].newHash).to.equal(hash);

      expect(document.history[1].id).to.equal(1);
      expect(document.history[1].newUri).to.equal(newUri);
      expect(document.history[1].newHash).to.equal(newHash);

      expect(document.history[2].id).to.equal(2);
      expect(document.history[2].newUri).to.equal(newUri2);
      expect(document.history[2].newHash).to.equal(newHash2);
    });

    it("should track different updaters in history", async function () {
      await documentsNFT.connect(user1).updateDocument(tokenId, docId, newName, newDescription, newUri, newHash, newMimeType);
      await documentsNFT.connect(user2).updateDocument(tokenId, docId, newName2, newDescription2, newUri2, newHash2, newMimeType2);

      const document = await documentsNFT.getDocument(tokenId, docId);
      expect(document.history[0].updatedBy).to.equal(owner.address);
      expect(document.history[1].updatedBy).to.equal(user1.address);
      expect(document.history[2].updatedBy).to.equal(user2.address);
    });

    it("should track validation status for each version", async function () {
      await documentsNFT.updateDocument(tokenId, docId, newName, newDescription, newUri, newHash, newMimeType);
      await documentsNFT.connect(user1).validateDocument(tokenId, docId);
      await documentsNFT.updateDocument(tokenId, docId, newName2, newDescription2, newUri2, newHash2, newMimeType2);

      const document = await documentsNFT.getDocument(tokenId, docId);
      expect(document.history[0].validatedBy).to.equal(ethers.ZeroAddress);
      expect(document.history[1].validatedBy).to.equal(user1.address);
      expect(document.history[2].validatedBy).to.equal(ethers.ZeroAddress);
    });

    it("should store old and new URIs correctly", async function () {
      await documentsNFT.updateDocument(tokenId, docId, newName, newDescription, newUri, newHash, newMimeType);
      await documentsNFT.updateDocument(tokenId, docId, newName2, newDescription2, newUri2, newHash2, newMimeType2);

      const document = await documentsNFT.getDocument(tokenId, docId);
      expect(document.history[0].oldUri).to.equal("");
      expect(document.history[0].newUri).to.equal(uri);
      expect(document.history[1].oldUri).to.equal(uri);
      expect(document.history[1].newUri).to.equal(newUri);
      expect(document.history[2].oldUri).to.equal(newUri);
      expect(document.history[2].newUri).to.equal(newUri2);
    });
  });
});

