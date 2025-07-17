import { getNetworkConfig } from "@/lib/networkConfig";

const { contractsAddresses } = getNetworkConfig()

export const templateRegistryAddress = contractsAddresses?.templateRegistry as `0x${string}`
export const templateRegistryABI = []