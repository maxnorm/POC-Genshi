import { getNetworkConfig } from "@/lib/networkConfig";

const { contractsAddresses } = getNetworkConfig()

export const accessManagerAddress = contractsAddresses?.accessManager as `0x${string}`
export const accessManagerABI = []