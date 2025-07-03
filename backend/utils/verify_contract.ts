import { run } from "hardhat";

export const verify = async(address: string, args?: any[]): Promise<void> => {
    console.log("Verifying contract...");
    try {
      await run("verify:verify", {
        address: address,
        constructorArguments: args || []
      });
    } catch (e: any) {
      if (e.message.toLowerCase().includes("already verified")) {
        console.log(`This contract is already verified [Address: ${address}]`)
      } else {
        console.log(e);
      }
    }
}