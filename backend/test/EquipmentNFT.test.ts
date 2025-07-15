import { ethers } from "hardhat";
import { expect } from "chai";

describe("EquipmentNFT", function () {
  let accessManager: any;
  let templateRegistry: any;
  let pieceNFT: any;
  let equipmentNFT: any;
  let admin: any;
  let minter: any;
  let manager: any;
  let documentManager: any;
  let auditor: any;
  let user: any;

  let equipmentTemplateId: number;
  let pieceTemplateId: number;
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

  // Helper function to convert bytes32 to address
  function bytes32ToAddress(bytes32Value: string): string {
    return ethers.getAddress(ethers.dataSlice(bytes32Value, 12, 32));
  }

  async function createTemplates() {
    templateName = "Test Equipment Template";
    await templateRegistry.connect(admin).createTemplate(equipmentNFT.target, templateName);
    equipmentTemplateId = 1;

    const pieceTemplateName = "Test Piece Template";
    await templateRegistry.connect(admin).createTemplate(pieceNFT.target, pieceTemplateName);
    pieceTemplateId = 2;

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

    attributeKey4 = "isAssembled";
    attribute4 = {
      name: "Is Assembled",
      attributeType: "boolean",
      allowedValues: [],
      units: "N/A",
      required: true
    };

    for (const id of [equipmentTemplateId, pieceTemplateId]) {
      await templateRegistry.connect(admin).addAttribute(id, attributeKey1, attribute1);
      await templateRegistry.connect(admin).addAttribute(id, attributeKey2, attribute2);
      await templateRegistry.connect(admin).addAttribute(id, attributeKey3, attribute3);
      await templateRegistry.connect(admin).addAttribute(id, attributeKey4, attribute4);

      documentKey = "equipmentInstructions";
      documentDefinition = {
        name: "Equipment Instructions",
        allowedMimeTypes: ["application/pdf"],
        required: true
      };

      await templateRegistry.connect(admin).addDocument(id, documentKey, documentDefinition);
      await templateRegistry.connect(admin).activateTemplate(id);
    }
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

    const EquipmentNFT = await ethers.getContractFactory("EquipmentNFT");
    equipmentNFT = await EquipmentNFT.deploy(
      await templateRegistry.getAddress(),
      await accessManager.getAddress(),
      [await pieceNFT.getAddress()]
    );
    await equipmentNFT.waitForDeployment();

    await accessManager.grantRole(await accessManager.EQUIPMENT_MANAGER(), manager.address);
    await accessManager.connect(manager).grantRole(await accessManager.EQUIPMENT_MINTER(), minter.address);
    await accessManager.connect(manager).grantRole(await accessManager.EQUIPMENT_DOCUMENT_MANAGER(), documentManager.address);
    await accessManager.connect(manager).grantRole(await accessManager.EQUIPMENT_AUDITOR(), auditor.address);

    await accessManager.grantRole(await accessManager.PIECE_MANAGER(), manager.address);
    await accessManager.connect(manager).grantRole(await accessManager.PIECE_MINTER(), minter.address);
    await accessManager.connect(manager).grantRole(await accessManager.PIECE_DOCUMENT_MANAGER(), documentManager.address);
    await accessManager.connect(manager).grantRole(await accessManager.PIECE_AUDITOR(), auditor.address);

    await createTemplates();
  });

  describe("Deployment", function () {
    it("should deploy with correct name 'EquipmentNFT'", async function () {
      expect(await equipmentNFT.name()).to.equal("EquipmentNFT");
    });
    it("should deploy with correct symbol 'EQUIPMENT'", async function () {
      expect(await equipmentNFT.symbol()).to.equal("EQUIPMENT");
    });
  });

  describe("Minting", function () {
    it("should allow EQUIPMENT_MINTER to mint with valid template", async function () {
      const expectedTokenId = 1;
      expect(await equipmentNFT.connect(minter).mint(user.address, equipmentTemplateId))
        .to.emit(equipmentNFT, "Transfer")
        .withArgs(ethers.ZeroAddress, user.address, expectedTokenId);
    });

    it("should increment token counter correctly", async function () {
      await equipmentNFT.connect(minter).mint(user.address, equipmentTemplateId);
    
      const expectedTokenId = 2;
      expect(await equipmentNFT.connect(minter).mint(user.address, equipmentTemplateId))
        .to.emit(equipmentNFT, "Transfer")
        .withArgs(ethers.ZeroAddress, user.address, expectedTokenId);
    });

    it("should revert when non-EQUIPMENT_MINTER tries to mint", async function () {
      await expect(equipmentNFT.connect(user).mint(user.address, equipmentTemplateId))
        .to.be.revertedWithCustomError(equipmentNFT, "Access_NotAuthorized");
    });

    it("should revert when minting with invalid template ID", async function () {
      const invalidTemplateId = 999;
      await expect(equipmentNFT.connect(minter).mint(user.address, invalidTemplateId))
        .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidTemplate")
        .withArgs(invalidTemplateId);
    });

    it("should revert when minting with template for different NFT contract", async function () {
      await expect(equipmentNFT.connect(minter).mint(user.address, pieceTemplateId))
        .to.be.revertedWithCustomError(equipmentNFT, "Template_InvalidTemplateForNFT")
        .withArgs(pieceTemplateId);
    });

    it("should revert when minting with non-ACTIVE template", async function () {
      const tx = await templateRegistry.connect(admin).createTemplate(equipmentNFT.target, "Inactive Template");
      const receipt = await tx.wait();
      const event = receipt.logs[0];
      const inactiveTemplateId = event.args[0];

      await expect(equipmentNFT.connect(minter).mint(user.address, inactiveTemplateId))
        .to.be.revertedWithCustomError(equipmentNFT, "Template_InvalidTemplateStatus")
        .withArgs(inactiveTemplateId, 1); // ACTIVE (1)
    });
  });

  describe("Child Token Management", function () {
    let parentTokenId: number;
    let childTokenId: number;

    beforeEach(async function () {
      await equipmentNFT.connect(minter).mint(user.address, equipmentTemplateId);
      parentTokenId = 1;

      await pieceNFT.connect(minter).mint(user.address, pieceTemplateId);
      childTokenId = 1;
    });

    it("should reject child token from non-allowed contract", async function () {
      const SampleERC721 = await ethers.getContractFactory("SampleERC721");
      const sampleNFT = await SampleERC721.deploy();
      await sampleNFT.waitForDeployment();

      await sampleNFT.connect(minter).mint(user.address);
      const sampleChildTokenId = 1;

      const data = ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [parentTokenId]);
      await expect(
        sampleNFT.connect(user)["safeTransferFrom(address,address,uint256,bytes)"](
          user.address,
          equipmentNFT.target,
          sampleChildTokenId,
          data
        )
      ).to.be.revertedWithCustomError(equipmentNFT, "ChildContractNotAllowed")
        .withArgs(sampleNFT.target);
    });

    it("should correctly track child token ownership", async function () {
      await pieceNFT.connect(user).approve(equipmentNFT.target, childTokenId);

      const data = ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [parentTokenId]);
  
      await pieceNFT.connect(user)["safeTransferFrom(address,address,uint256,bytes)"](
        user.address,
        equipmentNFT.target,
        childTokenId,
        data
      );

      expect(await equipmentNFT.totalChildContracts(parentTokenId)).to.equal(1);
      expect(await equipmentNFT.childContractByIndex(parentTokenId, 0)).to.equal(pieceNFT.target);

      expect(await equipmentNFT.totalChildTokens(parentTokenId, pieceNFT.target)).to.equal(1);
      expect(await equipmentNFT.childTokenByIndex(parentTokenId, pieceNFT.target, 0)).to.equal(childTokenId);

      const [parentTokenOwner, parentTokenId_] = await equipmentNFT.ownerOfChild(pieceNFT.target, childTokenId);
      expect(bytes32ToAddress(parentTokenOwner)).to.equal(user.address);
    });

    it("should emit correct events when receiving child token", async function () {
      await pieceNFT.connect(user).approve(equipmentNFT.target, childTokenId);
      const data = ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [parentTokenId]);

      await expect(
        pieceNFT.connect(user)["safeTransferFrom(address,address,uint256,bytes)"](
          user.address,
          equipmentNFT.target,
          childTokenId,
          data
        )
      ).to.emit(equipmentNFT, "ReceivedChild")
       .withArgs(user.address, parentTokenId, pieceNFT.target, childTokenId)
       .and.to.emit(pieceNFT, "Transfer")
       .withArgs(user.address, equipmentNFT.target, childTokenId);
    });

    it("should handle multiple child tokens for same parent", async function () {
      await pieceNFT.connect(user).approve(equipmentNFT.target, childTokenId);
      const data = ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [parentTokenId]);
      await pieceNFT.connect(user)["safeTransferFrom(address,address,uint256,bytes)"](
        user.address,
        equipmentNFT.target,
        childTokenId,
        data
      );

      await pieceNFT.connect(minter).mint(user.address, pieceTemplateId);
      const childTokenId2 = 2;

      await pieceNFT.connect(user).approve(equipmentNFT.target, childTokenId2);
      await pieceNFT.connect(user)["safeTransferFrom(address,address,uint256,bytes)"](
        user.address,
        equipmentNFT.target,
        childTokenId2,
        data
      );

      expect(await equipmentNFT.totalChildContracts(parentTokenId)).to.equal(1);
      expect(await equipmentNFT.childContractByIndex(parentTokenId, 0)).to.equal(pieceNFT.target);

      expect(await equipmentNFT.totalChildTokens(parentTokenId, pieceNFT.target)).to.equal(2);
      expect(await equipmentNFT.childTokenByIndex(parentTokenId, pieceNFT.target, 0)).to.equal(childTokenId);
      expect(await equipmentNFT.childTokenByIndex(parentTokenId, pieceNFT.target, 1)).to.equal(childTokenId2);
    });

    it("should reject child token for non-existent parent token", async function () {
      const nonExistentParentId = 999;
      await pieceNFT.connect(user).approve(equipmentNFT.target, childTokenId);
      const data = ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [nonExistentParentId]);

      await expect(
        pieceNFT.connect(user)["safeTransferFrom(address,address,uint256,bytes)"](
          user.address,
          equipmentNFT.target,
          childTokenId,
          data
        )
      ).to.be.revertedWithCustomError(equipmentNFT, "ERC721NonexistentToken")
       .withArgs(nonExistentParentId);
    });

    it("should reject child token when sender is not authorized", async function () {
      await pieceNFT.connect(user).approve(equipmentNFT.target, childTokenId);
      const data = ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [parentTokenId]);

      await expect(
        pieceNFT.connect(admin)["safeTransferFrom(address,address,uint256,bytes)"](
          admin.address,
          equipmentNFT.target,
          childTokenId,
          data
        )
      ).to.be.revertedWithCustomError(equipmentNFT, "ERC721InsufficientApproval");
    });
  });

  describe("Token Authorization", function () {
    let tokenId: number;
    let childTokenId: number;

    beforeEach(async function () {
      await equipmentNFT.connect(minter).mint(user.address, equipmentTemplateId);
      tokenId = 1;

      await pieceNFT.connect(minter).mint(user.address, pieceTemplateId);
      childTokenId = 1;
    });

    it("should authorize root token owner", async function () {
      await accessManager.connect(admin).grantRole(await accessManager.EQUIPMENT_MANAGER(), user.address);
      
      await expect(equipmentNFT.connect(user).setAttribute(
        tokenId,
        attributeKey1,
        "steel"
      )).to.not.be.reverted;
    });

    it("should authorize approved operator", async function () {
      await equipmentNFT.connect(user).approve(manager.address, tokenId);
      await expect(equipmentNFT.connect(manager).setAttribute(
        tokenId,
        attributeKey1,
        "steel"
      )).to.not.be.reverted;
    });

    it("should not authorize non-owner/non-approved", async function () {
      await expect(equipmentNFT.connect(admin).setAttribute(
        tokenId,
        attributeKey1,
        "steel"
      )).to.be.revertedWithCustomError(equipmentNFT, "Access_NotAuthorizedForTokenID")
        .withArgs(tokenId, admin.address);
    });

    it("should handle authorization through child token ownership chain", async function () {
      await accessManager.connect(admin).grantRole(await accessManager.EQUIPMENT_MANAGER(), admin.address);

      await pieceNFT.connect(user).approve(equipmentNFT.target, childTokenId);
      const data = ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [tokenId]);
      await pieceNFT.connect(user)["safeTransferFrom(address,address,uint256,bytes)"](
        user.address,
        equipmentNFT.target,
        childTokenId,
        data
      );

      await equipmentNFT.connect(user).transferFrom(user.address, admin.address, tokenId);

      await expect(equipmentNFT.connect(user).setAttribute(
        tokenId,
        attributeKey1,
        "steel"
      )).to.be.revertedWithCustomError(equipmentNFT, "Access_NotAuthorizedForTokenID")
        .withArgs(tokenId, user.address);

      await expect(equipmentNFT.connect(admin).setAttribute(
        tokenId,
        attributeKey1,
        "steel"
      )).to.not.be.reverted;

      const [rootOwnerBytes32, _] = await equipmentNFT.ownerOfChild(pieceNFT.target, childTokenId);
      expect(bytes32ToAddress(rootOwnerBytes32)).to.equal(admin.address);
    });
  });

  describe("Attribute Management", function () {
    let tokenId: number;
    beforeEach(async function () {
      await equipmentNFT.connect(minter).mint(user.address, equipmentTemplateId);
      tokenId = 1;
    });

    describe("Setting Attributes", function () {
      it("should allow EQUIPMENT_MANAGER to set attributes", async function () {
        const attributeKey = "material";
        const attributeValue = "steel";

        await equipmentNFT.connect(user).approve(manager.address, tokenId);

        expect(await equipmentNFT.connect(manager).setAttribute(tokenId, attributeKey, attributeValue))
          .to.emit(equipmentNFT, "AttributeSet")
          .withArgs(tokenId, attributeKey, attributeValue);
      });

      it("should allow EQUIPMENT_DOCUMENT_MANAGER to set attributes", async function () {
        const attributeKey = "material";
        const attributeValue = "steel";
        
        await equipmentNFT.connect(user).approve(documentManager.address, tokenId);

        expect(await equipmentNFT.connect(documentManager).setAttribute(tokenId, attributeKey, attributeValue))
          .to.emit(equipmentNFT, "AttributeSet")
          .withArgs(tokenId, attributeKey, attributeValue);
      });

      it("should validate attributes against template", async function () {
        await equipmentNFT.connect(user).approve(manager.address, tokenId);
        
        // Test enum validation
        await expect(equipmentNFT.connect(manager).setAttribute(tokenId, attributeKey1, "steel"))
          .to.not.be.reverted;
        await expect(equipmentNFT.connect(manager).setAttribute(tokenId, attributeKey1, "titanium"))
          .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidEnumValue")
          .withArgs(attributeKey1, "titanium");

        // Test number validation
        await expect(equipmentNFT.connect(manager).setAttribute(tokenId, attributeKey2, "123"))
          .to.not.be.reverted;
        await expect(equipmentNFT.connect(manager).setAttribute(tokenId, attributeKey2, "abc"))
          .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidNumberValue")
          .withArgs(attributeKey2, "abc");

        // Test number with units validation
        await expect(equipmentNFT.connect(manager).setAttribute(tokenId, attributeKey3, "100"))
          .to.not.be.reverted;
        await expect(equipmentNFT.connect(manager).setAttribute(tokenId, attributeKey3, "invalid"))
          .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidNumberValue")
          .withArgs(attributeKey3, "invalid");

        // Test boolean validation
        await expect(equipmentNFT.connect(manager).setAttribute(tokenId, attributeKey4, "true"))
          .to.not.be.reverted;
        await expect(equipmentNFT.connect(manager).setAttribute(tokenId, attributeKey4, "invalid"))
          .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidBooleanValue")
          .withArgs(attributeKey4, "invalid");
      });

      it("should revert when non-authorized tries to set attributes", async function () {
        await expect(equipmentNFT.connect(user).setAttribute(tokenId, attributeKey1, "steel"))
          .to.be.revertedWithCustomError(equipmentNFT, "Access_NotAuthorized");
      });

      it("should revert when setting attribute for non-approved token", async function () {
        await expect(equipmentNFT.connect(manager).setAttribute(tokenId, attributeKey1, "steel"))
          .to.be.revertedWithCustomError(equipmentNFT, "Access_NotAuthorizedForTokenID")
          .withArgs(tokenId, manager.address);
      });

      it("should revert when setting attribute for non-existent token", async function () {
        await equipmentNFT.connect(user).approve(manager.address, tokenId);
        await expect(equipmentNFT.connect(manager).setAttribute(999, attributeKey1, "steel"))
          .to.be.revertedWithCustomError(equipmentNFT, "ERC721NonexistentToken")
          .withArgs(999);
      });

      it("should revert when setting attribute not in template", async function () {
        await equipmentNFT.connect(user).approve(manager.address, tokenId);
        await expect(equipmentNFT.connect(manager).setAttribute(tokenId, "invalid", "steel"))
          .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidAttributeKey")
          .withArgs(equipmentTemplateId, "invalid");
      });
    });

    describe("Updating Attributes", function () {
      let newTokenId: number;

      beforeEach(async function () {
        const mintTx = await equipmentNFT.connect(minter).mint(user.address, equipmentTemplateId);
        await mintTx.wait();
        newTokenId = 2;
      });

      it("should allow EQUIPMENT_MANAGER to update attributes", async function () {
        await equipmentNFT.connect(user).approve(manager.address, newTokenId);
        await equipmentNFT.connect(manager).setAttribute(newTokenId, attributeKey1, "steel");

        const attributeValue = "copper";
        expect(await equipmentNFT.connect(manager).updateAttribute(newTokenId, attributeKey1, attributeValue))
          .to.emit(equipmentNFT, "AttributeUpdated")
          .withArgs(newTokenId, attributeKey1, attributeValue);
      });

      it("should allow EQUIPMENT_DOCUMENT_MANAGER to update attributes", async function () {
        await equipmentNFT.connect(user).approve(documentManager.address, newTokenId);
        await equipmentNFT.connect(documentManager).setAttribute(newTokenId, attributeKey1, "steel");

        const attributeValue = "copper";
        expect(await equipmentNFT.connect(documentManager).updateAttribute(newTokenId, attributeKey1, attributeValue))
          .to.emit(equipmentNFT, "AttributeUpdated")
          .withArgs(newTokenId, attributeKey1, attributeValue);
      });

      it("should revert when non-authorized tries to update attributes", async function () {
        await equipmentNFT.connect(user).approve(manager.address, newTokenId);
        await expect(equipmentNFT.connect(user).updateAttribute(newTokenId, attributeKey1, "copper"))
          .to.be.revertedWithCustomError(equipmentNFT, "Access_NotAuthorized");
      });

      it("should revert when updating with invalid attribute value", async function () {
        await equipmentNFT.connect(user).approve(manager.address, newTokenId);
        await expect(equipmentNFT.connect(manager).updateAttribute(newTokenId, attributeKey1, "invalid"))
          .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidEnumValue")
          .withArgs(attributeKey1, "invalid");
      });

      it("should revert when updating non-existent attribute", async function () {
        await equipmentNFT.connect(user).approve(manager.address, newTokenId);
        await expect(equipmentNFT.connect(manager).updateAttribute(newTokenId, "invalid", "steel"))
          .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidAttributeKey")
          .withArgs(equipmentTemplateId, "invalid");
      });
    });
  });

  describe("Document Management", function () {
    let tokenId: number;

    const docDescription = "Equipment Instructions";
    const docUrl = "https://example.com/equipment.pdf";
    const docHash = "0x1234567890abcdef";
    const docMimeType = "application/pdf";

    beforeEach(async function () {
      await equipmentNFT.connect(minter).mint(user.address, equipmentTemplateId);
      tokenId = 1;
    });

    describe("Setting Documents", function () {
      it("should allow EQUIPMENT_MANAGER to set documents", async function () {
        await equipmentNFT.connect(user).approve(manager.address, tokenId);
        expect(await equipmentNFT.connect(manager).setDocument(
          tokenId,
          documentKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        )).to.emit(equipmentNFT, "DocumentSet")
          .withArgs(tokenId, documentKey, docDescription, docUrl, docHash, docMimeType);
      });

      it("should allow EQUIPMENT_DOCUMENT_MANAGER to set documents", async function () {
        await equipmentNFT.connect(user).approve(documentManager.address, tokenId);
        expect(await equipmentNFT.connect(documentManager).setDocument(
          tokenId,
          documentKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        )).to.emit(equipmentNFT, "DocumentSet")
          .withArgs(tokenId, documentKey, docDescription, docUrl, docHash, docMimeType);
      });

      it("should validate documents against template", async function () {
        await equipmentNFT.connect(user).approve(manager.address, tokenId);

        const invalidMimeType = "invalid/type";
        await expect(equipmentNFT.connect(manager).setDocument(
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
        await expect(equipmentNFT.connect(user).setDocument(
          tokenId,
          documentKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        )).to.be.revertedWithCustomError(equipmentNFT, "Access_NotAuthorized");
      });

      it("should revert when setting document for non-approved token", async function () {
        await expect(equipmentNFT.connect(admin).setDocument(
          tokenId,
          documentKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        )).to.be.revertedWithCustomError(equipmentNFT, "Access_NotAuthorizedForTokenID")
          .withArgs(tokenId, admin.address);
      });

      it("should revert when setting document for non-existent token", async function () {
        const invalidTokenId = 999;
        await expect(equipmentNFT.connect(manager).setDocument(
          invalidTokenId,
          documentKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        )).to.be.revertedWithCustomError(equipmentNFT, "ERC721NonexistentToken")
          .withArgs(invalidTokenId);
      });

      it("should revert when setting invalid document", async function () {
        await equipmentNFT.connect(user).approve(manager.address, tokenId);

        const invalidDocKey = "invalidDocumentKey";
        await expect(equipmentNFT.connect(manager).setDocument(
          tokenId,
          invalidDocKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        )).to.be.revertedWithCustomError(templateRegistry, "Template_InvalidDocumentKey")
          .withArgs(equipmentTemplateId, invalidDocKey);
      });
    });

    describe("Updating Documents", function () {
      let docId: number;
      const newDescription = "Updated Equipment Instructions";
      const newUrl = "https://example.com/updated-equipment.pdf";
      const newHash = "0x9876543210fedcba";

      beforeEach(async function () {
        await equipmentNFT.connect(user).approve(manager.address, tokenId);
        await equipmentNFT.connect(manager).setDocument(
          tokenId,
          documentKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        );
        docId = 1;
      });

      it("should allow EQUIPMENT_MANAGER to update documents", async function () {
        await equipmentNFT.connect(user).approve(manager.address, tokenId);

        expect(await equipmentNFT.connect(manager).updateDocument(
          tokenId,
          docId,
          documentKey,
          newDescription,
          newUrl,
          newHash,
          docMimeType
        )).to.emit(equipmentNFT, "DocumentUpdated")
          .withArgs(tokenId, docId, documentKey, newDescription, newUrl, newHash, docMimeType);
      });

      it("should allow EQUIPMENT_DOCUMENT_MANAGER to update documents", async function () {
        await equipmentNFT.connect(user).approve(documentManager.address, tokenId);

        expect(await equipmentNFT.connect(documentManager).updateDocument(
          tokenId,
          docId,
          documentKey,
          newDescription,
          newUrl,
          newHash,
          docMimeType
        )).to.emit(equipmentNFT, "DocumentUpdated")
          .withArgs(tokenId, docId, documentKey, newDescription, newUrl, newHash, docMimeType);
      });

      it("should validate updated documents against template", async function () {
        await equipmentNFT.connect(user).approve(manager.address, tokenId);

        const invalidMimeType = "invalid/type";
        await expect(equipmentNFT.connect(manager).updateDocument(
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
        await expect(equipmentNFT.connect(user).updateDocument(
          tokenId,
          docId,
          documentKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        )).to.be.revertedWithCustomError(equipmentNFT, "Access_NotAuthorized");
      });

      it("should revert when updating non-existent document", async function () {
        await equipmentNFT.connect(user).approve(manager.address, tokenId);
        const invalidDocId = 999;

        await expect(equipmentNFT.connect(manager).updateDocument(
          tokenId,
          invalidDocId,
          documentKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        )).to.be.revertedWithCustomError(equipmentNFT, "InvalidDocument")
          .withArgs(tokenId, invalidDocId);
      });

      it("should revert when updating with invalid document type", async function () {
        await equipmentNFT.connect(user).approve(manager.address, tokenId);
        const invalidDocKey = "invalidDocumentKey";

        await expect(equipmentNFT.connect(manager).updateDocument(
          tokenId,
          docId,
          invalidDocKey,
          docDescription,
          docUrl,
          docHash,
          docMimeType
        )).to.be.revertedWithCustomError(templateRegistry, "Template_InvalidDocumentKey")
          .withArgs(equipmentTemplateId, invalidDocKey);
      });
    });
  });
});
