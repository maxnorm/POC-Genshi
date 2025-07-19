'use client';

import { PageHeader } from "@/components/dashboard/PageHeader";
import PageWrapper from "@/components/dashboard/PageWrapper";
import { useEffect } from "react";
import TemplateInfoCard from "@/components/dashboard/template/TemplateInfoCard";
import AttributesCard from "@/components/dashboard/template/attribute/AttributesCard";
import DocumentCard from "@/components/dashboard/template/document/DocumentCard";
import { useTemplate } from "@/contexts/useTemplate";

function TemplateItemPage({ id }) {
  const { currentTemplate, getTemplate } = useTemplate();

  useEffect(() => {
    if (id) {
      getTemplate(id);
    }
  }, [id]);

  if (!currentTemplate) {
    return <div>Modèle non trouvé</div>;
  }

  return (
    <PageWrapper>
      <PageHeader title={`Modèle #${id}`} description="Détails du modèle" />
        <TemplateInfoCard template={currentTemplate} />
        <AttributesCard template={currentTemplate} />
        <DocumentCard template={currentTemplate} />
    </PageWrapper>
  );
}

export default TemplateItemPage;