import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { NFTType } from "@/lib/enums/nftType";
import { TemplateStatus, FilterOptions } from "@/hooks/useTemplateFilter";
import { useState } from "react";

interface TemplateFiltersProps {
  filters: FilterOptions;
  onTypeChange: (type: NFTType | null) => void;
  onStatusChange: (status: TemplateStatus | null) => void;
  onSearchChange: (search: string) => void;
  onClearFilters: () => void;
}

function TemplateFiltersFull({
  filters,
  onTypeChange,
  onStatusChange,
  onSearchChange,
  onClearFilters,
}: TemplateFiltersProps) {
  const hasActiveFilters = filters.type || filters.status !== null || filters.search;

  const activeFilterStyle = "inline-flex items-center gap-1 px-4 py-1 bg-genshi-blue/50 text-genshi-blue-secondary text-xs rounded-full";
  const activeFilterXStyle = "h-3 w-3 hover:h-4 hover:w-4 transition-all duration-200 hover:text-genshi-blue-secondary";

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Filtres</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par nom ou ID..."
            value={filters.search || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={filters.type || "all"}
            onValueChange={(value) => onTypeChange(value === "all" ? null : (value as NFTType))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type de NFT" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value={NFTType.Piece}>{NFTType.Piece}</SelectItem>
              <SelectItem value={NFTType.Assembly}>{NFTType.Assembly}</SelectItem>
              <SelectItem value={NFTType.Equipment}>{NFTType.Equipment}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status?.toString() || "all"}
            onValueChange={(value) => onStatusChange(value === "all" ? null : parseInt(value) as TemplateStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="0">Brouillon</SelectItem>
              <SelectItem value="1">Actif</SelectItem>
              <SelectItem value="2">Inactif</SelectItem>
            </SelectContent>
          </Select>
        
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Effacer les filtres
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.type && (
            <div className={activeFilterStyle}>
              Type: {filters.type}
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
              Statut: {filters.status === 0 ? "Brouillon" : filters.status === 1 ? "Actif" : "Inactif"}
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
              Recherche: "{filters.search}"
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

export default TemplateFiltersFull; 