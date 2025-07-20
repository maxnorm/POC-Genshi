import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTemplate } from "@/contexts/useTemplate";
import AddTemplateDialog from "./AddTemplateDialog";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import useTemplateFilter from "@/hooks/templates/useTemplateFilter";
import TemplateFiltersFull   from "./TemplateFiltersFull";
import TemplateFiltersBadgeOnly from "./TemplateFiltersBadgeOnly";
import { Filter } from "lucide-react";

function TemplateTable() {
  const { templates } = useTemplate();
  const {
    isOpen: openFilters,
    setIsOpen: setOpenFilters,
    filteredTemplates,
    filters,
    setTypeFilter,
    setStatusFilter,
    setSearchFilter,
    clearFilters,
  } = useTemplateFilter(templates);

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Modèles ({filteredTemplates.length})</h2>
        </div>
        <div className="flex items-center gap-4">
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
          <AddTemplateDialog />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {openFilters ? (
          <TemplateFiltersFull
            filters={filters}
            onTypeChange={setTypeFilter}
            onStatusChange={setStatusFilter}
            onSearchChange={setSearchFilter}
            onClearFilters={clearFilters}
          />
        ) : (
          <TemplateFiltersBadgeOnly
            filters={filters}
            onTypeChange={setTypeFilter}
            onStatusChange={setStatusFilter}
            onSearchChange={setSearchFilter}
            onClearFilters={clearFilters}
          />
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{"ID"}</TableHead>
              <TableHead>{"Nom"}</TableHead>
              <TableHead>{"Statut"}</TableHead>
              <TableHead>{"Type NFT"}</TableHead> 
              <TableHead className="text-right">{"Actions"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  {templates.length === 0 ? "Aucun modèle trouvé" : "Aucun modèle ne correspond aux filtres"}
                </TableCell>
              </TableRow>
            ) : (
              filteredTemplates.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell className="w-1/2">
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>
                    {item.type}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant={"genshiSimple"} size={"sm"} className="px-12" asChild>
                      <Link href={`/dashboard/templates/${item.id}`}>
                        {"Modifier"}
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default TemplateTable;