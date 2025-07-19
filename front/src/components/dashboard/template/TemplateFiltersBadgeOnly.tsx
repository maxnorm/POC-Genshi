import { X } from "lucide-react";
import { NFTType } from "@/lib/enums/nftType";
import { TemplateStatus, FilterOptions } from "@/hooks/useTemplateFilter";

interface TemplateFiltersProps {
  filters: FilterOptions;
  onTypeChange: (type: NFTType | null) => void;
  onStatusChange: (status: TemplateStatus | null) => void;
  onSearchChange: (search: string) => void;
  onClearFilters: () => void;
}

function TemplateFiltersBadgeOnly({
  filters,
  onTypeChange,
  onStatusChange,
  onSearchChange,
}: TemplateFiltersProps) {
  const hasActiveFilters = filters.type || filters.status !== null || filters.search;

  const activeFilterStyle = "inline-flex items-center gap-1 px-4 py-1 bg-genshi-blue/50 text-genshi-blue-secondary text-xs rounded-full";
  const activeFilterXStyle = "h-3 w-3 hover:h-4 hover:w-4 transition-all duration-200 hover:text-genshi-blue-secondary";

  return (
    <div className="flex flex-wrap gap-2">
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.type && (
            <div className={activeFilterStyle}>
              {"Type: " + filters.type}
              <button
                onClick={() => onTypeChange(null)}
                className="ml-1 "
              >
                <X className={activeFilterXStyle} />
              </button>
            </div>
          )}
          {filters.status !== null && (
            <div className={activeFilterStyle}>
              {"Statut: " + (filters.status === 0 ? "Brouillon" : filters.status === 1 ? "Actif" : "Inactif")}
              <button
                onClick={() => onStatusChange(null)}
                className="ml-1 "
              >
                <X className={activeFilterXStyle} />
              </button>
            </div>
          )}
          {filters.search && (
            <div className={activeFilterStyle}>
              {"Recherche: " + filters.search}
              <button
                onClick={() => onSearchChange("")}
                className="ml-1 "
              >
                <X className={activeFilterXStyle} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TemplateFiltersBadgeOnly; 