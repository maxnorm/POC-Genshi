import { Contracts } from "./contracts";
import { getNetworkConfig } from "@/lib/networkConfig";

/**
 * Enum to represent the different types of NFTs
 */
export enum NFTType {
  Piece = 'Pièce',
  Assembly = 'Assemblage',
  Equipment = 'Équipement',
  Unknown = 'Inconnu',
}

/**
 * Function to parse the NFT address to the NFT type
 * @param nftContract - The NFT address
 * @returns {NFTType} The NFT type
 */
export function parseNFTAddressToType(nftContract: string) {
  const networkConfig = getNetworkConfig();
  switch (nftContract) {
    case networkConfig?.contractsAddresses?.[Contracts.PieceNFT]:   
      return NFTType.Piece;
    case networkConfig?.contractsAddresses?.[Contracts.AssemblyNFT]:
      return NFTType.Assembly;
    case networkConfig?.contractsAddresses?.[Contracts.EquipmentNFT]:
      return NFTType.Equipment;
    default:
      return NFTType.Unknown;
  }
}

/**
 * Function to parse the NFT type to the NFT address
 * @param nftType - The NFT type
 * @returns {string} The NFT address
 */
export function parseNFTTypeToAddress(nftType: NFTType) {
  const networkConfig = getNetworkConfig();
  switch (nftType) {
    case NFTType.Piece:
      return networkConfig?.contractsAddresses?.[Contracts.PieceNFT];
    case NFTType.Assembly:
      return networkConfig?.contractsAddresses?.[Contracts.AssemblyNFT];
    case NFTType.Equipment:
      return networkConfig?.contractsAddresses?.[Contracts.EquipmentNFT];
    default:
      return null;
  }
}