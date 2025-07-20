import { useState, useMemo } from "react";
import { NFTType } from "@/lib/enums/nftType";

export type TemplateStatus = 0 | 1 | 2; // DRAFT | ACTIVE | INACTIVE

export interface Template {
  id: number;
  name: string;
  type: NFTType;
  nftContract: string;
  status: TemplateStatus;
  createdAt: number;
}

export interface FilterOptions {
  type?: NFTType | null;
  status?: TemplateStatus | null;
  search?: string;
}

/**
 * Hook to filter templates based on various criteria
 * @param templates - Array of templates to filter
 * @returns {Object} Filtered templates and filter controls
 */
function useTemplateFilter(templates: Template[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    type: null,
    status: null,
    search: "",
  });

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      if (filters.type && template.type !== filters.type) {
        return false;
      }

      if (filters.status !== null && template.status !== filters.status) {
        return false;
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const templateName = template.name.toLowerCase();
        const templateId = template.id.toString();
        
        if (!templateName.includes(searchTerm) && !templateId.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }, [templates, filters]);

  const setTypeFilter = (type: NFTType | null) => {
    setFilters(prev => ({ ...prev, type }));
  };

  const setStatusFilter = (status: TemplateStatus | null) => {
    setFilters(prev => ({ ...prev, status }));
  };

  const setSearchFilter = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const clearFilters = () => {
    setFilters({
      type: null,
      status: null,
      search: "",
    });
  };

  return {
    isOpen,
    setIsOpen,
    filteredTemplates,
    filters,
    setTypeFilter,
    setStatusFilter,
    setSearchFilter,
    clearFilters,
  };
}

export default useTemplateFilter; 