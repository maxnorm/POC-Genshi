import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLES, ROLES_LABELS } from "@/lib/constants/roles";  
import useModifyUserRolesForm from "@/hooks/forms/useModifyUserRolesForm";
import { useAdmin } from "@/contexts/useAdmin";
import LoadingOverlay from "@/components/LoadingOverlay";

function ModifyUserRolesDialog( { userAddress }: { userAddress: string } ) {  
  const [open, setOpen] = useState(false);
  const { allUsers } = useAdmin();

  const { 
    newUserRole, 
    handleRoleChange, 
    isSubmitting, 
    error,
    resetForm,
    handle 
  } = useModifyUserRolesForm();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      resetForm();
    }
  };

  const handleSubmit = async () => {
    const result = await handle(userAddress);
    if (result.success) {
      setOpen(false);
    }
  }

  return (
    <>  
    <LoadingOverlay 
    isVisible={isSubmitting}
    message="Modification des rôles en cours..."
    />
    <Dialog open={open} onOpenChange={handleOpenChange} >
      <DialogTrigger asChild>
        <Button variant="genshiSimple" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" />
          {"Modifier ces rôles"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[600px]">
        <DialogHeader>
          <DialogTitle>
            <span className="text-genshi-blue-secondary">{`Modifier les rôles de l'utilisateur`}</span>
          </DialogTitle>
          <DialogDescription className="text-black">
            {`${userAddress}`}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2"> 
          <DialogTitle>
            {`Rôles actuels`}
          </DialogTitle>
          <div className="flex flex-wrap gap-2">
            {(() => {
              const user = allUsers.find((u: any) => u.address.toLowerCase() === userAddress.toLowerCase());
              if (!user) {
                return <span className="text-gray-500">Aucun rôle trouvé</span>;
              }
              
              const activeRoles = Object.entries(user.roles).filter(([_, hasRole]) => hasRole);
              if (activeRoles.length === 0) {
                return <span className="text-gray-500">Aucun rôle actif</span>;
              }
              
              return activeRoles.map(([role, _]) => (
                <span key={role} className="inline-block bg-genshi-blue-secondary/70 shadow-sm text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {ROLES_LABELS[role as keyof typeof ROLES_LABELS]}
                </span>
              ));
            })()}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <DialogTitle>
            {`Ajouter un rôle`}
          </DialogTitle>
          <Select value={newUserRole} onValueChange={handleRoleChange} disabled={isSubmitting}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez un rôle" />
            </SelectTrigger>
          <SelectContent>
            {Object.keys(ROLES).map((role) => (
              role === "DEFAULT_ADMIN_ROLE" ? null : (
                <SelectItem key={role} value={role}>
                  {ROLES_LABELS[role as keyof typeof ROLES_LABELS]}
                </SelectItem>
              )
            ))}
          </SelectContent>
        </Select>
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
        </div>
        <div className="flex flex-col gap-2">
          <Button 
            type="submit" 
            onClick={() => handleSubmit()} 
            className="w-full bg-genshi-blue-secondary text-white"
            disabled={isSubmitting || newUserRole === ""}
          >
            {isSubmitting ? "Modification en cours..." : "Modifier"}
          </Button>
        </div>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );  
}

export default ModifyUserRolesDialog;