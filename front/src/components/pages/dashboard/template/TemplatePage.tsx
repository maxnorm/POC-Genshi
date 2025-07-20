'use client';

import PageHeader from "@/components/dashboard/PageHeader";
import TemplateTable from "@/components/dashboard/template/TemplateTable";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { Package, Layers, Settings, CheckCircle } from "lucide-react";
import PageWrapper from "@/components/dashboard/PageWrapper";
import { useTemplate } from "@/contexts/useTemplate";
import { Template } from "@/hooks/templates/useTemplateFilter";

function TemplatePage() {
  const { templates } = useTemplate();

  const pieceTemplates = templates.filter((t: Template) => t.type === 'Pièce');
  const assemblyTemplates = templates.filter((t: Template) => t.type === 'Assemblage');
  const equipmentTemplates = templates.filter((t: Template) => t.type === 'Équipement');
  const activeTemplates = templates.filter((t: Template) => t.status === 1);

  const stats = [
    {
      title: "Modèles Actifs",
      value: activeTemplates.length.toString(),
      change: "modèles disponibles pour création",
      icon: CheckCircle,
    },
    {
      title: "Modèles de Pièces",
      value: pieceTemplates.length.toString(),
      change: "modèles pour composants individuels",
      icon: Package,
    },
    {
      title: "Modèles d'Assemblage",
      value: assemblyTemplates.length.toString(),
      change: "modèles pour assemblages composables",
      icon: Layers,
    },
    {
      title: "Modèles d'Équipement",
      value: equipmentTemplates.length.toString(),
      change: "modèles pour équipements",
      icon: Settings,
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