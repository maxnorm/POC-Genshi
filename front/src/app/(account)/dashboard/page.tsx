import { PageHeader } from "@/components/dashboard/PageHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard – GENSHI",
  description: `Welcome to your GENSHI traceability dashboard.`,
  robots: {
    index: false,
    follow: false,
  },
};

function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="Tableau de bord" description="Bienvenue sur votre tableau de bord GENSHI." />
      <DashboardStats />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
}

export default Dashboard;