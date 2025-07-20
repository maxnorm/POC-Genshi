import { useEffect, useState, useCallback } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { InventoryNFTs } from "@/lib/types/InventoryNFTs";
import { NFTItem } from "@/lib/types/NFTItem";
import { NFTType } from "@/lib/enums/nftType";
import { pieceNFTABI, pieceNFTAddress } from "@/lib/constants/contracts/pieceNFT";
import { assemblyNFTABI, assemblyNFTAddress } from "@/lib/constants/contracts/assemblyNFT";
import { equipmentNFTABI, equipmentNFTAddress } from "@/lib/constants/contracts/equipmentNFT";

const defaultInventoryNFTs: InventoryNFTs = {
  pieces: [],
  assemblies: [],
  equipment: [],
  all: [],
  totalCount: 0,
  isLoading: true,
  error: null,
  refetch: () => {},
};

/**
 * Hook to get NFT owned by the current user
 * @returns {Object} The owned NFTs
 */
function useCurrentUserInventory() {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const [inventoryNFTs, setInventoryNFTs] = useState<InventoryNFTs>(defaultInventoryNFTs);

  /**
   * Fetch pieces from the PieceNFT contract
   * @returns {Promise<NFTItem[]>} The pieces
   */
  const fetchPieces = async () => {
    const pieces: NFTItem[] = [];
    
    if (pieceNFTAddress) {
      const pieceBalance = await publicClient?.readContract({
        address: pieceNFTAddress,
        abi: pieceNFTABI,
        functionName: 'balanceOf',
        args: [address]
      });

      for (let i = 0; i < Number(pieceBalance); i++) {
        const tokenId = await publicClient?.readContract({
          address: pieceNFTAddress,
          abi: pieceNFTABI,
          functionName: 'tokenOfOwnerByIndex',
          args: [address, BigInt(i)]
        });

        pieces?.push({
          id: Number(tokenId),
          type: NFTType.Piece,
          contractAddress: pieceNFTAddress,
          owner: address || '',
          name: `Pièce #${Number(tokenId)}`,
          templateName: `Pièce #${Number(tokenId)}`
        });
      }
    }

    return pieces;
  }

  /**
   * Fetch assemblies from the AssemblyNFT contract
   * @returns {Promise<NFTItem[]>} The assemblies
   */
  const fetchAssemblies = async () => {
    const assemblies: NFTItem[] = [];
    
    if (assemblyNFTAddress) {
      const assemblyBalance = await publicClient?.readContract({
        address: assemblyNFTAddress,
        abi: assemblyNFTABI,
        functionName: 'balanceOf',
        args: [address]
      });

      for (let i = 0; i < Number(assemblyBalance); i++) {
        const tokenId = await publicClient?.readContract({
          address: assemblyNFTAddress,    
          abi: assemblyNFTABI,
          functionName: 'tokenOfOwnerByIndex',
          args: [address, BigInt(i)]
        });

        assemblies?.push({    
          id: Number(tokenId),
          type: NFTType.Assembly,
          contractAddress: assemblyNFTAddress,
          owner: address || '',
          name: `Assemblage #${Number(tokenId)}`,
          templateName: `Assemblage #${Number(tokenId)}`  
        });
      }
    }

    return assemblies;
  }

  /**
   * Fetch equipment from the EquipmentNFT contract
   * @returns {Promise<NFTItem[]>} The equipment
   */
  const fetchEquipment = async () => {
    const equipment: NFTItem[] = [];
    
    if (equipmentNFTAddress) {
      const equipmentBalance = await publicClient?.readContract({
        address: equipmentNFTAddress,
        abi: equipmentNFTABI,
        functionName: 'balanceOf',
        args: [address]
      });

      for (let i = 0; i < Number(equipmentBalance); i++) {
        const tokenId = await publicClient?.readContract({
          address: equipmentNFTAddress,  
          abi: equipmentNFTABI,
          functionName: 'tokenOfOwnerByIndex',
          args: [address, BigInt(i)]
        });

        equipment?.push({
          id: Number(tokenId),
          type: NFTType.Equipment,
          contractAddress: equipmentNFTAddress,
          owner: address || '',
          name: `Équipement #${Number(tokenId)}`,
          templateName: `Équipement #${Number(tokenId)}`
        });
      }
    }

    return equipment;
  }

  /**
   * Fetch the inventory of the current user
   * @returns {Promise<void>}
   */
  const fetchInventory = useCallback(async () => {
      if (!address || !publicClient) {
      setInventoryNFTs(defaultInventoryNFTs);
      return;
    }

    const pieces = await fetchPieces();
    const assemblies = await fetchAssemblies();
    const equipment = await fetchEquipment();

    setInventoryNFTs({
      pieces,
      assemblies,
      equipment,
      all: [...pieces, ...assemblies, ...equipment],
      totalCount: pieces.length + assemblies.length + equipment.length,
      isLoading: false,
      error: null,
      refetch: () => {},
    });
  }, [address, publicClient]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  
  return {
    inventoryNFTs
  };
}

export default useCurrentUserInventory;