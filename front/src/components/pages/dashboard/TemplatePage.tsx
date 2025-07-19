'use client';

import { PageHeader } from "@/components/dashboard/PageHeader";
import TemplateTable from "@/components/dashboard/template/TemplateTable";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { Users, ShieldCheck, ShieldX } from "lucide-react";
import { useAdmin } from "@/contexts/useAdmin";
import { useUser } from "@/contexts/useUser";
import PageWrapper from "@/components/dashboard/PageWrapper";
import { Skeleton } from "@/components/ui/skeleton";

function TemplatePage() {
  const { hasRole, isLoadingRoles } = useUser();
  const adminContext = useAdmin();

  // Show loading state while determining user role
  if (isLoadingRoles) {
    return (
      <PageWrapper>
        <PageHeader title="Modèles" description="Gérez les modèles de données associer au NFT" />
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </PageWrapper>
    );
  }

  // Only access admin context if user has admin role
  if (!hasRole("DEFAULT_ADMIN_ROLE")) {
    return (
      <PageWrapper>
        <PageHeader title="Modèles" description="Gérez les modèles de données associer au NFT" />
        <div className="text-center py-8">
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </PageWrapper>
    );
  }

  const { allUsers, roleGrantedCount, roleRevokedCount } = adminContext;

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
    <PageWrapper>
      <PageHeader title="Modèles" description="Gérez les modèles de données associer au NFT" /> 
      <DashboardStats stats={stats} />
      <div className="grid gap-4">
        <TemplateTable />
      </div>
    </PageWrapper>
  );
}

export default TemplatePage;