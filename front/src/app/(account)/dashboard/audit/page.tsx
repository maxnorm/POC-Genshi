import PageHeader from "@/components/dashboard/PageHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit – GENSHI",
  description: `Audit your inventory.`,
  robots: {
    index: false,
    follow: false,
  },
};

function Audit() {
  return (
    <div className="space-y-6">
      <PageHeader title="Audit" description="Audit your inventory." />
    </div>
  );
}

export default Audit; 