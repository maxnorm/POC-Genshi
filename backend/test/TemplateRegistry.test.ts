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
    it("should allow TEMPLATE_MANAGER to create a template", async function () {
      const templateType = "Test Type";

      await templateRegistry.connect(admin).createTemplate(pieceNFTAddress, templateType);

      const template = await templateRegistry.templates(1);
      expect(template.nftContract).to.equal(pieceNFTAddress);
      expect(template.templateType).to.equal(templateType);
      expect(template.status).to.equal(0); // DRAFT (0)
    });

    it("should emit TemplateCreated event on template creation", async function () {
      const templateType = "Test Type";

      await expect(
        templateRegistry.connect(admin).createTemplate(pieceNFTAddress, templateType)
      ).to.emit(templateRegistry, "Template_Created")
       .withArgs(1, templateType, pieceNFTAddress);
    });

    it("should not allow non-TEMPLATE_MANAGER to create a template", async function () {
      const templateType = "Test Type";

      await expect(
        templateRegistry.connect(user1).createTemplate(pieceNFTAddress, templateType)
      ).to.be.revertedWithCustomError(templateRegistry, "Access_NotAuthorized")
       .withArgs(await accessManager.TEMPLATE_MANAGER());
    });
  });

  describe("Attribute Management", function () {
    let templateId: number;
    let attributeKey: string;
    let attribute: any;

    beforeEach(async function () {
      const templateType = "Test Type";
      await templateRegistry.connect(admin).createTemplate(pieceNFTAddress, templateType);
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

    it("should revert when getting an attribute with an invalid key");
  });

  describe("Document Management", function () {
    it("should allow TEMPLATE_MANAGER to add a document to a template");
    it("should not allow non-TEMPLATE_MANAGER to add a document");
    it("should revert when adding a document to a non-existent template");
    it("should store and return correct document data");
    it("should revert when getting a document with an invalid key");
  });

  describe("Template Activation/Deactivation", function () {
    it("should allow TEMPLATE_MANAGER to activate a template in DRAFT status");
    it("should emit TemplateActivated event on activation");
    it("should not allow non-TEMPLATE_MANAGER to activate a template");
    it("should revert when activating a non-existent template");
    it("should revert when activating a template not in DRAFT status");

    it("should allow TEMPLATE_MANAGER to deactivate a template in ACTIVE status");
    it("should emit TemplateDeactivated event on deactivation");
    it("should not allow non-TEMPLATE_MANAGER to deactivate a template");
    it("should revert when deactivating a non-existent template");
    it("should revert when deactivating a template not in ACTIVE status");
  });

  describe("Getters", function () {
    it("should return correct template data from getTemplate");
    it("should revert when getting a non-existent template");
    it("should return correct attribute data from getAttribute");
    it("should return correct document data from getDocument");
  });

  describe("Attribute Validation", function () {
    it("should validate enum attribute with allowed value");
    it("should revert when validating enum attribute with disallowed value");
    it("should validate number attribute with valid number");
    it("should revert when validating number attribute with invalid number");
    it("should validate boolean attribute with 'true' or 'false'");
    it("should revert when validating boolean attribute with invalid value");
    it("should revert when validating attribute for non-existent template");
    it("should revert when validating attribute with invalid key");
  });

  describe("Document Validation", function () {
    it("should validate document with allowed mime type");
    it("should revert when validating document with disallowed mime type");
    it("should revert when validating document for non-existent template");
    it("should revert when validating document with invalid key");
  });
});
