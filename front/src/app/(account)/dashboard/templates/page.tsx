import { PageHeader } from "@/components/dashboard/PageHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Templates – GENSHI",
  description: `Manage your templates.`,
  robots: {
    index: false,
    follow: false,
  },
};

function Templates() {
  return (
    <div className="space-y-6">
      <PageHeader title="Modèles" description="Gérez vos modèles de données" />
    </div>
  );
}

export default Templates;