"use client";

import { useState } from "react";
import { useAdmin } from "@/contexts/useAdmin";
import { toast } from "sonner";

/**
 * Hook to modify user roles in the contract
 * @returns {Object} The form state and the handle function
 */
function useModifyUserRolesForm() { 
  const [newUserRole, setNewUserRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleGrantRole, isPending } = useAdmin();

  const handle = async (userAddress: string) => {
    if (!newUserRole.trim()) {
      setError("Veuillez sélectionner un rôle");
      return { success: false, error: "Veuillez sélectionner un rôle" };
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const result = await handleGrantRole(userAddress, newUserRole);
      console.log(result);
      
      if (result.success) {
        setNewUserRole("");
        toast.success("Rôle ajouté avec succès!");
        return { success: true, hash: result.hash };
      } else {
        const errorMessage = result.error?.message || "Une erreur s'est produite lors de l'ajout du rôle";
        setError(errorMessage);
        toast.error(errorMessage);
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Une erreur s'est produite lors de l'ajout du rôle";
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
    setNewUserRole("");
    clearError();
  }

  const handleRoleChange = (value: string) => {
    setNewUserRole(value);
    if (error) clearError();
  };

  return {
    newUserRole,
    handleRoleChange,
    isSubmitting: isSubmitting || isPending,
    error,
    clearError,
    handle,
    resetForm,
  }
}

export default useModifyUserRolesForm; 