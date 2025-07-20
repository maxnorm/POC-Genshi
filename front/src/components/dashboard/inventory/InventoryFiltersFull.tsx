import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface InventoryFiltersProps {
  filters?: {
    type: 'all' | 'equipment' | 'assembly' | 'piece';
    status: 'all' | 'active' | 'inactive' | 'audit' | 'maintenance';
    template: 'all' | string;
    search: string;
  };
  onTypeChange?: (type: string) => void;
  onStatusChange?: (status: string) => void;
  onTemplateChange?: (template: string) => void;
  onSearchChange?: (search: string) => void;
  onClearFilters?: () => void;
}

function InventoryFiltersFull({
  filters = {
    type: 'all',
    status: 'all',
    template: 'all',
    search: ''
  },
  onTypeChange = () => {},
  onStatusChange = () => {},
  onTemplateChange = () => {},
  onSearchChange = () => {},
  onClearFilters = () => {},
}: InventoryFiltersProps) {
  const hasActiveFilters = filters.type !== 'all' || filters.status !== 'all' || filters.template !== 'all' || filters.search;

  const activeFilterStyle = "inline-flex items-center gap-1 px-4 py-1 bg-genshi-blue/50 text-genshi-blue-secondary text-xs rounded-full";
  const activeFilterXStyle = "h-3 w-3 hover:h-4 hover:w-4 transition-all duration-200 hover:text-genshi-blue-secondary";

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">{"Filtres d'inventaire"}</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            {"Effacer les filtres"}
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={"Rechercher par ID, nom ou attributs..."}
            value={filters.search || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select
          value={filters.type || "all"}
          onValueChange={(value) => onTypeChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{"Tous les types"}</SelectItem>
            <SelectItem value="equipment">{"Équipements"}</SelectItem>
            <SelectItem value="assembly">{"Assemblages"}</SelectItem>
            <SelectItem value="piece">{"Pièces"}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status || "all"}
          onValueChange={(value) => onStatusChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{"Tous les statuts"}</SelectItem>
            <SelectItem value="active">{"Actif"}</SelectItem>
            <SelectItem value="inactive">{"Inactif"}</SelectItem>
            <SelectItem value="audit">{"En audit"}</SelectItem>
            <SelectItem value="maintenance">{"En maintenance"}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.template || "all"}
          onValueChange={(value) => onTemplateChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Modèle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{"Tous les modèles"}</SelectItem>
            <SelectItem value="pressure_vessel">{"Récipient sous pression"}</SelectItem>
            <SelectItem value="valve">{"Soupape"}</SelectItem>
            <SelectItem value="pipe">{"Tuyau"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.type !== 'all' && (
            <div className={activeFilterStyle}>
              {"Type: " + filters.type}
              <button
                onClick={() => onTypeChange('all')}
                className="ml-1"
              >
                <X className={activeFilterXStyle} />
              </button>
            </div>
          )}
          {filters.status !== 'all' && (
            <div className={activeFilterStyle}>
              {"Statut: " + filters.status}
              <button
                onClick={() => onStatusChange('all')}
                className="ml-1"
              >
                <X className={activeFilterXStyle} />
              </button>
            </div>
          )}
          {filters.template !== 'all' && (
            <div className={activeFilterStyle}>
              {"Modèle: " + filters.template}
              <button
                onClick={() => onTemplateChange('all')}
                className="ml-1"
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
                className="ml-1"
              >
                <X className={activeFilterXStyle} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InventoryFiltersFull;   