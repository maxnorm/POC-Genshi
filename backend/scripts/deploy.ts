import { ethers, network } from "hardhat";
import { verify } from "../utils/verify_contract";

async function main(): Promise<void> {
  const Voting = await ethers.deployContract("Voting");

  console.log("Deployment in progress...");

  const isLocal = network.name.includes('localhost'); 

  if(!isLocal) {
    console.log("Waiting 3 blocks before verification");
    await Voting.deploymentTransaction()?.wait(3);
  }
  
  console.log("Contract deployed to:", Voting.target);

  if(!isLocal) {
    await verify(Voting.target.toString())
    console.log("Contract verified with Etherscan");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});