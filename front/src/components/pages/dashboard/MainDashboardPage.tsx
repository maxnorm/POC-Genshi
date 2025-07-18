import { PageHeader } from "@/components/dashboard/PageHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import { Package, FileText, Users, Shield } from "lucide-react";

function MainDashboardPage() {
  const stats = [
    {
      title: "Total NFTs",
      value: "1,234",
      change: "+20.1% from last month",
      icon: Package,
    },
    {
      title: "Templates",
      value: "56",
      change: "+5 new this month",
      icon: FileText,
    },
    {
      title: "Active Users",
      value: "89",
      change: "+12% from last week",
      icon: Users,
    },
    {
      title: "Security Score",
      value: "98%",
      change: "Excellent security rating",
      icon: Shield,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Tableau de bord" description="Bienvenue sur votre tableau de bord GENSHI." />
      <DashboardStats stats={stats} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
}

export default MainDashboardPage;