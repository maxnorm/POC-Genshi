import { getNetworkConfig } from "@/lib/networkConfig";

const { contractsAddresses } = getNetworkConfig()

export const pieceNFTAddress = contractsAddresses?.pieceNFT as `0x${string}`
export const pieceNFTABI = []