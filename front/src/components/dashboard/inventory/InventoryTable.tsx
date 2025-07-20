import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Eye, 
  Edit, 
  MoreHorizontal, 
  Filter,
  Plus,
  FileWarning
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import InventoryFiltersFull from "@/components/dashboard/inventory/InventoryFiltersFull";
import InventoryFiltersBadgeOnly from "@/components/dashboard/inventory/InventoryFiltersBadgeOnly";
import useInventoryFilter from "@/hooks/inventory/useInventoryFilter";
import { useInventory } from "@/contexts/useInventory";
import { NFTItem } from "@/lib/types/NFTItem";
import AddNftDialog from "@/components/dashboard/inventory/AddNftDialog";
import { useUser } from "@/contexts/useUser";

function InventoryTable() {
  const [openFilters, setOpenFilters] = useState(false);
  const { inventory } = useInventory();
  const { filteredInventory, filters, setFilters } = useInventoryFilter(inventory);
  const { hasMintRole } = useUser();

  const getStatusBadge = (status: string) => {
    return (
      <span className={cn("inline-block shadow-sm text-xs text-white font-bold px-4 py-1 rounded-full",
        status === "active" && "bg-green",
        status === "inactive" && "bg-red",)}>
        {status === 'active' ? 'Actif' :
          status === 'inactive' ? 'Inactif' :
          status === 'audit' ? 'En audit' :
          status === 'maintenance' ? 'Maintenance' :
          ''}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Inventaire ({filteredInventory.length})</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={"genshiSimple"} size={"sm"} 
            className={cn(
              "px-12 hover:text-genshi-blue-secondary",
              openFilters && "bg-genshi-blue-secondary text-genshi-blue"
            )}
            onClick={() => {
              setOpenFilters(!openFilters);
            }}
          >
            <Filter className="h-4 w-4" />
            {openFilters ? "Masquer les filtres" : "Filtres"}
          </Button>
          {hasMintRole() && (
            <AddNftDialog />
          )}
        </div>
      </CardHeader>

      <div className="mx-4">
      {openFilters ? (
        <InventoryFiltersFull
          filters={filters}
          onTypeChange={(type: string) => setFilters(prev => ({ ...prev, type: type as 'all' | 'equipment' | 'assembly' | 'piece' }))}
          onStatusChange={(status: string) => setFilters(prev => ({ ...prev, status: status as 'all' | 'active' | 'inactive' | 'audit' | 'maintenance' }))}
          onTemplateChange={(template: string) => setFilters(prev => ({ ...prev, template }))}
          onSearchChange={(search: string) => setFilters(prev => ({ ...prev, search }))}
        />    
      ) : (
        <InventoryFiltersBadgeOnly
          filters={filters}
          onTypeChange={(type: string) => setFilters(prev => ({ ...prev, type: type as 'all' | 'equipment' | 'assembly' | 'piece' }))}
          onStatusChange={(status: string) => setFilters(prev => ({ ...prev, status: status as 'all' | 'active' | 'inactive' | 'audit' | 'maintenance' }))}
          onTemplateChange={(template: string) => setFilters(prev => ({ ...prev, template }))}
          onSearchChange={(search: string) => setFilters(prev => ({ ...prev, search }))}
        />
      )}
      </div>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Modèle</TableHead>
              <TableHead>Dernière mise à jour</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  <div className="text-md text-gray-500 flex items-center justify-center gap-2 py-4">
                    <FileWarning className="w-4 h-4 " />
                    Aucun NFT en inventaire
                  </div>
                </TableCell>
              </TableRow>
            )}
            {filteredInventory.map((item: NFTItem) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm">#{item.id}</TableCell>
                  <TableCell className="font-medium">{item.name || `${item.type} #${item.id}`}</TableCell>
                  <TableCell>
                    {item.type}
                  </TableCell>
                  <TableCell>{item.status ? getStatusBadge(item.status) : '-'}</TableCell>
                  <TableCell>{item.templateName || '-'}</TableCell>
                  <TableCell>
                    {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString('fr-FR') : '-'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default InventoryTable;