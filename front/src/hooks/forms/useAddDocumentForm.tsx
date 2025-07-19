"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useTemplate } from "@/contexts/useTemplate";

/**
 * Hook to add a document to a template
 * @returns {Object} The form state and the handle function
 */
function useAddDocumentForm(templateId: number) {
  const [name, setName] = useState("");
  const [allowedMimeTypes, setAllowedMimeTypes] = useState<string[]>([]);
  const [required, setRequired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addDocument, getTemplate } = useTemplate();

  const handle = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!name.trim()) {
        throw new Error("Le nom du document est requis");
      }

      if (allowedMimeTypes.length === 0) {
        throw new Error("Au moins un type MIME autorisé est requis");
      }

      const result = await addDocument(templateId, name, allowedMimeTypes, required);
      
      if (result.success) {
        await getTemplate(templateId);
        toast.success("Document ajouté avec succès!");
        return { success: true, templateId: templateId };
      } else {
        throw new Error(result.error?.message || "Échec de l'ajout du document");
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Une erreur s'est produite lors de l'ajout du document";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = () => {  
    setError(null);
  };

  const resetForm = () => {
    setName("");
    setAllowedMimeTypes([]);
    setRequired(false);
    clearError();
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (error) clearError();
  };

  const handleRequiredChange = (value: boolean) => {
    setRequired(value);
    if (error) clearError();
  };

  const addMimeType = (mimeType: {value: string, label: string}) => {
    if (mimeType.value.trim() && !allowedMimeTypes.includes(mimeType.value.trim())) {
      setAllowedMimeTypes(prev => [...prev, mimeType.value.trim()]);
    }
  };

  const removeMimeType = (index: number) => {
    setAllowedMimeTypes(prev => prev.filter((_, i) => i !== index));
  };

  return {
    name,
    allowedMimeTypes,
    required,
    handleNameChange,
    handleRequiredChange,
    addMimeType,
    removeMimeType,
    isSubmitting,
    error,
    clearError,
    handle,
    resetForm,
  };
}

export default useAddDocumentForm;