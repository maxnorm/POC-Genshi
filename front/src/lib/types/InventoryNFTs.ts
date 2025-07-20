import { NFTItem } from "./NFTItem";

export interface InventoryNFTs {
  pieces: NFTItem[];
  assemblies: NFTItem[];
  equipment: NFTItem[];
  all: NFTItem[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}
