import { PageHeader } from "@/components/dashboard/PageHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory – GENSHI",
  description: `Manage your inventory.`,
  robots: {
    index: false,
    follow: false,
  },
};

function Inventory() {
  return (
    <div className="space-y-6">
      <PageHeader title="Inventaire" description="Gérez votre inventaire de NFT." />
    </div>
  );
}

export default Inventory;