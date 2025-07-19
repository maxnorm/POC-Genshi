import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdmin } from "@/contexts/useAdmin";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ROLES, ROLES_LABELS } from "@/lib/constants/roles";
import { User } from "@/lib/types/User";
import { Skeleton } from "@/components/ui/skeleton";
import AddUserDialog from "../admin/AddUserDialog";
import ModifyUserRolesDialog from "../admin/ModifyUserRolesDialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function TemplateTable() {
  const data = [
    {
      id: 1,
      name: "Pièce",
      status: 1,
    },
  ];

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex gap-2">
          <Button variant={"genshi"}>
            Pièce
          </Button>
          <Button>
            Assemblage
          </Button>
          <Button>
            Équipement
          </Button>
        </div>
        <AddUserDialog />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>Aucun modèles trouvé</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <span className={cn("inline-block shadow-sm text-white text-xs font-bold px-4 py-1 rounded-full",
                      item.status === 1 && "bg-green",
                      item.status === 0 && "bg-red",
                    )}>
                      {item.status === 1 ? "Actif" : "Désactivé"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant={"genshiSimple"} size={"sm"}>
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