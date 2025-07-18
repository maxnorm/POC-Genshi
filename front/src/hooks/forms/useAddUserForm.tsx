"use client";

import { useState } from "react";
import { useAdmin } from "@/contexts/useAdmin";
import { toast } from "sonner";

function useAddUserForm() { 
  const [newUserAddress, setNewUserAddress] = useState("");
  const [newUserRole, setNewUserRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleAddUser, isPending } = useAdmin();

  const handle = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await handleAddUser(newUserAddress, newUserRole);
      
      if (result.success) {
        setNewUserAddress("");
        setNewUserRole("");
        toast.success("Utilisateur ajouté avec succès!");
        return { success: true, hash: result.hash };
      } else {
        const errorMessage = result.error?.message || "Une erreur s'est produite lors de l'ajout de l'utilisateur";
        setError(errorMessage);
        toast.error(errorMessage);
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Une erreur s'est produite lors de l'ajout de l'utilisateur";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  }

  const clearError = () => {
    setError(null);
  };

  const resetForm = () => {
    setNewUserAddress("");
    setNewUserRole("");
    clearError();
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUserAddress(e.target.value);
    if (error) clearError();
  };

  const handleRoleChange = (value: string) => {
    setNewUserRole(value);
    if (error) clearError();
  };

  return {
    newUserAddress,
    handleAddressChange,
    newUserRole,
    handleRoleChange,
    isSubmitting: isSubmitting || isPending,
    error,
    clearError,
    handle,
    resetForm,
  }
}

export default useAddUserForm;