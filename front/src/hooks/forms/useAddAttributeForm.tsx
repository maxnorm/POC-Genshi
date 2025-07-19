"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useTemplate } from "@/contexts/useTemplate";
import { AttributeType } from "@/lib/types/Attribute";

/**
 * Hook to add an attribute to a template
 * @returns {Object} The form state and the handle function
 */
function useAddAttributeForm(templateId: number) {
  const [name, setName] = useState("");
  const [attributeType, setAttributeType] = useState<AttributeType>("string");
  const [allowedValues, setAllowedValues] = useState<string[]>([]);
  const [newAllowedValue, setNewAllowedValue] = useState("");
  const [units, setUnits] = useState("");
  const [required, setRequired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addAttribute, getTemplate } = useTemplate();

  const handle = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!name.trim()) {
        throw new Error("Le nom de l'attribut est requis");
      }

      if (attributeType === "enum" && allowedValues.length === 0) {
        throw new Error("Les valeurs autorisées sont requises pour le type enum");
      }

      const result = await addAttribute(templateId, name, attributeType, allowedValues, units, required);
      
      if (result.success) {
        await getTemplate(templateId);
        toast.success("Attribut ajouté avec succès!");
        return { success: true, templateId: templateId };
      } else {
        throw new Error(result.error?.message || "Échec de l'ajout de l'attribut");
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Une erreur s'est produite lors de l'ajout de l'attribut";
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
    setAttributeType("string");
    setAllowedValues([]);
    setNewAllowedValue("");
    setUnits("");
    setRequired(false);
    clearError();
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (error) clearError();
  };

  const handleTypeChange = (value: string) => {
    const type = value as AttributeType;
    if (type) {
      setAttributeType(type);
      if (type !== "enum") {
        setAllowedValues([]);
      }
    } else {
      setError("Type d'attribut invalide");
    }
    if (error) clearError();
  };

  const handleUnitsChange = (value: string) => {
    setUnits(value);
    if (error) clearError();
  };

  const handleRequiredChange = (value: boolean) => {
    setRequired(value);
    if (error) clearError();
  };

  const addAllowedValue = (value: string) => {
    if (value.trim() && !allowedValues.includes(value.trim())) {
      setAllowedValues(prev => [...prev, value.trim()]);
      setNewAllowedValue("");
    }
  };

  const removeAllowedValue = (index: number) => {
    setAllowedValues(prev => prev.filter((_, i) => i !== index));
  };

  return {
    name,
    attributeType,
    allowedValues,
    units,
    required,
    newAllowedValue,  
    setNewAllowedValue,
    handleNameChange,
    handleTypeChange,
    handleUnitsChange,
    handleRequiredChange,
    addAllowedValue,
    removeAllowedValue,
    isSubmitting,
    error,
    clearError,
    handle,
    resetForm,
  };
}

export default useAddAttributeForm; 