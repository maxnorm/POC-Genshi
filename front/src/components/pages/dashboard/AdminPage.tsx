'use client';

import { PageHeader } from "@/components/dashboard/PageHeader";
import UsersTable from "@/components/dashboard/admin/UsersTable";
import { useSidebar } from "@/components/ui/sidebar";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { cn } from "@/lib/utils";
import { Users, ShieldCheck, ShieldX } from "lucide-react";
import { useAdmin } from "@/contexts/useAdmin";

function AdminPage() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const { allUsers,  roleGrantedCount, roleRevokedCount } = useAdmin();

  const stats = [
    {
      title: "Utilisateurs",
      value: allUsers.length.toString(),
      change: "au total sur la plateforme",
      icon: Users,
    },
    {
      title: "Rôles accordés",
      value: roleGrantedCount.toString(),
      change: "au total sur la plateforme",
      icon: ShieldCheck,
    },
    {
      title: "Rôles retirés",
      value: roleRevokedCount.toString(),
      change: "au total sur la plateforme",
      icon: ShieldX,
    }
  ];

  return (
    <div className={cn(
      "space-y-6",
      isCollapsed ? "w-5/6 sm:w-2/3" : "w-full"
    )}>
      <PageHeader title="Admin" description="Gérez la plateforme GENSHI" /> 
      <DashboardStats stats={stats} />
      <div className="grid gap-4">
        <UsersTable />
      </div>
    </div>
  );
}

export default AdminPage;