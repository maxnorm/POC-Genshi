import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLES, ROLES_LABELS } from "@/lib/constants/roles";  
import useAddUserForm from "@/hooks/forms/useAddUserForm";

function AddUserDialog() {
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="genshiSimple" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" />
          {"Ajouter un utilisateur"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[400px]">
        <DialogHeader>
          <DialogTitle>{"Ajouter un utilisateur"}</DialogTitle>
          <DialogDescription className="text-black">
            {"Entrez l'adresse de l'utilisateur que vous souhaitez ajouter"}
          </DialogDescription>
        </DialogHeader>
        <Input
          id="address"
          placeholder="0x..."
          value={newUserAddress}
          onChange={handleAddressChange}
          disabled={isSubmitting}
        />
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
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={() => handleSubmit()} 
            disabled={newUserAddress.trim() === "" || newUserRole === "" || isSubmitting}
            className="w-full bg-genshi-blue-secondary text-white"
          >
            {isSubmitting ? "Transaction en cours..." : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddUserDialog;