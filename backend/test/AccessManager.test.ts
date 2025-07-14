import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("AccessManager", function () {
  let accessManager: any;
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
  });

  describe("Role Management (Grant/Revoke)", function () {
    it("should allow admin to grant roles", async function () {
      await accessManager.grantRole(await accessManager.PIECE_MANAGER(), user1.address);
      expect(await accessManager.hasRole(await accessManager.PIECE_MANAGER(), user1.address)).to.be.true;

      await expect(accessManager.connect(user1).grantRole(await accessManager.PIECE_MINTER(), user2.address))
      expect(await accessManager.hasRole(await accessManager.PIECE_MINTER(), user2.address)).to.be.true;
    });

    it("should allow admin to revoke roles", async function () {
      await accessManager.grantRole(await accessManager.PIECE_MANAGER(), user1.address);
      expect(await accessManager.hasRole(await accessManager.PIECE_MANAGER(), user1.address)).to.be.true;

      await expect(accessManager.revokeRole(await accessManager.PIECE_MANAGER(), user1.address))
      expect(await accessManager.hasRole(await accessManager.PIECE_MANAGER(), user1.address)).to.be.false;
    });

    it("should not allow non-admin to grant roles", async function () {
      await expect(
        accessManager.connect(user1).grantRole(await accessManager.PIECE_MANAGER(), user2.address)
      ).to.be.revertedWithCustomError(accessManager, "AccessControlUnauthorizedAccount")
       .withArgs(user1.address, await accessManager.DEFAULT_ADMIN_ROLE());
    });

    it("should not allow non-admin to revoke roles", async function () {
      await expect(
        accessManager.connect(user1).revokeRole(await accessManager.PIECE_MANAGER(), user2.address)
      ).to.be.revertedWithCustomError(accessManager, "AccessControlUnauthorizedAccount")
      .withArgs(user1.address, await accessManager.DEFAULT_ADMIN_ROLE());
    });

    it("should not allow granting the same role twice", async function () {
      await accessManager.grantRole(await accessManager.PIECE_MANAGER(), user1.address);

      await expect(
        accessManager.grantRole(await accessManager.PIECE_MANAGER(), user1.address)
      ).to.not.emit(accessManager, "RoleGranted");

      expect(await accessManager.hasRole(await accessManager.PIECE_MANAGER(), user1.address)).to.be.true;
    });

    it("should not allow revoking a role that is not assigned", async function () {
      await expect(
        accessManager.revokeRole(await accessManager.PIECE_MANAGER(), user1.address)
      ).to.not.emit(accessManager, "RoleRevoked");
    
      expect(await accessManager.hasRole(await accessManager.PIECE_MANAGER(), user1.address)).to.be.false;
    });
  });

  describe("Events", function () {
    it("should emit events on role grant", async function () {
      await expect(
        accessManager.grantRole(await accessManager.PIECE_MANAGER(), user1.address)
      ).to.emit(accessManager, "RoleGranted").withArgs(
        await accessManager.PIECE_MANAGER(),
        user1.address,
        admin.address
      );
    });
    it("should emit events on role revoke", async function () {
      await accessManager.grantRole(await accessManager.PIECE_MANAGER(), user1.address);

      await expect(
        accessManager.revokeRole(await accessManager.PIECE_MANAGER(), user1.address)
      ).to.emit(accessManager, "RoleRevoked").withArgs(
        await accessManager.PIECE_MANAGER(),
        user1.address,
        admin.address
      );
    });
  });

  describe("Role Enforcement (AccessManaged Extension)", function () {
    let erc721AccessManaged: any;

    beforeEach(async function () {
      const SampleERC721AccessManaged = await ethers.getContractFactory("SampleERC721AccessManaged");
      erc721AccessManaged = await SampleERC721AccessManaged.deploy(accessManager.getAddress());
      await erc721AccessManaged.waitForDeployment();

      await accessManager.grantRole(await accessManager.PIECE_MANAGER(), admin.address);
      await accessManager.grantRole(await accessManager.PIECE_MINTER(), user1.address);
    });

    it("should allow minting if the caller has the PIECE_MINTER role", async function () {
      await erc721AccessManaged.connect(user1).mint(user1.address);
      expect(await erc721AccessManaged.ownerOf(1)).to.equal(user1.address);
    });

    it("should revert with Access_NotAuthorized if caller does not have PIECE_MINTER role", async function () {
      await expect(
        erc721AccessManaged.connect(user2).mint(user2.address)
      ).to.be.revertedWithCustomError(erc721AccessManaged, "Access_NotAuthorized");
    });
  });

  describe("Role Combinations Constraints", function () {
    beforeEach(async function () {
      await accessManager.grantRole(await accessManager.PIECE_MANAGER(), admin.address);
      await accessManager.grantRole(await accessManager.ASSEMBLY_MANAGER(), admin.address);
      await accessManager.grantRole(await accessManager.EQUIPMENT_MANAGER(), admin.address);
    });

    it("should allow granting PIECE_AUDITOR if account does not have PIECE_MINTER", async function () {
      await expect(
        accessManager.grantRole(await accessManager.PIECE_AUDITOR(), user1.address)
      ).to.emit(accessManager, "RoleGranted")
       .withArgs(await accessManager.PIECE_AUDITOR(), user1.address, admin.address);

      expect(await accessManager.hasRole(await accessManager.PIECE_AUDITOR(), user1.address)).to.be.true;
    });

    it("should revert when granting PIECE_AUDITOR to account with PIECE_MINTER", async function () {
      await accessManager.grantRole(await accessManager.PIECE_MINTER(), user1.address);

      await expect(
        accessManager.grantRole(await accessManager.PIECE_AUDITOR(), user1.address)
      ).to.be.revertedWithCustomError(accessManager, "Access_InvalidRoleCombination")
      .withArgs(user1.address, await accessManager.PIECE_AUDITOR());
    });

    it("should allow granting ASSEMBLY_AUDITOR if account does not have ASSEMBLY_MINTER", async function () {
      await expect(
        accessManager.grantRole(await accessManager.ASSEMBLY_AUDITOR(), user1.address)
      ).to.emit(accessManager, "RoleGranted")
       .withArgs(await accessManager.ASSEMBLY_AUDITOR(), user1.address, admin.address);

      expect(await accessManager.hasRole(await accessManager.ASSEMBLY_AUDITOR(), user1.address)).to.be.true;
    });
    it("should revert when granting ASSEMBLY_AUDITOR to account with ASSEMBLY_MINTER", async function () {
      await accessManager.grantRole(await accessManager.ASSEMBLY_MINTER(), user1.address);

      await expect(
        accessManager.grantRole(await accessManager.ASSEMBLY_AUDITOR(), user1.address)
      ).to.be.revertedWithCustomError(accessManager, "Access_InvalidRoleCombination")
      .withArgs(user1.address, await accessManager.ASSEMBLY_AUDITOR());
    });

    it("should allow granting EQUIPMENT_AUDITOR if account does not have EQUIPMENT_MINTER", async function () {
      await expect(
        accessManager.grantRole(await accessManager.EQUIPMENT_AUDITOR(), user1.address)
      ).to.emit(accessManager, "RoleGranted")
       .withArgs(await accessManager.EQUIPMENT_AUDITOR(), user1.address, admin.address);

      expect(await accessManager.hasRole(await accessManager.EQUIPMENT_AUDITOR(), user1.address)).to.be.true;
    });
    it("should revert when granting EQUIPMENT_AUDITOR to account with EQUIPMENT_MINTER", async function () {
      await accessManager.grantRole(await accessManager.EQUIPMENT_MINTER(), user1.address);

      await expect(
        accessManager.grantRole(await accessManager.EQUIPMENT_AUDITOR(), user1.address)
      ).to.be.revertedWithCustomError(accessManager, "Access_InvalidRoleCombination")
      .withArgs(user1.address, await accessManager.EQUIPMENT_AUDITOR());
    });

    it("should allow granting PIECE_VALIDATOR if account does not have PIECE_AUDITOR", async function () {
      await expect(
        accessManager.grantRole(await accessManager.PIECE_VALIDATOR(), user1.address)
      ).to.emit(accessManager, "RoleGranted")
       .withArgs(await accessManager.PIECE_VALIDATOR(), user1.address, admin.address);

      expect(await accessManager.hasRole(await accessManager.PIECE_VALIDATOR(), user1.address)).to.be.true;
    }); 
    it("should revert when granting PIECE_VALIDATOR to account with PIECE_AUDITOR", async function () {
      await accessManager.grantRole(await accessManager.PIECE_AUDITOR(), user1.address);

      await expect(
        accessManager.grantRole(await accessManager.PIECE_VALIDATOR(), user1.address)
      ).to.be.revertedWithCustomError(accessManager, "Access_InvalidRoleCombination")
      .withArgs(user1.address, await accessManager.PIECE_VALIDATOR());
    });

    it("should allow granting ASSEMBLY_VALIDATOR if account does not have ASSEMBLY_AUDITOR", async function () {
      await expect(
        accessManager.grantRole(await accessManager.ASSEMBLY_VALIDATOR(), user1.address)
      ).to.emit(accessManager, "RoleGranted")
       .withArgs(await accessManager.ASSEMBLY_VALIDATOR(), user1.address, admin.address);

      expect(await accessManager.hasRole(await accessManager.ASSEMBLY_VALIDATOR(), user1.address)).to.be.true;
    });
    it("should revert when granting ASSEMBLY_VALIDATOR to account with ASSEMBLY_AUDITOR", async function () {
      await accessManager.grantRole(await accessManager.ASSEMBLY_AUDITOR(), user1.address);

      await expect(
        accessManager.grantRole(await accessManager.ASSEMBLY_VALIDATOR(), user1.address)
      ).to.be.revertedWithCustomError(accessManager, "Access_InvalidRoleCombination")
      .withArgs(user1.address, await accessManager.ASSEMBLY_VALIDATOR());
    });

    it("should allow granting EQUIPMENT_VALIDATOR if account does not have EQUIPMENT_AUDITOR", async function () {
      await expect(
        accessManager.grantRole(await accessManager.EQUIPMENT_VALIDATOR(), user1.address)
      ).to.emit(accessManager, "RoleGranted")
       .withArgs(await accessManager.EQUIPMENT_VALIDATOR(), user1.address, admin.address);

      expect(await accessManager.hasRole(await accessManager.EQUIPMENT_VALIDATOR(), user1.address)).to.be.true;
    });
    it("should revert when granting EQUIPMENT_VALIDATOR to account with EQUIPMENT_AUDITOR", async function () {
      await accessManager.grantRole(await accessManager.EQUIPMENT_AUDITOR(), user1.address);

      await expect(
        accessManager.grantRole(await accessManager.EQUIPMENT_VALIDATOR(), user1.address)
      ).to.be.revertedWithCustomError(accessManager, "Access_InvalidRoleCombination")
      .withArgs(user1.address, await accessManager.EQUIPMENT_VALIDATOR());
    });
  }); 
});