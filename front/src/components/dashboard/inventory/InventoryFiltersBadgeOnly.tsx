import { X } from "lucide-react";

interface InventoryFiltersBadgeOnlyProps {
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

function InventoryFiltersBadgeOnly({
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
}: InventoryFiltersBadgeOnlyProps) {
  const hasActiveFilters = filters.type !== 'all' || filters.status !== 'all' || filters.template !== 'all' || filters.search;

  const activeFilterStyle = "inline-flex items-center gap-1 px-4 py-1 bg-genshi-blue/50 text-genshi-blue-secondary text-xs rounded-full";
  const activeFilterXStyle = "h-3 w-3 hover:h-4 hover:w-4 transition-all duration-200 hover:text-genshi-blue-secondary";

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border">
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
      
      <button
        onClick={onClearFilters}
        className="text-gray-500 hover:text-gray-700 text-sm"
      >
        <X className="h-4 w-4 mr-1 inline" />
        {"Effacer"}
      </button>
    </div>
  );
}

export default InventoryFiltersBadgeOnly; 