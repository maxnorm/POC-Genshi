import { Metadata } from "next";
import { NFTType } from "@/lib/enums/nftType";
import TemplateItemPage from "@/components/pages/dashboard/template/TemplateItemPage";

interface InventoryItemProps {
  params: Promise<{
    type: string;  
    id: string;
  }>;
}

export async function generateMetadata({ params }: InventoryItemProps): Promise<Metadata> {
  const { type, id } = await params;
  return {
    title: `Templte ${id} – GENSHI`,
    description: `Détails du modèle ${id}`,
  };
}

async function InventoryItem({ params }: InventoryItemProps) {
  const { type, id } = await params;

  console.log(type);
  console.log(id);
  
  return (
    <>
    {type}
    {id}
    </>
  );
}

export default InventoryItem;