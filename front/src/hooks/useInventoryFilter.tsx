import { useState, useMemo } from "react";

export interface InventoryItem {
  id: number;
  type: 'equipment' | 'assembly' | 'piece';
  name: string;
  status: 'active' | 'inactive' | 'audit' | 'maintenance';
  templateId: number;
  templateName: string;
  children?: InventoryItem[];
  attributes: Record<string, any>;
  documents: any[];
  createdAt: Date;
  lastUpdated: Date;
}

export interface FilterOptions {
  type: 'all' | 'equipment' | 'assembly' | 'piece';
  status: 'all' | 'active' | 'inactive' | 'audit' | 'maintenance';
  template: 'all' | string;
  search: string;
}

function useInventoryFilter(inventory: InventoryItem[]) {
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    status: 'all',
    template: 'all',
    search: ''
  });

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      if (filters.type !== 'all' && item.type !== filters.type) {
        return false;
      }

      if (filters.status !== 'all' && item.status !== filters.status) {
        return false;
      }

      if (filters.template !== 'all' && item.templateName !== filters.template) {
        return false;
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          item.name.toLowerCase().includes(searchTerm) ||
          item.id.toString().includes(searchTerm) ||
          item.templateName.toLowerCase().includes(searchTerm);
        
        if (!matchesSearch) {
          return false;
        }
      }

      return true;
    });
  }, [inventory, filters]);

  return {
    filteredInventory,
    filters,
    setFilters
  };
}

export default useInventoryFilter; 