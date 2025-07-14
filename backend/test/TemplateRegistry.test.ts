import { expect } from "chai";
import { ethers } from "hardhat";

describe("TemplateRegistry", function () {
  let templateRegistry: any;
  let accessManager: any;
  let pieceNFT: any;
  let pieceNFTAddress: string;
  let admin: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    const [address1, address2, address3] = await ethers.getSigners();
    admin = address1;
    user1 = address2;
    user2 = address3;

    const AccessManager = await ethers.getContractFactory("AccessManager");
    accessManager = await AccessManager.deploy();
    await accessManager.waitForDeployment();

    const TemplateRegistry = await ethers.getContractFactory("TemplateRegistry");
    templateRegistry = await TemplateRegistry.deploy(accessManager.getAddress());
    await templateRegistry.waitForDeployment();

    const PieceNFT = await ethers.getContractFactory("PieceNFT");
    pieceNFT = await PieceNFT.deploy(templateRegistry.getAddress(), accessManager.getAddress());
    await pieceNFT.waitForDeployment();
    pieceNFTAddress = await pieceNFT.getAddress();

    await accessManager.grantRole(await accessManager.TEMPLATE_MANAGER(), admin.address);
  });

  describe("Template Creation & Management", function () {
    const templateName = "Test Template";

    it("should allow TEMPLATE_MANAGER to create a template", async function () {
      await templateRegistry.connect(admin).createTemplate(pieceNFTAddress, templateName);

      const template = await templateRegistry.templates(1);
      expect(template.nftContract).to.equal(pieceNFTAddress);
      expect(template.templateName).to.equal(templateName);
      expect(template.status).to.equal(0); // DRAFT (0)
    });

    it("should emit TemplateCreated event on template creation", async function () {
      await expect(
        templateRegistry.connect(admin).createTemplate(pieceNFTAddress, templateName)
      ).to.emit(templateRegistry, "Template_Created")
       .withArgs(1, templateName, pieceNFTAddress);
    });

    it("should not allow non-TEMPLATE_MANAGER to create a template", async function () {
      await expect(
        templateRegistry.connect(user1).createTemplate(pieceNFTAddress, templateName)
      ).to.be.revertedWithCustomError(templateRegistry, "Access_NotAuthorized")
       .withArgs(await accessManager.TEMPLATE_MANAGER());
    });
  });

  describe("Attribute Management", function () {
    let templateId: number;
    let attributeKey: string;
    let attribute: any;

    beforeEach(async function () {
      const templateName = "Test Template";
      await templateRegistry.connect(admin).createTemplate(pieceNFTAddress, templateName);
      templateId = 1;

      attributeKey = "serialNumber";
      attribute = {
        name: "Serial Number",
        attributeType: "string",
        allowedValues: [],
        units: "N/A",
        required: true
      };
    });

    it("should allow TEMPLATE_MANAGER to add an attribute to a template", async function () {
      await templateRegistry.connect(admin).addAttribute(templateId, attributeKey, attribute);
      const templateView = await templateRegistry.getTemplate(templateId);
      expect(templateView.attributeKeys).to.include(attributeKey);
    });

    it("should not allow non-TEMPLATE_MANAGER to add an attribute", async function () {
      await expect(
        templateRegistry.connect(user1).addAttribute(templateId, attributeKey, attribute)
      ).to.be.revertedWithCustomError(templateRegistry, "Access_NotAuthorized")
       .withArgs(await accessManager.TEMPLATE_MANAGER());
    });

    it("should revert when adding an attribute to a non-existent template", async function () {
      const invalidTemplateId = 100;
      await expect(
        templateRegistry.connect(admin).addAttribute(invalidTemplateId, attributeKey, attribute)
      ).to.be.revertedWithCustomError(templateRegistry, "Template_InvalidTemplate")
       .withArgs(invalidTemplateId);
    });

    it("should return correct attribute data from getAttribute", async function () {
      await templateRegistry.connect(admin).addAttribute(templateId, attributeKey, attribute);

      const attributeView = await templateRegistry.getAttribute(templateId, attributeKey);
      expect(attributeView.name).to.equal(attribute.name);
      expect(attributeView.attributeType).to.equal(attribute.attributeType);
      expect(attributeView.allowedValues).to.deep.equal(attribute.allowedValues);
      expect(attributeView.units).to.equal(attribute.units);
      expect(attributeView.required).to.equal(attribute.required);
    });

    it("should revert when getting an attribute with an invalid key", async function () {
      const invalidKey = "invalidKey";
      await expect(
        templateRegistry.getAttribute(templateId, invalidKey)
      ).to.be.revertedWithCustomError(templateRegistry, "Template_InvalidAttributeKey")
       .withArgs(templateId, invalidKey);
    });
  });

  describe("Document Management", function () {
    let templateId: number;
    let documentKey: string;
    let document: any;

    beforeEach(async function () {
      const templateType = "Test Type";
      await templateRegistry.connect(admin).createTemplate(pieceNFTAddress, templateType);
      templateId = 1;

      documentKey = "MSDS";
      document = {
        name: "Material Certificate",
        allowedMimeTypes: ["application/pdf"],
        required: true
      };
    });

    it("should allow TEMPLATE_MANAGER to add a document to a template", async function () {
      await templateRegistry.connect(admin).addDocument(templateId, documentKey, document);
      const templateView = await templateRegistry.getTemplate(templateId);
      expect(templateView.documentKeys).to.include(documentKey);
    });

    it("should not allow non-TEMPLATE_MANAGER to add a document", async function () {
      await expect(
        templateRegistry.connect(user1).addDocument(templateId, documentKey, document)
      ).to.be.revertedWithCustomError(templateRegistry, "Access_NotAuthorized")
       .withArgs(await accessManager.TEMPLATE_MANAGER());
    });
    
    it("should revert when adding a document to a non-existent template", async function () {
      const invalidTemplateId = 100;
      await expect(
        templateRegistry.connect(admin).addDocument(invalidTemplateId, documentKey, document)
      ).to.be.revertedWithCustomError(templateRegistry, "Template_InvalidTemplate")
       .withArgs(invalidTemplateId);
    });
    
    it("should store and return correct document data", async function () {
      await templateRegistry.connect(admin).addDocument(templateId, documentKey, document);
      const documentView = await templateRegistry.getDocument(templateId, documentKey);
      expect(documentView.name).to.equal(document.name);
      expect(documentView.allowedMimeTypes).to.deep.equal(document.allowedMimeTypes);
      expect(documentView.required).to.equal(document.required);
    });
  });

  describe("Template Activation/Deactivation", function () {
    let templateId: number;
    const templateName = "Test Template";

    beforeEach(async function () {
      await templateRegistry.connect(admin).createTemplate(pieceNFTAddress, templateName);
      templateId = 1;

      const attributeKey = "serialNumber";
      const attribute = {
        name: "Serial Number",
        attributeType: "string",
        allowedValues: [],
        units: "N/A",
        required: true
      };
      const documentKey = "material_certificate";
      const document = {
        name: "Material Certificate",
        allowedMimeTypes: ["application/pdf"],
        required: true
      };

      await templateRegistry.connect(admin).addAttribute(templateId, attributeKey, attribute);
      await templateRegistry.connect(admin).addDocument(templateId, documentKey, document);
    });

    describe("Activate Template", function () {
      it("should allow TEMPLATE_MANAGER to activate a template in DRAFT status", async function () {
        await templateRegistry.connect(admin).activateTemplate(templateId);
        const templateView = await templateRegistry.getTemplate(templateId);
        expect(templateView.status).to.equal(1); // ACTIVE (1)
      });

      it("should emit TemplateActivated event on activation", async function () {
        await expect(
          templateRegistry.connect(admin).activateTemplate(templateId)
        ).to.emit(templateRegistry, "Template_Activated")
        .withArgs(templateId, templateName, pieceNFTAddress);
      });

      it("should not allow non-TEMPLATE_MANAGER to activate a template", async function () {
        await expect(
          templateRegistry.connect(user1).activateTemplate(templateId)
        ).to.be.revertedWithCustomError(templateRegistry, "Access_NotAuthorized")
        .withArgs(await accessManager.TEMPLATE_MANAGER());
      });

      it("should revert when activating a non-existent template", async function () {
        const invalidTemplateId = 100;
        await expect(
          templateRegistry.connect(admin).activateTemplate(invalidTemplateId)
        ).to.be.revertedWithCustomError(templateRegistry, "Template_InvalidTemplate")
        .withArgs(invalidTemplateId);
      });

      it("should revert when activating a template not in DRAFT status", async function () {
        await templateRegistry.connect(admin).activateTemplate(templateId);
        await expect(
          templateRegistry.connect(admin).activateTemplate(templateId)
        ).to.be.revertedWithCustomError(templateRegistry, "Template_InvalidTemplateStatus")
        .withArgs(templateId, 0); // DRAFT (0)
      });

      it("should revert when adding an attribute to an active template", async function () {
        await templateRegistry.connect(admin).activateTemplate(templateId);
        await expect(
          templateRegistry.connect(admin).addAttribute(templateId, "newAttribute", {
            name: "New Attribute",
            attributeType: "string",
            allowedValues: [],
            units: "N/A",
            required: true
          })
        ).to.be.revertedWithCustomError(templateRegistry, "Template_InvalidTemplateStatus")
        .withArgs(templateId, 0); // DRAFT (0)
      });

      it("should revert when adding a document to an active template", async function () {  
        await templateRegistry.connect(admin).activateTemplate(templateId);
        await expect(
          templateRegistry.connect(admin).addDocument(templateId, "newDocument", {
            name: "New Document",
            allowedMimeTypes: ["application/pdf"],
            required: true
          })
        ).to.be.revertedWithCustomError(templateRegistry, "Template_InvalidTemplateStatus")
        .withArgs(templateId, 0); // DRAFT (0)
      });
    });

    describe("Deactivate Template", function () {
      it("should allow TEMPLATE_MANAGER to deactivate a template in ACTIVE status", async function () {
        await templateRegistry.connect(admin).activateTemplate(templateId);
        await templateRegistry.connect(admin).deactivateTemplate(templateId);
        const templateView = await templateRegistry.getTemplate(templateId);
        expect(templateView.status).to.equal(2); // INACTIVE (2)
      });

      it("should emit TemplateDeactivated event on deactivation", async function () {
        await templateRegistry.connect(admin).activateTemplate(templateId);
        await expect(
          templateRegistry.connect(admin).deactivateTemplate(templateId)
        ).to.emit(templateRegistry, "Template_Deactivated")
        .withArgs(templateId, templateName, pieceNFTAddress);
      });

      it("should not allow non-TEMPLATE_MANAGER to deactivate a template", async function () {
        await templateRegistry.connect(admin).activateTemplate(templateId);
        await expect(
          templateRegistry.connect(user1).deactivateTemplate(templateId)
        ).to.be.revertedWithCustomError(templateRegistry, "Access_NotAuthorized")
        .withArgs(await accessManager.TEMPLATE_MANAGER());
      });

      it("should revert when deactivating a non-existent template", async function () {
        await templateRegistry.connect(admin).activateTemplate(templateId);
        const invalidTemplateId = 100;
        await expect(
          templateRegistry.connect(admin).deactivateTemplate(invalidTemplateId)
        ).to.be.revertedWithCustomError(templateRegistry, "Template_InvalidTemplate")
        .withArgs(invalidTemplateId);
      });

      it("should revert when deactivating a template not in ACTIVE status", async function () {
        await templateRegistry.connect(admin).activateTemplate(templateId);
        await templateRegistry.connect(admin).deactivateTemplate(templateId);
        await expect(
          templateRegistry.connect(admin).deactivateTemplate(templateId)
        ).to.be.revertedWithCustomError(templateRegistry, "Template_InvalidTemplateStatus")
        .withArgs(templateId, 1); // ACTIVE (1)
      });
    });
  });

  describe("Getters", function () {
    let templateId: number;
    const templateName = "Test Template";
    let attributeKey: string;
    let documentKey: string;
    let attribute: any;
    let document: any;

    beforeEach(async function () {
      await templateRegistry.connect(admin).createTemplate(pieceNFTAddress, templateName);
      templateId = 1;

      attributeKey = "serialNumber";
      attribute = {
        name: "Serial Number",
        attributeType: "string",
        allowedValues: [],
        units: "N/A",
        required: true
      };

      documentKey = "material_certificate";
      document = {
        name: "Material Certificate",
        allowedMimeTypes: ["application/pdf"],
        required: true
      };

      await templateRegistry.connect(admin).addAttribute(templateId, attributeKey, attribute);
      await templateRegistry.connect(admin).addDocument(templateId, documentKey, document);
      await templateRegistry.connect(admin).activateTemplate(templateId);
    });

    it("should return correct template data from getTemplate", async function () {
      const templateView = await templateRegistry.getTemplate(templateId);
      expect(templateView.id).to.equal(templateId);
      expect(templateView.nftContract).to.equal(pieceNFTAddress);
      expect(templateView.templateName).to.equal(templateName);
      expect(templateView.attributeKeys).to.include(attributeKey);
      expect(templateView.documentKeys).to.include(documentKey);
      expect(templateView.status).to.equal(1); // ACTIVE (1)
    });

    it("should revert when getting a non-existent template", async function () {
      const invalidTemplateId = 100;
      await expect(
        templateRegistry.getTemplate(invalidTemplateId)
      ).to.be.revertedWithCustomError(templateRegistry, "Template_InvalidTemplate")
       .withArgs(invalidTemplateId);
    });

    it("should return correct attribute data from getAttribute", async function () {
      const attributeView = await templateRegistry.getAttribute(templateId, attributeKey);
      expect(attributeView.name).to.equal(attribute.name);
      expect(attributeView.attributeType).to.equal(attribute.attributeType);
      expect(attributeView.allowedValues).to.deep.equal(attribute.allowedValues);
      expect(attributeView.units).to.equal(attribute.units);
      expect(attributeView.required).to.equal(attribute.required);
    });

    it("should return correct document data from getDocument", async function () {
      const documentView = await templateRegistry.getDocument(templateId, documentKey);
      expect(documentView.name).to.equal(document.name);
      expect(documentView.allowedMimeTypes).to.deep.equal(document.allowedMimeTypes);
      expect(documentView.required).to.equal(document.required);
    });
  });

  describe("Attribute Validation", function () {
    let templateId: number;
    const templateName = "Test Template";
    let attributeKey1: string;
    let attribute1: any;
    let attributeKey2: string;
    let attribute2: any;
    let attributeKey3: string;
    let attribute3: any;
    let attributeKey4: string;
    let attribute4: any;

    beforeEach(async function () {
      await templateRegistry.connect(admin).createTemplate(pieceNFTAddress, templateName);
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

      attributeKey3 = "isCertified";
      attribute3 = {
        name: "Is Certified",
        attributeType: "boolean",
        allowedValues: [],
        units: "N/A",
        required: true
      };

      attributeKey4 = "description";
      attribute4 = {
        name: "Description",
        attributeType: "string",
        allowedValues: [],
        units: "N/A",
        required: true
      };

      await templateRegistry.connect(admin).addAttribute(templateId, attributeKey1, attribute1);
      await templateRegistry.connect(admin).addAttribute(templateId, attributeKey2, attribute2);
      await templateRegistry.connect(admin).addAttribute(templateId, attributeKey3, attribute3);
      await templateRegistry.connect(admin).addAttribute(templateId, attributeKey4, attribute4);
    });

    it("should validate enum attribute with allowed value", async function () {
      await expect(templateRegistry.connect(admin).validateAttribute(templateId, attributeKey1, "steel")).to.not.be.reverted;
      await expect(templateRegistry.connect(admin).validateAttribute(templateId, attributeKey1, "aluminum")).to.not.be.reverted;
      await expect(templateRegistry.connect(admin).validateAttribute(templateId, attributeKey1, "copper")).to.not.be.reverted;
    });

    it("should revert when validating enum attribute with disallowed value", async function () {
      await expect(templateRegistry.connect(admin).validateAttribute(templateId, attributeKey1, "invalid"))
        .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidEnumValue")
       .withArgs(attributeKey1, "invalid");
    });

    it("should validate number attribute with valid number", async function () {
      await expect(templateRegistry.connect(admin).validateAttribute(templateId, attributeKey2, "123")).to.not.be.reverted;
      await expect(templateRegistry.connect(admin).validateAttribute(templateId, attributeKey2, "4.56")).to.not.be.reverted;
      await expect(templateRegistry.connect(admin).validateAttribute(templateId, attributeKey2, "789.000001")).to.not.be.reverted;
      await expect(templateRegistry.connect(admin).validateAttribute(templateId, attributeKey2, "-123")).to.not.be.reverted;
    });

    it("should revert when validating number attribute with invalid number", async function () {
      const invalidNumber = "0-0293.21";
      await expect(templateRegistry.connect(admin).validateAttribute(templateId, attributeKey2, invalidNumber))
        .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidNumberValue")
        .withArgs(attributeKey2, invalidNumber);
    });

    it("should revert when validating number attribute with only decimal point", async function () {
      await expect(templateRegistry.connect(admin).validateAttribute(templateId, attributeKey2, "."))
        .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidNumberValue")
        .withArgs(attributeKey2, ".");
    });

    it("should revert when validating number attribute with only negative sign", async function () {
      await expect(templateRegistry.connect(admin).validateAttribute(templateId, attributeKey2, "-"))
        .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidNumberValue")
        .withArgs(attributeKey2, "-");
    });

    it("should validate boolean attribute with 'true' or 'false'", async function () {
      await expect(templateRegistry.connect(admin).validateAttribute(templateId, attributeKey3, "true")).to.not.be.reverted;
      await expect(templateRegistry.connect(admin).validateAttribute(templateId, attributeKey3, "false")).to.not.be.reverted;
    });

    it("should revert when validating boolean attribute with invalid value", async function () {
      await expect(templateRegistry.connect(admin).validateAttribute(templateId, attributeKey3, "invalid"))
        .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidBooleanValue")
        .withArgs(attributeKey3, "invalid");
    });

    it("should revert when validating attribute for non-existent template", async function () {
      const invalidTemplateId = 100;
      await expect(templateRegistry.connect(admin).validateAttribute(invalidTemplateId, attributeKey1, "steel"))
        .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidTemplate")
        .withArgs(invalidTemplateId);
    });

    it("should revert when validating attribute with invalid key", async function () {
      await expect(templateRegistry.connect(admin).validateAttribute(templateId, "invalidKey", "steel"))
        .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidAttributeKey")
        .withArgs(templateId, "invalidKey");
    });

    it("should validate string attribute without restrictions", async function () {
      await expect(templateRegistry.connect(admin).validateAttribute(templateId, attributeKey4, "any value")).to.not.be.reverted;
    });
  });

  describe("Document Validation", function () {
    let templateId: number;
    const templateName = "Test Template";
    let documentKey: string;
    let document: any;

    beforeEach(async function () {
      await templateRegistry.connect(admin).createTemplate(pieceNFTAddress, templateName);
      templateId = 1;

      documentKey = "material_certificate";
      document = {
        name: "Material Certificate",
        allowedMimeTypes: ["application/pdf"],
        required: true
      };

      await templateRegistry.connect(admin).addDocument(templateId, documentKey, document);
      await templateRegistry.connect(admin).activateTemplate(templateId);
    });

    it("should validate document with allowed mime type", async function () {
      await expect(templateRegistry.connect(admin)
        .validateDocument(templateId, documentKey, "application/pdf")
      ).to.not.be.reverted;
    });

    it("should revert when validating document with disallowed mime type", async function () {
      const invalidMimeType = "application/docx";
      await expect(templateRegistry.connect(admin).validateDocument(templateId, documentKey, invalidMimeType))
        .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidMimeType")
        .withArgs(invalidMimeType);
    });

    it("should revert when validating document for non-existent template", async function () {
      const invalidTemplateId = 100;
      await expect(templateRegistry.connect(admin).validateDocument(invalidTemplateId, documentKey, "application/pdf"))
        .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidTemplate")
        .withArgs(invalidTemplateId);
    });

    it("should revert when validating document with invalid key", async function () {
      await expect(templateRegistry.connect(admin).validateDocument(templateId, "invalidKey", "application/pdf"))
        .to.be.revertedWithCustomError(templateRegistry, "Template_InvalidDocumentKey")
        .withArgs(templateId, "invalidKey");
    });
  });

});
