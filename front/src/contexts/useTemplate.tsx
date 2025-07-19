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
import { useWaitForTransactionReceipt } from "wagmi"
import { decodeEventLog } from "viem"


const TemplateContext = createContext<any>(null);

/**
 * TemplateProvider component
 * This is a context to manage the template data
 * @param {*} children The children components
 * @returns {Object} The TemplateProvider component
 */
const TemplateProvider = ({ children }: { children: React.ReactNode }) => {
  const { templates, isLoadingTemplates, refetchAll } = useFetchTemplates();
  const { write, isSuccess, isPending, error, hash } = useWrite(templateRegistryAddress, templateRegistryABI);
  const [pendingTransaction, setPendingTransaction] = useState<{ resolve: (value: any) => void; reject: (reason: any) => void } | null>(null);
  const { currentTemplate, setCurrentTemplate, setAttributes, setDocuments } = useCurrentTemplate();

  const { data: receipt } = useWaitForTransactionReceipt({
    hash: hash
  });

  const extractTemplateIdFromReceipt = (receipt: any): number | null => {
    if (!receipt || !receipt.logs) {
      return null;
    }
    
    try {
      for (const log of receipt.logs) {
        if (log.address.toLowerCase() === templateRegistryAddress.toLowerCase()) {
          try {
            const decodedLog = decodeEventLog({
              abi: templateRegistryABI,
              data: log.data,
              topics: log.topics,
            });
            
            if (decodedLog.eventName === 'Template_Created') {
              const templateId = Number((decodedLog.args as any).templateId);
              return templateId;
            }
          } catch (decodeError) {
            continue;
          }
        }
      }
    } catch (error) {
      console.error("Error extracting template ID from receipt:", error);
    }
    
    return null;
  };

  useEffect(() => {
    if (pendingTransaction && (isSuccess || error)) {
      if (isSuccess && receipt) {
        refetchAll();
        
        const templateId = extractTemplateIdFromReceipt(receipt);
        
        pendingTransaction.resolve({ 
          success: true, 
          hash, 
          templateId: templateId || undefined 
        });
      } else if (error) {
        pendingTransaction.reject({ success: false, error });
      }
      setPendingTransaction(null);
    }
  }, [isSuccess, error, pendingTransaction, hash, receipt, refetchAll]);

  const handleAddTemplate = async (name: string, nftAddress: string) => {
    try {
      await write("createTemplate", [nftAddress, name]);
      return new Promise((resolve, reject) => { 
        setPendingTransaction({ resolve, reject });
      });
    } catch (error) {
      console.error("Error in handleAddTemplate:", error);
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
      return { success: false, error };
    }
  }

  const deactivateTemplate = async (templateId: number) => {
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