"use client";

import { createContext, useContext, useEffect, useCallback, useState, useRef } from "react";
import useFetchTemplates from "@/hooks/useFetchTemplates";
import useWrite from "@/hooks/useWriteContract";
import { templateRegistryAddress, templateRegistryABI } from "@/lib/constants/contracts/templateRegistry";

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

  useEffect(() => {
    if (pendingTransaction && (isSuccess || error)) {
      if (isSuccess) {
        refetchAll();
        pendingTransaction.resolve({ success: true, hash });
      } else if (error) {
        pendingTransaction.reject({ success: false, error });
      }
      setPendingTransaction(null);
    }
  }, [isSuccess, error, pendingTransaction, hash ]);

  const handleAddTemplate = async (name: string, nftAddress: string) => {
    console.log("Adding template:", name, nftAddress);
    try {
      await write("createTemplate", [nftAddress, name]);
      return new Promise((resolve, reject) => { 
        setPendingTransaction({ resolve, reject });
      });
    } catch (error) {
      console.error("Failed to add template:", error);
      return { success: false, error };
    }
  }

  const exposed = {
    templates,
    handleAddTemplate,
    isPending,
  };

  return (
    <TemplateContext.Provider value={exposed}>
      {children}
    </TemplateContext.Provider>
  );
};

const useTemplate = () => useContext(TemplateContext);

export { TemplateContext, TemplateProvider, useTemplate };