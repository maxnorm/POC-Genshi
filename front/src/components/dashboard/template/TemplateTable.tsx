import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTemplate } from "@/contexts/useTemplate";
import AddTemplateDialog from "./AddTemplateDialog";

function TemplateTable() {
  const { templates: data } = useTemplate();

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex gap-2">
          <Button variant={"genshi"} size={"sm"}>
            Pièce
          </Button>
          <Button size={"sm"}>
            Assemblage
          </Button>
          <Button size={"sm"}>
            Équipement
          </Button>
        </div>
        <AddTemplateDialog />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>Aucun modèles trouvé</TableCell>
              </TableRow>
            ) : (
              data.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <span className={cn("inline-block shadow-sm text-white text-xs font-bold px-4 py-1 rounded-full",
                      item.status === 0 && "bg-genshi-blue-secondary/50",
                      item.status === 1 && "bg-green",
                      item.status === 2 && "bg-red",
                    )}>
                      {item.status === 0 ? "Brouillon" : 
                       item.status === 1 ? "Actif" : 
                       item.status === 2 ? "Désactivé" : "Inconnu"}
                    </span>
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <Button variant={"genshiSimple"} size={"sm"} className="px-12">
                      Modifier
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