"use client";

import { useState } from "react";
import { toast } from "sonner";
import { NFTType, parseNFTTypeToAddress } from "@/lib/enums/nftType";
import { useTemplate } from "@/contexts/useTemplate";

/**
 * Hook to add a template to the contract
 * @returns {Object} The form state and the handle function
 */
function useAddTemplateForm() { 
  const { handleAddTemplate } = useTemplate();
  const [name, setName] = useState("");
  const [nftType, setNftType] = useState<NFTType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handle = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const nftAddress = parseNFTTypeToAddress(nftType as NFTType);
      const result = await handleAddTemplate(name, nftAddress);
      
      if (result.success) {
        toast.success("Modèle ajouté avec succès!");
        return { success: true, hash: result.hash, templateId: result.templateId };
      } else {
        const errorMessage = result.error?.message || "Une erreur s'est produite lors de l'ajout du modèle";
        toast.error(errorMessage);
        setError(errorMessage);
        return { success: false, error: result.error };
      }
    } catch (error: any) {  
      const errorMessage = error?.message || "Une erreur s'est produite lors de l'ajout du modèle";
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
    setName("");  
    setNftType(null);
    clearError();
  }

  const handleTypeChange = (value: string) => {
    const type = value as NFTType;
    if (type) {
      setNftType(type);  
    } else {
      setError("Type de NFT invalide");
    }
    if (error) clearError();
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (error) clearError();
  };

  return {
    name,
    nftType,
    handleTypeChange,
    handleNameChange,
    isSubmitting,
    error,
    clearError,
    handle,
    resetForm,
  }
}

export default useAddTemplateForm;