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
  ChevronDown, 
  ChevronRight,
  Settings,
  Layers,
  Package,
  ArrowUpDown,
  Search,
  Filter,
  X,
  Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import InventoryFiltersFull from "@/components/dashboard/inventory/InventoryFiltersFull";
import InventoryFiltersBadgeOnly from "@/components/dashboard/inventory/InventoryFiltersBadgeOnly";
import useInventoryFilter from "@/hooks/useInventoryFilter";

interface InventoryItem {
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

function InventoryTable() {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [sortColumn, setSortColumn] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [openFilters, setOpenFilters] = useState(false);

  // Mock data for demonstration
  const mockData: InventoryItem[] = [
    {
      id: 1,
      type: 'equipment',
      name: 'Réacteur nucléaire R-001',
      status: 'active',
      templateId: 1,
      templateName: 'Réacteur sous pression',
      children: [
        {
          id: 2,
          type: 'assembly',
          name: 'Assemblage de contrôle AC-001',
          status: 'active',
          templateId: 2,
          templateName: 'Assemblage de contrôle',
          children: [
            {
              id: 3,
              type: 'piece',
              name: 'Tige de contrôle TC-001',
              status: 'active',
              templateId: 3,
              templateName: 'Tige de contrôle',
              attributes: {
                'Matériau': 'Bore',
                'Longueur': '4.5m',
                'Diamètre': '12mm'
              },
              documents: [
                { name: 'Certificat de matériau' },
                { name: 'Rapport d\'inspection' }
              ],
              createdAt: new Date('2024-01-15'),
              lastUpdated: new Date('2024-01-20')
            }
          ],
          attributes: {
            'Type': 'Assemblage de contrôle',
            'Nombre de tiges': '2'
          },
          documents: [
            { name: 'Plan d\'assemblage' },
            { name: 'Procédure de montage' }
          ],
          createdAt: new Date('2024-01-10'),
          lastUpdated: new Date('2024-01-20')
        }
      ],
      attributes: {
        'Puissance': '1000 MW',
        'Pression': '15.5 MPa',
        'Température': '315°C'
      },
      documents: [
        { name: 'Certificat de sécurité' },
        { name: 'Manuel d\'exploitation' },
        { name: 'Rapport d\'inspection annuel' }
      ],
      createdAt: new Date('2024-01-01'),
      lastUpdated: new Date('2024-01-30')
    },
    {
      id: 4,
      type: 'assembly',
      name: 'Assemblage de refroidissement AR-001',
      status: 'active',
      templateId: 2,
      templateName: 'Assemblage de refroidissement',
      children: [
        {
          id: 5,
          type: 'piece',
          name: 'Pompe de refroidissement PR-001',
          status: 'maintenance',
          templateId: 4,
          templateName: 'Pompe de refroidissement',
          attributes: {
            'Débit': '500 L/min',
            'Pression': '2.5 MPa'
          },
          documents: [
            { name: 'Certificat de performance' }
          ],
          createdAt: new Date('2024-01-05'),
          lastUpdated: new Date('2024-01-28')
        }
      ],
      attributes: {
        'Type': 'Assemblage de refroidissement',
        'Capacité': '500 L/min'
      },
      documents: [
        { name: 'Plan d\'assemblage' }
      ],
      createdAt: new Date('2024-01-05'),
      lastUpdated: new Date('2024-01-28')
    },
    {
      id: 6,
      type: 'piece',
      name: 'Soupape de sécurité SS-001',
      status: 'active',
      templateId: 5,
      templateName: 'Soupape de sécurité',
      attributes: {
        'Pression d\'ouverture': '16.5 MPa',
        'Diamètre': '50mm'
      },
      documents: [
        { name: 'Certificat de calibration' },
        { name: 'Rapport de test' }
      ],
      createdAt: new Date('2024-01-03'),
      lastUpdated: new Date('2024-01-15')
    }
  ];

  const { filteredInventory, filters, setFilters } = useInventoryFilter(mockData);

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'equipment':
        return <Settings className="w-4 h-4" />;
      case 'assembly':
        return <Layers className="w-4 h-4" />;
      case 'piece':
        return <Package className="w-4 h-4" />;
      default:
        return null;
    }
  };

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
          <Button variant={"genshiSimple"} size={"sm"} 
            className={cn("px-12 hover:text-genshi-blue-secondary")}
            onClick={() => {
              setOpenFilters(!openFilters);
            }}
          >
            <Plus className="h-4 w-4" />
            Créer un nouveau NFT
          </Button> 
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
            {filteredInventory.map((item: InventoryItem) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm">#{item.id}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    {item.type}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{item.templateName}</TableCell>
                  <TableCell>
                    {new Date(item.lastUpdated).toLocaleDateString('fr-FR')}
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