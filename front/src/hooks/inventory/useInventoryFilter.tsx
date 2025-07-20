import { useState, useMemo } from "react";
import { InventoryNFTs } from "@/lib/types/InventoryNFTs";
import { NFTType } from "@/lib/enums/nftType";
import { NFTItem } from "@/lib/types/NFTItem";

export interface FilterOptions {
  type: 'all' | 'equipment' | 'assembly' | 'piece';
  status: 'all' | 'active' | 'inactive' | 'audit' | 'maintenance';
  template: string;
  search: string;
}

function useInventoryFilter(inventory: InventoryNFTs) {
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    status: 'all',
    template: 'all',
    search: ''
  });

  const filteredInventory = useMemo(() => {
    let itemsToFilter: NFTItem[] = inventory.all || [];

    // Filter by type
    if (filters.type !== 'all') {
      const typeMap = {
        'piece': NFTType.Piece,
        'assembly': NFTType.Assembly,
        'equipment': NFTType.Equipment
      } as const;
      itemsToFilter = itemsToFilter.filter(item => item.type === typeMap[filters.type as keyof typeof typeMap]);
    }

    // Filter by status (if items have status property)
    if (filters.status !== 'all') {
      itemsToFilter = itemsToFilter.filter(item => (item as any).status === filters.status);
    }

    // Filter by template
    if (filters.template !== 'all') {
      itemsToFilter = itemsToFilter.filter(item => item.templateName === filters.template);
    }

    // Filter by search
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      itemsToFilter = itemsToFilter.filter(item => 
        item.id.toString().includes(searchTerm) ||
        item.contractAddress.toLowerCase().includes(searchTerm) ||
        (item.templateName && item.templateName.toLowerCase().includes(searchTerm))
      );
    }

    return itemsToFilter;
  }, [inventory.all, filters]);

  return {
    filteredInventory,
    filters,
    setFilters
  };
}

export default useInventoryFilter; 