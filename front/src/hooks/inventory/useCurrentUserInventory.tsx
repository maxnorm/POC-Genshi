import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { InventoryNFTs } from "@/lib/types/InventoryNFTs";

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
  
  useEffect(() => {
    if (!address || !publicClient) {
      setInventoryNFTs(defaultInventoryNFTs);
      return;
    }
  }, [address, publicClient]);

  return {
    inventoryNFTs,
  };
}

export default useCurrentUserInventory;