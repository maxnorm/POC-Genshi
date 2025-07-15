import { ethers } from "hardhat";
import { expect } from "chai";

describe("ChildValidatorExtension", function () {
  let childValidatorExtension: any;
  let owner: any;
  let user1: any;
  let user2: any;
  let tokenId: any;
  let sampleERC721_1: any;
  let sampleERC721_2: any;
  let parentContract: any;

  
  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const SampleERC721_1 = await ethers.getContractFactory("SampleERC721");
    sampleERC721_1 = await SampleERC721_1.deploy();
    await sampleERC721_1.waitForDeployment();

    const SampleERC721_2 = await ethers.getContractFactory("SampleERC721");
    sampleERC721_2 = await SampleERC721_2.deploy();
    await sampleERC721_2.waitForDeployment();

    const allowedChildren = [sampleERC721_1.target, sampleERC721_2.target];

    const ParentContract = await ethers.getContractFactory("SampleParentWithChildValidator");
    parentContract = await ParentContract.deploy(allowedChildren);
    await parentContract.waitForDeployment();

    const mintTx = await parentContract.mint();
    const receipt = await mintTx.wait();
    tokenId = receipt.logs[0].args[2];
  });

  describe("Child Contract Validation", function () {
    it("should allow validation of permitted child contract", async function () {
      await expect(parentContract.validateChildContract(sampleERC721_1.target)).to.not.be.reverted;
    });
    it("should revert when validating non-permitted child contract", async function () {
      const SampleERC721 = await ethers.getContractFactory("SampleERC721");
      const notAllowedContract = await SampleERC721.deploy();
      await notAllowedContract.waitForDeployment();

      await expect(parentContract.validateChildContract(notAllowedContract.target))
        .to.be.revertedWithCustomError(parentContract, "ChildContractNotAllowed")
        .withArgs(notAllowedContract.target);
    });
    it("should handle multiple allowed child contracts", async function () {
      await expect(parentContract.validateChildContract(sampleERC721_1.target)).to.not.be.reverted;
      await expect(parentContract.validateChildContract(sampleERC721_2.target)).to.not.be.reverted;
    });
    it("should handle empty allowed children list", async function () {
      const ParentContract = await ethers.getContractFactory("SampleParentWithChildValidator");
      const parentContract = await ParentContract.deploy([]);
      await parentContract.waitForDeployment();

      await expect(parentContract.validateChildContract(sampleERC721_1.target)).to.be.reverted;
    });
  });
});
