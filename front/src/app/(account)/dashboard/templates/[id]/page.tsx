import { Metadata } from "next";
import TemplateItemPage from "@/components/pages/dashboard/template/TemplateItemPage";

interface TemplatePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: TemplatePageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Template ${id} – GENSHI`,
    description: `Détails du modèle ${id}`,
  };
}

async function TemplatePage({ params }: TemplatePageProps) {
  const { id } = await params;

  
  return (
    <TemplateItemPage id={Number(id)} />
  );
}

export default TemplatePage;