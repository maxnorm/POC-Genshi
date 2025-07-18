import { PageHeader } from "@/components/dashboard/PageHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";

function MainDashboardPage() {

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

export default MainDashboardPage;