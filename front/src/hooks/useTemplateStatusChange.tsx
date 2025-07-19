import { useTemplate } from "@/contexts/useTemplate";
import { toast } from "sonner";
import { useState } from "react";

/**
 * Hook to change the status of a template
 * @param {Object} template - The template to change the status of
 * @returns {Object} The handleStatusButton function and the isStatusChanging state
 */
function useTemplateStatusChange(template: any) {
  const { activateTemplate, deactivateTemplate } = useTemplate();
  const [isStatusChanging, setIsStatusChanging] = useState(false);

  const handleStatusButton = async () => {
    if (isStatusChanging) return;
    
    setIsStatusChanging(true);
    try {
      if (template.status === 0) {
        const result = await activateTemplate(template.id);
        if (result?.success) {    
          toast.success("Modèle activé avec succès");
        } else {
          toast.error("Échec de l'activation du modèle");
        } 
      } else if (template.status === 1) { 
        const result = await deactivateTemplate(template.id);
        if (result?.success) {
          toast.success("Modèle désactivé avec succès");
        } else {
          toast.error("Échec de la désactivation du modèle");
        }
      }
    } catch (error) {
      console.error("Error changing template status:", error);
      toast.error("Une erreur s'est produite lors du changement de statut");
    } finally {
      setIsStatusChanging(false);
    }
  }

  return {
    handleStatusButton,
    isStatusChanging,
  }
}

export default useTemplateStatusChange;