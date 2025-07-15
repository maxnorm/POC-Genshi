import { ethers, network } from "hardhat";
import { verify } from "../utils/verify_contract";

async function main(): Promise<void> {
  const AccessManager = await ethers.deployContract("AccessManager");
  const TemplateRegistry = await ethers.deployContract("TemplateRegistry", [AccessManager.target]);

  const PieceNFT = await ethers.deployContract(
    "PieceNFT", 
    [TemplateRegistry.target, AccessManager.target]
  );

  const AssemblyNFT = await ethers.deployContract(
    "AssemblyNFT", 
    [TemplateRegistry.target, AccessManager.target, [PieceNFT.target]]
  );

  const EquipmentNFT = await ethers.deployContract(
    "EquipmentNFT", 
    [TemplateRegistry.target, AccessManager.target, [PieceNFT.target, AssemblyNFT.target]]
  );

  console.log("Deployment in progress...");

  const isLocal = network.name.includes('localhost'); 

  if(!isLocal) {
    console.log("Waiting 3 blocks before verification");
    await AccessManager.deploymentTransaction()?.wait(3);
    await TemplateRegistry.deploymentTransaction()?.wait(3);
    await PieceNFT.deploymentTransaction()?.wait(3);
    await AssemblyNFT.deploymentTransaction()?.wait(3);
    await EquipmentNFT.deploymentTransaction()?.wait(3);
  }
  
  console.log("✅ Deployment complete!");
  console.log("AccessManager deployed to:", AccessManager.target);
  console.log("TemplateRegistry deployed to:", TemplateRegistry.target);
  console.log("PieceNFT deployed to:", PieceNFT.target);
  console.log("AssemblyNFT deployed to:", AssemblyNFT.target);
  console.log("EquipmentNFT deployed to:", EquipmentNFT.target);

  if(!isLocal) {
    await verify(AccessManager.target.toString())
    await verify(TemplateRegistry.target.toString(), [AccessManager.target])
    await verify(PieceNFT.target.toString(), [TemplateRegistry.target, AccessManager.target])
    await verify(
      AssemblyNFT.target.toString(), 
      [TemplateRegistry.target, AccessManager.target, [PieceNFT.target]]
    )
    await verify(
      EquipmentNFT.target.toString(), 
      [TemplateRegistry.target, AccessManager.target, [PieceNFT.target, AssemblyNFT.target]]
    )
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});