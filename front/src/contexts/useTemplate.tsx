"use client";

import { createContext, useContext, useEffect, useCallback, useState, useRef } from "react";
import useFetchTemplates from "@/hooks/useFetchTemplates";
import useWrite from "@/hooks/useWriteContract";
import { templateRegistryAddress, templateRegistryABI } from "@/lib/constants/contracts/templateRegistry";
import { publicClient } from "@/lib/client";
import useCurrentTemplate from "@/hooks/useCurrentTemplate";
import { AttributeDefinition } from "@/lib/types/Attribute";
import { DocumentDefinition } from "@/lib/types/Document";
import { TemplateView } from "@/lib/types/Template";


const TemplateContext = createContext<any>(null);

/**
 * TemplateProvider component
 * This is a context to manage the template data
 * @param {*} children The children components
 * @returns {Object} The TemplateProvider component
 */
const TemplateProvider = ({ children }: { children: React.ReactNode }) => {
  const { templates, isLoadingTemplates, refetchAll, lastCreatedTemplateId } = useFetchTemplates();
  const { write, isSuccess, isPending, error, hash } = useWrite(templateRegistryAddress, templateRegistryABI);
  const [pendingTransaction, setPendingTransaction] = useState<{ resolve: (value: any) => void; reject: (reason: any) => void } | null>(null);
  const { currentTemplate, setCurrentTemplate, setAttributes, setDocuments } = useCurrentTemplate();

  useEffect(() => {
    if (pendingTransaction && (isSuccess || error)) {
      if (isSuccess) {
        refetchAll();
        pendingTransaction.resolve({ success: true, hash, templateId: lastCreatedTemplateId });
      } else if (error) {
        pendingTransaction.reject({ success: false, error });
      }
      setPendingTransaction(null);
    }
  }, [isSuccess, error, pendingTransaction, hash, templates, refetchAll ]);

  const handleAddTemplate = async (name: string, nftAddress: string) => {
    try {
      await write("createTemplate", [nftAddress, name]);
      return new Promise((resolve, reject) => { 
        setPendingTransaction({ resolve, reject });
      });
    } catch (error) {
      return { success: false, error };
    }
  }

  const addAttribute = async (templateId: number, name: string, attributeType: string, allowedValues: string[], units: string, required: boolean) => {
    try {
      const attributeDefinition = {
        name: name,
        attributeType: attributeType,
        allowedValues: allowedValues,
        units: units,
        required: required
      };
      
      await write("addAttribute", [templateId, name, attributeDefinition]);
      return new Promise((resolve, reject) => { 
        setPendingTransaction({ resolve, reject });
      });
    } catch (error) {
      return { success: false, error };
    }
  }

  const addDocument = async (templateId: number, name: string, allowedMimeTypes: string[], required: boolean) => {
    try {
      const documentDefinition = {
        name: name,
        allowedMimeTypes: allowedMimeTypes,
        required: required
      };
      
      await write("addDocument", [templateId, name, documentDefinition]);
      return new Promise((resolve, reject) => { 
        setPendingTransaction({ resolve, reject });
      });
    } catch (error) {
      return { success: false, error };
    }
  }

  const activateTemplate = async (templateId: number) => {
    try {
      await write("activateTemplate", [templateId]);
      return new Promise((resolve, reject) => { 
        setPendingTransaction({ 
          resolve: async (result) => {
            if (currentTemplate?.id === templateId) {
              await getTemplate(templateId);
            }
            resolve(result);
          }, 
          reject 
        });
      });
    } catch (error) {
      console.error("Failed to activate template:", error);
      return { success: false, error };
    }
  }

  const deactivateTemplate = async (templateId: number) => {
    console.log("Deactivating template:", templateId);
    try {
      await write("deactivateTemplate", [templateId]);  
      return new Promise((resolve, reject) => { 
        setPendingTransaction({ 
          resolve: async (result) => {
            if (currentTemplate?.id === templateId) {
              await getTemplate(templateId);
            }
            resolve(result);
          }, 
          reject 
        });
      });
    } catch (error) {
      console.error("Failed to deactivate template:", error);
      return { success: false, error };
    }
  }

  const getTemplate = async (id: number): Promise<TemplateView | null> => {
    try {
      const templateData = await publicClient.readContract({
        address: templateRegistryAddress,
        abi: templateRegistryABI,
        functionName: "getTemplate",
        args: [id]
      }) as TemplateView;
      setCurrentTemplate(templateData);
      const attributes = await getTemplateAttributes(templateData);
      setAttributes(attributes);
      const documents = await getTemplateDocuments(templateData);
      setDocuments(documents);
      return templateData;
    } catch (error) {
      return null;
    }
  }

  const getTemplateAttributes = async (templateData: TemplateView): Promise<AttributeDefinition[]> => {
    try {
      const attributes = await Promise.all(
        templateData.attributeKeys.map(async (key: string ) => {
          try {
            const attribute = await publicClient.readContract({
              address: templateRegistryAddress,
              abi: templateRegistryABI,
              functionName: "getAttribute", 
              args: [templateData.id, key]
            }) as AttributeDefinition;
            return {
              key: key,
              ...attribute
            };
          } catch (error) {
            return null;
          }
        })
      );

      const validAttributes = attributes.filter((attr) => attr !== null);
      return validAttributes;
    } catch (error) {
      return [];
    }
  }

  const getTemplateDocuments = async (templateData: TemplateView): Promise<DocumentDefinition[]> => {
    try {
      const documents = await Promise.all(
        templateData.documentKeys.map(async (key: string) => {
          try {
            const document = await publicClient.readContract({
              address: templateRegistryAddress,
              abi: templateRegistryABI,
              functionName: "getDocument",
              args: [templateData.id, key]
            }) as DocumentDefinition;
            return {
              key: key,
              ...document
            };
          } catch (error) {
            console.error(`Failed to get document ${key}:`, error);
            return null;
          }
        })
      );
      const validDocuments = documents.filter((doc) => doc !== null);
      return validDocuments;
    } catch (error) {
      return [];
    }
  }

  const exposed = {
    currentTemplate,
    templates,
    handleAddTemplate,
    isPending,
    getTemplate,
    getTemplateAttributes,
    getTemplateDocuments,
    addAttribute,
    addDocument,
    activateTemplate,
    deactivateTemplate
  };

  return (
    <TemplateContext.Provider value={exposed}>
      {children}
    </TemplateContext.Provider>
  );
};

const useTemplate = () => useContext(TemplateContext);

export { TemplateContext, TemplateProvider, useTemplate };