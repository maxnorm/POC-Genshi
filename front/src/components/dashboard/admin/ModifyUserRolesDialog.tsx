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
import useAddUserForm from "@/hooks/forms/useAddUserForm";

function ModifyUserRolesDialog( { userAddress }: { userAddress: string } ) {  
  const [open, setOpen] = useState(false);
  const { 
    newUserAddress, 
    handleAddressChange, 
    newUserRole, 
    handleRoleChange, 
    isSubmitting, 
    error,
    resetForm,
    handle 
  } = useAddUserForm();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      resetForm();
    }
  };

  const handleSubmit = async () => {
    const result = await handle();
    if (result.success) {
      setOpen(false);
    }
  }

  return (
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
            {Object.keys(ROLES).map((role) => (
              <span key={role} className="inline-block bg-genshi-blue-secondary/70 shadow-sm text-white text-xs font-semibold px-2 py-1 rounded-full">
                {ROLES_LABELS[role as keyof typeof ROLES_LABELS]}
              </span>
            ))}
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
              role == "DEFAULT_ADMIN_ROLE" ? null : (
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
            disabled={newUserAddress.trim() === "" || newUserRole === "" || isSubmitting}
            className="w-full bg-genshi-blue-secondary text-white"
          >
            {isSubmitting ? "Ajout en cours..." : "Ajouter"}
          </Button>
        </div>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );  
}

export default ModifyUserRolesDialog;