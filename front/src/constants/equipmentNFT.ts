import { getNetworkConfig } from "@/lib/networkConfig";

const { contractsAddresses } = getNetworkConfig()

export const equipmentNFTAddress = contractsAddresses?.equipmentNFT as `0x${string}`
export const equipmentNFTABI = []