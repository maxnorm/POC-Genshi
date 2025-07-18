import { getNetworkConfig } from "@/lib/networkConfig";

const { contractsAddresses } = getNetworkConfig()

export const assemblyNFTAddress = contractsAddresses?.assemblyNFT as `0x${string}`
export const assemblyNFTABI = []