import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdmin } from "@/contexts/useAdmin";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ROLES, ROLES_LABELS } from "@/lib/constants/roles";
import { User } from "@/lib/types/User";
import { Skeleton } from "@/components/ui/skeleton";
import AddUserDialog from "./AddUserDialog";
import ModifyUserRolesDialog from "./ModifyUserRolesDialog";

function UsersTable() {
  const { allUsers, isLoadingUser } = useAdmin();
  const roleKeys = Object.keys(ROLES);

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-2">
          <CardTitle>Gestion des rôles</CardTitle>
          <CardDescription>
            Gérez les utilisateurs et leurs permissions
          </CardDescription>
        </div>
        <AddUserDialog />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Adresse</TableHead>
              <TableHead>Rôles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingUser ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-16" />
                  </TableCell>
                </TableRow>
              ))
            ) : allUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>Aucun utilisateur trouvé</TableCell>
              </TableRow>
            ) : (
              allUsers.map((user: User) => (
                <TableRow key={user.address}>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {roleKeys.filter((role) => user.roles[role]).map((role) => (
                        <span
                          key={role}
                          className="inline-block bg-genshi-blue-secondary/70 shadow-sm text-white text-xs font-semibold px-2 py-1 rounded-full"
                        >
                          {ROLES_LABELS[role as keyof typeof ROLES_LABELS]}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ModifyUserRolesDialog userAddress={user.address} />
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

export default UsersTable;