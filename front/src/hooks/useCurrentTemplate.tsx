"use client";

import { useState } from "react";
import { DocumentDefinition } from "@/lib/types/Document";
import { AttributeDefinition } from "@/lib/types/Attribute";

function useCurrentTemplate() { 
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);

  const setAttributes = (attributes: AttributeDefinition[]) => {
    setCurrentTemplate((prev: any) => ({
      ...prev, 
      attributes: attributes
    }));
  }

  const setDocuments = (documents: DocumentDefinition[]) => {
    setCurrentTemplate((prev: any) => ({
      ...prev, 
      documents: documents
    }));
  }

  return {currentTemplate, setCurrentTemplate, setAttributes, setDocuments};
}

export default useCurrentTemplate;