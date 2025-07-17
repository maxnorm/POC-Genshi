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
      <PageHeader title="Inventory" description="Manage your inventory." />
    </div>
  );
}

export default Inventory;