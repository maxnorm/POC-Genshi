import { ethers } from "hardhat";
import { expect } from "chai";

describe("PieceNFT", function () {
  let accessManager: any;
  let templateRegistry: any;
  let pieceNFT: any;
  let admin: any;
  let minter: any;
  let manager: any;
  let documentManager: any;
  let auditor: any;
  let user: any;

  let templateId: number;
  let templateName: string;
  let attributeKey1: string;
  let attribute1: any;
  let attributeKey2: string;
  let attribute2: any;
  let attributeKey3: string;
  let attribute3: any;
  let attributeKey4: string;
  let attribute4: any;

  let documentKey: string;
  let documentDefinition: any;

  async function createTemplate() {
    templateName = "Test Template";
    await templateRegistry.connect(admin).createTemplate(pieceNFT.target, templateName);
    templateId = 1;

    attributeKey1 = "material";
    attribute1 = {
      name: "Material",
      attributeType: "enum",
      allowedValues: ["steel", "aluminum", "copper"],
      units: "N/A",
      required: true
    };  

    attributeKey2 = "serialNumber";
    attribute2 = {
      name: "Serial Number",
      attributeType: "number",
      allowedValues: [],
      units: "N/A",
      required: true
    };

    attributeKey3 = "weight";
    attribute3 = {
      name: "Weight",
      attributeType: "number",
      allowedValues: [],
      units: "kg",
      required: true
    };

    attributeKey4 = "isProduced";
    attribute4 = {
      name: "Is Produced",
      attributeType: "boolean",
      allowedValues: [],
      units: "N/A",
      required: true
    };

    await templateRegistry.connect(admin).addAttribute(templateId, attributeKey1, attribute1);
    await templateRegistry.connect(admin).addAttribute(templateId, attributeKey2, attribute2);
    await templateRegistry.connect(admin).addAttribute(templateId, attributeKey3, attribute3);
    await templateRegistry.connect(admin).addAttribute(templateId, attributeKey4, attribute4);

    documentKey = "pressureTestCertificate";
    documentDefinition = {
      name: "Pressure Test Certificate",
      allowedMimeTypes: ["application/pdf"],
      required: true
    };

    await templateRegistry.connect(admin).addDocument(templateId, documentKey, documentDefinition);
    await templateRegistry.connect(admin).activateTemplate(templateId);
  }

  beforeEach(async function () {
    [admin, minter, manager, documentManager, auditor, user] = await ethers.getSigners();

    const AccessManager = await ethers.getContractFactory("AccessManager");
    accessManager = await AccessManager.deploy();
    await accessManager.waitForDeployment();

    const TemplateRegistry = await ethers.getContractFactory("TemplateRegistry");
    templateRegistry = await TemplateRegistry.deploy(accessManager.target);
    await templateRegistry.waitForDeployment();

    const PieceNFT = await ethers.getContractFactory("PieceNFT");
    pieceNFT = await PieceNFT.deploy(
        await templateRegistry.getAddress(),
        await accessManager.getAddress()
    );
    await pieceNFT.waitForDeployment();

    await accessManager.grantRole(await accessManager.PIECE_MANAGER(), manager.address);
    await accessManager.connect(manager).grantRole(await accessManager.PIECE_MINTER(), minter.address);
    await accessManager.connect(manager).grantRole(await accessManager.PIECE_DOCUMENT_MANAGER(), documentManager.address);
    await accessManager.connect(manager).grantRole(await accessManager.PIECE_AUDITOR(), auditor.address);

    await createTemplate();
  });

  describe("Deployment", function () {
    it("should deploy with correct name 'PieceNFT'", async function () {
      expect(await pieceNFT.name()).to.equal("PieceNFT");
    });
    it("should deploy with correct symbol 'PIECE'", async function () {
      expect(await pieceNFT.symbol()).to.equal("PIECE");
    });
  });

  describe("Minting", function () {
    it("should allow PIECE_MINTER to mint with valid template", async function () {
      const expectedTokenId = 1;
      expect(await pieceNFT.connect(minter).mint(user.address, templateId))
        .to.emit(pieceNFT, "MintedPiece")
        .withArgs(user.address, expectedTokenId);
    });

    it("should increment token counter correctly", async function () {
      let expectedTokenId = 1;
      expect(await pieceNFT.connect(minter).mint(user.address, templateId))
        .to.emit(pieceNFT, "MintedPiece")
        .withArgs(user.address, expectedTokenId);

      expectedTokenId++;

      expect(await pieceNFT.connect(minter).mint(user.address, templateId))
        .to.emit(pieceNFT, "MintedPiece")
        .withArgs(user.address, expectedTokenId);
    });

    it("should revert when non-PIECE_MINTER tries to mint", async function () {
      await expect(pieceNFT.connect(user).mint(user.address, templateId))
        .to.be.revertedWithCustomError(pieceNFT, "Access_NotAuthorized");
    });
    it("should revert when minting with invalid template ID", async function () {
      const invalidTemplateId = 999;
      await expect(pieceNFT.connect(minter).mint(user.address, invalidTemplateId))
        .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidTemplate")
        .withArgs(invalidTemplateId);
    });
    it("should revert when minting with template for different NFT contract", async function () {
      const sampleERC721 = await ethers.getContractFactory("SampleERC721");
      const sampleERC721Contract = await sampleERC721.deploy();
      await sampleERC721Contract.waitForDeployment();

      const newTemplateName = "Sample ERC721 Template";
      const newTemplateId = 2;

      await templateRegistry.connect(admin).createTemplate(sampleERC721Contract.target, newTemplateName);
      await templateRegistry.connect(admin).activateTemplate(newTemplateId);

      await expect(pieceNFT.connect(minter).mint(user.address, newTemplateId))
        .to.be.revertedWithCustomError(pieceNFT, "Template_InvalidTemplateForNFT")
        .withArgs(newTemplateId);
    });
    it("should revert when minting with non-ACTIVE template", async function () {
      const newTemplateName = "Sample ERC721 Template";
      const newTemplateId = 2;

      await templateRegistry.connect(admin).createTemplate(pieceNFT.target, newTemplateName);

      await expect(pieceNFT.connect(minter).mint(user.address, newTemplateId))
        .to.be.revertedWithCustomError(pieceNFT, "Template_InvalidTemplateStatus")
        .withArgs(newTemplateId, 1); // ACTIVE (1)
    });
  });

  describe("Attribute Management", function () {
    let tokenId: number;
    beforeEach(async function () {
      await pieceNFT.connect(minter).mint(user.address, templateId);
      tokenId = 1;
    });

    describe("Setting Attributes", function () {
      it("should allow PIECE_MANAGER to set attributes", async function () {
        const attributeKey = "material";
        const attributeValue = "steel";

        await pieceNFT.connect(user).approve(manager.address, tokenId);

        expect(await pieceNFT.connect(manager).setAttribute(tokenId, attributeKey, attributeValue))
          .to.emit(pieceNFT, "AttributeSet")
          .withArgs(tokenId, attributeKey, attributeValue);
      });

      it("should allow PIECE_DOCUMENT_MANAGER to set attributes", async function () {
        const attributeKey = "material";
        const attributeValue = "steel";
        
        await pieceNFT.connect(user).approve(documentManager.address, tokenId);

        expect(await pieceNFT.connect(documentManager).setAttribute(tokenId, attributeKey, attributeValue))
          .to.emit(pieceNFT, "AttributeSet")
          .withArgs(tokenId, attributeKey, attributeValue);
      });

      it("should validate attributes against template", async function () {
        await pieceNFT.connect(user).approve(manager.address, tokenId);
        
        await expect(pieceNFT.connect(manager).setAttribute(tokenId, attributeKey1, "steel"))
            .to.not.be.reverted;
        await expect(pieceNFT.connect(manager).setAttribute(tokenId, attributeKey1, "titanium"))
            .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidEnumValue")
            .withArgs(attributeKey1, "titanium");
    
        await expect(pieceNFT.connect(manager).setAttribute(tokenId, attributeKey2, "123"))
            .to.not.be.reverted;
        await expect(pieceNFT.connect(manager).setAttribute(tokenId, attributeKey2, "abc"))
            .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidNumberValue")
            .withArgs(attributeKey2, "abc");
    
        await expect(pieceNFT.connect(manager).setAttribute(tokenId, attributeKey3, "100"))
            .to.not.be.reverted;
        await expect(pieceNFT.connect(manager).setAttribute(tokenId, attributeKey3, "invalid"))
            .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidNumberValue")
            .withArgs(attributeKey3, "invalid");

        await expect(pieceNFT.connect(manager).setAttribute(tokenId, attributeKey4, "true"))
            .to.not.be.reverted;
        await expect(pieceNFT.connect(manager).setAttribute(tokenId, attributeKey4, "invalid"))
            .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidBooleanValue")
            .withArgs(attributeKey4, "invalid");
      });

      it("should revert when non-authorized tries to set attributes", async function () {
        await pieceNFT.connect(user).approve(manager.address, tokenId);

        await expect(pieceNFT.connect(user).setAttribute(tokenId, attributeKey1, "steel"))
            .to.be.revertedWithCustomError(pieceNFT, "Access_NotAuthorized");
      });

      it("should revert when setting attribute for non-approved token", async function () {
        await expect(pieceNFT.connect(manager).setAttribute(tokenId, attributeKey1, "steel"))
          .to.be.revertedWithCustomError(pieceNFT, "Access_NotAuthorizedForTokenID")
          .withArgs(tokenId, manager.address);
      });

      it("should revert when setting attribute for non-existent token", async function () {
        await pieceNFT.connect(user).approve(manager.address, tokenId);
        await expect(pieceNFT.connect(manager).setAttribute(999, attributeKey1, "steel"))
          .to.be.revertedWithCustomError(pieceNFT, "ERC721NonexistentToken")
          .withArgs(999);
      });

      it("should revert when setting attribute not in template", async function () {
        await pieceNFT.connect(user).approve(manager.address, tokenId);
        await expect(pieceNFT.connect(manager).setAttribute(tokenId, "invalid", "steel"))
          .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidAttributeKey")
          .withArgs(templateId, "invalid");
      });
    });

    describe("Updating Attributes", function () {
      let newTokenId: number;

      beforeEach(async function () {
        const mintTx = await pieceNFT.connect(minter).mint(user.address, templateId);
        await mintTx.wait();
        newTokenId = 2;
      });

      it("should allow PIECE_MANAGER to update attributes", async function () {
        await pieceNFT.connect(user).approve(manager.address, newTokenId);
        await pieceNFT.connect(manager).setAttribute(newTokenId, attributeKey1, "steel");

        const attributeValue = "copper";
        expect(await pieceNFT.connect(manager).updateAttribute(newTokenId, attributeKey1, attributeValue))
          .to.emit(pieceNFT, "AttributeUpdated")
          .withArgs(newTokenId, attributeKey1, attributeValue);
      });
      it("should allow PIECE_DOCUMENT_MANAGER to update attributes", async function () {
        await pieceNFT.connect(user).approve(documentManager.address, newTokenId);
        await pieceNFT.connect(documentManager).setAttribute(newTokenId, attributeKey1, "steel");

        const attributeValue = "copper";
        expect(await pieceNFT.connect(documentManager).updateAttribute(newTokenId, attributeKey1, attributeValue))
          .to.emit(pieceNFT, "AttributeUpdated")
          .withArgs(newTokenId, attributeKey1, attributeValue);
      });
      it("should revert when non-authorized tries to update attributes", async function () {
        await pieceNFT.connect(user).approve(manager.address, newTokenId);
        await expect(pieceNFT.connect(user).updateAttribute(newTokenId, attributeKey1, "copper"))
          .to.be.revertedWithCustomError(pieceNFT, "Access_NotAuthorized");
      });
      it("should revert when updating with invalid attribute value", async function () {
        await pieceNFT.connect(user).approve(manager.address, newTokenId);
        await expect(pieceNFT.connect(manager).updateAttribute(newTokenId, attributeKey1, "invalid"))
          .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidEnumValue")
          .withArgs(attributeKey1, "invalid");
      });
      it("should revert when updating non-existent attribute", async function () {
        await pieceNFT.connect(user).approve(manager.address, newTokenId);
        await expect(pieceNFT.connect(manager).updateAttribute(newTokenId, "invalid", "steel"))
          .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidAttributeKey")
          .withArgs(templateId, "invalid");
      });
    });
  });

  describe("Document Management", function () {
    let tokenId: number;

    const docDescription = "Pressure Test Certificate";
    const docUrl = "https://example.com/document.pdf";
    const docHash = "0x1234567890abcdef";
    const docMimeType = "application/pdf";

    beforeEach(async function () {
      await pieceNFT.connect(minter).mint(user.address, templateId);
      tokenId = 1;
    });

    describe("Setting Documents", function () {
      it("should allow PIECE_MANAGER to set documents", async function () {
        await pieceNFT.connect(user).approve(manager.address, tokenId);
        expect(await pieceNFT.connect(manager).setDocument(
          tokenId,
          documentKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        )).to.emit(pieceNFT, "DocumentSet")
          .withArgs(tokenId, documentKey, docDescription, docUrl, docHash, docMimeType);
      });

      it("should allow PIECE_DOCUMENT_MANAGER to set documents", async function () {
        await pieceNFT.connect(user).approve(documentManager.address, tokenId);
        expect(await pieceNFT.connect(documentManager).setDocument(
          tokenId,
          documentKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        )).to.emit(pieceNFT, "DocumentSet")
          .withArgs(tokenId, documentKey, docDescription, docUrl, docHash, docMimeType);
      });

      it("should validate documents against template", async function () {
        await pieceNFT.connect(user).approve(manager.address, tokenId);

        const invalidMimeType = "invalid/type";
        await expect(pieceNFT.connect(manager).setDocument(
          tokenId,
          documentKey,
          docDescription,
          docUrl,
          docHash,
          invalidMimeType
        )).to.be.revertedWithCustomError(templateRegistry, "Template_InvalidMimeType")
          .withArgs(invalidMimeType);
      });

      it("should revert when non-authorized tries to set documents", async function () {
        await expect(pieceNFT.connect(user).setDocument(
          tokenId,
          documentKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        )).to.be.revertedWithCustomError(pieceNFT, "Access_NotAuthorized");
      });

      it("should revert when setting document for non-approved token", async function () {
        await expect(pieceNFT.connect(admin).setDocument(
          tokenId,
          documentKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        )).to.be.revertedWithCustomError(pieceNFT, "Access_NotAuthorizedForTokenID")
          .withArgs(tokenId, admin.address);
      });

      it("should revert when setting document for non-existent token", async function () {
        const invalidTokenId = 999;
        await expect(pieceNFT.connect(manager).setDocument(
          invalidTokenId,
          documentKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        )).to.be.revertedWithCustomError(pieceNFT, "ERC721NonexistentToken")
          .withArgs(invalidTokenId);
      });

      it("should revert when setting invalid document", async function () {
        await pieceNFT.connect(user).approve(manager.address, tokenId);

        const invalidDocKey = "invalidDocumentKey";
        await expect(pieceNFT.connect(manager).setDocument(
          tokenId,
          invalidDocKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        )).to.be.revertedWithCustomError(templateRegistry, "Template_InvalidDocumentKey")
          .withArgs(templateId, invalidDocKey);
      });
    });

    describe("Updating Documents", function () {
      let docId: number;
      const newDescription = "Updated Description";
      const newUrl = "https://example.com/updated.pdf";
      const newHash = "0x9876543210fedcba";

      beforeEach(async function () {
        await pieceNFT.connect(user).approve(manager.address, tokenId);
        await pieceNFT.connect(manager).setDocument(
          tokenId,
          documentKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        );
        docId = 1; 
      });

      it("should allow PIECE_MANAGER to update documents", async function () {
        await pieceNFT.connect(user).approve(manager.address, tokenId);

        expect(await pieceNFT.connect(manager).updateDocument(
          tokenId,
          docId,
          documentKey,
          newDescription,
          newUrl,
          newHash,
          docMimeType
        )).to.emit(pieceNFT, "DocumentUpdated")
          .withArgs(tokenId, docId, documentKey, newDescription, newUrl, newHash, docMimeType);
      });

      it("should allow PIECE_DOCUMENT_MANAGER to update documents", async function () {
        await pieceNFT.connect(user).approve(documentManager.address, tokenId);

        expect(await pieceNFT.connect(documentManager).updateDocument(
          tokenId,
          docId,
          documentKey,
          newDescription,
          newUrl,
          newHash,
          docMimeType
        )).to.emit(pieceNFT, "DocumentUpdated")
          .withArgs(tokenId, docId, documentKey, newDescription, newUrl, newHash, docMimeType);
      });

      it("should validate updated documents against template", async function () {
        await pieceNFT.connect(user).approve(manager.address, tokenId);

        const invalidMimeType = "invalid/type";

        await expect(pieceNFT.connect(manager).updateDocument(
          tokenId,
          docId,
          documentKey,
          docDescription,
          docUrl,
          docHash,
          invalidMimeType
        )).to.be.revertedWithCustomError(templateRegistry, "Template_InvalidMimeType")
          .withArgs(invalidMimeType);
      });
      it("should revert when non-authorized tries to update documents", async function () {
        await expect(pieceNFT.connect(user).updateDocument(
          tokenId,
          docId,
          documentKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        )).to.be.revertedWithCustomError(pieceNFT, "Access_NotAuthorized");
      });
      it("should revert when updating non-existent document", async function () {
        await pieceNFT.connect(user).approve(manager.address, tokenId);
        const invalidDocId = 999;

        await expect(pieceNFT.connect(manager).updateDocument(
          tokenId,
          invalidDocId,
          documentKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        )).to.be.revertedWithCustomError(pieceNFT, "InvalidDocument")
          .withArgs(tokenId, invalidDocId);
      });
      it("should revert when updating with invalid document type", async function () {
        await pieceNFT.connect(user).approve(manager.address, tokenId);
        const invalidDocKey = "invalidDocumentKey";

        await expect(pieceNFT.connect(manager).updateDocument(
          tokenId,
          docId,
          invalidDocKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        )).to.be.revertedWithCustomError(templateRegistry, "Template_InvalidDocumentKey")
          .withArgs(templateId, invalidDocKey);
      });
    });
  });

  describe("Token Authorization", function () {
    let tokenId: number;

    beforeEach(async function () {
      await pieceNFT.connect(minter).mint(user.address, templateId);
      tokenId = 1;
    });

    it("should authorize token owner", async function () {
      // Owner should be able to set attributes directly
      await pieceNFT.connect(user).approve(manager.address, tokenId);
      expect(await pieceNFT.connect(manager).setAttribute(tokenId, attributeKey1, "steel"))
        .to.emit(pieceNFT, "AttributeSet")
        .withArgs(tokenId, attributeKey1, "steel");
    });

    it("should authorize approved operator", async function () {
      // Approve another address as operator
      const operator = documentManager; // Using documentManager as operator for test
      await pieceNFT.connect(user).approve(operator.address, tokenId);
      await pieceNFT.connect(user).approve(manager.address, tokenId);

      // Operator should be able to set attributes
      expect(await pieceNFT.connect(manager).setAttribute(tokenId, attributeKey1, "steel"))
        .to.emit(pieceNFT, "AttributeSet")
        .withArgs(tokenId, attributeKey1, "steel");
    });

    it("should authorize approved for all", async function () {
      // Set approval for all
      await pieceNFT.connect(user).setApprovalForAll(manager.address, true);

      // Should be able to set attributes for any token owned by user
      expect(await pieceNFT.connect(manager).setAttribute(tokenId, attributeKey1, "steel"))
        .to.emit(pieceNFT, "AttributeSet")
        .withArgs(tokenId, attributeKey1, "steel");

      // Mint another token and verify manager can still operate
      await pieceNFT.connect(minter).mint(user.address, templateId);
      const newTokenId = 2;
      expect(await pieceNFT.connect(manager).setAttribute(newTokenId, attributeKey1, "steel"))
        .to.emit(pieceNFT, "AttributeSet")
        .withArgs(newTokenId, attributeKey1, "steel");
    });

    it("should not authorize non-owner/non-approved", async function () {
      // Try to set attributes with non-approved address
      await expect(pieceNFT.connect(manager).setAttribute(tokenId, attributeKey1, "steel"))
        .to.be.revertedWithCustomError(pieceNFT, "Access_NotAuthorizedForTokenID")
        .withArgs(tokenId, manager.address);
    });

    it("should revert authorization check for non-existent token", async function () {
      const nonExistentTokenId = 999;
      await expect(pieceNFT.connect(manager).setAttribute(nonExistentTokenId, attributeKey1, "steel"))
        .to.be.revertedWithCustomError(pieceNFT, "ERC721NonexistentToken")
        .withArgs(nonExistentTokenId);
    });
  });

  describe("ERC721 Compliance", function () {
    let tokenId: number;

    beforeEach(async function () {
      await pieceNFT.connect(minter).mint(user.address, templateId);
      tokenId = 1;
    });

    it("should support ERC721 interface", async function () {
      expect(await pieceNFT.supportsInterface("0x80ac58cd")).to.be.true; // ERC721
    });

    it("should handle token transfers correctly", async function () {
      expect(await pieceNFT.ownerOf(tokenId)).to.equal(user.address);

      await pieceNFT.connect(user).transferFrom(user.address, admin.address, tokenId);
      expect(await pieceNFT.ownerOf(tokenId)).to.equal(admin.address);

      expect(await pieceNFT.getApproved(tokenId)).to.equal(ethers.ZeroAddress);
    });

    it("should handle token approvals correctly", async function () {
      expect(await pieceNFT.getApproved(tokenId)).to.equal(ethers.ZeroAddress);

      await pieceNFT.connect(user).approve(manager.address, tokenId);
      expect(await pieceNFT.getApproved(tokenId)).to.equal(manager.address);

      await pieceNFT.connect(user).setApprovalForAll(documentManager.address, true);
      expect(await pieceNFT.isApprovedForAll(user.address, documentManager.address)).to.be.true;

      await pieceNFT.connect(user).setApprovalForAll(documentManager.address, false);
      expect(await pieceNFT.isApprovedForAll(user.address, documentManager.address)).to.be.false;
    });
  });
});