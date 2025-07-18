
import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();


async function main(): Promise<void> {
  const [deployer] = await ethers.getSigners();

  const ACCESS_MANAGER_ADDRESS = process.env.ACCESS_MANAGER_ADDRESS;

  if (!ACCESS_MANAGER_ADDRESS) {
    throw new Error("ACCESS_MANAGER_ADDRESS is not set");
  }
  
  const accessManager = await ethers.getContractAt("AccessManager", ACCESS_MANAGER_ADDRESS);

  console.log("Granting all access roles...");
  console.warn("⚠️  Warning: This will grant all roles to the deployer address. This is not recommended for production. ⚠️");

  const roles = [
    "PIECE_MANAGER",
    "PIECE_MINTER",
    "PIECE_AUDITOR",
    "PIECE_VALIDATOR",
    "PIECE_DOCUMENT_MANAGER",
    "ASSEMBLY_MANAGER",
    "ASSEMBLY_MINTER",
    "ASSEMBLY_AUDITOR",
    "ASSEMBLY_VALIDATOR",
    "ASSEMBLY_DOCUMENT_MANAGER",
    "EQUIPMENT_MANAGER",
    "EQUIPMENT_MINTER",
    "EQUIPMENT_AUDITOR",
    "EQUIPMENT_VALIDATOR",
    "EQUIPMENT_DOCUMENT_MANAGER",
    "REGULATOR",
  ];

  for (const role of roles) {
    const roleHash = ethers.keccak256(ethers.toUtf8Bytes(role));
    await accessManager.grantRole(roleHash, deployer.address);
    console.log(`Granted ${role} role to ${deployer.address}`);
  }

  console.log("✅ All roles granted successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});