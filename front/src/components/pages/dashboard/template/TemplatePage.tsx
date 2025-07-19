'use client';

import PageHeader from "@/components/dashboard/PageHeader";
import TemplateTable from "@/components/dashboard/template/TemplateTable";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { FileText } from "lucide-react";
import PageWrapper from "@/components/dashboard/PageWrapper";
import { useTemplate } from "@/contexts/useTemplate";

function TemplatePage() {
  const { templates } = useTemplate();

  const stats = [
    {
      title: "Modèles de NFT",
      value: templates.length.toString(),
      change: "au total sur la plateforme",
      icon: FileText,
    }
  ];

  return (
    <PageWrapper>
      <PageHeader title="Modèles" description="Gérez les modèles de données associer au NFT" /> 
      <DashboardStats stats={stats} />
      <div className="grid gap-4">
        <TemplateTable />
      </div>
    </PageWrapper>
  );
}

export default TemplatePage;